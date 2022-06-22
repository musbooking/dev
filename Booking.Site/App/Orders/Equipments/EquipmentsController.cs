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
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;

namespace My.App.Orders
{
    //[Route("equipments")]
    public class EquipmentsController : UpdateDbController<Equipment>
    {

        protected override object OnUpdating(Updater<Equipment> updater)
        {
            this.CurUser().Require(Sys.Operations.Equipments);

            base.OnUpdating(updater);

            updater.Set(x => x.BaseId);
            updater.Set(x => x.Count);
            updater.Set(x => x.Description);
            updater.Set(x => x.GroupId);
            updater.Set(x => x.Name);
            updater.Set(x => x.Price);
            updater.Set(x => x.AllowMobile);
            updater.Set(x => x.PhotoUrl);
            updater.Set(x => x.IsArchive);
            //updater.Set(x => x.IsSkipTime);
            updater.Set(x => x.Kf);
            updater.Set(x => x.DestKind);
            updater.Set(x => x.Kind);
            updater.Set(x => x.RoomIds);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Equipments.Reset();
        }

        public static Equipment DefaultEquipment = new Equipment { Name = "", Group = new CRM.Group { Name = "", } };





        [HttpGet("list")]
        public IActionResult GetList()
        {
            //this.RequiresAuthentication();
            //this.CurUser().Require(Sys.Operations.Equipments);

            var user = this.CurUser();
            //var eqlist = EquipmentsController.List.Get().Values.AsQueryable();

            var query = Db.Equipments
                .GetDomainObjects(user.DomainId)
                .FilterAllowBases(user, eq => eq.BaseId)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.Price,
                    x.GroupId,
                    x.BaseId,
                    x.Count,
                    x.AllowMobile,
                    // x.IsSkipTime,
                    //RoomIds = x.RoomIds.ToGuids(),  // 50685
                    x.RoomIds,  // 50685
                    x.Kind,
                    x.DestKind,
                    x.Kf,
                    x.IsArchive,
                    PhotoUrl = x.PhotoUrl ?? "*",
                });

            var res = query.ToList();

