using Itall;
using LinqToDB;
using Microsoft.Extensions.Logging;
using My.App.Fin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Orders
{
    /// <summary>
    /// Сервис автоматического закрытия брони
    /// task: https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18110/
    /// </summary>
    public class OrderAutoJob : AppJob
    {
        public override async Task RunAsync()
        {
            using var db = new DbConnection();
            await closeAsync( db ); // , оставляем одно закрытие, согл пулу 3/3
            //await paymentAsync(db);  // комментарим
        }


        public async Task closeAsync( DbConnection db )
        {
            var d0 = new DateTime(2017, 05, 01);
            var d = DateTime.Now.AddHours(-App.Settings.OrderCloseHours);

            var orders = db.JoinedOrders
                //.LoadWith(o => o.Client.User.Invite)
                //.LoadWith(o => o.Room.Base.Sphere) 
                //.LoadWith(o => o.Promo)
                //.LoadWith(o => o.Part)
                //.LoadWith(o => o.Domain.Tarif)
                .GetActuals();

            orders =
                from o in orders
                where o.Status == OrderStatus.Reserv
                where o.Reason != CancelReason.ForfeitsAsk  // убираем подтверждение штрафа  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/50961/
                //where (d - x.DateTo).TotalHours >= 1
                //where x.DateTo < d  // for Postgre 2020-01-23: https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/41339/ 
                where o.DateTo < d  // for Postgre 2020-01-23: https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/41339/ 
                where o.Date >= d0
                select o;

            var list = await orders.ToListAsync();
            if (list.Count == 0)
                return;


            foreach (var order in list)
            {
                //mod.ApplyStatusAsync(null, )
                order.Part = order.Part ?? db.GetOrCreateClientPart(order.ClientId, order.Room?.Base?.DomainId, 27);
                var ctx = new OrderContext
                {
                    Db = db,
                    Action = OrderAction.Close,
                    Order = order,
                    // CurUser = order.Client.User,
                    //ClientPart = await db.GetOrCreateClientPartAsync(order.ClientId, order.Room?.Base?.DomainId),
                    //Forfeit = 0,
                    //TransDetails =  Fin.Groups.DET_CLIENTS_PAYMENT_AUTOCACH.Key,
                };

                //Services.Run(ctx);
                await OrderHelper.ApplyStatusAsync(ctx);
                //await tsvc.PaymentOrderAsync(ctx.Order, Fin.Groups.DET_CLIENTS_PAYMENT_AUTO.Key, order.TotalSum);  // оплата полной стоимости
            }

            //orders
            //    .Set(x => x.IsHold, true)
            //    .Update();
            
        }


        async Task paymentAsync(DbConnection db)
        {
            var d = DateTime.Now;
            var d0 = new DateTime(2017, 05, 01);
            var dh = App.Settings.OrderCloseHours;

            var orders = db.JoinedOrders
                //.LoadWith(x => x.Client.User.Invite)
                //.LoadWith(x => x.Room.Base.Sphere)
                //.LoadWith(x => x.Promo)
                //.LoadWith(x => x.Part)
                //.LoadWith(x => x.Domain.Tarif)
                .GetActuals();

            orders =
                from x in orders
                where x.Status == OrderStatus.Reserv
                where x.Reason != CancelReason.ForfeitsAsk
                //where (d - x.DateTo).TotalHours >= 1
                where x.DateTo.AddHours(dh) < d  // for Postgre 2020-01-23: https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/41339/ 
                where x.Date >= d0
                select x;

            var list = await orders.ToListAsync();
            if (list.Count == 0)
                return;


            App.Logger?.LogTrace("auto payment: " + list.Count + " orders");
            //var tsvc = new TransService { Db = db };

            foreach (var order in list)
            {
                //mod.ApplyStatusAsync(null, )
                order.Part = order.Part ?? db.GetOrCreateClientPart(order.ClientId, order.Room?.Base?.DomainId, 33);

                var ctx = new OrderContext
                {
                    Db = db,
                    Action = OrderAction.AutoPay,
                    Order = order,
                    // CurUser = order.Client.User,
                    // ClientPart = await db.GetOrCreateClientPartAsync(order.ClientId, order.Room?.Base?.DomainId),
                    //Forfeit = 0,
                    //TransDetails =  Fin.Groups.DET_CLIENTS_PAYMENT_AUTOCACH.Key,
                };

                //Services.Run(ctx);
                await OrderHelper.ApplyStatusAsync(ctx);
                //await tsvc.PaymentOrderAsync(ctx.Order, Fin.Groups.DET_CLIENTS_PAYMENT_AUTO.Key, order.TotalSum);  // оплата полной стоимости
            }

            //orders
            //    .Set(x => x.IsHold, true)
            //    .Update();
            
        }


    }



}