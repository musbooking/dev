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
using My;
using My.App.Common;
using My.App.Partners;
using My.App.CRM;
using My.App.Fin;

namespace My.App.Orders
{
    public partial class OrdersController : UpdateDbController<Order>
    {

        protected override object OnUpdating(Updater<Order> updater)
        {
            base.OnUpdating(updater);

            updater.Set(x => x.BitrixNum);
            updater.Set(x => x.Comment);
            updater.Set(x => x.ClientComment);
            updater.Set(x => x.ClientId);
            updater.Set(x => x.Date);
            updater.Set(x => x.PayDate);
            updater.Set(x => x.DateFrom);
            updater.Set(x => x.DateTo);
            updater.Set(x => x.Discount);
            updater.Set(x => x.EqPrice);

            //updater.Set(x => x.Forfeit);
            updater.Set(x => x.Reason);
            updater.Set(x => x.RoomId);
            updater.Set(x => x.RoomPrice);
            updater.Set(x => x.Status);
            updater.Set(x => x.TotalOrder);
            updater.Set(x => x.OriginTotalSum);  // при фиксации результата - сохраняем оригинал - 52403
            updater.Set(x => x.IsPointsPay);
            updater.Set(x => x.PointsSum);
            updater.Set(x => x.Range);
            //updater.Set(x => x.IsHold);

            updater.Set(x => x.AbonementId);
            updater.Set(x => x.IgnoreMobComm);

            var obj = updater.Object;
            var db = updater.Db as DbConnection;

            // комментарим работу с переносом штрафа на другой ордер
            //if (obj.PayForfeit && !updater.Set(x => x.PayForfeit)) // если сняли галочку "Оплатить штраф"
            //{
            //    var part = db.GetOrCreateClientPartAsync(obj.ClientId, obj.DomainId).Result;
            //    var rr = db.CalcForfeitForNearestOrderAsync( obj, part ).Result;
            //}
            //else if (!obj.PayForfeit && updater.Set(x => x.PayForfeit)) // если выставили галочку "Оплатить штраф"
            //{
            //    var part2 = db.GetOrCreateClientPartAsync(obj.ClientId, obj.DomainId).Result;
            //    if(part2.ForfeitOrderId != null && part2.ForfeitOrderId != obj.Id) // если штраф по другому заказу - пересчитываем его
            //    {
            //        var oldForfeiltOrder = db.Orders.Find(part2.ForfeitOrderId);
            //        var r2 = db.ClearForeitForOrderAsync( oldForfeiltOrder ).Result;
            //        updater.Set(x => x.PayForfeit);
            //    }
            //}
            //else
            {
                updater.Set(x => x.PayForfeit);
            }

            var logger = new OrderLogger { Db= db, User = this.CurUser() };
            logger.LogChanges(updater); //.Object, updater.Params);

            //string details = updater.Params["itemsJson"];
            // updater.Set(x => x.ItemsJson);

            //onChangeItems(updater);
            //onChangeItems(obj.Id, obj.ItemsJson, updater.Params["itemsJson"]);
            updater.Set(x => x.ItemsJson);

            //onChangeOptions(updater);
            updater.Set(x => x.Options);

            // добавляем опцию по умолчанию для сферы
            if (updater.IsNew && updater.Object.RoomId != null && string.IsNullOrWhiteSpace(obj.Options)) // добавлена проверка в 76089
            {
                var def_opt = Db.Rooms
                    .LoadWith(r => r.Base.Sphere)
                    .Finds(obj.RoomId.Value)
                    .Select(r => r.Base.Sphere.Default)
                    .FirstOrDefaultAsync().Result;
                //obj.Options = string.IsNullOrWhiteSpace(obj.Options) ?def_opt :obj.Options + ","+ def_opt;  // // добавлена проверка iif в 76089
                obj.Options = def_opt;
            }

            //var changes = SysUtils.GetChangesText(updater);
            //if (!string.IsNullOrWhiteSpace(changes))
            //{
            //    addMsg(updater.Object.Id, changes);
            //}

            //onChangePromo(updater);
            updater.Set(x => x.PromoId);

            checkDates(updater);

            onChangeRetrans(updater);

            return base.OnUpdating(updater);
        }

