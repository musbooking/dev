using Itall.App.Data;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace My.App.Sys
{

    public class JobsController : UpdateDbController<JobEntity>
    {
        protected override object OnUpdating(Updater<JobEntity> updater)
        {
            //this.CurUser().Require(Operations.AdminAccess);
            updater.Set(x => x.Status);
            updater.Set(x => x.Description);
            //updater.Set(x => x.Date);
            //updater.Set(x => x.Attempts);
            updater.Set(x => x.MinDate);
            updater.Set(x => x.Status);


            return base.OnUpdating(updater);
        }


        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync( Guid id )
        {
            this.RequiresAuthentication();
            //this.CurUser().Require(Operations.AdminAccess);

            var query = Db.GetTable<Sys.JobEntity>()
                .Where(j => j.ObjectId == id)
                .Select(x => new
                {
                    x.Id,
                    x.Description,
                    x.Status,
                    x.Attempts,
                    x.Date,
                    x.Size,
                });
            var res = await query.ToListAsync();
            return Json(res);
        }


        [HttpGet("names")]
        public async Task<IActionResult> GetNamesAsync()
        {
            this.RequiresAuthentication();

            var query = Db.GetTable<Role>()
                .OrderBy(x => x.Name)
                .Select(x => new
                {
                    //id = x.Id,
                    id = x.Name,
                    value = x.Description, // +"  ("+ x.Name + ")",
                });
            var res = await query.ToListAsync();
            return Json(res);
        }

    }
}
