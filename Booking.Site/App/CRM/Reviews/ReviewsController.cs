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
using System.Diagnostics.CodeAnalysis;

namespace My.App.CRM
{
    public class ReviewsController : DbController
    {
        ///// <summary>
        ///// Получение списка задач для модерации
        ///// </summary>
        //[HttpGet("list-all")]
        //public Task<IActionResult> GetListAllAsync(DateTime? date, ReviewStatus? status)
        //{
        //    return GetListAsync(date, status, true);
        //}


        /// <summary>
        /// Получение списка отзывов с определенным статусом
        /// </summary>
        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(
            DateTime? date1, 
            DateTime? date2,
            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] ReviewStatus[] statuses, 
            bool all = false )
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var qry = Db.Reviews
                .GetActuals();

            if (!all) // если только по текущему домену
                qry = qry.GetDomainObjects(curuser.DomainId);
            else if (all)
                curuser.Require(Sys.Operations.DomainsAll);

            if (statuses?.Length > 0) // статус
            {
                qry = qry.Where(m => statuses.Contains( m.Status) );
            }

            if (date1 != null) // до указанной даты
            {
                var d1 = date1.Value.ToMidnight();
                qry = qry.Where(m => m.Date >= d1);
            }
            if (date2 != null) // до указанной даты
            {
                var d2 = date2.Value.ToMidnight(1);
                qry = qry.Where(m => m.Date <= d2);
            }

            var list = await qry
                .Select(r => new
                {
                    r.Id,
                    r.Order.ClientId,
                    Client = r.Order.Client.FirstName + " " + r.Order.Client.LastName,
                    r.Room.DomainId,
                    Domain = r.Room.Domain.Name,
                    r.Room.BaseId,
                    Base = r.Room.Base.Name,
                    r.RoomId,
                    Room = r.Room.Name,
                    r.Date,
                    r.OrderId,
                    r.Order.DateFrom,
                    r.GroupId,
                    status = r.Order.Status,
                    rstatus = r.Status, // чтобы на клиенте обработать стандартно OrderStatus
                    r.Value,
                    r.Text,
                })
                //.Take(100)   убрано согласно 61997
                .ToListAsync();

