using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using My.App;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using My.App.Partners;
using My.App.Orders;

namespace My.App.Partners
{
    /// <summary>
    /// Сервис автоматического назначения скидки клиенту на основе кол-ва оплаченных заказов
    /// </summary>
    public class OrderDiscountService // : Itall.Services.IService<OrderContext>
    {
        public async Task RunAsync(OrderContext context)
        {
            var action = context.Action;
            if (action != OrderAction.Pay) return;

            var order = context.Order;
            //var part = context.ClientPart; //DbUtils.GetOrCreateClientPart(context.Db, context.Order.ClientId, context.User?.DomainId) ?? ClientPart.Empty;
            var domainId = order.Part?.DomainId;


            // смотрим, сколько уже существует оплаченных броней у клиента
            var orders = context.Db.Orders
                .Where(x => x.ClientId == order.ClientId)
                .Where(x => x.Status == OrderStatus.Closed)
                //.Where(x => x.Domain.AllowShare)  // убрал, ранее было добавлено согласно требованию перекрыть автообновление скидки, таск 15 566
                .Where(x => x.Room.DomainId == domainId);

            var n = await orders.CountAsync();
            var args = new DiscountArgs { Orders = n, };

            var rules = DbCache.DiscountRules.Get().Values
                .Where(x => !x.IsArchive)
                .Where(x => x.DomainId == domainId);  // отсекаем только правила текущего контекста

            rules.ForEach(x => args.Apply(x));

            if (order.Part?.Discount < args.Discount) // если клиент оплатил штраф - очищаем штраф в карточке клиента
            {
                order.Part.Discount = args.Discount;
                context.Db.Update(order.Part);

                var msg = new Common.Message
                {
                    ClientId = order?.ClientId,
                    Date = DateTime.Now,
                    Kind = Common.MessageKind.User,
                    //OrderId = order?.Id,
                    Text = $"Клиенту автоматически назначена скидка {args.Discount}% согласно правилу: {args.Rule} ",
                    Scope = ScopeType.Zone,
                };
                await context.Db.CreateInsertAsync(msg);
            }
        }

    }

    /// <summary>
    /// Аргументы для расчета скидки
    /// </summary>
    class DiscountArgs
    {
        public int Orders;
        public int Discount;
        public DiscountRule Rule;

        public void Apply(DiscountRule rule)
        {
            // если правило на большее число заказов, то игнорим
            if (this.Orders < rule.Orders) return;

            // если скидка меньше, чем в правиле, то увеличиваем ее, и сохраняем примененное правило
            if (this.Discount < rule.Discount)
            {
                this.Discount = rule.Discount;
                this.Rule = rule;
            }
        }
    }


}



#region ---- Misc ----

//public static void Config(dynamic config)
//{
//    if (config == null) return;
//    _Rules = config.ToObject<List<DiscountRule>>();
//}

//static List<DiscountRule> _Rules = new List<DiscountRule>();


///// <summary>
///// Правила расчета скидки, формируются автоматически из файла конфигурации
///// </summary>
//class DiscountRule
//{
//    public int Orders { get; set; }
//    public int Discount { get; set; }

//    public void Apply(DiscountArgs args)
//    {
//        if (args.Orders < Orders) return;

//        // если исходная скидка меньше, то увеличиваем ее, и сохраняем примененное правило
//        if (args.Discount < Discount) 
//        {
//            args.Discount = Discount;
//            args.Rule = this;
//        }
//    }

//    public override string ToString()
//    {
//        return $"Скидка {Discount}% за {Orders} заказов";
//    }
//}

#endregion
