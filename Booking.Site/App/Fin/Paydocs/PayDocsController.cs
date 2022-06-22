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
using System.Threading;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Fin
{
    //[Route("paydocs")]
    public class PayDocsController : UpdateDbController<PayDoc>
    {

        //public PayDocsModule() : base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    Get["/", true] = GetInvoicesAsync;
        //}

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(Guid? domain, bool closedOnly = false)
        {
            this.RequiresAuthentication();

            //RequiresShare();
            //var vars = this.Request.Query;
            //Guid? domain = Convert<Guid?>(vars.domain);

            var qry = Db.PayDocs
                //.GetDomainObjects(this.CurUser()?.DomainId)
                .OrderByDescending(x => x.Date)
                .Where(x => x.PayerDomId == domain)
                .Where(x => x.IsCompleted)
                .Select(x => new
                {
                    x.Id,
                    Date = x.Date,
                    x.MobComm,
                    Total = x.Total,
                    Text = x.Description + "",
                    fio = x.FIO,
                    x.Email,
                    x.Phone,
                    x.MobPhone,
                    x.IsCompleted
                });


            var list = await qry.ToListAsync();

            return Json(list);
        }


        [HttpGet("invoices")]
        public async Task<IActionResult> GetInvoicesAsync(Guid? domain)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            //var vars = this.Request.Query;
            //Guid? domain = Convert<Guid?>(vars.domain);

            if (domain == null)
                return Error("Не задан domain");

            //RequiresShare();
            if (!user.IsSuper() && user.DomainId != domain)
                return Error("Нет прав доступа к этой операции");


            //using (var Db = new DbConnection())
            {
                var invCommSum = await Db.Orders
                    .GetDomainObjects(domain)
                    //.Where(x => x.MobComm > 0)
                    .WherePeriod(PeriodType.Previos | PeriodType.Debt)
                    .WhereInvoices()
                    .SumAsync(x => x.MobComm);

                var objdomain = await Db.Domains.FindAsync(domain.Value);
                var allowTarifGuids = objdomain.TarifIds.ToGuids();

                var invoices = await Db.Tarifs
                    .Where(x => allowTarifGuids.Contains(x.Id))
                    .OrderBy(x => x.Price)
                    .Select(x => new
                    {
                        x.Id,
                        x.Commission,
                        MobComSum = invCommSum, // сумма мобильной комиссии
                        x.Description,
                        x.Months,
                        x.Name,
                        x.Price,
                        Totals = x.Price + invCommSum,
                    })
                    .ToListAsync();

                return Json(invoices);
            }
        }

        [HttpPost("recalc")]
        public async Task<IActionResult> RecalcInvoicesAsync(Guid? domain)
        {
            this.RequiresAuthentication();
            //this.RequiresAdmin();
            var user = this.CurUser();
            user.Require(Sys.Operations.DomainsEdit);

            if (domain == null)
                return Error("Не задан domain");

            var domain_obj = await Db.Domains
                .LoadWith(x => x.Tarif)
                .FindAsync(domain.Value);


            var qorders = Db.Orders
                .GetDomainObjects(domain)
                .WhereInvoices(false) // берем и нулевые для расчетов - см коммент https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/22994/
                .WherePeriod(PeriodType.Previos)  // | PeriodType.Debt пересчет только предыдущего периода https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/22996/
                .Select(x => new
                {
                    x.Id,
                    TotalSum = x.TotalOrder,
                    SphereId = x.Room.Base.SphereId,
                    x.Status,
                    x.HasPackage,
                });

            var orders_list = await qorders.ToListAsync();

            // открываем DataReader и пересчитываем тариф для каждого инвойса
            foreach (var order in orders_list)
            {
                var args = new TarifArgs
                {
                    Domain = domain_obj,
                    SphereId = order.SphereId,
                    Total = order.TotalSum,
                    Status = order.Status,
                    HasPackage = order.HasPackage,
                };
                var comm = Partners.TarifService.CalcCommission(args);
                //var comm = objDomain.CalcCommission(invoice.ShpereId ?? Guid.Empty, invoice.TotalSum, invoice.Status);
                await Db.Orders.Finds(order.Id)
                    //.Set(x => x.IgnoreMobComm, invoice.IgnoreMobComm)
                    .Set(x => x.MobComm, comm)
                    .UpdateAsync();
            }

            return Ok();
        }
    }

}
