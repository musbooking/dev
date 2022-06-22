using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{
    [Table("bases")]
    public class Base: DbObject, IArchivable, IBaseSource
    {
        public static Base Empty = new Base
        {
        };


        [Column("name", Length = 150, CanBeNull = false)]
        public string Name { get; set; }

        [Column("description" ,Length = 0)]
        public string Description { get; set; }

        [Column("rules_description", Length = 0)]
        public string Rules { get; set; }

        //[Column("")]
        //public BaseType Type { get; set; }

        [Column("sphereId")]
        [DisplayName("Сфера")]
        [PropertyTab(GROUP_NAME)]
        public Guid? SphereId { get; set; }
        [Association(ThisKey = "SphereId", OtherKey = "Id")]
        public virtual Sphere Sphere { get; set; }




        /// <summary>
        /// Логотип комнаты
        /// </summary>
        [Column("logo", Length = 0)]
        public string Logo { get; set; }

        [Column("channels", Length = 0)]
        public string ChannelIds { get; set; }

        /// <summary>
        /// Предоплата
        /// </summary>
        public bool IsPrepay => !string.IsNullOrWhiteSpace(ChannelIds);

        /// <summary>
        /// Предоплата только по заявке
        /// </summary>
        [Column("isRequest")]
        public bool IsRequest { get; set; }

        [Column("isArchive")]
        public bool IsArchive { get; set; }

        /// <summary>
        /// Описание заявки
        /// </summary>
        [Column("request",Length = 0)]
        public string Request { get; set; }

        [Column("address", Length = 0)]
        public string Address { get; set; }

        //[Column("", Length = 0)]
        //public string InfoUrl { get; set; }

        [Column("metro", Length = 0)]
        public string Metro { get; set; }

        [Column("cityId")]
        [DisplayName("Город")]
        [PropertyTab(GROUP_NAME)]
        public Guid? CityId { get; set; }
        [Association(ThisKey = "CityId", OtherKey = "Id")]
        public virtual CRM.Group City { get; set; }

        [Column("direction", Length = 0)]
        public string Direction { get; set; }

        [Column("phones", Length = 0)]
        public string Phones { get; set; }

        [Column("email", Length = 0)]
        public string Email { get; set; }


        /// <summary>
        /// Макс. % оплаты по базе
        /// </summary>
        [Column("max_points_pc")]
        public int MaxPointsPcPay { get; set; }


        [Column("workTime", Length = 30)]
        public string WorkTime { get; set; }

        [Column("weekendTime", Length = 30)]
        public string WeekendTime { get; set; }


        [Column("gpsLong")]
        public double GpsLong { get; set; }

        [Column("gpsLat")]
        public double GpsLat { get; set; }

        [Column("videoUrl", Length = 0)]
        public string VideoUrl { get; set; }

        /// <summary>
        /// Правила выделения времени - выходные, рабочие, ночные, и тп..
        /// </summary>
        [Column("timeRules", Length = 0)]
        public string TimeRules { get; set; }

        [Association(ThisKey = "Id", OtherKey = "BaseId")]
        public virtual List<Room> Rooms { get; set; }

        //[Association(ThisKey = "BaseId", OtherKey = "BaseId")]
        //public virtual Room FirstRoom { get; set; }

        public HoursSpan[] WorkHours
        {
            get
            {
                var h = HoursSpan.Parse(WorkTime).ToArray();
                return h;// ?? new HoursSpan();
            }
        }

        public HoursSpan[] WeekendHours
        {
            get
            {
                var h = HoursSpan.Parse(WeekendTime).ToArray();
                return h; // ?? new HoursSpan();
            }
        }

        //[LinqToDB.Sql.Expression("id", , IsPredicate = true)]
        public Guid? BaseId => Id;
    }

    //public enum BaseType
    //{
    //    [Description("Репетиции")]
    //    RehearsalBase = 10,

    //    [Description("Танцы")]
    //    DanceHall = 20,

    //    [Description("Звукозапись")]
    //    RecordingStudio = 30,
    //}
}
