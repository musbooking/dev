using Itall;
using Itall.Models;
using LinqToDB;
using My.App.CRM;
using My.App.Fin;
using My.App.Orders;
using My.App.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace My.App.Fin
{

    partial class TransService 
    {

        static int PointsForRegistration => Configs.Get("points-reg").AsInt;
        static int PointsForInvite => Configs.Get("points-invite").AsInt;
        static int PointsForProfile => Configs.Get("points-profile").AsInt;
        //static double PointsPcForBooking => Configs.Get("points%-booking").AsNumber ?? 0;
        // список параметров для разных баз
        static IEnumerable<ConfigItem> PointsPcForBooking => Configs.Gets("points%-booking")
            .OrderByDescending(x => (x.AsVal + "").Length);


        /// <summary>
        /// Начисление баллов за отзыв
        /// </summary>
        public async Task PointsReview(Order order, int points)
        {
            if (points == 0) return;

            await addTrans(new Transaction
            {
                Register = Groups.REG_POINTS.Key,
                Operation = Groups.OP_POINTS_ADD.Key,
                Details = Groups.DET_POINTS_REVIEW.Key,
                Date = DateTime.Now,
                ClientId = User.ClientId,
                OrderId = order.Id,
                RoomId = order.RoomId,
                BaseId = order?.Room.BaseId,
                SphereId = order?.Room.Base.SphereId,
                DomainId = order?.Room.DomainId,
                Total = points,
                Text = $"Начисление за отзыв по брони: {order.Room.Name} от {order.DateFrom}",
            });

        }



        /// <summary>
        /// Снятие баллов при резервировании
        /// </summary>
        public async Task PointsReservAsync(Order order)
        {
            // Оплата баллами
            if (order.PointsSum > 0 && order.IsPointsPay )
            {
                //// смотрим, было ли уже такое начисление
                //var dels = await Db.Points
                //    .Where(p => p.UserId == user.Id)
                //    .Where(p => p.Kind == PointKind.Payment)
                //    .Where(p => p.OrderId == order.Id)
                //    .DeleteAsync();

                await addTrans(new Transaction
                {
                    Register = Groups.REG_POINTS.Key,
                    Operation = Groups.OP_POINTS_REM.Key,
                    Details = Groups.DET_POINTS_BOOKING.Key,
                    Date = DateTime.Now,
                    ClientId = order.ClientId,
                    OrderId = order.Id,
                    RoomId = order.RoomId,
                    BaseId = order?.Room.BaseId,
                    SphereId = order?.Room.Base.SphereId,
                    DomainId = order?.Room.DomainId,
                    Total = order.PointsSum,
                    Text = $"Оплата заказа баллами: {order.Room.Name}",
                });
            }
        }

        /// <summary>
        /// Возврат начислений баллов при резервировании
        /// </summary>
        public async Task PointsCancelAsync(Order order)
        {
            // удаляем все транзакцию с баллами, сделанные по заказу
            await Db.Transactions
                .Where(t => t.OrderId == order.Id)
                .Where(t => t.Register == Groups.REG_POINTS.Key )
                //.Where(t => t.Operation == Groups.OP_POINTS_REM.Key )
                //.Where(t => t.Details == Groups.DET_POINTS_BOOKING.Key )
                .DeleteAsync();

            //return Task.FromResult(0);
        }


        /// <summary>
        /// Начисления баллов при регистрации
        /// </summary>
        public async Task PointsRegistrationAsync(Sys.User user)
        {
            var p = PointsForRegistration;

            await addTrans(new Transaction
            {
                Register = Groups.REG_POINTS.Key,
                Operation = Groups.OP_POINTS_ADD.Key,
                Details = Groups.DET_POINTS_REG.Key,
                Date = DateTime.Now,
                //KeyId = keyid,
                //OrderId = point.OrderId,
                ClientId = user.ClientId,
                //RoomId = point.Order?.RoomId,
                //BaseId = point.Order?.Room.BaseId,
                //SphereId = point.Order?.Room.Base.SphereId,
                //DomainId = point.Order?.Room.DomainId,
                Total = p,
                Text = $"Начисление {p} баллов за регистрацию",
            });

        }



        /// <summary>
        /// Начисления при оплате, при повторной оплате удаляем старые начисления
        /// </summary>
        public async Task PointsCloseAsync(Orders.Order order, Sys.User user)
        {
            //var kind = PointKind.Booking;
            var pc = GetDomainPointPc(order.Room.Base.DomainId, order.SourceType, order.Room.BaseId, order.RoomId);
            var cnt = Convert.ToInt32(order.TotalOrder * pc / 100);

            //if (cnt == 0) return;

            //// удаляем старые начисления
            //var dels = await Db.Points
            //    .Where(p => p.UserId == user.Id)
            //    .Where(p => p.Kind == kind)
            //    .Where(p => p.OrderId == order.Id)
            //    .DeleteAsync();

            await addTrans(new Transaction
            {
                Register = Groups.REG_POINTS.Key,
                Operation = Groups.OP_POINTS_ADD.Key,
                Details = Groups.DET_POINTS_BOOKING.Key,
                Date = DateTime.Now,
                //KeyId = keyid,
                OrderId = order.Id,
                ClientId = user.ClientId,
                RoomId = order.RoomId,
                BaseId = order?.Room.BaseId,
                SphereId = order?.Room.Base.SphereId,
                DomainId = order?.Room.DomainId,
                Total = cnt,
                Text = $"Начисление {cnt}= {order.TotalOrder} x {pc}%  баллов за оплату брони",
            });

            //await create(point, true);

            // Оплата баллами - не фиксируется в регистре, т.к. клиенту выставляется сумма брони с учетом скидки баллами
            //if (order.PointsSum > 0)
            //{
            //    //// смотрим, было ли уже такое начисление
            //    //var dels = await Db.Points
            //    //    .Where(p => p.UserId == user.Id)
            //    //    .Where(p => p.Kind == PointKind.Payment)
            //    //    .Where(p => p.OrderId == order.Id)
            //    //    .DeleteAsync();

            //    await addTrans(new Transaction
            //    {
            //        Register = Groups.REG_CLIENTS.Key,
            //        Operation = Groups.OP_CLIENTS_PAYMENT_POINTS.Key,
            //        //Details = Groups.DET_POINTS_PAYMENT.Key,
            //        Date = DateTime.Now,
            //        ClientId = user.ClientId,
            //        OrderId = order.Id,
            //        RoomId = order.RoomId,
            //        BaseId = order?.Room.BaseId,
            //        SphereId = order?.Room.Base.SphereId,
            //        DomainId = order?.Room.DomainId,
            //        Total = order.PointsSum,
            //        Text = $"Оплата заказа баллами: {order.Room.Name}",
            //    });
            //}


            // Проверяем начисление пригласившему пользователя
            if (user.InviteId != null)
            {

                user.Invite = user.Invite ?? await Db.Users.FindAsync(user.InviteId); // если что - ищем приглашенного пользователя
                var who_invite_client_id = user.Invite.ClientId;

                //// смотрим, было ли уже такое начисление
                //var dels2 = await Db.Points
                //    .Where(p => p.UserId == user.InviteId)
                //    .Where(p => p.Kind == PointKind.Invite)
                //    .DeleteAsync();

                var has = await Db.Transactions
                    .Where(t => t.Register == Groups.REG_POINTS.Key)
                    .Where(t => t.Operation == Groups.OP_POINTS_ADD.Key)
                    .Where(t => t.Details == Groups.DET_POINTS_INVITE.Key)
                    .Where(t => t.ClientId == who_invite_client_id)   // дополнительно ограничиваем по пользователю - только 1-й - 55671
                    .Where(t => t.UserId == user.Id)
                    .AnyAsync();

                if (!has)
                {
                    await addTrans(new Transaction
                    {
                        Register = Groups.REG_POINTS.Key,
                        Operation = Groups.OP_POINTS_ADD.Key,
                        Details = Groups.DET_POINTS_INVITE.Key,
                        Date = DateTime.Now,
                        ClientId = who_invite_client_id,
                        OrderId = order.Id,
                        RoomId = order.RoomId,
                        BaseId = order?.Room.BaseId,
                        SphereId = order?.Room.Base.SphereId,
                        DomainId = order?.Room.DomainId,
                        Total = PointsForInvite,
                        Text = $"Начисление за приглашенного пользователя {user.FIO} при первой оплате брони",
                        UserId = user.Id,
                    });
                }
            }

            //return point;
        }

        /// <summary>
        /// Проверка наличия баллов по профилю
        /// </summary>
        public Task<bool> CheckProfileAsync(Guid? clientid)
        {
            if (clientid == null) return Task.FromResult(true);

            var taskExists = Db.Transactions
                .Where(t => t.ClientId == clientid)
                .Where(t => t.Register == Groups.REG_POINTS.Key)
                .Where(t => t.Details == Groups.DET_POINTS_PROFILE.Key)
                .AnyAsync();
            return taskExists;
        }


        /// <summary>
        /// Начисления при изменении профиля
        /// </summary>
        public async Task PointsProfileAsync(Sys.User user)
        {
            var exists = await CheckProfileAsync(user.ClientId);
            if (exists) return;

            await addTrans(new Transaction
            {
                Register = Groups.REG_POINTS.Key,
                Operation = Groups.OP_POINTS_ADD.Key,
                Details = Groups.DET_POINTS_PROFILE.Key,
                Date = DateTime.Now,
                ClientId = user.ClientId,
                Total = PointsForProfile,
                Text = $"Начисление баллов за заполнение профиля",
            });

        }


        /// <summary>
        /// Фейк - устаревшая операция по измененю начисления
        ///     Т.к. баллы не начисляются в резерве
        /// </summary>
        public Task __PointsChangeAsync_old()
        {
            return Task.FromResult(0);
        }



        ///// <summary>
        ///// Возврат начислений при отмене - не имеет смысла
        ///// </summary>
        //public async Task<Point> OnBookingCancelAsync(Orders.Order order, Sys.User user)
        //{
        //    var cnt = order.PointsSum; //Convert.ToInt32(order.TotalSum * PointsPcForBooking / 100);
        //    var text = $"Возврат {cnt} баллов при отмене или пересчете";

        //    if (cnt == 0)  // Возвращать-то нечего!! Казна пуста!
        //        return null;

        //    var point = new Point
        //    {
        //        Date = DateTime.Now,
        //        Count = cnt,
        //        CreatedById = CurrentUser?.Id,
        //        Kind = PointKind.RetBooking,
        //        UserId = user.Id,
        //        User = user,
        //        Description = text,
        //        Order = order,
        //        OrderId = order.Id,
        //    };
        //    await create(point);
        //    return point;
        //}



        /// <summary>
        /// Поиск % за регистрацию с учетом партнеров
        /// </summary>
        public static double GetDomainPointPc(Guid? domainId, Orders.SourceType? source, Guid? baseid, Guid? roomid)
        {
            var domid = domainId ?? Guid.Empty;

            var qry = PointsPcForBooking
                .WhereIf(domainId != null, p => string.IsNullOrWhiteSpace(p.AsVal) || p.AsVal.ToGuids().Contains(domainId.Value))  // проверка по ид зоны
                .WhereIf(source != null, p => string.IsNullOrWhiteSpace(p.AsVal1) || p.AsVal1.ToInts().Contains((int)source)) // проверка по источнику
                .WhereIf(baseid != null && roomid == null, p => string.IsNullOrWhiteSpace(p.AsVal2) || p.AsVal2.ToGuids().Contains(baseid.Value))  // проверка по ид базы
                .WhereIf(roomid != null, p => string.IsNullOrWhiteSpace(p.AsVal3) || p.AsVal3.ToGuids().Contains(roomid.Value))  // проверка по ид комнаты
                .OrderByDescending(p => p.AsNumber);  // сортируем в порядке убывания, чтобы взять макс % - см. задачу 55839 

            var cf = qry.FirstOrDefault();

            var pc = cf?.AsNumber ?? 0;
            return pc;
        }


    }
}


