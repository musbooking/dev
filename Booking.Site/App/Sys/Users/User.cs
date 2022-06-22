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

namespace My.App.Sys
{
    public enum UserKind
    {
        Customer = 1,
        Partner = 2,
        Moderator = 3,
    }

    partial class User: ListItem
    {
        public User()
        {

        }

        [Column("login", Length = 100)]
        [Index]
        public string Login { get; set; }

        [Column("email", Length = 150)]
        public string Email { get; set; }

        [Column("phone", Length = 20)]
        public string Phone { get; set; }

        //[Column("isAdmin")]
        //public bool IsAdmin { get; set; }


        [Column("isClosed")] // для совместимости
        public new bool IsArchive { get; set; }

        [Column("dateCreated")]
        public DateTime? DateCreated { get; set; }

        /// <summary>
        /// % заполненности
        /// </summary>
        [Column("fill")]
        public byte FillFactor{ get; set; }

        /// <summary>
        /// Тип пользователя 40383 
        /// </summary>
        public UserKind GetKind() =>
            (string.IsNullOrWhiteSpace(Roles)) ? UserKind.Customer
            : (Roles.Contains("superadmin") || this.IsSuper()) ? UserKind.Moderator  //Domain?.AllowShare == true
            : UserKind.Partner;


    public string[] GetRolesAsArray()
        {
            if (string.IsNullOrWhiteSpace(Roles)) return new string[] { "guest" };
            return Roles.Split(',');
        }

        static readonly string[] DEFAULT_CLAIMS = { };
        public IEnumerable<string> Claims
        {
            get
            {
                return GetRolesAsArray();
                //return DEFAULT_CLAIMS;
            }
        }

        //[InverseProperty("User")]
        //public virtual List<Resource> Resources { get; set; }

        [Column("bitrixNum", Length = 20)]
        public string BitrixNum { get; set; }

        [Column("fio", Length = 0)]
        public string FIO { get; set; }


        /// <summary>
        /// Firebase Cloud Messanging Token
        /// </summary>
        [Column("fcm", Length = 0)]
        public string Fcm { get; set; }

        [Column("baseIds", Length = 0)]
        public string BaseIds { get; set; }

        Guid[] _BaseGuids = null;

        public Guid[] BaseGuids()
        {
            if (_BaseGuids == null)
                _BaseGuids = BaseIds.ToGuids();
            return _BaseGuids;
        }

        [Column("domains", Length = 0)]
        public string DomainIds { get; set; }



        Guid[] _DomainGuids = null;

        public Guid[] DomainGuids(Guid? domainId = null)
        {
            if (domainId != null)
            {
                //DomainIds = (string.IsNullOrWhiteSpace(DomainIds) ? "" : DomainIds + ",") + domainId.ToString();
                var ids = DomainIds.ToGuids().Append(domainId.Value).Distinct();
                DomainIds = string.Join(',', ids);
                _DomainGuids = null;
            }
            if (_DomainGuids == null)
                _DomainGuids = DomainIds.ToGuids();
            return _DomainGuids;
        }


        /// <summary>
        /// Добавляем пользователю партнерскую зону
        /// </summary>
        public void AddUserDomain(DbConnection db, Guid? domainId)
        {
            this.DomainGuids(domainId);

            db.Finds(this)
                .Set(x => x.DomainIds, this.DomainIds)
                .Update();
        }


        /// <summary>
        /// Почта подтверждена
        /// </summary>
        [Column("isConfirmed")]
        public bool IsConfirmed { get; set; }


        /// <summary>
        /// ССылка на клиента, привязанного к пользователю
        /// </summary>
        [Column("clientId")]
        public Guid? ClientId { get; set; }
        [Association(ThisKey = "ClientId", OtherKey = "Id")]
        public virtual CRM.Client Client { get; set; }

        /// <summary>
        /// Пользователь, который пригласил данного пользователя
        /// </summary>
        [Column("inviteId")]
        public Guid? InviteId { get; set; }
        /// <summary>
        /// Пригласивший пользователь
        /// </summary>
        [Association(ThisKey = "InviteId", OtherKey = "Id")]
        public Sys.User Invite { get; set; }

        [Column("invcode", Length = 10)]
        public string InviteCode { get; set; }

        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);
            this.DateCreated = DateTime.Now;
            var usvc = new UserService { Db = (DbConnection)db };
            InviteCode = usvc.GetNextInviteCode();
        }

        public const int LIMIT_DAYS = 7;

        public bool IsLimited(int d = LIMIT_DAYS)
        {
            return this.Domain?.CheckLimit(d) == false;
        }


        public override string ToString()
        {
            return Login;
        }

    }
}



