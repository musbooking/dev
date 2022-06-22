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

namespace My.App.Partners
{
    //[Route("discounts")]
    public class DiscountsController : UpdateDbController<DiscountRule>
    {

        //public DiscountModule() : base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Updater<DiscountRule> updater)
        {
            base.OnUpdating(updater);

            updater.Set(x => x.Discount);
            updater.Set(x => x.IsArchive);
            updater.Set(x => x.Orders);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.DiscountRules.Reset();
        }


        [HttpGet("list")]
        public IActionResult GetList()
        {
            this.RequiresAuthentication();
            //RequiresShare();
            //this.CurUser().Require(Permission.Days);

            //using (var db = new AppDb())
            {
                var rules = DbCache.DiscountRules.Get().Values.AsQueryable()
                    .GetDomainObjects(this.CurUser()?.DomainId);

                var query = rules  // db.GetQuery<Models.Day>()
                    .Select(x => new
                    {
                        x.Id,
                        x.Discount,
                        x.IsArchive,
                        x.Orders,
                    });
                return Json(query.ToList());
            }
        }

    }


}
