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

namespace My.App.CRM
{
    public class GroupsController : ListController<Group>
    {

        protected override object OnUpdating(Updater<Group> updater)
        {
            //base.OnUpdating(updater);


            //updater.Set(x => x.Name);
            updater.Set(x => x.Key);
            updater.Set(x => x.Type);
            //updater.Set(x => x.IsArchive);
            //updater.Set(x => x.Description);
            updater.Set(x => x.GpsLat);
            updater.Set(x => x.GpsLong);
            updater.Set(x => x.Values);
            updater.Set(x => x.Index);
            //updater.Set(x => x.Fin);
            updater.Set(x => x.Icon);
            updater.Set(x => x.IsRange);
            updater.Set(x => x.LimitD);
            updater.Set(x => x.LimitM);
            updater.Set(x => x.Default);
            updater.Set(x => x.CategoryId);
            updater.Set(x => x.SphereIds);

            checkAccess(updater.Object.Type, true);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Groups.Reset();
        }


        public static readonly Group Default = new Group
        {
            Name = "(не найдено)",
        };

        [HttpGet("list")]
        public IActionResult GetListAsync(
            GroupType type, // = Convert<GroupType>(this.Request.Query.type);
            bool domain, // = Convert<bool>(this.Request.Query.domain);
            string sort,
            bool archive = true // учитываются ли архивные        
            )
        {
            //GroupType gtype = Convert<GroupType>(this.Request.Query.type);
            //bool domainOnly = Convert<bool>(this.Request.Query.domain);
            var domainId = this.CurUser()?.DomainId ?? Guid.Empty;

            checkAccess(type, domain);

            //string sort = Convert<string>(this.Request.Query.sort); // сортировка и порядок
            //bool archive = Convert<bool?>(this.Request.Query.archive) ?? true; // учитываются ли архивные

            var groups = DbCache.Groups.Get().Values
                .Where(x => !domain || x.DomainId == domainId)
                .Where(x => x.Type == type);

            if (sort == "name")
                groups = groups.OrderBy(x => x.Name);
            else if (sort == "-name")
                groups = groups.OrderByDescending(x => x.Name);
            else if (sort == "date")
                groups = groups.OrderBy(x => x.Updated);
            else if (sort == "-date")
                groups = groups.OrderByDescending(x => x.Updated);
            else
                groups = groups.OrderByDescending(x => x.Index);

            //else if (sort == "date")
            //    groups = groups.OrderBy(x => x._);
            //else if (sort == "-date")
            //    groups = groups.OrderByDescending(x => x.Name);

            if (!archive)
                groups = groups.GetActuals();

            var selGroups = groups
                .Select(g => new
                {
                    g.Id,
                    g.Name,
                    g.Key,
                    Domain = g.Domain?.Name,
                    Description = g.Description + "",
                    g.IsArchive,
                    g.GpsLat,
                    g.GpsLong,
                    g.Values,
                    g.Index,
                    Icon = g.Icon ?? " ",
                    g.LimitD,
                    g.LimitM,
                    g.Default,
                    g.CategoryId,
                    g.IsRange,
                    Category = g.Category?.Name,
                    g.SphereIds,
                    //x.Fin,
                });
            var res = selGroups
                .OrderBy(x => x.Index)
                .ToList();
            return Json(res);
        }

        [HttpGet("options")]
        public async Task<IActionResult> GetOptionNamesAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var bases = await Db.Bases
                .GetDomainObjects(user.DomainId)
                .Where(x => x.Sphere != null)
                .Where(x => x.Sphere.Values != null)
                .Select(x => new { x.Id, OptionsAsIds = x.Sphere.Values.ToGuids() })
                .ToListAsync();

            var baseOptionIds = bases
                .SelectMany(x => x.OptionsAsIds)
                .Distinct()
                .ToList();

            var options = DbCache.Groups.Get().Values
                .Where(x => x.Type == GroupType.OrderOption)
                .Where(x => x.IsArchive == false)
                .Where(x => baseOptionIds.Contains(x.Id))
                ;

            var names = options
                .Select(x => new
                {
                    x.Id,
                    Value = x.Name,
                    //x.Icon,
                    //Category = x.Category?.Name,
                    Bases = bases
                        .Where(b => b.OptionsAsIds.Contains(x.Id))
                        .Select(b => b.Id)
                        .ToList()
                });
            var res = names.ToList();
            return Json(res);
        }


