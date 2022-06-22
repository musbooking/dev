using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using Itall;
using Itall.App.Data;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using My.App.Common;
using My.App.Partners;
using My.App.CRM;

namespace My.App.Orders
{
    partial class OrdersController
    {

        [HttpPost("clear-calendar")]
        public async Task<IActionResult> ClearCalendarAsync(
            [FromForm(Name = "base")]  Guid? baseid,
            DateTime d1,
            DateTime d2
            )
        {
            this.RequiresAuthentication();

            // ограничиваем список 1 днем
            var dfrom = d1.ToMidnight();
            var dto = d2.ToMidnight(1);

            var n= await Db.Orders
                .Where(o => o.Room.BaseId == baseid)
                .Where(o => o.Status == OrderStatus.Unknown)
                .Where(o => o.DateFrom >= dfrom)
                .Where(o => o.DateTo <= dto)
                .Set(o => o.IsArchive, true)
                .UpdateAsync();

            SysUtils.SendBaseUpdate(baseid);

            return Json(new { N= n,});
        }


        [HttpGet("calendar")]
        public async Task<IActionResult> GetCalendarItemsAsync(
            [FromQuery(Name = "base")] Guid? baseid,
            DateTime dateFrom,
            DateTime dateTo
            )
        {
            this.RequiresAuthentication();

            // ограничиваем список 1 днем
            var dfrom = dateFrom.ToMidnight();//DateTime.Now.AddDays(-30);
            var dto = dateTo.ToMidnight(1);

            var qorders = Db.Orders
                .LoadWith(o => o.Part)
                //.GetDomainObjects(this.CurUser()?.DomainId)
                .GetActuals()
                .Where(x => x.Status != OrderStatus.Cancel)
                .Where(x => x.Status != OrderStatus.Request)
                //.Where(x => x.Reason != CancelReason.ForfeitsAsk); --- оставляем такие брони согласно #55481
                .Where(x => x.DateTo >= dfrom && x.DateFrom <= dto)
                .WhereIf(baseid.HasValue, x => x.Room.BaseId == baseid);  // // ограничиваем базу

            // вынуждены вычислять Types вручную, тк LINQ это не позволяет делать
            var equipments = DbCache.Equipments.Get();
            //var equipments = DbCache.Equipments.Get().Select(eq => eq.Value).ToList();

            //var BACK_KEY = Fin.Groups.DET_CLIENTS_PAYMENT_AUTOBACK.Key;
            var keys_1 = Fin.Groups.ROWS_SIGN_LESS_0;


            var qorders_sel =
                from o in qorders

                    // сумма оплат
                    //let payments = Db.Transactions
                    //    .Where(t => t.OrderId == o.Id)
                    //    .Where(t => t.Register == Fin.Groups.REG_CLIENTS.Key)
                    //    .Where(t => t.Operation == Fin.Groups.OP_CLIENTS_PAYMENT_RUB.Key)
                    //    .Sum(t => t.Details != BACK_KEY  ? t.Total :-t.Total)

                let payments = Db.Transactions
                    .Where(t => t.OrderId == o.Id)
                    .Where(t => t.Register == Fin.Groups.REG_CLIENTS.Key)
                    .Where(t => t.Operation == Fin.Groups.OP_CLIENTS_PAYMENT_RUB.Key)
                    //.Balance2()
                    .Sum(t => t.Total *
                        (Fin.Groups.ROWS_SIGN_LESS_0.Contains(t.Operation) ? -1 : 1) *
                        (Fin.Groups.ROWS_SIGN_LESS_0.Contains(t.Details) ? -1 : 1))


                //let ids = x.Equipments.ToGuids()
                let eqitems = OrderHelper.GetItems(o.ItemsJson, true, false).ToList()

                let qtypes =
                    from ei in eqitems
                    let eq = equipments.GetValueOrDefault2(ei.eq.Value, EquipmentsController.DefaultEquipment)
                    //let eq = equipments.FirstOrDefault(e => e.Id == ei.eq.Value)
                    //.Where(x => x.GroupId != null)
                    //.Select(x => x.Group.Name)
                    select $"{eq.Name} x{ei.n}"  // извлекаем названия: https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/22414/
                let types = qtypes.ToList()

                select new
                {
                    o.Id,
                    Text = o.ClientComment + "  " + o.Comment,
                    //Details = x.Comment + "",
                    Start_date = o.DateFrom, //.ToString("yyyy-MM-dd HH:MM:ss"), 
                    End_date = o.DateTo, //.ToString("yyyy-MM-dd HH:MM:ss"),
                                         //x.IsConfirmed,
                    o.Reason,
                    //x.Group,
                    Options = o.Options.ToGuids(),
                    o.Status,
                    o.RoomId,
                    //ClientBitrixNum = "" + x.Client.BitrixNum,
                    o.ClientId,
                    Name = o.Client.LastName + " " + o.Client.FirstName,
                    TotalSum = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit + o.PaidForfeit,
                    o.PaidForfeit,
                    Payments = payments,
                    TotalPays = o.TotalPays,
                    o.AbonementId,
                    //Equipments = x.Equipments, //.Split(',').Select(n=> Int32.Parse(n) ),
                    //x.PromocodeId,
                    Types = string.Join(",", types),
                    //Types = types,
                    o.SourceType,
                    IsMobile = o.DomainId == null,
                    IsHold = o.IsHold(),
                    o.Room.Color,
                    o.PayDate,
                };

            var orders_list = await qorders_sel.ToListAsync();
            //var list = query1.ToList();
            return Json(orders_list);
        }

