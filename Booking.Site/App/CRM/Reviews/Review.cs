using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.CRM
{

    /// <summary>
    /// Статус обработки отзыва
    /// </summary>
    public enum ReviewStatus
    {
        Unknown = 0,
        New = 1,
        Moderate = 2, // модерация
        Processed = 3,
        Changed = 4,
        Ok = 10,
        Cancel = 11, // удаление, отмена
    }


    /// <summary>
    /// Избранное пользователя
    /// </summary>
    [Table("reviews")]
    public class Review : DbObject, IArchivable
    {
        /// <summary>
        /// Дата сообщения
        /// </summary>
        [Column("date")]
        public DateTime Date { get; set; }

        /// <summary>
        /// Текст сообщения
        /// </summary>
        [Column("text", Length = 0)]
        public string Text { get; set; }

        ///// <summary>
        /////  Ответ пользователю
        ///// </summary>
        //[Column(Length = 0)]
        //public string Reply { get; set; }

        /// <summary>
        /// Оценка отзыва
        /// </summary>
        [Column("value")]
        public byte Value { get; set; }

        /// <summary>
        /// Статус обработки сообщения (отзыва)
        /// </summary>
        [Column("status")]
        public ReviewStatus Status { get; set; }

        [Column("groupId")]
        public Guid? GroupId { get; set; }
        [Association(ThisKey = "GroupId", OtherKey = "Id")]
        public virtual CRM.Group Group { get; set; }


        [Column("arch")]
        public bool IsArchive { get; set; }


        /// <summary>
        /// Заказ, по которому сформировано сообщение
        /// </summary>
        [Association(ThisKey = "OrderId", OtherKey = "Id")]
        public virtual Orders.Order Order { get; set; }
        [Column("orderId")]
        //[Index]
        public Guid? OrderId { get; set; }


        /// <summary>
        /// Пользователь, добавивший избранное
        /// </summary>
        [Association(ThisKey = "OwnerId", OtherKey = "Id")]
        public virtual Sys.User Owner { get; set; }
        [Column("ownerId")]
        public Guid? OwnerId { get; set; }

        /// <summary>
        /// Комната, которая была добавлена в избранное
        /// </summary>
        [Association(ThisKey = "RoomId", OtherKey = "Id")]
        public virtual Orders.Room Room { get; set; }
        [Column("roomId")]
        public Guid? RoomId { get; set; }
    }


}
