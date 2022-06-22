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
using System.Net;
using Itall.App.Auth;
using My.App.Orders;
using LinqToDB.Data;

namespace My.App.Calendars
{
    /// <summary>
    /// Класс-помощник для работы с календарями
    /// </summary>
    public partial class CalendarHelper: AppObject
    {
        /// <summary>
        /// Блокируем создание
        /// </summary>
        CalendarHelper()
        {

        }

        /// <summary>
        /// Рассылка уведомления об архивации календаря
        /// </summary>
        public static void NotifyArchive( Calendar calendar, string error = "")
        {
            var email = calendar.Room.Base.Email ?? calendar.Room.Base.Domain.Email;

            var data = new
            {
                Calendar = calendar,
                calendar.Room,
                calendar.Room.Base,
                calendar.Room.Base.Domain,
                Error = error,
            };

            App.AddDbMailJob(email, data, null, calendar?.Id, Sys.TemplateKind.CalendarArchive);
        }


        /// <summary>
        /// Обновление счетчика календарей
        /// </summary>
        public static int IncCalendarsUpdate(DbConnection db, Guid? calendarId = null, Guid? roomId = null)
        {
            if (calendarId == null && roomId == null) 
                throw new ArgumentNullException("Need calendar or room id");

            var res = db.Calendars
                .WhereIf( calendarId != null, c => c.Id == calendarId)
                .WhereIf( roomId != null, c => c.RoomId == roomId)
                .Set(c => c.Updates, c => c.Updates + 1)
                .Update();
            return res;
        }
    }


}

