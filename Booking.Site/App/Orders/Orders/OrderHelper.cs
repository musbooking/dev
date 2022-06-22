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

namespace My.App.Orders
{

    /// <summary>
    /// Сервис расчета брони
    /// </summary>
    public static class OrderHelper //: Itall.Services.IService<OrderCalcArgs>
    {

        //private  services

        /// <summary>
        /// Интервал в часах, после которого заявка становится необработанной
        /// </summary>
        public static int RequestNoProcessHours() => Configs.Get("request-noproc")?.AsInt ?? 1;

        /// <summary>
        /// Статус "Подтверждено". Присваивается если на основании заявки была создана хотя бы 1 бронь
        ///     или заявка находится в статусе "В работе" больше чем "N" часов (вывести параметр)
        /// </summary>
        public static int RequestConfirmHours() => Configs.Get("request-confirm")?.AsInt ?? 1;
        


        /// <summary>
        /// Процессинг изменений статуса заказа
        /// </summary>
        public static async Task ApplyStatusAsync(OrderContext ctx)
        {
            //WebApp.Current.Services.Run(ctx);
            await new OrderActionService().RunAsync(ctx);
            // await new OrderNotifyService().RunAsync(ctx); // обязательно после Doc - убрано в результате рефакторинга по 58977
            await new Partners.TarifService().RunAsync(ctx);
            await new Partners.OrderDiscountService().RunAsync(ctx);

        }

        static readonly OrderItem[] EMPTY_ORDER_ITEMS = new OrderItem[0];

        /// <summary>
        /// Получение списка элементов по заказу
        /// </summary>
        public static IEnumerable<OrderItem> GetItems(string jsitems, bool eqonly = false, bool joinEq = false)
        {
            jsitems = jsitems?.ToLower();
            if (string.IsNullOrWhiteSpace(jsitems) || jsitems=="null" || jsitems== "undefined")
                return EMPTY_ORDER_ITEMS;
            IEnumerable<OrderItem> items = JsonUtils.JsonToObject<OrderItem[]>(jsitems);

            if (eqonly)
                items = items.Where(item => item.eq != null);

            if (joinEq)  // если требуется загрузка объектов Equipments
            {
                var eqdict = DbCache.Equipments.Get();
                items.ForEach(item => item.Equipment = eqdict.GetValueOrDefault(item.eq.Value, null));
            }
            return items;
        }

        /// <summary>
        /// Получаем список ИД услуг
        /// </summary>
        public static IEnumerable<Guid> GetItemsIds(string jsitems)
        {
            if (string.IsNullOrWhiteSpace(jsitems))
                return Array.Empty<Guid>();
            var items = JsonUtils.JsonToObject<OrderItem[]>(jsitems);
            var ids = items
                .Where(item => item.eq != null)
                .Select(item => item.eq.Value);
            return ids;
        }


        /// <summary>
        /// Сброс Lifetime, Archive
        /// </summary>
        public static async Task<int> ResetLifetimeOrdersAsync(this IQueryable<Order> orders)
        {
            var res = await orders
                .Set(x => x.Lifetime, 0)  // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/33021/
                .Set(x => x.IsArchive, false) // .Archive(false);
                .UpdateAsync();

            return res;
        }



        static OrderStatus[] ACTIVE_STATUSES = { OrderStatus.Unknown, OrderStatus.Reserv, OrderStatus.Closed };

        /// <summary>
        /// Получение списка заказов в календаре
        /// </summary>
        public static IQueryable<Order> GetBetweenOrders(this IQueryable<Order> query, DateTime date1, DateTime date2, Guid? roomId)
        {
            if (roomId != null)
                query = query.Where(x => x.RoomId == roomId);

            query = query
                //.Where(x => x.DateFrom <= date2 && x.DateTo >= date1)
                //.Where(x => x.DateTo > date1 && x.DateFrom < date2)
                //.Where(x => (x.DateFrom > date1 || x.DateTo > date1) && (x.DateFrom < date2 || x.DateTo < date2) )
                //.Where( x => 
                //    x.DateFrom <= date1 && x.DateTo > date1 ||  // df .. D1 ... dt
                //    x.DateFrom < date2 && x.DateTo >= date2 ||   // df .. D2 ... dt
                //    x.DateFrom >= date1 && x.DateTo <= date2     // D1 .. dt ... dt .... D2
                //)
                .Where(x => ACTIVE_STATUSES.Contains(x.Status));

            query = GetBetweenOrders(query, date1, date2);

            return query;
        }

