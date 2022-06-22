using Itall;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{
    /// <summary>
    /// Тип IF-условия правила
    /// </summary>
    public enum OrderRuleIfKind
    {
        SameDate = 1,
        More = 2,
        Less = 3,
    }


    /// <summary>
    /// Тип ELSE-условия правила
    /// </summary>
    public enum OrderRuleThenKind
    {
        Always = 1,
        More = 2,
        Less = 3,
    }





    /// <summary>
    /// Правило изменения бронирования
    /// </summary>
    [Table("order_rules")]
    public class OrderRule: ListItem, IOrderable
    {
        [Column("index")]
        public int Index { get; set; }

        [Column("baseId")]
        public Guid? BaseId { get; set; }
        [Association(ThisKey = "BaseId", OtherKey = "Id")]
        public virtual Base Base { get; set; }

        [Column("kind1")]
        public OrderRuleIfKind IfKind { get; set; }

        [Column("hours1")]
        public int IfHours { get; set; }

        [Column("kind2")]
        public OrderRuleThenKind ThenKind { get; set; }

        [Column("hours2")]
        public int ThenHours { get; set; }

        [Column("sources", Length = 30)]
        public string Sources { get; set; }

        /// <summary>
        /// Является ли правило по умолчанию
        /// </summary>
        [Column("def")]
        public bool IsDefault { get; set; }

        /// <summary>
        /// Закешированные источники для ускорения расчетов
        /// </summary>
        private SourceType[] _CachedSources = null;



        /// <summary>
        /// Проверка правила
        /// </summary>
        public bool Allow(Guid? baseid, DateTime dateCreate, DateTime dateFrom, DateTime? now, SourceType? source)
        {
            // check base
            if (baseid != null && this.BaseId != null && this.BaseId != baseid)
                return false;

            // check souce
            _CachedSources ??= Sources.ToEnums<SourceType>();
            if ( source != null && _CachedSources?.Contains(source.Value) == false )
            {
                return false;  
            }

            // часов между созданием брони и началом бронирования
            var h_dcr_dfrom = (dateFrom - dateCreate).TotalHours;
            // часов до начала бронирования
            var now1 = now ?? DateTime.Now;
            var h_to_dfrom = (dateFrom - now1).TotalHours;
            var h_date = (now1 - dateCreate).TotalHours;
            if (h_dcr_dfrom < 0) return false;  // если создали позже, чем начало - вылет
            if (h_to_dfrom < 0) return false;   // если уже началось - вылет

            var iff = false;
            switch (IfKind)
            {
                case OrderRuleIfKind.SameDate:
                    iff = dateCreate.Year == dateFrom.Year &&
                        dateCreate.Month == dateFrom.Month &&
                        dateCreate.Day == dateFrom.Day;
                    break;

                case OrderRuleIfKind.More:
                    iff = h_dcr_dfrom > IfHours;
                    break;

                case OrderRuleIfKind.Less:
                    iff = h_dcr_dfrom <= IfHours;
                    break;
            }
            if (!iff) return false;

            var then = false;
            switch (ThenKind)
            {
                case OrderRuleThenKind.Always:
                    then = true;
                    break;

                case OrderRuleThenKind.More:  // не позднее чем за..
                    then = h_to_dfrom > ThenHours;
                    break;
                case OrderRuleThenKind.Less: // в течение..
                    then = h_date <= ThenHours;
                    break;
            }

            return then;
        }

        /// <summary>
        /// Отмена доступна до...
        /// </summary>
        public DateTime MaxCancelDate(DateTime dateCreate, DateTime dateFrom)
        {
            switch (ThenKind)
            {
                case OrderRuleThenKind.Always:
                    return dateFrom;

                case OrderRuleThenKind.More: // не позднее чем за..
                    return dateFrom.AddHours(-ThenHours);

                case OrderRuleThenKind.Less: // в течение..
                    return dateCreate.AddHours(ThenHours);
            }
            return dateFrom; // мало ли, отдаем по умолчанию
        }

    }


}
