using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using My.App;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace My.App.Orders
{
    /// <summary>
    /// Сервис обработки изменения статуса
    /// </summary>
    public partial class OrderActionService  //: Itall.Services.IService<OrderContext>
    {
        public async Task RunAsync(OrderContext context)
        {
            //var action = context.Action;
            //var order = context.Order;
            //var part = context.Order.Part; //DbUtils.GetOrCreateClientPart(context.Db, context.Order.ClientId, context.User?.DomainId) ?? ClientPart.Empty;

            var sharedOrders = context.Db.Orders
                .Where(x => x.ShareId == context.Order.Id);

            // находим пользователя, соотв ордеру
            var user = context.Order?.Client?.User ??
                await context.Db.Users
                    .LoadWith(u => u.Invite)
                    .Where(u => u.ClientId == context.Order.ClientId)
                    .FirstOrDefaultAsync();

            var tsvc = new Fin.TransService { Db = context.Db };
            //var oldForfeit = await context.Db.ForfeitAsync(order.DomainId, order.ClientId);
            var oldForfeit = context.Order.Part.Forfeit; // используем старую модель: https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/43841/ 
            var newForfeit = context.Order.CalcForfeit();  // новый полный штраф
            var orderTrans = context.Db.Transactions.Where(t => t.OrderId == context.Order.Id); //.ToListAsync();
            //var clientTrans = context.Db.Transactions.Where(t => t.ClientId == context.Order.ClientId); //.ToListAsync();

            context.Db.BeginTransaction1();
            context.OldStatus = context.Order.Status;
            context.Message = "";
            context.IsAddMsg = true;  // флаг - добавлять ли сообщение

            switch (context.Action)
            {
                case OrderAction.Request:
                    context.Order.RequestStatus = context.RequestStatus;
                    context.Order.Status = OrderStatus.Request;
                    context.Message = $"Изменение статуса на {Enum2.GetMember(context.RequestStatus).GetDisplayName()}";
                    break;

                case OrderAction.New:
                    context.Order.Status = OrderStatus.Unknown;
                    context.Order.PayForfeit = true; // принудительно выставляем оплату, согласно таску https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18238/
                    break;

                case OrderAction.Reserv:  // резервирование заказа
                    await sharedOrders.ArchiveAsync(false);
                    await do_reserv(context, tsvc);
                    break;

                case OrderAction.Pay: // оплата заказа
                    await sharedOrders.ResetLifetimeOrdersAsync();
                    var next_state = await do_pay(context, tsvc, orderTrans);
                    if(next_state == OrderAction.AutoPay)
                        goto case OrderAction.AutoPay;
                    else
                        goto case OrderAction.PayForfeits;

                case OrderAction.Close: // завершение заказа
                    await do_close(context, user, tsvc);
                    goto case OrderAction.AutoPay;

                case OrderAction.AutoPay: // Автоматическая оплата заказа
                    await do_autopay(context, tsvc, oldForfeit, orderTrans);
                    goto case OrderAction.PayForfeits;

                case OrderAction.PayForfeits: // Оплата штрафов
                    await do_pay_forfeit(context, tsvc, oldForfeit);
                    break;

                case OrderAction.CancelNormal:  // отмена заказа без сборов
                    await do_cancel_normal(context, tsvc, oldForfeit);
                    await sharedOrders.ArchiveAsync(true);
                    break;

                case OrderAction.CancelForfeitAsk:  // запрос на штраф
                    do_cancel_frofeit_ask(context, oldForfeit, newForfeit);
                    break;

                case OrderAction.CancelForfeitConfirm:  // подтверждение штрафа
                    await sharedOrders.ArchiveAsync(true);  // перенесено из CancelForfeitAsk
                    newForfeit = await do_cancel_forfeit_confirm(context, tsvc, oldForfeit, newForfeit, orderTrans);
                    break;

                    //default:
                    //    return; // остальные состояния не обрабатываем
            }

            //order.IsHold = false; // разблокируем заказ от изменений
            context.Order.IsConfirmed = false;
            context.Order.ModifiedById = context.CurUser?.Id;
            context.Order.Updated = DateTime.Now;  // добавлено т.к. игнорит календари https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/39281/
            if (context.Source != null)  // Добавлено https://hendrix.bitrix24.ru/company/personal/user/180/tasks/task/view/37575/
                context.Order.SourceType = context.Source.Value;
            if (context.Channel != null)  // Добавлено https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/51821/
            {
                context.Order.Channel = context.Channel;
                context.Order.ChannelId = context.Channel?.Id;
                context.Order.Template = Sys.TemplateGroup.Tinkoff;  // 52893 Исправить логику отправки шаблонов писем связанных с бронированиями. 
            }

            //await context.Db.UpdateAsync(context.Order);
            context.Db.Update(context.Order);


            if (context.IsAddMsg && !string.IsNullOrWhiteSpace(context.Message))  // если разрешено - добавляем сообщение
            {
                var msg = new Common.Message
                {
                    SenderId = context.CurUser?.Id,
                    ClientId = context.Order?.ClientId,
                    Date = DateTime.Now,
                    Kind = Common.MessageKind.User,
                    OrderId = context.Order?.Id,
                    Text = $"{context.Message}. Стоимость бронирования: {context.Order.GetTotalSum()} руб. ",
                    DomainId = context.CurUser?.DomainId,
                    Scope = ScopeType.Any,
                };
                await context.Db.CreateInsertAsync(msg);
            }

            context.Db.CommitTransaction1();

            // 58977 - изменяем порядок нотификации - делаем его явным
            var uargs = new UpdateArgs
            {
                Action = context.Action,
                Id = context.Order.Id,
                Status = context.Order.Status,
                RequestStatus = context.Order.RequestStatus,
                RoomId = context.Order.RoomId,
                BaseId = context.Order.Room.BaseId,
                DomainId = context.Order.Room.DomainId,
            };
            await SendUpdatesAsync(uargs);
            await notifyAsync( context, context.Action );
            Calendars.CalendarHelper.IncCalendarsUpdate(context.Db, roomId: context.Order?.RoomId);
        }

        private static async Task do_close(OrderContext context, Sys.User user, Fin.TransService tsvc)
        {
            context.Order.Status = OrderStatus.Closed;
            context.Order.Reason = CancelReason.Unknown;
            context.Message += "Закрытие брони";

            //var rarch = await sharedOrders
            //    .Set(x => x.Lifetime, 0)  // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/33021/
            //    .Set(x => x.IsArchive, false) // .Archive(false);
            //    .UpdateAsync();

            // начисления баллов, если был задан клиент
            if (user != null)
            {
                await tsvc.PointsCloseAsync(context.Order, user);

                //var svc = new CRM.PointsService { Db = context.Db, CurrentUser = context.CurUser };
                //var p = await svc.OnPaymentAsync(order, orderUser);
                //var r2 = await svc.OnPointsPaymentAsync(order, orderUser);
            }
        }

        private static async Task do_reserv(OrderContext context, Fin.TransService tsvc)
        {
            context.Order.Status = OrderStatus.Reserv;
            context.Order.Reason = CancelReason.Unknown;
            context.Message += "Резервирование брони";
            context.IsAddMsg = context.OldStatus != OrderStatus.Reserv;

            // комментарим работу с переносом штрафа на другой ордер
            //if (part.AllowForfeit(order.Id))
            //{
            //    order.PayForfeit = true; // принудительно выставляем оплату, согласно таску https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18238/
            //    order.Forfeit = part.Forfeit;
            //    part.ForfeitOrderId = order.Id;
            //    context.Db.Update(part);
            //}
            //else if(order.PayForfeit && part.ForfeitOrderId != null && part.ForfeitOrderId != order.Id) // если принуждаем забрать штраф
            //{

            //}

            context.Calcs ??= await Calcs.CalcHelper.CalcOrderAsync(context.Db, context.Order);

            // при фиксации результата - сохраняем оригинал - 52403 
            // order.OriginTotalSum = calc.TotalSum;

            await tsvc.ReservOrderAsync(context.Calcs);
            await tsvc.PointsReservAsync(context.Order);
        }

        private static async Task<OrderAction> do_pay(OrderContext context, Fin.TransService tsvc, IQueryable<Fin.Transaction> orderTrans)
        {
            //var next_state = OrderAction.PayForfeits;

            // сбрасываем срок жизни
            context.Order.Lifetime = 0;
            context.Message += "Оплата брони";
            var details = (context.TransDetails != 0) ? context.TransDetails : Fin.Groups.DET_CLIENTS_PAYMENT_CASH.Key;

            //var old_order_1 = order.Channel.Domain.City;

            //// в новой модели оплаты сначала оплачиваем штраф, и потом остаток идет на оплату брони
            //if (order.CanForfeit() && oldForfeit > 0)
            //{
            //    // вычисляем сумму оплаты штрафа и оплачиваем штраф
            //    var maxFF = Math.Min(oldForfeit, payment);
            //    //var maxFF = oldForfeit;
            //    text += $" в т.ч. оплата штрафа {maxFF} руб.";
            //    await tsvc.PaymentForfeitAsync(order, maxFF);
            //    await tsvc.PaymentOrderAsync(order, Fin.Groups.DET_CLIENTS_PAYMENT_FORFEIT.Key, maxFF);  //  forfeit: part.Forfeit
            //    order.TotalPays += maxFF;

            //    part.Forfeit -= maxFF; // уменьшаем долг по штрафу
            //    order.PaidForfeit += maxFF;
            //    await context.Db.UpdateAsync(part);

            //    payment -= maxFF; // уменьшаем оплату и проверяем - осталось ли еще что-то 
            //    if (payment <= 0) break;
            //}


            // рассчитываем сумму оплаты payment
            //await payment(context.TransTotal, details);
            var payment = context.TransTotal;
            if (payment == 0)
            {
                return OrderAction.AutoPay; // решили сделать переход на автооплату, аналогичный сценарий

                ////total = -orderTrans.Balance(Fin.Groups.REG_CLIENTS);
                //// total -= order.PointsSum; // убираем баллы, которые ушли на оплату
                ////total += part.Forfeit; // добавляем оплату штрафа - сейчас это текущий штраф
                //payment = context.Order.GetTotalSum(); // если не задана частичная оплата, то полная сумма по заказу https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/50845
                //var paysClient = await orderTrans.BalanceAsync(Fin.Groups.REG_CLIENTS, Fin.Groups.OP_CLIENTS_PAYMENT_RUB); // текущая сумма остатка по оплатам клиента
                //payment -= paysClient;  // уменьшаем оплату на сумму уже выплаченных денег
            }


            await tsvc.PaymentOrderAsync(context.Order, details, payment);  //  forfeit: part.Forfeit
            context.Order.TotalPays += payment;  // выставляем текущую сумму оплат, если было несколько - то необходимо доработать
            context.Order.PayDate = DateTime.Now;
            context.Message += $" на сумму {payment} руб.";

            if (context.IsPrepay)  // выставляем флаг предоплаты для Тинькова
                context.Order.IsPrepay = true; 


            ////var total = context.TransTotal >0 ? context.TransTotal :order.tot
            //await tsvc.PaymentOrderAsync(order, details, context.TransTotal, forfeit: oldForfeit);

            //if (order.PayDate == null)   // выставляем дату оплаты, если она не задана
            //    order.PayDate = DateTime.Now;

            // согласно https://docs.google.com/document/d/1tJAy4X6WdLchpZWjWVpXgso0bXsLeSOWK2GW6e-PM9I/
            // пул 4/9
            // Убираем!! если есть оплата, больше чем штраф, то автоматически закрываем
            //if (order.PayForfeit && total >= order.Forfeit)
            //{
            //    part.IsPayed = true;  // обозначаем оплату
            //    context.Db.Update(part);
            //    //goto case OrderAction.PayForfeits;
            //}
            //else
            //break;

            return OrderAction.PayForfeits;
        }

        private async Task do_autopay(OrderContext context, Fin.TransService tsvc, int oldForfeit, IQueryable<Fin.Transaction> orderTrans)
        {
            // оплачиваем остаток
            var rest = -await orderTrans.BalanceAsync(Fin.Groups.REG_CLIENTS);
            rest += context.Order.PaidForfeit; // к остатку прибавляем сумму оплаченныюх штрафов - согласно обсуждению с Г 23/11/2020

            if (context.Order.CanForfeit() && oldForfeit > 0)
            {
                rest += oldForfeit;  // Если есть незакрытый штраф, и он еще не оплачивался, то оплачиваем его 
            }

            // rest -= order.PointsSum; // убираем баллы, которые ушли на оплату
            //rest += oldForfeit; // добавляем оплату штрафа - в новой модели это текущий штраф

            //// в новой модели оплаты сначала оплачиваем штраф, и потом остаток идет на оплату брони
            //if (oldForfeit > 0)
            //{
            //    // вычисляем сумму оплаты штрафа и оплачиваем штраф
            //    var maxff = oldForfeit;
            //    text += $" в т.ч. автооплата штрафа {maxff} руб.";
            //    await tsvc.PaymentForfeitAsync(order, maxff);

            //    oldForfeit -= maxff; // уменьшаем долг по штрафу
            //    await context.Db.UpdateAsync(part);
            //    // общую оплату не уменьшаем
            //}


            // Если остаток >0, то оформляется оплата наличными на сумму остатка.
            // Если остаток <0, то оформляется “возврат наличными при изменении брони” на сумму остатка.Оформление производится в базе проводок.
            //await tsvc.PaymentOrderAsync(order, Fin.Groups.DET_CLIENTS_PAYMENT_CASH.Key, order.PointsSum, true);
            if (rest > 0)
            {
                await tsvc.PaymentOrderAsync(context.Order, Fin.Groups.DET_CLIENTS_PAYMENT_AUTOCACH.Key, rest);  //  forfeit: part.Forfeit
            }
            else if (rest < 0)
            {
                var group_details = getAutoBackGroup(context.Order);
                await tsvc.PaymentOrderAsync(context.Order, group_details.Key, -rest);  //  forfeit: part.Forfeit
            }

            context.Order.TotalPays += rest;  // Добавляем или вычитаем независимо от остатка

            //var total = context.TransTotal >0 ? context.TransTotal :order.tot
            //await payment(rest, details2);
            //await tsvc.PaymentOrderAsync(order, details2, context.TransTotal, forfeit: oldForfeit);

            context.Order.PayDate = DateTime.Now;

            if (rest != 0)  // чтобы не рассылать лишние письма по оплате - 58977 ошибки по рассылке писем, обновиться
            {
                await notifyAsync(context, OrderAction.Pay);
                context.CancelNotify = true;  // прерываем цепочку отправки сообщений
            }
        }

        private static async Task do_pay_forfeit(OrderContext context, Fin.TransService tsvc, int oldForfeit)
        {
            // если клиент оплатил штраф - очищаем штраф в карточке клиента
            if (context.Order.PayForfeit && oldForfeit > 0)  // убран CanPayForfeit() - https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/50845/
            {
                context.Message += $" в т.ч. оплата штрафа {oldForfeit} руб.";
                var details = context.IsOnlinePayment ? Fin.Groups.DET_CLIENTS_PAYMENT_FORFEIT.Key : 0;
                await tsvc.PaymentForfeitAsync(context.Order, oldForfeit, details);  //  forfeit: part.Forfeit

                //part.IsPayed = true;
                //part.Forfeit -= order.Forfeit;  // уменьшаем сумму штрафов на величину оплаты
                context.Order.PaidForfeit += oldForfeit;
                context.Order.Part.Forfeit = 0;  // в новой модели штрафов сбрасываем в 0
                                                 //order.PayedForfeit = true;

                context.Order.Part.IsBanned = false;

                // комментарим работу с переносом штрафа на другой ордер
                //if (part.ForfeitOrderId == order.Id)  // убираем ссылку на штрафной заказ
                //    part.ForfeitOrderId = null;
                context.Db.Update(context.Order.Part);

            }
        }

        //static SourceType[] BANK_SOURCES = new [] { SourceType.CatalogPre, SourceType.WidgetPre, SourceType.MobilePre };

        /// <summary>
        /// Определяем операцию возврата по условию оплаты через банк
        /// </summary>
        static Fin.Groups.Row getAutoBackGroup( Order order )
        {
            var is_bank = order.IsPrepay; //  BANK_SOURCES.Contains( order.SourceType );
            return is_bank 
                ? Fin.Groups.DET_CLIENTS_PAYMENT_AUTOBACK_TINKOFF 
                : Fin.Groups.DET_CLIENTS_PAYMENT_AUTOBACK;
        }

        private static async Task do_cancel_normal(OrderContext context, Fin.TransService tsvc, int oldForfeit)
        {
            context.Order.Status = OrderStatus.Cancel;
            context.Order.Reason = CancelReason.Normal;
            context.Message += "Отмена резервирования брони без штрафа";
            context.Order.PayDate = DateTime.Now;  // выставляем дату оплаты при отмене 78267

            // возвращаем переплату при отмене
            //var restC = orderTrans.Balance(Fin.Groups.REG_CLIENTS);
            // restC -= order.PaidForfeit;  // за вычетом штрафов
            var restC = context.Order.TotalPays - context.Order.PaidForfeit;
            if (restC > 0)
            {
                var group_details = getAutoBackGroup( context.Order );
                await tsvc.PaymentOrderAsync(context.Order, group_details.Key, restC);
                context.Order.TotalPays -= restC;
            }

            await tsvc.CancelOrderAsync(context.Order);

            if (context.Order.CanForfeit() && oldForfeit > 0)
            {
                //part.IsPayed = false;  // сбрасываем флаг оплаты

                //// комментарим работу с переносом штрафа на другой ордер
                //// фиксируем отказ от штрафов в ClientPart 
                //if (part.ForfeitOrderId == order.Id)  // убираем ссылку на штрафной заказ
                //    part.ForfeitOrderId = null;
                //context.Db.Update(part);

                // order.Forfeit = 0;  -- в новой модели штрафов бронь не имеет своего регистра штрафов
                context.Order.PayForfeit = false;
            }


            // await OrderCalcHelper.CalcForfeitForNearestOrderAsync(context.Db, context.Order, context.ClientPart);

            // возврат начисленных баллов
            // if (order.PayDate != null && user != null)
            {
                //var svc = new CRM.PointsService { Db = context.Db, CurrentUser = context.CurUser };
                //var p = await svc.OnBookingCancelAsync(order, orderUser);
                // tsvc.???  - а мы ничего не начисляли, поэтому ничего и не возвращаем
                await tsvc.PointsCancelAsync(context.Order);
            }
        }

        private static void do_cancel_frofeit_ask(OrderContext context, int oldForfeit, int newForfeit)
        {
            context.Order.Status = OrderStatus.Reserv;  // 2020-07-28 изменили в новой фин.модели - 43835
            context.Order.Reason = CancelReason.ForfeitsAsk;
            context.Order.CancelForfeit = newForfeit;
            // old - в рамках старой модели
            // order.Forfeit =;  //order.CalcForfeit(); // context.ClientPart.Discount);
            // order.ForfeitSum = order.Forfeit + context.ClientPart.Forfeit;
            // order.PayForfeit = false; // added 2016-10-17 - всегда сбрасываем штраф  , https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/12752/

            if (context.Order.ClientId == null)  //  && part.Forfeit > 0
                throw new UserException("Не задан клиент для назначения штрафа");

            context.Message += $"Запрос отмены со штрафом {newForfeit} руб.";  // oldForfeit
            // context.Forfeit = order.Forfeit; //TODO: added 2016-05-19 --- 2020-07-30 - заблокировано, т.к. всегда 0
        }

        private static async Task<int> do_cancel_forfeit_confirm(OrderContext context, Fin.TransService tsvc, int oldForfeit, int newForfeit, IQueryable<Fin.Transaction> orderTrans)
        {
            context.Order.Status = OrderStatus.Cancel;
            context.Order.Reason = CancelReason.ForfeitsConfirmed;
            context.Order.PayDate = DateTime.Now;  // выставляем дату оплаты при отмене 78267


            // комментарим работу с переносом штрафа на другой ордер
            //if (part.ForfeitOrderId == order.Id)  // убираем ссылку на штрафной заказ
            //    part.ForfeitOrderId = null;

            // если была предоплата.. - в новой модели штрафов считаем, что вся оплата идет на штраф
            var pays_rub = await orderTrans.BalanceAsync(Fin.Groups.REG_CLIENTS, Fin.Groups.OP_CLIENTS_PAYMENT_RUB);
            if (pays_rub > 0)
            {
                context.Message += $"Подтверждение отмены с предоплаченным штрафом {pays_rub} руб.";
                newForfeit = pays_rub; //  считаем, что штраф сразу оплачен
                context.Order.CancelForfeit = pays_rub; // newForfeit; // вся сумма идет на оплату штрафа
                                                        // await tsvc.ForfeitOrderAsync(order, newForfeit);  --- дубликат начисления
                await tsvc.PaymentForfeitAsync(context.Order, pays_rub);  // Здесь оплата штрафа налом??
                // part.Forfeit ;  // штраф не меняем
                //context.Order.Part.Forfeit -= pays_rub;  // #53291 - штраф не меняется //-- уменьшаем на сумму оплаты
            }
            else  // если предоплаты не было
            {
                context.Message += $"Подтверждение отмены со штрафом {newForfeit} руб.";
                context.Order.Part.IsBanned = oldForfeit > 0 && newForfeit > 0;  // Если штраф назначен повторно (и не оплачен- см пул 4/9 https://docs.google.com/document/d/1tJAy4X6WdLchpZWjWVpXgso0bXsLeSOWK2GW6e-PM9I/edit#), то блокируем клиента
                context.Order.Part.Forfeit += newForfeit;  // увеличиваем регистр на сумму штрафа
                                                           //if(!part.IsPayed)  // TODO: абсурд, но модель работает
            }

            //part.IsPayed = false;  // сбрасываем флаг оплаты
            await context.Db.UpdateAsync(context.Order.Part);

            await tsvc.ForfeitOrderAsync(context.Order, newForfeit);

            if (context.Order.Part.IsBanned) // если блокируется, то опс..
            {
                var svc = new CRM.ClientService { Db = context.Db, User = context.CurUser };
                await svc.OnChangeBanAsync(context.Order.Part, "Бан за повторный штраф");
            }


            // await OrderCalcHelper.CalcForfeitForNearestOrderAsync(context.Db, context.Order, context.ClientPart);


            // возврат начисленных баллов при отмене со штрафом
            //if (order.PayDate != null && user != null)
            //{
            //    //var svc = new CRM.PointsService { Db = context.Db, CurrentUser = context.CurUser };
            //    //var p = await svc.OnBookingCancelAsync(order, orderUser);
            //    // баллы не возвращаем, т.к. ничего не начисляли
            //}
            await tsvc.PointsCancelAsync(context.Order);
            await tsvc.CancelOrderAsync(context.Order);

            context.Order.PayForfeit = false; // added 2016-10-17 - всегда сбрасываем штраф  , https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/12752/
                                              // order.Forfeit = 0; -- в новой модели штрафов бронь не содержит собственный регистр штрфов
            return newForfeit;
        }

    }
}