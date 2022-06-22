using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using My.App.Orders;
using My.App.Partners;
using Microsoft.Extensions.Configuration;
using System.ComponentModel;

namespace My.App.Fin
{

    public enum PaymentType
    {
        Unknown = 0,
        Order = 1,
        Abonement = 2,
        Forfeit = 3,
    }

    public class PaymentArgs
    {
        public PaymentType Type { get; set; } // тип оплаты
        public Guid? Id { get; set; }  // универсальный идентификат
        //public Guid? Order { get; set; }
        //public Guid? Abonement { get; set; }
        //public Guid? Part { get; set; }
        public int Total { get; set; }

    }



    /// <summary>
    /// Аргументы для отправки в банк
    /// </summary>
    public class PaymentInfo
    {
        public PaymentType Type; // тип оплаты
        public Guid? Id;  // универсальный идентификат
        public int Total;
        public string Description;
        public string Terminal;
        public SourceType? Source;
        public string Inn;
        public string Phone;
        public string Base;

        public Guid? DomainId;
        //internal Guid[] ChannelIds;
        public PayChannel Channel;
        public string BasePhones;
        public string Email;
    }


    /// <summary>
    /// Результат подтверждения
    /// </summary>
    public class PaymentRes
    {
        public long PaymentId;

        //// Bank args
        public Guid Id { get; set; }
        public int Total { get; set; }
        public dynamic Source { get; set; }  // источник
        public PaymentType Type { get; set; }
    }



    /// <summary>
    /// Сервис для управления оплатами через Банк
    /// </summary>
    public class PaymentService: DbService
    {

        /// <summary>
        /// Создаем платеж в соответствии с присланной формой
        /// </summary>
        public PayDoc CreatePayment(Microsoft.AspNetCore.Http.IFormCollection args )
        {
            //var args = this.Request.Form;

            // Создаем платеж
            var domainId = Guid.Parse(args["id"]); //Convert<Guid>(args.id);
            var domain = Db.Domains.FindAsync(domainId).Result;
            //var user = this.CurUser();

            var payment = new PayDoc
            {
                DomainId = User.DomainId,
                IsCompleted = false,
                PayDate = DateTime.Now,

                Domain = domain,
                PayerDomId = domainId,
                PayerDom = domain,
                TarifId = Guid.Parse(args["tarifId"]), //Convert<Guid?>(args.tarifId),
                FIO = args["fio"], //Convert<string>(args.fio),
                Email = args["email"], //Convert<string>(args.email),
                Phone = args["phone"], //Convert<string>(args.phone),
                MobPhone = args["mobPhone"], //Convert<string>(args.mobPhone),
                Price = int.Parse(args["price"]), //Convert<int>(args.price),
                MobComm = int.Parse(args["comm"]), //Convert<int>(args.comm),
                Count = int.Parse(args["count"]), //Convert<int>(args.count),
                Total = int.Parse(args["total"]), //Convert<int>(args.total),
                Description = args["text"], //Convert<string>(args.text),
            };


            var invOrders = Db.Orders
                .GetDomainObjects(domainId)
                .WherePeriod(PeriodType.Previos | PeriodType.Debt)
                .WhereInvoices();

            // проверяем мобильную комиссию
            var invSum = invOrders.Sum(x => x.MobComm);
            if (invSum != payment.MobComm)
                throw new UserException("Сумма комиссии изменилась. Пожалуйста, создайте оплату заново");

            Db.CreateInsert(payment);

            return payment;
        }

