using Itall;
using Itall.App.Data;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My.App.Sys
{
    public class PermissionsController : UpdateDbController<Permission>
    {

        protected override object OnUpdating(Updater<Permission> updater)
        {
            this.RequiresAuthentication();
            this.CurUser().Require(Operations.AdminAccess);

            updater.Set(x => x.Roles);

            //App.Current.LoginManager.ResetLogin();
            //Itall.Modules.Auth.LoginsCache.Global.Reset();

            return base.OnUpdating(updater);
        }


        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Permissions.Reset();
        }


        [HttpGet("list")]
        public IActionResult GetListAsync()
        {
            this.RequiresAuthentication();
            this.CurUser().Require(Operations.AdminAccess);

            var query = DbCache.Permissions.Get() //Db.GetTable<Permission>()
                .Select(x => new
                {
                    x.Id,
                    x.Operation,
                    x.Roles,
                    //Description = x.Description ?? "",
                });
            var res = query.ToList();

            return Json(res);
        }

        [HttpPost("init")]
        public async Task<IActionResult> InitAsync([ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))]string[] operations)
        {
            this.RequiresAuthentication();
            this.CurUser().Require(Operations.AdminAccess);

            var permissions = await Db.GetTable<Permission>()
                .Select(x => x.Operation)
                .ToListAsync();

            var newPermissions =
                from x in operations
                where !permissions.Contains(x)
                select new Permission
                {
                    Id = Guid.NewGuid(),
                    Operation = x,
                    Updated = DateTime.Now,
                };

            //Db.BulkCopy(newPermissions);             Exception: System.InvalidOperationException
            // Message  : The given ColumnMapping does not match up with any column in the source or destination.

            foreach (var p in newPermissions)
            {
                await Db.CreateInsertAsync(p);
            }

            return Ok();
        }

    }


}
