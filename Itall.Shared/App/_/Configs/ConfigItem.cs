using Itall;
using LinqToDB;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;

namespace My.App
{

    /// <summary>
    /// Конфигурационный элемент для хранения в БД
    /// </summary>
    [Table("config")]
    public partial class ConfigItem : DbObject, IArchivable
    {

        /// <summary>
        /// Ключ, по которому происходит сопоставление
        /// </summary>
        [Column("name")]
        public string Name { get; set; }

        [Column("descr", Length = 0)]
        public string Description { get; set; }

        ///// <summary>
        ///// Системный параметр
        ///// </summary>
        //[Column("sys")]
        //public bool IsSystem { get; set; }

        [Column("arch")]
        public bool IsArchive { get; set; }

        [Column("text", Length = 0)]
        public string AsText { get; set; }

        [Column("date")]
        public DateTime? AsDate { get; set; }

        [Column("int")]
        public long? AsLong { get; set; }

        public int AsInt
        {
            get { return (int)(AsLong ?? 0); }
            set { AsLong = value; }
        }

        [Column("bool")]
        public bool? AsBool { get; set; }

        [Column("money")]
        public decimal? AsMoney { get; set; }

        [Column("number")]
        public double? AsNumber { get; set; }

        /// <summary>
        /// Общее значение
        /// </summary>
        [Column("val", Length = 0)]
        public string AsVal { get; set; }

        /// <summary>
        /// Общее значение 1
        /// </summary>
        [Column("val1", Length = 0)]
        public string AsVal1 { get; set; }        
        
        /// <summary>
        /// Общее значение 2
        /// </summary>
        [Column("val2", Length = 0)]
        public string AsVal2 { get; set; }        
        
        /// <summary>
        /// Общее значение 3
        /// </summary>
        [Column("val3", Length = 0)]
        public string AsVal3 { get; set; }

    }


    public static class Configs
    {
        // public ITable<ConfigItem> Configs => GetTable<ConfigItem>();
        static List<ConfigItem> _Items = null;
        static object LockObject = new object();


        ///// <summary>
        ///// Сброс закешированного списка
        ///// </summary>
        //public static void Reset()
        //{
        //    _Items = null;
        //    Load();
        //}

        public static EventHandler OnLoad = null;


        /// <summary>
        /// Получение элемента конфигурации
        /// </summary>
        public static ConfigItem Get(string name, bool createDefault = false, bool error = false)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name must be not empty");


            var res = Gets(name).FirstOrDefault();
            //var res = await this.GetTable<ConfigItem>()
            //    .FirstOrDefaultAsync(x => x.Name == name);
            if (res == null && error)
                throw new UserException("Не задано значение конфигурации " + name);

            if (res == null && createDefault)
            {
                res = new ConfigItem
                {
                    Name = name,
                };
                _Items.Add(res);
            }
            return res;
        }

        /// <summary>
        /// Получение списка параметров
        /// </summary>
        public static IEnumerable<ConfigItem> Gets(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                yield break;

            if (_Items == null)
                Reload();

            var name2 = name.Trim().ToLowerInvariant();
            foreach (var item in _Items.Where(x => x.Name.Trim().ToLowerInvariant() == name))
            {
                yield return item;
            }
        }


        public static void Reload()
        {
            //if (reset)
                //Reset();
                //_Items = null;

            //if (_Items == null) // если еще не загружали
            {
                lock (LockObject) // блокируем, чтобы не перехватили
                {
                    using var db = new DbConnection();
                    _Items = db.GetTable<ConfigItem>()
                        .GetActuals()
                        .ToList();

                    OnLoad?.Invoke(_Items, EventArgs.Empty);
                }
            }

        }
    }


}

