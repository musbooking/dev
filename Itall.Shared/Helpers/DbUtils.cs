using Itall;
using LinqToDB;
using My.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My
{
    /// <summary>
    /// Утилита для работы с типовыми запросами к базе данных
    /// </summary>
    public static partial class DbUtils
    {

        public static IQueryable<T> GetActuals<T>(this IQueryable<T> query, bool doit = true) where T : IArchivable
        {
            return doit ?query.Where(x => x.IsArchive == false) :query;
        }

        public static IEnumerable<T> GetActuals<T>(this IEnumerable<T> query, bool doit = true) where T : IArchivable
        {
            return doit ? query.Where(x => x.IsArchive == false) : query;
        }

        /// <summary>
        /// Переиндексация объектов в соотствии с заданным порядком
        /// </summary>
        public static async Task ReindexAsync<T>(this IQueryable<T> query, int start, Guid[] ids, IQueryable<T> updatequery = null) 
            where T : DbObject, IOrderable
        {
            var indexes = await query
                .Where(x => ids.Contains(x.Id))
                .Select(x => new { x.Id, x.Index })
                .ToDictionaryAsync(x => x.Id, x => x.Index);

            var index = start;
            updatequery = updatequery ?? query;

            foreach (var id in ids)
            {
                var oldindex = indexes[id];
                if (index != oldindex)
                {
                    await updatequery.Finds(id)
                        .Set(x => x.Index, index)
                        .Set(x => x.Updated, DateTime.Now)
                        .UpdateAsync();
                }
                index++;
            }
        }


        /// <summary>
        /// set IsArchive
        /// </summary>
        public static Task ArchiveAsync<T>(this IQueryable<T> items, bool archive) where T : IArchivable
        {
            return items
                .Set(x => x.IsArchive, archive)
                .UpdateAsync();
        }



    }
}

