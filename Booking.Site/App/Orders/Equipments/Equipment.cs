using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{
    /// <summary>
    /// Назначение позиции (оборудования)
    /// </summary>
    public enum EqDestKind
    {
        Addition = 1,  // Дополнительно к заказу
        Package = 2,   // Пакетное предложение
    }
    
    public enum EqKind
    {
        None = 0,
        Other = 1,   // Прочее
        Equipment = 2,   // Оборудование
        Service = 3,   // Услуги
    }


    [Table("equipments")]
    public class Equipment : DbObject, IArchivable
    {
        [Column("name", Length = 150)]
        public string Name { get; set; }

        [Column("description", Length = 0)]
        public string Description { get; set; }

        [Column("groupId")]
        public Guid? GroupId { get; set; }
        [Association(ThisKey = "GroupId", OtherKey = "Id")]
        public virtual CRM.Group Group { get; set; }

        /// <summary>
        /// Разрешенная База (Объект)
        /// </summary>
        [Column("baseId")]
        public Guid? BaseId { get; set; }
        [Association(ThisKey = "BaseId", OtherKey = "Id")]
        public virtual Base Base { get; set; }

        /// <summary>
        /// Список разрешенных площадок
        /// </summary>
        [Column("roomIds", Length = 0)]
        public string RoomIds { get; set; }


        [Column("price")]
        public int Price { get; set; }

        [Column("count")]
        public int Count { get; set; }


        /// <summary>
        /// Настройки Кф - блок времени
        /// согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/41005/
        /// </summary>
        [Column("kf")]
        public int Kf { get; set; }

        [Column("mobile")]
        public bool AllowMobile { get; set; }

        [Column("isArchive")]
        public bool IsArchive { get; set; }

        /// <summary>
        /// Назначение позиции
        /// </summary>
        [Column("dest")]
        public EqDestKind DestKind { get; set; }
        
        /// <summary>
        /// Тип позиции
        /// </summary>
        [Column("kind")]
        public EqKind Kind { get; set; }

        /// <summary>
        /// Не учитывается время брони
        /// </summary>
        //[Column("skip_time")]
        //public bool IsSkipTime { get; set; }

        /// <summary>
        /// Фотография
        /// </summary>
        [Column("photoUrl", Length = 0)]
        public string PhotoUrl { get; set; }

    }
}
