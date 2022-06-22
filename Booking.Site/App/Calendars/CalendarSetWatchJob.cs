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
    /// Сервис для управления PUSH уведомлениями календарей
    /// </summary>
    public class CalendarSetWatchJob : AppJob
    {
        public Guid? CalendarId; // for debug

        public override async Task RunAsync()
        {
            using var db = new App.DbConnection();

            checkExpires( db );

            // получаем список календарей, по которым может потребоваться изменение push уведомлений
            var PushedStates = new []{ WatchStatus.Active, WatchStatus.Stop};
            var calendars = await db.Calendars
                .LoadWith(cl => cl.Domain)
                .LoadWith(cl => cl.Room.Domain)
                .WhereIf(CalendarId != null, cl => cl.Id == CalendarId)  /// исключительно для отладки
                .Where(cl => PushedStates.Contains(cl.WatchStatus))
                .Where(cl => cl.RoomId != null)
                .Where(cl => cl.Provider != null)
                .ToListAsync();

            var svc = new CalendarSyncService { Db = db };
            foreach (var calendar in calendars)
            {
                await svc.SetWatchAsync(calendar);
            }

        }


        /// <summary>
        /// Проверка просроченности токена
        /// </summary>
        void checkExpires( DbConnection db )
        {
            var cfg = Configs.Get("push-watch", true);
            var date = cfg.AsDate ?? DateTime.MinValue;

            const long EXPIRES_LIMIT_DAYS = 5;

            var days = (DateTime.Now - date).TotalDays;
            if (days > EXPIRES_LIMIT_DAYS)
            {
                // сбрасываем флаг в стоп, чтобы можно было перепривязаться
                db.Calendars
                    .GetActuals()
                    .Where(c => c.WatchStatus == WatchStatus.Active)
                    .Where(cl => cl.RoomId != null)
                    .Where(cl => cl.Provider != null)
                    .Set(c => c.WatchStatus, WatchStatus.Stop)
                    .Update();

                cfg.AsDate = DateTime.Now;
                db.Save(cfg);
            }

        }


    }
}