using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall;
using Itall.App.Data;
using Microsoft.AspNetCore.Mvc;
using My.App.Common;
using LinqToDB.Data;

namespace My.App.Orders
{
    //[Route("bases")]
    public class BasesController : UpdateDbController<Base>
    {
        protected override object OnUpdating(Updater<Base> updater)
        {
            this.CurUser().Require(Sys.Operations.ListBases);

            base.OnUpdating(updater);

            updater.Set(x => x.Name);
            updater.Set(x => x.Address);
            //updater.Set(x => x.Type);
            updater.Set(x => x.SphereId);
            updater.Set(x => x.Description);
            updater.Set(x => x.Rules);
            updater.Set(x => x.Direction);
            updater.Set(x => x.GpsLat);
            updater.Set(x => x.GpsLong);
            updater.Set(x => x.Metro);
            updater.Set(x => x.CityId);
            //updater.Set(x => x.Raider);
            updater.Set(x => x.VideoUrl);
            //updater.Set(x => x.InfoUrl);
            updater.Set(x => x.Phones);
            updater.Set(x => x.Email);
            updater.Set(x => x.MaxPointsPcPay);
            updater.Set(x => x.WorkTime);
            updater.Set(x => x.WeekendTime);
            updater.Set(x => x.ChannelIds);
            updater.Set(x => x.IsRequest);
            updater.Set(x => x.Request);
            updater.Set(x => x.IsArchive);
            updater.Set(x => x.Logo);

            // проверка базы
            var obj = updater.Object;
            checkChannels(obj);

            WebApp.SendSocketAsync("changes", "", new
            {
                obj.Id,
                obj.Name,
                Type = "base",
                Event = updater.IsNew ? "new" : "edit",
            });

            return base.OnUpdating(updater);
        }

        /// <summary>
        /// Проверка каналов базы
        /// </summary>
        private static void checkChannels(Base obj)
        {
            var chids = obj.ChannelIds.ToGuids();
            var channels = DbCache.PayChannels.Get()
                .Where(x => chids.Contains(x.Id));
            var hasInstruction = channels.Any(x => x.Kind == Fin.PayChannelKind.Instruction);
            var hasTinkoff = channels.Any(x => x.Kind == Fin.PayChannelKind.Online);
            if (hasInstruction && hasTinkoff)
                throw new UserException("Нельзя указывать одновременно каналы оплат Тинькоф и По-Инструкции");

            if (obj.IsRequest && (hasTinkoff || hasInstruction))   // перенесено из клиента bases/edit.ts  - task 47749
                throw new UserException("Можно заполнить либо 'Предоплата', либо 'По заявке'");
        }


        protected override void OnDeleted(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnDeleted(id, db);
            WebApp.SendSocketAsync("changes", "", new
            {
                Id = id,
                Type = "base",
                Event = "delete",
            });
        }

        protected override void OnChanged(Guid id, DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Prices.Reset();
        }



        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.ListBases);

            var qbases = Db.Bases
                .LoadWith(b => b.Sphere)
                .GetDomainObjects(user?.DomainId, true);

            var query =
                from b in qbases
                select new
                {
                    b.Id,
                    b.Name,
                    b.Description,
                    b.SphereId,
                    Sphere = b.Sphere.Name,
                    b.WorkTime,
                    b.WeekendTime,
                    b.IsArchive,
                    //b.Logo,
                };

