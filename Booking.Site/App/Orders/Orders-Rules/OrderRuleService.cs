using Itall;
using LinqToDB;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{
    public class CanCancelArgs
    {
        public Guid? Base { get; set; }
        public DateTime DateCreate { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime? Now { get; set; } = null;
        public bool HasForfeits { get; set; }
        public SourceType Source { get; set; }
    }

    public class OrderRuleService: DbService
    {
        /// <summary>
        /// Поиск правил, удовлетворяющих ограничениям
        /// </summary>
        public async Task<IEnumerable<OrderRule>> FindRulesAsync( CanCancelArgs args )  //Guid? baseId, DateTime dateCreate, DateTime dateFrom, DateTime? now)
        {
            var baseDomainId = await Db.Bases
                .Finds(args.Base)
                .Select(b => b.DomainId)
                .FirstOrDefaultAsync();

            return FindRules(baseDomainId, args.Base, args.DateCreate, args.DateFrom, args.Now, args.Source);
        }


        /// <summary>
        /// Доп. фуункция поиска правил
        /// </summary>
        public IEnumerable<OrderRule> FindRules(
            Guid? base_domain_id, 
            Guid? base_id, 
            DateTime date_created,
            DateTime date_from,
            DateTime? now = null,
            SourceType? source = null)
        {
            var order_rules = DbCache.OrderRules.Get()
                .GetActuals();

            if (base_id != null)
            {
                var base_exists = order_rules.Any(r => r.BaseId == base_id || r.DomainId == base_domain_id);
                if (!base_exists)
                {
                    var def_rules = DbCache.OrderRulesAll.Get()
                        .GetActuals()
                        .OrderBy(r => r.Index)
                        .Where(r => r.IsDefault)
                        .Where(r => r.Allow(null, date_created, date_from, now, source)); // используем правила по умолчанию Enum2.GetEnum( ANY_RULE );  // 54481 Если для базы не заданы правила отмены, то отмена... всегда
                    return def_rules;
                }
            }

            var res_rules =
                from r in order_rules
                orderby r.Index
                where !r.IsArchive
                where !r.IsDefault
                where r.DomainId == base_domain_id //user.DomainId
                select r;

            var res_allows_rules =                     // для отладки разбиваем на 2 части
                from r in res_rules
                where r.Allow(base_id, date_created, date_from, now, source)
                select r;

            return res_allows_rules;
        }

        ///// <summary>
        ///// Спец. правило для баз без правил
        ///// </summary>
        //static readonly OrderRule ANY_RULE = new OrderRule { Name = "Разрешение для баз без правил", ThenKind = OrderRuleThenKind.Always };

    }


}
