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
using My.App.CRM;
using My.App.Fin;

namespace My.App.Orders
{
    partial class OrdersController 
    {

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(int? reason, int? status, bool forfeits)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();
            curuser.Require(Sys.Operations.OrderForfeit);

            //int? reason = Convert<int?>(this.Request.Query.reason);
            //int? status = Convert<int?>(this.Request.Query.status);

            //using (var Db = new DbConnection())
            {
                // ограничиваем список месяцем до
                var query = Db.Orders
                    .LoadWith(o => o.Part)
                    .GetActuals();

                var domainid = curuser?.DomainId;

                if (forfeits)
                    // если нужны штрафы, только по клиентам данного партнера - см https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/20930/
                    query = query.Where(x => x.Client.DomainId == domainid && x.Part.Forfeit > 0);  // ForfeitSum
                else
                    query = query.GetDomainObjects(domainid);

                if (status!= null)
                    query = query.Where(x => x.Status == (OrderStatus)status.Value);
                if (reason!= null)
                    query = query.Where(x => x.Reason == (CancelReason)reason.Value);

                var query1 =
                    from x in query
                    orderby x.DateFrom descending // added 16-09-2019 для сортировки штрафов
                    select new
                    {
                        x.Id,
                        x.ClientId,
                        Client = x.ClientId == null ? "" : x.Client.LastName + " " + x.Client.FirstName,
                        x.DateFrom,
                        x.DateTo,
                        TotalSum = x.GetTotalSum(), // x.TotalOrder + x.Part.Forfeit,
                        Text = x.ClientComment,
                        RoomId = x.RoomId,
                        BaseId = x.RoomId == null ? null : x.Room.BaseId,
                        x.ItemsJson,
                        Forfeit = x.CancelForfeit,
                        x.Part,
                        ///FullForfeit = x.Forfeit + part.Forfeit, // (x.Client.Forfeit)
                        //x.PromocodeId,
                    };


                // вынуждены вычислять Types вручную, тк LINQ это не позволяет делать
                var equipments = DbCache.Equipments.Get().Values.AsQueryable()
                    .GetDomainObjects(curuser?.DomainId)
                    .Select(x => new { x.Id, Name = x.GroupId == null ? "" : x.Group.Name })
                    .ToDictionary(x => x.Id, x => x.Name);

                var query2 = await query1.ToListAsync();  // .Take(1000)

                var domain = curuser?.DomainId;

                //var clientIds = query1.Select(x => x.ClientId).Distinct().ToList();
                //var parts = Db.ClientParts
                //    .Where(x => x.DomainId == domainid && clientIds.Contains(x.ClientId))
                //    .ToList();

                var query3 =
                    from x in query2
                    //let ids = x.Equipments.ToGuids()
                    let ids = OrderHelper.GetItemsIds(x.ItemsJson)
                    let types = ids.Select(id => equipments.GetValueOrDefault2(id, ""))

                    //var part = Db.GetOrCreateClientPart(x.ClientId, domain)
                    //let part = parts.FirstOrDefault(p => p.ClientId == x.ClientId) ?? EMPTY
                    //where !forfeits || part.Forfeit > 0
                    //orderby x.DateFrom descending // added 16-09-2019 для сортировки штрафов

                    select new
                    {
                        x.Id,
                        x.Client,
                        x.ClientId,
                        Date = x.DateFrom,
                        Time = x.DateFrom.ToString("HH:mm") + "-" + x.DateTo.ToString("HH:mm"),
                        x.TotalSum,
                        x.Text,
                        x.RoomId,
                        x.BaseId,
                        Types = string.Join(",", types),
                        x.Forfeit,
                        FullForfeit = x.Forfeit + x.Part?.Forfeit ?? 0,
                        //x.Forfeit,
                        //x.PromocodeId,
                    };
                var list = query3.ToList();  
                return Json(list);
            }
        }

        static ClientPart EMPTY = new ClientPart { _TempEventId = 13};




        /// <summary>
        /// Получаем расширенную информацию о бронях для администратора системы
        /// https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/20928/
        /// </summary>
        [HttpGet("admlist")]
        public async Task<IActionResult> GetAdminListAsync(
            Guid? client,
            DateTime? dfrom,
            DateTime? dto
            )
        {
            this.RequiresAuthentication();
            this.RequiresShare();
            //this.CurUser().Require(Core.Operations.Days);


            var orders = Db.Orders
                .LoadWith(o => o.Part)
                .Where(x => x.ClientId == client)
                .WhereIf(dfrom != null, x => x.DateFrom >= dfrom)  // 
                .WhereIf(dto != null, x => x.DateFrom < dto.Value.ToMidnight(1))
                .OrderBy(x => x.DateFrom)
                .Select(o => new
                {
                    o.Id,
                    Date = o.DateFrom,
                    o.Room.Base.Metro,
                    o.DomainId,
                    o.Room.BaseId,
                    o.RoomId,
                    Total = o.GetTotalSum(), //o.TotalOrder + o.Part.Forfeit,
                    Text = o.Comment + "",
                    IsHold = o.IsHold(),
                    ClientComment = o.ClientComment + "",
                    o.Status,
                    Forfeit = o.PaidForfeit + o.CancelForfeit,  // ForfeitSum
                    o.PayDate,
                });

            var res = await orders.ToListAsync();

            return Json(res);
        }


        
        /// <summary>
        /// Получение списка заявок
        /// </summary>
        [HttpGet("requests")]
        public async Task<IActionResult> GetRequestsAsync(
            //Guid? domain,
            DateTime? dfrom,
            DateTime? dto,
            RequestStatus? requestStatus
            )
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();
            //curuser.Require(Sys.Operations.Days);


            var qorders = Db.Orders
                .LoadWith(o => o.Part)
                .Where(o => o.Status == OrderStatus.Request)
                .Where(o => o.DomainId == curuser.DomainId)
                .WhereIf(dfrom != null, o => o.Date >= dfrom)
                .WhereIf(dto != null, o => o.Date <= dto.Value.ToMidnight(1))
                .WhereIf(requestStatus != null, o => o.RequestStatus == requestStatus)
                .OrderBy(o => o.DateFrom);

            var svc = new OrderRuleService { Db = Db, User = curuser };
            var now = DateTime.Now;

            var noproc_hours = OrderHelper.RequestNoProcessHours();
            var confirm_hours = OrderHelper.RequestConfirmHours();
            //var confirm_date = now.AddHours(-confirm_hours);

            var orders = from o in qorders
                let rule = svc.FindRules(o.Room.Base.DomainId, o.Room.BaseId, o.Date, o.DateFrom, now, null)
                    .FirstOrDefault()
                select new
                {
                    o.Id,

                    o.Date,
                    o.DateFrom,
                    o.DateTo,

                    СancelDate = rule != null ? (DateTime?)rule.MaxCancelDate(o.Date, o.DateFrom) : null,
                    NoprocessDate = o.Date.AddHours(noproc_hours),
                    ConfirmDate = o.Date.AddHours(confirm_hours + o.ConfirmDelay),

                    o.ClientId,
                    Client = o.Client.LastName + " " + o.Client.FirstName,
                    o.DomainId,
                    o.Room.BaseId,
                    Base = o.Room.Base.Name,
                    o.RoomId,
                    Room = o.Room.Name,
                    Total = o.TotalOrder, 
                    Comment = o.Comment + "",
                    o.RequestStatus,
                    CountOrders = o.Orders.Count(),
                };

            var res = await orders.ToListAsync();

