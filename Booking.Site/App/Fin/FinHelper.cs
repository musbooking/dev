using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using My.App.Orders;
using My.App.Partners;


namespace My.App.Fin
{
    /// <summary>
    /// Тип границы расчетного периода
    /// </summary>
    [Flags]
    public enum PeriodType
    {
        Current = 0x1,
        Previos = 0x2,
        Debt = 0x4,  // долг
    }


    /// <summary>
    /// Параметры расчета тарифа
    /// </summary>
    public class TarifArgs
    {
        public Domain Domain;
        public Guid? SphereId;
        public int Total;
        public OrderStatus Status;
        public bool HasPackage; // Есть ли пакетные предложения в позициях 
    }

}


namespace My
{ 
    using My.App.Fin;


    /// <summary>
    /// Утилиты для расчетов с партнерами
    /// </summary>
    public static class FinHelper
    {
        //// допускаем, что серер регулярно перегружается (раз в день)
        //static DateTime dateMM1 = DateTime.Now.AddMonths(-1).ToMonth1(); // граница долга - 1-е число прошлого мес
        //static DateTime dateM1 = DateTime.Now.ToMonth1(); // 1-е число мес


        /// <summary>
        /// Процессинг изменений оплаты партнера
        /// </summary>
        public static async Task<bool> ApplyPaymentAsync(DomainPaymentContext ctx)
        {
            new DomainDiscountService().ApplyRules(ctx);
            await new DomainStatusJob().ApplyStatusAsync(ctx); // обязательно после Doc
            return true;  // for sync result
        }


        /// <summary>
        /// Получаем список броней, которые необходимо включить в комиссионный инвойс
        /// </summary>
        public static IQueryable<Order> WherePeriod(this IQueryable<Order> orders, PeriodType period)
        {
            var dateMM1 = DateTime.Now.AddMonths(-1).ToMonth1(); // граница долга - 1-е число прошлого мес
            var dateM1 = DateTime.Now.ToMonth1(); // 1-е число мес

            if ((period & PeriodType.Current) > 0) // текущий месяц, с 1-го числа
                orders = orders.Where(x => x.Domain.Period == PeriodKind.ByServiceDate ? x.DateFrom >= dateM1 : x.Date >= dateM1);
            else if ((period & PeriodType.Debt) > 0 && (period & PeriodType.Previos) > 0) // до 1-го числа мес
                orders = orders.Where(x => x.Domain.Period == PeriodKind.ByServiceDate ? x.DateFrom < dateM1 : x.Date < dateM1);
            else if ((period & PeriodType.Previos) > 0) // только пред мес
                orders = orders.Where(x => x.Domain.Period == PeriodKind.ByServiceDate 
                    ? x.DateFrom < dateM1 && x.DateFrom >= dateMM1
                    : x.Date < dateM1 && x.Date >= dateMM1);
            else if ((period & PeriodType.Debt) > 0) // до пред мес
                orders = orders.Where(x => x.Domain.Period == PeriodKind.ByServiceDate ? x.DateFrom < dateMM1 : x.Date < dateMM1);


            //orders = period  -- пока оставим для истории
            //    ? orders.Where(x => x.Domain.Period == PeriodKind.ByServiceDate ? x.DateFrom < date : x.Date < date)
            //    : orders.Where(x => x.Domain.Period == PeriodKind.ByServiceDate ? x.DateFrom >= date : x.Date >= date);

            return orders;
        }

        //public static PeriodType GetPeriod(DateTime date)
        //{
        //    //var date = x.Domain.Period == PeriodKind.ByServiceDate ? x.DateFrom: x.Date;

        //    if (date >= dateM1)
        //        return PeriodType.Current;
        //    if (date < dateMM1)
        //        return PeriodType.Debt;

        //    return PeriodType.Previos;
        //}

        public static IQueryable<Order> WhereInvoices(this IQueryable<Order> orders, bool zeros = true)
        {
            orders = orders
                .Where(x => !x.IgnoreMobComm)
                .Where(x => x.MobComPayId == null)
                .Where(x => x.Status != OrderStatus.Unknown);

            if (zeros)
                orders = orders.Where(x => x.MobComm > 0); // блокируем, тк невозможно пересчитать, теряем нулевые брони

            return orders;
            // .GetActuals();  удаленные ордера теперь считаются в счете, согласно требованию https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/16376/
        }




    }

}