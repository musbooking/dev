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

namespace My.App.Calendars.Google
{
    class GoogleCalendars
    {
        public List<GoogleCalendar> items { get; set; } = new List<GoogleCalendar>();
        //public List<dynamic> items { get; set; } = new List<dynamic>();
    }

    class GoogleCalendar
    {
        public string id { get; set; }
        public string summary { get; set; }
    }


    ///// <summary>
    ///// Результат запроса по получению событий
    ///// </summary>
    //class EventResult
    //{
    //    public IEnumerable<Event> Events;
    //    public string Token;
    //    public string Url;
    //}

    /// <summary>
    /// Ответ гугла при получении событий
    /// </summary>
    class GoogleResponse
    {
        public string Etag { get; set; }
        public List<Event> Items { get; set; }
        public string NextPageToken { get; set; }
    }

    /// <summary>
    /// Событие Гугл
    /// </summary>
    class Event
    {
        public string Id { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }

        public EventDate Start { get; set; }
        public EventDate End { get; set; }
        public EventStatus Status { get; set; }

        // если хотим отлаживать, то включить в список полей в запросе
        //public DateTimeOffset Created { get; set; }
        //public DateTimeOffset Updated { get; set; }

        public override string ToString()
        {
            return $"{Summary} {Description}: {Start}-{End}";
        }
    }

    /// <summary>
    /// Дата события
    /// </summary>
    class EventDate
    {
        public DateTimeOffset? DateTime { get; set; }
        public DateTimeOffset? Date { get; set; }
        //public string TimeZone;

        public DateTime? GetDate()
        {
            return (DateTime ?? Date).Value.DateTime;
            //return System.DateTime.Now;
        }

        public override string ToString()
        {
            return DateTime?.ToString() + Date?.ToString();
        }
    }

    enum EventStatus
    {
        Unknown,
        Confirmed,
        Tentative,
        Cancelled,
    }

}