            return Json(res);
        }

        /// <summary>
        /// Параметры поиска
        /// </summary>
        public class SearchArgs
        {
            public Guid? Sphere { get; set; }
            public Guid? Domain { get; set; }
            public Guid? Base { get; set; }
            public Guid? Room { get; set; }
            public EqKind? Kind { get; set; }
        }

        /// <summary>
        /// Поиск позиций
        /// </summary>
        /// <returns></returns>
        [HttpGet("search")]
        public IActionResult SearchAsync( SearchArgs args )
        {
            //this.RequiresAuthentication();
            //var user = this.CurUser();
            //user.Require(Sys.Operations.Equipments);

            var query = Db.Equipments
                .WhereIf(args.Sphere, eq => eq.Base.SphereId == args.Sphere)
                .WhereIf(args.Domain, eq => eq.DomainId == args.Domain)
                .WhereIf(args.Base, eq => eq.BaseId == args.Base)
                .WhereIf(args.Room, eq => eq.RoomIds != null && eq.RoomIds.Contains(args.Room.ToString()))
                .WhereIf(args.Kind, eq => eq.Kind == args.Kind)
                .GetActuals()   // 58619 - только мобильные и неархивные
                .Where(eq => eq.AllowMobile)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.Price,
                    x.GroupId,
                    x.BaseId,
                    x.Count,
                    x.AllowMobile,
                    x.DomainId, 
                    //RoomIds = x.RoomIds.ToGuids(),  // 50685
                    x.RoomIds,  // 50685
                    x.Kind,
                    x.DestKind,
                    x.Kf,
                    x.IsArchive,
                    PhotoUrl = x.PhotoUrl ?? "*",
                });

            var res = query.ToList();

            return Json(res);
        }

        [HttpGet("names")]
        public IActionResult GetNames([FromQuery(Name = "base")] Guid? baseId)
        {
            this.RequiresAuthentication();

            var query0 = Db.Equipments
                .GetActuals()
                .GetDomainObjects(this.CurUser()?.DomainId);

            //Guid? baseId = Request.Query.@base;
            if (baseId.HasValue)
                query0 = query0.Where(x => x.BaseId == baseId.Value);

            var query = query0
                .OrderBy(eq => eq.Name)
                .Select(x => new
                {
                    x.Id,
                    //value = x.Name + ": " + (x.GroupId == null ? "" : x.Group.Name) + " (" + x.Price + " руб)",
                    value = $"{x.Name}: {(x.GroupId == null ? "" : x.Group.Name)}/{(x.BaseId == null ? "" : x.Base.Name)} ({x.Price} руб)",
                    //value = x.Name,
                });
            var res = query.ToList();
            return Json(res);
        }


        /// <summary>
        /// ARCHIVE!!: Метод для получения оценок доп.оборудования с учетом скидок
        /// </summary>
        [HttpGet("prices")]
        public async Task<IActionResult> GetPricesAsync([FromQuery(Name = "base")] Guid? baseId)
        {
            this.RequiresAuthentication();

            var query0 = DbCache.Equipments.Get().Values.AsQueryable()
                .GetDomainObjects(this.CurUser()?.DomainId);

            query0 = query0.Where(x => x.BaseId == baseId.Value);

            var domainId = await Db.Bases
                .Where(x => x.Id == baseId)
                .Select(x => x.DomainId)
                .FirstOrDefaultAsync();

            var part = Db.GetOrCreateClientPart(this.CurUser()?.ClientId, domainId, 32);
            var discount = part.Discount; //TODO:  client?.Discount ?? 0;

            var query = query0.Select(x => new
            {
                x.Id,
                x.Name,
                Group = x.GroupId != null ? x.Group.Name : "*",
                x.Price,
                ClientPrice = x.Price * (100 - discount) / 100,
            });
            var list = query.ToList();
            return Json(list);
        }


        [HttpGet("types")]
        public IActionResult GetTypes()
        {
            this.RequiresAuthentication();

            var query = DbCache.Equipments.Get().Values.AsQueryable()
                .GetActuals()
                .GetDomainObjects(this.CurUser()?.DomainId)
                .Select(x => new
                {
                    x.Id,
                    value = x.GroupId != null ? x.Group.Name : "*",
                });
            return Json(query.ToList());
        }


        [HttpGet("totals")]
        public async Task<IActionResult> GetTotalsAsync([FromQuery(Name = "base")] Guid baseId, DateTime? now)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.EqRest);

            now ??= DateTime.Now;

            var qorders = Db.Orders
                .GetDomainObjects(this.CurUser()?.DomainId)
                .GetActuals()
                // .FilterAllowBases(user, o => o.Room.BaseId)  -- заблокировал 2021-02-20, т.к. есть подозрение, что будут теряться остатки
                .Where(x => x.Room.BaseId == baseId)
                .Where(x => x.DateFrom <= now && x.DateTo >= now)
                //.Where(x => x.Status == OrderStatus.Closed);
                .Where(x => x.PayDate != null);

            //var eqStrings = await qorders.Select(x => x.Equipments).ToListAsync();
            //var eqIdents = eqStrings.SelectMany(x => x.ToGuids());

            var allItems = (
                await qorders
                .Where(or => or.ItemsJson != null)
                .Select(or => or.ItemsJson)
                .ToListAsync()
                )
                .SelectMany(itemsStr => JsonUtils.JsonToObject<OrderItem[]>(itemsStr))
                .ToList();
            //var items = itemsStrings.SelectMany(x => x.ToGuids());

            var qequipments = DbCache.Equipments.Get().Values
                .Where(eq => eq.DomainId == user.DomainId)
                .Where(x => x.BaseId == baseId)
                .Select(x => new { x.Id, x.Name, x.Price, x.Description, x.GroupId, x.Count });

            var qtotals =
                from x in qequipments
                let used = allItems
                    .Where(item => item.eq == x.Id)
                    .Sum(it => it.n)
                let balance = x.Count - used
                select new { x.Id, x.Name, x.Price, x.Description, x.GroupId, x.Count, Used = used, Balance = balance };

            var totals = qtotals.ToList();

            return Json(totals);

        }

        static readonly OrderStatus[] BALANCE_STATUSES = { OrderStatus.Reserv, OrderStatus.Closed };

        [HttpGet("balance")]
        public async Task<IActionResult> GetBalanceAsync(
            [FromQuery(Name = "base")] Guid? baseId,
            Guid? room,  // 50685
            [FromQuery(Name = "order")] Guid? orderId,
            DateTime dfrom,
            DateTime dto,
            bool all,
            bool empty,
            Guid? id  // for test
            )
        {

            // получаем список всех заказов по этой базе в данном временном интервале
            var orders = await Db.Orders
                //.GetDomainObjects(this.CurUser()?.DomainId)
                //.GetActuals()  //не имеет смысла, тк статус меняется синхронно
                .WhereIf(baseId != null, o => o.Room.BaseId == baseId)
                // .WhereIf(room != null, o => o.RoomId == room || o.RoomId == null) #70329
                .Where(o => o.DateFrom < dto)
                .Where(o => o.DateTo > dfrom)
                .Where(o => BALANCE_STATUSES.Contains(o.Status))
                .WhereIf(orderId != null, y => y.Id != orderId)
                .Select(o => new { o.ItemsJson })
                .ToListAsync();

            // получаем список оборудования
            //var orderEquipments = orders
            //    .SelectMany(x => x.Equipments.ToGuids()  // умножаем на id[] оборудования по каждому заказу
            //    .Select(id => new { room = x.RoomId, id }))      // оставляем только комнату и id оборудования
            //    .Distinct()                             // оставляем уникальные значения
            //    .GroupBy(x => x.id, (x, res) => new { id = x, count = res.Count() })
            //    .ToDictionary(x => x.id, x => x.count);

            // получаем список оборудования через Items
            var orderEquipments = orders
                .SelectMany(x => OrderHelper.GetItems(x.ItemsJson, true))
                .GroupBy(x => x.eq, (x, res) => new { id = x, count = res.Sum(x => x.n) })
                .ToDictionary(x => x.id, x => x.count);

            var all_equipments = DbCache.Equipments.Get().Values;
            var qeq1 =
                from x in all_equipments
                    .WhereIf(id != null, x => x.Id == id)   // where x.BaseId == baseId
                    .WhereIf(baseId != null, x => x.BaseId == baseId)   // where x.BaseId == baseId
                    .WhereIf(room != null, x => x.RoomIds == null || x.RoomIds.Contains(room.ToString()))  // 50685
                    .WhereIf(!all, x => x.AllowMobile == true)
                    //.GetDomainObjects(this.CurUser()?.DomainId)
                orderby x.Group?.Index
                //select x;

            //var qeq1 =
                //from x in qeq0
                select new
                {
                    x.Id,
                    x.GroupId,
                    GroupName = x.GroupId == null ? "" : x.Group.Name,
                    x.Name,
                    x.Price,
                    x.Count,
                    x.Kind,
                    x.Kf,
                    x.DestKind,
                    x.PhotoUrl,
                    x.Description,
                };

            var qeq2 =
                from x in qeq1
                    // from x in db.Equipments  - рубится на GetValueOrDefault
                let used = orderEquipments.GetValueOrDefault2(x.Id, 0)
                select new
                {
                    x.Id,
                    x.GroupId,
                    x.GroupName,
                    PhotoUrl = x.PhotoUrl?.Replace(@"\", "/"),
                    x.Name,
                    x.DestKind,
                    x.Price,
                    x.Kind,
                    x.Kf,
                    x.Count,
                    Used = used,
                    Balance = x.Count - used,
                    value = $"{x.Name}, ост: {x.Count - used}={x.Count}-{used}  ({x.Price} руб)",
                    x.Description,
                };

            if (!empty)
                qeq2 = qeq2.Where(x => x.Balance > 0);  // 16-02-2018? Кузнецов в чате попросил убрать, Василий - оставить, сделал параметром

            var list = qeq2.ToList();  // 
            return Json(list);
        }



        [HttpPost("upload")]
        [Obsolete]
        public IActionResult Upload()
        {
            var file = this.Request.Form.Files.FirstOrDefault();

            var name = Guid.NewGuid().ToString();
            var filename = name + ".jpg"; //Path.GetExtension(file.Name);
            var filepath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot/res/equipments/" + filename);
            Itall.IO.Path2.EnsureExist(filepath);

            //var size = Utils.ImageHelper.GetConfigWidthHeight();
            using var stream = Itall.Drawing.GraphicUtils.ResizeImage(file);
            using var image = Image.FromStream(stream);
            image.Save(filepath, ImageFormat.Jpeg);

            object PhotoUrl = "equipments/" + filename;
            return Json(PhotoUrl);
        }
    }
}
