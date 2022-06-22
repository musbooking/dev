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
    public partial class UsersController : UpdateDbController<User>
    {

        protected override object OnUpdating(Updater<User> updater)
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();
            curuser.Require(Operations.Users);

            base.OnUpdating(updater);

            if (updater.IsNew)
            {
                string login = updater.Params["login"];
                var user = updater.Db.GetTable<User>().FirstOrDefault(x => x.Login == login);
                if (user != null)
                    throw new UserException("Логин уже занят");

                updater.Set(x => x.Login);

                string psw = updater.Params["Password"];
                if (!SysUtils.CheckPasswordStrength(psw))
                    throw new UserException(SysUtils.ERROR_PASSWORD);

                if (!string.IsNullOrWhiteSpace(psw))
                    updater.Set(x => x.Hash, String2.HashPassword(psw));
            }
            updater.Set(x => x.Login);
            updater.Set(x => x.Phone);
            //updater.Set(x => x.Password, d.Password as Nancy.DynamicDictionaryValue);
            if (updater.Set(x => x.Email) != null)
            {
                //updater.Set(x => x.IsConfirmed, false);  -- не уверен, что нужно здесь отслеживать изменение почты
            }
            updater.Set(x => x.IsArchive);
            updater.Set(x => x.IsConfirmed);
            updater.Set(x => x.Roles);

            updater.Set(x => x.BaseIds);
            updater.Set(x => x.DomainIds);
            updater.Set(x => x.BitrixNum);
            updater.Set(x => x.FIO);
            updater.Set(x => x.Fcm);

            if(updater.IsNew && curuser.Domain == null && curuser.Allow(Operations.Users))  // согласно 58623 - если пользователей создает суперадмин вне доменов, то он создает суперадминов
            {
                updater.Set(x => x.IsAdmin, true);
            }

            Itall.App.Auth.LoginsCache.Global.Reset(updater.Object.GetLoginKey());

            Itall.App.UpdateHelper.Update("login-" + updater.Object.Login); 

            return base.OnUpdating(updater);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync()
        {
            this.RequiresAuthentication();
            var curuser = this.CurUser();
            curuser.Require(Operations.Users);

            var query = Db.Users
                //.GetDomainObjects(user?.DomainId)
                .WhereIf(curuser.DomainId != null, u => u.DomainId == curuser.DomainId, u => u.IsAdmin)
                .Select(u => new
                {
                    u.Id,
                    u.BaseIds,
                    u.DomainIds,
                    u.Email,
                    u.IsArchive,
                    u.Login,
                    u.Roles,
                    //x.Password,
                    fio = u.FIO ?? "",
                    u.BitrixNum,
                });
            var list = await query.ToListAsync();
            return Json(list);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync(Guid? client)
        {
            this.RequiresAuthentication();
            this.RequiresAdmin();

            //Guid? client = Convert<Guid?>(this.Request.Query.client);

            var qusers = Db.Users
                .WhereIf(client != null, cl => cl.ClientId == client)
                .Select(cl => new
                {
                    cl.Id,
                    cl.BaseIds,
                    cl.DomainIds,
                    cl.Email,
                    cl.IsConfirmed,
                    cl.IsArchive,
                    cl.Login,
                    cl.Roles,
                    //x.Password,
                    fio = cl.FIO ?? "",
                    cl.Fcm,
                    cl.Phone,
                    cl.BitrixNum,
                });
            var list = await qusers.ToListAsync();

            return Json(list);
        }

        /// <summary>
        /// Получение списка зарегистрированных пользователей
        /// </summary>
        [HttpGet("registered")]
        public async Task<IActionResult> GetRegisteredAsync(DateTime? dfrom, DateTime? dto)
        {
            this.RequiresAuthentication();
            this.RequiresAdmin();  // дополнение по задаче 70495 - доступно только суперадминам
            //var user = this.CurUser();
            //user.Require(Operations.Users);

            dfrom ??= DateTime.Now.AddDays(-7);
            var query = Db.Users
                //.GetDomainObjects(user?.DomainId)
                .Where(u => u.ClientId != null)  // только клиентов
                .Where(u => u.DateCreated > dfrom.Value.Date)
                .WhereIf(dto != null, u => u.DateCreated < dto.Value.Date.AddDays(1))  // // полночь след дня
                .OrderBy(u => u.Phone)
                .Select(u => new
                {
                    u.Id,
                    u.Phone,
                    u.ClientId,
                    u.Client.TypeInfo,
                });
            var list = await query.ToListAsync();
            return Json(list);
        }



        [HttpPost("feedback")]
        public async Task<IActionResult> FeedbackAsync(string text, string subject, string email)
        {
            //string text = (string)this.Request.Form.text;
            //string subject = (string)this.Request.Form.subject;

            var user = this.CurUser();
            var file = this.Request.Form.Files.FirstOrDefault();
            var path = "";
            if (file != null)
            {
                //var filename = $"feedback/{DateTime.Now.ToString("yyMMdd-HHmm")}-{file.FileName}".Replace('\\','/');
                var res = FileHelper.GetFilePath( file.FileName, "feedback");
                await FileHelper.UploadFileAsync(file, res.full);
                path = res.rel;
            }

            var model = new
            {
                User = user,
                Text = text,
                //Topic = topic,
                Subject = subject,
                Link = path,
            };

            //var template = App.Templates.Get("feedback");
            var template = App.DbTemplates.Get(Sys.TemplateKind.Feedback);

            //await App.Mails.SendAsync(tomail, mailSubject, body);
            //App.AddMailTask(template.Email, "feedback", model);
            App.AddDbMailJob( email ?? template.Email, model, Db, user?.Id, Sys.TemplateKind.Feedback);

            var apires = new
            {
                Text = text,
                //Topic = topic,
                Subject = subject,
                Link = path,
            };

            return Json(apires);
        }



        [HttpPost("sendmail")]
        public IActionResult SendMail(string mail, string text, string kind)
        {
            var user = this.CurUser();

            //App.AddMailTask(mail, subject, text);
            App.AddDbMailJob(mail, text, Db, user?.Id, kind);

            return Ok();
        }


        [HttpPost("send-confirm")]
        public IActionResult SendMailConfirm()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            var email = user.Client?.Email ?? user.Email;

            var templ = App.AddDbMailJob(email, new { User = user, Host = WebApp.HostUrl }, Db, user?.Id, Sys.TemplateKind.CheckEmailConfirmation);

            return Ok($"Отправлено подтверждение по адресу: {email}, шабллон: {templ?.Name}");
        }


        [HttpGet("user")]
        public async Task<IActionResult> GetUserAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            //Orders.Room room = null;  -- убрана согласно договоренностям по 50159 

            //if (user.ClientId.HasValue)
            //{
            //    var orders = Db.Orders
            //        .LoadWith(x => x.Room.Base)
            //        .LoadWith(x => x.Room.Domain)
            //        .Where(x => x.ClientId == user.ClientId)
            //        .OrderByDescending(x => x.Date)
            //        .Select(x => x.Room);

            //    room = await orders.FirstOrDefaultAsync() ?? Orders.Room.Empty;
            //}

            var channels = DbCache.PayChannels.Get();

            var parts = await Db.ClientParts  //x.Client.Parts
                .LoadWith(cp => cp.Domain)
                .Where(cp => cp.ClientId == user.ClientId)
                .Where(cp => cp.Forfeit >0 || cp.IsBanned || cp.Discount > 0)
                .Select(cp => new
                {
                    cp.Id, // добавлен для 50159 
                    cp.DomainId,
                    Name = cp.DomainId == null ? "Мобильный" : cp.Domain.Name,
                    cp.Forfeit,
                    cp.IsBanned,
                    cp.Discount,
                    //cp.PayKind,
                    cp.Domain.Terminal,
                    Channels = channels
                        .Where(ch => ch.DomainId == cp.DomainId)
                        .Where(ch => ch.IsForfeits == true)
                        .Select(ch => new
                        {
                            ch.Kind,
                            ch.Name,
                            ch.PrepayUrl,
                        })
                        .ToList()
                }).ToListAsync();

            //var psvc = new Partners.PointsService { Db = Db};
            var balance = user.ClientId == null ? 0
                //: CRM.PointsService.GetBalance(Db.Points.Where(p=>p.UserId == userid));
                : await Db.Transactions.Where(t => t.ClientId == user.ClientId).BalanceAsync(Fin.Groups.REG_POINTS);

            //var psvc = new CRM.PointsService { Db = Db, CurrentUser = user };
            //var hasProfilePoints = await psvc.CheckProfileAsync(user.Id);
            var tsvc = new Fin.TransService { Db = Db, User = user };
            var hasProfilePoints = await tsvc.CheckProfileAsync(user.ClientId);

            var users =
                from u in Db.Users.Finds(user.Id) 
                    //.LoadWith(x => x.Client)
                    //var lastOrder = db.Orders.LoadWith(y=>y.Room.Base)
                    //    .Where(y => y.ClientId == x.ClientId)
                    //    .OrderByDescending(y => y.DateFrom)
                    //    .FirstOrDefault()
                    //var client = x.Client ?? Client.Empty
                //let balance = psvc.GetBalance(x.Id)

                //let balance = Db.Points
                //    .Where(p => p.UserId == u.Id)
                //    .Sum(p => p.Count * (Partners.PointsService.POINTS_RASHOD.Contains(p.Kind) ? -1 : 1))
                let c = u.Client
                select new
                {
                    u.Id,
                    u.Login,
                    u.ClientId,
                    
                    // client info
                    c.FirstName,
                    c.LastName,
                    c.SurName,
                    u.Phone,
                    c.Email,
                    Birthday = c.DateBirthday,
                    c.PhotoUrl,
                    c.Gender,
                    c.CityId,
                    c.VkUrl,
                    c.SourceUrl,
                    c.Spheres,
                    c.Types,
                    c.Genres,
                    c.Styles,
                    c.Tools,
                    c.SourceId,
                    c.Music,
                    c.TypeInfo,
                    c.Notifications,

                    Parts = parts,
                    //Room = room.Name,
                    //Base = room.BaseId == null ?"" : room.Base.Name,
                    
                    u.Fcm,
                    u.IsConfirmed,
                    Balance = balance,
                    u.InviteCode,

                    u.FillFactor,
                    HasProfilePoints = hasProfilePoints,
                };
            var res = await users.FirstOrDefaultAsync();
            return Json(res);
        }

        // ADDED BY ELMSOFT 2019-04-09, Modofied by SERGPY 2019-06-18
        /// <summary>
        ///  Проверка почты на актуальность
        /// </summary>
        [Route("confirm")]
        public async Task<IActionResult> ConfirmEmail(Guid id)
        {

            var r = await Db.Users.Finds(id)
                //.Where(u => u.co)
                .Set(u => u.IsConfirmed, true)
                .UpdateAsync();

            if (r == 0)
                throw new UserException("Не найден пользователь");

            return Ok("Почта пользователя подтверждена");

        }

    }

}


#region --- Misc ---



            //var user = await Db.Users
            //    .FindAsync(id);
            //if (user != null)
            //{
            //    user.IsConfirmed = true;
            //    Db.Save(user);
            //    return Ok();
            //}
            //else
            //{
            //    return BadRequest();
            //}

        //[Route("info")]
        //public dynamic GetInfo(dynamic arg)
        //{
        //    //var lm = App.Current.LoginManager;
        //    //var res = lm.GetClientContext(this.Login);
        //    //return this.Json(res);
        //    return Ok();
        //}
#endregion