using My.App;
using My.App.Sys;
using Itall;
using LinqToDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using My.App.CRM;
using My.App.Orders;
using My.App.Common;
using System.Linq.Expressions;

namespace My
{
    partial class DbUtils
    {   
        /// <summary>
        /// Возвращаются все опубликованные оценки, которые учитываются в статистике
        /// </summary>
        public static IQueryable<Review> GetPublicReviews(this IQueryable<Review> query)
        {
            return query
                .GetActuals()
                .Where(r => r.Status != ReviewStatus.Moderate && r.Status != ReviewStatus.Cancel);
        }

        /// <summary>
        /// Получение номера телефона -- ошибка выполнения
        /// </summary>
        //public static string GetClientFirstPhone(this IQueryable<Resource> res, Guid? clientid)
        //{
        //    var phone = res //client.Resources
        //        .Where(r => r.ObjectId == clientid)
        //        .Where(r => r.Kind == ResourceKind.ClientPhone)
        //        .Select(r => r.Value)
        //        .FirstOrDefault();
        //    return phone;
        //}


        /// <summary>
        /// Получение инф о канале оплат
        /// </summary>
        public static ChannelInfo GetChannel(IList<App.Fin.PayChannel> channels, Base b)
        {
            var chids = b.ChannelIds.ToGuids();

            if (chids.Length == 0) return null;

            var chid = chids.FirstOrDefault();
            //var channel = channels.GetValueOrDefault2(chid, null);
            var channel = channels.FirstOrDefault(ch => ch.Id == chid);

            if (channel == null) return null; // иногда удаляют канал оплат (втихую)
            
            var res = new ChannelInfo
            {
                //channel.Name,
                //b.IsPrepay,
                Kind = channel.Kind,
                PrepayUrl = channel.PrepayUrl,
                PartPc = channel.PartPc,
                //channel.Forfeit1,
                //channel.Forfeit2,
                //channel.Total1,
                //channel.Total2,
                //b.IsRequest,
                //b.Request,
                //channel.Description,
            };
            return res;
        }

        public class ChannelInfo
        {
            public App.Fin.PayChannelKind Kind;
            public string PrepayUrl;
            public int PartPc;
        }



        public static IQueryable<Client> SearchByText(this IQueryable<Client> query, string text)
        {
            if (string.IsNullOrWhiteSpace(text) || text == "=") return query;

            // = db.Clients;

            //query = searchClients(query, filter, true);
            var words = text.Split(' ').Where(x => !string.IsNullOrWhiteSpace(x));
            foreach (var word in words)
            {
                var phone = MiscUtils.FormatPhone(word);

                query = query
                    .Where(cl =>
                        //x.FirstName.Contains(word) ||
                        //x.LastName.Contains(word, StringComparison.OrdinalIgnoreCase) ||
                        cl.FirstName.LikeNoCase("%" + word + "%") ||
                        cl.LastName.LikeNoCase("%" + word + "%") ||
                        cl.SurName.LikeNoCase("%" + word + "%") ||
                        //x.SurName.Contains(word) ||
                        //x.Email.Contains(word, StringComparison.CurrentCultureIgnoreCase) ||
                        cl.Email.LikeNoCase("%"+word+"%") ||
                        //x.Resources.GetPhones(phone).Count() > 0 ||
                        //("=" + x.BitrixNum).StartsWith(word) ||
                        cl.Resources.Any(r => r.Kind == ResourceKind.ClientPhone && r.Value.Contains(phone) )  
                    );
            }

            //var domain = this.CurUser()?.DomainId;
            return query;
        }

      

        /// <summary>
        /// Получаем список объектов для текущего домена
        /// </summary>
        public static IQueryable<T> GetDomainObjects<T>(this IQueryable<T> query, Guid? domainId, bool all_if_null = false) where T: DbObject
        {
            if (domainId == null)
                return all_if_null ?query :query.Where(x => false); // блокируем засланных казачков
            else
                return query.Where(x=>x.DomainId==domainId);
        }

        /// <summary>
        /// Фильтруем только по 
        /// </summary>
        public static IQueryable<T> GetDomainActuals<T>(this IQueryable<T> query) where T : DbObject
        {
            var d0 = DateTime.Now.ToMidnight(-6);  // там же, рассчитываем относительно красного периода
            return query
                .Where(x => x.Domain.IsArchive == false)
                .Where(x => x.Domain.LimitDate == null || x.Domain.LimitDate >= d0); // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/20534/
        }



