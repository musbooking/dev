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
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.CRM
{
    public class FavoritesController : DbController
    {
        /// <summary>
        /// Получаем список избранного по пользователю
        /// </summary>
        /// <returns></returns>
        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(Guid? client, Guid? user)
        {
            this.RequiresAuthentication();

            var qry0 = Db.Favorites.AsQueryable();

            if (client != null)
            {
                qry0 = qry0.Where(f => f.Owner.ClientId == client);
            }
            else
            {
                user = user ?? this.CurUser().Id;
                qry0 = qry0.Where(f => f.OwnerId == user);
            }

            var qry =
                from f in qry0
                orderby f.Updated descending
                select new
                {
                    f.Id,
                    f.Room.DomainId,
                    Domain = f.Room.Domain.Name,
                    f.RoomId,
                    Room = f.Room.Name,
                    f.Room.BaseId,
                    Base = f.Room.Base.Name,
                    f.DateAdded,
                    f.DateRemoved,
                    f.IsArchive,
                };
            var list = await qry.ToListAsync();

            return Json(list);
        }



        //[HttpGet("my")]
        //public async Task<IActionResult> GetMyListAsync()
        //{
        //    this.RequiresAuthentication();
        //    var curuser = this.CurUser();

        //    var qry = Db.Favorites
        //        .GetActuals()
        //        .Where(r => r.OwnerId == curuser.Id);

        //    var list = await qry
        //        .Select(r => new
        //        {
        //            r.Id,
        //            r.Room.DomainId,
        //            Domain = r.Room.Domain.Name,
        //            r.Room.BaseId,
        //            Base = r.Room.Base.Name,
        //            r.RoomId,
        //            Room = r.Room.Name,
        //            r.DateAdded,
        //            //r.DateRemoved, - она все равно не видна
        //        })
        //        .ToListAsync();

        //    return Json(list);
        //}



        /// <summary>
        /// Добавление в избранное
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddAsync(Guid room)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var qry = Db.Favorites
                .GetActuals()
                .Where(f => f.RoomId == room)
                .Where(f => f.OwnerId == user.Id);

            var last = await qry
                .Select(f => new { f.Id })
                .FirstOrDefaultAsync();

            if (last == null)
            {
                // добавляем новый
                var fav = new Favorite
                {
                    OwnerId = user.Id,
                    RoomId = room,
                    DateAdded = DateTime.Now,
                };
                await Db.CreateInsertAsync(fav);
            }
            else  // иначе обновляем дату
            {
                var res = await qry
                    .Set(f => f.DateAdded, DateTime.Now)
                    .Set(f => f.Updated, DateTime.Now)
                    .UpdateAsync();
            }

            return Ok();
        }

        /// <summary>
        /// Удаляем из избранного
        /// </summary>
        [HttpPost("remove")]
        public async Task<IActionResult> RemoveAsync(Guid room)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var res = await Db.Favorites
                .Where(f => f.RoomId == room)
                .Where(f => f.OwnerId == user.Id)
                .Set(f => f.IsArchive, true)
                .Set(f => f.DateRemoved, DateTime.Now)
                .Set(f => f.Updated, DateTime.Now)
                .UpdateAsync();

            return Ok(res);
        }

    }
}
