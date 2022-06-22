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
using My.App;
using System.Threading;
using Itall.App.Data;
using Microsoft.AspNetCore.Mvc;
using My.App.Common;
using Itall.Models;
using LinqToDB.Data;

namespace My.App.Orders
{
    public class RoomsController : UpdateDbController<Room>
    {
        protected override object OnUpdating(Updater<Room> updater)
        {
            this.CurUser().Require(Sys.Operations.ListBases);

            // ошибочная вставка - Комната должна совпадать с текущей, чтобы мы понимали, что это шаред
            //var obj = updater.Object;
            //if (obj.Id == obj.ShareId)
            //    throw new UserException("Общая комната должна отличаться от текущей");

            updater.Set(x => x.BaseId);
            //updater.Set(x => x.Description);
            updater.Set(x => x.Name);

            updater.Set(x => x.DefaultHours);
            updater.Set(x => x.WeekendHours);
            updater.Set(x => x.TodayHours);
            updater.Set(x => x.TodayWkHours);
            updater.Set(x => x.MinHours);
            updater.Set(x => x.HoursBefore);

            updater.Set(x => x.ShareId);
            updater.Set(x => x.ChannelIds);
            updater.Set(x => x.AllowMobile);
            updater.Set(x => x.Raider);
            updater.Set(x => x.Square);
            updater.Set(x => x.IsArchive);

            updateFeatures(updater);

            updater.Set(x => x.Order);
            updater.Set(x => x.Color);
            updater.Set(x => x.VideoUrl);

            var obj = updater.Object;
            WebApp.SendSocketAsync("changes", "", new
            {
                obj.Id,
                obj.Name,
                Type = "room",
                Event = updater.IsNew ? "new" : "edit",
            });
            return base.OnUpdating(updater);
        }

        private void updateFeatures(Updater<Room> updater)
        {
            // убираем features: feature.baseId != room.sphereId
            var sfids = updater.Set(x => x.Features);
            if (string.IsNullOrWhiteSpace(sfids)) return;
            
            // guid список параметров
            var fids = sfids.ToGuids();
            // find room sphere
            var sphereId = Db.Bases.Finds(updater.Object.BaseId)
                .Select(b => b.SphereId)
                .FirstOrDefault();
            // filter features
            var features = DbCache.Groups.Get().Values
                .Where(f => fids.Contains(f.Id))
                .Where(f => f.SphereIds != null)
                .Where(f => f.SphereIds.Contains(sphereId + ""))
                .Select(f => f.Id);
            // update feature ids
            updater.Object.Features = string.Join(',', features);
        }

        protected override void OnDeleted(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnDeleted(id, db);

            WebApp.SendSocketAsync("changes", "", new
            {
                Id = id,
                Type = "room",
                Event = "delete",
            });
        }

        protected override void OnChanged(Guid id, DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Prices.Reset();
        }


        /// <summary>
        /// Старый метод для доступа к списку комнат
        /// </summary>
        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(Guid? id, Guid? domain)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            //this.CurUser().Require(Sys.Operations.ListBases);

            var qrooms = 
                from r in Db.Rooms
                    .WhereIf(!user.IsSuper(), r => r.DomainId == user.DomainId)
                    .WhereIf(user.IsSuper() && domain != null, r => r.DomainId == domain)
                    .WhereIf( id!=null, ri => ri.Id == id)
                    .FilterAllowBases(user, r => r.BaseId)

                select new
                {
                    r.Id,
                    r.Name,
                    r.Raider,
                    r.BaseId,
                    Base = r.Base.Name,
                    r.Square,
                    r.AllowMobile,
                    r.ShareId,
                    r.IsArchive,
                    r.Order,
                    r.Color,
                };

            var list = await qrooms.ToListAsync();
            return Json(list);
        }
        

        //class RoomStatistic
        //{
        //    public int CountOrders { get; set; }
        //    public int CountViews { get; set; }
        //}

        (int CountOrders, int CountViews) getStatistic( DbConnection db, Guid? roomId )
        {
            var countOrders = Db.Orders.Where(o => o.Date >= _Now_30).Count(o => o.RoomId == roomId);
            return (countOrders, 0);
        }


        DateTime _Now_30 = DateTime.Now.AddDays(-30).Date;

