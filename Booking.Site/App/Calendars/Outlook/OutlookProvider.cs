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

namespace My.App.Calendars.Outlook
{
    /// <summary>
    /// Сервис для синхронизации с Гуглом по протоколу OAuth2
    /// </summary>
    public class OutlookProvider : CalendarProvider
    {
        public override string ToString() => "Outlook";

        public override bool Allow(Calendar calendar)
        {
            return calendar.Provider == CalendarProvider.MSONLINE || calendar.Provider == CalendarProvider.MSLIVE;
        }

        public override Task<string> GetContent(Calendar calendar)
        {
            // read calendars
            using (var web = new System.Net.WebClient())
            {
                web
                    .AddAuth(calendar.GetAccessToken())
                    //.AddContentTypeJson()
                    .AddUserAgent()
                    .Encode();

                //var url = "https://outlook.office.com/api/v2.0/me/calendars"; //не работает, оказывается, нужно все делать через Graph
                var url = "https://graph.microsoft.com/beta/me/calendars";
                //calendar.Content = Itall.Net.NetUtils.GetString(url, args, true);
                return web.DownloadStringTaskAsync(url);
            }
        }

        public override async Task<Calendars.EventResult> GetEvents( SyncArgs args )
        {

            // https://msdn.microsoft.com/office/office365/APi/calendar-rest-operations#get-events
            // Считаем минимальную дату. У Гугла особенность - она не должна превышать 20 дней
            var evArgs = new
            {
                // start_datetime = startDate,
                // startdatetime = startDate, // в доке оба значения
                // end_datetime
                //TimeZone = "UTC" + calendar.TimeZone,
            };
            //var p = $"outlook.timezone=\"UTC+12\""; // "outlook.timezone=\"'UTC" + calendar.TimeZone+"'";
            //web.Headers["Preference-Applied"] = p;
            //web.Headers["Prefer"] = p;
            var calendarId = args.Calendar.Name ?? "primary";
            var escCalendarId = Uri.EscapeDataString(calendarId);
            var url = $"https://graph.microsoft.com/beta/me/calendars/{escCalendarId}/events"; //
            //var url = $"https://outlook.office.com/api/v2.0/me/calendars/{escCalendarId}/calendarview"; // 
            var events = args.WebClient.GetJson<OutlookResponse>(url.ToQueryUrl(evArgs));

            DateTime? todate(EventDate d)
            {
                if (d?.DateTime == null)
                    return null;
                var d1 = d.DateTime.Value.DateTime;
                var offset = 3;
                if (!string.IsNullOrWhiteSpace(args.Calendar.TimeZone))
                {
                    offset = int.Parse(args.Calendar.TimeZone.Left(3));
                }
                d1 = d1.AddHours(offset);
                return d1;
            }

            var res = new EventResult
            {
                Events = events.value
                    .OrderBy(x => x.Start == null)
                    .Select(x => new Calendars.Event
                    {
                        Id = x.Id,
                        Start = todate(x.Start),
                        End = todate(x.End),
                        Subject = x.Subject,
                        Body = x.BodyPreview,
                        IsCanceled = x.IsCanceled,
                    })
                    .ToList(),
                //Token = calendar.GetAccessToken(),
                Url = url,
            };
            return res;
        }


        public override async Task<Calendars.Event> SetEvent(EventInfo info)
        {
            if (info.IsUpdate()) return null;  // Пока для Outlook блокируем обновления

            var tz = info.TimeZone ?? LOCAL_TIMEZONE;

            // Добавляем событие
            var addArgs = new
            {
                //access_token = token,
                subject = info.GetTitle(), // locked Bitrix 44497

                body = new
                {
                    content = info.GetDescription(),
                    contentType = "HTML",
                },

                start = new
                {
                    dateTime = info.Order.DateFrom.ToUtcString().Replace(LOCAL_TIMEZONE, tz),
                    timeZone = "UTC",
                },
                end = new
                {
                    dateTime = info.Order.DateTo.ToUtcString().Replace(LOCAL_TIMEZONE, tz),
                    timeZone = "UTC",
                },
            };
            var sevent = await info.Web.PostJsonAsync(info.Url, addArgs);
            var gev = JsonUtils.JsonToObject<Event>(sevent);
            var ev = new Calendars.Event
            {
                Id = gev.Id,
                Start = gev.Start.DateTime.Value.DateTime,
                End = gev.End.DateTime.Value.DateTime,
                Subject = gev.Subject,
                Body = gev.BodyPreview,
                IsCanceled = gev.IsCanceled,
            };
            return ev;
        }

        public override Task DelEvent(string key, WebClient web, string url)
        {
            //var args = new
            //{
            //    event_id = order.EventKey,
            //};
            web.AddTextContentType();
            url = $"https://graph.microsoft.com/beta/me/events/{key}";
            return web.PostJsonAsync(url, null, "DELETE");
        }

    }

}
