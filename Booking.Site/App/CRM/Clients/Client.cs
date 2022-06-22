using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy-security;
using LinqToDB.Mapping;
using Itall;
using LinqToDB.Data;
using LinqToDB;
using System.ComponentModel;

namespace My.App.CRM
{
    //public enum ClientCreatorType
    //{
    //    Mobile = 1,
    //    Domain = 2,
    //}

    [Table("clients")]
    public class Client : DbObject
    {
        public static Client Empty = new Client
        {
        };


        public Client()
        {
        }

        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);

            this.Notifications = Enum2.ToIntsString(NotifyKind.Reserv | NotifyKind.Payment | NotifyKind.Cancel | NotifyKind.Forfeit | NotifyKind.Review); 
        }


        [Column("firstName", Length = 150)]
        [DisplayName("Имя")]
        public string FirstName { get; set; }

        [Column("lastName", Length = 150)]
        [DisplayName("Фамилия")]
        public string LastName { get; set; }

        [Column("surName", Length = 150)]
        [DisplayName("Отчество")]
        public string SurName { get; set; }

        [Column("email", Length = 150)]
        [DisplayName("e-mail")]
        public string Email { get; set; }

        [Column("dateBirthday")]
        [DisplayName("Дата рождения")]
        public DateTime? DateBirthday { get; set; }

        [Column("bitrixNum", Length = 10)]
        public string BitrixNum { get; set; }

        /// <summary>
        /// Фотография
        /// </summary>
        [Column("photoUrl", Length = 0)]
        public string PhotoUrl { get; set; }


        [Column("sourceUrl", Length = 0)]
        [DisplayName("Источник")]
        public string SourceUrl { get; set; }

        [Column("vkUrl", Length = 0)]
        [DisplayName("VK")]
        public string VkUrl { get; set; }

        [Column("music", Length = 0)]
        [DisplayName("Жанр")]
        public string Music { get; set; }

        [Column("typeInfo", Length = 50)]
        [DisplayName("Тип")]
        public string TypeInfo { get; set; }



        /// <summary>
        /// Ожидание синхронизации
        /// </summary>
        [Column("sync")]
        public bool InSync { get; set; }

        [Column("isBanned")]
        public bool IsImportedFromBitrix { get; set; }

        [Column("groupId")]
        [DisplayName("Группа")]
        [TypeConverter(GROUP_NAME)]
        public Guid? GroupId { get; set; }
        [Association(ThisKey = "GroupId", OtherKey = "Id")]
        public virtual Group Group { get; set; }

        [Column("groupIds", Length = 0)]
        //[DisplayName("Группа")]
        public string Groups { get; set; }

        /// <summary>
        /// Список сфер
        /// </summary>
        [Column("spheres", Length = 0)]
        public string Spheres { get; set; }

        [Column("types", Length = 0)]
        public string Types { get; set; }

        [Column("genres", Length = 0)]
        public string Genres { get; set; }

        [Column("styles", Length = 0)]
        public string Styles { get; set; }

        [Column("tools", Length = 0)]
        public string Tools { get; set; }


        [Column("gender", Length = 2)]
        public string Gender { get; set; }

        [Column("cityId")]
        [DisplayName("Город")]
        [PropertyTab(GROUP_NAME)]
        public Guid? CityId { get; set; }
        [Association(ThisKey = "CityId", OtherKey = "Id")]
        public virtual Group City { get; set; }


        [Column("sourceId")]
        [DisplayName("Навыки")]
        public Guid? SourceId { get; set; }
        [Association(ThisKey = "SourceId", OtherKey = "Id")]
        public virtual Group Source { get; set; }

        [Column("notifications", Length = 10)]
        [TypeConverter(typeof(NotifyKind))] // to refactiong
        public string Notifications { get; set; }

        // проверка нотификации клиента
        public bool CheckNotification(NotifyKind kind)
        {
            var notifications = Notifications.ToEnums<NotifyKind>();
            return   // возвращаем, только если выбрано
                notifications != null &&
                notifications.Contains(kind);
        }


        [Association(ThisKey = "Id", OtherKey = "ClientId")]
        public virtual List<Orders.Order> Orders { get; set; }

        [Association(ThisKey = "Id", OtherKey = "ClientId")]
        public virtual List<Orders.Abonement> Abonements { get; set; }

        [Association(ThisKey = "Id", OtherKey = "ClientId")]
        public List<ClientPart> Parts;

        /// <summary>
        /// Полный список всех ресурсов. Обязательно фильтровать по типу!!!
        /// </summary>
        [Association(ThisKey = "Id", OtherKey = "ObjectId")]
        public IQueryable<Common.Resource> Resources;

        //public string FirstPhone => this.Resources
        //            .Where(r => r.Kind == Common.ResourceKind.ClientPhone)
        //            .Select(r => r.Value)
        //            .FirstOrDefault();

        [Association(ThisKey = "Id", OtherKey = "ClientId")]
        public virtual List<Common.Message> Messages { get; set; }

        public string FIO => $" {LastName} {FirstName} {SurName}";

        /// <summary>
        /// Связанный логин
        /// </summary>
        [Association(ThisKey = "Id", OtherKey = "ClientId", IsBackReference = true)]
        public virtual Sys.User User { get; set; }

        public string CreatorDomain
        {
            get
            {
                var client = this;
                var owner = client.DomainId == null || client.Domain.IsArchive ? "Мобильный" : client.Domain.Name;
                return owner;
            }
        }


        public string ToString(bool full)
        {
            if (full)
                return $" {LastName} {FirstName} {SurName}  {MiscUtils.HideMailChars(Email)} "; //{Utils.HidePhoneChars(Phones)}
            else
                return $" {LastName} {FirstName} {SurName}";
        }

        public IdValue<Guid> ToIdValue()
        {
            return new IdValue<Guid> { Id = Id, Value = ToString(true), };
        }


        /// <summary>
        /// Проверка заполненности профиля
        /// </summary>
        public byte GetFillFactor()
        {

            byte check(params object[] args)
            {
                var n = args.Count(a => a != null);
                return (byte)(n * 100 / args.Length);
            }

            var res = check(
                FirstName,
                Email,
                LastName,
                PhotoUrl,
                Gender,
                CityId,
                VkUrl,
                SourceUrl,
                Spheres,
                Types,
                Genres,
                Styles,
                Tools,
                SourceId,
                Music,
                DateBirthday
            );
            return res;
        }


        public override string ToString()
        {
            return FIO;
        }


    }

}



