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
using Itall.App.Data;
using Itall;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Common
{
    //[Route("days")]
    public class DaysController : UpdateDbController<Day>
    {

        //public DaysModule() : base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    Get["/", true] = GetFutureAsync;

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Updater<Day> updater)
        {
            //base.OnUpdating(updater);
            this.RequiresShare();
            this.CurUser().Require(Sys.Operations.Days);

            updater.Set(x => x.Date);
            updater.Set(x => x.Description);
            updater.Set(x => x.IsWeekend);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Days.Reset();
        }


        [HttpGet("list")]
        public IActionResult GetListAsync()
        {
            this.RequiresAuthentication();
            //RequiresShare();
            //this.CurUser().Require(Permission.Days);

            //using (var db = new AppDb())
            {
                var query = DbCache.Days.Get().Values  // db.GetQuery<Models.Day>()
                    .Select(x => new
                    {
                        x.Id,
                        x.Date,
                        x.Description,
                        x.IsWeekend,
                    });
                return Json(query.ToList());
            }
        }


        [HttpGet("future")]
        public IActionResult GetFuture()
        {
            //this.RequiresAuthentication();
            //using (var db = new AppDb())
            {
                var query = DbCache.Days.Get().Values
                    .Where(x=>x.Date >= DateTime.Now)
                    .OrderBy(x=>x.Date)
                    .Select(x => new
                    {
                        x.Date,
                        x.IsWeekend,
                    });
                return Json(query.ToList());
            }
        }

    }


}
