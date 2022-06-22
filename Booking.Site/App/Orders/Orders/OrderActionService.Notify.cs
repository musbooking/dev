using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using My.App;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using My.App.Sys;

namespace My.App.Orders
{
    /// <summary>
    /// Рассылка уведомлений при бронировании
    /// </summary>
    partial class OrderActionService: AppObject //: Itall.Services.IService<OrderContext>
    {
        /// <summary>
        /// Рассылка уведомления по состоянию
        /// </summary>
        async Task notifyAsync(OrderContext context, OrderAction action)
        {
            if (context.CancelNotify) return; // если заблокированы сообщения, то ничего не отсылаем

            //var templates = App.Current.Config.Data.templates;
            var clEmail = context.Order?.Client?.Email;
            var baseEmail = context.Order?.Room?.Base?.Email;

            // если пользователь не зарегистрирован или забанен - то не посылаем
            var user = context.Order.Client?.User ??
                await context.Db.Users
                    .FirstOrDefaultAsync(x => x.ClientId == context.Order.ClientId);

            // убрал проверку на требование быть зарегистрированным клиентом, тк лезут тонкие ошибки https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/21702/?MID=56766#com56766
            //if (user == null || user.IsArchive) return; 
            if (user?.IsArchive == true) return;

            var client = context.Order.Client;

            var send = true;
            var basekey = "";

            // вычисляем базовый шаблон
            switch (action) // вместо context.Action - передаем явно
            {
                case OrderAction.Request:
                    basekey = TemplateKind.Request + "." + context.RequestStatus.ToString().ToLower();
                    //send = client?.CheckNotification(NotifyKind.Request???) ?? false;

                    await sendMailAsync(context, clEmail, basekey);   // уведомления сервису
                    await sendMailAsync(context, baseEmail, basekey + TemplateKind.OrderDomain); // уведомления партнерам

                    var cfg_email = Configs.Get("domain-reg-email");
                    await sendMailAsync(context, cfg_email?.AsText , basekey + TemplateKind.OrderService);     // уведомления сервису


                    return;  // у завок свой процессинг, поэтому прерыываем 

                case OrderAction.Reserv:
                    if (context.Order.Lifetime > 0)
                        return;  // убираем резерв по временной брони  https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/33021/
                    if (context.OldStatus == OrderStatus.Reserv)  // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/51189/
                        return;
                    basekey = TemplateKind.OrderReserv;
                    send = client?.CheckNotification( NotifyKind.Reserv ) ?? false;
                    break;

                case OrderAction.Pay:
                    if (context.IsPreExpired)  // если оплата с просроченным Lifetime, то сообщаем
                    {
                        var mainEmail = Configs.Get("domain-reg-email");
                        context.Text = "Оплата брони с истекшим сроком оплаты";
                        await sendMailAsync(context, mainEmail?.AsText, TemplateKind.OrderError);
                    }
                    goto case OrderAction.AutoPay;

                case OrderAction.AutoPay:
                    basekey = TemplateKind.OrderPaid;
                    send = client?.CheckNotification(NotifyKind.Payment) ?? false;
                    break;

                case OrderAction.CancelNormal:
                    basekey = TemplateKind.OrderCancel;
                    send = client?.CheckNotification(NotifyKind.Cancel) ?? false;
                    break;

                case OrderAction.CancelForfeitAsk:
                    send = client?.CheckNotification(NotifyKind.Cancel) ?? false;
                    return;

                case OrderAction.CancelForfeitConfirm:
                    basekey = TemplateKind.OrderForfeit;
                    send = client?.CheckNotification(NotifyKind.Forfeit) ?? false;
                    break;

                case OrderAction.Close:
                    // 58977 - убрана отправка уведомлений при закрытии
                    // return;  - добавлено 71867
                    if (context.OldStatus == OrderStatus.Closed)
                        return;
                    basekey = TemplateKind.OrderClose;  // № 51189 убираем пока, чтобы показать Paid  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/51189/
                    //basekey = TemplateKind.OrderPaid;   
                    break;

                default: // игнорируем другие статусы
                    return;
            }

            // вычисляем доп. суффикс у шаблона для работы с каналами

            //var templ = WebApp.Current.Templates;
            //var ispred = !string.IsNullOrWhiteSpace(context.Order?.Room?.Base?.ChannelIds);
            //var key = isreq ? TemplateKind.OrderRequest : (ispred ? TemplateKind.OrderPrepay : "");

            string key = null;  // key берется из группы шаблонов на уровне брони
            if (context.Order.Template != TemplateGroup.None)
            {
                key = "." + context.Order.Template;
            }
            else
            {
                var isreq = context.Order?.Room?.Base?.IsRequest ?? false;
                var chtype = context.Order.Channel?.Kind ?? Fin.PayChannelKind.Cash;
                key = isreq ? TemplateKind.OrderBaseRequest : "." + chtype.ToString();  // TemplateKind.OrderChannel +
            }
            key = key.ToLower();

            // отсылаем либо заданный шаблон, либо по умолчанию
            if (context.Order.SourceType != SourceType.Web)
            {
                //sendMail(context, "order_reserv_mobile", baseEmail);
                var csvc = new CRM.ClientService { Db = context.Db };
                var (bans, forfeits) = await csvc.GetClientProblems(context.Order.ClientId);
                if (bans > 0)
                    context.Text += "Клиент заблокирован у одного или нескольких партнеров сервиса, перейдите в карточку клиента чтобы узнать причину блокировки\r\n";
                if (forfeits > 0)
                    context.Text += "У клиента обнаружен штраф у одного или нескольких партнеров сервиса, перейдите в карточку клиента чтобы посмотреть подробную информацию\r\n";

                await sendMailAsync(context, baseEmail, basekey + TemplateKind.OrderDomain + key, basekey + TemplateKind.OrderDomain, basekey);
            }

            if(send)
                await sendMailAsync(context, clEmail, basekey + key, basekey);
        }