        /// <summary>
        /// Проверка условий на даты
        /// </summary>
        private static void checkDates(Updater<Order> updater)
        {
            var obj = updater.Object;

            if (obj.DateTo < obj.DateFrom)
                updater.Set(x => x.DateTo, obj.DateTo.AddDays(1));

            if ((obj.DateTo - obj.DateFrom).TotalHours > 23)
                throw new UserException("Нельзя создавать бронь на период более суток");
        }


        /// <summary>
        /// Перегенерация проводок, если необходимо
        /// </summary>
        private void onChangeRetrans(Updater<Order> updater)
        {
            //// отслеживание изменения суммы - автоматом при расчете
            // var oldsum = obj.PointsSum;
            // if (!obj.IsIgnored())  // стали блокировать пересчет?  39181

            var retrans = updater.Params["retrans"] == "true";
            if (!retrans) return; // ТЕперь пересчет проводок делается одновременно с изменением стоимости

            var obj = updater.Object;
            var res = Calcs.CalcHelper.CalcOrderAsync(Db, obj, retrans).Result; //null,
        }


        protected override void OnUpdated(Updater<Order> updater)
        {
            base.OnUpdated(updater);

            var db = updater.Db as DbConnection;
            if (updater.IsNew && updater.Object.RoomId.HasValue)
            {
                var svc = new OrderService { Db = db };
                var room = db.Find<Room>(updater.Object.RoomId.Value);
                var res = Db.AddSharedOrders(updater.Object, room);
            }
            Calendars.CalendarHelper.IncCalendarsUpdate( db, roomId: updater.Object.RoomId);
        }


        [HttpPost("archive")]
        public async Task<IActionResult> ArchiveAsync(Guid id)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var svc = new OrderService { Db = Db, User = curuser };
            await svc.ArchiveAsync(id);

            return Json(true);
        }

        

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync( AddOrderArgs args )
        {
            args.Validate();

            this.RequiresAuthentication();
            var curuser = this.CurUser();
            var svc = new OrderService { Db = Db, User = curuser };

            var addres = await svc.AddAsync(args);

            var res = new { 
                addres.Order.Id, 
                TotalSum = addres.Order.GetTotalSum(),  //order1.TotalOrder + order1.Part.Forfeit, 
                Forfeit = addres.Order.Part?.Forfeit,
                addres.Text,
                addres.Errors, 
                results = addres.List,
            };
            return Json(res);

        }



        /// <summary>
        /// Расчет заказа для десктоп - приложения
        /// </summary>
        [HttpPost("calc")]
        public async Task<IActionResult> CalculateAsync(
            Guid id,
            Guid? clientId,
            bool check,
            Guid? roomId,
            DateTime? date,
            DateTime dateFrom,
            DateTime dateTo,
            string equipments,
            //GroupKind group,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] options,
            int range,
            int forfeit,
            int paidForfeit,
            bool payForfeit,
            Guid? promoId,
            string promocode,
            bool isPointsPay,
            bool isHold,
            bool save,
            string itemsJson,
            OrderStatus status = OrderStatus.Reserv
            )
        {
            var args = new CalcArgs
            {
                Db = Db,
                OrderId = id, 
                ClientId = clientId,
                CheckErrors = check,
                RoomId = roomId, 
                Date = date ?? DateTime.Now, 
                DFrom = dateFrom, 
                DTo = dateTo, 
                //EqIds = equipments,
                ItemsJson = itemsJson,
                //Group = group,
                Options = options,
                Range = range,
                Forfeit = forfeit,
                PaidForfeit = paidForfeit,
                PayForfeit = payForfeit,
                PromoId = promoId,
                PromocodeNum = promocode,
                Status = status,
                IsPointsPay = isPointsPay,
                Save = save,
                IsHold = isHold,
            };

            var res = await Calcs.CalcHelper.CalculateAsync(args);
            return Json(res);
        }


