using Itall;
using Itall.Models;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using My.App.CRM;
using My.App.Fin;
using My.App.Orders;
using My.App.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My
{
    /// <summary>
    /// Дополненительный метода расчета баланса
    /// </summary>
    public static class TransHelper
    {

        /// <summary>
        /// Параметры поиска
        /// </summary>
        public class SearchArgs
        {
            public DateTime? Dfrom { get; set; }
            public DateTime? Dto { get; set; }

            public int? Register { get; set; }
            public int? Operation { get; set; }
            public int? Details { get; set; }

            public Guid? Domain { get; set; }
            public Guid? Sphere { get; set; }
            public Guid? Client { get; set; }
            public Guid? Order { get; set; }

            public Guid? Base { get; set; } // = Convert<Guid?>(args.@base);

            public Guid? Room { get; set; }

            //[ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] SourceFilterKind[] sources,
            //[ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))] SourceType[] sourceTypes,

            [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))]
            public Guid[] Eqtypes { get; set; } = new Guid[0];

            public int Page { get; set; }  // skip page 
            public int Limit { get; set; } = 100; // take
        }


        public class SearchResult
        {
            public Guid Id { get; set; }
            public int Register { get; set; }
            public int Operation { get; set; }
            public int Details { get; set; }
            public DateTime Date { get; set; }
            public Guid? ClientId { get; set; }
            public string Client { get; set; }
            public Guid? OrderId { get; set; }
            public string Domain { get; set; }
            public string Sphere { get; set; }
            public string Base { get; set; }
            public string Room { get; set; }
            public string Promo { get; set; }
            public int Total { get; set; }
            public string Text { get; set; }
        }


        /// <summary>
        /// Поиск транзакций
        /// </summary>
        public static IQueryable<SearchResult> Search(this IQueryable<Transaction> query, SearchArgs args)
        {

            var qtrans_where = query
                .WhereIf(args.Dfrom != null, t => t.Date >= args.Dfrom.Value.Date)
                .WhereIf(args.Dto != null, t => t.Date <= args.Dto.Value.AddDays(1).Date)
                .WhereIf(args.Register != null, t => t.Register == args.Register)
                .WhereIf(args.Client != null, t => t.ClientId == args.Client)
                .WhereIf(args.Order != null, t => t.OrderId == args.Order)
                .WhereIf(args.Operation != null, t => t.Operation == args.Operation)
                .WhereIf(args.Details != null, t => t.Details == args.Details)
                .WhereIf(args.Sphere != null, t => t.SphereId == args.Sphere)
                .WhereIf(args.Base != null, t => t.BaseId == args.Base)
                .WhereIf(args.Room != null, t => t.RoomId == args.Room)
                .WhereIf(args.Domain != null, t => t.DomainId == args.Domain)
                .WhereIf(args.Eqtypes.Length > 0, t => args.Eqtypes.Contains(t.GroupId.Value))
                ;


            var qtrans_sel =
                from t in qtrans_where
                let op = Groups.Dict[t.Operation]
                let det = Groups.Dict[t.Details] // может отсутствовать
                select new SearchResult
                {
                    Id = t.Id,
                    Register = t.Register,
                    Operation = t.Operation,
                    Details = t.Details,
                    //Register = Groups.Name( t.Register ),
                    //Operation = Groups.Name( t.Operation ),
                    //Details = Groups.Name( t.Details ),
                    Date = t.Date,
                    ClientId = t.ClientId,
                    Client = t.Client.FirstName + " " + t.Client.LastName,
                    OrderId = t.OrderId,
                    Domain = t.Domain.Name,
                    Sphere = t.Sphere.Name,
                    Base = t.Base.Name,
                    Room = t.Room.Name,
                    Promo = t.Promo.Name,
                    //Total = t.Total * op.Sign * (det == null ? 1 : det.Sign),
                    Total = t.Total * op.Sign * (det == null ? 1 : det.Sign),
                    //TotalS = $"{t.Total} * {op.Sign} * {(det == null ? 1 : det.Sign)}",
                    Text = t.Text,
                };

            if (args.Page > 0)
            {
                qtrans_sel = qtrans_sel
                    .Skip((args.Page - 1) * args.Limit)
                    .Take(args.Limit);
            }

            return qtrans_sel;
        }



        /// <summary>
        /// Расчет суммы баланса по транзакциям
        /// </summary>
        public static int Balance(this IEnumerable<Transaction> list, params Groups.Row[] groups)
        {
            var keys = getKeys(groups);

            var list1 = list
                .WhereIf(keys.reg?.Count > 0, t => keys.reg.Contains(t.Register))
                .WhereIf(keys.op?.Count > 0, t => keys.op.Contains(t.Operation))
                .WhereIf(keys.det?.Count > 0, t => keys.det.Contains(t.Details));


            var list2 =
                from t in list1
                let op = Groups.Dict[t.Operation]
                let det = Groups.Dict[t.Details] // может отсутствовать
                select t.Total * (op?.Sign ?? 1) * (det?.Sign ?? 1);

            return list2.Sum();
        }


        /// <summary>
        /// Расчет суммы баланса по запросу транзакций
        /// </summary>
        public static async Task<int> BalanceAsync(this IQueryable<Transaction> query, params Groups.Row[] groups)
        {
            var keys = getKeys(groups);

            var qtrans1 = query
                .WhereIf(keys.reg?.Count> 0, t => keys.reg.Contains(t.Register))
                .WhereIf(keys.op?.Count > 0, t => keys.op.Contains(t.Operation))
                .WhereIf(keys.det?.Count > 0, t => keys.det.Contains( t.Details) );

            var qtrans2 =
                from t in qtrans1
                select new
                {
                    t.Operation,
                    t.Details,
                    t.Total
                };

            var trlist = await qtrans2.ToListAsync();

            var sumList =
                from t in trlist
                let op = Groups.Dict[t.Operation]
                let det = Groups.Dict[t.Details] // может отсутствовать
                select t.Total * (op != null ? op.Sign : 1) * (det != null ? det.Sign : 1);

            return sumList.Sum();
        }

        /// <summary>
        /// Получение списка ИД групп
        /// </summary>
        static (List<int> reg, List<int> op, List<int> det) getKeys(params Groups.Row[] groups)
        {
            var reg_keys = groups?
                .Where(g => g.Lvl == 1)
                .Select(d => d.Key)
                .ToList();

            var op_keys = groups?
                .Where(g => g.Lvl == 2)
                .Select(d => d.Key)
                .ToList();

            var details_keys = groups?
                .Where(g => g.Lvl == 3)
                .Select(d => d.Key)
                .ToList();

            return (reg_keys, op_keys, details_keys);
        }

    }
}