        /// <summary>
        /// Получение или создание client part
        /// </summary>
        public static ClientPart GetOrCreateClientPart(this DbConnection db, Guid? clientId, Guid? domainId, byte tval)
        {
            //if (clientId == null || domainId == null) return ClientPart.Empty; // иначе сыпется при создании брони - throw new UserException("Не задан ClientId or DomainID");
            if (clientId == null) return ClientPart.Empty; // иначе сыпется при создании брони - throw new UserException("Не задан ClientId or DomainID");
            if (domainId == null) return null; // throw new UserException("Не задан DomainID");
            if (db == null) throw new ArgumentNullException("Db is null");

            // try to find
            ClientPart part = null;

            lock (typeof(ClientPart))
            {
                part = db.ClientParts.FirstOrDefault(x => x.ClientId == clientId && x.DomainId == domainId);

                if (part == null)
                {
                    part = new ClientPart
                    {
                        ClientId = clientId.Value,
                        DomainId = domainId.Value,
                        _TempEventId = tval>0 ?tval :(byte)40,  // for tests, // чтобы исключить случаи передачи 0
                    };
                    db.CreateInsert(part);
                }
            }
            return part;
        }


        ///// <summary>
        ///// Ищем пользователя по клиенту
        ///// </summary>
        //public static Task<Guid> GetClientUserAsync(this IQueryable<User> users, Guid? clientid)
        //{
        //    var qry = users
        //        .Where(u => u.ClientId == clientid)
        //        .Select(u => u.Id)
        //        .FirstOrDefaultAsync();
        //    return qry;
        //}


        /// <summary>
        /// Ищем пользователя по логину, почте, или телефону
        /// </summary>
        public static Task<User> GetUserAsync(this IQueryable<User> users, string filter)
        {
            if (string.IsNullOrWhiteSpace(filter))
                return Task.FromResult((User)null);
            return users
                .GetActuals()
                .Where(x => x.Login == filter || x.Phone == filter || x.Email == filter)
                .FirstOrDefaultAsync();
        }


        /// <summary>
        /// Ищем клиента по телефону
        /// </summary>
        public static IQueryable<Client> GetClientsByPhoneAsync(this IQueryable<Client> query, string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return query;

            phone = MiscUtils.FormatPhone(phone);

            //return query.Where(x => x.Resources.GetPhones(phone).Count() > 0 );
            return query.Where(x => x.Resources
                .Where(r => r.Kind == ResourceKind.ClientPhone)
                .Where(r => r.Value.Contains(phone))
                .Count() > 0
                );
        }

        /// <summary>
        /// Фильтрация непустых ресурсов как телефонов по клиенту
        /// </summary>
        public static IQueryable<Resource> GetPhones(this IQueryable<Resource> query, Guid? objectId = null, string phone = null)
        {
            query = query
                .WhereIf(objectId != null, r => r.ObjectId == objectId)
                //.Where(r => r.Type == ResourceType.Client)
                .Where(r => r.Kind == ResourceKind.ClientPhone)
                //.Where(r => r.Value != null)
                .WhereIf( !string.IsNullOrWhiteSpace(phone), r => r.Value.Contains(phone), r => r.Value != null);

            return query;
        }





        // bitrix task  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/15814/
        // считаем сумму штрафа = цена комнаты с учетом всех скидок
        //public static int CalcForfeit(this Order order, int discount)
        //{
        //    return SysUtils.Round5(order.RoomSum);
        //}


        public static bool AllowTime(this Base basa, DateTime datefrom, DateTime dateto)
        {
            if (basa == null)
                throw new ArgumentNullException("Не задана база");

            var h1 = datefrom.Hour;
            var h2 = dateto.Hour;
            if (h2 == 0) h2 = 24;

            // считаем выходной или рабочий день
            var weekend = datefrom.IsWeekend();
            var date = datefrom.ToMidnight();
            var dbday = DbCache.Days.Get().Values.FirstOrDefault(x => x.Date == date);
            if (dbday != null)
                weekend = dbday.IsWeekend;

            var hh = weekend ?basa.WeekendHours :basa.WorkHours;
            //return h1 >= ht.From && h2 <= ht.To;
            var res = hh.Any(dh => dh.From <= h1 && h2 <= dh.To);
            return res;
        }