        /// <summary>
        /// Возвращаем календарь виджета
        /// </summary>
        [HttpGet("wgcalendar")]
        public async Task<IActionResult> GetWidgetCalendarAsync(Guid? room, DateTime? dfrom, DateTime? dto)
        {
            // ТЗ https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/22382/
            // 2021-04 правила изменились - см. 55463. 
            DateTime dfrom1, dto1;
            if (dfrom == null && dto == null)
            {
                dfrom1 = DateTime.Now.Date.AddMonths(-10); // 10 мес
                dto1 = DateTime.Now.Date.AddMonths(2); // макс 60 дн 
            }
            else
            {
                dfrom1 = dfrom?.Date ?? DateTime.Now.Date;  // Передаем дату, либо текущая
                dto1 = dto?.Date.AddDays(1) ?? dfrom1.AddDays(1); // передаем дату, либо +1 день от начала
            }
            //dfrom1 = dto1.AddMonths(-10);

            var qorders = Db.Orders
                .LoadWith(o => o.Part)
                .GetActuals()
                .Where(x => x.Status != OrderStatus.Cancel)
                .Where(x => x.Status != OrderStatus.Request)
                // .Where(x => x.Reason != CancelReason.ForfeitsAsk)  -- --- оставляем такие брони согласно #55481
                .Where(x => x.DateTo > dfrom1 && x.DateFrom <= dto1)
                .Where(x => x.RoomId == room);

            var options = DbCache.Groups.Get();

            var query1 =
                from o in qorders
                let client = o.Client
                //let gopts = o.Options.ToGuids()
                //let user = Db.Users.FirstOrDefault(u=>u.ClientId == x.Id)
                let phone = o.Client.Resources
                    .Where(r => r.Kind == ResourceKind.ClientPhone)
                    .Select(r => r.Value)
                    .FirstOrDefault()
                orderby o.DateFrom

                // сумма оплат - изменена на order.TotalPays - согласно 77441
                let payments = o.TotalPays
                //let payments = Db.Transactions
                //    .Where(t => t.OrderId == o.Id)
                //    .Where(t => t.Register == My.App.Fin.Groups.REG_CLIENTS.Key)
                //    .Where(t => t.Operation == My.App.Fin.Groups.OP_CLIENTS_PAYMENT_RUB.Key)
                //    .Sum(t => t.Total)

                let eqitems = OrderHelper.GetItems(o.ItemsJson, true, true)

                select new
                {
                    o.Id,
                    o.DateFrom, //.ToString("yyyy-MM-dd HH:MM:ss"), 
                    o.DateTo, //.ToString("yyyy-MM-dd HH:MM:ss"),
                    fio = client.LastName + " " + client.FirstName,
                    client.Email,
                    Phone = phone!= null ?phone :client.User.Phone,
                    o.ClientComment,
                    o.Color,
                    //TotalSum = o.GetTotalSum(),  //o.TotalOrder + o.Part.Forfeit,
                    TotalSum = o.TotalOrder + o.PaidForfeit - o.PointsSum + (o.PayForfeit ?o.Part.Forfeit :0),  // 73153 o.TotalOrder + o.Part.Forfeit,
                    TotalPays = payments,
                    o.Status,
                    o.SourceType,
                    o.AbonementId,
                    // Sphere = x.Room.Base.Sphere.Name,
                    o.Comment,
                    IsPrepay = o.TotalPays > 0, //IsPrepay = o.IsPrepay(),
                    Items = eqitems
                        .Select(ei => new
                        {
                            ei.eq,
                            Name = (ei.Equipment!=null) ?ei.Equipment.Name :"",
                            ei.n,
                        })
                        .ToArray(),
                    //Goptions = gopts, // o.Options.ToGuids(),
                    Options = o.Options.ToGuids()
                        .Select(id => options.GetValueOrDefault2(id, new Group()))
                        .Select(g => new { g.Id, g.Name }),
                    o.Range,
                    //options = o.Options != null
                    //    ?o.Options.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    //        .Select(id => options.GetValueOrDefault2(Guid.Parse(id), new Group()))
                    //        .Select(g => new { g.Id, g.Name })
                    //    : null,
                };

            //LinqToDB.Common.Configuration.Linq.GenerateExpressionTest = true;
            var list = await query1.ToListAsync();
            return Json(list);
        }



    }



}