            var list = await query.ToListAsync();
            return Json(list);
        }


        [HttpGet("list-city")]
        public async Task<IActionResult> GetList4CityAsync(
            Guid? city, 
            Guid? @base, 
            Guid? domain, 
            bool block = false, 
            bool archive = false, 
            bool allarchive = true,
            bool nomobile = true)
        {
            //this.RequiresAuthentication();

            var user = this.CurUser();

            var qbases = Db.Bases
                .LoadWith(b => b.Domain) // 4test
                .LoadWith(b => b.Sphere)
                //.GetActuals()
                .FilterAllowBases(user, b => b.Id)
                .WhereIf(domain!=null, b => b.DomainId == domain)
                .WhereIf(!archive, b => b.IsArchive == false)
                .WhereIf(!allarchive, b => b.Rooms.Any(r => !r.IsArchive))
                .WhereIf(!nomobile, b => b.Rooms.Any(r => r.AllowMobile))  // решили разрешить все  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/40547/
                .WhereIf(!block, b => b.Domain.Status != Partners.DomainStatus.Locked)
                .WhereIf(city!=null,  b => b.CityId == city)
                .WhereIf(@base != null, b => b.Id == @base)
                .GetDomainObjects(user?.DomainId, true);


            var bases = await qbases.ToListAsync();
            var allprices = DbCache.Prices.Get();
            //var psvc = new CRM.PointsService {Db = Db, };

            var reviews = await Db.Reviews
                .GetPublicReviews()
                .GroupBy(r => r.Room.BaseId)
                .Where(r => r.Count()>4)    // требование после 5
                .Select(r => new
                {
                    BaseId = r.Key,
                    Count = r.Count(),
                    Value = r.Average(x => x.Value)
                })
                .ToDictionaryAsync(r => r.BaseId);


            var query =
                from b in bases

                // цены по комнатам
                let prices = allprices
                    .Where(p => p.TimeFrom < p.TimeTo)
                    .Where(p => p.BaseId == b.Id || p.BaseId == null && p.DomainId == b.DomainId)  // использованы null согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/33371/
                    .Select(p => new
                    {
                        //p,
                        min = p.Min(), // / (p.TimeTo - p.TimeFrom),
                        max = p.Max(), // / (p.TimeTo - p.TimeFrom),
                    })

                // список каналов https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/36323/
                let channels = DbCache.GetChannels(b.ChannelIds)
                    .Select(ch => new
                    {
                        ch.Id,
                        ch.Kind,
                        ch.Name,
                        ch.Forfeit1,
                        ch.Forfeit2,
                        ch.Total1,
                        ch.Total2,
                        ch.PartPc,
                    })
                
                select new
                {
                    b.Id,
                    Review = reviews.GetValueOrDefault(b.Id),

                    b.Name,
                    b.Description,
                    b.Rules,
                    //x.Type,
                    //Review = reviews.GetValueOrDefault(b.Id),

                    b.SphereId,
                    Sphere = b.Sphere?.Name,
                    b.Email,
                    b.Phones,
                    b.WorkTime,
                    b.WeekendTime,
                    b.IsArchive,
                    b.CityId,
                    b.DomainId,
                    b.GpsLat,
                    b.GpsLong,
                    b.IsRequest,
                    b.Address,
                    b.Metro,
                    b.MaxPointsPcPay,
                    b.Direction,
                    b.Logo,
                    BookingPointsPc = Fin.TransService.GetDomainPointPc(b.DomainId, null, b.Id, null),
                    minprice = prices.Where(p=>p.min>0).Min(p => p.min) ?? 0,
                    maxprice = prices.Where(p=>p.max>0).Max(p => p.max) ?? 0,
                    //prices = prices.ToList(),
                    b.Domain.Terminal,
                    Channels = channels,
                };

            var list = query.ToList();
            return Json(list);
        }

        [HttpGet("full")]
        public async Task<IActionResult> GetFullAsync(
            //[FromQuery(Name = "type")] BaseType? baseType,
            [FromQuery(Name = "sphere")] Guid? sphereId,
            [FromQuery(Name = "domain")] Guid? domainId, // = Convert<Guid?>(args.);
            [FromQuery(Name = "base")] Guid? baseId, // = Convert<Guid?>(args.@base);
            [FromQuery(Name = "room")] Guid? roomId, // = Convert<Guid?>(args.room);
            [FromQuery(Name = "from")] DateTime dateFrom,
            int hours, // = Convert<int>(args.hours);
            //GroupKind group,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] options,
            Guid? city
            )
        {

            var dateTo = dateFrom.AddHours(hours);

            var resources = await Db.Resources
                .GetDomainObjects(domainId, true)
                .Where(x => x.Kind == ResourceKind.RoomPhoto)
                .Select(x => new
                {
                    x.Kind,
                    RoomId = x.ObjectId,
                    x.Name,
                    x.Value,
                })
                .ToListAsync();

            var qrooms = Db.Rooms
                .GetDomainObjects(domainId, true)
                .GetDomainActuals()
                .GetActuals()
                .Where(x => x.AllowMobile);

            if (roomId != null)
                qrooms = qrooms.Where(x => x.Id == roomId);

            var features = DbCache.Groups.Get().Values
                .Where(x => x.Type == CRM.GroupType.RoomFeature)
                .ToDictionary(x => x.Id);

            var rooms = await qrooms
                .Select(x => new
                {
                    //Object = x,
                    x.Id,
                    x.Name,
                    x.BaseId,
                    x.Square,
                    BaseName = x.Base.Name,
                    x.Base,
                    //x.Description,
                    //x.IsPromo,
                    x.Raider,
                    x.DomainId,
                    x.VideoUrl,
                    Features = x.Features.ToGuids()
                        .Select(fid => features.GetValueOrDefault2(fid, CRM.GroupsController.Default))
                        .Select(f => new { Id = f.Id, f.Name, f.Description })
                        .ToList(),
                    //Price = calcPrice(x.Id, dateFrom, dateTo),
                    //Images = resources.Where(y => y.RoomId == x.Id).ToList(),
                }).ToListAsync();

            if (roomId != null && baseId == null && rooms.Count > 0) // если задана комната, то выставляем базу
            {
                baseId = rooms[0].BaseId;
            }

            if (dateFrom != DateTime.MinValue && hours > 0)
            {
                //var test_rooms = await db.Orders
                //    .LoadWith(x=>x.Room.Base)
                //    .GetActuals()
                //    .GetCalendarOrders(dateFrom, dateTo, null)
                //    .ToListAsync();

                // check rooms, contains orders
                var roomIds = await Db.Orders
                    .GetActuals()
                    .GetBetweenOrders(dateFrom, dateTo, null)
                    .Select(x => x.RoomId)
                    .Distinct()
                    .ToListAsync();

                rooms = rooms
                    .Where(x => !roomIds.Contains(x.Id))
                    //.Where(x => DbUtils.AllowRoomTime(x.Id, x.BaseId, x.DomainId, dateFrom, dateTo))
                    .Where(x => x.Base.AllowTime(dateFrom, dateTo))
                    .ToList();
            }

            var equipments = DbCache.Equipments.Get().Values.AsQueryable()
                .GetDomainObjects(domainId, true)
                .Where(x => x.AllowMobile)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.BaseId,
                    x.Count,
                    Group = x.GroupId != null ? x.Group.Name : "*",
                }).ToList();

            var bases = Db.Bases
                .GetDomainObjects(domainId, true);

            if (city != null)
                bases = bases.Where(x => x.CityId == city);

            //if (baseType.HasValue)
            //    bases = bases.Where(x => x.Type == baseType);

            if (sphereId.HasValue)
                bases = bases.Where(x => x.SphereId == sphereId);

            if (baseId.HasValue)
                bases = bases.Where(x => x.Id == baseId);

            //Client client = null;
            //var clientId = this.CurUser()?.ClientId;
            //if (clientId != null && clientId.HasValue)
            //{
            //    client = await db.Clients.FindAsync(clientId.Value);
            //}

            var q_vrooms =
                from room in rooms
                let args1 = new CalcArgs
                {
                    CheckErrors = true,
                    RoomId = room.Id,
                    DFrom = dateFrom,
                    DTo = dateTo,
                    //Group = @group,
                    Options = options,
                    ClientId = this.CurUser()?.ClientId,

                    //info.OrderForfeit = 0;
                    //RoomPrice = 0,
                    PayForfeit = false,
                    //info.PromocodeId = Convert<Guid?>(vars.promocodeId);
                    //info.DomainId = this.CurUser()?.DomainId;
                }

                let price = Calcs.CalcHelper.CalculateAsync(args1).Result

                select new
                {
                    room.Id,
                    room.Name,
                    room.BaseId,
                    room.Square,
                    room.BaseName,
                    //room.Description,
                    //room.IsPromo,
                    room.Raider,
                    //Price = calcOrderPrice(room.Id, dateFrom, dateTo, this.CurUser()?.ClientId, db),
                    Price = new
                    {
                        price.RoomPrice,
                        TotalPrice = price.TotalPrice,
                        price.Text,
                        price.Errors,
                    },
                    Images = resources.Where(img => img.RoomId == room.Id).ToList(),
                };

            var vrooms = q_vrooms.ToList();

            var qbases =
                from x in bases.GetActuals()
                let base_rooms = vrooms.Where(y => y.BaseId == x.Id).ToList()
                //where base_rooms.Count > 0  // убираем пустые базы таск 16014
                orderby x.SphereId, x.Name  //  x.Type, 
                select new
                {
                    x.Id,
                    x.Name,
                    x.Address,
                    x.GpsLat,
                    x.GpsLong,
                    x.Description,
                    x.Rules,
                    x.VideoUrl,
                    //x.InfoUrl,

                    //Resources = resources.Where(y => y.ObjectId == x.Id).ToList(),
                    //Rooms = rooms.Where(y => y.BaseId == x.Id).ToList(),
                    Rooms = base_rooms,
                    //Prices = prices.Where(y => y.BaseId == x.Id).ToList(),
                    Equipments = equipments.Where(y => y.BaseId == x.Id).ToList(),
                    //x.Raider,
                    x.Direction,
                    x.Metro,
                    City = x.CityId == null ? null : new
                    {
                        Id = x.CityId,
                        x.City.Name,
                        x.City.GpsLat,
                        x.City.GpsLong,
                    },
                    //x.Type,
                    x.SphereId,
                    x.Phones,
                    x.Email,
                    x.WorkTime,
                    x.WeekendTime,
                };

            var list = (await qbases.ToListAsync()).Where(x => x.Rooms.Count > 0);
            return Json(list);
        }


        [HttpGet("search")]
        public async Task<object> SearchAsync(
            //[FromQuery(Name = "type")] BaseType? baseType, // = Convert<BaseType?>(args.type);
            [FromQuery(Name = "sphere")] Guid? sphereId,
            [FromQuery(Name = "domain")] Guid? domainId, // = Convert<Guid?>(args.domain);
            [FromQuery(Name = "bases")] string sbaseIds, // = Convert<string>(args.bases);
            [FromQuery(Name = "city")] Guid? cityId // = Convert<Guid?>(args.city);           
            )
        {
            var basesIds = sbaseIds.ToGuids();

            var bases = Db.Bases.GetDomainObjects(domainId, true);

            //if (baseType.HasValue)
            //    bases = bases.Where(x => x.Type == baseType);

            if (sphereId != null)
                bases = bases.Where(x => x.SphereId == sphereId);

            if (basesIds.Length > 0)
                bases = bases.Where(x => basesIds.Contains(x.Id));

            if (cityId != null)
                bases = bases.Where(x => x.CityId == cityId);

            var equipments = DbCache.Equipments.Get().Values.AsQueryable()
                .GetDomainObjects(domainId, true)
                .Where(x => x.AllowMobile)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.BaseId,
                    x.Count,
                    Group = x.GroupId != null ? x.Group.Name : "",
                }).ToList();

            var channels = DbCache.PayChannels.Get();
            //var dchannels = channels.ToDictionary(x => x.Id);

            var qbases =
                from b in bases.GetActuals()
                orderby b.SphereId, b.Name  //x.Type,
                let tt = b.WeekendTime
                let channel = DbUtils.GetChannel(channels, b)
                let chids = b.ChannelIds.ToGuids()
                select new
                {
                    b.Id,
                    b.Name,
                    b.DomainId,
                    b.Address,
                    b.GpsLat,
                    b.GpsLong,
                    b.Description,
                    b.Rules,
                    b.VideoUrl,
                    //x.InfoUrl,
                    //x.Raider,
                    b.Direction,
                    b.Metro,

                    Channel = channel,
                    Channels = channels
                        .Where(ch => chids.Contains(ch.Id))
                        .ToList(),

                    b.Domain.Terminal,
                    City = b.CityId == null ? null : new
                    {
                        Id = b.CityId,
                        b.City.Name,
                        b.City.GpsLat,
                        b.City.GpsLong,
                    },
                    //x.Type,
                    b.SphereId,
                    Sphere = b.Sphere.Name,
                    b.Phones,
                    b.Email,

                    b.WorkTime,
                    b.WorkHours,
                    b.WeekendTime,
                    b.WeekendHours,

                    b.IsRequest,
                    b.Request,
                    b.Logo,

                    Equipments = equipments.Where(y => y.BaseId == b.Id).ToList(),

                    b.MaxPointsPcPay,
                    BookingPointsPc = Fin.TransService.GetDomainPointPc(b.DomainId, null, b.Id, null),
                };

            var list = await qbases.ToListAsync();

            return Json(list);
            //return list;
        }

        [HttpGet("search2")]
        public async Task<object> Search2Async(
            // [FromQuery(Name = "type")] BaseType? baseType, // = Convert<BaseType?>(args.type);
            [FromQuery(Name = "sphere")] Guid? sphereId,
            //[FromQuery(Name = "domain")] Guid? domainId, // = Convert<Guid?>(args.domain);
            [FromQuery(Name = "bases")] string sbaseIds, // = Convert<string>(args.bases);
            [FromQuery(Name = "city")] Guid? cityId // = Convert<Guid?>(args.city);           
            )
        {
            var basesIds = sbaseIds.ToGuids();

            var bases = Db.Bases
                    //.GetDomainObjects(domainId, true)
                    .WhereIf(sphereId != null, x => x.SphereId == sphereId)
                    .WhereIf(basesIds.Length > 0, x => basesIds.Contains(x.Id))
                    .WhereIf(cityId != null, x => x.CityId == cityId);

            var equipments = DbCache.Equipments.Get().Values.AsQueryable()
                .GetActuals()
                //.GetDomainObjects(domainId, true)
                .Where(x => x.AllowMobile)
                .Where(eq => eq.BaseId != null)
                .GroupBy(eq => eq.BaseId)
                .ToDictionary(x => x.Key, x => 1);

            var channels = DbCache.PayChannels.Get();
            //var dchannels = channels.ToDictionary(x => x.Id);

            var qbases =  // оптимизируем запрос согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/42165/
                from b in bases.GetActuals()
                orderby b.SphereId, b.Name  //x.Type,
                let tt = b.WeekendTime
                //let channel = GetChannel(dchannels, b) -- улетел в DbUtils
                //let chids = b.ChannelIds.ToGuids()
                select new
                {
                    b.Id,
                    b.Name,
                    //b.DomainId,
                    b.Address,
                    b.GpsLat,
                    b.GpsLong,
                    b.Description,
                    b.Rules,
                    b.Metro,
                    b.Email,
                    b.Phones,

                    //Channel = channel,
                    Channels = channels
                        .Where(ch => b.ChannelIds.ToGuids().Contains(ch.Id))
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

                    b.Domain.Terminal,
                    b.CityId,
                    b.SphereId,
                    b.IsRequest,

                    //Equipments = equipments.Where(y => y.BaseId == b.Id).ToList(),
                    Equipments = equipments.ContainsKey(b.Id),

                    b.MaxPointsPcPay,
                    BookingPointsPc = Fin.TransService.GetDomainPointPc(b.DomainId, null, b.Id, null),
                };

            //LinqToDB.Common.Configuration.Linq.GenerateExpressionTest = true;
            var list = await qbases.ToListAsync();

            return Json(list);
            //return list;
        }



        [HttpGet("names")]
        public async Task<IActionResult> GetNamesAsync(bool? check)
        {
            this.RequiresAuthentication();

            //var args = this.Request.Query;
            //bool? check = args.check;
            var user = this.CurUser();

            var basesQuery = Db.Bases
                //.LoadWith(x => x.Sphere)
                .GetActuals()
                //.OrderBy(b => b.Sphere.Name)
                .GetDomainObjects(this.CurUser()?.DomainId);

            if (check.HasValue && check.Value && !user.Allow(Sys.Operations.AllBases))
            {
                basesQuery = basesQuery.Where(x => this.CurUser().BaseGuids().Contains(x.Id));
            }

            var query = basesQuery.Select(x => new  // .OrderBy(x=>x.Name)
            {
                Id = x.Id,
                value = x.Name,
                //type = x.Type,
                sphereId = x.SphereId,
                Sphere = x.Sphere.Name,
                x.DomainId,
                x.WeekendHours,
                x.WorkHours,
            });
            var list = await query.ToListAsync();
            return Json(list);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            // отключена авторизация   https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/34639/
            //this.RequiresAuthentication();
            //this.CurUser().Require(Sys.Operations.ListBases);
            var user = this.CurUser();

            var b = await Db.Bases
                .GetDomainObjects(user?.DomainId)
                .FindAsync(id);

            var res = new
            {
                b.Id,
                b.Description,
                b.Rules,
                b.Name,
                b.Address,
                //obj.AdminId,
                b.Direction,
                b.GpsLat,
                b.GpsLong,
                b.Metro,
                b.CityId,
                City = b.City?.Name,
                //obj.Type,
                b.SphereId,
                b.VideoUrl,
                b.Phones,
                b.Email,
                b.WorkTime,
                b.WeekendTime,

                b.MaxPointsPcPay,
                b.ChannelIds,
                b.IsRequest,
                b.Request,
                b.IsArchive,
                Logo = b.Logo?.Replace(@"\", "/") ?? "404.png",
            };
            return Json(res);
        }
    }
}


