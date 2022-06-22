using Itall;
using Itall.App.Data;
using LinqToDB;
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace My.App.Sys
{
    public class TemplatesController : BaseListController<Template>
    {

        protected override object OnUpdating(Updater<Template> updater)
        {
            updater.Set(x => x.Subject);
            updater.Set(x => x.Text);
            updater.Set(x => x.Key);
            updater.Set(x => x.Email);
            updater.Set(x => x.Sms);

            return base.OnUpdating(updater);
        }


        protected override void OnChanged(Guid id, DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Templates.Reset();
        }


        [HttpGet("list")]
        public IActionResult GetList()
        {
            this.RequiresAdmin();

            var res = DbCache.Templates.Get()
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.IsArchive,
                    t.Subject,
                    t.Key,
                    // add
                    t.Text,
                    t.Email,
                    t.Sms
                });
            return Json(res);
        }

        [HttpGet("names")]
        public IActionResult GetNames(string key)
        {
            this.RequiresAuthentication();

            var res = DbCache.Templates.Get()
                .WhereIf( key!=null, t => t.Key == key )
                .Select(t => new
                {
                    t.Id,
                    Value = t.Name,
                });
            return Json(res);
        }



        [HttpGet("get/{id}")]
        public IActionResult Get(Guid id)
        {
            this.RequiresAdmin();

            var qry =
                from x in DbCache.Templates.Get()
                select new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.IsArchive,

                    x.Subject,
                    x.Email,
                    x.Sms,
                    x.Text,
                    x.Key,
                };

            var res = qry.First(x => x.Id == id);

            return Json(res);
        }

    }
}
