using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall;
using Itall.App.Data;
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;
using My.App.Sys;
using My.App.Fin;

namespace My.App.Partners
{
    //[Route("domains")]
    public class DomainsController : ListController<Domain>
    {

        protected override object OnUpdating(Updater<Domain> updater)
        {
            var user = this.CurUser();
            user.Require(Operations.DomainsEdit);

            //updater.Set(x => x.Name);
            //updater.Set(x => x.AllowShare); -- убираем в рамках 58623
            //updater.Set(x => x.IsArchive);
            updater.Set(x => x.Email);
            updater.Set(x => x.Phone);

            updater.Set(x => x.LimitDate);
            updater.Set(x => x.TarifId);
            updater.Set(x => x.TarifIds);
            updater.Set(x => x.CityId);
            updater.Set(x => x.Period);
            updater.Set(x => x.IsPayment);
            updater.Set(x => x.Status);
            updater.Set(x => x.Terminal);
            updater.Set(x => x.Inn);

            Itall.App.UpdateHelper.Update("domain-" + updater.Object.Id);

            var res = base.OnUpdating(updater);

            var svc = new DomainService { Db = (DbConnection)updater.Db };
            svc.CheckDomain(updater.Object);

            return res;
        }

        protected override void OnUpdated(Updater<Domain> updater)
        {
            base.OnUpdated(updater);
            if (updater.IsNew)
            {
                var user = this.CurUser();
                user.AddUserDomain( Db, updater.Object.Id);

                //var user = this.CurUser();
                //user.DomainGuids(updater.Object.Id);
                //Db.Finds(user)
                //    .Set(x => x.DomainIds, user.DomainIds)
                //    .Update();

            }

        }

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(
            Guid? domain,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] DomainStatus[] statuses,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))]Guid[] spheres,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))]Orders.SourceType[] sources,
            bool? archive,
            string name)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require( Operations.DomainsEdit );

            var date = DateTime.Now;
            date = date.ToMidnight(1 - date.Day);

            // получаем список сфер по базам
            var bases = await Db.Bases
                .Where(b => b.SphereId != null)
                .Select(x => new { x.DomainId, SphereId = x.SphereId.Value, x.Sphere.Name })
                .Distinct()
                .ToListAsync();

            // Фильтруем домены
            var user_domains = user.DomainGuids();
            var qdomains0 = Db.Domains
                .WhereIf(archive != null, d => d.IsArchive == archive)
                .WhereIf(statuses.Length>0, d => statuses.Contains(d.Status))
                .WhereIf(domain != null, d => d.Id == domain)
                .WhereIf(domain == null && user_domains.Length>0, d => user_domains.Contains(d.Id));
            

            if (spheres.Length > 0)  // ищем зоны, базы в которой содержат сферы
            {
                var ids = bases
                    .Where(b => spheres.Contains(b.SphereId))
                    .Select(b => b.DomainId)
                    .ToList();
                qdomains0 = qdomains0.Where(x => ids.Contains(x.Id));
            }


            if (!user.Allow(Sys.Operations.DomainsAll))
            {
                var ids = user.DomainGuids(null);
                qdomains0 = qdomains0.Where(x => ids.Contains(x.Id));
            }

            if (!string.IsNullOrWhiteSpace(name))
            {
                name = name.Trim(); // избавляемся от пробелов
                var userDomIds = await Db.Users
                    .Where(u => u.DomainIds != null)
                    .Where(u => 
                        u.FIO.Contains(name) ||
                        u.Login.Contains(name) ||
                        u.Email.Contains(name) ||
                        u.Phone.Contains(name)
                    )
                    .Select(u => u.DomainIds)
                    .ToListAsync();
                var dids = userDomIds.SelectMany(u => u.ToGuids()).Distinct().ToList();
                qdomains0 = qdomains0.Where(x => dids.Contains(x.Id));
            }

            var owners = await Db.Users
                .Where(u => u.DomainIds != null)
                .Select(u => new
                {
                    u.Id,
                    u.Login,
                    u.FIO,
                    Domains = u.DomainIds.ToGuids(), //.Split(',').Select(s=>Guid.Parse(s)).ToArray(),
                })
                .ToListAsync();


            var qdomains =
                from dom in qdomains0
                let pays = dom.PayDocs.Where(y => y.IsCompleted)
                select new
                {
                    dom = dom,
                    pays = pays.Sum(y => y.Total),
                };

            var domains = await qdomains.ToListAsync();

            var invoices = Db.Orders.WhereInvoices();

            if(sources?.Length>0)
            {
                invoices = invoices.Where(o => sources.Contains(o.SourceType) );
            }


            // комиссия долги
            var qDebtSums =
                from x in invoices.WherePeriod(PeriodType.Debt) //invoices
                group x by x.DomainId into g
                select new
                {
                    domain = g.Key,
                    sum = g.Sum(y => y.MobComm),
                };

            var debtSums = await qDebtSums.ToListAsync();

            // комиссия прошлый месяц
            var qLastSums =
                from x in invoices.WherePeriod(PeriodType.Previos) //invoices
                group x by x.DomainId into g
                select new
                {
                    domain = g.Key,
                    sum = g.Sum(y => y.MobComm),
                };

            var lastSums = await qLastSums.ToListAsync();

            // комиссия текущий месяц
            var qCurSums =
                from x in Db.Orders.WherePeriod(PeriodType.Current).WhereInvoices()
                group x by x.DomainId into g
                select new
                {
                    domain = g.Key,
                    sum = g.Sum(y => y.MobComm),
                };

            var curSums = await qCurSums.ToListAsync();

            var query =
                from x in domains

                    //var orders = Db.Orders.Where(y => y.DomainId == x.dom.Id)
                    //var invIncCommSum =  orders.GetInvoiceOrders(true).Sum(y => y.MobComm)
                    //var invCurrCommSum = orders.GetInvoiceOrders(false).Sum(y => y.MobComm)
                let qspheres = bases.Where(b => b.DomainId == x.dom.Id).ToList()
                //where spheres.Length == 0 || qspheres.Count >0
                let qowners = owners.Where(o => o.Domains.Contains(x.dom.Id)).ToList()
                select new
                {
                    x.dom.Id,
                    x.dom.Status,
                    x.dom.Name,
                    x.dom.InitDate,
                    x.dom.CreateDate,

                    //x.dom.AllowShare,
                    x.dom.IsArchive,
                    x.dom.Email,
                    x.dom.Phone,
                    x.dom.Description,

                    x.dom.LimitDate,
                    x.dom.TarifId,
                    x.dom.TarifIds,
                    x.dom.CityId,
                    x.dom.Period,
                    x.dom.IsPayment,
                    x.dom.Terminal,
                    x.dom.Inn,

                    //IncComm = invIncCommSum,
                    //CurrComm = invCurrCommSum,
                    DebtComm = debtSums.FirstOrDefault(s => s.domain == x.dom.Id)?.sum,
                    LastComm = lastSums.FirstOrDefault(s => s.domain == x.dom.Id)?.sum,
                    CurrComm = curSums.FirstOrDefault(s => s.domain == x.dom.Id)?.sum,
                    Spheres = string.Join(",", qspheres.Select(s=>s.Name).Distinct()),
                    Owners = string.Join(",", qowners.Select(s => s.Login + " " + s.FIO).Distinct()),

                    PaysTotal = x.pays,
                };

            var list = query.ToList();
            return Json(list);
        }



        [HttpGet("names")]
        public async Task<IActionResult> GetNamesAsync()
        {
            this.RequiresAuthentication();

            var user = this.CurUser();
            var allow = user.Allow(Operations.DomainsEdit);
            if (!allow)
                return Json(new object[0]);  // если нет прав, то возвращаем пустой массив

            var query = Db.Domains
                .OrderBy(x => x.Name)
                .GetActuals()
                .Select(x => new
                {
                    x.Id,
                    value = x.Name,
                });
            var list = await query.ToListAsync();
            return Json(list);
        }



        [HttpPost("init")]
        public async Task<IActionResult> InitAsync(Guid? id, [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] string[] operations)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Operations.DomainsEdit);

            var svc = new DomainService { Db = Db, User = user };
            await svc.InitAsync(id, operations);

            return Ok();
        }



        /// <summary>
        /// Сброс партнерской зоны
        /// </summary>
        [HttpPost("reset")]
        public async Task<IActionResult> ResetAsync(Guid id)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();
            curuser.Require(Operations.DomainsEdit);

            var svc = new DomainService { Db = Db, User = curuser };
            var svc_res = await svc.ResetAsync(id);

            var res = new
            {
                IsNew = svc_res.user == null,
                svc_res.user.Login,
                Password = svc_res.password,
            };
            return Json(res);
        }


        /// <summary>
        /// Регистрация партнерской зоны
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        [HttpPost("registry")]
        public async Task<IActionResult> RegistryDomain(DomainService.RegArgs args)
        {
            var curuser = this.CurUser();
            var svc = new DomainService { Db = Db, User = curuser };
            var svc_res = await svc.RegistryAsync(args);

            var res = new 
            { 
                UserId = svc_res.user.Id, 
                Login = svc_res.user.Login,
                DomainId = svc_res.domain.Id
            };
            return Ok();
        }



        /// <summary>
        /// Получение информациии о Партнере 
        /// </summary>
        [HttpGet("info")]
        public async Task<IActionResult> GetInfoAsync(Guid? id)
        {
            this.RequiresAuthentication();
            //user.Allow(Sys.Operations.DomainsEdit)
            var user = this.CurUser();
            id = user.DomainId ?? id;

            if (id == null)
                throw new UserException("Не найден или не задан партнер у пользователя");

            var dom = await Db.Domains
                           .LoadWith(x => x.Tarif)
                           .FindAsync(id);

            var pdocs = Db.PayDocs
                .LoadWith(p => p.Tarif)
                .OrderByDescending(x => x.Date)
                .Where(x => x.PayerDomId == id)
                .Where(x => x.IsCompleted)
                .Select(p => new
                {
                    p.Date,
                    p.PayDate,
                    p.Price,
                    p.Total,
                    tarif = new
                    {
                        p.Tarif.Name,
                        p.Tarif.Commission,
                        p.Tarif.PayCommission,
                    }
                });

            var orders = Db.Orders
                .GetDomainObjects(id)
                .WhereInvoices();

            var incComms = orders.WherePeriod(PeriodType.Previos | PeriodType.Debt);
            var currComms = orders.WherePeriod(PeriodType.Current);
            var tr = dom.Tarif;

            var res = new
            {
                dom.Id,
                dom.Name,
                dom.LimitDate,
                // Комиссия к оплате
                MobInvComm = incComms.Sum(x => x.MobComm), // комиссия для счета
                MobInvComms = incComms.Select(o => new
                {
                    o.Id,
                    o.ClientId,
                    Client = o.Client.FirstName + " " + o.Client.LastName,
                    o.DateFrom,
                    o.Comment,
                    o.ClientComment,
                    Date = o.DateFrom,
                    Hours = (o.DateTo.Hour == 0 ? 24 : o.DateTo.Hour) - o.DateFrom.Hour,
                    o.RoomId,
                    Room = o.Room.Name,
                    o.Room.BaseId,
                    Base = o.Room.Base.Name,
                    o.Room.Base.SphereId,
                    Sphere = o.Room.Base.Sphere.Name,
                    o.MobComm,
                    TotalSum = o.TotalOrder,
                    o.Status,
                    o.Reason,
                    o.Discount,
                    //o.IsConfirmed,
                    //o.IsHold,
                    //o.IgnoreMobComm,
                    o.SourceType,
                }).ToList(),
                // Текущая комиссия
                MobCurrComm = currComms.Sum(x => x.MobComm), // текущая комиссия по мобильный платежам
                MobCurrComms = currComms.Select(o => new
                {
                    o.Id,
                    o.ClientId,
                    Client = o.Client.FirstName + " " + o.Client.LastName,
                    o.Comment,
                    o.ClientComment,
                    Date = o.DateFrom,
                    Hours = (o.DateTo.Hour == 0 ? 24 : o.DateTo.Hour) - o.DateFrom.Hour,
                    o.RoomId,
                    Room = o.Room.Name,
                    o.Room.BaseId,
                    Base = o.Room.Base.Name,
                    o.Room.Base.SphereId,
                    Sphere = o.Room.Base.Sphere.Name,
                    o.MobComm,
                    TotalSum = o.TotalOrder,
                    o.Status,
                    o.Reason,
                    o.Discount,
                    //o.IsConfirmed,
                    //o.IsHold,
                    //o.IgnoreMobComm,
                    o.SourceType,
                }).ToList(),
                dom.Status,
                Tarif = tr==null ?null :new
                {
                    Id = tr.Id,
                    Commission = tr.Commission,
                    Description = tr?.Description,
                    Name = tr.Name,
                    Price = tr.Price,
                    //tr.IsPayment,
                },
                //Tarif = new
                //{
                //    Id = tr?.Id ?? Guid.Empty,
                //    Commission = tr?.Commission ?? 0,
                //    Description = tr?.Description ?? "",
                //    Name = tr?.Name ?? "(Тариф не задан)",
                //    Price = tr?.Price ?? 0,
                //    //tr.IsPayment,
                //},
                //tarifs = dom.TarifIds.ToGuids(),
                //dom.Terminal,
                docs = pdocs.ToList(),

            };
            return Json(res);
        }


        [HttpGet("job")]
        public async Task<IActionResult> ForceJobAsync()
        {
            var job = new DomainStatusJob();
            await job.RunAsync();
            return Ok();
        }



        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            this.RequiresAuthentication();

            var obj = await Db.Domains
                .LoadWith(x => x.Tarif)
                .FindAsync(id);

            var pdoc = await Db.PayDocs
                .OrderByDescending(x => x.Date)
                .FirstOrDefaultAsync(x => x.PayerDomId == id);

            var orders = Db.Orders
                .GetDomainObjects(id);
            //.Where(x => x.MobComm > 0);

            var invIncCommSum = await orders.WherePeriod(PeriodType.Previos | PeriodType.Debt).WhereInvoices().SumAsync(x => x.MobComm);
            var invCurrCommSum = await orders.WherePeriod(PeriodType.Current).WhereInvoices().SumAsync(x => x.MobComm);

            var tr = obj.Tarif;
            //if (tr == null)
            //   throw new UserException("Не задан тариф");

            var res = new
            {
                obj.Id,
                obj.Name,
                obj.IsArchive,
                obj.Period,
                obj.IsPayment,

                obj.LimitDate,
                MobInvComm = invIncCommSum, // комиссия для счета
                MobCurrComm = invCurrCommSum, // текущая комиссия по мобильный платежам
                Tarif = new
                {
                    Id = tr?.Id ?? Guid.Empty,
                    Commission = tr?.Commission ?? 0,
                    Description = tr?.Description ?? "",
                    Name = tr?.Name ?? "(Тариф не задан)",
                    Price = tr?.Price ?? 0,
                    //tr.IsPayment,
                },
                obj.TarifIds,
                obj.Terminal,
                obj.Inn,

                fio = pdoc?.FIO,
                pdoc?.Email,
                pdoc?.Phone,
                pdoc?.MobPhone,
            };
            return Json(res);
        }

    }
}
