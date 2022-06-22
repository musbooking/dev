using Itall.App.Data;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace My.App.Sys
{

    public class RolesController : BaseListController<Role>
    {
        protected override object OnUpdating(Updater<Role> updater)
        {
            this.CurUser().Require(Operations.AdminAccess);

            return base.OnUpdating(updater);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync()
        {
            this.RequiresAuthentication();
            this.CurUser().Require(Operations.AdminAccess);

            var query = Db.GetTable<Role>()
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.IsArchive,
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