        /// <summary>
        /// Получение дополнительных параметров оплаты
        /// </summary>
        public async Task<PaymentInfo> GetInfoAsync(PaymentArgs args)
        {
            string chids = null;
            var info = new PaymentInfo
            {
                Id = args.Id.Value,
                Total = args.Total,
                Type = args.Type,
            };
            
            switch (info.Type)
            {
                case PaymentType.Order:
                    var ores = await Db.Orders
                        .Finds(info.Id.Value)
                        .Select(o => new 
                        { 
                            //o.ClientId,
                            o.Room.Base.Domain.Terminal,
                            o.Room.Base.ChannelIds,
                            o.Room.DomainId,

                            Base = o.Room.Base.Name,
                            BasePhones = o.Room.Base.Phones,
                            o.Room.Domain.Inn,
                            ClientPhone = o.Client.Resources  // находим первый клиентский телефон
                                .Where(r => r.Kind == Common.ResourceKind.ClientPhone)
                                .Where(r => r.Value != null)
                                .FirstOrDefault()
                                .Value,
                            UserPhone = o.Client.User.Phone,
                            ClientEmail = o.Client.Email,
                            UserEmail = o.Client.User.Email,
                        })
                        .FirstOrDefaultAsync();
                    if (ores == null)
                        throw new UserException($"Заказ с ИД '{info.Id}' не найден");
                    info.Terminal = ores.Terminal;
                    info.DomainId = ores.DomainId;
                    info.Phone = ores.ClientPhone ?? ores.UserPhone;
                    info.Email = ores.ClientEmail ?? ores.UserEmail;
                    info.BasePhones =  ores.BasePhones;
                    info.Base = ores.Base;
                    info.Inn = ores.Inn;
                    chids = ores.ChannelIds;
                    break;

                case PaymentType.Abonement:
                    var ares = await Db.Abonements
                        .Finds(info.Id.Value)
                        .Select(ab => new
                        {
                            ab.Room.Base.Domain.Terminal,
                            ab.Room.Base.ChannelIds,
                            ab.Room.DomainId,

                            Base = ab.Room.Base.Name,
                            BasePhones = ab.Room.Base.Phones,
                            ab.Room.Domain.Inn,

                            ClientPhone = ab.Client.Resources // находим первый клиентский телефон
                                .Where(r => r.Kind == Common.ResourceKind.ClientPhone)
                                .Where(r => r.Value != null)
                                .FirstOrDefault()
                                .Value,
                            UserPhone = ab.Client.User.Phone,
                            ClientEmail = ab.Client.Email,
                            UserEmail = ab.Client.User.Email,

                        })
                        .FirstOrDefaultAsync();
                    if (ares == null)
                        throw new UserException($"Абонемент с ИД '{info.Id}' не найден");
                    info.Terminal = ares.Terminal;
                    info.DomainId = ares.DomainId;
                    info.Phone = ares.ClientPhone ?? ares.UserPhone;
                    info.Email = ares.ClientEmail ?? ares.UserEmail;
                    chids = ares.ChannelIds;
                    info.BasePhones = ares.BasePhones;
                    info.Base = ares.Base;
                    info.Inn = ares.Inn;
                    break;

                case PaymentType.Forfeit:
                    var fres = await Db.ClientParts
                        .Finds(info.Id.Value)
                        .Select(o => new 
                        { 
                            o.Domain.Terminal, 
                            o.DomainId,
                            Phone = o.Client.Resources.FirstOrDefault().Value,
                            //o.Forfeit
                        })
                        .FirstOrDefaultAsync();
                    if (fres == null)
                        throw new UserException($"Клиент у партнера с ИД '{info.Id}' не найден");
                    info.Terminal = fres.Terminal;
                    info.DomainId = fres.DomainId;
                    info.Phone = fres.Phone;
                    break;

                default:
                    break;
            }

            // ищем каналы Тинькова, если задана база - то только для доступных каналов
            var channels = DbCache.GetChannels(chids, info.DomainId)
                .Where(ch => ch.Kind == PayChannelKind.Online)
                .WhereIf(info.Source != null, ch =>
                    string.IsNullOrWhiteSpace(ch.Sources) ||
                    ch.Sources.ToEnums<SourceType>()?.Contains(info.Source.Value) == true);
            info.Channel = channels.FirstOrDefault();
            if (info.Channel == null)
                throw new UserException("Канал не найден для данного партнера и источника");

            return info;
        }


        public void DoPayment(PayDoc payment)
        {
            // добавляем лимит к тарифу для доменной зоны
            var countMonths = payment.Count;
            var domain = payment.PayerDom;

            var d = domain.LimitDate ?? DateTime.Now;
            // увеличиваем время
            domain.LimitDate = d.AddMonths(countMonths);
            domain.TarifId = payment.TarifId; //domain.Rate = domain.NextRate;

            // подтверждаем платежный документ
            payment.IsCompleted = true;

            // Привязываем заказы к оплате
            if (payment.MobComm > 0)
            {
                var invOrders = Db.Orders
                    .GetDomainObjects(domain.Id)
                    .WherePeriod(PeriodType.Previos | PeriodType.Debt)
                    .WhereInvoices();

                invOrders
                    .Set(x => x.MobComPayId, payment.Id)
                    .Update();
            }

            // вызываем сервисы для уточнения условия платежа
            var ctx = new Partners.DomainPaymentContext
            {
                Db = Db,
                Document = payment,
                Domain = domain,
            };
            //WebApp.Current.Services.Run(ctx);
            var res = FinHelper.ApplyPaymentAsync(ctx).Result;
        }


        /// <summary>
        /// Проведение клиентской оплаты внутри букинга
        /// </summary>
        public async Task ClientPayment(PaymentRes args, bool success)
        {
            var msg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.System,
                //OrderId = orderid,
                Scope = ScopeType.Any,
            };

