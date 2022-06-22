using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using Itall;
using Itall.App.Data;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using My.App.Common;
using My.App.Partners;
using My.App.CRM;

namespace My.App.Orders
{
    /// Часть контроллера, которая отвечает за синхронизацию заказов для партнероа
    partial class OrdersController
    {
        /// <summary>
        /// Аргументы синхронизации
        /// </summary>
        public class SyncCreateArgs
        {
            /// <summary>
            /// Дата события
            /// </summary>
            public DateTime Date { get; set; }

            /// <summary>
            /// Кол-во часов
            /// </summary>
            public int Hours { get; set; }

            /// <summary>
            /// ИД комнаты бронирования
            /// </summary>
            public Guid Room { get; set; }


            /// <summary>
            /// Имя клиента
            /// </summary>
            public string FirstName { get; set; }

            /// <summary>
            /// Фамилия клиента
            /// </summary>
            public string LastName { get; set; }

            /// <summary>
            /// Телефон потенциального клиента
            /// </summary>
            public string Phone { get; set; }

            /// <summary>
            /// E-mail потенциального клиента
            /// </summary>
            public string Email { get; set; }

            /// <summary>
            /// Признак - имеем ли инфу по клиенту
            /// </summary>
            /// <returns></returns>
            public bool HasClient() =>
                //!string.IsNullOrWhiteSpace(Fio) ||
                !string.IsNullOrWhiteSpace(Phone) ||
                !string.IsNullOrWhiteSpace(Email);

            /// <summary>
            /// Есть ли тел у параметров
            /// </summary>
            public bool HasPhone() => !string.IsNullOrWhiteSpace(Phone);

            /// <summary>
            /// Очистка параметров от лишних пробелов
            /// </summary>
            public void ProcessData()
            {
                Phone = Phone?.Trim();
                Email = Email?.Trim();
                FirstName = FirstName?.Trim();
                LastName = LastName?.Trim();
            }
        }

        /// <summary>
        /// Аргументы синхронизации
        /// </summary>
        public class SyncUpdateArgs
        {   
            /// <summary>
            /// ИД брони
            /// </summary>
            public Guid Id { get; set; }

            /// <summary>
            /// Статус бронирования
            /// </summary>
            public OrderStatus Status { get; set; }

        }



        /// <summary>
        /// Создание новой брони из внешней системы
        /// </summary>
        [HttpPost("sync-add")]
        public async Task<IActionResult> SyncAddAsync(SyncCreateArgs args)
        {
            // проверка доступа
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Allow(Sys.Operations.OrdersEdit);

            // провека параметров комнаты
            var room = await Db.Rooms.Finds(args.Room)
                .Select(r => new
                {
                    r.DomainId,
                    r.BaseId,
                })
                .FirstOrDefaultAsync();

            if (room == null)
                throw new UserException($"Комната с ИД={args.Room} не найдена");

            if (room.DomainId != user.DomainId)
                throw new UserException($"Нельзя создавать бронь в другой партнерской зоне");

            if (args.Hours < 1)
                throw new UserException($"Необходимо задать длительность репетиции (Hours)");

            //if (string.IsNullOrWhiteSpace(args.Key))
            //    throw new UserException($"Не задан внешний Key");

            var date1 = args.Date.AddHours(args.Hours);
            var status = OrderStatus.Unknown;
            args.ProcessData();
            Guid? client_id = null;
            var isNewClient = false;
            var error = "";

            // Работаем с информацией по клиенту
            if( args.HasClient())
            {
                // ищем карточку клиента
                var qclients = Db.Clients
                    .Where(cl =>
                        args.Phone != null && (
                            cl.User.Login == args.Phone ||
                            cl.User.Phone == args.Phone ||
                            cl.Resources.Any(r => r.Kind == ResourceKind.ClientPhone && r.Value.Contains(args.Phone))) ||
                        args.Email != null && cl.User.Email == args.Email
                        );
                
                // сортируем по кол-ву заказов
                var qclients_sort =
                    from cl in qclients
                    let count_orders = Db.Orders.Count(o => o.ClientId == cl.Id)
                    orderby count_orders descending
                    select cl;

                var client = await qclients_sort.FirstOrDefaultAsync();

                if(client == null)
                {
                    //var names = (args.Fio + "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    client = new Client
                    {
                        LastName = args.FirstName,  //names.FirstOrDefault(),
                        FirstName = args.LastName, //names.Skip(1).FirstOrDefault(),
                        Email = args.Email,
                    };
                    await Db.CreateInsertAsync( client );
                    isNewClient = true;

                    if (args.HasPhone())
                    {
                        var phone_res = new Resource
                        {
                            ObjectId = client.Id,
                            Kind = ResourceKind.ClientPhone,
                            Value = MiscUtils.FormatPhone(args.Phone),
                        };
                        await Db.CreateInsertAsync(phone_res);
                    }
                }

                client_id = client.Id;
            }


            var order = new Order
            {
                //Id = Guid.NewGuid(), // помечаем его новым
                ClientId = client_id,
                RoomId = args.Room,
                Date = DateTime.Now,
                DateFrom = args.Date,
                DateTo = date1,
                ModifiedById = user.Id,
                Status  = OrderStatus.Unknown, //status, /// add new partner API:  DocumentStatus.Reserv,
                Reason = CancelReason.Unknown,
                IsArchive = false,
                DomainId = room.DomainId,
                SourceType = SourceType.Sync,
                // ExtKey = args.Key,
                Updated = DateTime.Now,
            };

            //var calc = await OrderUtils.CalculateOrderAsync(order, user.DomainId); //  null, 
            //var ok = string.IsNullOrWhiteSpace(calc.Errors);

            var rcr = await Db.CreateInsertAsync(order); // lock await низзя

            SysUtils.SendBaseUpdate( room.BaseId );  // рассылаем уведомление об изменении брони по базе



            //lock (ORDER_LOCK) // Блокируем монопольно добавление
            //{

            //    Db.BeginTransaction();
            //    var rcr = Db.CreateInsertAsync(order).Result; // lock await низзя
            //    var rr = applyDocServicesAsync(Db, order.Id, (OrderStatusEx)args.Status).Result; // reload order to load room, client, base in one SQL query
            //    var res11 = Db.AddSharedOrdersAsync(order, roomobj).Result;
            //    Db.CommitTransaction();
            //}
            //}

            if(client_id != null)  // если задан клиент, то запускаем процессинг
            {
                try
                {
                    await StatusAsync(order.Id, OrderAction.Reserv);
                    status = OrderStatus.Reserv;
                }
                catch(UserException ux)
                {
                    error = ux.Message;
                }
                catch(Exception x)
                {
                    error = x.ToString();
                }
            }

            var res = new 
            {
                Id = order.Id,
                Status = status,
                DateFrom = order.DateFrom,
                DateTo = order.DateTo,
                //Error = calc.Errors,
                //Text = calc.Text,
                //Created = true,
                ClientId = client_id,
                IsNewClient = isNewClient,
                Error = error,
            };

            return Json(res);
        }




