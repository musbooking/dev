using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace My
{
    partial class WebApp
    {

        //public void AddMailTask(string email, string templateName, object data)

        //public static Task SendChangesSocketAsync(object obj) => SendSocketAsync("changes", "", obj);


        public static Task SendSocketAsync( string channel, string key, object obj )
        {
            // send client notifications
            var mgr = App.WebSocketManager.GetManager(channel);
            return mgr.SendAsync(key ?? "nobody", obj);
        }
    }


    partial class AppSettings
    {
        /// <summary>
        /// Число часов, через которые бронь автоматически закрывается
        /// </summary>
        public int OrderCloseHours { get; set; } = 24;
        public int OrderPaymentHours { get; set; } = 1;
        public int MailAttempts { get; set; } = 4;

        /// <summary>
        /// API url для колбека
        /// </summary>
        public string CalendarsPushCallback { get; set; } = "api/calendars/push";

        /// <summary>
        /// Записываем ли логи
        /// </summary>
        public bool Log { get; set; } = true;


        /// <summary>
        /// Периодичность синхронизаций сервисов orders, в сек
        /// </summary>
        public int OrdersSyncSec { get; set; }

        /// <summary>
        /// Максимальное кол-во событий для синхронизации
        /// </summary>
        public int CalendarsMaxEvents { get; set; } = 10000;

        /// <summary>
        /// Периодичность полной синхронизации outlook, в сек
        /// </summary>
        public int OutlookSyncFullSec { get; set; }

        /// <summary>
        /// Периодичность полной синхронизации гугла, в сек
        /// </summary>
        public int GoogleSyncFullSec { get; set; }

        /// <summary>
        /// Периодичность синхронизации PUSH нотификаций, в сек
        /// </summary>
        public int CalendarsSyncPushSec { get; set; }

        /// <summary>
        /// Периодичность синхронизации сервиса привязки push-уведомлений, в сек
        /// </summary>
        public int CalendarsSetWatchSec { get; set; }

        /// <summary>
        /// Минимальная дата в днях относительно текущей, для синхронизации событий
        /// </summary>
        public int CalendarsMinDays { get; set; } = 61;

        /// <summary>
        /// Минимальная дата в сек относительно текущего для синхронизации PUSH-событий, по умолчанию 1ч
        /// </summary>
        public int CalendarsPushMinSec { get; set; } = 3600;


        /// <summary>
        /// Периодичность синхронизации доменных сервисов 
        /// </summary>
        public int DomainsSyncSec { get; set; }


        /// <summary>
        /// Синхронизация почтовых сообщений
        /// </summary>
        public int MailSyncSec { get; set; }

        /// <summary>
        /// Страница 
        /// </summary>
        public int MailSyncPage { get; set; } = 100;


    }
}