            // Оплата через Тиньков, 
            // var res ={"TerminalKey":"1541506260483","OrderId":"969acd54-78e7-4b7f-8202-03167cebf709","Success":true,"Status":"CONFIRMED","PaymentId":68690836,"ErrorCode":"0","Amount":500,"RebillId":0,"CardId":14295625,"DATA":null,"Token":"2f27f80e72dd277058bb6d7d6f9428d8628a917066fe6ec75cf573a166387a0f","ExpDate":"0919"}
            try
            {
                if (success)
                {
                    switch (args.Type)
                    {
                        case PaymentType.Order:
                            msg.OrderId = args.Id;
                            msg.Text += $" Оплата брони онлайн {args.Total}";
                            await clientOrderPaymentAsync(args.Id, args.Total);
                            break;

                        case PaymentType.Abonement:
                            msg.Text += $" Оплата абонемента онлайн {args.Total}";
                            msg.AbonementId = args.Id;
                            await clientAbonementPaymentAsync(args.Id, args.Total);
                            break;

                        case PaymentType.Forfeit:
                            var part = await clientForfeitPayment(args.Id, args.Total);
                            msg.DomainId = part.DomainId;
                            msg.ClientId = part.ClientId;
                            msg.Text += $" Оплата штрафа онлайн {args.Total}: client={part.ClientId}, domain={part.DomainId}";
                            break;

                        default:
                            throw new UserException("Отсутствуют или неверные параметры для определения типа платежа");
                    }
                }
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(args.Source);
                msg.Text += ". Сообщение от банка: " + json;

                await Db.CreateInsertAsync(msg);
            }
            catch (Exception x)
            {
                msg.Kind = Common.MessageKind.Error;
                msg.Text += $", ERROR: {x}, OrderId={msg.OrderId}\r\n";
                //msg.Text += $", {this.HttpContext.Request.}";
                msg.OrderId = null;  /// чтобы обрабатывать левые ид заказов:   https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/42119/?current_fieldset=SOCSERV
                await Db.CreateInsertAsync(msg);
                throw;
            }
        }


        /// <summary>
        /// Оплата всех броней в абонементе
        /// </summary>
        async Task clientAbonementPaymentAsync(Guid abid, int total)
        {
            // вытаскиваем все брони по абонементу
            var orders = await Db.JoinedOrders
                .Where(o => o.AbonementId == abid)
                .Where(o => o.Status == OrderStatus.Reserv)
                .Where(o => o.TotalPays < o.TotalOrder)  // по которым еще не прошла оплата полностью
                .OrderBy(o => o.DateFrom)  // сначала текущие
                .ToListAsync();

            if (orders.Count == 0)
                throw new UserException("Не найдены брони в абонементе для оплаты");

            var rest = total;  // остаток оплаты, на старте = сумме оплаты
            var last_order = orders.Last();
            foreach (var order in orders)
            {
                var order_total = Math.Min( order.TotalOrder - order.TotalPays, rest );
                if (order == last_order)  // для последней брони оплата полностью
                    order_total = rest;
                await clientOrderPaymentAsync(order, order_total );
                rest -= order_total;  // уменьшаем остаток
                if (rest <= 0)
                    break;  // выходим независимо от наличия еще броней в абонементе
            }
            // что делать, если сумма превышена ???
        }


        /// <summary>
        /// Оплата штрафа клиентом
        /// </summary>
        async Task<CRM.ClientPart> clientForfeitPayment(Guid partid, int total)
        {
            //var data = args.DATA;
            Db.BeginTransaction1();

            //var client_id = Guid.Parse(data.Client);
            //var domain_id = Guid.Parse(data.Domain);

            //var part = await Db.GetOrCreateClientPartAsync( client_id, domain_id, 35);
            var part = await Db.ClientParts.FindAsync(partid);
            if (part == null)
                throw new UserException("Не найден ClientPart: " + partid);

            // заменяем вызов через сохранение на непосредственный вызов сервиса
            //int amount = args.Total;
            //part.IsBanned = false;
            //part.Forfeit -= amount;
            //await Db.SaveAsync( part );
            var ch_args = new CRM.ClientService.ChangeArgs
            {
                Client = part.ClientId,
                //IsBanned = updater.GetParam<bool?>("isBanned", obj.IsBanned), 
                //Forfeit = updater.GetParam<int?>("forfeit", obj.Forfeit), 
                Forfeit = part.Forfeit - total,
                Part = part,
            };
            if (part.IsBanned)
            {
                ch_args.IsBanned = false;
            }
            var clsvc = new CRM.ClientService { Db = Db, };
            var r = await clsvc.ChangeAsync(ch_args);

            //msg.DomainId = part.DomainId;
            //msg.ClientId = part.ClientId;
            //msg.Text += $" Оплата штрафа {total}: client={part.ClientId}, domain={part.DomainId}";

            var tsvc = new TransService { Db = Db, };
            await tsvc.PaymentForfeitNoOrderAsync(part, total);

            Db.CommitTransaction1();

            return part;
        }



