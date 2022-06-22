using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itall.App.Data;

namespace My.App
{
    public abstract class ListController<T> : UpdateDbController<T> where T : ListItem
    {
        //public ListController(LinqToDB.Data.DataConnection db) : base(db)
        //{

        //}

        protected override object OnUpdating(Updater<T> updater)
        {
            updater.Set(x => x.Name);
            updater.Set(x => x.Description);
            updater.Set(x => x.IsArchive);

            return base.OnUpdating(updater);
        }

        //[Route("list")]
        //public virtual async Task<ActionResult> GetList()
        //{
        //    var res = await Db.GetTable<T>()
        //        //.Select(x => new
        //        //{
        //        //    x.Id,
        //        //    x.Name,
        //        //    x.Description,
        //        //    x.IsArchive,
        //        //})
        //        .ToListAsync();
        //    return Json(res);
        //}

        //[Route("names")]
        //public virtual async Task<ActionResult> GetNames()
        //{
        //    var res = await Db.GetTable<T>()
        //        .GetActuals()
        //        .OrderBy(x => x.Name)
        //        .Select(x => new
        //        {
        //            id = x.Id,
        //            value = x.Name,
        //        })
        //        .ToListAsync();
        //    return Json(res);
        //}

    }
}
