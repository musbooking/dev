using Itall;
using LinqToDB;
using My.App.Sys;
using System.Collections.Generic;
using System.Linq;

namespace My.App
{
    /// <summary>
    /// Глобальный кэш приложения
    /// </summary>
    public partial class DbCache  //: AppObject
    {

        public static readonly ListDbCacheLoader<Template> Templates = new ListDbCacheLoader<Template>(db =>
        {
            var res = db.GetTable<Template>()
                //.GetActuals()
                .ToListAsync()
                .Result;
            return res;
        });


        public static readonly ListDbCacheLoader<Permission> Permissions = new ListDbCacheLoader<Permission>(db =>
        {
            var res = db.GetTable<Permission>()
                .ToList();
            return res;
        });

    }

}