        /// <summary>
        /// Расчет для мобильного приложения
        /// </summary>
        [HttpPost("calc2")]
        public async Task<IActionResult> Calculate2Async(
            Guid? room,
            DateTime date,
            int hours,
            //string equipments,
            string itemsJson,
            //GroupKind group,
            Guid? option,
            Guid? client,
            bool payForfeit,
            bool payPoints,
            int range,
            string promo
            )
        {
            //var vars = this.Request.Form;
            var curuser = this.CurUser();

            client ??= curuser?.ClientId;
            var forfeit = 0;
            if (payForfeit && client != null && room != null)
            {
                var domid = await Db.Rooms
                    .Finds(room)
                    .Select(r => r.DomainId)
                    .FirstOrDefaultAsync();

                var part = Db.GetOrCreateClientPart(client, domid, 34);
                forfeit = part.Forfeit;
            }

            var args = new CalcArgs
            {
                //info.OrderId = Convert<Guid?>(vars.id);
                CheckErrors = true,
                RoomId = room, //Convert<Guid?>(vars.room);
                DFrom = date, //Convert<DateTime>(vars.date);
                              //int hours = Convert<int>(vars.hours);
                DTo = date.AddHours(hours),

                //EqIds = equipments,
                ItemsJson = itemsJson,
                //args.Group = group; //Convert<GroupKind>(vars.group);
                Options = option == null ? new Guid[0] : new Guid[] { option.Value },
                //args.ClientId = client; // Convert<Guid?>(vars.client);
                ClientId = client, // ?? curuser?.ClientId,
                PayForfeit = payForfeit, // Convert<bool>(vars.payForfeit);
                IsPointsPay = payPoints,
                Forfeit = forfeit,
                Range = range,

                //info.ClientForfeit = Convert<int>(vars.clientForfeit);
                //info.OrderForfeit = Convert<int>(vars.fullForfeit);
                //info.Discount = Convert<int>(vars.discount);
                //info.RoomPrice = Convert<int>(vars.roomPrice);
                //info.PayForfeit = Convert<bool>(vars.payForfeit);
                //info.PromocodeId = Convert<Guid?>(vars.promocodeId);
                PromocodeNum = promo // Convert<string>(vars.promo);
            };
            //info.DomainId = this.CurUser()?.DomainId;

            var res = await Calcs.CalcHelper.CalculateAsync( args );
            return Json(res);
        }


        /// <summary>
        /// Расчет по диапазону дат
        /// </summary>
        [HttpGet("calc-range")]
        public async Task<IActionResult> CalculateRangeAsync(
            Guid? room,
            DateTime date,
            Guid? client,
            Guid? option,
            int? h1, // for debug
            int? h2, // for debug
            int range,
            int days = 8,
            bool errors = false  
            )
        {
            var curuser = this.CurUser();
            var date1 = date.ToMidnight();
            var date2 = date.AddDays(days).ToMidnight();

            var orders = await Db.Orders
                    .GetActuals()
                    .GetBetweenOrders(date1, date2, room)
                    .ToListAsync();

            var roomobj = await Db.Rooms
                .LoadWith(r => r.Base.Sphere)
                .FindAsync(room);
            if (roomobj == null)
                throw new UserException($"Комната {room} не найдена");

            var options = option == null 
                ? roomobj.Base.Sphere.Default.ToGuids() 
                : new Guid[] { option.Value };

            var args = new CalcArgs
            {
                Db = Db,
                CheckErrors = true,
                RoomId = room,
                Room = roomobj,
                Orders = orders.AsQueryable(),
                Options = options,
                FixHoursAsError = false,
                IgnoreMinHours = true,
                Range = range,
                ClientId = client ?? curuser?.ClientId
            };

            var resall = new List<RangeResult>();
            var shours = "" +
                args.Room.DefaultHours + ","+ 
                args.Room.TodayHours + "," +
                args.Room.TodayWkHours + "," +
                args.Room.WeekendHours;
            var hours = shours.Split(',')
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Select(s => int.Parse(s))
                .ToList();
            h1 = h1 ?? hours.Min();
            h2 = h2 ?? hours.Max();
            if (h2 == 24) h2--; // до 23

            // считаем по всем дням
            for (var d = 0; d < days; d++)
            {
                var idate = date1.ToMidnight( d );
                // считаем по всем доступным часам
                for (var h = h1.Value; h <= h2.Value; )
                {
                    args.DFrom = idate.AddHours(h);
                    args.Hours = 1;
                    args.Hour2 = 0;
                    args.DTo = args.DFrom.AddHours(1);
                    //args.TimeCalcs.Clear();
                    //args.TotalSum = 0;
                    var calcres = await Calcs.CalcHelper.CalculateAsync(args);

                    var res = new RangeResult
                    {
                        Date = args.DFrom,
                        HotDiscount = calcres.HotDiscount,
                        IsAction = calcres.IsAction,
                        //IsRoomPromo = calcres.IsRoomPromo,
                        //RoomClientDiscount = calcres.RoomClientDiscount,
                        TotalPrice = calcres.TotalPrice,
                        TotalSum = calcres.TotalSum,
                        //Hours = 1,
                        Hours = 1, //calcres.IsFixHours ? calcres.Hour2 - calcres.Hour1 : 1, // блокируем согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/49457/
                    };

                    // отсекаем ошибки
                   
                    if (calcres.IsOk() || calcres.IsFixHours) // добавляем фикс-часы, чтобы игнорить такие ошибки https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/36605/
                    {
                        resall.Add(res);
                    }
                    else if (errors)  // добавлено https://hendrix.bitrix24.ru/company/personal/user/180/tasks/task/view/38367/
                    {
                        res.Error = calcres.Errors;
                        resall.Add(res);
                    }

                    h += res.Hours;

                }
            }
            return Json(resall);
        }