        /// <summary>
        /// Информация об обновлении
        /// </summary>
        public class UpdateArgs
        {
            public Guid Id { get; set; }
            public OrderStatus Status { get; set; }
            public RequestStatus RequestStatus { get; set; }
            public OrderAction Action { get; set; }
            public Guid? RoomId { get; set; }
            public Guid? BaseId { get; set; }
            public Guid? DomainId { get; set; }
        }

        /// <summary>
        /// Отправка уведомлений об изменениях в объектах
        /// </summary>
        public static async Task SendUpdatesAsync(UpdateArgs args)
        {
            //if (order == null) return;

            // уведомляем об изменениях базу
            SysUtils.SendBaseUpdate(args.BaseId );

            // если отмена штрафа - то уведомляем партнера
            switch (args.Action)
            {
                case OrderAction.CancelForfeitAsk:
                    SysUtils.SendForfeitUpdate(args.DomainId );
                    break;
                default:
                    break;
            }

            // уведомляем об изменениях сокетных подписчиков
            if (args.DomainId != null) await WebApp.SendSocketAsync("order-change", "" + args.DomainId, args);
            if (args.BaseId != null) await WebApp.SendSocketAsync("order-change", "" + args.BaseId, args);  // 54657
            if (args.RoomId != null) await WebApp.SendSocketAsync("order-change", "" + args.RoomId, args);  // 54657
        }


        /// <summary>
        /// Посылаем первый существующий шаблон из списка
        /// </summary>
        async Task sendMailAsync(OrderContext context, string email, params string[] keys )
        {
            if (string.IsNullOrWhiteSpace(email)) return;

            var orderid = context.Order.Id;
            var strkeys = string.Join('+',keys);

            var msg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.System,
                Text = $"Отправлено сообщение {context.Order.Client?.FIO} по адресу: {email}, шаблон: " + strkeys,
                ClientId = context.Order.ClientId,
                OrderId = orderid,
                Scope = ScopeType.Any, // в Message.ctor() Zone, но меняем: https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/21702/ 
            };

            var db = context.Db;

            // Согласно https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/23862/?MID=62220
            // берем первый канал оплат
            var channels = context.Order.Room?.Base?.ChannelIds.ToGuids();
            var channel = DbCache.PayChannels.Get()
                .Where(x => channels.Contains(x.Id))
                .FirstOrDefault();

            var model = new
            {
                context.Order,
                context.Order.Client,
                // context.ClientPart,
                context.Order.Room,
                context.Order.Room?.Base,
                context.Order.Room?.Base.Sphere,
                context.Order.Domain,
                context.Phones,
                context.Equipments,
                User = context.CurUser,
                Hours = (context.Order.DateTo - context.Order.DateFrom).TotalHours,
                Channel = channel,
                context.Text,
                Source = SysUtils.GetSourceName( context.Order.SourceType ) + (context.Order.IsPrepay ? "-пред" : ""),
                Total =  context.TransTotal > 0  ? context.TransTotal  :context.Order.TotalSum,
                //context.Order.Room?.Base.Sphere.Values.ToGuids().Select()
            };

            try
            {
                //WebApp.Current.AddMailTask(email, templateName, context);
                App.AddDbMailJob(email, model, db, context.Order?.Id, keys);

                var phone = model.Base.Phones; //  model.Domain?.Phone;  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/46137/
                var smsres = await SmsHelper.SendSmsAsync(phone, model, keys);
                if (!string.IsNullOrWhiteSpace(smsres))
                {
                    msg.Text += ", смс " + smsres;
                }
                else
                    msg.Text += ", без смс";

                await db.CreateInsertAsync(msg);
            }
            catch (Exception x)
            {
                msg.Kind = Common.MessageKind.System; //  Error; https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/21702/?MID=56670#com56670
                msg.Text = "Ошибка отправки почты: " + x.Message;
                var exists = db.Orders.Any(y => y.Id == orderid);
                if (!exists)
                {
                    msg.OrderId = null;
                    msg.Text = "Ошибка отправки почты: " + x.Message + ", удален заказ";
                }
                await db.CreateInsertAsync(msg);
            }
            finally
            {
            }
            //    }
            //};
            // WebApp.Current.Tasks.AddTask(task);
            //task.ContinueWith(t => Console.WriteLine(t.Exception), TaskContinuationOptions.LazyCancellation);
        }

    }
}