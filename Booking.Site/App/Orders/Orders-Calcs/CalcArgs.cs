using My.App;
using Itall;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{

    /// <summary>
    /// Аргументы расчета и промежуточные результаты
    /// </summary>
    public class CalcArgs
    {
        public CalcArgs()
        {

        }
        
        public DbConnection Db;

        public Guid? RoomId;
        public Guid? OrderId;
        public Guid? ClientId; // DomainId - берется у Room
        //public Guid? ChannelId; // ид канала оплаты

        public CRM.ClientPart ClientPart;

        public Room Room;

        public double Hour1, Hour2, Hours;
        public App.HoursSpan[] RoomHours;
        public readonly List<TimeCalc> TimeCalcs = new List<TimeCalc>();


        /// <summary>
        /// Список результатов расчета оборудования
        /// </summary>
        public List<ItemInfo> Items = new List<ItemInfo>();

        /// <summary>
        /// Дата брони - полночь
        /// </summary>
        public DateTime OrderDateH0;

        public DateTime DFrom, DTo;

        /// <summary>
        /// Дата создания брони
        /// </summary>
        public DateTime Date = DateTime.Now;

        //public string EqIds;
        public string ItemsJson;

        //public Modules.GroupKind Group;
        public Guid[] Options;


        public Common.Day SpecDay;

        public Guid? PromoId = null;
        public string PromocodeNum = null; // иногда приходит код
        //public Models.Promotion Promotion;
        public List<CRM.Promotion> Promos = null;
        //public List<Promotion> HotPromos = null;
        public OrderStatus Status = OrderStatus.Reserv;  // РАсчет ведем по умолчанию для резерва, т.к. Unknown статус блокирует расчеты - 39181 

        /// <summary>
        /// Ссылка на горящую репетицию, если есть
        /// </summary>
        public CRM.Promotion HotPromo = null;

        public bool CheckOrders = true;

        /// <summary>
        /// Запрос ордеров для оптимизации запросов по наличию ордеров
        /// </summary>
        public IQueryable<Order> Orders = null;

        /// <summary>
        /// Делается ли бронирование в день заказа
        /// </summary>
        public bool IsToday; // => DFrom.ToShortDateString() == this.CreatedDate.ToShortDateString();


        /// <summary>
        /// Есть ли пакетные предложения в позициях 
        /// </summary>
        public bool HasPackage;
        public bool IsHold;

        /// <summary>
        /// Бронь актуальная (доступна к проверке)
        /// </summary>
        public bool IsActual() => !IsHold && Status != OrderStatus.Unknown;

        /// <summary>
        /// Бронь переводим в резервирование
        /// </summary>
        public bool IsCheckReserv() => CheckErrors && Status == OrderStatus.Reserv; // ограничиваем резерв по действию или статусу

        public int RoomSumR;
        public int DiscountPackage;
        public int PaidForfeit;

        public int
            Forfeit,
            //ForfeitSum,
            RoomDiscountSum,
            RoomClientDiscountSum,
            RoundSum,
            EqDiscountSum,
            EqClientDiscountSum,

            RoomPrice, 
            RoomSum,
            EqPrice, 
            //EqFullPrice, // полная цена без учета времени
            EqSum,
            EqPackage, // накопленное округление для пакетного предложения по оборудованию
            PointsSum, // Сумма оплаты баллами
            TotalPrice, 
            TotalOrder,
            TotalSum;


        public bool
            CheckErrors,
            IsPointsPay, // оплачиваем ли мы баллами
            PayForfeit,
            //IsHotAction, // Горящая репетиция, акция
            IsFixHours, // true, если часы были изменены
            FixHoursAsError = true // трактовать изменение часов как ошибку  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/35513/
            ;

        public DayKind DayKind;

        public StringBuilder Texts = new StringBuilder();

        public StringBuilder Errors = new StringBuilder();

        /// <summary>
        /// Есть ли другие заказы на это время
        /// </summary>
        public bool HasOrders = false;
        public bool Save = false;

		/// <summary>
		/// Признка ошибки - указанное время не входит в разрешенные часы
		/// </summary>
		public bool HoursError = false;

        /// <summary>
        /// Игнорирование минимальных длительностей - в этом случае у комнаты не проверяются минимальные интервалы, всегда берется заданный
        /// </summary>
        public bool IgnoreMinHours;

        /// <summary>
        /// Значение диапазона
        /// </summary>
        public int Range;

        //public IQueryable<T> Table<T>() where T : class
        //{
        //    return Db.GetTable<T>();
        //}

        public void SetHours()
        {
            var args = this; 

            // считаем часы
            if (args.Hour2 == 0)
                args.Hour2 = 24;

            //args.Hours = args.ToHour - args.FromHour;
            args.Hours = args.Hour2 - args.Hour1;
        }


    }

    /// <summary>
    /// Расчет условий для определенного временного промежутка
    /// </summary>
    public class TimeCalc
    {
        public Price Price;
        public readonly CRM.Promotion Promotion = new CRM.Promotion();
        public double Hour1;
        public double Hour2;

        public int OriginRoomPrice;

        public double RoomPrice;
        public double RoomDiscountSum;
        public double RoomClientDiscountSum;

        public int EqPrice;
        public int EqDiscountSum;
        public int EqClientDiscountSum;
        
    }

}




#region --- misc ---


//public OrderCalcResult Calculate()
//{
//    var args = this;
//    // расчет стоимости на основе правил

//    //service = service ?? new OrderCalcUtils();
//    OrderCalcUtils.сalculate(args);
//    //WebApp.Current.Services.Run(args);

//    var res = new OrderCalcResult
//    {
//        Forfeit = args.OrderForfeit,
//        ForfeitSum = args.ForfeitSum,
//        RoomPrice = args.RoomPrice,
//        EquipmentPrice = args.EqPrice,

//        TotalPrice = args.TotalSum, // Оставлено для совместимости!!! 2017-06-26 По просьбе Владимира - чтобы была совместимость со старым API
//        TotalSum = args.TotalSum,

//        IsFixHours = args.IsFixHours,
//        Hour1 = Convert.ToInt32(args.Hour1),
//        Hour2 = Convert.ToInt32(args.Hour2),
//        Hours = args.RoomHours,

//        PayForfeit = args.PayForfeit,

//        //IsRoomPromo = args.IsPromoRoom,
//        Text = args.Texts.ToString(),
//        Errors = args.Errors.ToString(),
//        IsAction = args.HotPromo != null,
//        HotDiscount = args.HotPromo?.Discount ?? 0,
//        //RoomClientDiscount = args.RoomPrice == 0 ?0 : 100 - 100 * args.RoomSum / args.RoomPrice,
//        //RoomClientDiscount = args.RoomPrice == 0 ? 0 : (int)Math.Ceiling(100.00 - 100.00 * args.RoomSum / args.RoomPrice),
//        RoomClientDiscount = args.RoomPrice == 0 ? 0 : SysUtils.Round5(100.00 - 100.00 * args.RoomSum / args.RoomPrice),
//    };

//    if (args.IsFixHours)
//    {
//        var h = (int)(args.DTo - args.DFrom).TotalHours;
//        res.TotalPrice = (int)Math.Ceiling(args.TotalSum * h / args.Hours); // совместимость!! https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/18970/
//    }
//    return res;
//}

#endregion

