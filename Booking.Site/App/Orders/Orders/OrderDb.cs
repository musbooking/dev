using LinqToDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using My.App.Orders;
using Itall;

namespace My.App
{
    partial class DbConnection
    {
        public OrderDb OrdersDb => getService<OrderDb>(); 

        private Dictionary<Type, object> _cache = new Dictionary<Type, object>();
        protected T getService<T>() => (T)_cache.GetOrAddValue(typeof(T), t=> Activator.CreateInstance<T>());
    }

    public class OrderDb
    {
        public OrderDb()
        {
            var t = 45;
        }
    };


}
