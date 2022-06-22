using LinqToDB;
//using-Nancy-security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB.Data;
using My.App;
using Itall.App.Data;
using Itall.Services;
//using-Nancy;
using System.Threading;
using Itall;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Sys
{

    partial class UsersController
    {

        [HttpPost("sms")]
        public async Task<IActionResult> SendSmsAsync(string phone, string email)
        {
            //string phone = this.Request.Form.phone;

            if (string.IsNullOrWhiteSpace(phone))   //&& string.IsNullOrWhiteSpace(email)  --  или почты
                return Error("Не задан номер телефона");

            phone = MiscUtils.FormatPhone(phone);
            var user = await Db.Users.GetUserAsync(phone);

            if (user == null) // если не найден логин - проверяем, нет ли клиента с таким номером
            {
                var client = await Db.Clients
                    //.LoadWith(cl => cl.User)
                    .GetClientsByPhoneAsync(phone).FirstOrDefaultAsync();
                if (client != null) // если найден клиент - то находим связанный с ним логин
                    user = await Db.Users.FirstOrDefaultAsync(x => x.ClientId == client.Id);
                //user = client?.User; // долго
            }

            if (!string.IsNullOrWhiteSpace(email)) // дополнительно проверяем почту - 89173
            {
                email = email.Trim();
                user = await Db.Users.FirstOrDefaultAsync(x => x.Email == email);
            }

            if (user != null)
                return Error("Пользователь с таким номером или почтой уже зарегистрирован в системе");  //, HttpStatusCode.Conflict

            // посылаем код клиенту
            var res = await SmsHelper.SendPhoneCodeAsync(phone, TemplateKind.Code);
            var msg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.System,
                Scope = ScopeType.Any,
                Text = "Отправлена СМС с кодом на тел: " + phone,
            };
            await Db.CreateInsertAsync(msg);

            if (res.Ok) 
            {
#if DEBUG
                return Ok(res.Code.ToString());
#else
                return Ok("Код успешно сформирован и послан получателю");
#endif
            }
            else
                return Error("Ошибка смс сервиса: " + res.Result);
        }

        //Nancy.Authentication.Token.ITokenizer _Tokenizer;

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(
            string login,
            string password,
            string name,
            string surname,
            string lastname,
            string phone,
            string email,
            int code,
            string invite,
            DateTime? birthday
            )
        {
            if (string.IsNullOrWhiteSpace(name))
                return Error("Не задано имя");

            // проверяем номер телефона
            phone = MiscUtils.FormatPhone(phone);
            if (string.IsNullOrWhiteSpace(phone))
                return Error("Не задан номер телефона");

            //if (string.IsNullOrWhiteSpace(email))
            //    return Error("Не задан почтовый адрес");

            // проверяем смс код телефона
            if (!SmsHelper.TestSmsCode(phone, code))
                return Error("Не задан или неверен код");

            // проверяем пароль
            if (string.IsNullOrWhiteSpace(password))
                password = SysUtils.CreatePassword();
            else if (!SysUtils.CheckPasswordStrength(password))
                return Error(SysUtils.ERROR_PASSWORD);

            var user = await Db.Users.GetUserAsync(login ?? phone ?? email);
            if (user != null)
                return this.Error("Пользователь с такими параметрами уже присутствует в базе данных");

            //var client = await db.Clients.GetClient(phone, email);
            var query = Db.Clients
                //.LoadWith(cl => cl.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(phone)) // ищем клиента по телефону
                query = query.GetClientsByPhoneAsync(phone);
            else if (!string.IsNullOrWhiteSpace(email)) // ищем клиента по почтовому адресу
                query = query.Where(x => x.Email.Contains(email));

            var client = await query.FirstOrDefaultAsync();

            if (client != null)
            {
                //user = client.User;  
                user = await Db.Users.FirstOrDefaultAsync(x => x.ClientId == client.Id);
                if (user != null)
                    return this.Error("Клиент уже зарегистрирован. Используйте восстановление номера");

                // меняем реквизиты клиента
                client.DateBirthday = birthday;
                client.Email = email;
                client.FirstName = name;
                client.SurName = surname;
                client.LastName = lastname;
                Db.BeginTransaction1();
                await Db.UpdateAsync(client);
            }
            else
            {
                client = new CRM.Client
                {
                    DateBirthday = birthday,
                    Email = email,
                    FirstName = name,
                    SurName = surname,
                    LastName = lastname,
                    //Phones = phone,
                    Updated = DateTime.Now,
                    InSync = true,
                };
                Db.BeginTransaction1();
                await Db.CreateInsertAsync(client);

                // добавляем номер клиента
                if (!string.IsNullOrWhiteSpace(phone))
                {
                    var phone_res = new Common.Resource
                    {
                        Kind = Common.ResourceKind.ClientPhone,
                        ObjectId = client.Id,
                        Value = phone,
                    };
                    await Db.CreateInsertAsync(phone_res);
                }
            }

            var hash = String2.HashPassword(password);

            user = new User
            {
                Login = (login ?? phone ?? email).Trim(),
                Hash = hash,
                Email = email,
                Phone = phone,
                FIO = lastname + " " + name + " " + surname,
                IsArchive = false,
                Updated = DateTime.Now,
                ClientId = client.Id,
                IsConfirmed = false,
            };

            // проверяем инфайт код
            if (!string.IsNullOrWhiteSpace(invite))
            {
                var inviteUserId = await Db.Users
                    .Where(u => u.InviteCode == invite)
                    .Select(u => (Guid?)u.Id)
                    .FirstOrDefaultAsync();

                if (inviteUserId == null)  // add exception for 
                    throw new UserException($"Код приглашенного пользователя '{invite}' неверен");

                user.InviteId = inviteUserId;
            }

            await Db.CreateInsertAsync(user);  // создаем запись юзверя
            //await Db.Clients.Finds(client.Id)  // сразу меняем связанный код у клиента
            //    .Set(cl => cl.UserId, user.Id);

            Db.CommitTransaction1();

            // начисляем баллы за регистрацию
            //var svc = new CRM.PointsService { Db = Db, CurrentUser = user };
            //await svc.OnRegistrationAsync(user);
            var tsvc = new Fin.TransService { Db = Db, User = user };
            await tsvc.PointsRegistrationAsync(user);

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                var model = new { User = user, Password = password };
                //var template = App.Templates.Get("registration");
                //string subject = WebUtils.View(template.Subject, model);
                //string body = WebUtils.View(template.Body, model);
                //await App.Mails.SendAsync(user.Email, subject, body);

                //App.AddMailTask(user.Email, "registration", model);
                App.AddDbMailJob(user.Email, model, Db, user.Id, Sys.TemplateKind.Registration);
            }

            return Json(new { login = login, password = password });
        }

        /// <summary>
        /// Аргументы для изменения параметров клиента
        /// </summary>
        public class ClientChangeArgs
        {
            public string FirstName { get; set; }
            public string SurName { get; set; }
            public string LastName { get; set; }
            public string Notifications { get; set; }
            //string phone = this.Request.Form.phone;
            public string Email { get; set; }
            public string Fcm { get; set; }
            public DateTime? Birthday { get; set; }
            // client part
            public string PhotoUrl { get; set; }
            public string Gender { get; set; }
            public Guid? CityId { get; set; }
            public string VkUrl { get; set; }
            public string SourceUrl { get; set; }
            public string Groups { get; set; }
            public string Spheres { get; set; }
            public string Types { get; set; }
            public string Genres { get; set; }
            public string Styles { get; set; }
            public string Tools { get; set; }
            public Guid? SourceId { get; set; }
            public string Music { get; set; }
            public string TypeInfo { get; set; }

            ///// <summary>
            ///// Проверка заполненности профиля
            ///// </summary>
            //public int GetFillFactor()
            //{

            //    int check(params object[] args)
            //    {
            //        var n = args.Count(a => a != null);
            //        return n * 100 / args.Length;
            //    }

            //    var res = check(
            //        FirstName,
            //        Email,
            //        LastName,
            //        PhotoUrl,
            //        Gender,
            //        CityId,
            //        VkUrl,
            //        SourceUrl,
            //        Spheres,
            //        Types,
            //        Genres,
            //        Styles,
            //        Tools,
            //        SourceId,
            //        Music,
            //        Birthday
            //    );
            //    return res;
            //}


        }


        [HttpPost("change")]
        public async Task<IActionResult> ChangeAsync( ClientChangeArgs args )
        {
            this.RequiresAuthentication();

            // update user
            var user = this.CurUser();


            // change client
            var clientid = user.ClientId;
            if (clientid.HasValue)
            {
                var clsets = Db.Clients
                    .Finds(clientid)
                    .Set(x => x.Updated, DateTime.Now)
                    .SetIf( !string.IsNullOrWhiteSpace(args.FirstName), x => x.FirstName, args.FirstName)
                    .SetIf( !string.IsNullOrWhiteSpace(args.SurName) , x => x.SurName, args.SurName)
                    .SetIf( !string.IsNullOrWhiteSpace(args.LastName) ,x => x.LastName, args.LastName)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Email), x => x.Email, args.Email)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Notifications), x => x.Notifications, args.Notifications)
                    .SetIf( args.Birthday != null, x => x.DateBirthday, args.Birthday)

                    // client params
                    .SetIf( !string.IsNullOrWhiteSpace(args.PhotoUrl) ,x => x.PhotoUrl, args.PhotoUrl)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Gender) ,x => x.Gender, args.Gender)
                    .SetIf( args.CityId != null, x => x.CityId, args.CityId)
                    .SetIf( !string.IsNullOrWhiteSpace(args.VkUrl) ,x => x.VkUrl, args.VkUrl)
                    .SetIf( !string.IsNullOrWhiteSpace(args.SourceUrl) ,x => x.SourceUrl, args.SourceUrl)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Groups) ,x => x.Groups, args.Groups)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Spheres) ,x => x.Spheres, args.Spheres)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Types) ,x => x.Types, args.Types)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Genres) ,x => x.Genres, args.Genres)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Styles) ,x => x.Styles, args.Styles)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Tools) ,x => x.Tools, args.Tools)
                    .SetIf( args.SourceId != null, x => x.SourceId, args.SourceId)
                    .SetIf( !string.IsNullOrWhiteSpace(args.Music) ,x => x.Music, args.Music)
                    .SetIf( !string.IsNullOrWhiteSpace(args.TypeInfo) ,x => x.TypeInfo, args.TypeInfo)
                    ;

                await clsets.UpdateAsync();
            }


            var usets = Db.Users
                .Where(x => x.Id == user.Id)
                .Set(x => x.Updated, DateTime.Now);

            if (!string.IsNullOrWhiteSpace(args.FirstName + args.SurName))
                usets = usets.Set(x => x.FIO, args.FirstName + " " + args.SurName);

            if (!string.IsNullOrWhiteSpace(args.Email))
            {
                usets = usets
                    .Set(x => x.Email, args.Email)
                    .Set(x => x.IsConfirmed, false);  // также сбрасываем признак подтвеждения
            }
            if (!string.IsNullOrWhiteSpace(args.Fcm))
                usets = usets.Set(x => x.Fcm, args.Fcm);

            // добавлен расчет филлфактора
            byte fill = 0;
            if (user.ClientId != null)
            {
                var client = await Db.Clients.FindAsync(user.ClientId);
                fill = client.GetFillFactor();
            }
            usets = usets.Set(x => x.FillFactor, fill);

            await usets.UpdateAsync();
            

            // проверяем если все поля заполнены, то начисляем баллы
            if (fill==100)
            {
                //var psvc = new CRM.PointsService { Db = Db, CurrentUser = user };
                //await psvc.OnProfileAsync(user);
                var tsvc = new Fin.TransService { Db = Db, User = user };
                await tsvc.PointsProfileAsync(user);
            }

            Itall.App.Auth.LoginsCache.Global.Reset(user.GetLoginKey());

            return Ok();
        }

        [HttpPost("resetUser")]
        public async Task<IActionResult> ResetUserPasswordAsync(Guid user)
        {
            this.RequiresAuthentication();

            //Guid userid = Convert<Guid>(this.Request.Form.user);
            //using (var Db = new DbConnection())
            {
                var objuser = await Db.Users.FindAsync(user);
                var psw = resetPasswod(objuser);
                return Json(new { Password = psw });
            }
        }


        [HttpPost("reset")]
        public IActionResult ResetPassword(string password)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            //var password = (string)this.Request.Form.password;
            if (!string.IsNullOrWhiteSpace(password) && !SysUtils.CheckPasswordStrength(password))
                return Error(SysUtils.ERROR_PASSWORD);

            //using (var Db = new DbConnection())
            {
                var psw = resetPasswod(user, password);
                return Json(new { Password = psw });
            }
        }

        [HttpPost("cancel_test")]
        public IActionResult Cancel(string phone)
        {
            this.RequiresAuthentication();

            //var phone = (string)this.Request.Form.phone;
            if (string.IsNullOrWhiteSpace(phone))
                return Error("Не задан номер телефона");

            phone = MiscUtils.FormatPhone(phone);

            //using (var Db = new DbConnection())
            {
                Db.Users
                    .Where(user => user.Phone == phone)
                    .Set(x => x.Updated, DateTime.Now)
                    .Set(user => user.ClientId, (Guid?)null)
                    .Set(user => user.Phone, "!deleted")
                    .Set(user => user.Login, "!deleted")
                    .Set(user => user.Email, "!deleted")
                    .Update();

                return Ok();
            }

        }

        private string resetPasswod(User user, string psw = null)
        {
            if (string.IsNullOrWhiteSpace(psw))
                psw = SysUtils.CreatePassword();

            Db.Users
                .Where(x => x.Id == user.Id)
                .Set(x => x.Updated, DateTime.Now)
                .Set(x => x.Hash, String2.HashPassword(psw))
                .Update();

            Itall.App.Auth.LoginsCache.Global.Reset(user.GetLoginKey());

            return psw;
        }

        //IQueryable<User> getQueryUsers() => 



        [HttpPost("restore")]
        public async Task<IActionResult> RestoreAsync(
            string login,
            string email,
            string phone,
            bool sms
            )
        {
            //var login = (string)this.Request.Form.login;
            //var mail = (string)this.Request.Form.mail;
            //var phone = (string)this.Request.Form.phone;
            //bool sms = Convert<bool>(this.Request.Form.sms);

            var res = "";
            phone = MiscUtils.FormatPhone(phone);
            var user = await Db.Users.GetUserAsync(login ?? phone ?? email);

			if (user == null) // если не найден логин - проверяем, нет ли клиента с таким номером
            {
                var clients = await Db.Clients
                    .GetClientsByPhoneAsync(phone)
					.Select(cl => cl.Id)
					.ToListAsync();

                if (clients?.Count > 0) // если найден клиент - то находим связанный с ним логин
                    user = await Db.Users.FirstOrDefaultAsync(u => clients.Contains( u.ClientId.Value) );
            }

            if (user == null && !string.IsNullOrWhiteSpace(email)) // если не найден логин - дополнительно проверяем почту
            {
                email = email.Trim();
                user = await Db.Users.FirstOrDefaultAsync(x => x.Email == email);
            }			

            if (user == null)
                return Error($"Не найден пользователь по логину {login}, email {email}, или phone {phone}");

            var psw = resetPasswod( user);

            //var template = App.Templates.Get("restore");
            var template = App.DbTemplates.Get(Sys.TemplateKind.Restore);
            var model = new { User = user, Password = psw, };

            if (sms)
            {
                if (string.IsNullOrWhiteSpace(user.Phone))
                    return Error("Не задан номер телефона для пользователя");

                //string smstext = WebUtils.View(template.Sms, model);
                //res = await SmsUtils.SendSmsAsync(user.Phone, smstext);
                res = await SmsHelper.SendSmsAsync(user.Phone, template.Sms, model);
                res += ", СМС тел: " + user.Phone;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(user.Email))
                    return Error("Не задан e-mail для пользователя");

                //App.AddMailTask(user.Email, "restore", model);
                App.AddDbMailJob(user.Email, model, Db, user?.Id, Sys.TemplateKind.Restore);
                res = "Отправлено e-mail: " + user.Email;
            }

            // формируем сообщение
            var msg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.System,
                Scope = ScopeType.Any,
                Text = res,
                ClientId = user?.ClientId,
                SenderId = user?.Id,
            };
            await Db.CreateInsertAsync(msg);


            return Ok(res);
        }

    }

}