            return Json(list);
        }

        //class MsgComparer : IEqualityComparer<Common.Message>
        //{
        //    public int GetHashCode(Common.Message m)
        //    {
        //        return m.Id.GetHashCode();
        //    }

        //    public bool Equals(Common.Message x, Common.Message y)
        //    {
        //        if (x.OrderId == y.OrderId &&
        //            x.Kind == y.Kind &&
        //            x.Scope == y.Scope) return true;
        //        return false;
        //    }
        //}


        /// <summary>
        /// Объединенный доступ 
        /// </summary>
        [HttpGet("list-room")]
        [HttpGet("list-base")]
        public async Task<IActionResult> GetRoomBaseListAsync(Guid? room, Guid? @base)
        {
            var qreviews0 = Db.Reviews
                .GetActuals()
                .WhereIf(room != null, r => r.RoomId == room)
                .WhereIf(@base != null, r => r.Room.BaseId == @base)
                .WhereIf(@base == null && room == null, r => r.Id == null);  // add empty query


            var qmessages = Db.Messages
                //.Where(m => m.OrderId == r.OrderId)
                //.Where(m => m.SenderId != r.OwnerId)
                .Where(m => m.Kind == Common.MessageKind.Review)
                .Where(m => m.Scope == ScopeType.Private)
                .OrderByDescending(m => m.Date);
                //.Distinct(new MsgComparer());
                //.GroupBy(x => x.OrderId)
                //.Select(g => g.First());
                //.Select(m => new
                // {
                //     m.OrderId,
                //     m.SenderId,
                //     m.Date,
                //     m.Text,
                //     Sender = m.Sender.Name ?? m.Sender.Login,
                // });

            var qreviews = 
                from r in qreviews0

                //join m in qmessages on r.OrderId equals m.OrderId  into messages
                //from reply in messages.DefaultIfEmpty()

                from reply in qmessages
                    .Where(m => m.OrderId == r.OrderId)
                    .Where(m => m.SenderId != r.OwnerId)
                    .Select(m => new 
                    { 
                        m.Date, 
                        m.Text, 
                        Sender = m.Sender.Name ?? m.Sender.Login, 
                    })
                    .DefaultIfEmpty()

                orderby r.Date descending

                let cl = r.Order.Client
                select  new
                {
                    r.Id,
                    cl.PhotoUrl,
                    r.RoomId,
                    //Fio = cl.GetFio(),
                    Name = cl.FirstName, // " отдаем только имя {cl.LastName} {cl.FirstName} {cl.SurName}", https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/40257/
                    r.Date,
                    r.Text,
                    r.Order.Status,
                    r.Value,
                    rstatus = r.Status,
                    Reply = reply,
                    r.OrderId,
                };

            var reviews = await qreviews.ToListAsync();

            //var hash = new Dictionary<Guid, Guid>();
            //bool contains(Guid id)
            //{
            //    if (id == null) return false;
            //    if (hash.ContainsKey(id)) return true;
            //    hash[id] = id;
            //    return false;
            //}

            //var reviews1 = reviews.Where(r => !contains(r.Id)).ToList();
            //var reviews1 = reviews.Distinct( r => !contains(r.Id)).ToList();
            //var reviews1 = reviews.Distinct2((r1,r2) => r1.Id==r2.Id, r=>r.Id.GetHashCode() ).ToList();
            var reviews1 = reviews.Distinct2(r => r.Id).ToList();

            return Json(reviews1);
        }



        [HttpGet("my")]
        public async Task<IActionResult> GetMyListAsync()
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();

            var qry = Db.Reviews
                .GetActuals()
                .Where(r => r.OwnerId == curuser.Id);

            var qlist =
                from r in qry
                let reply = Db.Messages
                    .Where(m => m.OrderId == r.OrderId)
                    .Where(m => m.SenderId != r.OwnerId)
                    .Where(m => m.Kind == Common.MessageKind.Review)
                    .Where(m => m.Scope == ScopeType.Private)
                    .OrderByDescending(m => m.Date)
                    .Select(m => new
                    {
                        m.Date,
                        m.Text,
                        Sender = m.Sender.Name ?? m.Sender.Login,
                    })
                select new
                {
                    r.Id,
                    r.Room.DomainId,
                    Domain = r.Room.Domain.Name,
                    r.Room.BaseId,
                    Base = r.Room.Base.Name,
                    r.RoomId,
                    Room = r.Room.Name,
                    r.Date,
                    r.OrderId,
                    r.Order.DateFrom,
                    r.GroupId,
                    status = r.Order.Status,
                    rstatus = r.Status, // чтобы на клиенте обработать стандартно OrderStatus
                    r.Value,
                    r.Text,
                    Reply = reply.FirstOrDefault(),
                    //r.Reply,
                };

            var list = await qlist.ToListAsync();

            return Json(list);
        }

        public class Args
        {
            public string Text { get; set; }
            public Guid? Group { get; set; }
            public Guid Order { get; set; }
            public byte Value { get; set; }
        }


        /// <summary>
        /// Добавление отзыва на комнату
        /// </summary>
        [HttpPost("add1")]
        public async Task<IActionResult> Add1Async([FromBody]Args args)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            var svc = new ReviewsService
            {
                Db = Db,
                User = user,
            };
            var review = await svc.AddAsync(args.Order, args.Group, args.Text, args.Value);

            return Json(new { Result = (review != null), });
        }

        /// <summary>
        /// Добавление отзыва на комнату - query params
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddAsync(string text, Guid? group, Guid order, byte value)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            var svc = new ReviewsService
            {
                Db = Db,
                User = user,
            };
            var review = await svc.AddAsync(order, group, text, value);

            return Json(new { Result = (review != null), });
        }


        /// <summary>
        /// Сохранение параметра отзыва
        /// </summary>
        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync( ReviewsService.UpdateArgs args )   // Guid id, string text, Guid? group, byte? value, bool? archive
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var svc = new ReviewsService
            {
                Db = Db,
                User = user,
            };

            await svc.UpdateAsync(args);

            return Ok();
        }

       


        /// <summary>
        /// Добавление ответа
        /// </summary>
        [HttpPost("reply")]
        public async Task<IActionResult> ReplyAsync(Guid review, string text, ReviewStatus status)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            var svc = new ReviewsService
            {
                Db = Db,
                User = user,
            };
            await svc.ReplyAsync(review, text, status);

            return Ok();
        }


    }
}
