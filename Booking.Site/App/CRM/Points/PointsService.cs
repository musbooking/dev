using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Itall.Models;
using LinqToDB.Data;
using Itall;
using LinqToDB;
using System.ComponentModel;
using Microsoft.Extensions.Configuration;
using My.App.Orders;

namespace My.App.CRM
{
    /// <summary>
    /// Сервис создания баллов
    /// </summary>
    public class __old__PointsService : DbService
    {

        static int PointsForRegistration => Configs.Get("points-reg").AsInt;
        static int PointsForInvite => Configs.Get("points-invite").AsInt;
        static int PointsForProfile => Configs.Get("points-profile").AsInt;
        //static double PointsPcForBooking => Configs.Get("points%-booking").AsNumber ?? 0;
        // список параметров для разных баз
        static IEnumerable<ConfigItem> PointsPcForBooking => Configs.Gets("points%-booking").OrderByDescending(x => (x.AsVal + "").Length);

        // виды расходных операций
        public static readonly PointKind[] POINTS_RASHOD = {
            PointKind.Payment,
            PointKind.RetBooking,
        };


        ///// <summary>
        ///// Получение баланса по списку баллов
        ///// </summary>
        //public static int GetBalance(IQueryable<Point> points)
        //{
        //    var balance = points
        //        .Sum(p => p.Count * (POINTS_RASHOD.Contains(p.Kind) ? -1 : 1));
        //    return balance;
        //}

        /// <summary>
        /// Поиск % за регистрацию с учетом партнеров
        /// </summary>
        public static double GetDomainPointPc(Guid? domainId, Orders.SourceType? source)
        {
            var domid = domainId ?? Guid.Empty;

            var qry = PointsPcForBooking
                .WhereIf(domainId != null, c => string.IsNullOrWhiteSpace(c.AsVal) || c.AsVal.ToGuids().Contains(domid))  // проверка по ид зоны
                .WhereIf(source != null, c => string.IsNullOrWhiteSpace(c.AsVal1) || c.AsVal1.ToInts().Contains((int)source)); // проверка по источнику

            var cf = qry.FirstOrDefault();

            var pc = cf?.AsNumber ?? 0;
            return pc;
        }


        /// <summary>
        /// Начисления при регистрации
        /// </summary>
        public Task OnRegistrationAsync(Sys.User user)
        {
            var p = PointsForRegistration;
            var point = new Point
            {
                Date = DateTime.Now,
                Count = p,
                CreatedById = CurrentUser?.Id,
                Kind = PointKind.Registration,
                UserId = user.Id,
                User = user,
                Description = $"Начисление {p} баллов за регистрацию",
            };
            return create(point);
        }        
        


        /// <summary>
        /// Начисления при оплате, при повторной оплате удаляем старые начисления
        /// </summary>
        public async Task<Point> OnPaymentAsync(Orders.Order order, Sys.User user)
        {
            var kind = PointKind.Booking;
            var pc = GetDomainPointPc(order.Room.Base.DomainId, order.SourceType);
            var cnt = Convert.ToInt32( order.TotalOrder * pc / 100 );
            var text = $"Начисление {cnt}= {order.TotalOrder} x {pc}%  баллов за оплату брони";

            if (cnt == 0) return null;

            // удаляем старые начисления
            var dels = await Db.Points
                .Where(p => p.UserId == user.Id)
                .Where(p => p.Kind == kind)
                .Where(p => p.OrderId == order.Id)
                .DeleteAsync();

            var point = new Point
            {
                Date = DateTime.Now,
                Count = cnt,
                CreatedById = CurrentUser?.Id,
                Kind = kind,
                UserId = user.Id,
                User = user,
                Description = text,
                Order = order,
                OrderId = order.Id,
            };
            await create(point, true);

            // Проверяем начисление пригласившему пользователя
            if(user.InviteId != null)
            {
                // смотрим, было ли уже такое начисление
                var dels2 = await Db.Points
                    .Where(p => p.UserId == user.InviteId)
                    .Where(p => p.Kind == PointKind.Invite)
                    .DeleteAsync();

                user.Invite = user.Invite ?? await Db.Users.FindAsync(user.InviteId); // если что - ищем приглашенного пользователя
                var point2 = new Point
                {
                    Date = DateTime.Now,
                    Count = PointsForInvite,
                    CreatedById = CurrentUser?.Id,
                    Kind = PointKind.Invite,
                    UserId = user.InviteId, //  user.Id, task 45621
                    User = user.Invite,
                    Order = order,
                    OrderId = order.Id,
                    Description = $"Начисление за пришглашенного пользователя {user.FIO} при первой оплате брони",
                };
                await create(point2, true);
            }

            return point;
        }

