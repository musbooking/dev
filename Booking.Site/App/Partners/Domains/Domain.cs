using My.App.Sys;
using LinqToDB;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Itall;
using LinqToDB.Data;

namespace My.App.Partners
{
    public enum DomainStatus
    {
        Unknown = 0,
        Payment = 1,

        Warning = 10,
        PredLock = 20,
        Locked = 30,

        Mamual = 100,
        New = 101,  // 58629
    }



    /// <summary>
    /// Признак автоматической рассылкы писем по почтам партнеров 
    /// - при начале желтого периода, 
    /// - оплате, 
    /// - за день до блокировки 
    /// - и после блокировки
    /// </summary>
    public enum OldDomainStatus 
    {
        Yellow = 1 << 0, //
        Paid = 1 << 1,
        BeforeBlock = 1 << 2,
        AfterBlock = 1 << 3,
        Test = 1 << 4,
    }

    /// <summary>
    /// Тип даты перехода по счету
    /// </summary>
    public enum PeriodKind
    {
        ByCreateDate = 1,
        ByServiceDate = 2,
    }



    [Table("domains")]
    public class Domain: ListItem
    {
        [Column("isArchive")] // для совместимости
        //public new bool IsArchive { get; set; }
        public new bool IsArchive
        {
            get { return base.IsArchive; }
            set { base.IsArchive = value; }
        }

        [Column("createDate")]
        public DateTime CreateDate { get; set; }

        [Column("email", Length = 150)]
        public string Email { get; set; }

        [Column("mailStatus")] // исторически, пока так
        public OldDomainStatus? OldStatus { get; set; }

        [Column("status")] // Новый статус
        public DomainStatus Status { get; set; }

        /// <summary>
        /// Тип границы периода для расчетов - по дате создания, либо оплаты
        /// </summary>
        [Column("period")]
        public PeriodKind Period { get; set; }

        /// <summary>
        /// Учитывать только оплаченные брони
        /// </summary>
        [Column("payment")]
        public bool IsPayment { get; set; }


        [Column("initDate")]
        public DateTime? InitDate { get; set; }

        //[Column("allowShare")]
        //public bool AllowShare { get; set; }

        [Column("cityId")]
        public Guid? CityId { get; set; }
        [Association(ThisKey = "CityId", OtherKey = "Id")]
        public virtual CRM.Group City { get; set; }

        /// <summary>
        /// Текущий тариф
        /// </summary>
        [Column("tarifId")]
        public Guid? TarifId { get; set; }
        [Association(ThisKey = "TarifId", OtherKey = "Id")]
        public virtual Tarif Tarif { get; set; }

        /// <summary>
        /// Список доступных тарифов
        /// </summary>
        [Column("tarifIds", Length = 0)]
        public string TarifIds { get; set; }

        [Column("terminal", Length = 50)]
        public string Terminal { get; set; }        
        
        
        [Column("inn", Length = 15)]
        public string Inn { get; set; }

        /// <summary>
        /// Список сфер
        /// </summary>
        [Column("sphereIds", Length = 0)]
        public string SphereIds { get; set; }

        /// <summary>
        /// Текущий баланс по партнерской зоне, в руб
        /// </summary>
        //[Column("")]
        //public int Balance { get; set; }

        /// <summary>
        /// Дата окончания текущего тарифного плана
        /// </summary>
        [Column("limitDate")]
        public DateTime? LimitDate { get; set; }

        [Column("phone")]
        public string Phone { get; internal set; }

        //[Column("")]
        //public bool IsLimit { get; internal set; }

        [Association(ThisKey = "Id", OtherKey = "PayerDomId")]
        public List<Fin.PayDoc> PayDocs;


        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);

            if(CreateDate == DateTime.MinValue)
                CreateDate = DateTime.Now;  // 82371
        }

        // 2018-02-16 запрещаем удаление, чтобы избежать больших проблем
        //public override void OnDelete(LinqToDB.Data.DataConnection db)
        //{
        //    db.GetTable<Permission>().Where(x => x.DomainId == this.Id).Delete(); // удаляем всех пользователей домена
        //    db.GetTable<User>().Where(x => x.DomainId == this.Id).Delete(); // удаляем всех пользователей домена
        //    db.GetTable<Role>().Where(x => x.DomainId == this.Id).Delete(); // удаляем всех пользователей домена

        //    base.OnDelete(db);
        //}

        public bool CheckLimit(int delta = 0)
        {
            return LimitDate == null || (DateTime.Now - LimitDate.Value).TotalDays < delta ;
        }

        /// <summary>
        /// Сколько у нас осталось до лимита??
        /// </summary>
        /// <returns></returns>
        public int GetRemains(int limitDays)
        {
            if (this.LimitDate == null)
                return 365; // для анализа ошибка

            var d0 = DateTime.Now.ToMidnight();
            var d1 = this.LimitDate.Value.ToMidnight();

            if (d1 < DateTime.Now) // если лимит уже пройден
            {
                var dd1 = (d0 - d1).TotalDays;
                return limitDays - Convert.ToInt32(dd1);
            }
            else // если лимит впереди
            {
                var dd = (d1 - d0).TotalDays;
                return Convert.ToInt32(dd);
            }
        }

    }

}