        public static IQueryable<Order> GetBetweenOrders(this IQueryable<Order> query, DateTime date1, DateTime date2)
        {
            // модернизированная версия алгоритма 2019-06-18  https://hendrix.bitrix24.ru/company/personal/user/180/tasks/task/view/31862/?current_fieldset=SOCSERV  
            query = query.Where(x =>
                Sql.Between(x.DateFrom, date1, date2.AddSeconds(-1)) ||
                Sql.Between(x.DateTo, date1.AddSeconds(1), date2) ||
                x.DateFrom <= date1 && x.DateTo > date1);

            //query = query
            //    .Where(x =>
            //       x.DateFrom <= date1 && x.DateTo > date1 ||  // df .. D1 ... dt
            //       x.DateFrom < date2 && x.DateTo >= date2 ||   // df .. D2 ... dt
            //       x.DateFrom >= date1 && x.DateTo <= date2     // D1 .. dt ... dt .... D2
            //    );

            return query;
        }


        /// <summary>
        /// добавляем заказы-копии для связанных комнат
        /// </summary>
        public static bool AddSharedOrders(this DbConnection db, Order order, Room room)
        {
            if (room == null || room.ShareId == null)  //throw new ArgumentNullException("Не задана комната");
                return false;

            var roomIds = db.Rooms
                .Where(x => x.Id != room.Id && x.ShareId == room.ShareId)
                .Select(x => x.Id)
                .ToArray();

            foreach (var roomid in roomIds)
            {
                var newOrder = order.CreateSharedOrder(roomid, room.Name);
                db.CreateInsert(newOrder);
            }
            return true;
        }

        ///// <summary>
        ///// обновляем заказы-копии для связанных комнат
        ///// </summary>
        //public static void UpdateShareOrders(this DbConnection db, Order order, string roomName)
        //{
        //    throw new Exception(); // TODO нужно отладить, написал, но оказалось не нужна

        //    var shares = db.Orders
        //        .Where(x => x.ShareId == order.Id);

        //    shares
        //        .Set(x => x.Comment, $"Копия [{roomName}] {order.Comment}")
        //        .Set(x => x.DateFrom, order.DateFrom)
        //        .Set(x => x.DateTo, order.DateTo)
        //        .Update();

        //}



        /// <summary>
        /// Отмена будущих бронирований по клиенту
        /// https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/31162/
        /// </summary>
        public static async Task<int> CancelFutureOrdersAsync(IQueryable<Order> orders, Guid clientid, Guid? domainid)
        {
            var date0 = DateTime.Now;
            // находим все будущие брони клиента
            var qorders = orders
                .Where(x => x.ClientId == clientid) // все по текущему клиенту
                .Where(x => x.DateFrom > date0)  // будущие брони
                .Where(x => x.Status == Orders.OrderStatus.Reserv)  // статус резерв
                .Where(x => x.Room.DomainId == domainid);  // удаляем по домену комнаты (что равносильно домену базы) https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/33239/?MID=74917#com74917

            // архивация (удаление) будущих бронирований
            var future_order_ids = await qorders
                .Select(o => o.Id)
                .ToListAsync();
            var sharedOrders = orders
                .Where(o => o.ShareId != null)
                .Where(o => future_order_ids.Contains(o.ShareId.Value));
            await sharedOrders.ArchiveAsync(true);

            var res = await qorders
                .Set(x => x.Status, Orders.OrderStatus.Cancel)   // отмена будущих бронирований
                .Set(x => x.Updated, DateTime.Now)   // модифицируем дату обновления
                .UpdateAsync();

            return res;
        }


      

    }




}


#region --- Misc -----



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
