using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Itall;
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Orders
{
    public class OrderRulesController : ListController<OrderRule>
    {

        protected override object OnUpdating(Updater<OrderRule> updater)
        {
            updater.Set(x => x.BaseId);
            updater.Set(x => x.Index);
            updater.Set(x => x.Sources);
            updater.Set(x => x.IsDefault);

            updater.Set(x => x.IfHours);
            updater.Set(x => x.IfKind);
            updater.Set(x => x.ThenHours);
            updater.Set(x => x.ThenKind);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.OrderRules.Reset();
            DbCache.OrderRulesAll.Reset();
        }


        [HttpGet("can-cancel-order")]
        public async Task<JsonResult> CanCancelOrderAsync(Guid order, DateTime? now)
        {
            var order_obj = await Db.Orders.Finds(order)
                .Select(o => new
                {
                    o.Room.BaseId,
                    o.Date,
                    o.DateFrom,
                    o.Status,
                    o.SourceType,
                    HasForfeits =  o.Part.Forfeit > 0,
                })
                .FirstAsync();

            if (order_obj.Status != OrderStatus.Reserv)
            {
                var res1 = new { Allow = false, };
                return Json(res1);
            }

            var args = new CanCancelArgs
            {
                Base = order_obj.BaseId,
                DateCreate = order_obj.Date,
                DateFrom = order_obj.DateFrom,
                Now = now,
                HasForfeits = order_obj.HasForfeits,
                Source = order_obj.SourceType,
            };
            var res = await CanCancelBase(args);

            return Json( res.Value );
        }


        [HttpGet("can-cancel-base")]
        public async Task<JsonResult> CanCancelBase( CanCancelArgs args ) //Guid? @base, DateTime dateCreate, DateTime dateFrom, DateTime? now = null, bool hasForfeits = false)
        {
            //this.RequiresAuthentication();
            //var user = this.CurUser();

            var svc = new OrderRuleService { Db = Db };
            var rules = await svc.FindRulesAsync(args);

            var rule = rules
                .FirstOrDefault();
            
            var res = new
            {
                Allow = rule != null,
                Rule = rule?.Name,
                CancelDate = rule?.MaxCancelDate(args.DateCreate, args.DateFrom),
                HasForfeits = args.HasForfeits, // только для удобства оформления
                rule?.Sources,
            };

            return Json(res);
        }


        [HttpGet("list")]
        public IActionResult GetList()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var groups = DbCache.OrderRulesAll.Get()
                .WhereIf(!user.IsSuper(), r => r.DomainId == user.DomainId)
                .WhereIf( user.IsSuper(), r=> r.IsDefault, r => !r.IsDefault) // если пользователь не суперадмин - то не показываем правила по умолчанию #54481
                .OrderBy(r => r.Index)
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    Description = r.Description + "",
                    r.IsArchive,
                    r.BaseId,
                    //Sources = r.Sources.ToEnums<SourceType>(),  -- убрал, чтобы не записывать array save
                    r.IsDefault,
                    r.Sources,  
                    r.Index,
                    r.IfKind,
                    r.IfHours,
                    r.ThenKind,
                    r.ThenHours,
                });

            var res = groups.ToList();
            return Json(res);
        }


        [HttpGet("names")]
        public IActionResult GetNames()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var query = DbCache.OrderRules.Get().AsQueryable()
                .GetDomainObjects(user.DomainId)
                .GetActuals()
                .OrderBy(x => x.Index)
                .Select(x => new
                {
                    x.Id,
                    Value = x.Name,
                });
            var list = query.ToList();
            return Json(list);
        }



        [HttpPost("reindex")]
        public async Task<IActionResult> ApplyIndexAsync(int start, [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] Guid[] ids)
        {
            await Db.OrderRules.ReindexAsync(start, ids);
            DbCache.OrderRules.Reset();

            return Ok();
        }
    }
}
