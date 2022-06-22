using LinqToDB;
using My.App.Fin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App
{
    partial class DbConnection
    {
        public ITable<Transaction> Transactions => this.GetTable<Transaction>();

        public ITable<Expense> Expenses => this.GetTable<Expense>();

        public ITable<ExpenseItem> ExpenseItems => this.GetTable<ExpenseItem>();

        public ITable<PayChannel> PayChannels => this.GetTable<PayChannel>();

        public ITable<PayDoc> PayDocs => this.GetTable<PayDoc>();


    }

}