#region --- Misc ----



        /// <summary>
        /// Расчет баланса как запроса
        /// </summary>
        //public static int Balance2(this IQueryable<Transaction> query) ///, Groups.Row register, Groups.Row operation = null, Groups.Row details = null)
        //{
        //    //var query1 = query
        //    //    .Where(t => t.Register == register.Key)
        //    //    .WhereIf(operation != null, t => t.Operation == operation.Key)
        //    //    .WhereIf(details != null, t => t.Details == details.Key);

        //    var sumList =
        //        from t in query
        //        select t.Total * (Groups.ROWS_SIGN_LESS_0.Contains(t.Operation) ?-1 : 1) * (Groups.ROWS_SIGN_LESS_0.Contains(t.Details) ? -1 : 1);

                        //    .Select(t => t.Total*
                        //(Fin.Groups.ROWS_SIGN_LESS_0.Contains(t.Operation)? -1 : 1) * 
                        //(Fin.Groups.ROWS_SIGN_LESS_0.Contains(t.Details)? -1 : 1) )

        //    return sumList.Sum();
        //}

        ///// <summary>
        /////  Сумма оплат по транзакциям - вынесена отдельно
        ///     !!! не компилится в Join
        ///// </summary>
        //public static int BalancePays(this IQueryable<Transaction> query)
        //{
        //    // сумма оплат
        //    var payments = query
        //        //.Where(t => t.OrderId == o.Id)
        //        .Where(t => t.Register == My.App.Fin.Groups.REG_CLIENTS.Key)
        //        .Where(t => t.Operation == My.App.Fin.Groups.OP_CLIENTS_PAYMENT_RUB.Key)
        //        .Sum(t => t.Total);
        //    return payments;
        //}


///// <summary>
///// Расчет суммы баланса по транзакциям
///// </summary>
//public static int Balance(this IEnumerable<Transaction> list, Groups.Row register, Groups.Row operation = null, Groups.Row details = null)
//{
//    list = list
//        .Where(t => t.Register == register.Key)
//        .WhereIf(operation != null, t => t.Operation == operation.Key)
//        .WhereIf(details != null, t => t.Details == details.Key);
//    return list.BalanceSum();
//}

///// <summary>
///// Расчет суммы по балансу на основе списка
///// </summary>
//public static int BalanceSum(this IEnumerable<Transaction> list)
//{
//    var list1 =
//        from t in list
//        let op = Groups.Dict[t.Operation]
//        let det = Groups.Dict[t.Details] // может отсутствовать
//        select t.Total * (op?.Sign ?? 1) * (det?.Sign ?? 1);

//    return list1.Sum();
//}


//public static int Balance2(this IQueryable<Transaction> query, Groups.Row register, Groups.Row operation) //, Groups.Row details = null)
//{
//    var query1 = query
//        .Where(t => t.Register == register.Key)
//        .Where(t => t.Operation == operation.Key)
//        //.WhereIf(details != null, t => t.Details == details.Key)
//        .Select(t => new
//        {
//            t.Operation, 
//            t.Details, 
//            t.Total
//        });

//    var list = query1.ToList();

//    var sumList =
//        from t in list
//        let op = Groups.Dict[t.Operation]
//        let det = Groups.Dict[t.Details] // может отсутствовать
//        select t.Total * (op != null ?op.Sign :1) * (det!=null ?det.Sign :1);

//    return sumList.Sum();
//}

///// <summary>
///// Получение сальдо по штрафам - отказываемся, считаем по ClientPart
///// </summary>
//public static async Task<int> ForfeitAsync(this DbConnection db, Guid? domainId, Guid? clientId)
//{
//    var res = await db.GetTable<Transaction>()
//        .WhereIf(domainId!=null, x => x.DomainId == domainId)
//        .Where(x => x.ClientId == clientId)
//        .BalanceAsync(Groups.REG_FORFEITS);
//    return -res;
//}

#endregion
