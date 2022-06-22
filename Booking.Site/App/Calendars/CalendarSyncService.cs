using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using System.Threading;
using My.App;
using Itall;
using Itall.App.Data;
using System.Net;
using Itall.App.Auth;
using My.App.Orders;
using LinqToDB.Data;

namespace My.App.Calendars
{
    
    /// <summary>
    /// Сервис для связывания с календарем по протоколу OAuth2 через провайдера
    /// </summary>
    public class CalendarSyncService: DbService
    {
        /// <summary>
        /// список синхронизаций комнат
        /// </summary>
        protected static List<Guid?> _Syncs = new List<Guid?>();

        //protected OAuthProviderManager Providers => OAuthProviderManager.Global;


        public static string GetSyncInfo()
        {
            return string.Join(", ", _Syncs);
        }


        /// <summary>
        /// Метод подключения или отключения PUSH уведомлений
        /// </summary>
        public async Task<bool> SetWatchAsync(Calendar calendar)
        {
            if (calendar.Provider == null) return false;
            if (calendar.JsonContent == null) return false;
            if (calendar.RefreshToken == null) return false;

            // определяем флаг привязки к ПУШ-уведомлениям
            var watch = !calendar.IsArchive;
            //&& calendar.Domain?.IsArchive == true
            //&& calendar.Domain?.Status != Partners.DomainStatus.Locked;

            // сравниваем с текущей активностью, и выходим, если все ок
            //if (calendar.WatchStatus == WatchStatus.Unknown) return false;
            if (watch && calendar.WatchStatus == WatchStatus.Active) return false;
            if (!watch && calendar.WatchStatus == WatchStatus.Stop) return false;  // игнорируем пока calendar.WatchStatus == WatchStatus.Unknown 

            // привязываемся или отвязываемся от нотификаций
            var msg = new Common.Message
            {
                Date = DateTime.Now,
                DomainId = calendar.DomainId,
                Kind = Common.MessageKind.Calendar,
                ObjectId = calendar.Id,
                Scope = ScopeType.Any,
                Text = $"{(watch ? "Подписка на уведомления" : "Отписка от уведомлений")}, комната: {calendar.Room?.Name}"
            };

            try
            {
                var provider = CalendarProvider.GetProvider(calendar.Provider);
                if (provider == null) return false;

                var token = calendar.GetAccessToken();
                var web = new System.Net.WebClient()
                    .AddAuth(token)
                    .AddUserAgent()
                    .Encode();

                if (watch)
                {
                    try  // пытаемся отвязаться при любых условиях
                    {
                        calendar.WatchResult = await provider.WatchAsync(calendar, web, false);  // всегда пытаемся отвязаться
                    }
                    catch{}
                    calendar.WatchResult = await provider.WatchAsync(calendar, web, true); // привязываемся
                    calendar.WatchStatus = WatchStatus.Active;
                }
                else
                {
                    calendar.WatchResult = await provider.WatchAsync(calendar, web, false);  // всегда пытаемся отвязаться
                    calendar.WatchStatus = WatchStatus.Stop;
                }
            }
            catch (Exception err)
            {
                msg.Text += ". !! Ошибка: " + err;
                calendar.WatchStatus = WatchStatus.Error;
                await Db.CreateInsertAsync(msg);  // сохраняем только если ошибка 75573
            }

            await Db.Finds(calendar)
                .Set(cl => cl.WatchStatus, calendar.WatchStatus)
                .Set(cl => cl.WatchResult, calendar.WatchResult)
                .UpdateAsync();

            //await Db.CreateInsertAsync(msg);
            return true;
        }



        /// <summary>
        /// Точка входа в сервис - синхронизация комнаты
        /// </summary>
        public async Task<bool> SyncRoomAsync( SyncArgs args)
        {
            //var provider = CalendarProvider.GetProvider(calendar.Provider);
            //if (calendar.RoomId ==null || !provider.Allow(calendar)) return false;
            var calendar = args.Calendar;

            try
            {
                // попытка блокировки
                lock (_Syncs)
                {
                    var has = _Syncs.Contains(args.Calendar.RoomId);
                    if (has) return false;
                    _Syncs.Add(args.Calendar.RoomId);
                }

                await syncRoomInternalAsync( args );
            }
            catch (Exception x)
            {
                var text = $"Calendar {calendar?.Name}:{calendar?.Room?.Name} ({calendar?.Domain?.Name}) sync error: ";
                
                //var werr = x.InnerException as WebException;
                //if(werr?.Response != null)
                //{
                //    var encoding = ASCIIEncoding.UTF8;
                //    using var reader = new System.IO.StreamReader(werr.Response.GetResponseStream(), encoding);
                //    var responseText = reader.ReadToEnd();
                //    text += text + responseText;
                //}
                //else if( x!=null )

                text += x?.ToString();

                // сохраняем ошибку
                var msg = new Common.Message
                {
                    Date = DateTime.Now,
                    DomainId = calendar.DomainId,
                    Kind = Common.MessageKind.Calendar,
                    ObjectId = calendar.Id,
                    Text = text + x,
                };
                // Db.CreateInsert(msg);  -- 74915 Оптимизация сообщений от календарей

                throw x.InnerException ?? x;
            }
            finally
            {
                _Syncs.Remove(calendar.RoomId);
            }
            return true;
        }



