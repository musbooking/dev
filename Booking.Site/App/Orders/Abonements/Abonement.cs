using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Itall.Models;
using LinqToDB.Data;
using Itall;
using LinqToDB;

namespace My.App.Orders
{
    public enum AbonementSourceKind
    {
        Web = 0,
        Series = 2,
    };

    [Table("abonements")]
    public class Abonement : Fin.Document, IArchivable
    {
        [Column("source")]
        public AbonementSourceKind Source { get; set; }

        [Column("description", Length = 0)]
        public string Description { get; set; }

        [Column("clientId")]
        public Guid? ClientId { get; set; }
        [Association(ThisKey = "ClientId", OtherKey = "Id")]
        public virtual CRM.Client Client { get; set; }

        [Column("baseId")]
        public Guid? BaseId { get; set; }
        [Association(ThisKey = "BaseId", OtherKey = "Id")]
        public virtual Base Base { get; set; }

        /// <summary>
        /// Комната по умолчантию
        /// </summary>
        [Column("roomId")]
        public Guid? RoomId { get; set; }
        [Association(ThisKey = "RoomId", OtherKey = "Id")]
        public virtual Room Room { get; set; }

        /// <summary>
        /// Промокод
        /// </summary>
        [Association(ThisKey = "PromoId", OtherKey = "Id")]
        public virtual CRM.Promotion Promo { get; set; }
        [Column("promoId")]
        public Guid? PromoId { get; set; }


        [Association(ThisKey = "ClientId,DomainId", OtherKey = "ClientId,DomainId", CanBeNull = true, IsBackReference = true)]
        public virtual CRM.ClientPart Part { get; set; }

        /// <summary>
        /// Опции группы
        /// </summary>
        [Column("options", Length = 0)]
        public string Options { get; set; }

        [Column("totalPrice")]
        public int TotalPrice { get; set; }

        [Column("discount")]
        public int Discount { get; set; }

        [Column("clientDiscount")]
        public int ClientDiscount { get; set; }

        [Column("dateFrom")]
        public DateTime DateFrom { get; set; }

        [Column("dateTo")]
        public DateTime DateTo { get; set; }


        /// <summary>
        /// Удалено кем
        /// </summary>
        [Column("deleledById")]
        public Guid? DeleledById { get; set; }

        [Association(ThisKey = "DeleledById", OtherKey = "Id")]
        public virtual Sys.User DeleledBy { get; set; }


        /// <summary>
        /// Список кодов оборудования, использованных в заказе
        /// </summary>
        [Column("equipments", Length = 0)]
        public string Equipments { get; set; }

        [Association(ThisKey = "Id", OtherKey = "AbonementId")]
        public List<Order> Orders;
        
        [Association(ThisKey = "Id", OtherKey = "AbonementId")]
        public List<Common.Message> Messages;

        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);
            DateFrom = DateTime.Now.ToMidnight(1);
            DateTo = DateFrom.AddMonths(1);
        }

        public override void OnDelete(DataConnection db)
        {
            db.GetTable<Common.Message>().Where(x => x.Order.AbonementId == this.Id).Delete();
            db.GetTable<Order>().Where(x => x.AbonementId == this.Id).Delete();
            base.OnDelete(db);
        }
    }
}