        /// <summary>
        /// Фильтрация по правам доступа к базе
        /// </summary>
        public static IQueryable<T> FilterAllowBases<T>(this IQueryable<T> query, User user, Expression<Func<T, Guid?>> getid) where T : DbObject
        {
            if (user==null || user.Allow(Operations.AllBases)) return query;
            
            var guids = user.BaseGuids();
            Expression<Func<T, bool>> expr = (T x) => guids.Contains( getid.Compile()(x).Value );
            return query.Where(expr);
        }


        /// <summary>
        /// Фильтрация по правам доступа к базе
        /// </summary>
        //public static IQueryable<T> FilterAllowBases<T>(this IQueryable<T> query, User user) where T : DbObject, IBaseSource
        //{
        //    if (user.Allow(Operations.AllBases)) return query;
        //    //var user = login.User as User;
        //    return query.Where(x => user.BaseGuids().Contains( x.BaseId.Value));
        //}

        ///// <summary>
        ///// check if not allows all bases then filter by bases
        ///// </summary>
        //public static IQueryable<Order> FilterAllowBases(this IQueryable<Order> query, User user)
        //{
        //    if (user.Allow(Operations.AllBases)) return query;
        //    //var user = login.User as User;
        //    return query.Where(x => user.BaseGuids().Contains(x.Room.BaseId.Value));
        //}

        ///// <summary>
        ///// check if not allows all bases then filter by bases
        ///// </summary>
        //public static IQueryable<App.Fin.ExpenseItem> FilterAllowBases(this IQueryable<App.Fin.ExpenseItem> query, User user)
        //{
        //    if (user.Allow(Operations.AllBases)) return query;
        //    //var user = login.User as User;
        //    return query.Where(x => user.BaseGuids().Contains(x.Expense.BaseId.Value));
        //}



        public static string TestPhoneExists(this DbConnection db, Guid id, string phone)
        {
            phone = MiscUtils.FormatPhone(phone);

            //var db = this;
            var res = db.Resources
                .Where(x => x.Id != id)
                .GetPhones(null, phone)
                .FirstOrDefault();

            if (res != null)
            {
                var client = db.Clients.FirstOrDefault(x => x.Id == res.ObjectId);
                var text = string.Format("Телефон уже присутствует в базе данных, карточка клиента:  {1} {0} {2}",
                    client?.FirstName, client?.LastName, client?.SurName);
                return text;
            }
            return null;
        }



    }
}


#region --- Misc ----



        //// Bitrix Task: https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/7122/
        //public static int CalcForfeit______old(this Order order, int discount)
        //{
        //    //var order = this;
        //    // Статус “соло” и “дуэт”
        //    // штраф равен стоимости репетиции без дополнительного оборудования 
        //    // БЕЗ УЧЕТА индивидуальной скидки,указанной в карте клиента в системе Битрикс24.
        //    if (order.Group == GroupKind.Solo || order.Group == GroupKind.Duet)
        //        return order.RoomPrice;

        //    //if (order.Group != GroupKind.Group) throw new NotImplementedException(); // это невозможно, но ставим проверку

        //    var forfeit = 0;

        //    // если стоит галочка “акция комнаты” 
        //    // штраф равен стоимости репетиции без дополнительного оборудования 
        //    // БЕЗ УЧЕТА индивидуальной скидки,указанной в карте клиента в системе Битрикс24
        //    var promo = order.Promo;
        //    if (promo != null && !promo.IsArchive)
        //    {
        //        forfeit = order.RoomPrice * (100 - promo.Discount) / 100;
        //        //if (promo.IsAction == true && order.Room.IsPromo)
        //        //    forfeit = order.RoomPrice * (100 - promo.Discount) / 100;
        //        //else
        //        //    forfeit = order.RoomPrice * (100 - promo.Discount) / 100;
        //        return forfeit;
        //    }

        //    var room = order.Room;
        //    if (room != null)
        //    {
        //        if (false) //room.IsPromo)
        //            // если стоит галочка “акция комнаты” 
        //            // штраф равен стоимости репетиции без дополнительного оборудования 
        //            // БЕЗ УЧЕТА индивидуальной скидки,указанной в карте клиента в системе Битрикс24.
        //            forfeit = order.RoomPrice;
        //        else
        //            // штраф равен стоимости репетиции без дополнительного оборудования 
        //            // с учетом индивидуальной скидки,указанной в карте клиента в системе Битрикс24.
        //            forfeit = order.RoomPrice * (100 - discount) / 100;
        //        return forfeit;
        //    }

        //    // штраф равен стоимости репетиции без дополнительного оборудования 
        //    // с учетом индивидуальной скидки,указанной в карте клиента в системе Битрикс24.
        //    //var discount = order.Client?.DomainPart?.Discount ?? 0;
        //    forfeit = order.RoomPrice * (100 - discount) / 100;
        //    return forfeit;
        //}



        ///// <summary>
        ///// check if not allows all bases then filter by bases
        ///// </summary>
        //public static IQueryable<Expense> FilterAllowBases(this IQueryable<Expense> query, Itall.Models.LoginInfo login)
        //{
        //    if (login.Allow(Permission.AllBases)) return query;
        //    var user = login.User as User;
        //    return query.Where(x => user.BaseGuids().Contains(x.BaseId.Value));
        //}