        /// <summary>
        /// Внутренняя процедура синхронизации комнаты с минимумом проверок
        /// </summary>
        async Task<bool> syncRoomInternalAsync( SyncArgs args )
        {
            // готовим webclient для запросов
            var token = args.Calendar.GetAccessToken();
            args.WebClient ??= new System.Net.WebClient()
                .AddAuth(token)
                //.AddContentTypeJson()
                .AddUserAgent()
                .Encode();

            // готовим базовую часть запросов по заказам по комнате
            var qRoomOrders = Db.Orders
                .LoadWith(x => x.Client)
                .LoadWith(x => x.Part)  // чтобы считать total sum # 53523
                                        //.GetActuals() смотрим удаленные брони тоже, иначе теряем серые
                .Where(x => x.RoomId == args.Calendar.RoomId); //   || x.RoomId == room.ShareId); оставляем только текущую комнату


            args.Provider = CalendarProvider.GetProvider(args.Calendar.Provider);  // sss 13
            args.Result = await args.Provider.GetEvents(args);

            var minDate = args.Calendar.MinDate ?? DateTime.Now.AddMinutes(-5);  // заменяем сдвиг на час на 1 мин, чтобы решить доп. вопросы - 52483, 37771

            var qActualOrders = qRoomOrders                   // отсекаем по дате брони -18756
                .Where(x => x.Updated > minDate);

            await updateExtEvents(args, qActualOrders);

            await delExtEvents(args, qActualOrders);

            await updateOrders(args, qRoomOrders);

            // изменяем дату обновления у календаря - не переносить, т.к. используется при ручной синхронизации!
            await Db.Finds(args.Calendar)
                .Set(x => x.MinDate, args.UpdatedDate)
                .Set(x => x.Updates, 0)  // сбрасываем счетчик обновлений
                .UpdateAsync();

            return true;
        }