#region --- Misc ----

//private async Task<IActionResult> PhoneLoginAsync()
//{
//    var phone = (string)this.Request.Form.phone;
//    phone = Utils.FormatPhone(phone);
//    var password = (string)this.Request.Form.password;
//    using (var db = new AppDb())
//    {
//        var client = await db.Clients.FirstOrDefaultAsync(x => x.Phones.Contains(phone));
//        if (client == null) return Error("Не найден пользователь с номером телефона " + phone);
//        var user = await db.Users.FirstOrDefaultAsync(x => x.ClientId == client.Id);
//        if (user == null) return Error("Не найден логин для пользователя" + client.FirstName);

//        var loginInfo = App.Current.LoginManager.GetLoginInfo(user.Login, password);
//        if (loginInfo == null)
//            return Error("Пользователь не найден или неверен пароль", HttpStatusCode.NonAuthoritativeInformation);

//        loginInfo.Token = _Tokenizer.Tokenize(loginInfo.User, Context);

//        return Json(loginInfo);
//    }
//}

//private async Task<IActionResult> CredentialsAsync()
//{
//    this.RequiresAuthentication();

//    var password = (string)this.Request.Form.password;
//    if (!Utils.CheckPasswordStrength(password))
//        return Error("Пароль должен содержать не менее 6 знаков, 1 цифры и 1 спецсимвола ");

//    using (var db = new AppDb())
//    {
//        var psw = resetPasswod(db, this.CurUser(), password);
//        App.Current.LoginManager.ResetLogin(this.CurUser().Login);
//        return Ok();
//    }
//}
#endregion
