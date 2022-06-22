using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
////////using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall;
using Itall.App.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Orders
{
    public enum PayStatus
    {
        None = 1,
        Partial = 2,
        Full= 3,
    }


    //[Route("abonements")]
    public class AbonementsController : UpdateDbController<Abonement>
    {
        protected override object OnUpdating(Updater<Abonement> updater)
        {
            base.OnUpdating(updater);

            updater.Set(x => x.BaseId);
            updater.Set(x => x.RoomId);
            updater.Set(x => x.PromoId);
            updater.Set(x => x.ClientId);
            updater.Set(x => x.DateFrom);
            updater.Set(x => x.DateTo);
            updater.Set(x => x.Description);
            updater.Set(x => x.ClientDiscount);
            updater.Set(x => x.Discount);
            //updater.Set(x => x.TotalPrice, d.TotalPrice as Nancy.DynamicDictionaryValue);
            updater.Set(x => x.Equipments);
            //updater.Set(x => x.Group);
            updater.Set(x => x.Options);
            updater.Set(x => x.IsArchive);

            //var obj = updater.Object;
            //return new { obj.Id, Client="(...)", obj.DateBegin, obj.DateEnd,  };
            return base.OnUpdating(updater);
        }

        readonly OrderStatus[] PAY_STATUSES = new [] {OrderStatus.Cancel, OrderStatus.Closed };


        /// <summary>
        /// API Search - 53875
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync(
                Guid? sphere,
                DateTime? dfrom,
                DateTime? dto
            )
        {
            var res = await GetListAsync( sphere, dfrom, dto, null, false );
            return res;
        }


        /// <summary>
        /// Список абонементов для старого ЛК
        /// </summary>
        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(
                //Modules.BaseType? type,
                Guid? sphere,
                DateTime? dateFrom,
                DateTime? dateTo,
                PayStatus? pays, 
                bool full = true
            )
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var allow_all_bases = user.Allow(Sys.Operations.AllBases);

            var query = Db.Abonements
                .LoadWith(ab => ab.Client)
                .GetDomainObjects(user.DomainId)
                .GetActuals()
                .OrderBy(ab => ab.DateFrom)
                .WhereIf( sphere!=null, ab => ab.Base.SphereId == sphere.Value)
                .WhereIf( !allow_all_bases, ab => user.BaseGuids().Contains(ab.BaseId.Value));


            // фильтруем по датам
            //if (dateFrom.HasValue || dateTo.HasValue)
            {
                var d0 = DateTime.Now;
                var dmin = dateFrom?.ToMidnight() ?? d0.AddYears(-1);
                var dmax = dateTo?.ToMidnight(1) ?? d0.AddYears(1);

                query = query
                    .Where(x => x.DateFrom >= dmin && x.DateFrom < dmax)
                    .Where(x => x.DateTo >= dmin && x.DateTo < dmax);
            }

            if (pays.HasValue)
            {
                //query = from x in query
                //        var sumAll = x.Orders.Sum(o=>o.TotalPrice)
                //        var sumPay = x.Orders.Where(o => o.Status == OrderStatus.Paid).Sum(o=>o.TotalPrice)
                //        where 
                switch (pays.Value)
                {
                    case PayStatus.None:
                        query = query.Where(x => x.Orders.All(
                            o => o.IsArchive==false && !PAY_STATUSES.Contains(o.Status)) );
                        break;

                    case PayStatus.Partial:
                        query = query.Where(x => x.Orders.Any(
                            o => o.IsArchive == false && PAY_STATUSES.Contains(o.Status) ) && 
                            x.Orders.Any(o => o.IsArchive == false && !PAY_STATUSES.Contains(o.Status) ));
                        break;

                    case PayStatus.Full:
                        query = query.Where(x => !x.Orders.Any(
                            o => o.IsArchive == false && !PAY_STATUSES.Contains(o.Status)) );
                        break;

                    default:
                        break;
                }
            }

            var query1 = 
                from ab in query
                let orders0 = ab.Orders.Where(o => o.IsArchive == false)
                let orders = orders0.Where(o => (o.Status==OrderStatus.Reserv || o.Status==OrderStatus.Closed) )
                let TotalSum = orders0.Sum(y => y.TotalOrder)
                let Payments = orders.Where(o => PAY_STATUSES.Contains(o.Status) ).Sum(x=>x.TotalPays)
                let Reserv = orders.Where(o => o.Status == OrderStatus.Reserv ).Sum(x => x.TotalOrder)
                select new
                {
                    ab.Id,
                    ab.Description,
                    ab.BaseId,
                    ab.RoomId,
                    ab.ClientId,
                    Client = ab.ClientId!=null ?ab.Client.ToString(full) : "",
                    //ClientBitrixNum = x.ClientId != null ? x.Client.BitrixNum : "",
                    ab.DateFrom,
                    ab.DateTo,
                    //x.TotalPrice,
                    //OrderCount = orders.Count(),
                    //x.Group,
                    ab.ClientDiscount,
                    ab.Discount,

                    TotalSum,
                    Reserv,
                    Payments,
                };
            var list = await query1.ToListAsync();

            return Json(list);
        }



        [HttpPost("archive")]
        public IActionResult Archive(Guid id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            Db.BeginTransaction1();

            var no = Db.Orders
                .GetDomainObjects(user.DomainId)
                .Where(x => x.AbonementId == id)
                .Set(x => x.IsArchive, true)
                .Set(x => x.DeleledById, user.Id)
                .Update();

            var na = Db.Abonements
                .GetDomainObjects(user.DomainId)
                .Where(x => x.Id == id)
                .Set(x => x.IsArchive, true)
                .Set(x => x.DeleledById, user.Id)
                .Update();

            Db.CommitTransaction1();

            return Json(new { Orders = no, Abonements = na });
        }



        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            var user = this.CurUser();

            var ab = await Db.Abonements
                .LoadWith(a => a.Client)
                .LoadWith(a => a.Base)
                .LoadWith(a => a.Part)
                .GetDomainObjects(user?.DomainId)
                .FindAsync(id);

            //var domain = this.CurUser()?.DomainId;
            //var part = obj.Client?.GetDomainPart(db, domain);
            //var forfeit = Register.Totals(db.Registers.Where(x => x.ClientId==obj.ClientId && x.DomainId == domain), Account.Forfeit);

            //RequireIsNotNull(obj);

            var res = new
            {
                ab.Id,
                Description = "" + ab.Description,
                ab.BaseId,
                //BaseType = obj.Base?.Type,
                ab.Base?.SphereId,
                ab.RoomId,
                ab.PromoId,
                //obj.ClientId,
                //Client = "" + obj.Client?.ToString(true),
                ClientId = ab.Client?.ToIdValue(),
                //ClientBitrixNum = obj.Client?.BitrixNum,
                //obj.Client?.DomainPart?.Forfeit,
                ab.DateFrom,
                ab.DateTo,
                ab.Discount,
                ab.ClientDiscount,
                //obj.TotalPrice,
                ab.Equipments,
                Forfeit = ab.Part?.Forfeit ?? 0,
                //obj.Group,
            };
            return Json(res);
            
        } 
        
        /// <summary>
        /// Get abonement for API
        /// </summary>
        [HttpGet("get2/{id}")]
        public async Task<IActionResult> GetObject2Async(Guid id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var ab = await Db.Abonements
                .LoadWith(a => a.Client)
                .LoadWith(a => a.Base)
                .LoadWith(a => a.Room)
                .LoadWith(a => a.Part)
                .LoadWith(a => a.Promo)
                .GetDomainObjects(user?.DomainId)  
                .FindAsync(id);

            if (ab == null)
                throw new UserException($"Не найден абонемент с данным ид:{id}, или другая партнерская зона");

            var eqlist = DbCache.Equipments.Get().Values
                .OrderBy(eq => eq.GroupId);
            var eqids = ab.Equipments.ToGuids();
            var equipments = eqlist
                .Where(eq => eqids.Contains(eq.Id))
                .Select(eq => new { eq.Id, eq.Name })  // , eq.GroupId, Group = eq.GroupId != null ? eq.Group.Name : "--"
                .ToList();

            var orders = await Db.Orders
                .LoadWith(o => o.Room)
                .Where(o => o.AbonementId == id)
                .Select(o => new
                {
                    o.Id,
                    o.Date,
                    o.Status,
                    o.PayDate,

                    o.TotalOrder,
                    o.PaidForfeit,
                    o.TotalPays,
                    o.Range,

                    Room = o.Room.Name,
                    o.RoomId,
                }).ToListAsync();


            var qmessages = Db.Messages
                .LoadWith(o => o.Sender)
                .Where(o => o.AbonementId == id)                
                .Select(m => new
                {
                    m.Id,
                    m.Date,
                    Sender = m.Sender.FIO,
                    m.Kind,
                    m.Text,
                });

            var res = new
            {
                ab.Id,

                ab.ClientId,
                Client = ab.Client?.FIO,

                ab.DateFrom,
                ab.DateTo,

                ab.BaseId,
                Base = ab.Base?.Name,
                //ab.Base?.SphereId,

                ab.RoomId,
                Room = ab.Room?.Name,

                ab.Options,

                Description = "" + ab.Description,
                
                //BaseType = obj.Base?.Type,

                ab.PromoId,
                Promo = ab.Promo?.Name,


                ab.Discount,
                ab.ClientDiscount,
                
                Equipments = equipments,

                TotalReserv = orders.Where(o => o.Status == OrderStatus.Reserv).Sum(o => o.TotalOrder),
                TotalPayments = orders.Sum(o => o.TotalPays),
                Total = orders.Sum(o => o.TotalOrder),
                Forfeit = ab.Part?.Forfeit ?? 0,
                
                Orders = orders.ToList(),
                Messages = qmessages.ToList(),
            };
            return Json(res);
            
        }

        /// <summary>
        /// Get abonement for API - client version
        /// </summary>
        [HttpGet("client-get/{id}")]
        public async Task<IActionResult> GetClientObjectAsync(Guid id)
        {
            this.RequiresAuthentication();
            //var user = this.CurUser();

            var qabonements = Db.Abonements
                //.LoadWith(a => a.Client)
                //.LoadWith(a => a.Base)
                //.LoadWith(a => a.Room)
                //.LoadWith(a => a.Part)
                //.LoadWith(a => a.Promo)
                .Finds(id);

            var orders = await Db.Orders
                //.LoadWith(o => o.Room)
                .Where(o => o.AbonementId == id)
                .GetActuals()                   // 80267
                .Where(o => o.ShareId == null)  // 80267
                .Where(o => o.Status == OrderStatus.Reserv || o.Status == OrderStatus.Closed)  // 80267
                .OrderBy(o => o.DateFrom)
                .Select(o => new
                {
                    o.Id,
                    //o.Date,
                    o.DateFrom,
                    o.DateTo,
                    o.Status,
                    o.PayDate,

                    o.TotalOrder,
                    //o.PaidForfeit,
                    o.TotalPays,

                    Room = o.Room.Name,
                    //o.RoomId,
                }).ToListAsync();


            var qres =
                from ab in qabonements
                let cl = ab.Client
                select new
                {
                    ab.Id,

                    //ab.ClientId,
                    //Client = cl.FirstName + " " + cl.LastName,

                    ab.DateFrom,
                    ab.DateTo,

                    //ab.BaseId,
                    Base = ab.Base.Name,
                    //ab.Base?.SphereId,

                    //ab.RoomId,
                    //Room = ab.Room.Name,

                    //Options = ab.Options.ToGuids(),

                    //Description = "" + ab.Description,

                    //BaseType = obj.Base?.Type,

                    //ab.PromoId,
                    //Promo = ab.Promo.Name,

                    //ab.Discount,
                    //ab.ClientDiscount,

                    TotalReserv = orders.Where(o => o.Status == OrderStatus.Reserv).Sum(o => o.TotalOrder),
                    TotalPayments = orders.Sum(o => o.TotalPays),
                    Total = orders.Sum(o => o.TotalOrder),
                    Forfeit = ab.Part.Forfeit,

                    Orders = orders.ToList(),
                };

            var res = await qres.FirstOrDefaultAsync();

            return Json(res);

        }

    }
}
