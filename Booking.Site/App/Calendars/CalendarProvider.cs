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
    /// Базовый провайдер для календарей
    /// </summary>
    public abstract class CalendarProvider: AppObject
    {

        public const string GOOGLE = "google";
        public const string MSLIVE = "windowsLive";
        public const string MSONLINE = "microsoftOnline";


        public static CalendarProvider GetProvider(string key)
        {
            return _Providers.GetValueOrDefault(key);
        }

        //static Dictionary<string, CalendarProvider> _Providers = new Dictionary<string, CalendarProvider>
        //{
        //    { "google", new Google.GoogleProvider() },
        //    { "outlook", new Outlook.OutlookProvider() },
        //};


        static Dictionary<string, CalendarProvider> _Providers = new Dictionary<string, CalendarProvider>
        {
            [GOOGLE] = new Google.GoogleProvider(),
            [MSONLINE] = new Outlook.OutlookProvider(),
        };


        /// <summary>
        /// РАзрешение на запуск сервиса
        /// </summary>
        public abstract bool Allow(Calendar calendar);

        /// <summary>
        /// Получение контента календаря
        /// </summary>
        public abstract Task<string> GetContent(Calendar calendar);


        /// <summary>
        /// Получение списка событий из календаря
        /// </summary>
        public abstract Task<EventResult> GetEvents( SyncArgs args );

        /// <summary>
        /// Добавление или изменение события
        /// </summary>
        public abstract Task<Event> SetEvent(EventInfo info);

        /// <summary>
        /// Удаление события из календаря
        /// </summary>
        public abstract Task DelEvent(string eventkey, WebClient web, string url);

        /// <summary>
        /// Подписка на уведомления или отписка 
        /// </summary>
        public virtual async Task<string> WatchAsync(Calendar calendar, System.Net.WebClient web, bool start = true)
        {
            return null;
        }


        protected const string LOCAL_TIMEZONE = "+03:00";

    }




}

