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

namespace My.App.Common
{
    public class MessagesController : UpdateDbController<Message>
    {

        protected override object OnUpdating(Updater<Message> updater)
        {
            base.OnUpdating(updater);

            var obj = updater.Object;
            if (updater.IsNew)
            {
                obj.Kind = MessageKind.User;
                obj.SenderId = this.CurUser()?.Id;
                obj.Date = DateTime.Now;
            }

            updater.Set(x => x.ClientId);
            updater.Set(x => x.OrderId);
            updater.Set(x => x.AbonementId);
            updater.Set(x => x.Text);
            updater.Set(x => x.Scope);
            updater.Set(x => x.ExpenseId);

            return new { obj.Id, obj.Text, obj.SenderId, Sender = this.CurUser()?.FIO };
        }

        protected override void OnDeleting(Guid id, DataConnection db)
        {
            var msg = db.Find<Message>(id);
            var curuser = this.CurUser();
            if (msg.SenderId != curuser.Id || msg.Kind!=MessageKind.User)
                throw new UserException("Нельзя удалять чужие сообщения");
            base.OnDeleting(id, db);
        }

        static readonly MessageKind[] KINDS = 
        {
            MessageKind.User,
            MessageKind.System,
            MessageKind.Review,
            MessageKind.Job,
        };

        /// <summary>
        /// Добавление в историю лога
        /// </summary>
        [HttpPost("log")]
        public async Task<IActionResult> AddLogAsync( MessageKind kind,  Guid? id, string text = null)
        {
            var user = this.CurUser();

            var msg = new Message
            {
                Date = DateTime.Now,
                Kind = kind,
                ObjectId = id,
                SenderId = user?.Id,
                Text = text,
                ClientId = user?.ClientId,
                Scope = ScopeType.Zone,
            };
            await Db.CreateInsertAsync(msg);
            return Ok();
        }
        
        
        [HttpGet("reviews")]
        [HttpGet("review-list")]
        public Task<IActionResult> GetReviewsListAsync(Guid? order)
        {
            return GetListAsync(order: order, kind: MessageKind.Review, desc: false );
        }


        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(
            Guid? client = null,
            Guid? order = null,
            Guid? abonement = null,
            Guid? expense = null,
            MessageKind? kind = null,
            bool desc = false // по умолчанию сортируем в прямом порядке
            )
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var query = Db.Messages
                //.LoadWith(m => m.Sender)
                //.LoadWith(m => m.Client)
                .Where(x => KINDS.Contains(x.Kind))
                //  || x.Kind == MessageKind.Error) ошибки не показываем: https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/16548/ 
                .Where(x =>
                    //x.Scope == null ||
                    x.Scope == ScopeType.Any ||
                    x.Scope == ScopeType.Zone && (x.DomainId == user.DomainId || x.DomainId == null) ||
                    x.Scope == ScopeType.Private && x.SenderId == user.Id
                    )
                .WhereIf(client!= null && order== null, x => x.ClientId == client && x.OrderId == null)
                .WhereIf(client != null && order != null, x => x.ClientId == client)
                .WhereIf(expense!= null, x => x.ExpenseId == expense)
                .WhereIf(abonement!= null, x => x.AbonementId == abonement)
                .WhereIf(order!= null, x => x.OrderId == order)
                .WhereIf(kind!= null, x => x.Kind == kind);

            query = desc 
                ?query.OrderByDescending(x => x.Date) 
                :query.OrderBy(x => x.Date);

            var query1 = 
                from m in query
                let login = Db.Users
                    .Where(u=>u.ClientId == m.ClientId)
                    .Select(u=>u.Login)
                    .FirstOrDefault()
                //orderby x.Date descending
                select new
                {
                    m.Id,
                    m.Date,
                    m.Text,
                    m.SenderId,
                    m.Scope,
                    m.Status,
#if DEBUG
                    m.Sender.Roles,
#endif
                    Kind = m.SenderId != null ? m.Sender.GetKind() : Sys.UserKind.Customer,

                    Sender = m.DomainId != null 
                        ? m.Domain.Name + (m.DomainId == user.DomainId ? " (" + m.Sender.Login + ")" :"")
                        //: "(система)", // x.Sender.FIO,
                        : m.Sender.Login ?? login, //m.Client.FirstName + " " + m.Client.LastName,  // https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/37139/
                };
                
            var res = await query1.ToListAsync();

            return Json(res);
        }






    }


}



#region Misc
        ///// <summary>
        ///// Получение истории отзывов 
        ///// </summary>
        //[HttpGet("reviews")]
        //public async Task<IActionResult> GetReviewsAsync(Guid order)
        //{
        //    this.RequiresAuthentication();
        //    var curuser = this.CurUser();

        //    var qry = Db.Messages
        //        .Where(m => m.Kind == MessageKind.Review)
        //        .Where(m => m.OrderId == order);

        //    var list = await qry
        //        .Select(m => new
        //        {
        //            m.Id,
        //            m.Date,
        //            m.Text,
        //            m.SenderId,
        //            m.Scope,
        //            Sender = m.DomainId != null
        //                ? m.Domain.Name +
        //                    (m.DomainId == curuser.DomainId ? " (" + m.Sender.Login + ")" : "")
        //                    : "(система)", 
        //        })
        //        .Take(500)
        //        .ToListAsync();

        //    return Json(list);
        //}

#endregion