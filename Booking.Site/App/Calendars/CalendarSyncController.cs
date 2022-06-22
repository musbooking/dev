using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using System.Threading;
using My.App;
using Itall;
using Itall.App.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Calendars
{
    /// <summary>
    /// Модуль синхронизации и тестирования календарей
    /// </summary>
    //[Route("calendars")]
    [Route("api/calendars")]
    public class CalendarSyncController : DbController
    {

        [HttpGet("sync")]
        public async Task<IActionResult> SyncAsync(Guid? domainId, [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] ids, bool last = false)
        {
            this.RequiresAuthentication();

            var sb = new StringBuilder();

            var query = Db.Calendars
                .LoadWith(x => x.Room)
                .LoadWith(x => x.Domain)
                .GetActuals(!last)
                .Where(x => x.RoomId != null)
                .Where(x => x.Provider != null)
                .Where(x => x.JsonContent != null);

            if (ids != null)
                query = query.Where(x => ids.Contains(x.Id));
            else if (domainId.HasValue)
                query = query.GetDomainObjects(domainId);
            else
                query = query.Take(0);

            var calendars = await query.ToListAsync();


            var svc = new CalendarSyncService { Db = Db };
            var args = new SyncArgs { LastOnly = last };

            foreach (var calendar in calendars)
            {
                var room = calendar.Room;
                sb.AppendLine($"Календарь {calendar.Name}: {room.Name}");

                try
                {
                    args.Calendar = calendar;
                    await svc.SyncRoomAsync(args);
                }
                catch (Exception x)
                {
                    sb.AppendLine($"Комната {room.Name}: {room.Base.Name}, ошибка: {x.Message}");
                }
            }


            var res = sb.ToString();
            return Content(res);
        }

        /// <summary>
        /// Аргументы колбека
        ///  Header[X-Goog-Channel-ID] = my-test-resource-id-015<br>
        ///  Header[X-Goog-Channel-Expiration] = Wed, 07 Jul 2021 09:04:06 GMT<br>
        ///  Header[X-Goog-Resource-State] = exists<br>
        ///  Header[X-Goog-Message-Number] = 158687<br>
        ///  Header[X-Goog-Resource-ID] = U15kUHiUFlC5RoBIeInYEjmkfhs<br>
        ///  Header[X-Goog-Resource-URI] = https://www.googleapis.com/calendar/v3/calendars/i8a....8@group.calendar.google.com/events?alt=json<br>
        ///  Header[X-Goog-Channel-Token] = target=myApp-myCalendarChannelDest116<br>
        /// </summary>
        public class PushArgs
        {
            [FromHeader(Name = "X-Goog-Channel-ID")]
            public string ChannelID { get; set; }

            [FromHeader(Name = "X-Goog-Resource-State")]
            public string ResourceState { get; set; }

            [FromHeader(Name = "X-Goog-Message-Number")]
            public string MessageNumber { get; set; }

            [FromHeader(Name = "X-Goog-Resource-ID")]
            public string ResourceID { get; set; }

            [FromHeader(Name = "X-Goog-Channel-Token")]
            public string ChannelToken { get; set; }

        }


        /// <summary>
        /// Обработка колбека от 
        /// </summary>
        [Route("push")]
        public async Task<IActionResult> OnPushAsync(PushArgs args)
        {
            var msg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.Calendar,
                //ObjectId
                Text = $"Обновление календаря: ch={args.ChannelID}, res={args.ResourceID}, msg={args.MessageNumber}",
            };

            try
            {
                var id = Guid.Parse(args.ChannelID);
                msg.ObjectId = id;

                CalendarHelper.IncCalendarsUpdate( Db, calendarId: id );

                //var calendar = await Db.Calendars.FindAsync(id);
                //await CalendarHelper.SyncRoomAsync( Db, calendar );
            }
            catch (Exception err)
            {
                msg.Text += " Ошибка push-уведомления: " + err;
                msg.Status = (byte)WatchStatus.Error;
                await Db.CreateInsertAsync(msg);  // только в случае ошибки
            }

            if (App.Settings.Log)
            {
                var sb = new StringBuilder();
                WebUtils.Request2Strings(Request, sb);
                sb.AppendLine("args.ChannelId: " + args.ChannelID);
                sb.AppendLine("args.MessageNumber: " + args.MessageNumber);
                sb.AppendLine("args.ResourceID: " + args.ResourceID);
                sb.AppendLine("args.ResourceState: " + args.ResourceState);
                var text = sb.ToString();

                FileHelper.LogFile(text, "calendars.push");
            }

            return Ok(msg.Text);
        }



        /// <summary>
        /// БАзовый вызов тестирования
        /// </summary>
        [HttpGet("test")]
        public async Task<IActionResult> TestAsync(Guid id)
        {
            this.RequiresAuthentication();

            //var args = this.Request.Query;
            //Guid id = Convert<Guid>(args.id);  //user.DomainId.Value;

            Calendar calendar = null;

            calendar = await Db.Calendars.FindAsync(id);

            var provider = CalendarProvider.GetProvider(calendar.Provider);

            //var svc = new CalendarSyncService();

            if (provider == null)
                return Error($"Service  {calendar.Provider} not found");

            var token = calendar.GetAccessToken();
            using var web = new System.Net.WebClient();
            web
                .AddAuth(token)
                //.AddContentTypeJson()
                .AddUserAgent()
                .Encode();

            var args = new SyncArgs { Calendar = calendar, WebClient = web };
            var resEvents = await provider.GetEvents(args);
            var events = resEvents.Events.Take(10).Select(x => $"{x.Subject} {x.Start}-{x.End}");
            var res = string.Join("/r/n", events);
            return Html(res);

        }

        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            var line1 = "Sync status: " + CalendarSyncService.GetSyncInfo();
            var line2 = CalendarSyncJob.Getinfo();
            return Ok(line1 + "\n" + line2);
        }


    }

}


#region Misc

//var rooms = await db.Rooms
//    .LoadWith(x => x.Calendar)
//    .LoadWith(x => x.Base)
//    .GetDomainActuals()
//    .GetDomainObjects(domainId)
//    .GetActuals()
//    .Where(x => x.Calendar.Provider == provider)
//    .ToListAsync();

//await SyncRoomAsync(db, room, calendar);
//foreach (var svc in WebApp.Current.Services.Get<CalendarService>())
//{
//if (!svc.Allow(calendar)) continue;
//await svc.SyncRoomAsync(Db, calendar);
//}
#endregion