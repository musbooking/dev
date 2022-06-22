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
    /// Сервис для общих операций с бронью
    /// </summary>
    public class OrderService : DbService
    {
        /// <summary>
        /// Создание заказов
        /// </summary>
        public async Task<AddOrderResults> AddAsync( AddOrderArgs args )
        {
            var res = new AddOrderResults();

            res.Room = await Db.Rooms
                .LoadWith(x => x.Base.Sphere)
                .FindAsync(args.Room);

            if (res.Room == null)
                // return Error(new { Errors = "Комната не найдена" });
                throw new UserException("Комната не найдена");

            if(args.DateTo == DateTime.MinValue)
                args.DateTo = args.Date.AddHours(args.Hours);
            args.Client ??= User?.ClientId ?? args.Client;

            // запускам проверки и наполнение res
            if (res.Room.Base.Sphere.Kind == SphereKind.Teachers)
                checkTeachers(args);
            checkChannels(args, res.Room.Base.ChannelIds);
            args.PromoId = checkPromo(args.Promo);
            res.Part = checkClient(args.Client, res);

            // Создаем абонемент для серии:  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/38003/
            res.Total = 0;

            if (args.HasSeries())
                await createAbonement(args, res);

            //Order order1 = null; // запоминаем первый заказ, для возврата
            //var text = "";
            //var errors = "";
            args.Maxdate = args.Maxdate ?? args.Date;
            args.PayForfeit = args.PayForfeit ?? args.Source != SourceType.Mobile && !args.IsPrepay; // выставляется false только для мобильных предоплат, 55107
            //var svc = new OrderService { Db = Db, CurrentUser = this.CurrentUser };

            while (args.Date <= args.Maxdate)
            {
                var order = createOrder(args, res);
                var calc = await Calcs.CalcHelper.CalcOrderAsync(Db, order, checkErrors: !args.IsAutoDate); // part,

                if (args.IsAutoDate)
                {
                    // Пока не будет достигнута разрешенная работа - увеличиваем на 1ч и пытаемся зарезервировать
                    while (!calc.IsOk())
                    {
                        order.DateFrom = order.DateFrom.AddHours(1);
                        order.DateTo = order.DateTo.AddHours(1);
                        calc = await Calcs.CalcHelper.CalcOrderAsync(Db, order, checkErrors: !args.IsAutoDate); // part,
                    }
                }

                order.Id = Guid.NewGuid();
                order.OriginTotalSum = order.GetTotalSum(); // записываем в  #52403
                calc.Args.OrderId = order.Id;

                var orderRes = new AddOrderResult
                {
                    Id = order.Id,
                    DateFrom = order.DateFrom,
                    DateTo = order.DateTo,
                    Error = calc.Errors,
                    Text = calc.Text,
                    Created = calc.IsOk(),
                };

                if (calc.IsOk())
                {
                    Db.BeginTransaction1();
                    order.Status = OrderStatus.Unknown;  // сбрасываем статус, чтобы корректно изменить его из начального #69915
                    var rcr = await Db.CreateInsertAsync(order); // Пытаемся сразу создать и сохранить в БД, чтобы можно было проверять

                    var message = new Common.Message
                    { 
                        Date = DateTime.Now,
                        DomainId = User?.DomainId,
                        Kind = Common.MessageKind.User,
                        OrderId = order.Id,
                        Scope = ScopeType.Any,
                        Text = $"Создана бронь в [{res.Room.Name}] на даты [{order.DateFrom}-{order.DateTo}]",
                        SenderId = User?.Id,
                    };
                    var msgres = await Db.CreateInsertAsync(message);


                    lock (ORDER_LOCK) // Блокируем монопольно добавление
                    {
                        var status_args = new ChangeStatusArgs
                        {
                            OrderId = order.Id,
                            //Action = (OrderAction)status,
                            Action =  OrderAction.New,
                            Calcs = calc,
                        };
                        if(args.Status == OrderStatus.Reserv)
                        {
                            status_args.Action = OrderAction.Reserv;
                        }                        
                        if(args.Status == OrderStatus.Request) // для заявок устанавливаем New Request
                        {
                            status_args.Action = OrderAction.Request;
                            status_args.RequestStatus = RequestStatus.New;
                        }

                        //using var tr = Db.BeginTransaction();
                        var rr = ChangeStatusAsync(status_args).Result; // reload order to load room, client, base in one SQL query
                        if (args.Status != OrderStatus.Request)   // если не заявка, то создаем шаред-комнаты
                            Db.AddSharedOrders(order, res.Room); 
                        //tr.Commit();
                    }
                    //await tsvc.ReservOrderAsync(calc);
                    Db.CommitTransaction1();

                    res.Total += order.TotalOrder;
                }

                if (res.Order == null)  // запоминаем 1-й результат
                {
                    res.Order = order;
                    res.Text = calc.Text;
                    res.Errors = calc.Errors;
                }

                if (args.Period == SeriesPeriodKind.Unknown)
                    break;

                res.List.Add(orderRes);

                args.NextPeriod();
            }

            return res;
        }



    /// <summary>
    /// Создание абонемента 
    /// </summary>
    private async Task createAbonement(AddOrderArgs args, AddOrderResults res)
        {
            res.Abonement = new Abonement
            {
                Source = AbonementSourceKind.Series,
                BaseId = res.Room.BaseId,
                ClientId = args.Client,
                DateFrom = args.Date,
                DateTo = args.Maxdate.Value,
                Description = "Абонемент на основе серии",
                DomainId = res.Room.DomainId,
                Options = args.Option == null ? null : args.Option + "",
                PromoId = args.PromoId,
                RoomId = args.Room,
                //Equipments = items.  eqIds,
                //TotalPrice
                // Updated
            };
            await Db.CreateInsertAsync(res.Abonement);
        }

        /// <summary>
        /// Создание объекта брони
        /// </summary>
        private Order createOrder(AddOrderArgs args, AddOrderResults res)
        {
            // загружаем данные по заявке, если задан ИД
            var request = args.Request == null ? null
                : Db.Orders.Finds(args.Request)
                .Select(r => new
                {
                    r.Id,
                    r.RoomId,
                    r.ItemsJson,
                    r.ClientId,
                    r.Color,
                    r.Options,
                }).First();  // если что - ошибка - не найден

            // создаем бронь, и берем если нужно данные из заявки
            var order = new Order
            {
                //Id = Guid.NewGuid(), помечаем его новым
                Status = args.Status, /// add new partner API:  DocumentStatus.Reserv,
                Reason = CancelReason.Unknown,
                //RequestStatus = args.Status == OrderStatus.Request ? RequestStatus.New : RequestStatus.Unknown,
                SourceType = args.Source, //SourceType.Mobile,
                IsArchive = false,

                RequestId = args.Request,
                RoomId = args.Room ?? request?.RoomId,
                Date = DateTime.Now,
                DateFrom = args.Date,
                DateTo = args.DateTo,
                Updated = DateTime.Now,
                Lifetime = args.Lifetime,
                //Equipments = eqIds,
                ItemsJson = args.ItemsJson ?? request?.ItemsJson,
                PromoId = args.PromoId,
                ClientId = args.Client ?? request?.ClientId,
                ClientComment = args.ClientComment,
                Comment = args.Comment,
                Color = args.Color ?? request?.Color,
                ModifiedById = User?.Id,
                //Group = group, //GroupKind.Group,
                Options = args.Option?.ToString() ?? request?.Options,
                DomainId = res.Room.DomainId,
                Discount = res.Part.Discount,
                Range = args.Range,
                //Forfeit = part.Forfeit,
                PayForfeit = args.PayForfeit.Value, // 55107 true, // part.Forfeit > 0, ---- в новой модели штрафа всегда выставляем, даже если нет штрафа
                                                    //PayForfeit = forfeit > 0,
                ChannelId = args.Channel,
                AbonementId = res.Abonement?.Id,
                IsPointsPay = args.PayPoints,
                Part = res.Part,
                Template = args.Template,
            };
            return order;
        }

        /// <summary>
        /// Проверка актуальности клиента
        /// </summary>
        private CRM.ClientPart checkClient(Guid? clientid, AddOrderResults res)
        {
            clientid = clientid ?? User?.ClientId;
            var part = Db.GetOrCreateClientPart(clientid, res.Room.DomainId, 28);
            if (part.IsBanned)
                //return Error("Клиенту заблокированы услуги");
                throw new UserException("Клиенту заблокированы услуги");
            return part;
        }

        /// <summary>
        /// Проверка и поиск промокода
        /// </summary>
        private Guid? checkPromo(string promo)
        {
            if (string.IsNullOrWhiteSpace(promo)) return null;
            
            var promoid = Db.Promotions
                .Where(x => x.Name == promo)
                .GetActuals()
                .Select(x => x.Id)
                .FirstOrDefault();

            if (promoid == null || promoid == Guid.Empty)
                //return Error(new { Errors = "Промокод " + args.Promo + " не найден или заблокирован" });
                throw new UserException("Промокод " + promo + " не найден или заблокирован");

            return promoid;
        }

        /// <summary>
        /// Проверка каналов оплаты
        /// </summary>
        private static void checkChannels(AddOrderArgs args, string channelIds)
        {
            // Вычисляем канал оплаты
            if (args.Channel != null) return; // временно делаем костыль: https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/36161/?
            
            var channels = DbCache.GetChannels(channelIds);
            PayChannel objchannel;

            if (args.Lifetime > 0)  // тиньков, однозначно
            {
                objchannel = channels.FirstOrDefault(ch => ch.Kind == PayChannelKind.Online);
            }
            else
            {
                // если есть по инструкции, то его
                objchannel = channels.FirstOrDefault(ch => ch.Kind == PayChannelKind.Instruction);
                if (objchannel == null) // если нет инструкции, то нал
                    objchannel = channels.FirstOrDefault(ch => ch.Kind == PayChannelKind.Cash);
            }

            args.Channel = objchannel?.Id;
        }

        /// <summary>
        /// Проверка учителей
        /// </summary>
        private void checkTeachers(AddOrderArgs args)
        {
            // грязный хак для преподователей  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/23646/
            var date0 = args.Date; // DateTime.Now;
            var maxOrderDateFrom = Db.Orders
                .GetActuals()
                .Where(x =>
                    x.RoomId == args.Room &&
                    x.DateFrom.Year == date0.Year &&
                    x.DateFrom.Month == date0.Month &&
                    x.DateFrom.Day == date0.Day &&
                    (x.Status == OrderStatus.Closed || x.Status == OrderStatus.Reserv)
                )
                //.DefaultIfEmpty()
                .Max(x => (DateTime?)x.DateFrom);
            args.Date = maxOrderDateFrom?.AddMinutes(60) ?? date0.ToMidnight();
            args.DateTo = args.Date.AddMinutes(60);
        }


        /// <summary>
        /// Расчет изменений статуса
        /// </summary>
        public async Task<OrderContext> ChangeStatusAsync(ChangeStatusArgs args)   // DbConnection db, Guid orderid, OrderStatusEx status, bool orderDomain = false)
        {
            var order = await Db.JoinedOrders
                //.LoadWith(x => x.Client.User)
                //.LoadWith(x => x.Room.Base.Sphere)
                //.LoadWith(x => x.Part)
                //.LoadWith(x => x.Promo)
                //.LoadWith(x => x.Channel)
                //.LoadWith(x => x.Domain.Tarif)
                ////.GetDomainObjects(this.CurUser()?.DomainId)
                .FindAsync(args.OrderId);

            //if (part == null)
            //var domainId = args.UserDomain ?curuser?.DomainId : order.DomainId;
            var domainId = order.DomainId;
            order.Part = order.Part ?? Db.GetOrCreateClientPart(order.ClientId, domainId, 29);

            var phones = await Db.Resources
                .Where(x => x.ObjectId == order.ClientId)
                .GetPhones()
                .ToListAsync();

            //var eqids = order.Equipments.ToGuids();
            var eqids = OrderHelper.GetItemsIds(order.ItemsJson);
            var equipments = await Db.Equipments
                .LoadWith(x => x.Group)
                .Where(x => eqids.Contains(x.Id))
                .ToListAsync();

            //var opt = order.Room.Base.
            var ctx = new OrderContext
            {
                Db = Db,
                Action = args.Action,
                RequestStatus = args.RequestStatus,
                Order = order,
                CurUser = User,
                //ClientPart = order.Part,
                //Forfeit = 0,
                TransTotal = args.Total,

                Calcs = args.Calcs,
                // Notify = args.Notify,

                Phones = string.Join(", ", phones.Select(x => x.Value)),
                Equipments = string.Join(", ", equipments.Select(x => $"{x.Name}: {x.Group?.Name}")),
            };

            await OrderHelper.ApplyStatusAsync(ctx);

            return ctx;
        }



        /// <summary>
        /// Архивация заказа
        /// </summary>
        public async Task ArchiveAsync(Guid id)
        {
            var qorders = Db.Orders
                .GetDomainObjects(User.DomainId);

            update(qorders.Where(x => x.Id == id), false);

            update(qorders.Where(x => x.ShareId == id), true); // // удаляем все связанные заказы-копии


            var order = await qorders
                .Where(x => x.Id == id)
                .Select(x => new { x.ShareId, x.RoomId })
                .FirstAsync();

            Calendars.CalendarHelper.IncCalendarsUpdate(Db, roomId: order.RoomId);

            if (order.ShareId != null)
                update(qorders.Where(x => x.Id == order.ShareId), true);
        }


        void update(IQueryable<Order> orders, bool confirm)
        {
            orders
                .Set(x => x.Status, x => x.Status == OrderStatus.Reserv || x.Status == OrderStatus.Closed ? OrderStatus.Cancel : x.Status)
                .Set(x => x.IsArchive, true)
                .Set(x => x.IsConfirmed, confirm)
                .Set(x => x.DeleledById, User.Id)
                .Set(x => x.Updated, DateTime.Now)
                // .Set(x => x.EventKey, (string)null)  // удаляем привязку к событию  - оказывается, это делать нельзя, т.к. они удаляются из календаря
                .Update();
        }

        
        private static object ORDER_LOCK = new object();


    }




}
