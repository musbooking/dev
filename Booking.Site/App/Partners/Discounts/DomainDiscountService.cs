using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using My.App;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using Itall.Services;
using Microsoft.Extensions.Configuration;

namespace My.App.Partners
{
    /// <summary>
    /// Сервис автоматического расчета скидки при оплате домена в зависимости от кол-ва мес оплаты
    /// </summary>
    public class DomainDiscountService
    {
        public static void Config(IConfigurationSection config)
        {
            var _Rules = config.Get<List<RateDiscountRule>>();

            //_Rules = config.ToObject<List<RateDiscountRule>>();
            // сортируем для удобства поиска
            _Rules = _Rules.OrderByDescending(x=>x.Periods).ToList();
        }

        static List<RateDiscountRule> _Rules = new List<RateDiscountRule>();

        public void ApplyRules(DomainPaymentContext context)
        {
            // используем первое подходящее правило
            // сортировка гарантирует, что вначале идут правила с макс числом периодов
            foreach (var rule in _Rules)
            {
                if (rule.Apply(context))
                    return;
            }
        }

    }

    /// <summary>
    /// Параметры сервиса при оплате домена
    /// </summary>
    public class DomainPaymentContext : ServiceContext
    {
        public Fin.PayDoc Document;
        public Domain Domain;
    }

    /// <summary>
    /// Правила расчета скидки, формируются автоматически из файла конфигурации
    /// </summary>
    class RateDiscountRule
    {
        public int Periods { get; set; }
        public int Days { get; set; }
        public int Months { get; set; }

        public bool Apply(DomainPaymentContext ctx)
        {
            if (ctx.Document.Count < Periods)
                return false;
            if (Days > 0)
                ctx.Domain.LimitDate = ctx.Domain.LimitDate.Value.AddDays(Days);
            if (Months > 0)
                ctx.Domain.LimitDate = ctx.Domain.LimitDate.Value.AddMonths(Months);
            return true;
        }

        public override string ToString()
        {
            return $"За {Periods} - {Days}, {Months}";
        }
    }
}