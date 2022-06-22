using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{
    [Table("rooms")]
    public class Room: DbObject, IArchivable
    {
        public static Room Empty = new Room
        {
            Base = Base.Empty,
        };

        [Column("name", Length = 150)]
        public string Name { get; set; }

        [Column("baseId")]
        [Itall.Index]
        public Guid? BaseId { get; set; }
        [Association(ThisKey = "BaseId", OtherKey = "Id")]
        public virtual Base Base { get; set; }

        [Column("shareId")]
        public Guid? ShareId { get; set; }
        [Association(ThisKey = "ShareId", OtherKey = "Id")]
        public virtual Room Share { get; set; }

        //[Column("")]
        //public int ShareCode { get; set; }

        /// <summary>
        /// Список каналов # 56767
        /// </summary>
        [Column("channels", Length = 0)]
        public string ChannelIds { get; set; }

        [Column("square")]
        public int Square { get; set; }

        [Column("order")]
        public int Order { get; set; }

        //[Column("", Length = 0)]
        //public string Description { get; set; }

        [Column("raider", Length = 0)]
        public string Raider { get; set; }

        [Column("features", Length = 0)]
        public string Features { get; set; }

        [Column("hours0", Length = 0)]
        public string DefaultHours { get; set; }

        [Column("hours1", Length = 0)]
        public string WeekendHours { get; set; }

        [Column("hours2", Length = 0)]
        public string TodayHours { get; set; }

        [Column("hours3", Length = 0)]
        public string TodayWkHours { get; set; }

        [Column("minhours", Length = 20)]
        public string MinHours { get; set; }        
        
        /// <summary>
        /// Кол0во часов до начала заказа 
        /// </summary>
        [Column("hbefore")]
        public float HoursBefore { get; set; }

        /// <summary>
        /// Проверка условия по лимиту комнаты
        /// </summary>
        public bool CheckHoursBefore(TimeSpan ts)
        {
            var res =
                //Status == OrderStatus.Reserv &&
                HoursBefore == 0 ||
                ts.TotalHours >= HoursBefore;
            return res;
        }



        [Column("mobile")]
        public bool AllowMobile { get; set; }

        [Column("isArchive")]
        public bool IsArchive { get; set; }

        [Column("color", Length = 10)]
        public string Color { get; set; }

        [Column("videoUrl", Length = 0)]
        public string VideoUrl { get; set; }


        //[Column("")]
        //public Guid? CalendarId { get; set; }
        //[Association(ThisKey = "CalendarId", OtherKey = "Id")]
        //public virtual Calendars.Calendar Calendar { get; set; }

        [Association(ThisKey = "Id", OtherKey = "RoomId")]
        public virtual List<Price> Prices { get; set; }

        /// <summary>
        /// Список избранных отметов
        /// </summary>
        [Association(ThisKey = "Id", OtherKey = "RoomId")]
        public virtual List<CRM.Favorite> Favorites { get; set; }
        
        /// <summary>
        /// Список отзывов
        /// </summary>
        [Association(ThisKey = "Id", OtherKey = "RoomId")]
        public virtual List<CRM.Review> Reviews { get; set; }
    }
}
