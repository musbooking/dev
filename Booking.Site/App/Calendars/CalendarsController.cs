using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Itall;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using LinqToDB.Data;

namespace My.App.Calendars
{
    public class CalendarsController : UpdateDbController<Calendar>
    {
        protected override object OnUpdating(Updater<Calendar> updater)
        {
            updater.Set(x => x.RoomId);
            updater.Set(x => x.Name);
            updater.Set(x => x.Description);
            updater.Set(x => x.MinDate);
            updater.Set(x => x.Provider);
            updater.Set(x => x.TimeZone);
            updater.Set(x => x.IsArchive);

            var obj = updater.Object;



            if (updater.HasChange("isArchive"))
            {
                if (obj.IsArchive)  // если отправили в архив, то отправляем уведомление
                {
                    obj.Room ??= updater.Db.GetTable<Orders.Room>()
                        .LoadWith(r => r.Base.Domain)
                        .Find(obj.RoomId); // для шаблона

                    CalendarHelper.NotifyArchive(obj, "Выставлен флаг Архив");
                }
                else // если вытащили из архива, то выставляем текущую дату синхронизации
                {
                    updater.Set(x => x.MinDate, DateTime.Now);
                }
            }

            // updater.Set(x => x.WatchStatus); блокируем в рамках 64893
            var svc = new CalendarSyncService { Db = (DbConnection)updater.Db };
            var resw = svc.SetWatchAsync(obj).Result;

            //Calendars.Reset(); 

            var res = base.OnUpdating(updater);
            return new { Id = obj.Id,  obj.WatchStatus, obj.WatchResult};
        }


        protected override void OnDeleting(Guid id, DataConnection db)
        {
            var calendar = Db.Calendars
                .LoadWith(cl => cl.Room)
                .Find( id );
            calendar.IsArchive = true;

            var svc = new CalendarSyncService { Db = (DbConnection)db };
            var res = svc.SetWatchAsync(calendar).Result;

            base.OnDeleting(id, db);
        }



        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            var args = this.Request.Query;
            //Guid objid = Convert<Guid>(args.objectid);
            var user = this.CurUser();

            //using (var Db = new DbConnection())
            {
                //var room = await db.Rooms.FindAsync(id);
                var calendars = await Db.Calendars
                    .GetDomainObjects(user.DomainId)
                    .ToListAsync();

                var query =
                    from cl in calendars
                        //where x.ObjectId == objid
                    select new
                    {
                        cl.Id,
                        cl.Provider,
                        cl.Name,
                        cl.Description,
                        cl.IsArchive,
                        cl.MinDate,
                        cl.RoomId,
                        cl.TimeZone,
                        //watch = cl.WatchStatus == WatchStatus.Enabled,
                        cl.WatchStatus,
                        cl.WatchResult,
                        cl.Attempts,
                        Calendars = getItems(cl),
                    };
                //var res = await query.ToListAsync();
                return Json(query);
            }
        }


        dynamic getItems(Calendar calendar)
        {
            if (string.IsNullOrWhiteSpace(calendar.JsonContent))
                return null;

            switch (calendar.Provider)
            {
                case CalendarProvider.GOOGLE:
                    var calendars = Itall.JsonUtils.JsonToObject<Google.GoogleCalendars>(calendar.JsonContent);
                    return calendars?.items.Select(x =>
                    new
                    {
                        x.id,
                        value = x.summary,
                    });

                case CalendarProvider.MSONLINE:
                case CalendarProvider.MSLIVE:
                    var calendars2 = Itall.JsonUtils.JsonToObject<Outlook.OutlookCalendars>(calendar.JsonContent);
                    return calendars2?.value.Select(x =>
                    new
                    {
                        x.id,
                        value = x.name,
                    });

                default:
                    return 0;
            }
        }

    }


}