        /// <summary>
        /// Новый меттод для списка комнат
        /// </summary>
        [HttpGet("list2")]
        public async Task<IActionResult> GetList2Async(Guid? id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            //this.CurUser().Require(Sys.Operations.ListBases);

            var qrooms = Db.Rooms
                    .GetDomainObjects(user.DomainId)
                    .WhereIf(id != null, ri => ri.Id == id)
                    .FilterAllowBases(user, r => r.BaseId);

            var room_ids = await qrooms.Select(r => r.Id).ToListAsync();

            var images = Db.Resources   // https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/32020/
                .Where(ri => room_ids.Contains(ri.ObjectId))
                .Where(ri => ri.Kind == ResourceKind.RoomPhoto)
                .OrderBy(ri => ri.Sort)
                .Select(ri => new { ri.ObjectId, ri.Value })
                .Distinct2(r => r.ObjectId)
                .ToDictionary(r => r.ObjectId, r => r.Value);

            var qrooms_sel = 
                from r in qrooms

                // from image in qimages  //.DefaultIfEmpty()
                //let image = Db.Resources   // https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/32020/
                //    .Where(ri => ri.ObjectId == r.Id)
                //    .Where(ri => ri.Kind == ResourceKind.RoomPhoto)
                //    .OrderBy(ri => ri.Sort)
                //    .Select(ri => new { ri.Value })
                //    .FirstOrDefault()


                select new
                {
                    r.Id,
                    r.Name,
                    //r.Raider,
                    r.BaseId,
                    //r.Square,
                    //x.IsPromo,
                    r.AllowMobile,
                    r.ShareId,
                    r.IsArchive,
                    r.Order,
                    r.Color,
                    Image = images.GetValueOrDefault(r.Id),

                    Nfavorites = r.Favorites.Count(),           // 54664 
                    Value = r.Reviews.Average(r => r.Value),     // 54664 

                    // заблокировано 74687
                    //CountOrders = Db.Orders.Where(o => o.Date>= _Now_30).Count(o => o.RoomId == r.Id),
                    //CountViews = Db.Messages
                    //    .Where(o => o.Kind == MessageKind.ViewRoom && o.Date >= _Now_30)
                    //    .Count(o => o.ObjectId == r.Id),

                    r.Updated,
                };

            var list = await qrooms_sel.ToListAsync();
            return Json(list);
        }