        /// <summary>
        /// Обновление букинга (Google, Outlook)
        /// </summary>
        private async Task updateOrders(SyncArgs args, IQueryable<Order> qRoomOrders)
        {
            var calendar = args.Calendar;
            var room = calendar.Room;

            // отслеживаем последние CalendarsMinDays
            var d0 = DateTime.Now.AddDays(-App.Settings.CalendarsMinDays);
            var events = args.Result.Events
                .Where(x => x.Start != null && x.End != null && (x.Start > d0))
                .ToList();

            var event_keys = events
                .Select(ev => ev.Id)
                .ToList();

            // готовим словарь соответствий (событие - заказ)
            var dlast = DateTime.Now.AddSeconds(-App.Settings.CalendarsPushMinSec); // отслеживаем последний 1 час
            var qEventRoomOrders = await qRoomOrders
                .WhereIf(args.LastOnly,
                    o => o.Updated > dlast || event_keys.Contains(o.EventKey),   // если last - то получаем измененные за час или в гугл-событиях
                    o => o.Updated > d0 && o.EventKey != null)
                .Select(x => new
                {
                    x.Id,
                    x.ShareId,
                    x.DomainId,
                    x.DateFrom,
                    x.DateTo,
                    x.Status,
                    x.IsArchive,
                    x.EventKey
                })
                .ToListAsync();


            //var bulkOrders = new List<Order>();
            //var updatedOrderIds = new List<Guid>();

            var shareRoomIds = await Db.Rooms
                .Where(r => r.Id != args.Calendar.RoomId && r.ShareId == args.Calendar.RoomId)
                .Select(r => r.Id)
                .ToArrayAsync();

            //  изменения от 20-08-2019
            // считываем из Гугла
            foreach (var ev in events)
            {
                // Получаем список order.id + order.shareId
                var qUpdatedOrders = qEventRoomOrders
                    .Where(o => !o.IsArchive)  // вычленияем удаленные
                    .Where(x => x.EventKey == ev.Id);
                var qUnionEvOrders = qUpdatedOrders
                        .Select(x => x.Id)
                    .Union(qUpdatedOrders
                        .Where(x => x.ShareId != null)
                        .Select(x => x.ShareId.Value));

                var evOrderIds = qUnionEvOrders.Distinct().ToList();

                var dateFrom = ev.Start.Value;
                var dateTo = ev.End.Value;
                var text = $"Импорт из {args.Provider}: {dateFrom}-{dateTo}"; // ev.Subject + " " + ev.Body; -- заблокировано согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/36193/

                if (evOrderIds.Count == 0) // если не найдено среди существующх - создаем новый
                {
                    if (!ev.IsCanceled) // добавляем, только если запись не была удалена в календаре, иначе игнорим
                    {
                        var order = new Order
                        {
                            Comment = text,
                            Updated = args.UpdatedDate, // вставим вместо текущей, чтобы не попали в список актуальных и не синхронизировались больше
                            Date = DateTime.Now,
                            DateFrom = dateFrom,
                            DateTo = dateTo,
                            EventKey = ev.Id,
                            RoomId = room.Id,
                            DomainId = room.DomainId,
                            SourceType = SourceType.Calendar,
                            //IsHold = true,  // импортируем закрытую бронь
                            Status = OrderStatus.Unknown,
                        };
                        await Db.CreateInsertAsync(order);
                        
                        // сохраняем информацию об импорте из внешнего календаря 
                        var msg = new Common.Message
                        {
                            Date = DateTime.Now,
                            DomainId = calendar.DomainId,
                            Kind = Common.MessageKind.Calendar,
                            OrderId = order.Id,
                            ObjectId = calendar.Id,
                            Text = text,
                        };
                        await Db.CreateInsertAsync(msg);

                        //await db.AddSharedOrdersAsync(order, room);  // добавляем события в общую комнату
                        foreach (var shareRoomId in shareRoomIds)
                        {
                            var newSharedOrder = order.CreateSharedOrder(shareRoomId, room.Name);
                            await Db.CreateInsertAsync(newSharedOrder);
                            //bulkOrders.Add( newSharedOrder );
                        }
                    }
                }
                else // иначе обновляем
                {
                    var qorders0 = qUpdatedOrders //db.Orders
                        .Where(x => evOrderIds.Contains(x.Id) || evOrderIds.Contains(x.ShareId.Value))
                        .Where(o => o.DomainId != room.DomainId ||
                                    o.DateFrom != dateFrom ||
                                    o.DateTo != dateTo ||
                                    ev.IsCanceled && 
                                        o.Status != OrderStatus.Unknown && o.Status != OrderStatus.Cancel && o.Status != OrderStatus.Request ||
                                    ev.IsCanceled && o.IsArchive != (o.Status == OrderStatus.Unknown));

                    //if (ev.IsCanceled)
                    //    qorders0 = qorders0
                    //        .Where(x => x.IsArchive != (x.Status == OrderStatus.Unknow))
                    //        .Where(x => x.Status != OrderStatus.Cancel);

                    var updOrderIds = qorders0
                        .Select(o => o.Id)
                        .ToArray();
                    if (updOrderIds.Length == 0)
                        continue;

                    var qorders1 = Db.Orders.AsQueryable(); //qorders0

                    qorders1 = updOrderIds.Length == 1
                        ? qorders1.Where(o => o.Id == updOrderIds[0])
                        : qorders1.Where(o => updOrderIds.Contains(o.Id));


                    var qorders = qorders1
                        //.Where(o => updOrderIds.Contains(o.Id))
                        .Set(o => o.DomainId, room.DomainId)
                        .Set(o => o.DateFrom, dateFrom)
                        .Set(o => o.DateTo, dateTo)
                        //.Set(x => x.Comment, text) текст не изменяем, тк при многократном обновлении размножается
                        ;

                    // имеет значение только 1-й, т.к. остальные - shared ?
                    var orderid = updOrderIds[0];
                    var msg = new Common.Message
                    {
                        Date = DateTime.Now,
                        DomainId = calendar.DomainId,
                        Kind = Common.MessageKind.System,
                        OrderId = orderid,
                        ObjectId = orderid,
                        Scope = ScopeType.Any,
                        Text = $"Обновление при синхронизации с календарем {calendar.Name}: новые даты {dateFrom}-{dateTo}",
                    };

                    if (ev.IsCanceled) // если запись была удалена в календаре = то помечаем ее серым
                    {
                        var order = await Db.Orders.Finds(orderid)
                            .Select(o => new
                            {
                                o.Id,
                                o.Status,
                            })
                            .FirstAsync();

                        // создаем только для резерва и закрытия
                        if (order.Status == OrderStatus.Reserv || order.Status == OrderStatus.Closed)
                        {
                            msg.Text = $"Удаление из календаря {calendar.Name}";
                            //await Db.CreateInsertAsync(msg);  // 72299
                        }
                        else
                        {
                            msg.Text = $"Архивация в календаре {calendar.Name}";
                        }

                        qorders = qorders
                            .Set(x => x.IsArchive, x => x.Status == OrderStatus.Unknown)
                            .Set(x => x.EventKey, (string)null)
                            .Set(x => x.Status, x => x.Status == OrderStatus.Unknown ? OrderStatus.Unknown : OrderStatus.Cancel);

                    }
                    
                    await Db.CreateInsertAsync(msg);  // отражаем любое изменение 72299
                    await qorders.UpdateAsync();
                }
            }
        }

