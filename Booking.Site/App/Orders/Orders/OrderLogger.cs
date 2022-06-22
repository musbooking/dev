using Itall;
using LinqToDB;
using Microsoft.Extensions.Logging;
using My.App.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Orders
{
    /// <summary>
    /// Сервис для логирования изменений
    /// </summary>
    public class OrderLogger : DbService
    {
        /// <summary>
        /// Логирование изменений в серию Messages
        /// </summary>
        public void LogChanges(Itall.App.Data.Updater<Order> updater)
        {
            var obj = updater.Object;
            var parms = updater.Params;
        //}

        //public void LogChanges(Order obj, Microsoft.AspNetCore.Http.IFormCollection parms)
        //{
            OnChangeItems(obj, parms["itemsJson"]);
            OnChangeOptions(obj, parms["Options"]);

            var changes = SysUtils.GetChangesText(updater);
            if (!string.IsNullOrWhiteSpace(changes))
            {
                addMsg(obj.Id, changes);
            }

            OnChangePromo(obj, parms["PromoId"]);
        }

        /// <summary>
        /// Отслеживание изменений Promo
        /// </summary>
        private void OnChangePromo(Order obj, string spromo)
        {
            if (obj.IsNew()) return;// только для сушествующего

            //var obj = updater.Object;

            // Отслеживаем изменение промокода
            //string spromo = updater.Params["PromoId"];
            CRM.Promotion promo = null;
            if (!string.IsNullOrWhiteSpace(spromo))
                promo = Db.Promotions.FindAsync(Guid.Parse(spromo)).Result;

            if (obj.PromoId != promo?.Id && spromo != null)  // #58963 отсекаем дополнительную пересылку пустого запроса  
            {
                if (promo != null)
                    addMsg(obj.Id, "Выставлен промокод: " + promo.ToString());
                else
                    addMsg(obj.Id, "Убран промокод");
            }
        }


        /// <summary>
        /// Отслеживание изменений Опций
        /// </summary>
        private void OnChangeOptions(Order obj, string opt)
        {
            //var obj = updater.Object;
            // Отслеживаем изменения опций
            //string opt = updater.Params["Options"];
            if (!obj.IsNew() && obj.Options != opt && opt != null)   // доп.проверяем - а передается ли вообще options - 55479 
            {
                var ids0 = obj.Options.ToGuids();
                var ids1 = opt.ToGuids();
                var added = ids1.Except(ids0);
                var removed = ids0.Except(ids1);

                var dict = DbCache.Groups.Get();
                foreach (var id in added)
                {
                    addMsg(obj.Id, "Добавлены опции: " + dict[id].Name);
                }
                foreach (var id in removed)
                {
                    addMsg(obj.Id, "Удалены опции: " + dict[id].Name);
                }

                //updater.Set(x => x.Options);
            }
        }

        /// <summary>
        /// Отслеживание изменений позициий в заказе - 41009
        /// </summary>
        public void OnChangeItems(Order obj, string itemsJson) //Updater<Order> updater)
        //private void onChangeItems(Updater<Order> updater)
        {
            //var objectId = updater.Object.Id;
            //var itemsJs1 = updater.Object.ItemsJson;
            //string itemsJs2 = updater.Params["itemsJson"];
            if (obj.ItemsJson == itemsJson || itemsJson == null)  // доп.проверяем - а передается ли вообще jsitems - 55479 
                return;

            var ids0 = OrderHelper.GetItems(obj.ItemsJson, true).Select(item => item.eq.Value);
            var ids1 = OrderHelper.GetItems(itemsJson, true).Select(item => item.eq.Value);
            var added = ids1.Except(ids0);
            var removed = ids0.Except(ids1);

            var dict = DbCache.Equipments.Get();
            foreach (var id in added)
            {
                addMsg(obj.Id, "Добавлена позиция: " + dict.GetValueOrDefault(id, null)?.Name);
            }
            foreach (var id in removed)
            {
                addMsg(obj.Id, "Удалена позиция: " + dict.GetValueOrDefault(id, null)?.Name);
            }
        }


        private void addMsg(Guid orderid, string text)
        {
            var curuser = this.User;

            var message = new Message
            {
                //ClientId = obj.ClientId
                Date = DateTime.Now,
                DomainId = curuser.DomainId,
                Kind = MessageKind.User,
                OrderId = orderid,
                Scope = ScopeType.Any,
                SenderId = curuser.Id,
                Text = text,
            };
            Db.CreateInsertAsync(message).Wait();
        }

    }
}

