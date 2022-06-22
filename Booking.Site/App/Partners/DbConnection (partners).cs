using LinqToDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using My.App.Partners;

namespace My.App
{
    partial class DbConnection
    {

        public ITable<Domain> Domains => this.GetTable<Domain>();

        public ITable<DiscountRule> DiscountRules => this.GetTable<DiscountRule>();

        public ITable<Tarif> Tarifs => this.GetTable<Tarif>();

    }

}