        /// <summary>
        /// Оплата брони клиентом
        /// </summary>
        async Task clientOrderPaymentAsync(Guid? orderid, int total)
        {
            var order = await Db.JoinedOrders
                //.LoadWith(x => x.Client.User)
                //.LoadWith(x => x.Room.Base.Sphere)
                //.LoadWith(x => x.Promo)
                //.LoadWith(x => x.Part)
                //.LoadWith(x => x.Domain.Tarif)
                //.LoadWith(x => x.Channel)
                .FindAsync(orderid);

            order.Part = order.Part ?? Db.GetOrCreateClientPart(order.ClientId, order.Room?.Base?.DomainId, 25);
            await clientOrderPaymentAsync(order, total);
        }

        async Task clientOrderPaymentAsync(Order order, int total)
        { 
            //if (order.Status != Orders.DocumentStatus.Reserv)
            //    throw new UserException("Бронь не находится в статусе Резерв");
            //if (order.TotalSum != answer.Amount)
            //    throw new UserException("Сумма оплаты не совпадает");

            var phones = await Db.Resources
                // .Where(x => x.ObjectId == order.ClientId)
                .GetPhones(order.ClientId)
                .ToListAsync();

            // ищем канал тинькова у базы
            var channel = DbCache.GetChannels(order.Room.Base.ChannelIds)
                .FirstOrDefault(ch => ch.Kind == PayChannelKind.Online);

            // проверяем - просрочена ли предооплата, т.е. прошло ли более LifeTime минут с момента заказа
            var expired = order.Lifetime > 0 && order.Date.AddMinutes(order.Lifetime) < DateTime.Now;

            var ctx = new Orders.OrderContext
            {
                Db = Db,
                Action = OrderAction.Pay,
                Order = order,
                CurUser = order.Client?.User,
                Phones = string.Join(", ", phones.Select(x => x.Value)),
                //ClientPart = await Db.GetOrCreateClientPartAsync(order.ClientId, order.Room?.Base?.DomainId),
                //Forfeit = 0,
                IsOnlinePayment = true,
                TransDetails = Fin.Groups.DET_CLIENTS_PAYMENT_ONLINE.Key,
                TransTotal = total,
                // Source = SourceType.Mobile,  // выставляется согласно 37575 - убрано согласно 58685
                IsPrepay = true,
                Channel = channel,
                IsPreExpired = expired,
            };
            await Orders.OrderHelper.ApplyStatusAsync(ctx);

        }


    }


}


#region Misc

//var all_channels = DbCache.PayChannels.Get();
//var channel1 = all_channels
//    .Where(ch => ch.Kind == PayChannelKind.Tinkoff)
//    .WhereIf(args.ChannelIds.Length >0, ch => args.ChannelIds.Contains(ch.Id))
//    .Select(ch => new
//    {
//        ch.PrepayUrl,
//        //ch.Forfeit1,
//        //ch.Forfeit2,
//        //ch.Total1,
//        //ch.Total2,
//        //ch.Kind,
//        //ch.PartPc,
//    })
//    .FirstOrDefault();
//args.PrepayUrl = channel1?.PrepayUrl;

///// <summary>
///// Является ли платеж оплата штрафа
///// </summary>
//public bool IsForfeit() => Id.Contains(":");

///// <summary>
///// Получаем ИД клиент-парта из OrderId - format:  "guid:any unique value"
///// </summary>
//public Guid GetClientPartIdFromOrderId()
//{
//    var id_parts = this.Id.Split(':');
//    var part_id = Guid.Parse(id_parts[0]);
//    return part_id;
//}


//if (domain.CheckLimit())  Всегда увеличиваем относительно даты окончания периода, https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/19506/
//{
//    // если действующий, то увеличиваем лимит на 2 мес
//    domain.LimitDate = d.AddMonths(countMonths);
//}
//else
//{
//    // иначе увеличиваем лимит относительно текущей даты
//    //domain.LimitDate = DateTime.Now.AddMonths(countMonths);
//}


///// <summary>
///// Является ли платеж оплата брони
///// </summary>
//public bool IsOrder() => !string.IsNullOrWhiteSpace(this.Id);

///// <summary>
///// Получение идентификатора платежа
///// </summary>
//public string GetID()
//{
//    var id = Type switch
//    {
//        PaymentArgs.PaymentType.Order => $"{Order}",
//        PaymentArgs.PaymentType.Forfeit => $"{Part}:{DateTime.Now}",
//        _ => null,
//    };
//    return id;
//}

#endregion
