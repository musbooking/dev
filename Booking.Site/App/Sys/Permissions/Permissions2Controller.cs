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
using Microsoft.AspNetCore.Mvc;

namespace My.App.Sys
{
    //[Route("permissions")]
    public partial class Permissions2Controller : UpdateDbController<Permission>
    {
       //public PermissionsModule(): base("/")
       // {
       //     Get["/", true] = GetListAsync;

       //     RegUpdateRoutes();
       // }

        protected override object OnUpdating(Updater<Permission> updater)
        {
            this.RequiresAuthentication();

            base.OnUpdating(updater);

            //updater.Set(x => x.Operation);
            updater.Set(x => x.Roles);
            //updater.Set(x => x.Description);

            //App.Current.LoginManager.ResetLogin();
            //Itall.Modules.Auth.LoginsCache.Global.Reset();

            return base.OnUpdating(updater);
        }


        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Operations.Users);

            var query = Db.Permissions
                .Where(p => p.DomainId == user.DomainId)
                .Select(x => new
                {
                    x.Id,
                    x.Operation,
                    x.Roles,
                    //Description = x.Description ?? "",
                });
            var res = await query.ToListAsync();

            return Json(res);
        }

    }


}