        /// <summary>
        /// Обнлвление
        /// </summary>
        private async Task updateExtEvents(SyncArgs args, IQueryable<Order> qorders)
        {
            // Теперь наоборот - в календарь добавляем заказы, которые ранее не были добавлены
            var updOrders = await qorders
                .GetActuals()
                .WhereIf(!args.LastOnly, x => x.EventKey == null)  // только добавление, чтобы сохранить преемственность полных расчетов для старых сценариев 
                .Where(x => x.Status != OrderStatus.Cancel)
                .Where(x => x.Status != OrderStatus.Request)
                .Select(o => new OrderCalendarInfo
                {
                    Id = o.Id,
                    TotalSum = o.GetTotalSum(), // o.TotalOrder,
                    Fio = o.Client.FirstName + " " + o.Client.LastName,
                    Forfeit = o.Part.Forfeit,   // for test
                    TotalPays = o.TotalPays,
                    ClientId = o.ClientId,
                    Comment = o.ClientComment,
                    DateFrom = o.DateFrom,
                    DateTo = o.DateTo,
                    Source = o.SourceType,
                    Options = o.Options,
                    EventKey = o.EventKey,
                    Items = OrderHelper.GetItems(o.ItemsJson, true, true).ToList(),
                })
                .ToListAsync();

            var einfo = new EventInfo
            {
                Web = args.WebClient,
                Url = args.Result.Url,
                Db = Db,
                TimeZone = args.Calendar.TimeZone,
            };

            foreach (var order in updOrders)
            {
                einfo.Order = order;
                var ev = await args.Provider.SetEvent(einfo);

                if (einfo.IsNew())
                {
                    await Db.Orders.Finds(order.Id)
                        .Set(x => x.EventKey, ev.Id)
                        .UpdateAsync();
                }
            }
        }

        private async Task delExtEvents(SyncArgs args, IQueryable<Order> qorders)
        {
            // и заоодно под шумок удаляем
            var delOrders = await qorders
                .Where(x => x.EventKey != null)
                .Where(x => x.IsArchive || !x.IsArchive && x.Status == OrderStatus.Cancel) // Отмену тоже учитываем, см https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/19944/
                                                                                           //.Where(x => x.ShareId == null) // удаляем только общие комнаты
                .Select(o => new
                {
                    o.Id,
                    o.EventKey,
                })
                .ToListAsync();

            foreach (var order in delOrders)
            {
                // удаляем бронь в календаре, оборачиваем в исключение, тк. брони самой может не быть в гугле
                try
                {
                    await args.Provider.DelEvent(order.EventKey, args.WebClient, args.Result.Url);

                    // выставляем статус отмены у полученного события внешнего провайдера (если есть), чтобы его не синхронизировать больше
                    var del_ev = args.Result.Events.FirstOrDefault(ev => ev.Id == order.EventKey);
                    if(del_ev != null)  
                    {
                        del_ev.IsCanceled = true;
                    }
                }
                catch (Exception err)
                {
                    //var rr = err;
                    //App.Current.Logger?.Error($"Google event is not found or deleted : {res.Url}/{order.EventKey}, {order.DateFrom} [error: {err}] ");
                }
                finally
                {
                    //order.EventKey = null;
                    await Db.Orders.Finds(order.Id)
                        .Set(x => x.EventKey, (string)null)
                        .UpdateAsync();
                }
            }
        }
    }

}



#region Misc


//if (args.LastOnly)
//{
//    foreach (var order in eventOrders)
//    {
//        if (order.EventKey == null) continue;
//        einfo.EventKey = order.EventKey;
//    }
//}

// сбрасываем накопленное
//if (bulkOrders.Count > 0)
//    db.Orders.BulkCopy(bulkOrders);

//var minDate = calendar.MinDate ?? DateTime.Now;
//minDate = minDate.AddDays(-14);  // будем всегда синхронизировать последние 2 нед

//var actualOrders = roomOrders                       // отсекаем по дате брони https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18756/
//    .Where(x => x.DateFrom >= minDate);

#endregion
