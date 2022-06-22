using My.App.Sys;
using LinqToDB;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Itall;
using LinqToDB.Data;

namespace My.App.Partners
{
    /// <summary>
    /// Сервисный класс для управления партнерским доменом
    /// </summary>
    public class DomainService: DbService
    {
        const string SUPER_ROLE = "super";

        /// <summary>
        /// Проверка домена при регистрации и изменениях
        /// </summary>
        public void CheckDomain(Domain domain)
        {
            // проверяем уникальное название
            var dname = domain.Name?.ToLower().Trim();
            var exists = Db.Domains
                .WhereIf(!domain.IsNew(), d => d.Id != domain.Id)
                .Where(d => d.Name.ToLower().Trim() == dname)
                .Any();

            if (exists)
                throw new UserException("Уже есть партнерская зона с таким именем: " + domain.Name);
        }




        /// <summary>
        /// Параметры регистрации партнерской зоны
        /// </summary>
        public class RegArgs
        {
            public string Name { get; set; }
            public string Description { get; set; }

            public string Login { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }

            public Guid? City { get; set; }
            public Guid[] Spheres { get; set; }
            //public string[] Opers { get; set; }
            public Guid? User { get; set; }

            public bool IsOk()
            {
                if (string.IsNullOrWhiteSpace(Name)) return false;
                if (string.IsNullOrWhiteSpace(Email)) return false;
                if (City == null) return false;
                if (Spheres == null || Spheres.Length == 0) return false;

                Name = Name.Trim();
                Email = Email.Trim();
                return true;
            }
        }


        /// <summary>
        /// Регистрация партнерской зоны
        /// </summary>
        public async Task<(Domain domain, User user)> RegistryAsync(RegArgs args)
        {
            if (!args.IsOk())
                throw new UserException("Ошибка в данных");

            // проверка уникальности логина
            var phone = MiscUtils.FormatPhone(args.Phone);
            var email = args.Email?.Trim();
            var user = await Db.Users
                .WhereIf(args.User != null, u => u.Id == args.User)
                .WhereIf(args.User == null, 
                    u => 
                        args.Login!=null && u.Login == args.Login ||
                        phone!=null && (u.Login == phone || u.Phone == phone) ||
                        email != null && (u.Login == email || u.Email == email)
                    ) 
                .FirstOrDefaultAsync();

            args.Email ??= user?.Email;
            args.Phone ??= user?.Phone;


            // Создаем партнерскую зону
            var domain = new Domain
            {
                CityId = args.City,
                Email = args.Email,
                Phone = args.Phone,
                InitDate = DateTime.Now,
                CreateDate = DateTime.Now,
                Name = args.Name,
                Description = args.Description,
                //Period = PeriodKind.
                Status = DomainStatus.New, // .Mamual,
                SphereIds = string.Join(",", args.Spheres),
            };

            // проверяем перед сохранением в БД
            CheckDomain(domain);
  
            Db.BeginTransaction();
            await Db.CreateInsertAsync(domain);

            // Создаем роль админа
            var role = new Sys.Role
            {
                DomainId = domain.Id,
                Name = SUPER_ROLE,
                Description = "Администраторы системы",
            };
            await Db.CreateInsertAsync(role);

            // создаем пермиции - значения по умолчанию
            var sopers = "lists,list-bases,bases-all,list-eq,promo,clients,orders,order-cancel,order-cancel-any,order-delete,order-edit,order-edit-group,order-edit-payd,order-forfeit,order-new,order-view-full,order-view-quick,users";
            var opers = sopers.Split(",");
            var newPermissions =
                from x in opers // info.Opers
                select new Permission
                {
                    Id = Guid.NewGuid(),
                    DomainId = domain.Id,
                    Operation = x,
                    Roles = SUPER_ROLE,
                    Updated = DateTime.Now,
                };

            Db.BulkCopy(newPermissions);

            string psw = null;

            if (user == null)
            {
                // Создаем пользователя
                psw = SysUtils.CreatePassword();
                var hash = String2.HashPassword(psw);

                user = new User
                {
                    Login = args.Email,
                    //Password = psw,
                    Email = args.Email,
                    Name = "Администратор " + args.Name,
                    Hash = hash,
                    IsArchive = false,
                    IsConfirmed = true,
                    Roles = SUPER_ROLE,
                    DomainId = domain.Id,
                };
                await Db.CreateInsertAsync(user);
            }
            else
            {
                // работаем с существующим пользователем
                if (args.User != null)
                    throw new UserException("Пользователь с данным ИД не найден");
                if(user.IsArchive)                    
                    throw new UserException($"Пользователь {user.Login} удален");
                if(user.DomainId != null)
                    throw new UserException($"Пользователь {user.Login} уже привязан к другой партнерской зоне");

                await Db.Finds(user)
                    .Set(u => u.DomainId, domain.Id)
                    .SetIf( user.Roles== null, u => u.Roles, SUPER_ROLE)
                    .SetIf( user.Roles!= null && !user.Roles.Contains(SUPER_ROLE), u => u.Roles, u => u.Roles + "," + SUPER_ROLE)
                    .UpdateAsync();
            }

            Db.CommitTransaction();

            var data = new
            {
                User = user,
                Domain = domain,
                Password = psw,
            };
            //App.AddMailTask(info.Email, "domain-registration", data);
            App.AddDbMailJob(args.Email, data, Db, domain.Id, Sys.TemplateKind.DomainRegistration);

            var mainEmail = Configs.Get("domain-reg-email");
            if (!string.IsNullOrWhiteSpace(mainEmail.AsText))
                App.AddDbMailJob(mainEmail.AsText, data, Db, domain.Id, Sys.TemplateKind.DomainRegistration);

            // add user domain
            user.AddUserDomain( Db, domain.Id);

            return (domain, user);
        }



