using System;
using System.Collections.Generic;

namespace My.App
{
    /// <summary>
    /// Кэш для списка
    /// </summary>
    /// <typeparam name="T">тип элемента списка</typeparam>
    public class ListDbCacheLoader<T>: DbCacheLoader<List<T>>
    {
        public ListDbCacheLoader(Func<DbConnection, List<T>> creator): base( creator)
        {

        }
    }

    /// <summary>
    /// Кэш для словаря
    /// </summary>
    /// <typeparam name="K">тип ключа</typeparam>
    /// <typeparam name="V">тип значения</typeparam>
    public class DictDbCacheLoader<K,V> : DbCacheLoader<Dictionary<K,V>> 
    {
        public DictDbCacheLoader(Func<DbConnection, Dictionary<K, V>> creator) : base(creator)
        {

        }
    }


    /// <summary>
    /// Create on demand using DB connection
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class DbCacheLoader<T>
    {
        public DbCacheLoader(Func<DbConnection, T> creator)
        {
            _Creator = creator;
        }

        Func<DbConnection, T> _Creator;

        T _Value;

        public T Get()
        {
            lock (this)
            {
                if (_Value == null)
                {
                    using var db = new DbConnection();
                    _Value = _Creator(db);
                }
                return _Value;
            }
        }

        public void Reset()
        {
            lock (this)
            {
                _Value = default(T);
            }
        }
    }
}
