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

namespace My.App.Calendars.Google
{
    /// <summary>
    /// Сервис для синхронизации с Гуглом по протоколу OAuth2
    /// </summary>
    public class GoogleProvider : CalendarProvider
    {
        public override string ToString() => CalendarProvider.GOOGLE;


        public override bool Allow(Calendar calendar)
        {
            return calendar.Provider == CalendarProvider.GOOGLE;
        }

        public override Task<string> GetContent(Calendar calendar)
        {
            // read calendars
            var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
            var args = new
            {
                access_token = calendar.GetAccessToken(), //request.AccessToken,
                //fields = "items/id",
            };
            return Itall.Net.NetUtils.GetStringAsync(url, args);
        }




        public override async Task<Calendars.EventResult> GetEvents( SyncArgs args )
        {

            // Получаем список объектов
            var calendar = args.Calendar;
            var calendarId = calendar.Name ?? "primary";

            // Считаем минимальную дату. У Гугла особенность - она не должна превышать 20 дней
            var minDate = calendar.MinDate ?? DateTime.Now.AddDays(-20);  // вернул согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/44497/
            //if (args.LastOnly)
            //    minDate = DateTime.Now.AddMinutes(-5)
            //    MinDate != null && MinDate > startDate)  // корректируем стартовую дату
            //    minDate = calendar.MinDate.Value;

            var smindate = "";

            var mindays = Configs.Get("google-min-days")?.AsInt ?? 25;
            //var nmonths = Configs.Get("google-max-months")?.AsInt ?? 12;
            // var dateMax = DateTime.Now.AddMonths(nmonths);

            var now = DateTime.Now;
            var year = now.Month < 12 ? now.Year : now.Year + 1;
            var maxDate = new DateTime(year+1, 1, 1);  // до НГ, согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/44497/
            var nmaxres = Configs.Get("google-max-res")?.AsInt ?? 2500;

            if ((now - minDate).TotalDays < mindays)
            {
                smindate = minDate.ToUtcString();
            }

            var escCalendarId = Uri.EscapeDataString(calendarId);
            // API: https://developers.google.com/apis-explorer/?hl=ru#s/calendar/v3/calendar.events.list
            var url = $"https://www.googleapis.com/calendar/v3/calendars/{escCalendarId}/events"; //

            // постраничное извлечение списка событий
            var all_events = new List<Calendars.Event>();  // готовим итоговый массив
            var page_token = "";  // токен для постраничного просмотра - см. 54225
            var pages_limit = App.Settings.CalendarsMaxEvents / nmaxres;  // на всякий случай ограничиваем макс кол-во страниц

            do
            {
                var evArgs = new
                {
                    //access_token = token,
                    calendarId = calendarId,
                    timeMax = maxDate.ToUtcString(),  // уменьшаем до 2-х https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/44497/  // 12 мес - https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/26468/
                    updatedMin = smindate,
                    fields = "nextPageToken,items(description,end/date,end/dateTime,id,start/date,start/dateTime,summary,status)",  // ,created,updated
                    showDeleted = true,
                    pageToken = page_token,  // передаем текущий страничный токен - 
                    singleEvents = true, // показывает ли все рекуррентные события, see https://developers.google.com/google-apps/calendar/v3/reference/events/list
                    timeZone = calendar.TimeZone,
                    maxResults = nmaxres, // Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. (integer, 1+)
                };

                // выполняем запрос к Google
                var full_url = url.ToQueryUrl(evArgs);
                var google_events = args.WebClient.GetJson<GoogleResponse>( full_url );

                var page_events = google_events.Items
                    .OrderBy(e => e.Start == null)
                    .Select(e => new Calendars.Event
                    {
                        Id = e.Id,
                        Start = e.Start.GetDate(),
                        End = e.End.GetDate(),
                        Subject = e.Summary,
                        Body = e.Description,
                        IsCanceled = e.Status == EventStatus.Cancelled,
                    }).ToList();

                all_events.AddRange(page_events);

                if (string.IsNullOrWhiteSpace(google_events.NextPageToken) || --pages_limit == 0)
                    break;

                page_token = google_events.NextPageToken;

            } while (true);

            return new EventResult
            {
                Events = all_events.ToList(),
                //Token = calendar.GetAccessToken(),
                Url = url,
            };
        }



        /// <summary>
        /// Добавление или изменение события
        /// https://developers.google.com/calendar/api/v3/reference/events/update
        /// </summary>
        public override async Task<Calendars.Event> SetEvent(EventInfo info)
        {
            var tz = info.TimeZone ?? LOCAL_TIMEZONE;
            var is_self = info.Order.Source == Orders.SourceType.Calendar; // признак - бронь была импортирована из календаря ранее

            // Добавляем или обновляем событие
            var args = new
            {
                //access_token = token,
                summary = is_self ?null :info.GetTitle(),
                description = is_self ?null :info.GetDescription(),

                start = new
                {
                    dateTime = info.Order.DateFrom.ToUtcString().Replace(LOCAL_TIMEZONE, tz),
                    //timeZone = "GMT+12:00",
                },
                end = new
                {
                    dateTime = info.Order.DateTo.ToUtcString().Replace(LOCAL_TIMEZONE, tz),
                    //timeZone = "UTC+12:00",
                },
                //sendUpdates = "none",  // не посылаем уведомления ??
                // updated = DateTimeOffset.Now.AddDays(-1), // перезабиваем обновление - как мертвому припарка, гугл весело ложит
            };
            var url = info.Url;
            var method = "post";
            if (info.IsUpdate())
            {
                url += $"/{info.Order.EventKey}";
                method = "patch";
            }
            var sevent = await info.Web.PostJsonAsync(url, args, method);
            var gev = JsonUtils.JsonToObject<Event>(sevent);
            var ev = new Calendars.Event
            {
                Id = gev.Id,
                Start = gev.Start.GetDate(),
                End = gev.End.GetDate(),
                Subject = gev.Summary,
                Body = gev.Description,
                IsCanceled = gev.Status == EventStatus.Cancelled,
            };
            return ev;
        }


   