        /// <summary>
        /// Возврат начислений при отмене
        /// </summary>
        public async Task<Point> OnBookingCancelAsync(Orders.Order order, Sys.User user)
        {
            var cnt = order.PointsSum; //Convert.ToInt32(order.TotalSum * PointsPcForBooking / 100);
            var text = $"Возврат {cnt} баллов при отмене или пересчете";

            if (cnt == 0)  // Возвращать-то нечего!! Казна пуста!
                return null;

            var point = new Point
            {
                Date = DateTime.Now,
                Count = cnt,
                CreatedById = CurrentUser?.Id,
                Kind = PointKind.RetBooking,
                UserId = user.Id,
                User = user,
                Description = text,
                Order = order,
                OrderId = order.Id,
            };
            await create(point);
            return point;
        }


        /// <summary>
        /// Оплата баллами
        /// </summary>
        public async Task<Point> OnPointsPaymentAsync(Orders.Order order, Sys.User user)
        {
            if (order.PointsSum == 0) return null;

            // смотрим, было ли уже такое начисление
            var dels = await Db.Points
                .Where(p => p.UserId == user.Id)
                .Where(p => p.Kind == PointKind.Payment)
                .Where(p => p.OrderId == order.Id)
                .DeleteAsync();

            var point = new Point
            {
                Date = DateTime.Now,
                Count = order.PointsSum,
                CreatedById = CurrentUser?.Id,
                Kind = PointKind.Payment,
                UserId = user.Id,
                User = user, 
                Order = order,
                OrderId = order.Id,
                Description = $"Оплата баллами заказа: {order.Room.Name} на дату: {order.DateFrom}",
            };
            await create(point, true);
            return point;
        }

        ///// <summary>
        ///// Изменение начисления по оплатам
        ///// </summary>
        //public Task<int> OnPaymentChangeAsync(Guid? orderid, int newpayment)
        //{
        //    if (orderid == null) return Task.FromResult(0);

        //    var res = Db.Points
        //        .Where(p => p.Kind == PointKind.Payment)
        //        .Where(p => p.OrderId == orderid)
        //        .Set( p => p.Count, newpayment)
        //        .UpdateAsync();

        //    return res;
        //}


        public Task<bool> CheckProfileAsync(Guid userid)
        {
            // смотрим, было ли уже такое начисление
            var exists = Db.Points
                .Where(p => p.UserId == userid)
                .Where(p => p.Kind == PointKind.Profile)
                .AnyAsync();
            return exists;
        }

        /// <summary>
        /// Начисления при изменении профиля
        /// </summary>
        public async Task<Point> OnProfileAsync(Sys.User user)
        {
            var exists = await CheckProfileAsync(user.Id);
            if (exists) return null;

            var n = PointsForProfile;
            var point = new Point
            {
                Date = DateTime.Now,
                Count = n,
                CreatedById = CurrentUser?.Id,
                Kind = PointKind.Profile,
                UserId = user.Id,
                User = user,
                Description = $"Начисление баллов за заполнение профиля",
            };
            await create(point);
            return point;
        }

        /// <summary>
        /// Собственно создание начислений
        /// </summary>
        async Task create(Point point, bool del = false)
        {
            //var tsvc = new Fin.TransService { Db = Db };
            //await tsvc.AddPoints( point);  // отказываемся от удаления

            await Db.CreateInsertAsync(point);
        }

    }
}


#region -- misc --
//public class ConfigData
//{
//    public int Registration { get; set; }
//    public int Payment { get; set; }
//    public int Invite { get; set; }
//    public int Profile { get; set; }
//}

//if (userid == null)
//{
//    userid = await Db.Users
//        .GetActuals()
//        .Where(u => u.ClientId == order.ClientId)
//        .Select(u => u.Id)
//        .FirstOrDefaultAsync();
//}

//protected static ConfigData _Configs = new ConfigData();

//public static void Config(IConfiguration config)
//{
//    config.Bind(_Configs);
//}
/// <summary>
/// Расчет баланса 
/// </summary>
//public static int GetBalance(DbConnection db, Guid userid)
//{
//    var balance = db.Points
//        //.Where(p => p.PromoId == promoid && p.UserId == userid)
//        .Where(p => p.UserId == userid)
//        .Sum(p => p.Count * (POINTS_RASHOD.Contains(p.Kind) ? -1 : 1));
//    return balance;
//}

#endregion
