using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using My.App.Orders;

namespace My.App.Partners
{
    /// <summary>
    /// Сервис тарифной обработки изменения статуса брони (начисление мобильной комиссии)
    /// </summary>
    public class TarifService //: Itall.Services.IService<OrderContext>
    {
        //static Operations.MobCommOper _oper = new Operations.MobCommOper();

        public async Task RunAsync(OrderContext context)
        {
            var action = context.Action;
            var order = context.Order;

            switch (action)
            {
                case OrderAction.Reserv:
                case OrderAction.Close:
                    var res = CalcCommission(context.Db, order);
                    if (!res) return;

                    // иначе генерим транзакции
                    var ts_svc = new Fin.TransService { Db = context.Db, User = context.CurUser };
                    await ts_svc.TarifCommissionAsync(order);

                    break;

                case OrderAction.CancelNormal:
                case OrderAction.CancelForfeitConfirm:  // добавлено подтверждение 
                    order.MobComm = 0; // отмена мобильной комиссии https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/35745/
                    var ts_svc2 = new Fin.TransService { Db = context.Db, User = context.CurUser };
                    await ts_svc2.TarifCommissionClearAsync(order.Id);
                    break;

                default:
                    return;
            }

            await context.Db.UpdateAsync(order);

            if (!order.IgnoreMobComm && order.MobComm > 0)
            {
                var msg = new Common.Message
                {
                    ClientId = order?.ClientId,
                    Date = DateTime.Now,
                    Kind = Common.MessageKind.User,
                    OrderId = order?.Id,
                    Text = $"Начислена мобильная комиссия на сумму {order.MobComm} руб. ",
                    Scope = ScopeType.Zone,
                };
                await context.Db.CreateInsertAsync(msg);
            }
        }

        static readonly SourceType[] MOBILE_TYPES = { 
            SourceType.Mobile,
            //SourceType.MobilePre, // предоплаты включены согласно 53909
            SourceType.Catalog,
            //SourceType.CatalogPre
        };

        /// <summary>
        /// Процедура расчета мобильной комиссии
        /// </summary>
        public static bool CalcCommission(DbConnection db, Order order)
        {
            // если выставлено игнорировать, то игнорим
            if (order.IgnoreMobComm) return false;

            order.IgnoreMobComm = true;

            // считаем только мобильные заказы
            //if (order.SourceType != SourceType.Mobile && order.SourceType != SourceType.Catalog) return false;
            if ( !MOBILE_TYPES.Contains( order.SourceType) ) return false;

            // если не задан текущий тариф, то игнорим комиссию
            var domain = order.Domain;
            var tarif = domain?.Tarif;
            if (tarif == null) return false;


            //if (tarif.HasTarifs) // если у тарифа есть подтарифы
            //{
            //    var dict = TarifsController.Tarifs.Get();
            //    var tarif1 = dict[tarif.Id]; // находим закешированный тариф с таким же ИД (для )
            //    var sphid = order.Room?.Base?.SphereId.Value ?? Guid.Empty;  // находим ид сферы, по которой бронь
            //    // находим более адекватный тариф по сфере
            //    var tarif2 = tarif1.CachedTarifs.FirstOrDefault(x => x.CachedSphereIds.Contains(sphid));
            //    tarif = tarif2 ?? tarif;
            //}

            // расчет суммы оплат налом и возвратов
            var qtrans = db.Transactions.Where(t => t.OrderId == order.Id);
            var total = qtrans.BalanceAsync(
                Fin.Groups.REG_CLIENTS, 
                Fin.Groups.OP_CLIENTS_PAYMENT_RUB,
                Fin.Groups.DET_CLIENTS_PAYMENT_CASH, 
                Fin.Groups.DET_CLIENTS_PAYMENT_AUTOBACK, 
                Fin.Groups.DET_CLIENTS_PAYMENT_AUTOBACK_TINKOFF, 
                Fin.Groups.DET_CLIENTS_PAYMENT_AUTOCACH
                ).Result;

            var args = new Fin.TarifArgs
            {
                Domain = domain,
                SphereId = order.Room?.Base?.SphereId,
                // Total = order.GetTotalSum(),  /// #52891 - использовать вместо TotalOrder - TotalSum
                Total = total, // 53909 считаем сумму по кэшу
                Status = order.Status,
                HasPackage = order.HasPackage,
            };
            order.MobComm = CalcCommission(args); // domain, order.Room?.Base?.SphereId.Value ?? Guid.Empty, order.TotalSum, order.Status); 
            // Convert.ToInt32(tarif.Commission * order.TotalSum / 100.0) + tarif.Price1;
            order.IgnoreMobComm = false;
            return true;
        }



        /// <summary>
        /// Процедура расчета мобильной комиссии
        /// </summary>
        public static int CalcCommission(Fin.TarifArgs args) //this Domain domain, Guid sphid, int total, DocumentStatus status)
        {
            var tarif = args.Domain?.Tarif;

            if (tarif.HasTarifs) // если у тарифа есть подтарифы
            {
                var dict = App.DbCache.Tarifs.Get();
                var tarif_cached = dict[tarif.Id]; // находим закешированный тариф с таким же ИД (для )
                //var sphid = order.Room?.Base?.SphereId.Value ?? Guid.Empty;  // находим ид сферы, по которой бронь

                // находим более адекватный тариф по сфере
                var tarif2 = tarif_cached.Children
                    .WhereIf(args.HasPackage, 
                        t => t.DestKind == EqDestKind.Package,   // если есть пакеты - используем пакетный тариф https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/34979/?current_fieldset=SOCSERV
                        t => t.CachedSphereIds.Contains(args.SphereId ?? Guid.Empty)
                    ).FirstOrDefault();

                tarif = tarif2 ?? tarif;
            }

            // если у партнера только оплаченные и бронь в резерве - 0
            // считаем для всех по другой опции, согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/22994/
            var perc = 0;
            if (args.Domain.IsPayment && tarif.PayCommission > 0) //&& status == DocumentStatus.Paid)
            {
                if (args.Status != OrderStatus.Closed) return 0;
                perc = tarif.PayCommission;
            }
            else
            {
                perc = tarif.Commission;
            }

            var comm = Convert.ToInt32(perc * args.Total / 100.0) + tarif.Price1;
            return comm;
        }




    }
}