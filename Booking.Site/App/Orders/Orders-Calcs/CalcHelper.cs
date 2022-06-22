using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Itall;
using LinqToDB;
using My.App;
using Itall.Services;
using System.Threading.Tasks;
using My.App.Fin;
using My.App.CRM;

namespace My.App.Orders.Calcs
{

    /// <summary>
    /// Сервис расчета брони
    /// </summary>
    public static class CalcHelper 
    {

        /// <summary>
        /// Перерасчет брони и сохрарение результата в объект order (без БД)
        /// </summary>
        public static async Task<CalcResult> CalcOrderAsync(DbConnection db, Order order,  bool retrans = false, bool checkErrors = true)  // Убрал 10/04/2020 -  CRM.ClientPart part = null,
        {
            //if (order.IsIgnored())  -- снова разрешаем пересчет в рамках 39181, но запрещаем проверки
            //{
            //    return new CalcResult
            //    {
            //        Text = "Пересчет заблокирован",
            //        //Errors = "Бронирование невозможно", - нельзя показывать ошибку, иначе нельзя создать бронь
            //        IsHold = true,
            //    };
            //}

            // дополнительная проверка на всякий
            order.Room ??= await db.Rooms
                .LoadWith(r => r.Base.Sphere)
                .FindAsync(order.RoomId);

            var args = new CalcArgs
            {
                Db = db,
                ClientId = order.ClientId,
                CheckErrors = checkErrors,
                RoomId = order.RoomId,
                Room = order.Room,
                DFrom = order.DateFrom,
                DTo = order.DateTo,
                //EqIds = order.Equipments,
                ItemsJson = order.ItemsJson,
                //ChannelId = order.ChannelId;
                Options = order.Options.ToGuids(),
                Range = order.Range,

                //ClientForfeit = part.Forfeit; //order.Client?.Forfeit ?? 0;
                //Discount = order.Discount;
                PayForfeit = order.PayForfeit,
                PromoId = order.PromoId,
                //RoomPrice = order.RoomPrice;
                Forfeit = order.Part?.Forfeit ?? 0,
                IsPointsPay = order.IsPointsPay,
                Date = order.Date,
                Save = true,
                Status = order.Status,
                RoundSum = order.RoundSum,

                //info.DomainId = this.CurUser()?.DomainId;

                // убрал 2017-05-26, зачем-то лишний пересчет, потом все равно перебивается в правилах
                //Hour2 = (double)DTo.Minute / 60 + DTo.Hour;
                //if (Hour2 == 0)
                //    Hour2 = 24;
                ////info.Hours = info.ToHour - info.FromHour;
                //Hours = (DTo - DFrom).TotalHours;
            };

            if (order.Id != Guid.Empty)
                args.OrderId = order.Id;

            if (order.TotalPays > 0)  // fix баллы, как только прошла оплата - 52403 - так нельзя, т.к. расползается бронь
                args.PointsSum = order.PointsSum;
            else
                args.PointsSum = 0;


            //if (part == null && order.ClientId != null)
            //    part = await DbUtils.GetOrCreateClientPartAsync(null, order.ClientId, domainid);


            // расчет стоимости на основе правил
            var calc = await CalculateAsync(args);

            if (args.CheckErrors && !calc.IsOk())
            {
                throw new UserException(calc.Errors);
            }

            order.RoomDiscountSum = args.RoomDiscountSum;
            order.RoundSum = args.RoundSum;
            order.RoomClientDiscountSum = args.RoomClientDiscountSum;
            order.RoomPrice = args.RoomPrice;
            order.RoomSum = args.RoomSum;
            order.DiscountPackage = args.DiscountPackage;

            order.EqDiscountSum = args.EqDiscountSum;
            order.EqClientDiscountSum = args.EqClientDiscountSum;
            order.EqPrice = args.EqPrice;
            order.EqSum = args.EqSum;
            order.HasPackage = args.HasPackage;
            order.HotPromoId = args.HotPromo?.Id; 

            //order.Forfeit = order.CalcForfeit(part.Discount); //info.OrderForfeit;
            //order.ForfeitSum = args.ForfeitSum;
            //order.Forfeit = args.ForfeitSum; // Выставляем при пересчете, чтобы убирать штраф при выставлении флага "Оплата штрафа" у другого заказа
            order.TotalPrice = args.TotalPrice;
            order.PointsSum = args.PointsSum;   
            order.TotalOrder = args.TotalOrder;
            order.PayForfeit = args.PayForfeit; // в общем случае может быть выставлен принудительно


            if (retrans) // если нужно перегенерировать проводки
            {
                var tsvc = new Fin.TransService { Db = db };
                if (order.Status == OrderStatus.Reserv) // если необходима перегенерация проводок
                {
                    await tsvc.ReservOrderAsync(calc);
                    await tsvc.PointsReservAsync(order);
                }
                //else if (order.Status == OrderStatus.Closed) // если необходима перегенерация проводок
                //{
                //    await tsvc.ReservOrderAsync(calc);
                //    await tsvc.PaymentOrderAsync(order, Groups.DET_CLIENTS_PAYMENT_CASH.Key);
                //}
            }

            calc.Text = args.Texts.ToString();
            calc.Errors = args.Errors.ToString();

            // изменение календаря - увеличиваем счетчик обновлений
            Calendars.CalendarHelper.IncCalendarsUpdate( db, roomId: order.RoomId);

            return calc;
        }