        class RangeResult
        {
            public DateTime Date { get; set; }
            public int Hours { get; set; }
            public int TotalPrice { get; set; }
            public int TotalSum { get; set; }

            public int HotDiscount; // { get; set; }
            //public int RoomClientDiscount; // { get; set; }

            public bool IsRoomPromo { get; set; }
            public bool IsAction { get; set; }
            public string Error { get; set; } = null;
        }


        /// <summary>
        /// Изменение брони
        /// </summary>
        [HttpPost("change")]
        public async Task<IActionResult> ChangeOrder(  ChangeArgs args
            //Guid order,
            ////[ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] equipments,
            //string itemsJson,
            //string clientComment,
            //Sys.TemplateGroup? template,
            //string color
            )
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var orderObj = await Db.Orders
                .FindAsync(args.Order);

            if (orderObj.Status != OrderStatus.Reserv)
                return Error("Изменять можно только брони в статусе Резерв");

            //orderObj.Equipments = equipments.ToString(",");
            if (args.ItemsJson != null)
            {
                var logger = new OrderLogger { Db = Db, User = this.CurUser() };
                logger.OnChangeItems(orderObj, args.ItemsJson);
                orderObj.ItemsJson = args.ItemsJson;
            }

            if (args.ClientComment != null)
                orderObj.ClientComment = args.ClientComment;

            if (args.Color != null)
                orderObj.Color = args.Color;

            if (args.Range != null)
                orderObj.Range = args.Range.Value;

            if (args.Template != null)
                orderObj.Template = args.Template.Value;

            var res = await Calcs.CalcHelper.CalcOrderAsync(Db, orderObj, true); //  null, 

            await Db.UpdateAsync(orderObj);

