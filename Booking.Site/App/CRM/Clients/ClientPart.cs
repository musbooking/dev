using Itall;
using LinqToDB.Mapping;
using My.App.Orders;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.CRM
{
    /// <summary>
    /// Степень доверия к клиенту в партнерской зоне
    /// </summary>
    public enum ClientPayKind
    {
        Default = 1,
        Trust = 2,
        Doubt = 3,
        Card = 4,  // только по карте  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/33029/
    }

    /// <summary>
    /// Часть клиентской информации, относящейся к контексту домена
    /// </summary>
    [Table("client_parts")]  
    public class ClientPart : DbObject
    {
        public static readonly ClientPart Empty = new ClientPart { _TempEventId = 10 };

        public ClientPart()
        {

        }

        [Column("clientId")]
        [Index]
        public Guid ClientId { get; set; }
        [Association(ThisKey = "ClientId", OtherKey = "Id")]
        public virtual Client Client { get; set; }


        //[Column("domainId")]
        //[Itall.Index]
        //public new Guid DomainId { get; set; }


        [Column("discount")]
        [DisplayName("% скидки")]
        public int Discount { get; set; }

        [Column("isBanned")]
        [DisplayName("Бан")]
        public bool IsBanned { get; set; }


        [Column("forfeit")]
        public int Forfeit { get; set; }

        [Column("payKind")]
        public ClientPayKind PayKind { get; set; }

        /// <summary>
        /// Временное значение - для отслеживания события
        /// </summary>
        [Column("temp_val")]
        public byte _TempEventId { get; set; }


    }

}



#region --- Misc ---



        //[Column("forderId")]
        ////[Index]
        //public Guid? ForfeitOrderId { get; set; }
        //[Association(ThisKey = "ForfeitOrderId", OtherKey = "Id")]
        //public virtual Order ForfeitOrder { get; set; }



        ///// <summary>
        ///// УБИРАЕМ!! Штраф оплачен, но еще не закрыт
        ///// </summary>
        //[Column("pay")]
        //[DisplayName("Оплата")]
        //public bool IsPayed { get; set; }

        //[Column("hasWarnings")]
        //public bool HasWarnings { get; set; }

        //[Column("promoCode", Length = 15)]
        //public string PromoCode { get; set; }

        //[Column("cardNum", Length = 15)]
        //public string CardNum { get; set; }


        ///// <summary>
        ///// Допустима ли оплата штрафа по данному клиенту и партнеру
        ///// </summary>
        //public bool AllowForfeit(Guid? orderid)
        //{
        //    var part = this;
        //    if (part.Forfeit == 0) return false;
        //    return part.ForfeitOrderId == null || part.ForfeitOrderId == orderid;
        //}

        //[Column("assignedName", Length = 50)]
        //public string AssignedName { get; set; }

        //[Column("editorName", Length = 50)]
        //public string EditorName { get; set; }

#endregion
