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
using System.ComponentModel;

namespace My.App.CRM
{
    /// <summary>
    /// Тип начислений или удержаний
    /// </summary>
    public enum PointKind
    {
        // приходы
        Registration = 1,
        Profile = 2,
        Booking = 3,
        Invite = 4,  // За приглашение
        Manual = 5,  // Принудительное начисление
        //Auto = 6,   // автоматическая операция сервиса
        // расходы
        Payment = 10,
        RetBooking = 11,  // возврат баллов при отмене бронирования
    }

    /// <summary>
    /// Табдица движения баллов
    /// </summary>
    [Table("points")]
    public class Point : DbObject
    {
        /// <summary>
        /// Вид начисления удержания баллов
        /// </summary>
        [Column("kind")]
        public PointKind Kind { get; set; }

        /// <summary>
        /// Дата проведения
        /// </summary>
        [Column("date")]
        public DateTime Date { get; set; }


        /// <summary>
        /// Кол-во баллов
        /// </summary>
        [Column("count")]
        public int Count { get; set; }


        /// <summary>
        /// Пояснительный текст
        /// </summary>
        [Column("description", Length = 0)]
        public string Description { get; set; }


        /// <summary>
        /// Ссылка на пользователя, по которому происходит оплата
        /// </summary>
        [Column("userId")]
        public Guid? UserId { get; set; }
        [Association(ThisKey = "UserId", OtherKey = "Id")]
        public virtual Sys.User User { get; set; }

        /// <summary>
        /// Создатель (ИД)
        /// </summary>
        [Column("createdById")]
        public Guid? CreatedById { get; set; }
        [Association(ThisKey = "CreatedById", OtherKey = "Id")]
        public virtual Sys.User CreatedBy { get; set; }

        /// <summary>
        /// Заказ, по которому сформировано сообщение
        /// </summary>
        [Column("orderId")]
        public Guid? OrderId { get; set; }
        [Association(ThisKey = "OrderId", OtherKey = "Id")]
        public virtual Orders.Order Order { get; set; }


        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);
            if(Date == DateTime.MinValue)
                Date = DateTime.Now;
        }


    }
}
