using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itall.App.Data;
using Itall.App.Auth;
using Microsoft.AspNetCore.Http;
using Itall;

namespace My.App.Sys
{
    /// <summary>
    /// Провайдер авторизации приложения
    /// </summary>
    public class UserLoginProvider : Itall.App.Auth.ILoginProvider2
    {
        /// <summary>
        /// Непосредственно вход в систему
        /// </summary>
        ILogin ILoginProvider2.Login(HttpContext http, string login, string password)
        {
            using var db = new DbConnection();

            var user = getUsers(db)
                .Where(u => u.Login == login)
                .FirstOrDefault();

            if (user == null)
                throw new UserException("Пользователь не найден: "+ login);

            if (!Itall.String2.VerifyHashedPassword(user.Hash, password))
                throw new Itall.UserException("Пароль неверен");

            loadUserProps(db, user);

            return user;
        }

        /// <summary>
        /// Восстановление логина из coockie или токена по ключу
        /// </summary>
        ILogin ILoginProvider2.RestoreLogin(HttpContext http, string key)
        {
            var is_id = Guid.TryParse(key, out Guid id);
            using var db = new DbConnection();

            var user = getUsers(db)
                .WhereIf(is_id, u => u.Id == id, u => u.Login == key)
                .FirstOrDefault();

            loadUserProps( db, user );
            return user;
                    
        }

        /// <summary>
        /// загрузка списка пользователей
        /// </summary>
        IQueryable<User> getUsers(DbConnection db) => 
            db.Users
                .LoadWith(u => u.Domain)
                .LoadWith(u => u.Client)
                .GetActuals();


        /// <summary>
        /// Загрузка доп. свойств пользователя
        /// </summary>
        void loadUserProps( DbConnection db, User user )
        {
            if (user == null)
                return;

            var permissions = db.Permissions
               .Where(x => x.DomainId == user.DomainId)
               .ToList<Permission>();

            // ??? отменяем согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/23880/ 
            if (user.IsLimited())
            {
                permissions = permissions.Where(p => LOCKED_ALLOWS.Contains(p.Operation)).ToList();
            }

            user.LoadPermissions(permissions);

            if (user.Domain?.IsArchive == true)
                throw new Itall.UserException("Зона доступа заблокирована");
        }

        /// <summary>
        /// Операции, разрешенные при блокировке
        /// </summary>
        static string[] LOCKED_ALLOWS = {
            Operations.AnyIP,
            Operations.Users,
            Operations.StatisticPromo,
            Operations.AllBases,
        };


        ILogin ILoginProvider.Register(HttpContext http)
        {
            throw new NotImplementedException();
        }

    }
}


#region Old

        //ILogin ILoginProvider1.GetLogin(HttpContext http, string key, string name)
        //{
        //    using var db = new DbConnection();

        //    //name = name.Trim();  // Проблема с авторизацией пользовател https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/43209/
        //    var res = Guid.TryParse(key, out var id);
        //    //if (!res) return null; // это не GUID

        //    var user = db.Users
        //        .LoadWith(u => u.Domain)
        //        .LoadWith(u => u.Client)
        //        .GetActuals()
        //        .WhereIf(res, u => u.Id == id)
        //        .WhereIf( name!=null, u => u.Login == name)
        //        .WhereIf( !res && name == null, u => false )  // else not found
        //        .FirstOrDefault();

        //    if (user == null)
        //        //throw new Exception("User not found: "+ name);
        //        return null;

        //    var permissions = db.Permissions
        //        .Where(x => x.DomainId == user.DomainId)
        //        .ToList<Permission>();

        //    // ??? отменяем согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/23880/ 
        //    if (user.IsLimited())
        //    {
        //        permissions = permissions.Where(p => LOCKED_ALLOWS.Contains(p.Operation)).ToList();
        //    }

        //    user.LoadPermissions(permissions);

        //    return user;
        //}


        //bool ILoginProvider1.CheckLogin(HttpContext http, ILogin context)
        //{
        //    var user = (User)context;
        //    var psw = http.Request.Form["password"].FirstOrDefault();

        //    if (!Itall.String2.VerifyHashedPassword(user.Hash, psw))
        //        throw new Itall.UserException("Пароль неверен");

        //    if (user.Domain?.IsArchive == true)
        //        throw new Itall.UserException("Зона доступа заблокирована");

        //    return true;
        //}

#endregion

