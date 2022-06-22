using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Itall.Models;
using LinqToDB.Data;
using Itall;
using LinqToDB;
using System.ComponentModel;
using Microsoft.Extensions.Configuration;

namespace My.App.CRM
{
    /// <summary>
    /// Сервис создания баллов
    /// </summary>
    public class ReviewsService : DbService
    {
       
        /// <summary>
        /// Создание отзыва
        /// </summary>
        public async Task<Review> AddAsync(Guid orderId, Guid? groupId, string text, byte value)
        {
            // получаем информацию по ордеру
            //var ordobj = await Db.Orders
            //    .Where(o => o.Id == order)
            //    .Select(o => new
            //    {
            //        o.RoomId,
            //        o.Room.DomainId,
            //        o.ClientId,
            //    })
            //    .FirstOrDefaultAsync();

            // загружаем полностью бронь, чтобы отправить почтовое сообщение
            var order_obj = await Db.Orders
                .LoadWith(o => o.Room.Base.Sphere)
                .LoadWith(o => o.Client)
                .LoadWith(o => o.Room.Domain)
                .Where(o => o.Id == orderId)
                .FirstOrDefaultAsync();


            // отслеживаем уникальность добавления отзыва на комнату
            var exists = await Db.Reviews
                .Where(r => r.OwnerId == User.Id)
                .Where(r => r.RoomId == order_obj.RoomId)
                //.Select(m => new { m.Id, m.Text, m.Date })
                .AnyAsync();

            var msg = new Common.Message
            {
                Text = $"Добавлен отзыв (оценка {value}) {(exists ?"повторно" : "")}: {text}",
                Kind = Common.MessageKind.Review,
                OrderId = orderId,
                DomainId = order_obj.DomainId,
                Date = DateTime.Now,
                SenderId = User.Id,
                ClientId = order_obj.ClientId,
                Scope = ScopeType.Any,
                Status = (byte)ReviewStatus.New,
            };
            await Db.CreateInsertAsync(msg);

            await addReviewPoints( order_obj );

            if (exists) // если повтор - ничего не создаем
            {
                return null;
            }

            // если все ок, то добавляем отзыв
            var review = new Review
            {
                Text = text,
                GroupId = groupId,
                OrderId = orderId,
                Order = order_obj, // для отправки почты
                RoomId = order_obj.RoomId,
                DomainId = order_obj.DomainId,
                Date = DateTime.Now,
                Status = ReviewStatus.New, 
                OwnerId = User.Id,
                Value = value,
            };
            await Db.CreateInsertAsync(review);


            //var data = new
            //{
            //    Order = ordobj,
            //    ordobj.Room,
            //    ordobj.Room.Base,
            //    ordobj.Room.Base.Sphere,
            //    ordobj.Client,
            //    ordobj.Room.Domain,
            //    User = CurrentUser,
            //    Text = text,
            //};
            //App.AddMailTask2(data.Base.Email, data, Sys.TemplateKind.ReviewNew);

            addMailTask(review, text);

            return review;
        }

        /// <summary>
        /// Параметры обновления отзыва
        /// </summary>
        public class UpdateArgs
        {
            public Guid Id { get; set; }
            public string Text { get; set; }
            public Guid? Group { get; set; }
            public byte? Value { get; set; }
            public bool? Archive { get; set; }
        }

        /// <summary>
        /// Изменение параметра отзыва
        /// </summary>
        public async Task UpdateAsync(UpdateArgs args)  // Guid id, string text = null, Guid? group = null, byte? value = null, bool? archive = null)
        {
            // отслеживаем уникальность добавления отзыва на комнату
            var review = await Db.Reviews.Finds(args.Id)
                .Select(r => new 
                { 
                    r.Id, 
                    r.OrderId, 
                    r.Order.ClientId, 
                    r.Room.DomainId,
                    r.Status,
                })
                .FirstOrDefaultAsync();

            // отслеживаем уникальность добавления отзыва на комнату
            var qry = Db.Reviews.Finds(args.Id)
                .Set(r => r.Updated, DateTime.Now)
                .Set(r => r.Status, ReviewStatus.Changed)
                .SetIf(args.Text, r => r.Text)
                .SetIf(args.Group, r => r.GroupId)
                .SetIf(args.Value, r => r.Value)
                .SetIf(args.Archive, r => r.IsArchive);

            await qry.UpdateAsync();

            var msg = new Common.Message
            {
                Text = $"Изменен отзыв (оценка {args.Value}: {args.Text}",
                Kind = Common.MessageKind.Review,
                OrderId = review.OrderId,
                DomainId = review.DomainId,
                Date = DateTime.Now,
                SenderId = User?.Id,
                ClientId = review.ClientId,
                Scope = ScopeType.Any,
                Status = (byte)review.Status,
            };
            await Db.CreateInsertAsync(msg);
        }


