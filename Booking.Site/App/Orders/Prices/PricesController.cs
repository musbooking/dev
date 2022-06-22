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
using Microsoft.AspNetCore.Mvc;

namespace My.App.Orders
{
    //[Route("prices")]
    public class PricesController : UpdateDbController<Price>
    {
        //public PricesModule() : base("/")
        //{
        //    Get["/", true] = GetListAsync;

        //    Get["/", true] = GetBaseItemsAsync;

        //    //Get["/", true] = GetObjectAsync;

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Itall.App.Data.Updater<Price> updater)
        {
            base.OnUpdating(updater);

            updater.Set(x => x.Description);
            updater.Set(x => x.RoomId);
            updater.Set(x => x.TimeFrom);
            updater.Set(x => x.TimeTo);
            updater.Set(x => x.Weekend1Price);
            updater.Set(x => x.Weekend2Price);
            updater.Set(x => x.WorkingPrice);
            updater.Set(x => x.WorkingFPrice);
            updater.Set(x => x.WorkingLPrice);
            updater.Set(x => x.BaseId);
            updater.Set(x => x.IsArchive);
            updater.Set(x => x.PromoId);
            updater.Set(x => x.DateFrom);
            updater.Set(x => x.DateTo);

            var obj = updater.Object;
            if(obj.RoomId!=null && obj.BaseId == null)
            {
                var room = updater.Db.FindAsync<Room>(obj.RoomId.Value).Result;
                updater.Set(x => x.BaseId, room.BaseId);
            }

            return new { obj.Id, obj.BaseId }; //Bind(updater.Object);
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.Prices.Reset();
        }



        /// <summary>
        /// Получение всех цен для комнтаты
        /// </summary>
        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(
            [FromQuery(Name = "room")] Guid? roomId,
            [FromQuery(Name = "base")] Guid? baseId
            )
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.Promo);

            var qprices = Db.Prices //PricesModule.Prices.Get().AsQueryable() - нельзя, тк есть архивные
                .OrderBy(x => x.Base.Name)
                .ThenBy(x => x.Room.Name)
                .ThenBy(x => x.TimeFrom)
                .Where(p => p.DomainId == user.DomainId)
                .WhereIf( roomId, x => x.RoomId == roomId)
                .WhereIf(baseId, x => x.BaseId == baseId);

            var resquery = qprices
                .Select(x => new
                {
                    x.Id,
                    Description = x.Description + "",
                    x.RoomId,
                    x.TimeFrom,
                    x.TimeTo,
                    x.Weekend1Price,
                    x.Weekend2Price,
                    x.WorkingPrice,
                    x.WorkingFPrice,
                    x.WorkingLPrice,
                    x.BaseId,
                    x.IsArchive,
                    x.PromoId,
                    x.DateFrom,
                    x.DateTo,
                });

            var list = await resquery.ToListAsync();
            return Json(list);
        }

        /// <summary>
        /// Получение всех цен для базы
        /// Используется для проверки возмоюности бронирования
        /// </summary>
        [HttpGet("baseItems")]
        public IActionResult GetBaseItems(
            [FromQuery(Name = "base")]Guid baseId
            )
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            //Guid baseId = this.Request.Query.@base;

            //using (var db = new AppDb())
            {
                var query = DbCache.Prices.Get().AsQueryable()
                    .GetDomainObjects(user?.DomainId)
                    .Where(x => x.Room.BaseId == baseId)
                    .Select(x => new
                    {
                        x.Id,
                        x.BaseId,
                        x.RoomId,
                        x.TimeFrom,
                        x.TimeTo,
                        x.Weekend1Price,
                        x.Weekend2Price,
                        x.WorkingPrice,
                        x.WorkingFPrice,
                        x.WorkingLPrice,
                        x.PromoId,
                        x.IsArchive,
                        x.DateFrom,
                        x.DateTo,
                    });
                return Json(query.ToList());
            }
        }

        //[Route("get/{id}")]
        // public async Task<IActionResult> GetObjectAsync()
        //{
        //    Guid id = p.id;
        //    using (var db = new AppDb())
        //    {
        //        var obj = await db.Prices
        //            .GetDomainObjects(this.CurUser()?.DomainId).FindAsync(id);

        //        return Json(new
        //        {
        //            obj.Id,
        //            obj.BaseId,
        //            obj.RoomId,
        //            obj.TimeFrom,
        //            obj.TimeTo,
        //            obj.WeekendPrice,
        //            obj.WorkingPrice,
        //            obj.PromoId,
        //            obj.IsArchive,
        //        });
        //    }
        //}


    }
}