        /// <summary>
        /// Поиск комнат и возврат полной информации по комнатам
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync(
            [FromQuery(Name = "sphere")] Guid? sphereId,
            [FromQuery(Name = "domain")] Guid? domainId,
            [FromQuery(Name = "base")] Guid? baseId,
            [FromQuery(Name = "room")] Guid? roomId,
            bool? action,
            [FromQuery(Name = "city")] Guid? cityId,
            DateTime? date,
            int hours,
            int range,
            //GroupKind group,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] options,
            bool mobile = true
            )
        {

            var qrooms = Db.Rooms
                .LoadWith(x => x.Base)
                .WhereIf( sphereId, x => x.Base.SphereId == sphereId)
                .WhereIf( baseId, x => x.BaseId == baseId)
                .WhereIf( cityId, x => x.Base.CityId == cityId)
                .WhereIf( roomId, x => x.Id == roomId)
                .WhereIf( mobile, x => x.AllowMobile == mobile)
                .GetDomainObjects(domainId, true)
                .GetDomainActuals()
                .GetActuals();


            var pricelist = DbCache.Prices.Get(); // предзакачка для тестирования

            // if (date == null) return Error("Не задана дата");
            var dateFrom = date ?? DateTime.MinValue;

            // if (hours == 0) return Error("Не задано кол-во часов");
            var dateTo = dateFrom.AddHours(hours);

            // сначала сохраняем в список, тк AllowTime() не конвертируется в SQL
            var rooms = await qrooms.ToListAsync();

            if (date != null)
            {
                // находим заказы на этот период
                var orderRoomIds = await Db.Orders
                    .GetBetweenOrders(dateFrom, dateTo) // только в указанном периоде
                    .Where(o => o.Status != OrderStatus.Cancel)
                    .Where(o => o.Status != OrderStatus.Request)
                    .GetActuals()  // только актуальные заказы
                    //.GetCalendarOrders(dateFrom, dateTo, null) // только в указанном периоде
                    .Select(x => x.RoomId.Value)
                    //.Distinct()
                    .ToListAsync();

                // вычитаем комнаты, в которых уже есть заказы
                if (orderRoomIds.Count > 0)
                    //qrooms = qrooms.Where(x => !orderRoomIds.Contains(x.Id));
                    rooms = rooms
                        .Where(x => !orderRoomIds.Contains(x.Id))
                        .ToList();
            }

            // убираем комнаты, для которых заблокирован клиент
            var parts = new List<CRM.ClientPart>();
            if (this.CurUser()?.ClientId != null)
            {
                parts = await Db.ClientParts
                    .Where(x => x.ClientId == this.CurUser().ClientId)
                    .ToListAsync();

                //qrooms =
                //    from x in qrooms
                //    //var part = parts.FirstOrDefault(y => y.DomainId == x.DomainId) //DbUtils.GetOrCreateClientPart(db, this.CurUser().ClientId, x.DomainId)
                //    join part in parts on x.DomainId equals part.DomainId
                //    where part == null || part.IsBanned == false || part.IsBanned == null
                //    select x;
            }

            if (date != null)
            {
                // вычитаем комнаты, для которых недоступно бронирование на данные часы
                rooms = rooms
                    .Where(x => x.Base.AllowTime(dateFrom, dateTo))
                    .ToList();
            }

            var features = DbCache.Groups.Get().Values
                .Where(x => x.Type == CRM.GroupType.RoomFeature)
                .OrderBy(x => x.Index)
                .ToDictionary(x => x.Id);

            var images = await Db.Resources
                .GetDomainObjects(domainId, true)
                .Where(x => x.Kind == ResourceKind.RoomPhoto)
                .OrderBy(x => x.Sort)
                .Select(x => new
                {
                    x.Kind,
                    RoomId = x.ObjectId,
                    x.Name,
                    x.Value,
                })
                .ToListAsync();

            var urls = await Db.Resources
                .GetDomainObjects(domainId, true)
                .Where(x => x.Kind == ResourceKind.RoomUrl)
                .Select(x => new
                {
                    RoomId = x.ObjectId,
                    Type = x.Name,
                    x.Value,
                })
                .ToListAsync();

            var user = this.CurUser();
            //var service = new OrderCalcUtils();

            var qrooms1 =
                from r in rooms

                // отсекаем зоны, где клиент заблокирован
                let part = parts.FirstOrDefault(y => y.DomainId == r.DomainId)
                where part == null || part.IsBanned == false

                // вычисляем аргумент для расчета стоимости брони 
                let ordargs = date != null 
                ? new CalcArgs
                    {
                        Db = Db,
                        CheckErrors = true,
                        CheckOrders = false,
                        RoomId = r.Id,
                        Room = r,
                        DFrom = dateFrom,
                        DTo = dateTo,
                        //Group = @group,
                        Options = options,
                        ClientId = user?.ClientId,
                        ClientPart = part,
                        //RoomPrice = 0,
                        PayForfeit = false, // не учитываем штраф при поиске комнат
                        Range = range,
                    } 
                : null

                let price = Calcs.CalcHelper.CalculateAsync(ordargs).Result

                // фильтруем акции
                where action == null || price?.IsAction == action

                orderby price?.Errors != null // вначале идут без ошибок (false: error==null, true: error!=null)
                 

                select new
                {
                    r.Id,
                    r.Name,
                    r.BaseId,
                    r.Square,
                    r.DomainId,
                    //room.Description,
                    r.Raider,

                    r.DefaultHours,
                    r.WeekendHours,
                    r.TodayHours,
                    r.TodayWkHours,
                    r.MinHours,

                    r.VideoUrl,

                    Images = images.Where(img => img.RoomId == r.Id).ToList(),
                    Urls = urls.Where(url => url.RoomId == r.Id).ToList(),

                    Features = r.Features.ToGuids()
                        .Select(fid => features.GetValueOrDefault2(fid, null))
                        .Where(f => f.Id != null)   // отсекаем удаленные
                        .Select(f => new
                        {
                            Id = f.Id,
                            f.Name,
                            f.Description,
                            f.Icon,
                            Category = f.Category?.Name,
                        })
                        .ToList(),

                    Price = price,
                };

            qrooms1 = qrooms1.Where(x => string.IsNullOrWhiteSpace(x.Price?.Errors) || (x.Price?.IsFixHours ?? true));
            var res = qrooms1.ToList();
            // var ttt = res.Where(r => r.Urls.Count > 0).ToList(); // test

            return Json(res);

        }

