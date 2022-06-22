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
    //[Route("expenses")]
    public class ExpensesController: UpdateDbController<Expense>
    {

        //public ExpensesModule(): base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    Get["/", true] = GetObjectAsync;

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Updater<Expense> updater)
        {
            var user = this.CurUser();
            user.Require(Sys.Operations.ExpDocs);

            base.OnUpdating(updater);

            updater.Set(x => x.BaseId);
            updater.Set(x => x.Description);
            updater.Set(x => x.Date);
            updater.Set(x => x.IsArchive);
            updater.Set(x => x.IsPublic);

            var obj = updater.Object;
            if (obj.CreatedById==null)
                updater.Set(x => x.CreatedById, user.Id);

            return new
            {
                obj.Id,
                Date = obj.Date.ToString("yyyy-MM-dd"),
                Login = user.Login + ", " + user.FIO,
            };
        }

        protected override void OnUpdated(Updater<Expense> updater)
        {
            var user = this.CurUser();

            base.OnUpdated(updater);

            var text = updater.IsNew ? "Создан расходный документ :" : "Изменен расходный документ: ";
            var changes = SysUtils.GetChangesText(updater);
            if (string.IsNullOrWhiteSpace(changes)) return;

            var msg = new Common.Message
            {
                ExpenseId = updater.Object.Id,
                Date = DateTime.Now,
                DomainId = user.DomainId,
                Kind = Common.MessageKind.System,
                SenderId = user.Id,
                Text = text + changes,
                Scope = ScopeType.Zone,
            };
            updater.Db.CreateInsert(msg);
        }


        /// <summary>
        /// Получение списка расходных документов
        /// </summary>
        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(
            DateTime? dateFrom,
            DateTime? dateTo
            )
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.ExpDocs);

            // готовим запрос списка расходников
            var base_ids = user.BaseGuids();
            var docs_admin = user.Allow(Sys.Operations.ExpDocsAdmin);

            var qexp = Db.Expenses
                .GetDomainObjects(user.DomainId)
                //.WhereIf( !user.Allow(Sys.Operations.ExpDocsAdmin), x => x.CreatedById == user.Id)
                .WhereIf( !docs_admin, ex => base_ids.Contains(ex.BaseId.Value) || ex.CreatedById == user.Id)
                .WhereIf( dateFrom != null,  x => x.Date >= dateFrom)
                .WhereIf( dateTo != null, x => x.Date <= dateTo);

            // готовим список элементов для расходников (детализация), чтобы одним запросом
            //var qitems = qexp
            //    .SelectMany(e => e.Items)
            //    .Select(it => new {it.ExpenseId, it.Amount, it.Group.Name, it.Description} )
            //    //.ToListAsync()
            //    ;

            var qlist = 
                from ex in qexp
                let exitems = ex.Items
                    //.Where(it => it.ExpenseId == ex.Id)
                    .Select(it => $"{it.Group.Name}:{it.Amount}")
                select new
                {
                    ex.Id,
                    ex.Date,
                    ex.Description,
                    ex.BaseId,
                    ex.IsArchive,
                    ex.IsPublic,
                    Login = ex.CreatedBy.Login + ", "+ ex.CreatedBy.FIO + "",
                    Totals = ex.Items.Sum(y=>y.Amount),
                    Details = string.Join(", ", exitems)
                };
            var list = await qlist.ToListAsync();
            return Json(list);
        }



        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user?.Require(Sys.Operations.ExpDocs); 

            var obj = await Db.Expenses
                .LoadWith(x=>x.Items)
                .LoadWith(x => x.CreatedBy)
                .GetDomainObjects(user?.DomainId)
                .FindAsync(id);

            var res = new
            {
                obj.Id,
                obj.BaseId,
                Description = "" + obj.Description,
                obj.Date,
                Login = obj.CreatedBy.FIO,
                Items = obj.Items
                    .Select(ei => new
                    {
                        ei.Id,
                        ei.Amount,
                        ei.Description,
                        ei.ExpenseId,
                        ei.GroupId,
                    })
                    .ToList(),
                obj.IsArchive,
                obj.IsPublic,
            };
            return Json(res);
        }
    }


}
