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

namespace My.App.CRM
{
    public class PointsController : UpdateDbController<Point>
    {
        protected override object OnUpdating(Updater<Point> updater)
        {
            base.OnUpdating(updater);

            updater.Set(x => x.Date);
            updater.Set(x => x.Description);
            updater.Set(x => x.Kind);

            // выставляем приход - расход
            var prih = Int32.Parse("0"+ updater.Params["prih"]);
            var rash = Int32.Parse("0" + updater.Params["rash"]);
            updater.Set(x => x.Count, prih-rash);
            //updater.Set(x => x.Count);

            // вычисляем userid
            var client = updater.Params["client"].ToString();
            if (updater.Object.UserId == null && !string.IsNullOrWhiteSpace(client))
            {
                var clientid = Guid.Parse(client);
                var userid = Db.Users
                    .Where(u => u.ClientId == clientid)
                    .Select(u => (Guid?)u.Id)
                    .FirstOrDefault();

                if (userid != null)
                {
                    updater.Set(x => x.UserId, userid);
                }
            }

            return base.OnUpdating(updater);
        }


        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(Guid? client, Guid? user)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var qry = Db.Points.AsQueryable();

            if (client != null)
                qry = qry.Where(p => p.User.ClientId == client);
            else if (user != null)
                qry = qry.Where(p => p.UserId == user);
            else
                qry = qry.Where(p => p.UserId == curuser.Id);

            var list = await qry
                .ToListAsync();

            var list2 =
                from p in list
                let sign = __old__PointsService.POINTS_RASHOD.Contains(p.Kind) ? -1 : 1
                let Zcount = p.Count * sign
                select new
                {
                    p.Id,
                    p.Date,
                    p.Count,
                    Zcount,
                    Prih = sign > 0 ?p.Count :0,
                    Rash = sign < 0 ?p.Count : 0,
                    p.Description,
                    p.Kind,
                };

            var res = list2 
                .OrderByDescending(p => p.Date)
                .ToList();

            return Json(res);
        }

      

    }


}
