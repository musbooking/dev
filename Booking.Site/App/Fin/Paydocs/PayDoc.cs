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

namespace My.App.Fin
{
    [Table("paydocs")]
    public class PayDoc : Fin.Document
    {
        public PayDoc()
        {

        }


        /// <summary>
        /// Цена за единицу услуги
        /// </summary>
        [Column("price")]
        public int Price { get; set; }

        /// <summary>
        /// Оплата мобильной комиссии
        /// </summary>
        [Column("mobComm")]
        public int MobComm { get; set; }


        /// <summary>
        /// Кол-во единиц услуги
        /// </summary>
        [Column("count")]
        public int Count { get; set; }


        /// <summary>
        /// Сумма оплаты
        /// </summary>
        [Column("total")]
        public int Total { get; set; }

        /// <summary>
        /// Документ проведен и закрыт
        /// </summary>
        [Column("isCompleted")]
        public bool IsCompleted { get; set; }

        /// <summary>
        /// Описание документа
        /// </summary>
        [Column("description", Length = 0)]
        public string Description { get; set; }

        /// <summary>
        /// Системный отклик платежного сервиса
        /// </summary>
        [Column("result", Length = 0)]
        public string PayResult { get; set; }

        /// <summary>
        /// Какой домен оплачивается (ИД)
        /// </summary>
        [Column("payerDomId")]
        public Guid? PayerDomId { get; set; }
        /// <summary>
        /// Какой домен оплачивается
        /// </summary>
        [Association(ThisKey = "PayerDomId", OtherKey = "Id")]
        public virtual Partners.Domain PayerDom { get; set; }

        /// <summary>
        /// Дата создания платежки
        /// </summary>
        [Column("date")]
        public DateTime Date { get; set; }

        /// <summary>
        /// Дата проведения оплаты
        /// </summary>
        [Column("payDate")]
        public DateTime? PayDate { get; set; }


        [Column("tarifId")]
        public Guid? TarifId { get; set; }
        [Association(ThisKey = "TarifId", OtherKey = "Id")]
        public virtual Partners.Tarif Tarif { get; set; }

        /// <summary>
        /// Создатель (ИД)
        /// </summary>
        [Column("createdById")]
        public Guid? CreatedById { get; set; }
        /// <summary>
        /// Создатель
        /// </summary>
        [Association(ThisKey = "CreatedById", OtherKey = "Id")]
        public virtual Sys.User CreatedBy { get; set; }

        [Column("fio", Length = 0)]
        public string FIO { get; set; }

        [Column("phone", Length = 0)]
        public string Phone { get; set; }

        [Column("mobPhone", Length = 0)]
        public string MobPhone { get; set; }

        [Column("email", Length = 0)]
        public string Email { get; set; }

        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);
            Date = DateTime.Now;
        }


    }
}
