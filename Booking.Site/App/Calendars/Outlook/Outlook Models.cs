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

namespace My.App.Calendars.Outlook
{
    class OutlookCalendars
    {
        public List<OutlookCalendar> value { get; set; } = new List<OutlookCalendar>();
        //public List<dynamic> items { get; set; } = new List<dynamic>();
    }

    class OutlookCalendar
    {
        public string id { get; set; }
        public string name { get; set; }
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
    class OutlookResponse
    {
        public IEnumerable<Event> value { get; set; }
        public string Etag { get; set; }
    }

    /// <summary>
    /// Событие Гугл
    /// </summary>
    class Event
    {
        public string Id { get; set; }
        public string Subject { get; set; }
        public string BodyPreview { get; set; }

        public EventDate Start { get; set; }
        public EventDate End { get; set; }

        public bool IsCanceled { get; set; }

        public override string ToString()
        {
            return $"{Subject} {BodyPreview}: {Start}-{End}";
        }
    }

    /// <summary>
    /// Дата события
    /// </summary>
    class EventDate
    {
        public DateTimeOffset? DateTime { get; set; }
        public string TimeZone { get; set; }

        public override string ToString()
        {
            return DateTime?.ToString();
        }
    }


}