        [HttpGet("cities")]
        public async Task<IActionResult> GetCities(double gpslat, double gpslong)
        {
            //double gpslat = Convert<double>(this.Request.Query.gpslat);
            //double gpslong = Convert<double>(this.Request.Query.gpslong);

            var groups = DbCache.Groups.Get().Values
                .Where(x => x.Type == GroupType.City)
                .Where(x =>  x.IsArchive == false)
                ;

            if (gpslat > 0 && gpslong > 0) // если заданы координаты - ищем ближайший
            {
                groups =
                    from x in groups
                    let dr2 = Math.Pow(x.GpsLat - gpslat, 2) + Math.Pow(x.GpsLong - gpslong, 2)
                    orderby dr2
                    select x;

                groups = groups.Take(3);
            }
            else
                groups = groups.OrderBy(x => x.Index);

            var domains = await Db.Domains
                .GetActuals()
                .OrderBy(x => x.Name)
                .Select(x => new
                {
                    x.Id,
                    x.CityId,
                    x.Name,
                })
                .ToListAsync();

            var selGroups = groups
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Key,
                    Description = x.Description + "",
                    x.IsArchive,
                    x.GpsLat,
                    x.GpsLong,
                    Domains = domains.Where(d => d.CityId == x.Id).ToList(),
                });
            var res = selGroups.ToList();
            return Json(res);
        }

        /// <summary>
        /// Проверка прав доступа в зависимости от типа группы
        /// </summary>
        void checkAccess(GroupType gtype, bool domainOnly)
        {
            if (gtype == GroupType.Version)
            {
                this.RequiresAuthentication();
            }
            else if (gtype == GroupType.City)
            {
                // игнорим проверку
            }
            else if (gtype == GroupType.Sphere)
            {
                // игнорим проверку
            }
            else if (gtype == GroupType.OrderOption)
            {
                // игнорим проверку
            }
            else if (gtype == GroupType.ContactType && domainOnly)
            {
                this.CurUser().Require(Sys.Operations.Lists);
                this.RequiresAuthentication();
            }
            else if (gtype == GroupType.ContactType && !domainOnly) // если все, то суперадмин
            {
                this.RequiresAdmin();
            }
            else if (gtype == GroupType.Expense)
            {
                this.CurUser().Require(Sys.Operations.ExpGroups);
                this.RequiresAuthentication();
            }
            else
            {
                this.RequiresAuthentication();
                //this.RequiresShare();
                //this.CurUser().Require(Core.Operations.CRMGroups);
            }
        }


        /// <summary>
        /// Оставлено для совместимости
        /// </summary>
        /// <returns></returns>
        [HttpGet("spheres")]
        public IActionResult GetSpheres()
        {
            var cc = new Orders.SpheresController();
            var list = cc.Search(null);
            return list;
            //var query = List.Get().Values.AsQueryable()
            //    .GetActuals()
            //    .Where(x => x.Type == GroupType.Sphere)
            //    .OrderBy(x => x.Index)
            //    .Select(x => new
            //    {
            //        x.Id,
            //        Value = x.Name,
            //        Options = x.Values.ToGuids(),
            //        x.Description,
            //        Icon = x.Icon ?? " ",
            //        x.LimitD,
            //        x.LimitM,
            //        ContentType = x.Name.Length % 2 == 1 ? 1 : 2,
            //    });
            //var list = query.ToList();
            //return Json(list);
        }


        ///// <summary>
        ///// Список финансовых групп
        ///// </summary>
        ///// <returns></returns>
        //[Route("finnames")]
        //public IActionResult GetFinGroups()
        //{
        //    var query = List.Get().Values.AsQueryable()
        //        .GetActuals()
        //        .Where(g => g.Type == GroupType.Fin)
        //        .OrderBy(x => x.Fin)
        //        .Select(x => new
        //        {
        //            x.Fin,
        //            Value = x.Name,
        //        });

        //    var list = query.ToList();
        //    return Json(list);
        //}


        [HttpGet("names")]
        public IActionResult GetNames(GroupType type, bool domain, Guid? sphere)
        {
            //this.RequiresAuthentication();
            //GroupType type = Convert<GroupType>(this.Request.Query.type);
            //checkAccess(type, domain);

            var domainId = this.CurUser()?.DomainId ?? Guid.Empty;

            var query = DbCache.Groups.Get().Values.AsQueryable()
                .GetActuals()
                .WhereIf(domain, x => x.DomainId == domainId)
                .Where(x => x.Type == type)
                .WhereIf(sphere!=null, g => g.SphereIds != null && g.SphereIds.Contains(sphere+""))
                .OrderBy(x => x.Index)
                .Select(x => new
                {
                    x.Id,
                    Value = x.Name,
                });

            var list = query.ToList();
            return Json(list);
        }

        /// <summary>
        /// Возвращаем параметры комнта
        /// </summary>
        [HttpGet("features")]
        public IActionResult GetFatureNames(Guid? sphere)
        {
            var qry0 = DbCache.Groups.Get().Values
                .Where(b => b.Type == GroupType.RoomFeature)
                .Where(b => !b.IsArchive);

            if (sphere != null)
            {
                // изменяем фильтрацию по сферам согласно https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/34977/
                //
                //var sph = Orders.SpheresController.List.Get()[sphere.Value];
                //var ids = sph.Features.ToGuids();
                //if (ids?.Length > 0)
                //{
                //    qry0 = qry0.Where(x => ids.Contains(x.Id));
                //}
                qry0 = qry0
                    .Where(f => f.SphereIds== null || f.SphereIds.Contains(sphere.ToString()) == true);
            }
            else
            {
                var user = this.CurUser();
                var domainid = user?.DomainId;
                if(domainid != null)  // фильтруем только те сферы, которые есть в партнерской зоне
                {
                    var sphereids = Db.Bases
                        .GetDomainObjects(domainid)
                        .Where(b => b.SphereId != null)
                        .Select(b => b.SphereId.Value)
                        .Distinct()
                        .ToList();
                    // ищем все features, where sphereids intersect with domain sphere-ids
                    qry0 = qry0.Where(f => f.SphereIds.ToGuids().Intersect(sphereids).Any());
                }
            }

            var query =
                from x in qry0
                where x.Type == GroupType.RoomFeature
                let category = x.CategoryId == null ? "" : " (" + x.Category.Name + ")"
                orderby x.Index //category
                select new
                {
                    x.Id,
                    Value = x.Name + category,
                };
            var list = query.ToList();
            return Json(list);
        }

        /// <summary>
        /// Пересортировка индексов
        /// </summary>
        [HttpPost("reindex")]
        public async Task<IActionResult> ApplyIndexAsync(int start, [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))]  Guid[] ids)
        {
            await Db.Groups.ReindexAsync(start, ids);
            DbCache.Groups.Reset();

            return Ok();
        }
    }
}