        /// <summary>
        /// Расчет на основе переданной структуры OrderCalcArgs
        /// </summary>
        public static async Task<CalcResult> CalculateAsync(CalcArgs args)
        {
            if (args == null) return null;

            var hold = false;

            if (args.IsHold || args.DFrom< DateTime.Now.AddDays(-1))  // если более суток, то блокируем  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/39171/
            {
                return new CalcResult
                {
                    Args = args,
                    Text = "Пересчет заблокирован, или бронь до вчерашней даты",
                    //Errors = "Бронирование невозможно",
                    IsHold = args.IsHold,
                };
                //args.Texts.AppendLine( "Пересчет заблокирован!!!");
                //hold = true;
            }


            //var args = this;
            // расчет стоимости на основе правил

            //service = service ?? new OrderCalcUtils();
            await сalculateAsync(args);
            //WebApp.Current.Services.Run(args);

            if (args.IsFixHours && args.FixHoursAsError && args.IsCheckReserv())
                args.Errors.AppendLine("Время бронирования скорректировано с учетом разрешенных часов");

            var res = new CalcResult
            {
                Args = args,
                Forfeit = args.Forfeit,
                //ForfeitSum = args.Forfeit,  // для совместимости
                RoomPrice = args.RoomPrice,
                RoomSum = args.RoomSum,
                RoomSumR = args.RoomSumR,
                EquipmentPrice = args.EqPrice,

                TotalPrice = args.TotalOrder, // Оставлено для совместимости!!! 2017-06-26 По просьбе Владимира - чтобы была совместимость со старым API
                TotalOrder = args.TotalOrder,
                TotalSum = args.TotalSum,

                IsFixHours = args.IsFixHours,
                Hour1 = Convert.ToInt32(args.Hour1),
                Hour2 = Convert.ToInt32(args.Hour2),
                Hours = args.RoomHours,

                PayForfeit = args.PayForfeit,

                //IsRoomPromo = args.IsPromoRoom,
                Text = args.Texts.ToString(),
                Errors = args.Errors.ToString(),
                //HotPromo = args.HotPromo,
                IsAction = args.HotPromo != null,
                HotDiscount = args.HotPromo?.Discount ?? 0,
                //RoomClientDiscount = args.RoomPrice == 0 ?0 : 100 - 100 * args.RoomSum / args.RoomPrice,
                //RoomClientDiscount = args.RoomPrice == 0 ? 0 : (int)Math.Ceiling(100.00 - 100.00 * args.RoomSum / args.RoomPrice),
                RoomClientDiscount = args.RoomPrice == 0 ? 0 : SysUtils.Round5(100.00 - 100.00 * args.RoomSum / args.RoomPrice),
                PointsSum = args.PointsSum,
                IsHold = hold,  // по умолчанию не заблокировано
            };

            if (args.IsFixHours)
            {
                var h = (int)(args.DTo - args.DFrom).TotalHours;
                res.TotalPrice = (int)Math.Ceiling(args.TotalOrder * h / args.Hours); // совместимость!! https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/18970/
            }

            return res;
        }