        /// <summary>
        /// Обновление статуса брони из внешней системы
        /// </summary>
        [HttpPost("sync-update")]
        public async Task<IActionResult> SyncUpdateAsync(SyncUpdateArgs args)
        {
            // проверка доступа
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Allow(Sys.Operations.OrdersEdit);

            if (args.Id == null)
                throw new UserException($"Не задан ID брони");

            // провека параметров комнаты
            var order = await Db.Orders.Finds(args.Id)
                .Select(r => new
                {
                    r.Room.BaseId,
                    r.Room.DomainId,
                })
                .FirstOrDefaultAsync();

            if (order == null)
                throw new UserException($"Бронь не найдена");

            if (order.DomainId != user.DomainId)
                throw new UserException($"Нельзя изменять бронь в другой партнерской зоне");


            var res = await Db.Orders.Finds(args.Id)
                .Set(o => o.Updated, DateTime.Now)
                .Set(o => o.Status, args.Status)
                .UpdateAsync();

            var msg = new Message
            {
                Date = DateTime.Now,
                DomainId = order.DomainId,
                Kind = MessageKind.User,
                OrderId = args.Id,
                Scope = ScopeType.Any,
                Text = $"Изменен статус брони на {args.Status} в sync-update",
                Updated = DateTime.Now,
                SenderId = user.Id,
            };
            await Db.CreateInsertAsync(msg);

            SysUtils.SendBaseUpdate(order.BaseId);  // рассылаем уведомление об изменении брони по базе

            return Ok();
        }


        [HttpGet("sync-list")]
        public async Task<IActionResult> GetSyncListAsync(DateTime date)
        {
            // проверка доступа
            this.RequiresAuthentication();
            var user = this.CurUser();

            var qlist =
                from o in Db.Orders
                    .LoadWith(o => o.Part)
                where o.DomainId == user.DomainId
                where o.Updated > date
                let client = o.Client
                select new
                {
                    o.Id,
                    o.DateFrom,
                    o.DateTo,
                    o.Status,
                    o.RoomId,
                    o.SourceType,
                    //o.Room.BaseId,
                    //Hours = (o.DateTo - o.DateFrom).TotalHours,
                    Client = client.FirstName + " " + client.LastName,
                    Phone = client.Resources.Select(r=>r.Value).FirstOrDefault(),
                    client.Email,
                    Items = OrderHelper.GetItems(o.ItemsJson, true, false),
                    Comment = o.ClientComment,
                    Promo = o.Promo.Name,

                    o.TotalPays,
                    //Forfeit = o.PaidForfeit,
                    o.TotalOrder,
                    o.Part.Forfeit,
                    o.CancelForfeit,
                    o.PaidForfeit,
                    TotalPayment = o.TotalPayment(), // o.TotalOrder + o.Part.Forfeit - o.TotalPay,
                    TotalSum = o.GetTotalSum(), //  o.TotalOrder + o.Part.Forfeit,
                };

            var list = await qlist.ToListAsync();
            return Json(list);
        }

    }

}