        public enum RoomStatus
        {
            Free = 0,
            Buzy = 1,
            Unavailable = 2,
            Block = 3,
        }


        static readonly List<Order> EMPTY_ORDERS = new List<Order>();

        /// <summary>
        /// Поиск комнат и возврат полной информации по комнатам
        /// </summary>
        [HttpGet("search2")]
        public async Task<IActionResult> Search2Async(
            Guid? sphere = null,
            Guid? domain = null,
            Guid? @base = null,
            Guid? room = null,
            bool? action = null,
            Guid? city = null,
            DateTime? date = null,
            int hours = 0,
            int range = 0,
            //GroupKind group,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] options = null,
            bool mobile = true
            )
        {

            var user = this.CurUser(); // его м.б. и не быть

            var qrooms = Db.Rooms
                .LoadWith(r => r.Base)
                .WhereIf(sphere, x => x.Base.SphereId == sphere)
                .WhereIf(@base, x => x.BaseId == @base)
                .WhereIf(city, x => x.Base.CityId == city)
                .WhereIf(room, x => x.Id == room)
                .WhereIf(mobile, x => x.AllowMobile == mobile)
                .GetDomainObjects(domain, true)
                .GetDomainActuals()
                .GetActuals()
                .Where(r => r.Base.IsArchive == false)
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.BaseId,
                    r.Base,
                    r.Square,
                    r.DomainId,
                    //room.Description,
                    r.Raider,
                    r.DefaultHours,
                    r.WeekendHours,
                    r.TodayHours,
                    r.TodayWkHours,
                    r.MinHours,
                    r.HoursBefore,
                    r.VideoUrl,
                    r.Order,
                    r.ChannelIds,
                    r.Features,
                    Nfavorites = r.Favorites.Count(),
                    Obj = r,

                    // временно комментарим в рамках 73637 
                    CountOrders = 0,
                        //Db.Orders
                        //.Where(o => o.Date >= _Now_30)
                        ////.WhereIf(room != null, o => o.RoomId == room, o => o.RoomId == r.Id)
                        //.Where(o => o.RoomId == r.Id)
                        //.Count(),
                    CountViews = 0, 
                        //Db.Messages
                        //.Where(o => o.Kind == MessageKind.ViewRoom)
                        //.Where(o => o.Date >= _Now_30)
                        ////.WhereIf(room != null, o => o.ObjectId == room, o => o.ObjectId == r.Id)
                        //.Where(o => o.ObjectId == r.Id)
                        //.Count(),

                    r.Updated,

                });  // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/39431/


            // if (date == null) return Error("Не задана дата");
            var dateFrom = date ?? DateTime.MinValue;
            // if (hours == 0) return Error("Не задано кол-во часов");
            var dateTo = dateFrom.AddHours(hours);

            // сначала сохраняем в список, тк AllowTime() не конвертируется в SQL
            var rooms_list = await qrooms.ToListAsync();

            //if (date != null) -- теперь возвращаем занятые комнаты - https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/41011/
            //{
            //    // находим заказы на этот период
            //    var orderRoomIds = await Db.Orders
            //        .GetBetweenOrders(dateFrom, dateTo) // только в указанном периоде
            //        .Where(o => o.Status != OrderStatus.Cancel)
            //        .GetActuals()  // только актуальные заказы
            //                       //.GetCalendarOrders(dateFrom, dateTo, null) // только в указанном периоде
            //        .Select(x => x.RoomId.Value)
            //        //.Distinct()
            //        .ToListAsync();

            //    // вычитаем комнаты, в которых уже есть заказы
            //    if (orderRoomIds.Count > 0)
            //        //qrooms = qrooms.Where(x => !orderRoomIds.Contains(x.Id));
            //        rooms = rooms
            //            .Where(x => !orderRoomIds.Contains(x.Id))
            //            .ToList();
            //}

            // убираем комнаты, для которых заблокирован клиент
            var parts = new List<CRM.ClientPart>();
            if (user?.ClientId != null)
            {
                parts = await Db.ClientParts
                    .Where(x => x.ClientId == user.ClientId)
                    .ToListAsync();

                //qrooms =
                //    from x in qrooms
                //    //var part = parts.FirstOrDefault(y => y.DomainId == x.DomainId) //DbUtils.GetOrCreateClientPart(db, this.CurUser().ClientId, x.DomainId)
                //    join part in parts on x.DomainId equals part.DomainId
                //    where part == null || part.IsBanned == false || part.IsBanned == null
                //    select x;
            }

            var orders = EMPTY_ORDERS; // по умолчанию - все даты, пустое множество объектов

            if (date != null)
            {
                // вычитаем комнаты, для которых недоступно бронирование на данные часы
                var bases = rooms_list
                    .Select(r => r.Base)
                    .Distinct(new DbObjectComparer<Base>())
                    .Where(b => b.AllowTime(dateFrom, dateTo))
                    .ToDictionary(b=>(Guid?)b.Id);

                rooms_list = rooms_list
                    //.Where(x => x.Base.AllowTime(dateFrom, dateTo))
                    .Where(r => bases.ContainsKey(r.BaseId))
                    .ToList();

                orders = await Db.Orders
                    .GetActuals()
                    .GetBetweenOrders(dateFrom, dateTo)
                    .ToListAsync();
            }

            var features = DbCache.Groups.Get().Values
                .GetActuals()
                .Where(f => f.Type == CRM.GroupType.RoomFeature)
                .OrderBy(f => f.Index)
                .ToDictionary(f => f.Id);

            // кэшируем room id
            var rooms_ids = rooms_list
                .Select(r => r.Id)
                .ToList();
            
            // получаем список image, с учетом ИД комнат
            var images = await Db.Resources
                .GetDomainObjects(domain, true)
                .Where(r => r.Kind == ResourceKind.RoomPhoto)
                .Where(r => rooms_ids.Contains(r.ObjectId))
                .OrderBy(r => r.Sort)
                .Select(r => new
                {
                    r.Kind,
                    RoomId = r.ObjectId,
                    r.Name,
                    r.Value,
                })
                .ToListAsync();

            var urls = await Db.Resources
                .GetDomainObjects(domain, true)
                .Where(r => r.Kind == ResourceKind.RoomUrl)
                .Select(r => new
                {
                    RoomId = r.ObjectId,
                    Type = r.Name,
                    r.Value,
                    r.Description,
                })
                .ToListAsync();

            //var service = new OrderCalcUtils();

            // favorites for current user
            var favs = new Dictionary<Guid, Guid>();
            if(user != null)
            {
                favs = await Db.Favorites
                    .GetActuals()
                    .Where(f => f.OwnerId == user.Id)
                    .Where(f => f.RoomId != null)
                    .Select(f => new { f.Id, f.RoomId})
                    .ToDictionaryAsync(f => f.RoomId.Value, f => f.Id);
            }

            // считаем средние оценки по комнатам
            var qreviews =
                from r in Db.Reviews.GetPublicReviews()
                group r by r.RoomId into gr
                select new
                {
                    RoomId = gr.Key,
                    Value = gr.Average(r => 0f + r.Value),
                    Count = gr.Count(),
                };

            var reviews = await qreviews.ToDictionaryAsync(r => r.RoomId, r => new {r.Count, r.Value });
            var channels = DbCache.PayChannels.Get();
            var prices = DbCache.Prices.Get(); 

            var qres_rooms =
                from r in rooms_list

                    // отсекаем зоны, где клиент заблокирован
                let part = parts.FirstOrDefault(y => y.DomainId == r.DomainId)
                //where part == null || part.IsBanned == false || part.IsBanned == null

                // вычисляем аргумент для расчета стоимости брони 
                let ordargs = date != null ? new CalcArgs
                {
                    Db = Db,
                    CheckErrors = true,
                    CheckOrders = true,
                    RoomId = r.Id,
                    Room = r.Obj,
                    DFrom = dateFrom,
                    DTo = dateTo,
                    //Group = @group,
                    Options = options,
                    Range = range,
                    ClientId = user?.ClientId,
                    ClientPart = part,
                    Orders = orders.AsQueryable(),  // для оптимизации расчетов
                    //RoomPrice = 0,
                    PayForfeit = false, // не учитываем штраф при поиске комнат
                } : null

                let price = Calcs.CalcHelper.CalculateAsync( ordargs ).Result
                where price== null || price.Hour2 <= 24 // отсекаем заполночь https://hendrix.bitrix24.ru/company/personal/user/180/tasks/task/view/37573/

                // список актуальных цен для комнаты с учетом наследования
                let qroom_prices = prices
                    .Where(p => 
                        p.RoomId == r.Id || 
                        p.RoomId == null && p.BaseId == r.BaseId || 
                        p.RoomId == null && p.BaseId == null && p.DomainId == r.DomainId
                     )

                // фильтруем акции
                where action == null || price?.IsAction == action

                // channels
                let chids = r.ChannelIds.ToGuids()

                // features
                let features_sel = r.Features.ToGuids()
                        .Where(fid => features.ContainsKey(fid))
                        //.Select(fid => features.GetValueOrDefault(fid))
                        //.Where(f => f!= null)
                        //.Select(f => new
                        //{
                        //    f.Id,
                        //})

                orderby price?.Errors != null // вначале идут без ошибок (false: error==null, true: error!=null)

                select new
                {
                    r.Id,
                    r.Name,
                    r.BaseId,
                    r.Square,
                    r.DomainId,
                    //room.Description,
                    r.Raider,
                    IsFavorite = favs.ContainsKey(r.Id),
                    Status = getRoomStatus(price, part),

                    Channels = channels
                        .Where(ch => chids.Contains(ch.Id))
                        .Select(ch => new
                        {
                            ch.Forfeit1,
                            ch.Forfeit2,
                            ch.Total1,
                            ch.Total2,
                            ch.Kind,
                            ch.PartPc,
                        })
                        .ToList(),

                    r.DefaultHours,
                    r.WeekendHours,
                    r.TodayHours,
                    r.TodayWkHours,
                    r.MinHours,
                    r.VideoUrl,
                    r.Order,
                    Review = reviews.GetValueOrDefault(r.Id, null),

                    Images = images.Where(img => img.RoomId == r.Id).ToList(),
                    Urls = urls.Where(url => url.RoomId == r.Id).ToList(),

                    Features = features_sel,  // отсекаем удаленные согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/41823/
                    Price = price,
                    //Prices__debug = qroom_prices.ToList(),
                    minPrice = qroom_prices
                        .Select(p => p.Min())
                        .Where(s => s>0)
                        .Min(s => s) ?? 0, // 50693
                    maxPrice = qroom_prices.Max(p => p.Max()) ?? 0, // 50693

                    r.Nfavorites,  // 54664 

                    r.Base.MaxPointsPcPay,
                    BookingPointsPc = Fin.TransService.GetDomainPointPc(r.Base.DomainId, null, r.BaseId, r.Id),

                    r.CountOrders,
                    r.CountViews,
                    r.Updated,
                };

            // получаем статус комнаты согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/41011/
            RoomStatus getRoomStatus(CalcResult calc, CRM.ClientPart part)
            {
                var args = calc?.Args;
                if (args == null) return RoomStatus.Free; // по умолчанию свободны
                //if (!string.IsNullOrWhiteSpace(calc?.Errors)) return RoomStatus.Buzy;
                if (args.IsCheckReserv() && !args.Room.CheckHoursBefore(args.DFrom - args.Date)) return RoomStatus.Buzy;
                if (args.HoursError == true) return RoomStatus.Buzy;
                if (args.HasOrders == true) return RoomStatus.Buzy;
                if (part?.IsBanned == true) return RoomStatus.Block;
                if (calc?.IsFixHours == true) return RoomStatus.Unavailable;
                return RoomStatus.Free;
            }

            //qrooms1 = qrooms1 // блокируем согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/41011/ - все в статусе
            //    .Where(x => string.IsNullOrWhiteSpace(x.Price?.Errors) || (x.Price?.IsFixHours ?? true));
            var res_rooms = qres_rooms.ToList();

            //var rr = rooms
            //    .Where(r=>r.Features != null)
            //    .Where(r => r.Features.Contains("90e1eb1f-7df7-4789-8c03-fa60c7122af5"))
            //    .ToList();

            var qroom_features = res_rooms  // ыместо rooms согл. https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/39791/
                .Select(r => new { r.Id, Features = r.Features })
                .SelectMany(r => r.Features)
                //var room_features2 = room_features1
                .GroupBy(fid => fid, fid => fid, (id, grp) => new { id, count = grp.Count() });

            var qroom_features_sel =
                from f in qroom_features
                let fobj = features.GetValueOrDefault(f.id) 
                where fobj != null  // убираем удаленные записи
                orderby fobj.Category.Index, fobj.Index
                select new
                {
                    f.id,
                    f.count,
                    fobj.Name,
                    fobj.CategoryId,
                    Category = fobj.Category?.Name,
                    fobj.Description,
                    fobj.Icon,

                    //Cindex = fobj.Category.Index,  -- for test
                    //fobj.Index,
                };

            // var ttt = res.Where(r => r.Urls.Count > 0).ToList(); // 4test
            var res = new
            {
                rooms = res_rooms,
                features = qroom_features_sel.ToList(),
            };
            return Json(res);

        }


        [HttpGet("names")]
        public async Task<IActionResult> GetNamesAsync(
            [FromQuery(Name = "base")]Guid? baseId,
            bool full
            )
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var query = Db.Rooms
                .GetDomainObjects(user.DomainId)
                .WhereIf(baseId.HasValue, x => x.BaseId == baseId)
                .OrderBy(x => x.Base.Name)
                .ThenBy(x => x.Name)
                .GetActuals();


            var query1 = query.Select(x => new
            {
                x.Id,
                value = (full) ? x.Name + " (" + x.Base.Name + ")" : x.Name,
                x.BaseId,
                x.Order,
            });
            var list = await query1.ToListAsync();
            return Json(list);
        }

        static readonly OrderStatus[] USED_STATUSES = new[]
        {
            OrderStatus.Unknown,
            OrderStatus.Reserv,
            OrderStatus.Closed,
        };

        [HttpGet("free")]
        public async Task<IActionResult> GetFreeAsync(
            [FromQuery(Name = "base")] Guid? baseId,
            [FromQuery(Name = "from")] DateTime dateFrom,
            int hours
            )
        {
            //this.RequiresAuthentication();

            //var args = this.Request.Query;
            //Guid? baseId = args.@base;
            //DateTime dateFrom = args.from;
            //int hours = args.hours;

            var dateTo = dateFrom.AddHours(hours);

            var query = Db.Rooms
                .GetActuals()
                .GetDomainActuals()
                .Where(x => x.AllowMobile); //.GetDomainObjects(this.CurUser()?.DomainId);

            if (baseId.HasValue)
                query = query.Where(x => x.BaseId == baseId);

            var qrooms =
                from x in query
                let qreviews = Db.Reviews
                    .GetPublicReviews()
                    .Where(r => r.RoomId == r.Id)
                    .Where(r => r.Value > 0)
                select new
                {
                    //Object = x,
                    x.Id,
                    x.Name,
                    x.BaseId,
                    BaseName = x.Base.Name,
                    x.Base,
                    //x.Description,
                    //x.IsPromo,
                    x.DomainId,
                    x.Raider,
                    x.Square,
                    x.VideoUrl,
                    review = new
                    {
                        Count = qreviews.Count(),
                        Value = qreviews.Average(r => r.Value),
                    }
                };
            var rooms = (await qrooms.ToListAsync()).AsEnumerable();

            var domainId = this.CurUser()?.DomainId;

            // check prices
            //rooms = rooms.Where(x => DbUtils.AllowRoomTime(x.Id, x.BaseId, x.DomainId, dateFrom, dateTo));
            rooms = rooms.Where(x => x.Base.AllowTime(dateFrom, dateTo));

            var qorders =
                from o in Db.Orders
                    .LoadWith(x => x.Client)
                    .LoadWith(x => x.Room.Base)
                    //.GetDomainObjects(domainId)
                    .GetBetweenOrders(dateFrom, dateTo)
                    .GetActuals()
                    //where o.Status == OrderStatus.Reserv || o.Status == OrderStatus.Paid
                where USED_STATUSES.Contains(o.Status)
                select o;

//#if DEBUG
//            var oo = qorders
//                .ToList();
//#endif

            // check other orders
            var roomIds = await qorders
                .Select(o => o.RoomId)
                .ToListAsync();

            rooms = rooms.Where(x => !roomIds.Contains(x.Id));

            return Json(rooms);
        }

        [HttpGet("allowTime")]
        public async Task<IActionResult> AllowTime(
            DateTime datefrom,
            DateTime dateto,
            [FromQuery(Name = "room")] Guid? roomId,
            [FromQuery(Name = "base")] Guid? baseId,
            [FromQuery(Name = "domain")] Guid? domainId
            )
        {
            this.RequiresAuthentication();

            //var args = this.Request.Query;
            //DateTime datefrom = args.datefrom;
            //DateTime dateto = args.dateto;
            //Guid? roomId = args.room;
            //Guid? baseId = Convert<Guid?>(args.@base);
            //Guid? domainId = Convert<Guid?>(args.domain);

            //using (var Db = new DbConnection())
            {
                if (baseId.HasValue)
                {
                    var basa = await Db.Bases.FindAsync(baseId.Value);
                    //return DbUtils.AllowRoomTime(roomId, baseId, domainId, datefrom, dateto );
                    return Ok(basa.AllowTime(datefrom, dateto));
                }
                else if (roomId.HasValue)
                {
                    var room = await Db.Rooms
                        .LoadWith(x => x.Base)
                        .FindAsync(roomId.Value);
                    //return DbUtils.AllowRoomTime(roomId, baseId, domainId, datefrom, dateto );
                    return Ok(room.Base.AllowTime(datefrom, dateto));
                }
                else
                    return Error("Не задана база или комната");

            }
        }

        [HttpGet("allowHours")]
        public async Task<IActionResult> AllowHours(
                string hours,
                [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] [FromQuery(Name = "rooms")] Guid[] roomIds
            )
        {
            this.RequiresAuthentication();

            //var args = this.Request.Query;
            //string hours = args.hours;
            //Guid[] roomIds = Convert<Guid[]>(args.rooms);

            if (string.IsNullOrWhiteSpace(hours)) return Ok();

            var hh0 = HoursSpan.Parse(hours).FirstOrDefault(); ;
            if (hh0 == null) return Ok();

            var h1 = hh0.From;
            var h2 = hh0.To;

            //using (var Db = new DbConnection())
            {
                var rooms = await Db.Rooms
                    .GetActuals()
                    .Where(x => roomIds.Contains(x.Id))
                    .ToListAsync();

                var sb = new StringBuilder();
                foreach (var room in rooms)
                {
                    var sh = $"{room.DefaultHours},{ room.WeekendHours},{ room.TodayHours},{ room.TodayWkHours}";
                    var hh = HoursSpan.Parse(sh);
                    var has = hh.Any(h => h.From == h1 && h.To == h2);
                    if (has) continue;
                    sb.AppendLine($"Комната: {room.Name}, не входит в допустимые часы: {sh}");
                }
                return Ok(sb.ToString());
            }
        }


        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            var user = this.CurUser();
            user.Require(Sys.Operations.ListBases);

            var r = await Db.Rooms
                .LoadWith(x => x.Base)