            return Json(res);
        }

        /// <summary>
        /// Параметры изменения брони
        /// </summary>
        public class ChangeArgs
        {
            public Guid Order { get; set; }
            public string ItemsJson { get; set; }
            public Sys.TemplateGroup? Template { get; set; }
            public string Color { get; set; }
            public string ClientComment { get; set; }
            public int? Range { get; set; }
        }

        /// <summary>
        /// Параметры изменения брони (2)
        /// </summary>
        public class Change2Args: ChangeArgs
        {
            public string Options { get; set; }
            public Guid? Promo { get; set; }
            public bool? PayForfeit { get; set; }
            public bool? PayPoints { get; set; }
            public string Comment { get; set; }
            public int? AddDelay { get; set; }
        }

        /// <summary>
        /// Расширенный метод - изменение брони партнером
        /// https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/38003/
        /// </summary>
        [HttpPost("change2")]
        public async Task<IActionResult> Change2Order(  Change2Args args
            //Guid order,
            //string itemsJson,
            //string options,
            //Guid? promo,
            //bool? payForfeit,
            //bool? payPoints,
            //string comment,
            //Sys.TemplateGroup? template,
            //string color
            )
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();
            curuser.Allow( Sys.Operations.OrdersEdit );

            var orderObj = await Db.Orders
                .LoadWith(o => o.Room.Base.Sphere)
                .FindAsync(args.Order);
            if (orderObj == null)
                throw new UserException("Не задан order");

            var qpart = Db.ClientParts
                .Where(cp => cp.ClientId == orderObj.ClientId)
                .Where(cp => cp.DomainId == curuser.DomainId)
                .Set(cp => cp.Updated, DateTime.Now);

            //if (ban != null)
            //{
            //    qpart = qpart.Set(cp => cp.IsBanned, ban);
            //    await qpart.UpdateAsync();
            //}

            if (args.ItemsJson != null)
            {
                var logger = new OrderLogger { Db = Db, User = this.CurUser() };
                logger.OnChangeItems( orderObj, args.ItemsJson);
                orderObj.ItemsJson = args.ItemsJson;
            }

            if (args.Comment != null)
                orderObj.Comment = args.Comment;

            if (args.Color != null)
                orderObj.Color = args.Color;

            if (args.PayForfeit != null)
                orderObj.PayForfeit = args.PayForfeit.Value;            
            
            if (args.PayPoints != null)
                orderObj.IsPointsPay = args.PayPoints.Value;

            if (args.Options != null)
                orderObj.Options = args.Options;

            if (args.Range != null)
                orderObj.Range = args.Range.Value;

            if (args.Promo != null)
                orderObj.PromoId = args.Promo;

            if (args.Template != null)
                orderObj.Template = args.Template.Value;            
            
            if (args.AddDelay > 0)
                orderObj.ConfirmDelay += args.AddDelay.Value;
            if (args.AddDelay == 0)
                orderObj.ConfirmDelay = 0;

            var res = await Calcs.CalcHelper.CalcOrderAsync(Db, orderObj, true); //  null, 

            await Db.UpdateAsync(orderObj);

            return Json(res);
        }


        [HttpGet("status")]
        public async Task<IActionResult> GetOrderStatusAsync(Guid order)
        {
            this.RequiresAuthentication();

            var lastmsg = await Db.Messages
                .Where(m => m.OrderId == order)
                .OrderByDescending(m => m.Date)
                .Select(m => m.Text)
                .FirstOrDefaultAsync();

            var orderobj = await Db.Orders
                .LoadWith(x => x.Part)
                .Finds(order)
                .Select(x => new
                {
                    x.Id,
                    x.Status,
                    x.Reason,
                    x.RequestStatus,
                    x.PayDate,
                    x.TotalPays,
                    //TotalPays = Db.Transactions  -- https://hendrix.bitrix24.ru/company/personal/user/180/tasks/task/view/47493/
                    //    .Where(t => t.OrderId == order)
                    //    .BalanceAsync(Fin.Groups.REG_CLIENTS, Fin.Groups.OP_CLIENTS_PAYMENT_RUB, null).Result,
                    TotalSum = x.GetTotalSum(), // x.TotalOrder + x.Part.Forfeit,
                    Message = lastmsg,
                })
                .FirstOrDefaultAsync();

            if (orderobj == null)
                throw new UserException("Не найдена бронь с ИД " + order);

            return Json(orderobj);
        }



        /// <summary>
        /// Изменение статуса - 72929 для преемственности 
        /// </summary>
        public Task<IActionResult> StatusAsync(Guid id, OrderAction act, RequestStatus requestStatus = RequestStatus.Unknown)
        {
            var ch_args = new StatusArgs
            {
                Id = id,
                Act = OrderAction.Reserv,
                RequestStatus = requestStatus,
            };
            return StatusAsync(ch_args);
        }

        /// <summary>
        /// Параметры изменения транзакции
        /// </summary>
        public class StatusArgs
        {
            public Guid Id { get; set; }
            public OrderAction Act { get; set; }
            public RequestStatus RequestStatus { get; set; } = RequestStatus.Unknown;
            public int Total { get; set; }
        }

        /// <summary>
        /// Изменение статуса
        /// </summary>
        [HttpPost("status")]
        public async Task<IActionResult> StatusAsync( StatusArgs args) 
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var change_args = new ChangeStatusArgs
            {
                //Db = Db,
                OrderId = args.Id,
                Action = args.Act,
                RequestStatus = args.RequestStatus,
                Total = args.Total,
                //CheckErrors = check,
                // Notify = !nomsg,
            };
            var svc = new OrderService { Db = Db, User = curuser };
            var order_ctx = await svc.ChangeStatusAsync(change_args);

            var o = order_ctx.Order;
            var res = new
            {
                order_ctx.Calcs?.Errors,
                o.Status,
                o.Reason,
                o.PaidForfeit,
                //Forfeit = order.Client?.Forfeit ?? 0,
                //docCtx.Forfeit,  
                o.Part?.Forfeit, // 2020-07-31 в новой фин. модели считаем штраф только при резервировании, и записываем в бронь
                o.PayDate,
                TotalSum = o.GetTotalSum(), //  o.TotalOrder + o.Part.Forfeit,
                o.OriginTotalSum,
            };
            return Json(res);
        }



        [HttpPost("cancel")]
        //[HttpPost("cancelStatus")]
        //[HttpPost("status")]
        public async Task<IActionResult> CancelStatusAsync(Guid id, OrderAction act = OrderAction.CancelNormal)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var args = new ChangeStatusArgs
            {
                //Db = Db,
                OrderId = id,
                Action = act,
            };
            var svc = new OrderService { Db = Db, User = curuser };
            var docCtx = await svc.ChangeStatusAsync(args);

            //await new TransService { Db = Db }.CancelOrderAsync(docCtx.Order);

            return Json(new
            {
                docCtx.Order.Id,
                docCtx.Order.Status,
                //docCtx.Order.Reason,
                ////Forfeit = order.Client?.Forfeit ?? 0,
                //docCtx.Forfeit,
                //docCtx.Order.PayDate,
                //docCtx.Order.TotalSum,
            });
        }


        [HttpPost("my-cancel")]
        public async Task<IActionResult> MyCancelStatusAsync(Guid id, OrderAction act = OrderAction.CancelNormal)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var args = new ChangeStatusArgs
            {
                //Db = Db,
                OrderId = id,
                Action = act,
                //UserDomain = true, 
            };
            var svc = new OrderService { Db = Db, User = curuser };
            var docCtx = await svc.ChangeStatusAsync(args);
            //await new TransService { Db = Db }.CancelOrderAsync(docCtx.Order);

            return Json(new
            {
                docCtx.Order.Id,
                docCtx.Order.Status,
                //docCtx.Order.Reason,
                ////Forfeit = order.Client?.Forfeit ?? 0,
                //docCtx.Forfeit,
                //docCtx.Order.PayDate,
                //docCtx.Order.TotalSum,
            });
        }


    }



}