        static CalcHelper()
        {
            _Methods.Add(new DatesCalcMethod().AsName("Учет Праздников и выходных"));
            _Methods.Add(new InitCalcMethod().AsName("Начальная инициализация"));
            _Methods.Add(new CheckClientMailConfirmMethod().AsName("Проверка подтвержденной почты клиента"));
            _Methods.Add(new PromoCalcMethod().AsName("Учет промоакций"));
            _Methods.Add(new HotCalcMethod().AsName("Корректировка времени репетиции согласно правилам"));
            _Methods.Add(new RoomHoursMethod().AsName("Проверка сета времени бронирования по комнате"));
            //_Rules.Add(new HoursOrderRule().AsName("Считаем время репетиции"));
            _Methods.Add(new PricesCalcMethod().AsName("Расчет цены комнаты для группы"));
            _Methods.Add(new EquipmentsCalcMethod().AsName("Расчет стоимости позиций"));
            _Methods.Add(new RoomFreeCalcMethod().AsName("Проверка свободной комнаты"));
            _Methods.Add(new TotalsCalcMethod().AsName("Расчет итоговой цены"));
            _Methods.Add(new ForfeitsCalcMethod().AsName("Расчет штрафов"));
            _Methods.Add(new PointsMethod().AsName("Оплата баллами"));
            _Methods.Add(new RoundCalcMethod().AsName("Округление итоговой суммы"));
        }

        static List<CalcMethod> _Methods = new List<CalcMethod>();

        static int _N = 0;

        /// <summary>
        /// Пересчет ордера на основе правил, главная точка входа
        /// </summary>
        static async Task сalculateAsync(CalcArgs args)
        {
            var needDbDispose = args.Db == null;
            args.Db = args.Db ?? new App.DbConnection();
            System.Diagnostics.Debug.WriteLine("Calc: " + ++_N);

            args.Errors.Clear();
            args.Texts.Clear();

            //var cancel = false;
            try
            {
                foreach (var method in _Methods)
                {
                    var pos = args.Texts.Length;
                    await method.Calc(args);
                    //if (cancel) break;
                    if (args.Texts.Length > pos)  // если были добавления текста
                        args.Texts.Append("<div>------------------</div>");
                }
                args.Texts.Replace("\r\n", "<div/>");
            }
            catch (Exception x)
            {
                args.Errors.AppendLine($"Ошибка в расчете: {x.Source}, {x.Message} {x.InnerException?.Message} <br> {x.StackTrace} <br> full: {x.ToString()}");
            }
            finally
            {
                if (needDbDispose) // значит, создавали коннект, и его надо освободить
                {
                    args.Db.Dispose();
                    args.Db = null;
                }
            }
        }

    }




}


#region --- Misc -----



///// <summary>
///// Сброс штрафа и пересчет - убрано в новой модели
///// </summary>
//public static async Task<bool> ClearForeitForOrderAsync(this DbConnection db, Order order)
//{
//    // выставляем штраф принудительно
//    order.PayForfeit = false;
//    order.Forfeit = 0;

//    await CalcOrderAsync(db, order);  // ctx.ClientPart, 
//    await db.SaveAsync(order);
//    return true;
//}


// комментарим работу с переносом штрафа на другой ордер
///// <summary>
///// Пересчет штрафа ближайшей брони
///// https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/31162/
///// </summary>
//public static async Task<bool> CalcForfeitForNearestOrderAsync(this DbConnection db, Order order, ClientPart part)
//{
//    var ff = part?.Forfeit ?? 0;
//    //if (ff == 0 ) return false; // не имеет смысла - штраф 0 или закреплен за бронью  || part?.ForfeitOrderId != null

