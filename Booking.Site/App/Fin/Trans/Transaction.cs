using Itall;
using LinqToDB.Data;
using LinqToDB.Mapping;
using My.App.Orders;
using My.App.Partners;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Fin
{

    /// <summary>
    /// Финансовая транзакция
    /// </summary>
    [Table("trans")]  
    public class Transaction : DbObject
    {
        public Transaction()
        {

        }

        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);
            if (Date == DateTime.MinValue)
                Date = DateTime.Now;
        }


        [Column("date")]
        [Index]
        public DateTime Date { get; set; }

        [Column("total")]
        public int Total { get; set; }

        [Column("text", Length = 0)]
        public string Text { get; set; }

        /// <summary>
        /// Ключевой признак, по которому выделяются группы транзакций (заказ, партнер, клиент, и т.п.)
        /// </summary>
        //[Column("key")]
        //[Index]
        //public Guid? KeyId { get; set; }

        // ГРУППЫ признаков

        [Column("reg")]
        [Index]
        public int Register { get; set; }
        //[Association(ThisKey = "Register", OtherKey = "Fin", IsBackReference = true)]
        //public CRM.Group RegisterGroup;

        [Column("oper")]
        [Index]
        public int Operation { get; set; }
        [Association(ThisKey = "Operation", OtherKey = "Fin", IsBackReference = true)]
        public CRM.Group OperationGroup;

        [Column("det")]
        [Index]
        public int Details { get; set; }
        [Association(ThisKey = "Details", OtherKey = "Fin", IsBackReference = true)]
        public CRM.Group DetailsGroup;


        //  АНАЛИТИКА

        [Column("docId")]
        public Guid? DocumentId { get; set; }


        [Column("clientId")]
        [Index]
        public Guid? ClientId { get; set; }
        [Association(ThisKey = "ClientId", OtherKey = "Id", IsBackReference = true)]
        public CRM.Client Client { get; set; }


        /// <summary>
        /// Пользователь - владелец проводки 
        ///     (используется в некоторых операциях)
        /// </summary>
        [Column("userId")]
        public Guid? UserId { get; set; }
        [Association(ThisKey = "UserId", OtherKey = "Id", IsBackReference = true)]
        public Sys.User User { get; set; }


        //[Column("userId")]
        //public Guid? UserId { get; set; }
        //[Association(ThisKey = "UserId", OtherKey = "Id", IsBackReference = true)]
        //public Sys.User User { get; set; }

        /// <summary>
        /// Заказ
        /// </summary>
        [Column("orderId")]
        [Index]
        public Guid? OrderId { get; set; }       
        [Association(ThisKey = "OrderId", OtherKey = "Id", IsBackReference = true)]
        public Orders.Order Order { get; set; }

        [Column("room_id")]
        public Guid? RoomId { get; set; }
        [Association(ThisKey = "RoomId", OtherKey = "Id", IsBackReference = true)]
        public Room Room;

        [Column("base_id")]
        public Guid? BaseId { get; set; }
        [Association(ThisKey = "BaseId", OtherKey = "Id", IsBackReference = true)]
        public Base Base;


        [Column("sphere_id")]
        public Guid? SphereId { get; set; }
        [Association(ThisKey = "SphereId", OtherKey = "Id", IsBackReference = true)]
        public Sphere Sphere;

        /// <summary>
        /// Перекрываем текущий DomainId исторически, потом надо заменить на стандартный 
        /// </summary>
        [Column("domain_id")]
        public new Guid? DomainId { get; set; }
        //[Association(ThisKey = "DomainId", OtherKey = "Id", IsBackReference = true)]
        //public Domain Domain;


        [Column("eq_id")]
        public Guid? EquipmentId { get; set; }
        [Association(ThisKey = "EquipmentId", OtherKey = "Id", IsBackReference = true)]
        public Equipment Equipment;

        [Column("group_id")]
        public Guid? GroupId { get; set; }
        [Association(ThisKey = "GroupId", OtherKey = "Id", IsBackReference = true)]
        public CRM.Group Group;

        [Column("promo_id")]
        public Guid? PromoId { get; set; }
        [Association(ThisKey = "PromoId", OtherKey = "Id", IsBackReference = true)]
        public CRM.Promotion Promo;

    }

}


#region Misc

//public enum Register
//{
//    Service = 1,    // Услуги
//    Clients = 2,    // Расчеты с клиентами
//    Wallets = 3,    // Электронный кошелек
//    Points = 4,     // Баллы
//    Partners = 5,   // Расчеты с партнерами
//}


//public enum Operation
//{
//    Reserv = 1,         // Резервирование
//    Service = 2,        // Услуга аренды
//    Payment = 3,        // Оплата руб
//    Cancel = 4,         // Отмена брони
//    Forfeit = 5,        // Начисление  штрафа
//    SettOff = 6,        // Зачет кошелька в оплату
//    Accrual = 7,        // Начисление баллов
//    PointsOff = 8,      // Зачет баллами в оплату
//    Commission = 9,     // Начисление комиссии
//    Tarif = 10,          // Начисление оплаты по комиссии
//    PaymentPartner = 11, // Оплата партнера по счету
//}

//public enum Details
//{

//}


//public static class Operations
//{
//    public static 
//}

#endregion