#region --- Misc ----


//// Отслеживаем изменения доп.оборудования -заблокировано, т.к. стали отслеживать изменгения Items
//string eq = updater.Params["Equipments"];
//if (obj.Equipments != eq)
//{
//    var ids0 = obj.Equipments.ToGuids();
//    var ids1 = eq.ToGuids();
//    var added = ids1.Except(ids0);
//    var removed = ids0.Except(ids1);

//    var dict = EquipmentsController.List.Get();
//    foreach (var id in added)
//    {
//        addMsg(obj.Id, "Добавлена позиция: " + dict.GetValueOrDefault(id,null)?.Name);
//    }
//    foreach (var id in removed)
//    {
//        addMsg(obj.Id, "Удалена позиция: " + dict.GetValueOrDefault(id, null)?.Name);
//    }

//    updater.Set(x => x.Equipments);
//}

//// Отслеживаем изменение группы
//var group = obj.Group;
//var sgroup = (string)updater.Params["Group"];
//if (!string.IsNullOrWhiteSpace(sgroup))
//    group = (GroupKind)Enum.Parse(typeof(GroupKind), sgroup);
/////string sgroup = updater.Params["Group"];
//if (obj.Group != group)
//{
//    addMsg(obj.Id, $"Изменена группа: {obj.Group} -> {group}");
//    updater.Set(x => x.Group);
//}



// int OldOrderRoomID = 0; // default room

/*async Task<IActionResult> AddOldOrderAsync()
{
    using (var db = NewHendrixDb())
    {
        if (OldOrderRoomID == 0)
    {
        OldOrderRoomID = Db.Rooms.First().Id;
    }

    var f = this.BindBody<OldOrder>();
    var newOrder = new Models.Order
    {
        //CancelComment = 
        ClientComment = $"Заказ-копия от {f.Member}:  {f.Comment}",
        Date = DateTime.Now,
        DateFrom = f.Date,
        DateTo = f.Date.AddHours(f.Hours),
        Status = Models.OrderStatus.Reserv,
        TotalPrice = f.TotalPrice,
        RoomId = OldOrderRoomID,
    };
    Db.Orders.Add(newOrder);
    await Db.SaveChangesAsync();

    return this.Json( new { id = newOrder.Id,});
}
*/
#endregion