#region ---- Misc ---


//var roomIds = query0.Select(x => x.FirstRoom).Select(x => new { x.Id, x.BaseId }).ToList();
//var rooms = await (
//        from x in basesQuery
//        var room = x.Rooms.FirstOrDefault()
//        select room
//    ).ToListAsync();

//var roomIds = rooms.Where(x=>x!=null).Select(x => x.Id).ToList();

//var prices = PricesModule.Prices.Get().AsQueryable()
//    .GetDomainObjects(this.CurUser()?.DomainId)
//    //.Where(x => x.RoomId != null)
//    //.Where(x => roomIds.Contains(x.RoomId.Value))
//    .OrderBy(y => y.TimeFrom)
//    .ToList();

//prices = prices
//    .Where(y => y.BaseId==x.Id || y.RoomId == null && y.BaseId == null)
//    .Select(y => new { y.TimeFrom, y.TimeTo, y.WeekendPrice, y.WorkingPrice, y.WorkingLPrice, y.WorkingFPrice,})
//    .ToList(),

//OrderCalcResult calcOrderPrice(Guid roomId, DateTime dateFrom, DateTime dateTo, Guid? clientId, AppDb db)
//{
//    //var vars = this.Request.Form;

//    var args = new OrderCalcArgs();
//    args.CheckErrors = true;
//    args.RoomId = roomId;
//    args.DFrom = dateFrom;
//    args.DTo = dateTo;
//    args.Group = Models.GroupKind.Group;
//    args.ClientId = clientId;

//    //info.OrderForfeit = 0;
//    args.RoomPrice = 0;
//    args.PayForfeit = false;
//    //info.PromocodeId = Convert<Guid?>(vars.promocodeId);
//    //info.DomainId = this.CurUser()?.DomainId;

//    var res = OrderCalc.Calculate(args);
//    return res;
//}

#endregion
