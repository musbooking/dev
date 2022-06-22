using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using Itall;
using My.App;
using Itall.App.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Fin
{
    //[Route("expitems")]
    public class ExpItemsController : UpdateDbController<ExpenseItem>
    {

        //public ExpenseItemsModule(): base("/")
        //{
        //    //Get["/", true] = GetListAsync;

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Updater<ExpenseItem> updater)
        {
            this.CurUser().Require(Sys.Operations.ExpDocs);

            base.OnUpdating(updater);

            updater.Set(x => x.ExpenseId);
            updater.Set(x => x.Description);
            updater.Set(x => x.GroupId);
            updater.Set(x => x.Amount);

            return base.OnUpdating(updater);
        }

        protected override void OnUpdated(Updater<ExpenseItem> updater)
        {
            base.OnUpdated(updater);

            var changes = SysUtils.GetChangesText(updater);
            if (string.IsNullOrWhiteSpace(changes)) return;

            var text = "Изменения стоимости статей: ";
            var msg = new Common.Message
            {
                ExpenseId = updater.Object.ExpenseId,
                Date = DateTime.Now,
                DomainId = this.CurUser()?.DomainId,
                Kind = Common.MessageKind.System,
                SenderId = this.CurUser().Id,
                Text = text + changes,
                Scope = ScopeType.Zone,
            };
            updater.Db.CreateInsert(msg);
        }

        //[Route("list")]
        //public async Task<IActionResult> GetListAsync()
        //{
        //    this.RequiresAuthentication();
        //    this.CurUser().Require(Permission.ExpDocs);

        //    using (var db = new AppDb())
        //    {
        //        var query = db.Expenses
        //            .GetDomainObjects(this.CurUser()?.DomainId)
        //            .Select(x => new
        //            {
        //                x.Id,
        //                x.Date,
        //                x.Description,
        //                x.BaseId,
        //                Login = x.CreatedBy.FIO ,
        //            });
        //        return Json(await query.ToListAsync());
        //    }
        //}


    }


}