#region Misc



//[Column("", Length = 50)]
//[DisplayName("Push ID")]
//public string PushID { get; set; }
//[Column("", Length = 0)]
//public string Phones { get; set; }

//[Column("", Length = 0)]
//public string Comments { get; set; }

//[Column("", Length = 0)]
//public string Post { get; set; }
//[Column("")]
//public int Forfeit { get; set; }

//[Column("", Length = 15)]
//public string PromoCode { get; set; }

//[Column("", Length = 15)]
//public string CardNum { get; set; }

//[Column("")]
//public int Discount { get; set; }

//public dynamic ToInfo()
//{
//    return new
//    {
//        FirstName,
//        LastName,
//        SurName,
//        Phones,
//        Email,
//    };
//}

//[Column("")]
//[DisplayName("Тип")]
//[PropertyTab(GROUP_NAME)]
//public Guid? TypeId { get; set; }
//[Association(ThisKey = "TypeId", OtherKey = "Id")]
//public virtual Group Type { get; set; }


//[Column("")]
//[DisplayName("Стиль")]
//[PropertyTab(GROUP_NAME)]
//public Guid? StyleId { get; set; }
//[Association(ThisKey = "StyleId", OtherKey = "Id")]
//public virtual Group Style { get; set; }

//[Column("")]
//[DisplayName("Инструмент")]
//[PropertyTab(GROUP_NAME)]
//public Guid? ToolId { get; set; }
//[Association(ThisKey = "ToolId", OtherKey = "Id")]
//public virtual Group Tool { get; set; }

//[Column("", Length = 3)]
//[DisplayName("ОС")]
//public string OS { get; set; }

//[Column("")]
//[DisplayName("Деятельность")]
//[PropertyTab(GROUP_NAME)]
//public Guid? ActivityId { get; set; }
//[Association(ThisKey = "ActivityId", OtherKey = "Id")]
//public virtual Group Activity { get; set; }

//[Column("")]
//[DisplayName("Жанр")]
//[PropertyTab(GROUP_NAME)]
//public Guid? GenreId { get; set; }
//[Association(ThisKey = "GenreId", OtherKey = "Id")]
//public virtual Group Genre { get; set; }

#endregion
