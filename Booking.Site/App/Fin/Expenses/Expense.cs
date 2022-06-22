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
    [Table("expenses")]
    public class Expense : Document
    {
        [Column("isPublic")]
        [DisplayName("Проведенo")]
        public bool IsPublic { get; set; }

        [Column("description", Length = 0)]
        [DisplayName("Описание")]
        public string Description { get; set; }

        [Column("baseId")]
        [DisplayName("База")]
        [PropertyTab(BASE_NAME)]
        public Guid? BaseId { get; set; }
        [Association(ThisKey = "BaseId", OtherKey = "Id")]
        public virtual Orders.Base Base { get; set; }


        [Column("date")]
        [DisplayName("Дата")]
        public DateTime Date { get; set; }

        /// <summary>
        /// Удалено кем
        /// </summary>
        [Column("createdById")]
        public Guid? CreatedById { get; set; }

        [Association(ThisKey = "CreatedById", OtherKey = "Id")]
        public virtual Sys.User CreatedBy { get; set; }

        [Association(ThisKey = "Id", OtherKey = "ExpenseId")]
        public List<ExpenseItem> Items;

        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);
            Date = DateTime.Now;
        }

    }
}
