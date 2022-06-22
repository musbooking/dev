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
using Itall;
using Microsoft.AspNetCore.Mvc;

namespace My.App.CRM
{
    /// <summary>
    /// Создание контроллера для горящих репетиций
    /// https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/41019/
    /// </summary>
    public class HotPromoController : PromoController
    {
        [HttpGet("list2")]
        public Task<IActionResult> GetHotListAsync()
        {
            return GetListAsync( PromoKind.Hot );
        }
    }


    //[Route("promo")]
    public class PromoController : UpdateDbController<Promotion>
    {
        //public PromoModule() : base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    Get["/", true] = GetNumItemsAsync;

        //    Get["/", true] = GetNamesAsync;

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Itall.App.Data.Updater<Promotion> updater)
        {
            base.OnUpdating(updater);

            string name = updater.Params["name"];
            if (updater.IsNew && string.IsNullOrWhiteSpace(name))
            {
                var codes = updater.Db.GetTable<Promotion>()
                    .Where(x => x.Type == PromoKind.Number)
                    .Where(x => x.Name.Length==6)
                    .Select(x=>x.Name)
                    .ToDictionaryAsync(x => x, x => x)
                    .Result;
                do
                {
                    name = new Random(DateTime.Now.Millisecond).Next(100001, 999999).ToString();
                    if (!codes.ContainsKey(name))
                        break;
                    //name = Itall.String2.CreatePassword(4);
                } while (true);
            }
            updater.Set(x => x.Name, name);
            updater.Set(x => x.IsArchive);
            updater.Set(x => x.Discount);
            updater.Set(x => x.DiscountSum);
            updater.Set(x => x.EqDiscount);
            updater.Set(x => x.Description);
            updater.Set(x => x.IsIgnoreEquipment);
            updater.Set(x => x.MinHours);
            updater.Set(x => x.IsOverride);

            //updater.Set(x => x.IsAction);
            updater.Set(x => x.Type);
            updater.Set(x => x.ClientDiscountKind);
            updater.Set(x => x.EqClientDiscountKind);
            updater.Set(x => x.DayKinds);
            updater.Set(x => x.Hours);
            //updater.Set(x => x.IsFixHours);
            //updater.Set(x => x.GroupKinds);
            updater.Set(x => x.Options);
            updater.Set(x => x.Range1);
            updater.Set(x => x.Range2);
            updater.Set(x => x.AllowBaseIds);
            updater.Set(x => x.AllowRoomIds);
            updater.Set(x => x.IsToday);
            updater.Set(x => x.DateFrom);
            updater.Set(x => x.DateTo);

            updater.Set(x => x.AllowDomainIds);
            updater.Set(x => x.MaxOrders);
            updater.Set(x => x.MaxClientOrders);

            var obj = updater.Object;

            return new { obj.Id, obj.Name };
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Promotions.Reset();
        }



        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(PromoKind? type = PromoKind.Action)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.Promo);

            //PromoKind type = Convert<PromoKind>(this.Request.Query.type);

            var query = Db.Promotions
                .Where(p => p.DomainId == user.DomainId)
                //.Where(x=>x.Type == null || x.Type==PromoType.List)
                .Where(p => p.Type == type)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    Description = p.Description + "",
                    p.Discount,
                    p.DiscountSum,
                    p.EqDiscount,
                    p.IsArchive,
                    //x.IsAction,
                    p.IsIgnoreEquipment,
                    p.IsOverride,
                    p.ClientDiscountKind,
                    p.EqClientDiscountKind,
                    p.DateFrom,
                    p.DateTo,
                    p.DayKinds,
                    p.MinHours,
                    //x.GroupKinds,
                    p.Options,
                    p.Range1,
                    p.Range2,
                    p.AllowBaseIds,
                    p.AllowRoomIds,
                    p.Hours,
                    p.Type,
                    //x.IsFixHours,
                    p.IsToday,
                });

                var list = await query.ToListAsync();

                return Json( list );
        }

        [HttpGet("numItems")]
        public async Task<IActionResult> GetNumItemsAsync()
        {
            this.RequiresAuthentication();
            this.RequiresAdmin();

            //using (var Db = new DbConnection())
            {
                var query = Db.Promotions
                    .Where(p => p.Type == PromoKind.Number)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        Description = p.Description + "",
                        p.Discount,
                        p.DiscountSum,
                        p.IsArchive,
                        p.IsIgnoreEquipment, 
                        p.MinHours,
                        p.IsOverride,
                        p.IsToday,

                        p.AllowDomainIds,
                        p.AllowBaseIds,
                        p.AllowRoomIds,

                        p.MaxOrders,
                        p.MaxClientOrders,
                    });

                var list = await query.ToListAsync();

                return Json(list);
            }
        }

        [HttpGet("names")]
        public async Task<IActionResult> GetNamesAsync(
            bool actuals,
            PromoKind? type
            )
        {
            this.RequiresAuthentication(); 

            var query = Db.Promotions
                .GetDomainObjects(this.CurUser()?.DomainId)
                .GetActuals(actuals)
                .WhereIf(type.HasValue, x => x.Type == type)
                .OrderBy(x => x.Name)
                .Select(x => new
                {
                    id = x.Id,
                    //value = $"{x.Name}, {x.Discount}% {(x.IsArchive ? " (x) " : " ")} {(x.IsIgnoreEquipment ? "без доп" : "")} {(x.IsAction ? "акц" : "")} {x.Description} ",
                    value = $"{x.Name}, {x.Discount}% + {x.DiscountSum} р + {x.EqDiscount}% ({x.Description}) ",
                });
                
            var list = await query.ToListAsync();
            return Json(list);
        }
       
    }
}
