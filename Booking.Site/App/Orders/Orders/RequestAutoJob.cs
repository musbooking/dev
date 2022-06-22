using LinqToDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Orders
{
    /// <summary>
    /// Сервис для автоматической смены статусы у заявок
    /// </summary>
    public class RequestAutoJob : AppJob
    {
        public override async Task RunAsync()
        {
            using var db = new App.DbConnection();
            var now = DateTime.Now;
            var svc = new OrderService { Db = db };
            var qorders = db.Orders
                //.LoadWith(o => o.Room)
                .GetActuals();


            // Статус "Не обработана" - с которой ничего не сделали в статусе "Новая" через заданное время (параметр), по умолчанию 2д
            var noproc_hours = OrderHelper.RequestNoProcessHours();
            var noproc_date = now.AddHours(-noproc_hours);
            var qrequests =
                from o in qorders
                where o.RequestStatus == RequestStatus.New
                where o.Date < noproc_date
                select o;
            await changeStatus(qrequests, svc, RequestStatus.Unprocessed);

            // Статус "Подтверждено". Присваивается если на основании заявки была создана хотя бы 1 бронь
            // или заявка находится в статусе "В работе" больше чем "N" часов (вывести параметр)
            var confirm_hours = OrderHelper.RequestConfirmHours();
            var confirm_date = now.AddHours(-confirm_hours);
            var confirm_qrequests =
                from o in qorders
                where o.RequestStatus == RequestStatus.Processing && o.Date.AddHours(o.ConfirmDelay) < confirm_date
                    || o.RequestStatus == RequestStatus.New && o.Orders.Any()
                select o;
            await changeStatus(confirm_qrequests, svc, RequestStatus.Confirmed);
        }

        /// <summary>
        /// Изменение статуса
        /// </summary>
        private async Task changeStatus(IQueryable<Order> qrequests, OrderService svc, RequestStatus to_status)
        {
            var qrequests_sel =
                from r in qrequests
                select new
                {
                    r.Id,
                    r.RequestStatus,
                    HasOrders = r.Orders.Any(),
                    r.DateFrom,
                    r.DateTo,
                    r.RoomId,
                    r.ClientId,
                    r.SourceType,
                };

            var requests_sel = await qrequests_sel.ToListAsync();

            foreach (var req in requests_sel)
            {
                // 72313 - создаем автоматически бронь с серым статусом, если прошло время по процессингу заявки
                if( req.RequestStatus == RequestStatus.Processing && to_status == RequestStatus.Confirmed && !req.HasOrders)
                {
                    //var d0 = req.DateFrom;
                    //var dh = (req.DateTo - req.DateFrom).Hours; 

                    var add_args = new AddOrderArgs
                    {
                        Request = req.Id,
                        Status = OrderStatus.Reserv, // Делаем резерв 72313. Ранее - серая бронь, чтобы исключить проверки
                        Source = req.SourceType, ///SourceType.Request, - 87659 
                        Date = req.DateFrom,
                        DateTo = req.DateTo,
                        Comment = "Создано автоматически на основе заявки",
                        Room = req.RoomId,
                        Client = req.ClientId,

                        IsAutoDate = true,  // ключевой пункт автодобавления 72313
                    };
                    await svc.AddAsync( add_args );
                }

                var changeargs = new ChangeStatusArgs
                {
                    Action = OrderAction.Request,
                    OrderId = req.Id,
                    RequestStatus = to_status,
                };

                await svc.ChangeStatusAsync(changeargs);
            }
        }
    }
}

