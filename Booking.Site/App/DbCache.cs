using Itall;
using LinqToDB;
using LinqToDB.Mapping;
using My.App.Common;
using My.App.CRM;
using My.App.Fin;
using My.App.Orders;
using My.App.Partners;
using My.App.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App
{
    /// <summary>
    /// Глобальный кэш сайта
    /// </summary>
    partial class DbCache
    {
        /// <summary>
        /// Кэш групп
        /// </summary>
        public static readonly DictDbCacheLoader<Guid, Group> Groups = new DictDbCacheLoader<Guid, Group>( db =>
        {
            var res = db.Groups
                .LoadWith(x => x.Domain)
                .LoadWith(x => x.Category)
                .ToDictionary(x => x.Id);
            return res;
        });


        public static readonly ListDbCacheLoader<Promotion> Promotions = new ListDbCacheLoader<Promotion>( db =>
        {
            var res = db.Promotions
                //.LoadWith(x => x.)
                .GetActuals()
                .Where(x => x.Type == PromoKind.Rule || x.Type == PromoKind.Hot)
                .ToList();
            return res;
        });


        /// <summary>
        /// Кэш списка правил
        /// </summary>
        public static readonly ListDbCacheLoader<OrderRule> OrderRules = new ListDbCacheLoader<OrderRule>( db => 
        {
            var res = db.OrderRules
                .Where(r => !r.IsDefault)
                .ToList();
            return res;
        });


        public static readonly ListDbCacheLoader<OrderRule> OrderRulesAll = new ListDbCacheLoader<OrderRule>( db => 
        {
            var res = db.OrderRules
                .ToList();
            return res;
        });

        /// <summary>
        /// Кэш каналов оплат
        /// </summary>
        public static readonly ListDbCacheLoader<PayChannel> PayChannels = new ListDbCacheLoader<PayChannel>( db =>
        {
            var res = db.PayChannels
                .GetActuals()
                .ToList();
            return res;
        });

        /// <summary>
        /// Получаем список каналов по списку ids и/или партнеру
        /// </summary>
        public static IEnumerable<PayChannel> GetChannels(string ids, Guid? domainid = null)
        {
            var chids = ids.ToGuids();

            if (chids.Length == 0 && domainid == null)  // 84063
                return Enum2.GetEmpty<PayChannel>();

            var chpays = DbCache.PayChannels.Get()
                .WhereIf(chids.Length > 0, ch => chids.Contains(ch.Id))
                .WhereIf(domainid != null, ch => ch.DomainId == domainid);
                //.WhereIf(chids.Length==0 && domainid == null, ch => false);
            return chpays;
        }


        public static readonly DictDbCacheLoader<Guid, Sphere> Spheres = new DictDbCacheLoader<Guid, Sphere>( db =>
        {
            var res = db.Spheres
                .LoadWith(x => x.Domain)
                .ToDictionary(x => x.Id);
            return res;
        });



        /// <summary>
        /// Кэш с ценами
        /// </summary>
        public static readonly ListDbCacheLoader<Price> Prices = new ListDbCacheLoader<Price>( db =>
        {
            var res = db.Prices
                .LoadWith(x => x.Promo)
                //.LoadWith(x => x.Base)
                //.LoadWith(x => x.Room.Base)
                .LoadWith(x => x.Room)
                .GetActuals()
                .ToList();
            return res;
        });


        //public class EqInfo
        //{
        //    public Guid Id { get; set; }
        //    public string Value { get; set; }
        //    public string GroupName { get; set; }
        //    //public Guid? GroupId { get; set; }
        //    public string Base { get; set; }
        //}

        ///// <summary>
        ///// Кэш оборудования
        ///// </summary>
        //public static readonly ListDbCacheLoader<EqInfo> EqNames  = new ListDbCacheLoader<EqInfo>( db =>
        //{
        //    var res = db.Equipments
        //        .LoadWith(x => x.Group)
        //        .LoadWith(x => x.Base)
        //        .Select(x => new EqInfo
        //        {
        //            Id = x.Id,
        //            Value = x.Name,
        //            GroupName = x.Group.Name,
        //            Base = x.Base.Name,
        //        })
        //        .ToList();
        //    return res;
        //});        
        
        /// <summary>
        /// Загрузка имен
        /// </summary>
        public static readonly DictDbCacheLoader<Guid, Equipment> Equipments = new DictDbCacheLoader<Guid, Equipment>( db =>
        {
            var res = db.Equipments
                .LoadWith(x => x.Group)
                .ToDictionary(x => x.Id); //, x => new { x.Name, GroupName = x.Group.Name, x.GroupId,  });
            return res;
        });


        public static readonly DictDbCacheLoader<Guid, Tarif> Tarifs = new DictDbCacheLoader<Guid, Tarif>( db =>
        {
            var res = db.GetTable<Tarif>()
                .ToDictionary(x => x.Id);
            var list = res.Values;
            // кэшируем значения для быстрого расчета тарифов
            foreach (var item in list)
            {
                item.CachedSphereIds = item.SphereIds.ToGuids();
                var ids = item.TarifIds.ToGuids();
                item.Children = list
                    .Where(x => ids.Contains(x.Id))
                    .ToArray();
            }
            return res;
        });


        /// <summary>
        /// Список дней
        /// </summary>
        public static readonly DictDbCacheLoader<Guid, Day> Days = new DictDbCacheLoader<Guid, Day>( db =>
        {
            var res = db.GetTable<Day>()
                .ToDictionary(x => x.Id);
            return res;
        });


        public static readonly DictDbCacheLoader<Guid, DiscountRule> DiscountRules = new DictDbCacheLoader<Guid, DiscountRule>( db =>
        {
            var res = db.DiscountRules
                .ToDictionary(x => x.Id);
            return res;
        });


        public static readonly DictDbCacheLoader<Guid, AccessRule> AccessRules = new DictDbCacheLoader<Guid, AccessRule>( db =>
        {
            //var res = db.GetTable<Models.Day>().ToDictionary(x => x.Id);
            var res = db.AccessRules
                .Where(x => x.IsDisabled == false)
                .ToDictionary(x => x.Id);
            return res;
        });

    }

}