        /// <summary>
        /// Ответ на отзыв
        /// </summary>
        public async Task ReplyAsync(Guid reviewId, string text, ReviewStatus new_status)
        {

            // отслеживаем уникальность добавления отзыва на комнату
            var qry = Db.Reviews
                .LoadWith(r => r.Order.Room.Base.Sphere)
                .LoadWith(r => r.Order.Room.Domain)
                .LoadWith(r => r.Order.Client)
                .Finds(reviewId);

            var rev = await qry
                .FirstOrDefaultAsync();

            var scope = ScopeType.Any;
            // пишем отзыв клиенту
            if (!string.IsNullOrWhiteSpace(text) && new_status == ReviewStatus.Ok)   // только для ОК ответов - см https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/38967/
            {
                //updqry = updqry
                //    .Set(r => r.Reply, text);
                scope = ScopeType.Private;   // добавляем приватную зону, чтобы отличать от других пересылок  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/38497/
            }

            // если все ок, то добавляем отзыв
            var msg = new Common.Message
            {
                Text = text,
                Kind = Common.MessageKind.Review,
                OrderId = rev.Order.Id,
                DomainId = rev.DomainId,
                Date = DateTime.Now,
                SenderId = User.Id,
                ClientId = rev.Order.ClientId,
                Scope = scope,
                Status = (byte)rev.Status, //  new_status,
            };
            await Db.CreateInsertAsync(msg);

            // изменяем статус
            rev.Status = new_status;
            var updqry = qry
                .Set(r => r.Status, new_status);

            await updqry
                .UpdateAsync();

            addMailTask( rev, text );
        }

        void addMailTask( Review rev, string text)
        {
            var ordobj = rev.Order;

            // добавляем инф по отзыву - https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/41031/ 
            var reply = Db.Messages
                .Where(m => m.OrderId == rev.OrderId)
                .Where(m => m.Kind == Common.MessageKind.Review)
                .Where(m => m.Scope == ScopeType.Private)
                .OrderByDescending(m => m.Date)
                .Select(m => new
                {
                    Date = (DateTime?)m.Date,
                    m.Text,
                    Sender = m.Sender.Name,
                })
                .FirstOrDefault();

            var data = new
            {
                Order = ordobj,
                ordobj.Room,
                ordobj.Room.Base,
                ordobj.Room.Base.Sphere,
                ordobj.Client,
                Domain = rev.Domain ?? ordobj.Room.Domain,
                User = User,
                Review = rev,
                Reply = reply ?? new { Date = (DateTime?)null, Text="", Sender=""},
                Text = text,
            };

            var send = ordobj.Client.CheckNotification(NotifyKind.Review);

            switch (rev.Status)
            {
                case ReviewStatus.Unknown:
                    break;

                case ReviewStatus.New:
                    App.AddDbMailJob(data.Base.Email, data, Db, rev.OrderId, Sys.TemplateKind.ReviewNew);
                    break;

                case ReviewStatus.Moderate:
                    //App.AddMailTask2(rev.DomainEmail, data, Sys.TemplateKind.Review???);
                    break;

                case ReviewStatus.Processed:
                    App.AddDbMailJob(data.Base.Email, data, Db, rev.OrderId, Sys.TemplateKind.ReviewProcessed);
                    break;

                case ReviewStatus.Ok:
                    if (send)
                    {
                        App.AddDbMailJob(data.Client.Email, data, Db, rev.OrderId, Sys.TemplateKind.ReviewOk);
                    }
                    break;

                case ReviewStatus.Cancel:
                    if (send)
                    {
                        App.AddDbMailJob(data.Client.Email, data, Db, rev.OrderId, Sys.TemplateKind.ReviewCancel);
                    }
                    break;

                default:
                    break;
            }
        }

        /// <summary>
        /// Начисление баллов за отзыв
        /// </summary>
        async Task<int> addReviewPoints(Orders.Order order)
        {

            // отслеживаем только первый отзыв по брони
            var exists = await Db.Reviews
                .Where(r => r.OwnerId == User.Id)
                .Where(r => r.OrderId == order.Id)
                //.Select(m => new { m.Id, m.Text, m.Date })
                .AnyAsync();
            if (exists) return 0;

            var limit = Configs.Get("reviews-limit")?.AsInt ?? 0;

            if (limit > 0)
            {
                // смотрим, сколько уникальных отзывов оставил данный пользователь
                var n_reviews = await Db.Reviews
                    .Where(r => r.OwnerId == User.Id)
                    //.Where(m => m.OrderId == ordobj.RoomId)
                    .Select(r => r.OrderId)
                    .Distinct()
                    .CountAsync();

                if (n_reviews >= limit)
                    return 0; // сигнализиурем об отсутствии начислений
            }

            // создаем начисление баллов
            var svc = new Fin.TransService { User = User, Db = Db };
            var points = Configs.Get("reviews-points")?.AsInt ?? 100;
            await svc.PointsReview(order, points);

            return points;
        }


    }
}