//    // находим все будущие брони клиента
//    var nextOrder = await db.Orders
//        .Where(x => x.ClientId == order.ClientId) // все по текущему клиенту
//        //.Where(x => x.DateFrom > date0)  // будущие брони
//        .Where(x => x.Status == OrderStatus.Reserv)  // статус резерв
//        //.Where(x => x.Id != ctx.Order.Id)  // исключаем переданную бронь, 
//        .Where(x => x.DateFrom > order.DateFrom)  // будущая бронь относительно текущей
//        .OrderBy(o => o.DateFrom)
//        .FirstOrDefaultAsync();

//    if (nextOrder == null)
//    {
//        part.ForfeitOrderId = null;
//        await db.SaveAsync(part);
//        return false; // ничего не найдено - вылетаем
//    }

//    // выставляем штраф принудительно
//    nextOrder.PayForfeit = ff >0;
//    nextOrder.Forfeit = ff;

//    await CalcOrderAsync(db, nextOrder);  // ctx.ClientPart, 
//    await db.SaveAsync(nextOrder);

//    part.ForfeitOrderId = nextOrder.Id;
//    await db.SaveAsync(part);
//    return true;
//}




///// <summary>
///// Учет Соло или дуэта
///// </summary>
//class SoloDuetOrderRule : OrderRule
//{
//    public override void Apply(OrderCalcArgs args, ref bool cancel)
//    {
//        var ruleWorkday = args.DayKind != DayKind.Weekend && args.ToHour <= 18;
//        //if (ruleWorkday) args.Texts.AppendLine($"Рабочий день или до 18 часов");

//        var ruleToday = args.Date == DateTime.Now.ToMidnight(); // день в день
//        //if (ruleToday) args.Texts.AppendLine($"День в день");

//        var ruleSoloDouble = ruleWorkday || ruleToday;

//        args.IsSoloDuetMode = ruleSoloDouble &&
//            (args.Group == Models.GroupKind.Solo |
//            args.Group == Models.GroupKind.Duet);

//        if (!args.IsSoloDuetMode)
//        {
//            args.RoomPrice = 0; //сбрасываем
//            return;
//        }

//        //if (args.RoomPrice > 0) return;
//        var roomPrice = (args.Group == Models.GroupKind.Solo) ? 150 : 200;
//        args.RoomPrice = Convert.ToInt32(args.Hours * roomPrice);
//        args.Texts.AppendLine($"Режим Соло или Дуэта, Рабочий день или до 18 часов или день в день, цена комнаты {args.RoomPrice} = {roomPrice} * {args.Hours}");
//    }
//}



///// <summary>
///// Учет промо акций
///// </summary>
//class PromoOrderRule : OrderRule
//{
//    public override void Apply(OrderCalcArgs args, ref bool cancel)
//    {
//        Models.Promotion promo = null;

//        if (args.PromoId.HasValue)
//        {
//            promo = args.Db.Promotions
//                .FindAsync(args.PromoId.Value).Await();
//        }
//        else if (!string.IsNullOrWhiteSpace(args.PromocodeNum))
//        {
//            promo = args.Db.Promotions
//                .FirstAsync(x=>x.Name == args.PromocodeNum).Await();
//        }

//        if (promo == null) return;

//        if (promo.IsArchive)
//        {
//            args.Errors.AppendLine($"Промокод заблокирован");
//            return;
//        }

//        args.Promotion = promo;
//        args.DiscountRoom = promo.Discount;
//        args.Discount = 0;
//        if (promo.IsIgnoreEquipment) args.EqKf = 0;
//        args.IsPromoRoom = !promo.IsAction;
//        args.Texts.AppendLine($"Учтен промокод: {promo.Name}, скидка промо: {promo.Discount}, {(promo.IsIgnoreEquipment ? "доп=0" : "")} ");
//    }
//}

///// <summary>
///// Расчет цен за комнату
///// </summary>
//class RoomsOrderRule : OrderRule
//{
//    public override void Apply(OrderCalcArgs args, ref bool cancel)
//    {
//        if (args.IsSoloDuetMode) return;

//        var room = args.Room; //.Db.GetTable<Room>().FindAsync(args.RoomId).Await();
//        args.IsPromoRoom = room.IsPromo;
//        args.Texts.AppendLine($"Комната {room.Name}, акция: {room.IsPromo.ToRusString()}, учет акции: {args.IsPromoRoom.ToRusString()} ");
//    }
//}

#endregion
