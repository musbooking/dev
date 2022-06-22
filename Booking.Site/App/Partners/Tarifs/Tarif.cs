using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Partners
{
    [Table("tarifs")]
    public class Tarif : ListItem
    {
        //[Column("", Length = 150)]
        //public string Name { get; set; }

        //[Column("", Length = 0)]
        //public string Description { get; set; }


        [Column("price")]
        public int Price { get; set; }

        /// <summary>
        /// Комиссия за резервирование
        /// </summary>
        [Column("comm")]
        public int Commission { get; set; }

        /// <summary>
        /// Комиссия за оплаченные
        /// </summary>
        [Column("paycomm")]
        public int PayCommission { get; set; }

        /// <summary>
        /// Вложенные тарифы
        /// </summary>
        [Column("tarifs", Length = 0)]
        public string TarifIds { get; set; }

        /// <summary>
        /// Разрешенные сферы
        /// </summary>
        [Column("spheres", Length = 0)]
        public string SphereIds { get; set; }

        /// <summary>
        /// Цена за одно бронирование
        /// </summary>
        [Column("price1")]
        public int Price1 { get; set; }

        /// <summary>
        /// Макс кол-во мес, на которое может происходить оплата
        /// </summary>
        [Column("months")]
        public int Months { get; set; }

        /// <summary>
        /// Назначение позиции
        /// </summary>
        [Column("dest")]
        public Orders.EqDestKind DestKind { get; set; }

        /// <summary>
        /// Есть ли вложенные тарифы
        /// </summary>
        public bool HasTarifs => !string.IsNullOrWhiteSpace(this.TarifIds);


        public Tarif[] Children = null;

        public Guid[] CachedSphereIds = null;

        public override string ToString()
        {
            return $"{Name}: {Price} руб + {Commission}%";
        }


    }


}