#if !DEBUG
                .GetDomainObjects(user.DomainId)
#endif
                .FindAsync(id);

            //// если не задан календарь - создаем его автоматически
            //if(obj.CalendarId == null)
            //{
            //    var calendar = await db.CreateCalendarAsync();
            //    db.Find(obj)
            //        .Set(x => x.CalendarId, calendar.Id)
            //        .Update();
            //    obj.CalendarId = calendar.Id;
            //}

            var res = new
            {
                r.Id,
                r.BaseId,
                r.Base?.SphereId,
                r.Name,
                r.Square,
                r.Raider,
                r.ChannelIds,

                r.DefaultHours,
                r.WeekendHours,
                r.TodayHours,
                r.TodayWkHours,
                r.MinHours,
                r.HoursBefore,

                r.AllowMobile,
                r.ShareId,
                r.IsArchive,
                r.Features,
                r.Order,
                r.Color,
                r.VideoUrl,

                Favorites = await Db.Favorites
                    .GetActuals()
                    .CountAsync(f => f.RoomId == r.Id),

                Urls = await Db.Resources
                    .GetDomainObjects(this.CurUser()?.DomainId)
                    .Where(x => x.Kind == ResourceKind.RoomUrl && x.ObjectId == id)
                    .Select(x => new { x.Id, x.Name, x.Value, x.Sort, x.Description })
                    .OrderBy(x => x.Sort)
                    .ToListAsync(),

                Files = await Db.Resources
                    .GetDomainObjects(this.CurUser()?.DomainId)
                    .Where(x => x.Kind == ResourceKind.RoomPhoto && x.ObjectId == id)
                    .Select(x => new { x.Id, x.Name, x.Value, x.Sort })
                    .OrderBy(x => x.Sort)
                    .ToListAsync(),


                CountOrders = Db.Orders.Where(o => o.Date >= _Now_30).Count(o => o.RoomId == r.Id),
                CountViews = Db.Messages
                    .Where(o => o.Kind == MessageKind.ViewRoom && o.Date >= _Now_30)
                    .Count(o => o.ObjectId == r.Id),
                r.Updated,
            };
            return Json(res);
            
        }
    }


}
