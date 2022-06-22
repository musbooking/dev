using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{
    [Table("prices")]
    public class Price: DbObject, IArchivable
    {
        [Column("description", Length = 0)]
        public string Description { get; set; }

        [Column("baseId")]
        public Guid? BaseId { get; set; }
        [Association(ThisKey = "BaseId", OtherKey = "Id")]
        public virtual Base Base { get; set; }

        [Column("roomId")]
        public Guid? RoomId { get; set; }
        [Association(ThisKey = "RoomId", OtherKey = "Id")]
        public virtual Room Room { get; set; }

        [Column("promoId")]
        public Guid? PromoId { get; set; }
        [Association(ThisKey = "PromoId", OtherKey = "Id")]
        public virtual CRM.Promotion Promo { get; set; }

        [Column("timeFrom")]
        public int TimeFrom { get; set; }
        [Column("timeTo")]
        public int TimeTo { get; set; }

        [Column("workingPrice")]
        public int WorkingPrice { get; set; }

        /// <summary>
        /// Последний рабочий день
        /// </summary>
        [Column("workingLPrice")]
        public int WorkingLPrice { get; set; }

        /// <summary>
        /// Первый рабочий день
        /// </summary>
        [Column("workingFPrice")]
        public int WorkingFPrice { get; set; }

        [Column("weekend1Price")]
        public int Weekend1Price { get; set; }
        
        [Column("weekendPrice")]
        public int Weekend2Price { get; set; }

        [Column("dateFrom")]
        public DateTime? DateFrom { get; set; }

        [Column("dateTo")]
        public DateTime? DateTo { get; set; }


        [Column("isArchive")]
        public bool IsArchive { get; set; }

        [Column("clientDiscountKind")]
        public DiscountKind ClientDiscountKind { get; set; }


        public int GetPrice(DayKind daykind)
        {
            switch (daykind)
            {
                case DayKind.WorkFirstDay:
                    return WorkingFPrice>0 ?WorkingFPrice :WorkingPrice;

                case DayKind.WorkDay:
                    return WorkingPrice;

                case DayKind.WorkLastDay:
                    return WorkingLPrice > 0 ? WorkingLPrice : WorkingPrice; 

                case DayKind.Weekend1:
                    return Weekend1Price > 0 ? Weekend1Price :Weekend2Price;

                case DayKind.Weekend2:
                    return Weekend2Price;

                default:
                    throw new Exception("Unknown day kind: "+ daykind);
            }
        }

        // расчет минимальной цены
        public int? Min()
        {
            var p = this;
            var res = p.Weekend2Price;

            if (p.Weekend1Price > 0 && p.Weekend1Price < res) res = p.Weekend1Price;
            if (p.WorkingFPrice > 0 && p.WorkingFPrice < res) res = p.WorkingFPrice;
            if (p.WorkingLPrice > 0 && p.WorkingLPrice < res) res = p.WorkingLPrice;
            if (p.WorkingPrice > 0 && p.WorkingPrice < res) res = p.WorkingPrice;
            return res;
        }

        // расчет макс цены
        public int? Max()
        {
            var p = this;
            var res = p.Weekend2Price;

            if (p.Weekend1Price > 0 && p.Weekend1Price > res) res = p.Weekend1Price;
            if (p.WorkingFPrice > 0 && p.WorkingFPrice > res) res = p.WorkingFPrice;
            if (p.WorkingLPrice > 0 && p.WorkingLPrice > res) res = p.WorkingLPrice;
            if (p.WorkingPrice > 0 && p.WorkingPrice > res) res = p.WorkingPrice;
            return res;
        }


    }


}
