using LinqToDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itall;

namespace My.App.Calendars
{
    /// <summary>
    /// Сервис для синхронизации календарей
    /// </summary>
    public class CalendarSyncJob : AppJob
    {
        /// <summary>
        /// Блокировка сервиса
        /// </summary>
        static byte _Locks = 0;

        public Guid? CalendarId; // for debug

        /// <summary>
        /// Провайдер
        /// </summary>
        public string Provider;


        /// <summary>
        /// Смотрим только обновления, или все
        /// </summary>
        public bool UpdatesOnly = false;

        private class Info
        {
            public DateTime Start;
            public DateTime End;
            public int N = 0;
            public int Secs;
            public string Error = "";
            public string Provider;
        }

        static List<Info> _Infos = new List<Info>();
        

        public static string Getinfo()
        {
            var sb = $"Sync Job info: [total {_Infos.Count}], locks: {_Locks}\n".ToBuilder();

            var infos = _Infos
                .Where(info => info.N > 0)
                .Take(100)
                .ToList(); // чтобы не сбиваться

            foreach (var info in infos)
            {
                sb.AppendLine($"{info.Start}: {info.Secs} sec, {info.N} calendars {info.Provider}"); //   , error: {info.Error}
            }

            return sb.ToString();
        }

        public override async Task RunAsync()
        {
            //// кэшируем модули
            //var modules = new Dictionary<string,Modules.CalendarSyncModule>
            //{
            //    {"Google", new Modules.GoogleCalendarSyncModule() },
            //};

            if (_Locks > 0)
            {
                --_Locks; // уменьшаем счетчик блокировок
                return;
            }

            var info = new Info 
            { 
                Start = DateTime.Now, 
                Provider = Provider 
            };

            try
            {

                _Locks += 3;  // делаем запас в 3 блокировки
                _Infos.Insert(0, info);

                using var db = new App.DbConnection();

                var qcalendars = db.Calendars
                    .LoadWith(c => c.Room.Base.Domain)
                    .WhereIf( string.IsNullOrWhiteSpace(Provider)
                        , c => c.Provider != null
                        , c => c.Provider == Provider)  /// фильтр по провайдеру
                    .WhereIf( CalendarId != null, c => c.Id == CalendarId )  /// исключительно для отладки
#if !DEBUG111
                    .GetActuals()
                    .WhereIf( UpdatesOnly, c => c.Updates > 0 )  /// исключительно для отладки
                    .WhereIf( UpdatesOnly, c => c.WatchStatus == WatchStatus.Active)  /// исключительно для отладки
#endif
                    .Where(c => c.RoomId != null)
                    .Where(c => c.Domain.Status != Partners.DomainStatus.Locked)
                    .Where(c => c.Domain.IsArchive == false)
                    .Where(c => c.JsonContent != null);

                if (UpdatesOnly)
                    qcalendars = qcalendars.OrderByDescending(c => c.Updates); // сортируем, чтобы вверху были самые обновляемые, и успели их обработать
                else
                    qcalendars = qcalendars.OrderBy(c => c.MinDate); // сортируем, чтобы вверху были самые старые, и успели их обработать

                var calendars = await qcalendars.ToListAsync();

                if (calendars.Count == 0) return;   // делать нам здесь больше нечего 



                //foreach (var calendar in calendars)
                // решили отказаться https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/38989/
                // Parallel.ForEach(calendars, calendar =>    // see  https://habr.com/ru/post/135942/ , task: https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/37771/

                var max_parallel = Configs.Get("calendar-max-parallel")?.AsInt ?? 10;
                calendars.AsParallel().WithExecutionMode(ParallelExecutionMode.ForceParallelism).WithDegreeOfParallelism(max_parallel).ForAll(calendar => 
                {
                    using var caldb = new DbConnection();  // добавляем еще 1 коннект
                    var svc = new CalendarSyncService { Db = caldb};

                    //var calendar = room.Calendar;
                    System.Diagnostics.Debug.WriteLine($"calendar start: {calendar.Name}");

                    try
                    {
                        var args = new SyncArgs { Calendar = calendar, LastOnly = UpdatesOnly };
                        var res = svc.SyncRoomAsync(args).Result;
                        if (res) info.N++;
                    }
                    catch (Exception x)
                    {
                        //sb.AppendLine($"Комната {room.Name}: {room.Base.Name}, ошибка: {x.Message}");
                        var err = $"calendar sync error for room '{calendar?.Room.Name}': {calendar.Id}, {calendar.Name}: " + x.Message;
                        App.Logger?.LogError(err);
                        info.Error += err + "/n";

                        var resp = (x.InnerException as System.Net.WebException)?.Response as System.Net.HttpWebResponse;
                        //if ( ERRORS.Contains(resp?.StatusCode))
                        //if( (resp?.StatusCode & (System.Net.HttpStatusCode.BadRequest | System.Net.HttpStatusCode.Unauthorized)) > 0 )
                        if (resp?.StatusCode == System.Net.HttpStatusCode.BadRequest ||
                                resp?.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                        {
                            // записываем изменения в БД
                            checkAttempts(calendar, x.Message);
                            //db.Save(calendar);
                            db.Finds(calendar)
                                .Set(c => c.Attempts, calendar.Attempts)
                                .Set(c => c.IsArchive, calendar.IsArchive)
                                .Update();
                        }

                    }

                    System.Diagnostics.Debug.WriteLine($"calendar end: {calendar.Name}");
                });

            }
            catch (Exception x)
            {
                FileHelper.LogFile(x.Message, "calendars");
                throw;
            }
            finally
            {
                _Locks = 0;  // сбрасываем все блокировки
                info.End = DateTime.Now;
                info.Secs = Convert.ToInt32((info.End - info.Start).TotalSeconds);
            }

        }




        /// <summary>
        /// Проверяем число попыток и отправки уведомления
        /// </summary>
        void checkAttempts( Calendar calendar, string err )
        {
            if (calendar.Attempts == 0)  // в первый раз столкнулись с ошибкой - выставляем число попыток
            {
                var cfg = Configs.Get("calendar-max-attempts");
                var max_attempts = cfg?.AsInt ?? 1;
                calendar.Attempts = max_attempts;
            }

            if (calendar.Attempts == 1)  // сразу проверяем, даже если это 1-я ошибка
            {
                // блокировка календаря
                calendar.Attempts = 0;
                calendar.IsArchive = true;
                CalendarHelper.NotifyArchive( calendar, err );
            }
            else
            {
                // изменяем попытки у календаря
                calendar.Attempts--;
            }
        }

    }
}



#region Misc

//var rooms = await db.Rooms
//   .LoadWith(x => x.Calendar)
//   //.LoadWith(x => x.Domain)
//   .GetDomainActuals()
//   .GetActuals()
//   .Where(x => x.CalendarId != null)
//   .Where(x => x.Calendar.Provider != null && x.Calendar.Provider != "")
//   .Where(x => x.Calendar.IsArchive == null || x.Calendar.IsArchive == false)
//   .ToListAsync();

//if (rooms.Count == 0) return;
//var services = Services.Get<CalendarService>().ToArray();
//var svc = new CalendarService();



//static readonly System.Net.HttpStatusCode?[] ERRORS = { System.Net.HttpStatusCode.BadRequest, System.Net.HttpStatusCode.Unauthorized };


//var module = modules[room.Calendar.Type];
//await module.SyncRoomAsync(db, room, calendar);
//var services = new CalendarService[]
//{
//    new Google.GoogleService(),
//    new Outlook.OutlookService()
//};

//foreach (var svc in services)

                            //if (!svc.Allow(calendar)) continue;

#endregion