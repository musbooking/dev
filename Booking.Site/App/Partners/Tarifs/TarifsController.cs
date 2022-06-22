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
    //[Route("tarifs")]
    public class TarifsController : ListController<Tarif>
    {

        //public TarifsModule() : base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    Get["/", true] = GetNamesAsync;

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Updater<Tarif> updater)
        {
            base.OnUpdating(updater);

            this.RequiresShare();

            //updater.Set(x => x.Description);
            //updater.Set(x => x.IsArchive);
            //updater.Set(x => x.Name);
            updater.Set(x => x.Price);
            updater.Set(x => x.Price1);
            updater.Set(x => x.Months);
            updater.Set(x => x.Commission);
            updater.Set(x => x.PayCommission);
            updater.Set(x => x.SphereIds);
            updater.Set(x => x.TarifIds);
            updater.Set(x => x.DestKind);

            base.OnUpdating(updater);

            return new
            {
                updater.Object.Id,
                updater.Object.HasTarifs,
            };
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Tarifs.Reset();
        }


        [HttpGet("list")]
        public IActionResult GetList()
        {
            this.RequiresAuthentication();
            this.RequiresShare();

            var query = DbCache.Tarifs.Get().Values  // db.GetQuery<Models.Day>()
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.IsArchive,
                    x.Price,
                    x.Price1,
                    x.Commission,
                    x.PayCommission,
                    x.Months,
                    x.SphereIds,
                    x.TarifIds,
                    x.HasTarifs,
                    x.DestKind,
                    //x.IsPayment,
                });
            return Json(query.ToList());
        }


        [HttpGet("names")]
        public IActionResult GetNames()
        {
            var query = DbCache.Tarifs.Get().Values
                .OrderBy(x=>x.Price)
                .Select(x => new
                {
                    id = x.Id,
                    value = x.ToString(),
                });
				
            return Json(query.ToList());
        }

    }


}
