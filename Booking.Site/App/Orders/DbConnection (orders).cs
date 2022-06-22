using LinqToDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using My.App.Orders;

namespace My.App
{
    partial class DbConnection
    {

        public ITable<Base> Bases => this.GetTable<Base>();

        public ITable<Room> Rooms => this.GetTable<Room>();

        public ITable<Equipment> Equipments => this.GetTable<Equipment>();

        public ITable<Order> Orders => this.GetTable<Order>();

        /// <summary>
        /// Предзагруженные заказы для корректной отчетности
        /// </summary>
        public IQueryable<Order> JoinedOrders => Orders
                .LoadWith(x => x.Client.User.Invite)
                .LoadWith(x => x.Room.Base.Sphere)
                .LoadWith(x => x.Promo)
                .LoadWith(x => x.Part)
                .LoadWith(x => x.Domain.Tarif)
                .LoadWith(x => x.Channel);

        public ITable<OrderRule> OrderRules => this.GetTable<OrderRule>();

        public ITable<Abonement> Abonements => this.GetTable<Abonement>();

        public ITable<Price> Prices => this.GetTable<Price>();

        public ITable<Sphere> Spheres => this.GetTable<Sphere>();

    }

}
