using Itall;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB.Data;
using System.ComponentModel;

namespace My.App.Common
{
    /// <summary>
    /// Тип сообщения
    /// </summary>
    public enum MessageKind
    {
        Unknown = 0,
        User = 1,
        System = 2,
        Error = 3,
        Bitrix = 4,
        Review = 5, // отзыввы 
        Job = 6,  // Job message
        Calendar = 7,  // история по календарю
        ViewRoom = 8,  // просмотр комнаты
    }


    [Table("messages")]
    public class Message: DbObject
    {
        public Message()
        {

        }

        //public override void OnCreating(DataConnection db)
        //{
        //    base.OnCreating(db);
        //    //Scope = ScopeType.Zone;
        //}


        /// <summary>
        /// Дата сообщения
        /// </summary>
        [Column("date")]
        [Index]
        public DateTime Date { get; set; }

        /// <summary>
        /// Пользователь, сформировавший сообщение
        /// </summary>
        [Association(ThisKey = "SenderId", OtherKey = "Id")]
        public virtual Sys.User Sender { get; set; }
        [Column("senderId")]
        [Index]
        public Guid? SenderId { get; set; }

        /// <summary>
        /// Заказ, по которому сформировано сообщение
        /// </summary>
        [Association(ThisKey = "OrderId", OtherKey = "Id")]
        public virtual Orders.Order Order { get; set; }
        [Column("orderId")]
        [Index]
        public Guid? OrderId { get; set; }

        /// <summary>
        /// Абонемент, по которому сформировано сообщение
        /// </summary>
        [Association(ThisKey = "AbonementId", OtherKey = "Id")]
        public virtual Orders.Abonement Abonement { get; set; }
        [Column("abonementId")]
        [Index]
        public Guid? AbonementId { get; set; }

        /// <summary>
        /// Документ оплаты, по которому сформировано сообщение
        /// </summary>
        [Association(ThisKey = "PayDocId", OtherKey = "Id")]
        public virtual Fin.PayDoc PayDoc { get; set; }
        [Column("payDocId")]
        [Index]
        public Guid? PayDocId { get; set; }

        /// <summary>
        /// Клиент
        /// </summary>
        [Column("clientId")]
        [Index]
        public Guid? ClientId { get; set; }
        [Association(ThisKey = "ClientId", OtherKey = "Id")]
        public virtual CRM.Client Client { get; set; }


        [Column("expenseId")]
        [Index]
        public Guid? ExpenseId { get; set; }
        [Association(ThisKey = "ExpenseId", OtherKey = "Id")]
        public virtual Fin.Expense Expense { get; set; }

        /// <summary>
        /// Текст сообщения
        /// </summary>
        [Column("text", Length = 0)]
        public string Text { get; set; }

        [Column("kind")]
        [Index]
        public MessageKind Kind { get; set; }


        [Column("scope")]
        [Index]
        public ScopeType Scope { get; set; }

        /// <summary>
        /// Статус объекта - напр, отзыва
        /// </summary>
        [Column("status")]
        public byte Status { get; set; }

        /// <summary>
        /// Сссылка на объект
        /// </summary>
        [Column("jobId")]   //TODO:  переименовать в objId !!
        public Guid? ObjectId { get; set; }

        [Association(ThisKey = "ObjectId", OtherKey = "Id", IsBackReference = true)]
        public virtual Sys.JobEntity Job { get; set; }

        [Association(ThisKey = "ObjectId", OtherKey = "Id", IsBackReference = true)]
        public virtual Calendars.Calendar Calendar { get; set; }

    }


}

#region Misc
        ///// <summary>
        ///// Комната, по которой прошел отзыв
        ///// </summary>
        //[Association(ThisKey = "RoomId", OtherKey = "Id")]
        //public virtual Orders.Room Room { get; set; }
        //[Column("")]
        //public Guid? RoomId { get; set; }

        // TODO: сделать очередь задач
        //[Column("")]
        //public bool IsRun { get; set; } 
#endregion