#region --- Misc ----



///// <summary>
///// Удаляем все начисленные баллы
///// </summary>
//public async Task DelPoints(IQueryable<Transaction> query, int details )
//{

//    //var keyid = point.UserId;
//    //var details = Groups.OP_POINTS_ADD.Key + (int)point.Kind; // настраиваем так

//    // удаляем все проводки резервирования
//    await Db.Transactions
//        .Where(t => t.ClientId == keyid)
//        .Where(t => t.Register == Groups.REG_POINTS.Key)
//        .Where(t => t.Operation == Groups.OP_POINTS_ADD.Key)
//        .Where(t => t.Details == details)
//        .DeleteAsync();
//}




///// <summary>
///// Начисление баллов
///// </summary>
//public async Task AddPoints(Point point)  // bool del = false -- отказываемся от удаления
//{
//    //using var t = await Db.BeginTransactionAsync();
//    Db.BeginTransaction1();

//    var keyid = point.UserId;
//    var details = Groups.OP_POINTS_ADD.Key + (int)point.Kind; // настраиваем так

//    //if (del)
//    //{
//    //    // удаляем все проводки резервирования
//    //    await Db.Transactions
//    //        .Where(t => t.ClientId == keyid)
//    //        .Where(t => t.Register == Groups.REG_POINTS.Key)
//    //        .Where(t => t.Operation == Groups.OP_POINTS_ADD.Key)
//    //        .Where(t => t.Details == details)
//    //        .DeleteAsync();
//    //}

//    await addTrans(new Transaction
//    {
//        Register = Groups.REG_POINTS.Key,
//        Operation = Groups.OP_POINTS_ADD.Key,
//        Details = details,
//        Date = point.Date,
//        //KeyId = keyid,
//        OrderId = point.OrderId,
//        ClientId = point.Order?.ClientId ?? point.User.ClientId,
//        RoomId = point.Order?.RoomId,
//        BaseId = point.Order?.Room.BaseId,
//        SphereId = point.Order?.Room.Base.SphereId,
//        DomainId = point.Order?.Room.DomainId,
//        Total = point.Count,
//        Text = point.Description,
//    });

//    //await t.CommitAsync();
//    Db.CommitTransaction1();
//}

#endregion

