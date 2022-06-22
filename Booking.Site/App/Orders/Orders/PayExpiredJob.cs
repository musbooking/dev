using LinqToDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Orders
{
    /// <summary>
    /// Сервис для блокировки заказов с просроченным временем оплаты
    /// </summary>
    public class PayExpiredJob : AppJob
    {
        public override async Task RunAsync()
        {
            using var db = new App.DbConnection();

            var now = DateTime.Now;

            db.BeginTransaction1();

            var qorders =
                from o in db.Orders
                    .LoadWith(o => o.Room)
                    .GetActuals()
                where o.Lifetime > 0 // только для временных
                //where x.Status == OrderStatus.Reserv 
                where o.Status == OrderStatus.Reserv || o.Status == OrderStatus.Unknown  
                where o.Date.AddMinutes(o.Lifetime) < now
                select o;

            var orders_sel = await qorders
                .Select(o => new
                {
                    o.Id,
                    o.Status,
                    o.RoomId,
                    o.Room.BaseId,
                    o.Room.DomainId,
                    o.Request.RequestStatus,
                })
                .ToListAsync();

            // помечаем обновление для календарей с комнатами
            var room_ids = await qorders
                .Select(o => o.RoomId)
                .Distinct()
                .ToListAsync();

            await db.Calendars
                .Where(c => room_ids.Contains(c.RoomId))
                .Set(c => c.Updates, c => c.Updates + 1)
                .UpdateAsync();

            //var n1 = orders1.Count();
            var norders = await qorders
                .Set(x => x.Status, OrderStatus.Cancel)
                .Set(x => x.Updated, DateTime.Now)
                .Set(x => x.Reason, CancelReason.Normal)  // добавлено в новой фин. модели - 2020-07-28
                .UpdateAsync();

            db.CommitTransaction1();

            foreach (var ord in orders_sel)
            {
                var uargs = new OrderActionService.UpdateArgs
                {
                    Action = OrderAction.CancelNormal,
                    Id = ord.Id,
                    Status = ord.Status,
                    RequestStatus = ord.RequestStatus,
                    RoomId = ord.RoomId,
                    BaseId = ord.BaseId,
                    DomainId = ord.DomainId,
                };

                await OrderActionService.SendUpdatesAsync( uargs );
            }

        }

    }
}


#region Misc

//// блокируем старые ордера от изменений - оплачено более суток - функционал перенесен в AutoCloseJob
//var orders =
//    from x in db.Orders.GetActuals()
//    where x.IsHold == false  // убрал для оптимизации
//    where x.Status == OrderStatus.Closed
//    //where (now - x.PayDate.Value).TotalHours >= 24
//    where x.PayDate.Value.AddDays(1) < now
//    select x;

////var n = orders.Count();

//var n = await orders
//    .Set(x => x.IsHold, true)
//    .UpdateAsync();

//if (n > 0)
//{
//    My.WebApp.Current.Logger?.LogTrace("hold " + n + " orders");
//}

// // убираем также связанные брони
// // т.к.у связанных броней тоже выставялет Lifetime, то потеряло смысл
//var orders2 =
//    from x in db.Orders.GetActuals()
//    where x.Share.Lifetime > 0 // только для временных - у них серый статус
//     where x.Status == OrderStatus.Unknow
//    where x.Date.AddMinutes(x.Share.Lifetime) < now
//    select x;

// var n2a = await orders2
//     .Set(x => x.Status, OrderStatus.Cancel)
//     .UpdateAsync();

#endregion
