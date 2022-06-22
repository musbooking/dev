using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Itall;
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Orders
{
    public class SpheresController : ListController<Sphere>
    {

        protected override object OnUpdating(Updater<Sphere> updater)
        {
            updater.Set(x => x.Index);
            updater.Set(x => x.Icon);

            updater.Set(x => x.LimitD);
            updater.Set(x => x.LimitM);

            updater.Set(x => x.Default);
            updater.Set(x => x.Values);
            updater.Set(x => x.Features);
            updater.Set(x => x.Kind);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Spheres.Reset();
        }



        [HttpGet("list")]
        public IActionResult GetList()
        {
            this.RequiresAuthentication();
            var domainId = this.CurUser()?.DomainId ?? Guid.Empty;

            var groups = DbCache.Spheres.Get().Values
                .OrderBy(x => x.Index)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    Domain = x.Domain?.Name,
                    Description = x.Description + "",
                    x.IsArchive,
                    x.Values,
                    x.Features,
                    x.Index,
                    Icon = x.Icon ?? " ",
                    x.LimitD,
                    x.LimitM,
                    x.Default,
                    x.Kind,
                });

            var res = groups.ToList();
            return Json(res);
        }

        [HttpGet("search")]
        public IActionResult Search( Guid? city )
        {
            //var bases = Db.Bases
            //    .GetActuals()
            //    .Where(b => b.Rooms.Any(r=>r.AllowMobile))
            //    .Where(b => b.Domain.IsArchive == false)
            //    .Where(b => b.Domain.Status != Partners.DomainStatus.Locked)
            //    //.Where(b => b.Domain.Status != Partners.DomainStatus.New)
            //    .WhereIf(city != null, b => b.CityId == city, null)
            //    .ToList();

            var query = 
                from s in Db.Spheres.GetActuals()
                orderby s.Index

                let bases = Db.Bases
                    .GetActuals(true)
                    .Where(b => b.Rooms.Any(r => r.AllowMobile))
                    .Where(b => b.Domain.IsArchive == false)
                    .Where(b => b.Domain.Status != Partners.DomainStatus.Locked)
                    //.Where(b => b.Domain.Status != Partners.DomainStatus.New)
                    .WhereIf(city != null, b => b.CityId == city, null)

                let sbases = bases
                    .Where(b=>b.SphereId == s.Id)

                let features = s.Features.ToGuids()

                select new
                {
                    s.Id,
                    Value = s.Name,
                    Options = s.Values.ToGuids(),
                    Features = features,
                    s.Default,
                    s.Description,
                    Icon = s.Icon ?? " ",
                    s.LimitD,
                    s.LimitM,
                    NBases = sbases
                        .Count(),
                    NDomains = sbases
                        .GroupBy(b => b.DomainId)
                        .Select(x => x.Key)
                        .Count(),
                    //Domains = sbases
                    //    .GroupBy(b => b.DomainId)
                    //    .Select(x => x.Key).ToList(),
                    s.Kind, //ContentType = x.Name.Length % 2 == 1 ? 1 : 2,
                };

            //var query = List.Get().Values.AsQueryable()
            //    .GetActuals()
            //    .OrderBy(x => x.Index)
            //    .Select(s => new
            //    {
            //        s.Id,
            //        Value = s.Name,
            //        Options = s.Values.ToGuids(),
            //        Features = s.Features.ToGuids(),
            //        s.Default,
            //        s.Description,
            //        Icon = s.Icon ?? " ",
            //        s.LimitD,
            //        s.LimitM,
            //        s.Kind, //ContentType = x.Name.Length % 2 == 1 ? 1 : 2,
            //    });

            var list = query.ToList();
            return Json(list);
        }

        [HttpGet("names")]
        public IActionResult GetNames()
        {
            var query = DbCache.Spheres.Get().Values.AsQueryable()
                .GetActuals()
                .OrderBy(x => x.Index)
                .Select(x => new
                {
                    x.Id,
                    Value = x.Name,
                });
            var list = query.ToList();
            return Json(list);
        }



        [HttpPost("reindex")]
        public async Task<IActionResult> ApplyIndexAsync(int start, [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] ids)  //old: 
        {
            await Db.Spheres.ReindexAsync(start, ids);
            DbCache.Spheres.Reset();

            return Ok();
        }
    }
}
