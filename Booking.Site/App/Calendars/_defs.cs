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
    /// Аргументы для синхронизации календаря 
    /// </summary>
    public class SyncArgs
    {
        public SyncArgs()
        {

        }

        public Calendar Calendar;
        public WebClient WebClient;

        /// <summary>
        /// Дата начала обновления, которая потом перейдет в calendar.MinDate
        /// </summary>
        public DateTime UpdatedDate = DateTime.Now;


        public bool LastOnly = false;

        internal CalendarProvider Provider;
        internal EventResult Result;
    }


    /// <summary>
    /// Статус подписки на PUSH уведомления
    /// </summary>
    public enum WatchStatus
    {
        Unknown = 0,
        Error = 1,
        Stop = 3,  // календарь и нотификация были заблокированы
        Active = 10,  // календарь подписан на PUSH уведомления
    }


    /// <summary>
    /// Описание событий, которое возвращают сервисы синхронизации из внешних календарей
    /// </summary>
    public class Event
    {
        public string Id;

        public DateTime? Start;
        public DateTime? End;

        public string Subject;
        public string Body;

        public bool IsCanceled;
    }


    /// <summary>
    /// Информация о событии, которая передается календарям для обновления
    /// </summary>
    public class EventInfo
    {
        public OrderCalendarInfo Order;
        public string Url;
        public string TimeZone;
        public WebClient Web;
        public DbConnection Db;

        public bool IsNew() => Order.EventKey == null;
        public bool IsUpdate() => Order.EventKey != null;

        //public bool IsUpdate = false;  // признак обновления или добавления
        //static string[] GROUPS = { "", "Соло", "Дуэт", "Группа" };


        public string GetTitle()   // 52833
        {
            var fio = Order.Fio; // Order.Client?.FIO;
            var sum = Order.TotalSum;

            var qphones = Db.Resources
                .Where(x => x.ObjectId == Order.ClientId)
                .GetPhones()
                .Select(x => "+7" + x.Value)
                .ToListAsync()
                .Result;
            var phones = string.Join(",", qphones);

            return $"MUSbooking {sum} {fio} {phones}";
        }


        public string GetDescription() //bool full)
        {

            // var group = ""; //GROUPS[(int)Order.Group];
                            //var phones = Order.Client?.User?.Phone;

            // преобразуем указаееые опции в список
            var all_options = DbCache.Groups.Get();
            var options = Order.Options.ToGuids()
                .Select(id => all_options.GetValueOrDefault(id, null))
                .Where(g => g!=null)
                .Select(g => g.Name);
            var str_options = string.Join(',', options);

            var items_strings = Order.Items.Select(it => it.ToString());
            var items_str = string.Join(", ", items_strings);

            var source = SysUtils.GetSourceName(Order.Source);
            //if (full)
            //    return $"MusBooking {sum} руб.: {fio}, {phones}, {group}  ({Order.Comment})";
            //else

            //Стоимость: {sum} руб. 
            //Клиент: {fio}
            //Телефон: {phones}
            //Источник: {Order.Source}

            return $@"Опции: {str_options}
{items_str}
{source}
Предоплата: {Order.TotalPays}
Комментарий: {Order.Comment}";   // изменен формат: 52833,  44497
        }

    }

    /// <summary>
    /// Минимальная информация о заказе, которая передается календарям для синхронизации
    /// </summary>
    public class OrderCalendarInfo
    {
        public Guid Id;
        public DateTime DateFrom, DateTo;
        public int TotalSum;
        public Guid? ClientId;
        public string Fio;
        public string Comment;
        public string Options;

        public int Forfeit;
        public int TotalPays;

        public string EventKey;
        internal IEnumerable<OrderItem> Items;

        public SourceType Source { get; set; }

    }

    /// <summary>
    /// Результат запроса по получению событий
    /// </summary>
    public class EventResult
    {
        public IList<Event> Events;
        //public string Token;
        public string Url;
    }

    

}

