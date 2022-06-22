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

namespace My.App.Fin
{
    //[Route("")]
    public class DocsController : UpdateDbController<Document>
    {

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(
            Guid? client,
            DateTime? dfrom,
            DateTime? dto
            )
        {
            this.RequiresAuthentication();
            if (client == null)
                throw new UserException("Не задан клиент");


            var domainId = this.CurUser()?.DomainId;
            dfrom = dfrom?.ToMidnight();
            dto = dto?.ToMidnight(1);

            var abonements = Db.Abonements
                .GetDomainObjects(domainId)
                .OrderBy(x => x.DateFrom)
                .Where(x => x.ClientId == client)
                .WhereIf(dfrom != null, x => x.DateFrom >= dfrom)   // 81549
                .WhereIf(dto != null, x => x.DateFrom < dto)
                .Select(x => new
                {
                    Type = "abonement",
                    x.Id,
                    Date = x.DateFrom,
                    Total = x.TotalPrice,
                    Text = x.Description + "",
                    IsHold = false,
                    ClientComment = "",
                    Status = Orders.OrderStatus.Unknown,
                    Forfeit = 0,
                    PayDate = (DateTime?)null,

                    x.RoomId,
                    Room = x.Room.Name,
                    x.Room.BaseId,
                    Base = x.Room.Base.Name,
                });

            var orders = Db.Orders
                .GetDomainObjects(domainId)
                .Where(x => x.ClientId == client)
                .WhereIf( dfrom != null, x => x.Date >= dfrom)
                .WhereIf( dto != null, x => x.Date < dto)
                .OrderBy(x => x.DateFrom)
                .Select(o => new
                {
                    Type = "order",
                    o.Id,
                    Date = o.DateFrom,
                    Total = o.GetTotalSum(), // o.TotalOrder + o.Part.Forfeit + o.PaidForfeit,
                    Text = o.Comment + "",
                    IsHold = o.IsHold(),
                    ClientComment = o.ClientComment + "",
                    o.Status,
                    Forfeit = o.PaidForfeit + o.CancelForfeit,   // ForfeitSum
                    o.PayDate,

                    o.RoomId,
                    Room = o.Room.Name,
                    o.Room.BaseId,
                    Base = o.Room.Base.Name,
                });

            var listAb = await abonements.ToArrayAsync();
            var listOrders = await orders.ToListAsync();
            var list = listAb.Union(listOrders);

            return Json(list);
            
        }


       

    }


}
