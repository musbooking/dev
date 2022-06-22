using Itall;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Fin
{
    /// <summary>
    /// Тип платежного канала
    /// </summary>
    public enum PayChannelKind
    {
        Cash = 1,
        Instruction = 2,
        Online = 3,
    }

    [Table("pay_channels")]  
    public class PayChannel : ListItem
    {
        /// <summary>
        /// Ссылка на предоплату
        /// </summary>
        [Column("prepayUrl", Length = 0)]
        public string PrepayUrl { get; set; }

        [Column("forfeit1")]
        public int Forfeit1 { get; set; }

        [Column("forfeit2")]
        public int Forfeit2 { get; set; }

        [Column("total1")]
        public int Total1 { get; set; }

        [Column("total2")]
        public int Total2 { get; set; }

        [Column("kind")]
        public PayChannelKind Kind { get; set; }

        /// <summary>
        /// % от оплаты заказа
        /// </summary>
        [Column("pc")]
        public int PartPc { get; set; }

        /// <summary>
        /// Тип источника брони  Orders.SourceType
        /// </summary>
        [Column("sources", Length = 20)]
        public string Sources { get; set; }


        /// <summary>
        /// Оплата штрафа
        /// </summary>
        [Column("isForfeits")]
        public bool IsForfeits { get; set; }



        //[Column("", Length = 0)]
        //public string AllowBaseIds { get; set; }

        ///// <summary>
        ///// Предоплата
        ///// </summary>
        //[Column("")]
        //public bool IsPrepay { get; set; }


        ///// <summary>
        ///// Предоплата только по заявке
        ///// </summary>
        //[Column("")]
        //public bool IsRequest { get; set; }

    }


}
