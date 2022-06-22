using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy-security;
using LinqToDB.Mapping;
using Itall;

namespace My.App.CRM
{
    /// <summary>
    /// Вид промоакции
    /// </summary>
    public enum PromoKind
    {
        Action = 0,
        Number = 1,
        Rule = 2,
        Hot = 3,
    }


    [Table("promocodes")]
    public class Promotion: DbObject, IArchivable
    {
        [Column("name", Length = 100)]
        public string Name { get; set; }

        [Column("discount")]
        public int Discount { get; set; }

        [Column("discountSum")]
        public int DiscountSum { get; set; }

        [Column("eqDiscount")]
        public int EqDiscount { get; set; }

        [Column("description", Length = 0)]
        public string Description { get; set; }

        [Column("isDisabled")]
        public bool IsArchive { get; set; }

        [Column("isIgnoreEquipment")]
        public bool IsIgnoreEquipment { get; set; }

        /// <summary>
        /// Мин кол-во часов, https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/31064/ 
        /// </summary>
        [Column("minh")]
        public int MinHours { get; set; }

        //[Column("")]
        //public bool IsAction { get; set; }

        //[Column("")]
        //public bool IsAction { get; set; }

        [Column("isOverride")]
        public bool IsOverride { get; set; }

        [Column("cldk")]
        public DiscountKind ClientDiscountKind { get; set; }

        [Column("cldeq")]
        public DiscountKind EqClientDiscountKind { get; set; }

        [Column("type")]
        public PromoKind Type { get; set; }

        [Column("dayKinds", Length = 10)]
        public string DayKinds { get; set; }

        [Column("hours", Length = 100)]
        public string Hours { get; set; }

        //[Column("fix")]
        //public bool IsFixHours { get; set; }

        //[Column("", Length = 10)]
        //public string GroupKinds { get; set; }

        [Column("options", Length = 0)]
        public string Options { get; set; }     
        
        /// <summary>
        /// Диапазон С
        /// </summary>
        [Column("range1")]
        public int Range1 { get; set; }

        /// <summary>
        /// Диапазон По
        /// </summary>
        [Column("range2")]
        public int Range2 { get; set; }

        [Column("allowBaseIds", Length = 0)]
        public string AllowBaseIds { get; set; }

        [Column("allowRoomIds", Length = 0)]
        public string AllowRoomIds { get; set; }

        [Column("isToday")]
        public bool? IsToday { get; set; }

        [Column("dateFrom")]
        public DateTime? DateFrom { get; set; }

        [Column("dateTo")]
        public DateTime? DateTo { get; set; }

        [Column("maxo")]
        public int MaxOrders { get; set; }

        [Column("maxc")]
        public int MaxClientOrders { get; set; }

        [Column("domains", Length = 0)]
        public string AllowDomainIds { get; set; }


        public bool Allow(Orders.CalcArgs args)
        {
            checkInit();

            // проверка базы и комнаты
            var allowAny = _AllowBaseIds.Length == 0 && _AllowRoomIds.Length == 0;
            var allowBases = _AllowBaseIds.Contains(args.Room.BaseId.Value);
            var allowRooms = _AllowRoomIds.Contains(args.RoomId.Value);
            var allow = allowAny || allowBases || allowRooms;
            if (!allow )
                return false;

            // проверка только сегодня
            var now = args.Date; // DateTime.Now
            if (IsToday == true)
            {
                if (args.OrderDateH0.Year != now.Year) return false;
                if (args.OrderDateH0.Month != now.Month) return false;
                if (args.OrderDateH0.Day != now.Day) return false;
            }

            // проверка мин. длительности
            if (args.Hours < MinHours)
                return false;

            // проверка дат
            if (DateFrom.HasValue && args.OrderDateH0 < DateFrom) return false;
            if (DateTo.HasValue && args.OrderDateH0 > DateTo) return false;

            // проверка групп и типов дней
            if (_DayKinds != null && !_DayKinds.Contains(args.DayKind)) return false;

            // Проверка опций условий
            //if (_GroupKinds != null && !_GroupKinds.Contains(args.Group)) return false;
            //if (_Options.Length > 0 && args.Options != null && _Options.Intersect(args.Options).IsEmpty() )
            if (_OptionIds.Length > 0 && args.Options != null)
            {
                var check_range = (Range1 == 0 && Range2 == 0) || (Range1 <= args.Range && args.Range <= Range2);
                return check_range && _OptionIds.Intersect(args.Options).Any();  // оставляем старый вариант
                                                                          // иначе смотрим, чтобы была опция на предмет попадания в диапазон
                //_Options = new Group[0];
                //if (!string.IsNullOrWhiteSpace(Options))
                //{
                //    //var opt_ids = Options.ToGuids();
                //    var groups = DbCache.Groups.Get();
                //    _Options = Options.ToGuids()
                //        .Select(id => groups.GetValueOrDefault(id))
                //        .ToArray();
                //}

                //return false; //&& args.Options.Length > 0 - если опции не заданы, то игноририм
            }

            //// грубая проверка времени
            if (HoursSpans.Count == 0)
                return true;

            var res = this.Type == PromoKind.Rule || HoursSpans.Any(x => x.From == args.Hour1);
            return res;
        }

        /// <summary>
        /// Проверка доступности времени h1-h2
        /// </summary>
        public bool AllowTime(double h1, double h2)
        {
            checkInit();

            if (HoursSpans.Count == 0) // если не заданы периоды, то можно любые
                return true;

            //if (this.Type == PromoKind.Hot)
            //    return true; // Предполагаем, что горящая может всегда  HoursSpans.Any(dh => dh.From == h1);

            // проверка доступности времени
            return HoursSpans.Any(dh => dh.From <= h1 && h2 <= dh.To);
        }

        public void MergeWith(Promotion promo)
        {
            if(this.Discount< promo.Discount) this.Discount = promo.Discount;
            if (this.DiscountSum < promo.DiscountSum) this.DiscountSum = promo.DiscountSum;
            if (this.EqDiscount < promo.EqDiscount) this.EqDiscount = promo.EqDiscount;
            if (promo.ClientDiscountKind != DiscountKind.Undefined) this.ClientDiscountKind = promo.ClientDiscountKind;
            if (promo.EqClientDiscountKind != DiscountKind.Undefined) this.EqClientDiscountKind = promo.EqClientDiscountKind;
            //if(this.Type != PromoKind.Hot && promo.Type == PromoKind.Hot)
            //    this.Type = PromoKind.Hot;
        }

        bool _Init = false;
        DayKind[] _DayKinds;
        Guid[] _OptionIds;
        //Group[] _Options = null;
        Guid[] _AllowBaseIds;
        Guid[] _AllowRoomIds;

        internal List<HoursSpan> HoursSpans = new List<HoursSpan>();
        

        void checkInit()
        {
            if (_Init) return;

            _DayKinds = DayKinds.ToEnums<DayKind>();
            _OptionIds = Options.ToGuids();  // для совместимости старого варианта
            _AllowBaseIds = AllowBaseIds.ToGuids();
            _AllowRoomIds = AllowRoomIds.ToGuids();

            // load hours: [h1]-[h2],....
            HoursSpans.AddRange( HoursSpan.Parse(Hours) );

            _Init = true;
        }

        public override string ToString()
        {
            return $"{Name}: {this.Discount}%,{DiscountSum}% {Hours}";
        }

    }

}