        public override async Task DelEvent(string key, WebClient web, string url)
        {
            //var args = new   -- криво проходят 
            //{
            //    send_notifications = false,
            //    sendNotifications = false,
            //    showDeleted = true,
            //};
            //var sevent = await web.PostJsonAsync(res.Url + "/" + order.EventKey, args, "delete");

            var full_url = $"{url}/{key}?sendNotifications=false";
            var sevent = await web.PostJsonAsync(full_url, null, "delete");
            //var sevent = await web.PostAsync(url, "delete");
        }



        /// <summary>
        /// Привязка или отвязывание от нотификаций
        /// </summary>
        public override async Task<string> WatchAsync(Calendar calendar, System.Net.WebClient web, bool start = true)
        {
            if (start)  // START
            {
                const long EXPIRES_LIMIT = (long)10 * 365 * 24 * 3600 * 1000;// 10 лет  1426325213000;
                                                             //const long EXRIRES_LIMIT_SEC = 1426325213000;  // 45 лет

                var id = calendar.Id.ToString(); // Your channel ID.  - делаем уникальнымGuid.NewGuid().ToString();
                var args = new
                {
                    id = id, // 
                    type = "web_hook",
                    address = App.Settings.Host + App.Settings.CalendarsPushCallback, // Your receiving URL.
                    //"token": "target=myApp-myCalendarChannelDest115B" // (Optional) Your channel token. # "expiration": 1426325213000 // (Optional) Your requested channel expiration time.
                    //expiration = EXPIRES_LIMIT,
                };

                // read calendars
                var url = $"https://www.googleapis.com/calendar/v3/calendars/{calendar.Name}/events/watch";
                var res = await web.PostJsonAsync(url, args);

                return res;
            }
            else  // STOP
            {
                var wres = Itall.JsonUtils.JsonToObject<WatchResult>( calendar.WatchResult );
                if (wres == null) return null;

                var args = new
                {
                    id = wres.Id, // calendar.Id.ToString(),
                    resourceId = wres.ResourceId,
                };
                var url = "https://www.googleapis.com/calendar/v3/channels/stop";
                var res = await web.PostJsonAsync(url, args);

                return calendar.WatchResult; // в этом случае не меняем результат, сохраняемый в БД (для доп. проверок)
            }
        }


        /// <summary>
        /// Результат операции Watch
        //  "kind": "api#channel",
        //  "id": "my-test-resource-id-016",
        //  "resourceId": "U15kUHiUFlC5RoBIeInYEjmkfhs",
        //  "resourceUri": "https://www.googleapis.com/calendar/v3/calendars/i8aln99t2j2455nvi8thcp7kk8@group.calendar.google.com/events?alt=json",
        //  "expiration": "1625748674000"
        /// </summary>
        public class WatchResult
        {
            public string Kind { get; set; }
            public string Id { get; set; }
            public string ResourceId { get; set; }
            public string ResourceUri { get; set; }
        }

    }


    }

#region ----- Misc ------

//var resEvents = calendar.Calendars.JsonToObject<GoogleResponse>();
//var userId = resEvents.etag;
//calendar.UserKey = userId;

//if (request.RefreshToken != null)
//{
//    calendar.RefreshToken = request.RefreshToken;
//}
//else
//{
//    var lastCalendar = db.Calendars
//        .Where(x => x.UserKey == userId) // ищем с таким же профилем
//        .Where(x => x.Id != id) // исключаем текущую запись
//        .Where(x => x.RefreshToken != null) // нужен непустой токен обновления
//        .OrderByDescending(x => x.LastDate) // сортируем по последнему входу
//        .FirstOrDefault(); // берем 1-ю запись 

//    if (lastCalendar != null)
//        calendar.RefreshToken = lastCalendar.RefreshToken;
//}


//var url2 = $"{url}?access_token={token}";
////var addArgs2 = JsonUtils.ObjectTo(addArgs);
//var addArgs2 = @"{
//     'start': {
//                    'dateTime': '2017-03-20T11:00:00+03:00'
//     },
//     'end': {
//                    'dateTime': '2017-03-20T12:00:00+03:00'
//     },
//     'description': '!!! Это описание события',
//     'summary': '!! Это суммару'
//    }";

//var addRes = await Itall.Net.NetUtils.PostContentAsync(url2, addArgs2, null, true);


//async Task<IActionResult> TestAsync()
//{
//    var q = this.Request.Query;

//    //var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList;

//    var args = new
//    {
//        access_token = GetAuthToken(__RefreshToken), //"1/MXdgGDaf7SFPKXC7jX1pdPPqqGYHN8_vL_7nPx1ufUI");
//    };
//    var url = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
//    var res = await Itall.Net.NetUtils.GetStringAsync(url, args);

//    //var uri = client.GetLoginLinkUri();
//    //var coll = new System.Collections.Specialized.NameValueCollection();
//    //coll.Add("code", code);
//    //var user = client.GetUserInfo(coll);

//    return Json(res);
//}

//static string __RefreshToken = "ya29.GlsQBCC6cAa2XIJzhiV5qY5SLgyfbYN3r2RFBDWPICvZaN2y3Y9DOtU1Jrq049R9VO3YSv45Oj0VFBroTuWqsXD93--Ndg6FQA1FGh4vTQh7t-UX_jyE7DLCwruX";

#endregion