//public static bool AllowRoomTime(Guid? roomId, Guid? baseId, Guid? domainId, DateTime datefrom, DateTime dateto, bool noPromo = false)
//{
//    var h1 = datefrom.Hour;
//    var h2 = dateto.Hour;
//    if (h2 == 0) h2 = 24;
//    var weekend = datefrom.IsWeekend();
//    var date = datefrom.ToMidnight();
//    var dbday = DaysModule.Days.Get().Values.FirstOrDefault(x => x.Date == date);

//    var prices = PricesModule.Prices.Get()
//        .OrderBy(x => x.TimeFrom)
//        .Where(x => x.DomainId == domainId)
//        .Where(x => x.RoomId == roomId || x.RoomId == null && x.BaseId == baseId || x.RoomId == null && x.BaseId == null);

//    if(noPromo) // если не нужно учитывать цены с промо условиями
//        prices = prices.Where(x => x.PromoId == null); // другие пока не рассматриваем

//    if (dbday != null)
//    {
//        weekend = dbday.IsWeekend;
//    }

//    for (var h = h1; h < h2; h++)
//    {
//        var allow = allowHTime(prices, h, weekend);
//        if (!allow) return false;
//    }

//    return true;
//}


//static bool allowHTime(IEnumerable<Price> prices, int h, bool isWeekend)
//{
//    foreach (var price in prices)
//    {
//        if (price.TimeFrom <= h && h < price.TimeTo)
//        {
//            var v = isWeekend ? price.WeekendPrice : price.WorkingPrice;
//            if (v > 0) return true;
//        }
//    }
//    return false;
//}



///// <summary>
///// Ищем клиента по почте, или телефону
///// </summary>
//public static Task<Client> GetClient(this IQueryable<Client> query, AppDb db, string phone, string email)
//{
//    if (!string.IsNullOrWhiteSpace(phone))
//    {
//        query = query.GetClientsByPhone(db, phone);
//    }
//    else if (!string.IsNullOrWhiteSpace(email))
//        query = query.Where(x => x.Email.Contains(email));

//    return query.FirstOrDefaultAsync();
//}


///// <summary>
///// Поиск телефона клиента
///// </summary>
//public static IEnumerable<Resource> Phones(this Client client) , string phone = null)
//{
//    //var res = client.Resources
//    //    .Where(x => x.Type == ResourceType.Client && x.Kind == ResourceKind.Phone)
//    //    .FirstOrDefault();

//    var res = client.Resources
//        .Where(r => r.Type == ResourceType.Client)
//        .Where(r => r.Kind == ResourceKind.Phone);

//    if(!string.IsNullOrWhiteSpace(phone))
//        res = res.Where(r => r.Value.Contains(phone));

//    return res;
//}


//var ids = db.Resources
//    .Where(r => r.Type == ResourceType.Client && r.Kind == ResourceKind.Phone)
//    .Where(r => r.Value.Contains(phone))
//    .Select(r => r.ObjectId)
//    .ToArray();

//query = 
//    from x in query
//    //var res = x.Resources
//    //    .Where(r => r.Type==ResourceType.Client && r.Kind==ResourceKind.Phone)
//    //    .Select(r=>r.Value)
//    //where res.Contains(phone)
//    where ids.Contains(x.Id)
//    select x;

//return query;
#endregion