        /// <summary>
        /// Инициализация партнерской зоны
        /// </summary>
        public async Task InitAsync(Guid? id, string[] operations)
        {
            Domain domain = null;
            if(id!=null) 
                domain = await Db.Domains.FindAsync(id);

            var role = await Db.Roles
                .Where(x => x.DomainId == id)
                .Where(x => x.Name == SUPER_ROLE)
                .FirstOrDefaultAsync();

            if (role == null)
            {
                role = new Sys.Role
                {
                    DomainId = id,
                    Name = SUPER_ROLE,
                    Description = "Администраторы системы",
                };
                await Db.CreateInsertAsync(role);
            }

            var permissions = await Db.Permissions
                .Where(x => x.DomainId == id)
                .Select(x => x.Operation)
                .ToListAsync();

            var newPermissions =
                from x in operations
                where !permissions.Contains(x)
                select new Permission
                {
                    Id = Guid.NewGuid(),
                    DomainId = id,
                    Operation = x,
                    Roles = SUPER_ROLE,
                    Updated = DateTime.Now,
                };

            Db.BulkCopy(newPermissions);

            //if (!domain.AllowShare) - 58623 - сейчас всегда чистим старые пермиции
            //var delPermissions = Db.Permissions
            //    .Where(x => x.DomainId == id)
            //    .Where(x => !operations.Contains(x.Operation))
            //    .Delete();

            if (domain != null)  /// сохраняем значения инициализации
            {
                domain.InitDate = DateTime.Now;
                await Db.UpdateAsync(domain);
            }
        }


        /// <summary>
        /// Сброс партнерской зоны
        /// </summary>
        public async Task<(User user, string password)> ResetAsync(Guid id)
        {
            var domain = await Db.Domains.FindAsync(id);

            var role = await Db.Roles
                .Where(x => x.DomainId == id)
                .Where(x => x.Name == SUPER_ROLE)
                .FirstOrDefaultAsync();

            if (role == null)
                throw new UserException("Сначала необходимо инициализировать зону");

            var login = domain.Name.ToLower().ToIdent().Trim();
            var user = await Db.Users.GetUserAsync(login);

            var psw = SysUtils.CreatePassword();
            var hash = String2.HashPassword(psw);

            if (user == null)
            {
                user = new User
                {
                    Login = login,
                    //Password = psw,
                    Hash = hash,
                    IsArchive = false,
                    IsConfirmed = true,
                    Roles = SUPER_ROLE,
                    DomainId = id,
                };
                await Db.CreateInsertAsync(user);
            }
            else
            {
                user.Hash = hash;
                await Db.UpdateAsync(user);
            }

            return (user, psw);
        }
    }

}
