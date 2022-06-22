using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB.Data;
using Itall;
using System.ComponentModel;
using LinqToDB;
using My.App.Fin;
using My.App.CRM;

namespace My.App.Orders
{

    /// <summary>
    /// Статус заказа
    /// </summary>
    public enum OrderStatus
    {
        Request = -1,  // Статус заявки
        Unknown = 0,
        Reserv = 1,
        Closed = 10,
        Cancel = 11,
        //Done = 100,
    }

    /// <summary>
    /// Действие с бронью
    /// </summary>
    public enum OrderAction
    {
        Request = -1,  // Создание заявки
        New = 0,
        Reserv = 1, //OrderStatus.Reserv
        Pay = 10, //OrderStatus.Closed,

        CancelNormal = 11, //OrderStatus.Cancel,
        CancelForfeitAsk = 21,
        CancelForfeitConfirm = 22,

        AutoPay = 30, //Автоматическая оплата
        PayForfeits = 31,   // Оплата штрафов (используется внутри системы)

        Close = 100,
    }

    /// <summary>
    /// Статус заявки (для заявок)
    /// </summary>
    public enum RequestStatus
    {
        Unknown = 0, 
        New = 1, // Новая,
        Processing = 2, // В работе,
        Confirmed = 10, // Подтверждена,
        Canceled = 11, // Отклонена, 
        Unprocessed = 12, // Не обработана
    }


    public enum CancelReason
    {
        Unknown = 0,
        Normal = 1,
        //ClientOut = 2,
        ForfeitsAsk = 3,
        ForfeitsConfirmed = 4,
    }

    /// <summary>
    /// Источник брони
    /// </summary>
    public enum SourceType
    {
        Web = 0,
        Mobile = 1,
        Calendar = 2,
        Widget = 3,
        Bot = 4,
        Catalog = 5,
        Sync = 6,  // Синхронизация с внешним сайтом

        MobilePre = 11, // мобильная предоплата
        WidgetPre = 13, // виджет предоплата
        CatalogPre = 15, // каталог предоплата
        Request = 16,  // на основе заявки
    }


    public enum SeriesPeriodKind
    {
        Unknown = 0,
        Day = 1,
        Week = 2,
        Month = 3,
    }


    public class OrderContext : ServiceContext
    {
        public OrderContext()
        {

        }

        public OrderAction Action;

        public RequestStatus RequestStatus;

        /// <summary>
        /// Старый статус, для анализа
        /// </summary>
        internal OrderStatus OldStatus;

        public Order Order;
        //public CRM.ClientPart ClientPart;
        //public int Forfeit = 0; // нужно? м.б. убрать в рамках новой фин.модели, т.к.непонятно, зачем оно
        public string Phones;
        public string Equipments;
        public string Text; // Некий текст

        /// <summary>
        /// Детали операции для транзакций
        /// </summary>
        public int TransDetails;

        /// <summary>
        /// Сумма транзакции
        /// </summary>
        public int TransTotal;


        /// <summary>
        /// Результаты расчета брони
        /// </summary>
        public CalcResult Calcs;
        public SourceType? Source;

        public bool IsPrepay = false;



        /// <summary>
        /// канал оплаты
        /// </summary>
        public PayChannel Channel;

        /// <summary>
        /// ТЕкст сообщения
        /// </summary>
        public string Message;

        /// <summary>
        /// Нужно ли добавлять сообщение
        /// </summary>
        public bool IsAddMsg;
        //public bool IsStatusChanged() => OldStatus != Order.Status; - не пошло, т.к. нелогично

        /// <summary>
        /// Отмена нотификаций
        /// </summary>
        public bool CancelNotify;

        /// <summary>
        /// Является ли текущий контекст - онлайн оплатой
        /// </summary>
        public bool IsOnlinePayment;

        /// <summary>
        /// Просрочена ли предоплата
        /// </summary>
        public bool IsPreExpired;

        /// <summary>
        /// Доступна ли отправка сообщений
        /// </summary>
        // public bool Notify;
    }




    /// <summary>
    /// Позиция заказа - сохраняется в JSON, 
    /// </summary>
    public class OrderItem
    {
        public Equipment Equipment;

        public Guid? eq { get; set; }
        public int n { get; set; }

        /// <summary>
        /// Преобразование элемента в ItemResult
        /// </summary>
        public ItemInfo ToResult(double hours)
        {
            var item = this;
            var eqtotal = item.Equipment.Price * item.n;
            var kf = 0.0;
            var roundings = 0;
            if (item.Equipment.Kf > 0)
                // && item.Equipment.DestKind != EqDestKind.Package) -  59047 - делаем для всех расчетов
                // схема расчета согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/41005/
            {
                kf = Math.Ceiling(hours / item.Equipment.Kf);  // округляем до ближайш целого
                var rounedEqSum = SysUtils.Round5(eqtotal * kf);
                roundings = eqtotal - rounedEqSum; // накапливаем сумму округлений
                eqtotal = rounedEqSum;
            }
            var dest = item.Equipment.DestKind == EqDestKind.Addition ? "" : "(пакет)";
            var text = $" {item.Equipment.Name} {dest}: {eqtotal} = {item.Equipment.Price}x{item.n} шт * {kf} [={hours}ч/{item.Equipment.Kf} кф]  ";
            var ires = new ItemInfo
            {
                EqId = item.Equipment?.Id,
                GroupId = item.Equipment?.GroupId,
                Total = eqtotal,
                Text = text,
                Roundings = roundings,
            };
            return ires;
        }

