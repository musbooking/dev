using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.CRM
{
    /// <summary>
    /// Тип группы
    /// </summary>
    public enum GroupType
    {
        Equipment = 1,
        ContactType = 2,
        City = 3,
        Tool = 4,            // музыкальные инструменты
        MusicStyle = 5,
        ActivityType = 6,   // вид деятельности
        Skill = 7,
        Activity = 8,       // Вид деятельности (не используется)
        Genre = 9,
        RoomFeature = 10,
        Expense = 11,
        Version = 12,
        Sphere = 13,
        OrderOption = 14,
        FeatureType = 15,
        Reviews = 16, // Справочник отзывов

        //Fin = 17,   // финансовые регистры, операции, детализации
        //FinOperation = 22,  // финансовая операция
        //FinDetails = 23,    // финансовая детализация по операции
    }


    [Table("groups")]
    public class Group : ListItem, IOrderable
    {
        public static readonly Group Empty = new Group{ Name = "(Не найдено)" };

        [Column("type")]
        [Itall.Index]
        public GroupType Type { get; set; }

        [Column("categoryId")]
        public Guid? CategoryId { get; set; }

        /// <summary>
        /// КАтегория группы, тип
        /// </summary>
        [Association(ThisKey = "CategoryId", OtherKey = "Id")]
        public Group Category { get; set; }


        [Column("key", Length = 100)]
        public string Key { get; set; } // For Bitrix convert        

        //[Column("", Length = 0)]
        //public string Description { get; set; } // For Bitrix convert

        [Column("values", Length = 0)]
        public string Values { get; set; } // For extensions properties   

        /// <summary>
        /// List of bases
        /// </summary>
        [Column("spheres", Length = 0)]
        public string SphereIds { get; set; } 

        //[Column("")]
        //public bool IsArchive { get; set; }
        [Column("isArchive")]
        public new bool IsArchive
        {
            get { return base.IsArchive; }
            set { base.IsArchive = value; }
        }

        /// <summary>
        /// Является ли опция рангом
        /// </summary>
        [Column("isRange")]
        public bool IsRange { get; set; }

        ///// <summary>
        ///// Финансовая группа
        ///// </summary>
        //[Column("fin")] 
        //public int Fin { get; set; }

        [Column("order")] // оставлено для совместимости
        public int Index { get; set; }

        [Column("gpsLong")]
        public double GpsLong { get; set; }

        [Column("gpsLat")]
        public double GpsLat { get; set; }

        /// <summary>
        /// image path (сферы)
        /// </summary>
        [Column("icon", Length = 0)]
        public string Icon { get; set; } 

        /// <summary>
        /// Срок бронирования, мес (для сфер)
        /// </summary>
        [Column("limitM") ]
        public byte LimitM { get; set; }

        /// <summary>
        /// Срок бронирования, дней
        /// </summary>
        [Column("limitD")]
        public byte LimitD { get; set; }

        /// <summary>
        /// Значение по умолчанию
        /// </summary>
        [Column("default", Length = 50)]
        public string Default { get; set; }
    }


}
