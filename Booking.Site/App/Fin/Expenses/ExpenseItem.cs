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
    [Table("expense_items")]
    public class ExpenseItem : DbObject
    {
        [Column("amount")]
        [DisplayName("Стоимость")]
        public int Amount { get; set; }

        [Column("description", Length = 0)]
        [DisplayName("Описание")]
        public string Description { get; set; }

        [Column("expenseId")]
        public Guid? ExpenseId { get; set; }
        [Association(ThisKey = "ExpenseId", OtherKey = "Id")]
        public virtual Expense Expense { get; set; }

        [Column("groupId")]
        [DisplayName("Статья")]
        [PropertyTab(GROUP_NAME)]
        public Guid? GroupId { get; set; }

        [Association(ThisKey = "GroupId", OtherKey = "Id")]
        public virtual CRM.Group Group { get; set; }


        //[Association(ThisKey = "Id", OtherKey = "ExpenseId")]
        //public List<ExpenseItem> Items;

    }
}
