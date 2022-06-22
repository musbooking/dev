using LinqToDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using My.App.Common;

namespace My.App
{
    partial class DbConnection
    {
        public ITable<Resource> Resources => this.GetTable<Resource>();

        public ITable<Day> Days => this.GetTable<Day>();

        public ITable<Message> Messages => this.GetTable<Message>();

    }

}
