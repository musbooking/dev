using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Sys
{

    public partial class Roles2Controller : ListController<Role>
    {
        //protected override object OnUpdating(Updater<Role> updater)
        //{
        //    base.OnUpdating(updater);

        //    this.CurUser().Require(Operations.Users);
        //    updater.Set(x => x.Name);
        //    updater.Set(x => x.Description);

        //    return base.OnUpdating(updater);
        //}

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Operations.Users);

            var query = Db.Roles
                .Where(x=>x.DomainId==user.DomainId)
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
            var user = this.CurUser();
            user.Require(Operations.Users);

            var query = Db.Roles
                .Where(x => x.DomainId == user.DomainId)
                .OrderBy(x => x.Name)
                .Select(x => new
                {
                    id = x.Name,
                    value = x.Description ?? x.Name, // +"  ("+ x.Name + ")",
                });
            var res = await query.ToListAsync();
            return Json(res);
        }
       
    }
}