        public override string ToString()
        {
            return $"{Equipment?.Name} x{n}";
        }

    }

    /// <summary>
    /// Структура для описания оборудования в Order.ItemJson
    /// </summary>
    public class ItemInfo
    {
        public Guid? EqId;
        public Guid? GroupId;

        /// <summary>
        /// Сумма по позиции
        /// </summary>
        public int Total;

        public string Text;

        /// <summary>
        /// Округления
        /// </summary>
        public int Roundings;
    }


    /// <summary>
    /// Аргументы создания заказа
    /// </summary>
    public class AddOrderArgs
    {

        public Guid? Room { get; set; }          // = Convert<Guid>(vars.room);
        public DateTime Date { get; set; }      // = Convert<DateTime>(vars.date);
        internal DateTime DateTo;               // for internal using
        public DateTime? Maxdate { get; set; }  // для серий
                                                //string days {get; set; }        // периоды дней
        public SeriesPeriodKind Period { get; set; }
        public Guid? Request { get; set; }       // ИД заявки, если создается на основе заявки
        public Guid? Client { get; set; }       // = Convert<Guid?>(vars.client);
                                                //GroupKind group {get; set; }
        public Guid? Option { get; set; }
        public int Range { get; set; }
        public int Hours { get; set; }
        public int Lifetime { get; set; }
        public string ClientComment { get; set; }
        public string Comment { get; set; }
        public string Color { get; set; }
        //[FromForm(Name = "equipments")] string eqIds {get; set; } // = vars.equipments;
        public string ItemsJson { get; set; }

        public string Promo { get; set; }  // код промо
        public Guid? PromoId;  // ид промо
        public bool IsAutoDate;  // Установка даты автоматически, пока не будет разрешено создавать бронь

        public Guid? Channel { get; set; } // канал оплаты
        public bool? PayForfeit { get; set; }  // оплачиваем штраф или нет

        public OrderStatus Status { get; set; } = OrderStatus.Reserv;
        public SourceType Source { get; set; } = SourceType.Mobile;
        public bool IsPrepay { get; set; }  // есть ли предоплата
        public Sys.TemplateGroup Template { get; set; } = Sys.TemplateGroup.None;
        public bool PayPoints { get; set; } = false;

        public bool HasSeries() => Maxdate != null;

        /// <summary>
        /// Проверка корректности аргументов
        /// </summary>
        public void Validate()
        {
            if (HasSeries())
            {
                if (Status != OrderStatus.Unknown)
                    throw new UserException("Можно создавать серии только со статусом Черновик");
                if (Status == OrderStatus.Request)
                    throw new UserException("Нельзя создавать серии для заявок");
            }

            if (Request != null && Status == OrderStatus.Request)
            {
                throw new UserException("Нельзя создавать заявку на основе другой заявки");
            }
        }

        /// <summary>
        /// Получение следующего значения дат для периода
        /// </summary>
        public void NextPeriod()
        {
            switch (Period)
            {
                case SeriesPeriodKind.Day:
                    Date = Date.AddDays(1);
                    DateTo = DateTo.AddDays(1);
                    break;
                case SeriesPeriodKind.Week:
                    Date = Date.AddDays(7);
                    DateTo = DateTo.AddDays(7);
                    break;
                case SeriesPeriodKind.Month:
                    Date = Date.AddMonths(1);
                    DateTo = DateTo.AddMonths(1);
                    break;

            }
        }

    }

    /// <summary>
    /// Структура результатов создания заказа
    /// </summary>
    public class AddOrderResults
    {
        public Room Room;
        public Abonement Abonement;
        public Order Order = null; // запоминаем первый заказ, для возврата
        public string Text = "";
        public string Errors = "";

        public List<AddOrderResult> List = new List<AddOrderResult>();
        internal ClientPart Part;
        internal int Total;
    }


    /// <summary>
    /// Описание результата создания ордера
    /// </summary>
    public class AddOrderResult
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public string Error { get; set; }

        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }

        public bool Created { get; set; }
    }


    public class ChangeStatusArgs
    {
        public Guid OrderId;
        public OrderAction Action;
        public RequestStatus RequestStatus;
        // Используем в расчетах домен пользователя
        //public bool UserDomain = false; // - заблокировано т.к. приводит к ошибке - https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/47487/
        public CalcResult Calcs;

        public int Total;

        //internal bool CheckErrors;

        /// <summary>
        /// блокировка отправки сообщений
        /// </summary>
        //public bool Notify = true;
    }



    //public class ItemsInfo
    //{
    //    public string Name { get; set; }
    //}


}


