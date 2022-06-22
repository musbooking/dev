using Itall;
using Itall.App.Data;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using My.App.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My.App.Fin
{
    public class TransController : UpdateDbController<Transaction>
    {
        protected override object OnUpdating(Updater<Transaction> updater)
        {
            base.OnUpdating(updater);

            //updater.Set(x => x.Date);

            // выставляем приход - расход
            var ptotal = updater.Params["total"];
            if (!ptotal.IsEmpty())
            {
                var total = Int32.Parse(ptotal);
                updater.Set(x => x.Total, Math.Abs(total));
            }
            updater.Set(x => x.BaseId);
            updater.Set(x => x.ClientId);
            updater.Set(x => x.Date);

            updater.Set(x => x.Register);
            updater.Set(x => x.Operation);
            updater.Set(x => x.Details);

            updater.Set(x => x.DomainId);
            updater.Set(x => x.Text);
            //updater.Set(x => x.Total);

            return base.OnUpdating(updater);
        }




        /// <summary>
        /// Получение списка финансовых групп
        /// </summary>
        [HttpGet("groups")]
        public IActionResult GetGroupsAsync(int? level)
        {
            var list = Groups.ROWS.AsQueryable()
                .WhereIf(level != null, g => g.Lvl == level)
                .Select(g => new
                {
                    Id = g.Key,
                    Value = g.Name,
                })
                .ToList();
            return Json(list);
        }

        


        /// <summary>
        /// Статистика по броням
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync( TransHelper.SearchArgs args)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.AllBases);

            var qtrans = Db.Transactions.Search( args );
            var trans = await qtrans.ToListAsync();

            return Json( trans );
        }


        /// <summary>
        /// Функция поиска для проводок
        /// </summary>
        [HttpGet("search2")]
        public async Task<IActionResult> Search2Async(int page = 0, int limit = 100)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.AllBases);

            var args = new TransHelper.SearchArgs
            {
                Domain = user.DomainId,
                Page = page,
                Limit = limit,
            };
            var qtrans = Db.Transactions.Search(args);
            var trans = await qtrans.ToListAsync();

            return Json(trans);
        }

        /// <summary>
        /// Операции оплаты
        /// </summary>
        static int[] PAY_OPERS = new int[] { 
            Groups.OP_CLIENTS_PAYMENT_RUB.Key,
        };

        /// <summary>
        /// Статистика по броням 78267
        /// </summary>
        [HttpGet("search-payments")]
        public async Task<IActionResult> SearchPaysAsync( TransHelper.SearchArgs args)
        {
            this.RequiresAuthentication();

            var user = this.CurUser();
            var allow_all_bases = user.Allow(Sys.Operations.AllBases);
            var base_ids = user.BaseGuids();

            var qtrans = Db.Transactions
                .GetDomainObjects(user.DomainId)
                .Where(t => t.Register == Groups.REG_CLIENTS.Key)
                .Where(t => PAY_OPERS.Contains(t.Operation) )
                .WhereIf(!allow_all_bases, ab => base_ids.Contains(ab.BaseId.Value))
                .OrderBy(t => t.Date)
                .Search(args);

            var trans = await qtrans.ToListAsync();

            return Json( trans );
        }

        /// <summary>
        /// Статистика по броням
        /// </summary>
        [HttpGet("totals")]
        public async Task<IActionResult> TotalsAsync(
            DateTime? dfrom,
            DateTime? dto,

            int? register,

            Guid? domain
            )
        {
            this.RequiresAuthentication();
            dto = dto?.Date.AddDays(1);

            var qtrans1 = Db.Transactions
                .WhereIf(dfrom != null, t => t.Date >= dfrom)
                .WhereIf(dto != null, t => t.Date < dto)
                .WhereIf(register != null, t => t.Register == register)
                .WhereIf(domain != null, t => t.DomainId == domain);

            var cc = new System.Globalization.GregorianCalendar();
            var qtrans2 =
                from t in qtrans1
                let op = Groups.Dict[t.Operation]
                let det = Groups.Dict[t.Details] // может отсутствовать
                select new
                {
                    t.Id,
                    //t.Register,
                    //t.Operation,
                    //t.Details,
                    Register = Groups.Name( t.Register ),
                    Operation = Groups.Name( t.Operation ),
                    Details = Groups.Name( t.Details ),
                    t.Date.Year,
                    t.Date.Month,
                    t.Date.Day,
                    Week = cc.GetWeekOfYear(t.Date, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday),
                    WeekDate = t.Date.AddDays(1-(int)cc.GetDayOfWeek(t.Date)).ToString("MM-dd"),
                    WeekDay = t.Date.GetDayOfWeekRu(),
                    Client = t.Client.FirstName + " " + t.Client.LastName,
                    Domain = t.Domain.Name,
                    Sphere = t.Sphere.Name,
                    Base = t.Base.Name,
                    Room = t.Room.Name,
                    Promo = t.Promo.Name,
                    Total = t.Total * op.Sign * (det == null ? 1 : det.Sign),
                    //t.Text,
                };

            var trans = await qtrans2.ToListAsync();

            return Json(trans);
        }

    }
}



#region Misc

//DateTime? dfrom,
//DateTime? dto,

//int? register,
//int? operation,
//int? details,

//Guid? domain,
//Guid? sphere,
//Guid? client,
//Guid? order,
//[FromQuery(Name = "base")] Guid? baseid, // = Convert<Guid?>(args.@base);
//Guid? room, 
////[ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] SourceFilterKind[] sources,
////[ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] SourceType[] sourceTypes,
//[ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] eqtypes
//)

#endregion