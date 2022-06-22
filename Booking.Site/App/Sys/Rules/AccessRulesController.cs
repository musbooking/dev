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

namespace My.App.Sys
{
    [Route("api/rules")]
    public class AccessRulesController : UpdateDbController<AccessRule>
    {

        //public AccessRulesModule() : base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    RegUpdateRoutes();
        //} 

        protected override object OnUpdating(Updater<AccessRule> updater)
        {
            this.CurUser().Require(Operations.EditIP);

            base.OnUpdating(updater);

            updater.Set(x => x.IP);
            updater.Set(x => x.Description);
            updater.Set(x => x.IsDisabled);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.AccessRules.Reset();
        }

        [HttpGet("list")]
        public IActionResult GetList()
        {
            this.RequiresAuthentication();
            this.CurUser().Require(Operations.EditIP);

            //using (var db = new AppDb())
            {
                var query = DbCache.AccessRules.Get().Values.AsQueryable() //db.GetQuery<Models.AccessRule>()
                    .GetDomainObjects(this.CurUser().DomainId)
                    .Select(x => new
                    {
                        x.Id,
                        ip = x.IP,
                        x.IsDisabled,
                        x.Description,
                    });
                return Json(query.ToList());
            }
        }

    }


}