            return Json(res);
        }


        /// <summary>
        /// Список заказов по абонементу
        /// </summary>
        [HttpGet("abonement")]
        public async Task<IActionResult> GetAbonementItemsAsync(Guid abonement)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var query0 = Db.Orders
                .LoadWith(o => o.Part)
                .GetDomainObjects(curuser.DomainId)
                .GetActuals()
                .Where(x => x.AbonementId == abonement)
                .Where(x => x.ShareId == null);  // добавил 2017-01-13 в связи с отображением в абонементе шаред заказов

            var query =
                from o in query0
                orderby o.DateFrom
                let forfeit = o.Part != null ? o.Part.Forfeit : 0
                select new
                {
                    o.Id,
                    o.PayDate,
                    o.DateFrom,
                    o.DateTo,
                    Comment = o.ClientComment,
                    o.Discount,
                    //x.Group,
                    o.Options,
                    o.RoomId,
                    o.Room.BaseId,
                    //x.Equipments,
                    o.ClientId,
                    Forfeit = forfeit,
                    o.PayForfeit,
                    o.PromoId,
                    Client = o.Client.LastName + " " + o.Client.FirstName,
                    TotalSum = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit + o.PaidForfeit,
                    o.TotalOrder,
                    o.PaidForfeit,
                    TotalPayment = o.TotalPayment(), // o.TotalOrder + forfeit - o.TotalPay,
                    o.Status,
                    IsHold = o.IsHold(),
                    Text = "",
                    Errors = "",
                };

            var list = await query.ToListAsync();
            return Json(list);
            
        }


        /// <summary>
        /// Список заказов по текущему пользователю (старый вариант до 2020-03)
        /// </summary>
        [HttpGet("my")]
        [Obsolete]
        public async Task<IActionResult> GetMyAsync()
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var query0 = Db.Orders
                .LoadWith(o => o.Part)
                //.GetDomainObjects(this.CurUser()?.DomainId)
                .Where(x => x.Status != OrderStatus.Unknown) // отсекаем связанные брони, они помечены серым, см https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/19494/
                .GetActuals();

            var clientId = curuser.ClientId ?? Guid.Parse("9a53ee5b-d8c3-4a58-a00d-7687986ed299"); // чтобы не повесить сервер
            //if (clientId!= null)
            query0 = query0
                .Where(x => x.ClientId == clientId);

            var eqlist = DbCache.Equipments.Get().Values
                .OrderBy(eq => eq.GroupId);


            var favs = await Db.Favorites
                    .GetActuals()
                    .Where(f => f.OwnerId == curuser.Id)
                    .Where(f => f.RoomId != null)
                    .Select(f => new { f.Id, f.RoomId })
                    .ToDictionaryAsync(f => f.RoomId.Value, f => f.Id);

            // список изображений по комнатам
            var images = await Db.Resources   // https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/36325/
                                              //.Where(r => r.ObjectId == x.RoomId)
                    .Where(r => r.Kind == ResourceKind.RoomPhoto)
                    .Select(r => new { r.Value, r.ObjectId, })
                    .ToListAsync();

            var qrules =
                from r in DbCache.OrderRules.Get()
                orderby r.Index
                where !r.IsArchive
                //where r.DomainId == baseDomainId //user.DomainId
                //where r.Allow(@base, dateCreate, dateFrom, now)
                select r;
            var rules = qrules.ToList();

            var d0 = DateTime.Now.AddMonths(-1); // за последние 30 дн  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/42269/?MID=88331#com88331

            var query =
                from o in query0
                let eqids = o.Equipments.ToGuids()
                let ordereq = eqlist
                    .Where(eq => eqids.Contains(eq.Id))
                    .Select(eq => new { eq.Id, eq.Name, eq.GroupId, Group = eq.GroupId != null ? eq.Group.Name : "--", Quantity = 1, })
                let bs = o.Room.Base

                orderby o.DateFrom // сортируем запрос по убыванию
                where o.DateFrom > d0

                let rule = rules
                    .Where(r => r.DomainId == bs.DomainId)
                    .Where(r => r.Allow(o.Room.BaseId, o.Date, o.DateFrom, DateTime.Now, o.SourceType))
                    .FirstOrDefault()

                select new
                {
                    o.Id,

                    CancelDate = rule != null ? (DateTime?)rule.MaxCancelDate(o.Date, o.DateFrom) : null,
                    CancelRule = rule != null ? rule.Name : null,

                    Room = new
                    {
                        Id = o.RoomId,
                        Name = o.Room.Name,
                        o.Room.Square,
                        o.Room.VideoUrl,
                        IsFavorite = favs.ContainsKey(o.RoomId.Value),
                        o.Room.Raider,
                        Images = images
                            .Where(im => im.ObjectId == o.RoomId)
                            .Select(im => new { Path = im.Value })
                            .ToArray(),
                    },
                    Base = new
                    {
                        Id = o.Room.BaseId,
                        bs.Address,
                        bs.Description,
                        bs.Direction,
                        bs.GpsLat,
                        bs.GpsLong,
                        //bs.InfoUrl,
                        bs.Metro,
                        bs.CityId,
                        City = bs.City.Name,
                        bs.Name,
                        //bs.Raider,
                        bs.VideoUrl,
                        //bs.Type,
                        bs.SphereId,
                        bs.Phones,
                        bs.Email,
                        bs.WorkTime,
                        bs.WeekendTime,
                    },
                    o.Status,
                    TotalPrice = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit,
                    o.Date,
                    o.DateFrom,
                    o.DateTo,
                    Hours = (o.DateFrom - o.DateTo).TotalHours,
                    o.PayDate,
                    o.Discount,
                    //x.Group,
                    o.DomainId,
                    Options = o.Options.ToGuids(),
                    Equipments = ordereq.ToList(),
                    Forfeit = o.PaidForfeit,
                    // or.ForfeitSum, ForfeitSum
                    o.ClientComment,
                    o.RoomSum,
                };

            var list = await query.ToListAsync();
            return Json(list);
        }

        /// <summary>
        /// Список заказов по текущему пользователю (оптимизированная версия)
        /// </summary>
        [HttpGet("my2")]
        [Obsolete]
        public async Task<IActionResult> GetMy2Async(DateTime? mindate)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var clientId = curuser.ClientId ?? Guid.Parse("9a53ee5b-d8c3-4a58-a00d-7687986ed299"); // чтобы не весить сервер
            mindate ??= DateTime.Now.AddMonths(-3); // за последние 3 мес -  30 дн  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/42269/?MID=88331#com88331

            var qorders0 = Db.Orders
                .LoadWith(o => o.Part)
                //.GetDomainObjects(this.CurUser()?.DomainId)
                .GetActuals()
                .Where(or => or.Status != OrderStatus.Unknown) // отсекаем связанные брони, они помечены серым, см https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/19494/
                .Where(or => or.ClientId == clientId)
                .Where(or => or.DateFrom > mindate);

            // заменяем список оборудования на bool:  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/42191/?MID=88975#com88975
            //var eqlist = EquipmentsController.List.Get().Values
            //    .OrderBy(eq=>eq.GroupId);
            var equipments = DbCache.Equipments.Get().Values.AsQueryable()
                .GetActuals()
                //.GetDomainObjects(domainId, true)
                .Where(x => x.AllowMobile)
                .Where(eq => eq.BaseId != null)
                .GroupBy(eq => eq.BaseId)
                .ToDictionary(x => x.Key, x => 1);

            var favs = await Db.Favorites
                    .GetActuals()
                    .Where(f => f.OwnerId == curuser.Id)
                    .Where(f => f.RoomId != null)
                    .Select(f => new { f.Id, f.RoomId })
                    .ToDictionaryAsync(f => f.RoomId.Value, f => f.Id);


            var qrules =
                from r in DbCache.OrderRules.Get()
                orderby r.Index
                where !r.IsArchive
                //where r.DomainId == baseDomainId //user.DomainId
                //where r.Allow(@base, dateCreate, dateFrom, now)
                select r;
            var rules = qrules.ToList();

            var qorders =
                from o in qorders0

                //let eqids = or.Equipments.ToGuids()
                //let ordereq = eqlist
                //    .Where(eq => eqids.Contains(eq.Id))
                //    .Select(eq => new { eq.Id, eq.Name, eq.GroupId, Group = eq.GroupId!=null ?eq.Group.Name :"--", Quantity = 1, })
                let bs = o.Room.Base
                let rule = rules
                    .Where(r => r.DomainId == bs.DomainId)
                    .Where(r => r.Allow(o.Room.BaseId, o.Date, o.DateFrom, DateTime.Now, o.SourceType))
                    .FirstOrDefault()
                orderby o.DateFrom // сортируем запрос по убыванию

                select new   // изменения согл https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/42191/
                {
                    o.Id,

                    CancelDate = rule != null ? (DateTime?)rule.MaxCancelDate(o.Date, o.DateFrom) : null,
                    //CancelRule = rule != null ? rule.Name : null,

                    o.RoomId,
                    o.Room.BaseId,
                    o.Status,
                    TotalPrice = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit,
                    //or.Date,
                    o.DateFrom,
                    o.DateTo,
                    Hours = (o.DateFrom - o.DateTo).TotalHours,
                    o.PayDate,
                    Options = o.Options.ToGuids(),

                    //Equipments = ordereq.ToList(),
                    Equipments = equipments.ContainsKey(o.Room.BaseId),

                    Forfeit = o.PaidForfeit,
                    // or.ForfeitSum,  ForfeitSum
                    o.PayForfeit,
                    o.ClientComment,
                    o.RoomSum,
                };

            var orders = await qorders.ToListAsync();

            // Собираем инфу по комнатам
            var roomids = orders
                .Select(or => or.RoomId)
                .Distinct()
                .ToList();

            // список изображений по комнатам
            var images = await Db.Resources   // https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/36325/
                                              //.Where(r => r.ObjectId == x.RoomId)
                    .Where(r => r.Kind == ResourceKind.RoomPhoto)
                    .Where(r => roomids.Contains(r.ObjectId))
                    .Select(r => new { r.Value, r.ObjectId, })
                    .ToListAsync();

            var qrooms = Db.Rooms
                .Where(r => roomids.Contains(r.Id))
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Square,
                    //r.VideoUrl,
                    IsFavorite = favs.ContainsKey(r.Id),
                    r.Raider,
                    Images = images
                            .Where(im => im.ObjectId == r.Id)
                            .Select(im => new { Path = im.Value })
                            .ToArray(),
                });


            // собираем инфу по базам
            var baseids = orders
                .Select(or => or.BaseId)
                .Distinct()
                .ToList();

            var channels = DbCache.PayChannels.Get();
            //var dchannels = channels.ToDictionary(x => x.Id);

            var qbases =
                from b in Db.Bases
                where baseids.Contains(b.Id)
                let chids = b.ChannelIds.ToGuids()
                select new
                {
                    b.Id,
                    b.Name,
                    b.Address,
                    //b.Description,
                    b.Direction,
                    //b.GpsLat,
                    //b.GpsLong,

                    //channel = DbUtils.GetChannel(dchannels, b),
                    Channels = channels
                        .Where(ch => chids.Contains(ch.Id))
                        .Select(ch => new
                        {
                            ch.PrepayUrl,
                            ch.Forfeit1,
                            ch.Forfeit2,
                            ch.Total1,
                            ch.Total2,
                            ch.Kind,
                            ch.PartPc,
                        })
                        .ToList(),

                    b.Rules,
                    b.Metro,
                    b.GpsLat,
                    b.GpsLong,
                    b.CityId,
                    //City = b.City.Name,
                    b.VideoUrl,
                    b.SphereId,
                    b.Phones,
                    b.Email,
                    b.Domain.Terminal,
                    //b.WorkTime,
                    //b.WeekendTime,
                };


            var list = new
            {
                orders,
                rooms = await qrooms.ToListAsync(),
                bases = await qbases.ToListAsync(),
            };

            // var oo = list.Where(x => x.Forfeit + x.ForfeitSum > 0); for test forfeit
            return Json(list);
        }

        /// <summary>
        /// Операции, по которым проходит начисление баллов
        /// </summary>
        //static My.App.Fin.Groups.Row[] ADD_POINTS_OPS = 
        //{
        //    My.App.Fin.Groups.DET_POINTS_BOOKING,
        //    My.App.Fin.Groups.DET_POINTS_MANUAL,
        //    My.App.Fin.Groups.DET_POINTS_RETURN,
        //    My.App.Fin.Groups.DET_POINTS_REVIEW
        //};

        /// <summary>
        /// Список заказов по текущему пользователю (оптимизированная версия)
        /// </summary>
        [HttpGet("my-list")]
        public async Task<IActionResult> GetMyListAsync(DateTime? mindate, Guid? order, DateTime? now)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var clientId = curuser.ClientId ?? Guid.Empty; // Guid.Parse("9a53ee5b-d8c3-4a58-a00d-7687986ed299"); // чтобы не вешать сервер
            now ??= DateTime.Now;
            mindate ??= DateTime.Now.AddMonths(-3); // за последние 3 мес -  30 дн  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/42269/?MID=88331#com88331

            var all_rules = DbCache.OrderRulesAll.Get();
            var actual_rules = all_rules
                .GetActuals()
                .ToList();

            var channels = DbCache.PayChannels.Get();
            //var dchannels = channels.ToDictionary(x => x.Id);

            var svc = new OrderRuleService { Db = Db, User = curuser };
            //var add_keys = ADD_POINTS_OPS.Select(r => r.Key);

            var qorders = Db.Orders
                    .LoadWith(o => o.Part)
                    .WhereIf(order != null, o => o.Id == order)  // for testing
                    .GetActuals()
                    //.GetDomainObjects(this.CurUser()?.DomainId)
                    ;

            var qorders_sel =
                from o in qorders
                where o.Status != OrderStatus.Unknown // отсекаем связанные брони, они помечены серым, см https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/19494/
                where o.ClientId == clientId
                where o.DateFrom > mindate

                orderby o.DateFrom // сортируем запрос по убыванию

                let channeIdsAsStr = o.Room.ChannelIds ?? o.Room.Base.ChannelIds  // учитываем наследование
                let chids = channeIdsAsStr.ToGuids()

                let rule = svc.FindRules(o.Room.Base.DomainId, o.Room.BaseId, o.Date, o.DateFrom, now, o.SourceType)  // 82103 Выводить в api/orders/my-list в параметре cancelDate значение на основании источника бронирования.
                    .FirstOrDefault()

                //let rule = rules
                //    .Where(r => r.DomainId == o.Room.Base.DomainId || r.IsDefault)
                //    .OrderBy(r => r.IsDefault)  // сначала false
                //    .ThenBy(r => r.Index)
                //    .Where(r => r.Allow(o.Room.BaseId, o.Date, o.DateFrom, now, o.SourceType))
                //    .FirstOrDefault()

                let has_reviews = Db.Reviews
                    .Any(r => r.RoomId == o.RoomId && r.Owner.ClientId == clientId)

                // сумма оплат
                //let payments = Db.Transactions
                //    .Where(t => t.OrderId == o.Id)
                //    .Where(t => t.Register == My.App.Fin.Groups.REG_CLIENTS.Key)
                //    .Where(t => t.Operation == My.App.Fin.Groups.OP_CLIENTS_PAYMENT_RUB.Key)
                //    .Sum(t => t.Total)

                let add_points = Db.Transactions
                    .Where(t => t.OrderId == o.Id)
                    //.Where( t => add_keys.Contains(t.Details) )
                    .Where(t => t.Operation == My.App.Fin.Groups.OP_POINTS_ADD.Key)
                    .Sum(t => t.Total)

                let pay_channels =  channels    // наличие онлайн канала  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/42971/
                        .Where(ch => chids.Contains(ch.Id))
                        .Where(ch => ch.Kind == PayChannelKind.Instruction || ch.Kind == PayChannelKind.Online)
                        .Where(ch => ch.Forfeit1 == 0)
                        .Where(ch => ch.Forfeit2 == 0)
                        .Where(ch => ch.Total1 == 0)
                        .Where(ch => ch.Total2 == 0)

                select new   // изменения согл https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/42191/
                {
                    o.Id,
                    o.Status,
                    o.RequestStatus,

                    o.RequestId,
                    
                    o.AbonementId,  // для совместимости
                    Abonement = o.AbonementId == null ?null :new  // добавлено в рамках 78899
                    {
                        Id = o.Abonement.Id,
                        //o.Abonement.Source,
                        o.Abonement.DateFrom,
                        o.Abonement.DateTo,
                        //o.Abonement.ClientDiscount,
                        //o.Abonement.Description,
                    },

                    o.DateFrom,
                    o.DateTo,
                    Hours = (o.DateTo - o.DateFrom).TotalHours,
                    DateExpired = o.GetDateExpired(),

                    CancelDate = rule != null ? (DateTime?)rule.MaxCancelDate(o.Date, o.DateFrom) : null,
                    Rule = rule !=null ?rule.Name : null, // debug only

                    payonline = pay_channels.Any(),
                    //payChannels = pay_channels.ToList(),  // for debug

                    //or.RoomId,
                    o.Room.Base.DomainId,
                    o.Room.BaseId,
                    Base = o.Room.Base.Name,
                    ChannelIds = chids,
                    o.Range,

                    o.RoomId,
                    Room = o.Room.Name,
                    o.Room.Base.Address,
                    o.Room.Base.SphereId,
                    //TotalPays = payments,
                    o.TotalPays,
                    //Forfeit = o.PaidForfeit,
                    o.TotalOrder,
                    o.Part.Forfeit,
                    o.CancelForfeit,
                    o.PaidForfeit,
                    TotalPayment = o.TotalPayment(), // o.TotalOrder + o.Part.Forfeit - o.TotalPay,
                    TotalSum = o.GetTotalSum(), //  o.TotalOrder + o.Part.Forfeit,

                    AddPoints = add_points,
                    RemPoints = o.PointsSum,

                    HasReviews = has_reviews,

                    o.Lifetime,

                };

            var orders = await qorders_sel.ToListAsync();

            return Json(orders);
        }


        /// <summary>
        /// Список заказов по текущему пользователю (оптимизированная версия)
        /// </summary>
        [HttpGet("my-get")]
        public async Task<IActionResult> GetMyGetAsync(Guid id)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var ruleslist = DbCache.OrderRules.Get();
            var rules = ruleslist
                .GetActuals()
                .OrderBy(eq=>eq.Index);

            var eqdict = DbCache.Equipments.Get().Values
                .GetActuals()
                .Where(eq => eq.AllowMobile)
                .ToDictionary(eq => eq.Id);

            var qorder =
                from o in Db.Orders
                    .LoadWith(o => o.Part)
                    .Finds(id)

                // where or.ClientId == curuser.ClientId
                //let eqids = or.Equipments.ToGuids()

                // сумма оплат
                //let payments = Db.Transactions
                //    .Where(t => t.OrderId == o.Id)
                //    .Where(t => t.Register == My.App.Fin.Groups.REG_CLIENTS.Key)
                //    .Where(t => t.Operation == My.App.Fin.Groups.OP_CLIENTS_PAYMENT_RUB.Key)
                //    .Sum(t => t.Total)

                let qitems =
                    from item in OrderHelper.GetItems(o.ItemsJson, true, false)
                    let eq = eqdict.GetValueOrDefault(item.eq.Value)
                    where eq != null
                    select new
                    {
                        EqId = item.eq,
                        eq.Name,
                        eq.Price,
                        eq.Count,
                        item.n,
                        eq.Description,
                        eq.Kf,
                        eq.DestKind,
                        eq.PhotoUrl,
                    }

                let bs = o.Room.Base
                let bsid = o.Room.BaseId

                let rule = rules
                    .Where(r => r.DomainId == bs.DomainId)
                    .Where(r => r.Allow(o.Room.BaseId, o.Date, o.DateFrom, DateTime.Now, o.SourceType))
                    .FirstOrDefault()

                select new   // изменения согл https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/42191/
                {
                    o.Id,

                    o.RoomId,
                    BaseId = bsid,
                    o.Status,

                    o.Date,
                    o.DateFrom,
                    o.DateTo,
                    DateExpired = o.GetDateExpired(),
                    Hours = (o.DateTo - o.DateFrom).TotalHours,
                    o.PayDate,
                    CancelDate = rule != null ? (DateTime?)rule.MaxCancelDate(o.Date, o.DateFrom) : null,


                    //CancelRule = rule != null ? rule.Name : null,
                    Options = o.Options.ToGuids(),
                    o.Range,

                    Items = qitems.ToArray(),

                    //TotalPays = payments,
                    o.TotalPays,
                    //Forfeit = o.PaidForfeit,
                    //or.ForfeitSum,
                    o.PayForfeit,
                    o.ClientComment,
                    o.RoomSum,

                    o.TotalOrder,
                    o.Part.Forfeit,
                    o.CancelForfeit,
                    o.PaidForfeit,
                    TotalPayment = o.TotalPayment(), // o.TotalOrder + o.Part.Forfeit - o.TotalPay,
                    TotalSum = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit,

                    //Room = room,
                };


            var order = await qorder.FirstOrDefaultAsync();


            var qfavs = Db.Favorites
                .GetActuals()
                .Where(f => f.OwnerId == curuser.Id)
                .Where(f => f.RoomId == order.RoomId)
                .Select(f => new { f.Id, f.RoomId });

            // список изображений по комнатам
            var images = await Db.Resources   // https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/36325/
                .Where(r => r.ObjectId == order.RoomId)
                .Where(r => r.Kind == ResourceKind.RoomPhoto)
                .OrderBy(r => r.Sort)
                //.Select(r => new { r.Value, r.ObjectId, });
                .Select(im => new { Path = im.Value })
                .ToListAsync();

            var qrooms = Db.Rooms
                .Finds(order.RoomId)
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Square,
                    //r.VideoUrl,
                    r.Raider,
                    IsFavorite = qfavs.Any(),
                    Images = images,
                        //qimages
                        //    .Where(im => im.ObjectId == r.Id)
                        //    .Select(im => new { Path = im.Value })
                        //    .ToArray(),
                });

            var room = await qrooms.FirstOrDefaultAsync();

            var channels = DbCache.PayChannels.Get();
            //var dchannels = channels.ToDictionary(x => x.Id);

            var qbases =
                from b in Db.Bases.Finds(order.BaseId)
                let chids = b.ChannelIds.ToGuids()

                // заменяем список оборудования на bool:  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/42191/?MID=88975#com88975
                let eq = eqdict
                    .Any(eq => eq.Value.BaseId == b.Id)

                select new
                {
                    b.Id,
                    b.Name,
                    b.Address,
                    //b.Description,
                    b.Direction,
                    //b.GpsLat,
                    //b.GpsLong,

                    //channel = DbUtils.GetChannel(dchannels, b),
                    equipments = eq,
                    Channels = channels
                        .Where(ch => chids.Contains(ch.Id))
                        .Select(ch => new
                        {
                            ch.PrepayUrl,
                            ch.Forfeit1,
                            ch.Forfeit2,
                            ch.Total1,
                            ch.Total2,
                            ch.Kind,
                            ch.PartPc,
                        })
                        .ToList(),

                    b.Rules,
                    b.Metro,
                    b.GpsLat,
                    b.GpsLong,
                    b.CityId,
                    //City = b.City.Name,
                    b.VideoUrl,
                    b.SphereId,
                    b.Phones,
                    b.Email,
                    b.Domain.Terminal,
                    //b.WorkTime,
                    //b.WeekendTime,
                };

            var @base = await qbases.FirstOrDefaultAsync();

            var res = new
            {
                order,
                room,
                @base
            };

            return Json(res);
        }



        /// <summary>
        /// Вид источника (для отчетов)
        /// </summary>
        public enum SourceFilterKind
        {
            Abonements = 1,
            Mobile = 2,
            Site = 3,
            Widget = 4,
            Bot = 5,
        }

        /// <summary>
        /// Статистика по броням
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync(
            DateTime? dfrom,
            DateTime? dto,
            string search,
            [FromQuery(Name = "base")] Guid? baseid, // = Convert<Guid?>(args.@base);
            Guid? room, // = Convert<Guid?>(args.room);
            Guid? promo, // = Convert<Guid?>(args.promo);
            //GroupKind? group,
            Guid? option,
            Guid? request,
            OrderStatus? status,
            Guid? domain, 
            Guid? sphere, 
            string comm, // all, last, curr
                         //bool anybase,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] SourceFilterKind[] sources,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] SourceType[] sourceTypes,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] eqtypes,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] eqs,
            bool archive,
            bool prepay // признак предоплаты
            )
        {
            this.RequiresAuthentication();

            //var args = this.Request.Query;
            var curuser = this.CurUser();

            //проверяем разрешение на работу с чужими партнерами
            if (domain != null) 
                curuser.Require(Sys.Operations.StatisticPromo);

            // Для обычных пользователей пустой домен заменяем на домен текущего пользователя
            if(domain == null && !curuser.IsSuper())   // #66587  если суперадминистратор, то разрешаем работать со всеми записями
                domain =  curuser.DomainId;

            // ограничиваем список месяцем до
            var qorders = Db.Orders
                .LoadWith(o => o.Part)
                .WhereIf(domain != null, o => o.DomainId == domain )
                .GetActuals(!archive)  //учитываем удаленные архивные согласно таску 16376, но игнорим для статистики
                .WhereIf(sourceTypes?.Length > 0, x => sourceTypes.Contains(x.SourceType))
                .WhereIf(dfrom!= null, x => x.DateFrom >= dfrom.Value.ToMidnight(0))
                .WhereIf(dto!= null, x => x.DateTo < dto.Value.ToMidnight(1))
                .WhereIf(baseid!= null, x => x.Room.BaseId == baseid)
                .WhereIf(room!= null, x => x.RoomId == room)
                .WhereIf(sphere!= null, x => x.Room.Base.SphereId == sphere)
                .WhereIf(request != null, x => x.RequestId == request)
                .WhereIf(promo!= null, x => x.PromoId == promo || x.HotPromoId == promo )
                .WhereIf(status!= null, x => x.Status == status)
                .WhereIf(prepay, x => x.IsPrepay == true)
                .WhereIf(option!= null, x => x.Options != null && x.Options.Contains(option.ToString()))
                ;
                // .Where(x => x.Room.DomainId == domain ); 2018-06-09 как альтернатива - рассматривать по собственным броням
                //.Where(x => x.Status!=DocumentStatus.Unknow)


            if (sources != null && sources.Length > 0)
            {
                //System.Linq.Expressions.Expression<Func<Order, bool>> expr = x => false;
                //if (sources.Contains(SourceKind.Abonements))
                //    expr = x => expr || true;
                //query.Where()

                qorders = qorders.Where(x =>
                    (sources.Contains(SourceFilterKind.Abonements) ? x.AbonementId != null : false) ||
                    (sources.Contains(SourceFilterKind.Mobile) ?
                        x.SourceType == SourceType.Mobile ||
                        //x.SourceType == SourceType.MobilePre  || 
                        x.SourceType == SourceType.Catalog 
                        //|| x.SourceType == SourceType.CatalogPre
                        : false) ||
                    (sources.Contains(SourceFilterKind.Widget) ? x.SourceType == SourceType.Widget  : false) ||  //|| x.SourceType == SourceType.WidgetPre
                    (sources.Contains(SourceFilterKind.Bot) ? x.SourceType == SourceType.Bot : false) ||
                    (sources.Contains(SourceFilterKind.Site) ? x.SourceType == SourceType.Web : false)
                );
            }


            //if (comm != null)
            //{
            //    if (comm == "mob") // все мобильные бронирования
            //        query = query.Where(x => x.SourceType == SourceType.Mobile);
            //    else // иначе - либо прошлые, либо текущий мес
            //        query = query.WherePeriod(comm == "last" ? PeriodType.Debt | PeriodType.Previos : PeriodType.Current).WhereInvoices();
            //}

            var mob_src_types = new[]
            {
                SourceType.Mobile,
                SourceType.Catalog,
                SourceType.Request
            };
            if (comm == "mob") // все мобильные бронирования
            {
                //qorders = qorders.Where(x => x.SourceType == SourceType.Mobile || x.SourceType == SourceType.Catalog);
                qorders = qorders
                    .Where(o => mob_src_types.Contains(o.SourceType));
            }
            else if (comm == "last")// иначе - либо прошлые, либо текущий мес
                qorders = qorders
                    //.Where(x => x.SourceType == SourceType.Mobile)
                    .WherePeriod(PeriodType.Debt | PeriodType.Previos).WhereInvoices();
            else if (comm == "curr")// иначе - либо прошлые, либо текущий мес
                qorders = qorders
                    //.Where(x => x.SourceType == SourceType.Mobile || x.SourceType == SourceType.Catalog)
                    .Where(o => mob_src_types.Contains(o.SourceType))
                    .WherePeriod(PeriodType.Current).WhereInvoices();
            else if (comm == "pred")
            {    // иначе - либо прошлые, либо текущий мес
                var stypes = new[] {
                    SourceType.Request, 
                    SourceType.Mobile, 
                    //SourceType.MobilePre,
                    SourceType.Catalog,
                    //SourceType.CatalogPre,
                    SourceType.Widget, 
                    //SourceType.WidgetPre, 
                    SourceType.Bot };
                qorders = qorders
                    //.Where(o => o.IsPrepay)  -- а с какого перепугу решил, что здесь все ставить предоплату??  71389
                    .Where(o => stypes.Contains(o.SourceType));
            }
            else if (comm == "mob1")
            {
                qorders = qorders.Where(x => x.MobComm > 0);
            }



            var useEQ = eqtypes?.Length > 0 || eqs?.Length > 0;
            if (useEQ)
            {
                // убираем из фильтра пустые Equipments
                //query = query.Where(x => x.Equipments != null);
                qorders = qorders.Where(x => x.ItemsJson != null);
                //var eqGroup = GroupsController.Groups.Get()[eqtype.Value];
                //eqprice = eqGroup.p
            }

            // блокируем https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/22984/
            //if (!anybase)
            //    query = query.FilterAllowBases(user);

            // Добавляем поиск по тексту
            if (!string.IsNullOrWhiteSpace(search))
            {
                var phone = MiscUtils.FormatPhone(search);
                qorders = qorders.Where(x =>
                    x.Client.FirstName.Contains(search) ||
                    x.Client.LastName.Contains(search) ||
                    x.Client.Resources.Any(r => r.Value.Contains(phone)) ||
                    x.Client.SurName.Contains(search) ||
                    //x.Client.CardNum.Contains(search) ||
                    x.Client.BitrixNum.Contains(search) ||
                    x.Client.Email.Contains(search) ||
                    x.ClientComment.Contains(search)
                );
            }

            //if (reason!= null)
            //    query = query.Where(x => x.Reason == (Models.CancelReason)reason.Value);

            var groups = DbCache.Groups.Get();

            // формируем список телефонов для всех клиентов, входящих в выборку  - 55089
            //var client_idents = await qorders
            //    .Select(o => o.ClientId)
            //    .Distinct()
            //    .ToListAsync();

            //var phones_all = await Db.Resources  // получается списковый запрос, но тут уж извините
            //    .Where(r => r.ObjectId != null && client_idents.Contains(r.ObjectId))
            //    .Where(r => r.Kind == ResourceKind.ClientPhone)
            //    .Select(o => new { o.ObjectId, o.Value })
            //    .ToListAsync();


            var qorders_sel =
                from o in qorders
                let h2 = o.DateTo.Hour
                let opt = o.Options.ToGuids()
                    .Select(x => groups.GetValueOrDefault2(x, Group.Empty).Name)

                let res = Db.Resources.Where(r => r.ObjectId == o.ClientId)
                let phones = res  // o.Client.Resources получается списковый запрос, но тут уж извините
                    .Where(r => r.Kind == ResourceKind.ClientPhone)
                    .Select(o => o.Value)

                //let phones = phones_all
                //    .Where(ph => ph.ObjectId == o.ClientId)
                //    .Select(ph => ph.Value)

                select new
                {
                    o.Id,
                    o.Date,
                    o.DateFrom,
                    o.PayDate,
                    Comment = o.Comment + "",
                    ClientComment = o.ClientComment + "",

                    o.ClientId,
                    Client = o.Client.LastName + " " + o.Client.FirstName,
                    //o.Client.User.Phone,
                    Phones = string.Join(',', phones),
                    o.Client.Email,

                    Request = new   // 84409
                    {
                        o.RequestId,
                        o.Request.RequestStatus, 
                        Login = o.Request.Messages   // добавляем логин пользоваеля, последним сделавший сообщение
                            .Where(rm => rm.SenderId != null)  
                            .OrderByDescending(rm => rm.Date)
                            .Select(rm => rm.Sender.Login)
                            .FirstOrDefault()
                    },

                    o.DomainId,
                    Domain = o.Domain.Name,
                    o.Room.Base.SphereId,
                    BaseId = o.Room.BaseId,
                    Base = o.Room.Base.Name,
                    o.Room.Base.IsRequest,
                    RoomId = o.RoomId,
                    Room = o.Room.Name,
                    //x.Group,
                    Options = string.Join(",", opt),
                    Promo = o.Promo.Name + o.HotPromo.Name,
                    Hours = (h2 == 0 ? 24 : h2) - o.DateFrom.Hour,
                    o.Range,

                    o.IsPrepay,
                    o.TotalOrder,
                    o.Part.Forfeit,
                    o.CancelForfeit,
                    o.PaidForfeit,
                    o.TotalPays,
                    TotalPayment = o.TotalPayment(), // o.TotalOrder + o.Part.Forfeit - o.TotalPay,
                    TotalSum = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit,
                    //Discounts = x.RoomPrice + x.EquipmentPrice - x.TotalPrice,
                    Discounts = o.RoomDiscountSum + o.EqDiscountSum,

                    //ClientBitrixNum = x.Client.BitrixNum,
                    o.Status,
                    o.Reason,
                    o.Discount,
                    o.IsConfirmed,
                    IsHold = o.IsHold(),
                    o.MobComm,
                    o.ItemsJson,
                    o.IgnoreMobComm,
                    o.EqPrice,
                    o.EqSum,
                    o.SourceType,
                };

            var list_orders = await qorders_sel.ToListAsync();

            if (useEQ)
            {
                //var eqids = await db.Equipments
                //    .Where(x => x.GroupId != null)
                //    .Where(x => eqtypes.Contains(x.GroupId.Value))
                //    .Select(x => x.Id)
                //    .ToListAsync();

                //var sg = string.Join(",", g);

                // формируем список оборудования, указанного в фильтре
                var eqids_filtered = DbCache.Equipments.Get().Select(x => x.Value).AsQueryable()
                    .Where(x => x.GroupId != null)
                    .WhereIf(eqtypes?.Length >0, x => eqtypes.Contains(x.GroupId.Value))
                    .WhereIf(eqs?.Length >0, x => eqs.Contains(x.Id))  // 65919
                    .Select(eq => eq.Id)
                    .ToList();

                var qlist_orders =
                    from o in list_orders
                    //let eqids = x.Equipments.ToGuids()

                    //// старый алгоритм расчета стоимости доп. оборудования
                    //let eqids = OrderHelper.GetItemsIds(x.ItemsJson)
                    //let sum = eqlist.Where(y => eqids.Contains(y.Id)).Sum(y => y.Price * y.Count)  // add count:  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/51265/
                    //let pc = x.EqPrice == 0 ? 0f : 1f / x.EqPrice * x.EqSum
                    //let eqsum = Convert.ToInt32(sum * pc)

                    // новый алгоритм расчета стоимости доп. оборудования #51265
                    let order_eqres = OrderHelper.GetItems(o.ItemsJson, true, true)
                        .Where(eqi => eqids_filtered.Contains(eqi.eq.Value))
                        .Select(eqi => eqi.ToResult(o.Hours))
                    let eqsum = order_eqres.Sum(eqi => eqi.Total)

                    //var eq = eqprice(eqlist, x)
                    ////var grp = x.Equipments.ToGuids()
                    ////where !grp.Intersect(eqids).IsEmpty()
                    //where x.eqids != null

                    where eqsum > 0
                    select new
                    {
                        o.Id,
                        o.Date,
                        o.DateFrom,
                        o.PayDate,
                        o.Comment,
                        o.ClientComment,

                        o.IsRequest,
                        o.Request,

                        o.ClientId,
                        o.Client,
                        o.Phones,
                        o.Email,
                        o.Domain,

                        o.RoomId,
                        o.BaseId,
                        //x.Group,
                        o.Promo,
                        o.Hours,
                        o.TotalSum,
                        o.Range,

                        o.IsPrepay,
                        o.Discounts,
                        o.Status,
                        o.Reason,
                        o.Discount,
                        o.IsConfirmed,
                        o.IsHold,
                        o.MobComm,
                        o.ItemsJson,
                        o.IgnoreMobComm,
                        //eqids,
                        //sum
                        //pc,
                        eqSum = eqsum,
                        o.SourceType,
                    };

                var list_orders_Sel = qlist_orders.ToList();
                return Json(list_orders_Sel);
            }

            return Json(list_orders);
        }


        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id, bool full = false)
        {
            var user = this.CurUser();

            var qorders = Db.Orders
                .LoadWith(x => x.Room.Base)
                .LoadWith(x => x.Client.User)
                .LoadWith(x => x.Promo)
                .LoadWith(x => x.HotPromo)
                .LoadWith(x => x.Part)
                .AsQueryable();

            var anyDomain = user.IsSuper();  //curuser.Allow(Sys.Operations.StatisticPromo) && curuser?.Domain?.AllowShare == true;
            if (!anyDomain)
                qorders = qorders.GetDomainObjects(user?.DomainId);

            var o = await qorders.FindAsync(id);

            if (o == null)
                throw new UserException("Бронь не найдена или находится в другой партнерской зоне");

            o.Part = o.Part ?? Db.GetOrCreateClientPart(o.ClientId, user?.DomainId, 30);

            // ищем баны и сборы по клиенту
            var csvc = new ClientService { Db = Db };
            var (bans, forfeits) = await csvc.GetClientProblems(o.ClientId);

            //var qeq = EquipmentsController.List.Get();
            //var equipments = full ?
            //        obj.Equipments.ToGuids()
            //        .Select(xid => qeq[xid])
            //        .Select(x => new
            //        {
            //            x.Id,
            //            x.Name,
            //        })
            //        .ToList() : null;

            var points = o.ClientId == null ? 0
                : await Db.Transactions.Where(t => t.ClientId == o.ClientId).BalanceAsync(Fin.Groups.REG_POINTS);
            //var forfeit = await Db.ForfeitAsync(orderobj.Room.Base.DomainId, orderobj.ClientId);

            //var pays = o.ClientId == null ? 0
            //    : await Db.Transactions.Where(t => t.OrderId == o.Id).BalanceAsync(Fin.Groups.REG_CLIENTS, Fin.Groups.OP_CLIENTS_PAYMENT_RUB);

            var res = new
            {
                o.Id,
                Comment = o.Comment ?? "",
                ClientComment = o.ClientComment ?? "",

                o.Date,
                o.PayDate,
                o.DateFrom,
                o.DateTo,
                DateExpired = o.GetDateExpired(),

                o.EqPrice,
                //obj.Equipments,
                Discount = o.Discount,
                //ClientForfeit = forfeit, 
				ClientForfeit = o.Part.Forfeit,  // для совместимости
                //Forfeit = forfeit, // orderobj.Forfeit,
				//Forfeit = o.Part?.Forfeit,
                FullForfeit = o.PaidForfeit + o.Part.Forfeit + o.CancelForfeit,
                o.TotalOrder,
                o.Part.Forfeit,
                o.CancelForfeit,
                o.PaidForfeit,
                TotalPayment = o.TotalPayment(), // o.TotalOrder + o.Part.Forfeit - o.TotalPay,
                TotalSum = o.GetTotalSum(),  //  o.TotalOrder + o.Part.Forfeit + o.PaidForfeit

                o.Options,

                o.RoomId,
                RoomName = o.Room?.Name,
                BaseId = o.Room?.BaseId,
                BaseName = o.Room?.Base?.Name,
                BaseSphere = o.Room?.Base.SphereId,
                o.RoomPrice,
                //TotalPays = pays,
                o.TotalPays,
                o.SourceType,
                o.Range,

                o.IsPointsPay,
                o.PointsSum,
                Balance = points,
                IsPrepay = o.IsPrepay,

                o.RequestId,
                o.RequestStatus,

                ClientId = o.Client?.ToIdValue(),
                o.Client?.Email,
                o.Client?.User?.Phone,

                //ClientInfo = obj.Client?.ToInfo(),
                //ClientForfeit = obj.Client?.Forfeit ?? 0,
                //ClientBitrixNum = obj.Client?.BitrixNum,
                o.Status,
                o.Reason,
                o.PayForfeit,
                //Promo = obj.Client?.PromoCode,
                //PromoId = obj.PromoId == null || obj.Promo.Type==PromoType.Action 
                //    ?(object)obj.PromoId 
                //    :new { value = obj.Promo.Name } ,
                o.PromoId,
                Promo = o.Promo?.Name,
                HotPromo = o.HotPromo?.Name,
                IsHold = o.IsHold(),

                //Eqlist = equipments,
                o.ItemsJson,
                HasBans = bans > 0,
                HasForfeits = forfeits > 0,

            };
            return Json(res);
        }


        [HttpPost("commission")]
        public async Task<IActionResult> CommissionAsync(Guid id, [FromForm(Name = "ignoreMobComm")] bool ignore)
        {
            this.RequiresAuthentication();
            this.RequiresAdmin();

            await Db.Orders.Finds(id)
                .Set(x => x.IgnoreMobComm, ignore)
                .UpdateAsync();

            return Ok();
        }



        [HttpGet("totals")]
        public async Task<IActionResult> GetTotalsAsync(
            DateTime dfrom,
            DateTime dto,
            Guid? order
            )
        {
            this.RequiresAuthentication();

            dfrom = dfrom.ToMidnight();
            dto = dto.ToMidnight(1);

            var curuser = this.CurUser();

            var queryOrders = Db.Orders
                .LoadWith(o => o.Part)
                .GetDomainObjects(curuser.DomainId)
                .WhereIf(order != null, o => o.Id == order)
                .GetActuals();
                //.Where(o => o.Id == Guid.Parse("bd9ea4c4-e2f1-4542-98fb-de9209161970"));  // для тестирования 

            queryOrders = queryOrders.FilterAllowBases(curuser, o => o.Room.BaseId);

            var qOrders =
                from o in queryOrders
                where o.Status == OrderStatus.Closed || o.Status == OrderStatus.Cancel

                let d = o.PayDate.Value // вернул обратно x.DateFrom -> PayDate, согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18980/
                where d >= dfrom && d < dto  // change PayDate -> DateFrom, task: https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18502/
                orderby d

                let qorder_tran = Db.Transactions  
                    .Where(t => t.OrderId == o.Id)

                select new
                {
                    Room = o.Room.Name,
                    Base = o.Room.Base.Name,
                    //BaseType = x.Room.Base.Type,
                    BaseSphere = o.Room.Base.Sphere.Name,

                    TotalSum = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit + o.PaidForfeit,
                    TotalOnline = qorder_tran  // костыль - расчет Оплата онлайн  #78267  
                        .Where(t => t.Details == Groups.DET_CLIENTS_PAYMENT_ONLINE.Key)
                        .Sum(t => t.Total),
                    TotalCache = qorder_tran  // костыль - расчет Оплата нал закр  #54179
                        .Where(t => t.Details == Groups.DET_CLIENTS_PAYMENT_AUTOCACH.Key)
                        .Sum(t => t.Total),
                    TotalBack = qorder_tran  // костыль - расчет Вовзрат нал  #65809
                        .Where(t => t.Details == Groups.DET_CLIENTS_PAYMENT_AUTOBACK.Key)
                        .Sum(t => t.Total),                    
                    TotalBackPred = qorder_tran  // костыль - расчет Вовзрат нал при предоплате Тинькова #65809
                        .Where(t => t.Details == Groups.DET_CLIENTS_PAYMENT_AUTOBACK_TINKOFF.Key)
                        .Sum(t => t.Total),

                    Date = d,
                    FullTotalPrice = o.RoomPrice + o.EqPrice,
                    Group = o.AbonementId != null ? "Абонементы" : "Брони",
                    o.SourceType,
                    Channel = (o.ChannelId != null) ?o.Channel.Name : "Нал",
                };

            var list_orders = await qOrders.ToListAsync();

            var c = System.Globalization.CultureInfo.CurrentCulture;

            var list_orders_sel =
                from o in list_orders
                let g = new
                {
                    date = o.Date.ToMidnight(),
                    room = o.Room,
                    @base = o.Base,
                    //x.BaseType,
                    o.BaseSphere,
                    o.Group,
                    o.SourceType,
                    o.Channel,
                }
                group o by g into r
                orderby r.Key.date
                let d = r.Key.date
                let grp = r.Key
                select new
                {
                    Room = grp.room,
                    Base = grp.@base,
                    //BaseType = x.BaseType.GetMember().GetAttr<System.ComponentModel.DescriptionAttribute>()?.Description,
                    grp.BaseSphere,
                    Totals = r.Sum(y => y.TotalSum),
                    TotalsOnline = r.Sum(y => y.TotalOnline),
                    TotalsCache = r.Sum(y => y.TotalCache),
                    TotalsBack = r.Sum(y => y.TotalBack),
                    TotalsBackPred = r.Sum(y => y.TotalBackPred),
                    FullTotals = r.Sum(y => y.FullTotalPrice),
                    Discounts = Math.Max(0, r.Sum(y => y.FullTotalPrice - y.TotalSum)),
                    //Date = d, //.ToString("dd.MM.yy"),
                    //d.Year,
                    //d.Month,
                    //d.Day,
                    DayStr = d.ToString("MM-dd,") + d.GetDayOfWeekRu(),
                    //Week = c.Calendar.GetWeekOfYear(d, c.DateTimeFormat.CalendarWeekRule, DayOfWeek.Monday),
                    grp.Group,
                    //Group = "Оплата брони",
                    User = "",
                    Source = grp.SourceType.ToString(),
                    grp.Channel,
                };

            var totals = list_orders_sel.ToList();  // в спиков, т,к. иначе неверно группируется 

            var qryExpenses =
                from x in Db.ExpenseItems.FilterAllowBases(curuser, it => it.Expense.BaseId)
                let exp = x.Expense
                where exp.IsArchive == false  //exp.IsArchive == null || 
                where exp.IsPublic
                where exp.DomainId == curuser.DomainId
                where exp.Date >= dfrom && exp.Date < dto

                let d = exp.Date
                //var baseType = exp.Base.Type.GetMember().GetAttr<System.ComponentModel.DescriptionAttribute>().Description

                select new
                {
                    Room = "(Все комнаты)",
                    Base = exp.Base.Name,
                    //BaseType = baseType,
                    BaseSphere = exp.Base.Sphere.Name,
                    Totals = -x.Amount,
                    TotalsOnline = 0,
                    TotalsCache = 0,
                    TotalsBack = 0,
                    TotalsBackPred = 0,
                    FullTotals = -x.Amount,
                    Discounts = 0,
                    DayStr = d.ToString("MM-dd,") + d.GetDayOfWeekRu(),
                    Group = x.Group.Name,
                    User = exp.CreatedBy.Login,
                    Source = "",
                    Channel = "",
                };

            //var res = query3.OrderBy(x => x.Date);
            var expensesList = await qryExpenses.ToListAsync();
            totals.AddRange(expensesList);
            return Json(totals);
        }




        /// <summary>
        /// Отчет по комиссионным отчислениям
        /// </summary>
        [HttpGet("totalscom")]
        public async Task<IActionResult> GetTotalsComAsync(
            DateTime? dfrom,
            DateTime? dto,
            DateTime? pfrom,
            DateTime? pto
            )
        {
            this.RequiresAdmin();

            dfrom = (dfrom ?? new DateTime(2000, 1, 1)).ToMidnight();
            dto = (dto ?? DateTime.Now).ToMidnight(1);
            pfrom = (pfrom ?? new DateTime(2000, 1, 1)).ToMidnight();
            pto = (pto ?? DateTime.Now).ToMidnight(1);

            var curuser = this.CurUser();

            // формируем список броней
            var queryOrders = Db.Orders
                .LoadWith(x => x.Room.Domain)
                //.GetDomainObjects(user?.DomainId)
                .Where(x => x.Room.DomainId != null)
                .Where(x => x.IgnoreMobComm == false)
                .Where(x => x.SourceType == SourceType.Mobile || x.SourceType == SourceType.Catalog) // added 2018-06-29 https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/22992/
                                                               //.GetActuals() показываем архив, согласно https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/22992/?MID=65430#com65430
                ;

            var dateMM1 = DateTime.Now.AddMonths(-1).ToMonth1(); // граница долга - 1-е число прошлого мес
            var dateM1 = DateTime.Now.ToMonth1(); // 1-е число мес

            // группируем и считаем суммы
            var queryOrderSums =
                from x in queryOrders
                    //where x.Status == DocumentStatus.Paid

                let d = x.DateFrom
                where d >= dfrom && d < dto
                orderby d

                // рассчитываем тип периода
                let dd = x.Domain.Period == Partners.PeriodKind.ByServiceDate ? x.DateFrom : x.Date
                /////let period = PartnerUtils.GetPeriod(dd)
                let period =
                    (dd >= dateM1) ? PeriodType.Current :
                    ((dd < dateMM1) ? PeriodType.Debt
                    : PeriodType.Previos)

                let g = new
                {
                    //date = dd,
                    x.Room.DomainId,
                    x.Room.Base.SphereId,
                    period,
                }
                group x by g into r

                select new
                {
                    r.Key.DomainId,
                    r.Key.SphereId,
                    Period = r.Key.period,
                    Total = r.Sum(y => y.MobComm),
                    Cnt = r.Count(),

                    //x.DomainId,
                    //x.Room.Base.SphereId,
                    //x.TotalSum,
                    //Date = d,
                    //Period = period,
                };

            //var c = System.Globalization.CultureInfo.CurrentCulture;

            var listOrderSums = await queryOrderSums.ToListAsync();

            // кэшируем список пользователей, чтобы показать имена ответственных
            //var qusers = Db.Users
            //    .Where(x => x.DomainIds.Length > 0)
            //    .Select(x => new { x.Id, DomainGuids = x.DomainIds.ToGuids(), name = x.Login })
            //    .ToListAsync();

            // кэшируем доменые зоны
            var qdomains =
                from x in Db.Domains
                let domain_users = Db.Users
                    .Where(x => x.DomainIds.Length > 0)
                    //.Select(x => new { x.Id, DomainGuids = x.DomainIds.ToGuids(), name = x.Login })
                    .Where(y => y.DomainIds.Contains((string)(object)x.Id))  // странная конструкция, однако позволила обойти ошибку запроса Linq2Db -> Postgre
                    .Select(y => y.Name)
                select new
                {
                    x.Id,
                    x.Name,
                    Users = string.Join(",", domain_users)
                };
            var domains = await qdomains.ToDictionaryAsync(x => x.Id);

            // кэшируем список сфер
            var spheres = DbCache.Spheres.Get();

            var queryTotals =
                from x in listOrderSums
                let domain = domains[x.DomainId.Value]
                let sphere = spheres.GetValueOrDefault2(x.SphereId.Value, null)
                select new
                {
                    //x.DomainId,
                    Type = "Комиссия",
                    Domain = domain.Name,
                    Sphere = sphere.Name,
                    Users = domain.Users ?? "",
                    Total = -x.Total,
                    //Debt = x.Period == PeriodType.Debt ? -x.Total : 0,
                    //Previous = x.Period == PeriodType.Previos ? - x.Total : 0,
                    //Current = x.Period == PeriodType.Current ? - x.Total : 0,
                    //Income = 0,
                };

            //var res = queryTotals.ToList();

            // считаем оплаты
            var qryPays =
                from x in Db.PayDocs
                where x.PayerDomId != null
                where x.IsCompleted
                where x.PayDate >= pfrom && x.PayDate < pto
                //let domain = domains[x.DomainId.Value]
                select new
                {
                    //x.DomainId,
                    Type = x.PayResult == null ? "Вручную" : "PayOnline",
                    Domain = x.PayerDom.Name,
                    Sphere = "Все сферы",
                    Users = "",
                    //Debt = 0,
                    //Previous = 0,
                    //Current = 0,
                    //Income = 
                    x.Total,
                };

            var pays = await qryPays.ToListAsync();
            var res = queryTotals.Union(pays)
                .OrderBy(x => x.Domain);

            return Json(res);

            //return Ok();
        }


        [HttpGet("odata/$metadata/{name?}")]
        public IActionResult GetODataMAsync(string name)
        {
            var xml =
                @"<service xml:base = 'http://localhost:999/dataservice/$metadata/'
                         xmlns:atom = 'http://www.w3.org/2005/Atom'
                         xmlns:app = 'http://www.w3.org/2007/app'
                         xmlns='http://www.w3.org/2007/app'>
                      <workspace>
                        <atom:title>Default</atom:title>
                        <collection href='ResourceTypes'>
                            <atom:title>ResourceTypes</atom:title>
                        </collection>
                        <collection href='ResourceProperties'>
                            <atom:title>ResourceProperties</atom:title>
                        </collection>
                        <collection href = 'ResourceSets'>
                            <atom:title>ResourceSets </atom:title>
                        </collection>
                    </workspace>
                </service>
            ";

            var meta = System.Xml.Linq.XDocument.Parse(xml);
            //return this.Response.AsXml(meta);
            return this.Content(xml, "application/xml");
        }


        [HttpGet("totalsxml")]
        public async Task<IActionResult> GetTotalsXmlAsync()
        {
            //this.RequiresAuthentication();

            //using (var Db = new DbConnection())
            {

                var queryOrders = Db.Orders
                    .LoadWith(o => o.Part)
                    //.GetDomainObjects(this.CurUser()?.DomainId)
                    .GetActuals();

                //queryOrders = filterAllowBases(queryOrders);
                //var d0 = new DateTime(1900,01,01);
                var dformat = "dd.MM.yyyy";
                var queryOrderSums =
                    from o in queryOrders
                    where o.Status != OrderStatus.Unknown
                    //where x.PayDate >= dfrom && x.PayDate < dto
                    orderby o.DateFrom
                    select new TotalsResult
                    {
                        //BaseType = x.Room.Base.Type,
                        BaseSphere = o.Room.Base.Sphere.Name,
                        Room = o.Room.Name,
                        Base = o.Room.Base.Name,
                        Domain = o.Room.Base.Domain.Name,
                        Bitrix = o.BitrixNum,
                        DocType = o.AbonementId != null ? "Абонемент" : "Бронь",
                        OrderDomain = o.Domain.Name,
                        //GroupKind = x.Group,
                        //x.Options,
                        Promo = o.Promo.Name,
                        CancelReason = o.Reason,
                        Status = o.Status,
                        MobComm = o.MobComm,
                        //Tarif = x.MobComPay.Tarif.Name,

                        ClientBitrix = o.Client.BitrixNum,
                        City = o.Client.City.Name,
                        ClientDomain = o.Client.Domain.Name,
                        //Genre = x.Client.Genre.Name,
                        Group = o.Client.Group.Name,
                        Music = o.Client.Music,
                        Source = o.Client.Source.Name,
                        //Style = x.Client.Style.Name,
                        //Tool = x.Client.Tool.Name,
                        //Type = x.Client.Type.Name,

                        Login = o.Client.User.Login,
                        Phone = o.Client.User.Phone,

                        Date = o.Date.ToString(dformat),
                        OrderDate = o.DateFrom.ToString(dformat),
                        Hours = (o.DateTo - o.DateFrom).TotalHours,
                        PayDate = o.Date.ToString(dformat), //("dd/MM/yyyy hh:mm"), //,
                        //PayDate = (x.PayDate.Value - d0).TotalDays.Round(),

                        EqClientDiscountSum = o.EqClientDiscountSum,
                        EqDiscountSum = o.EqDiscountSum,
                        EqPrice = o.EqPrice,
                        EqSum = o.EqSum,
                        ForfeitSum = o.PaidForfeit, // ForfeitSum
                        PayForfeit = o.PayForfeit,

                        RoomClientDiscountSum = o.RoomClientDiscountSum,
                        RoomDiscountSum = o.RoomDiscountSum,
                        RoomPrice = o.RoomPrice,
                        RoomSum = o.RoomSum,
                        TotalPrice = o.TotalPrice,
                        TotalSum = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit,

                        Email = o.Client.Email,

                    };

                var list = await queryOrderSums.ToListAsync();
                //var r = Response.Context.ApplyODataUriFilter(list);
                //return Response.AsOData(list);
                //var res = new
                //{
                //    title = "My 1st repost",
                //    query = list,
                //    //response = new
                //    //{
                //    //    format = "json",
                //    //},
                //    //d1 = new
                //    //{
                //    //    results = list,
                //    //}
                //};
                var res = Json(list);
                return res;
            }
        }


        /// <summary>
        /// Результат аналитических расчетов
        /// </summary>
        class TotalsResult
        {
            public string Room { get; set; }
            public string Base { get; set; }
            public int TotalSum { get; set; }
            public int MobComm { get; set; }
            public string Tarif { get; set; }
            //public DateTime PayDate { get; set; }
            public string PayDate { get; set; }
            //public int PayDate { get; set; }
            public int TotalPrice { get; set; }
            public string DocType { get; set; }
            //public BaseType BaseType { get; set; }
            public string BaseSphere { get; set; }
            public string Domain { get; set; }
            public string Bitrix { get; set; }
            public string ClientBitrix { get; set; }
            public string City { get; set; }
            public string ClientDomain { get; set; }
            public string Genre { get; set; }
            public string Group { get; set; }
            public string Music { get; set; }
            public string Source { get; set; }
            public string Style { get; set; }
            public string Tool { get; set; }
            public string Type { get; set; }
            public string Login { get; set; }
            public string Phone { get; set; }
            public string Date { get; set; }
            public string OrderDate { get; set; }
            public double Hours { get; set; }
            public string OrderDomain { get; set; }
            //public GroupKind GroupKind { get; set; }
            public int EqClientDiscountSum { get; set; }
            public int EqDiscountSum { get; set; }
            public int EqPrice { get; set; }
            public int EqSum { get; set; }
            public int ForfeitSum { get; set; }
            public bool PayForfeit { get; set; }
            public string Promo { get; set; }
            public CancelReason CancelReason { get; set; }
            public int RoomClientDiscountSum { get; set; }
            public int RoomDiscountSum { get; set; }
            public int RoomPrice { get; set; }
            public int RoomSum { get; set; }
            public OrderStatus Status { get; set; }
            public string Email { get; set; }
        }


    }



}


#region --- Misc ----

#endregion
