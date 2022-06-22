using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{
    /// <summary>
    /// Тип сферы
    /// </summary>
    public enum SphereKind
    {
        Usual = 1,
        Teachers = 2,
    }


    [Table("spheres")]
    public class Sphere : ListItem, IOrderable
    {
        [Column("kind")]
        public SphereKind Kind { get; set; }


        [Column("index")]
        public int Index { get; set; }

        /// <summary>
        /// image path (сферы)
        /// </summary>
        [Column("icon", Length = 0)]
        public string Icon { get; set; } 

        /// <summary>
        /// Срок бронирования, мес (для сфер)
        /// </summary>
        [Column("limitM")]
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

        /// <summary>
        /// Список опций
        /// </summary>
        [Column("values", Length = 0)]
        public string Values { get; set; } // For extensions properties   

        /// <summary>
        /// Параметры комнат
        /// </summary>
        [Column("features", Length = 0)]
        public string Features { get; set; }


    }


}
