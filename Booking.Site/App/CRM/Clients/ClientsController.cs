using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Itall;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using My.App.Orders;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using My.App.Common;

namespace My.App.CRM
{
    public class ClientModel
    {
        public bool IsAdmin;
        public Client Client;
        public List<ClientPart> Parts;
        public List<Sys.User> Logins;
        public Sys.User User;
    }


    //[Route("clients")]
    public class ClientsController : UpdateDbController<Client>
    {

        protected override object OnUpdating(Updater<Client> updater)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.Clients);

            base.OnUpdating(updater);

            //this.RequiresDomain(updater.Object); 
            // если не суперадмин и пустой или другой домен - запрещаем редактирование
            var domainId = updater.Object.DomainId;
            if (!user.IsSuper() && (domainId == null || user.DomainId != domainId))
            {
                updater.Cancel = true;
                return Ok();
                //return Error("Нельзя редактировать чужую карточку");
            }

            updater.Set(x => x.CityId);
            updater.Set(x => x.DateBirthday);
            updater.Set(x => x.Email);
            updater.Set(x => x.FirstName);
            updater.Set(x => x.GroupId);
            updater.Set(x => x.Groups);
            updater.Set(x => x.Spheres);
            updater.Set(x => x.Types);
            updater.Set(x => x.Genres);
            updater.Set(x => x.Styles);
            updater.Set(x => x.Tools);
            updater.Set(x => x.Gender);
            updater.Set(x => x.LastName);
            updater.Set(x => x.PhotoUrl);
            updater.Set(x => x.Notifications);

            //updater.Set(x => x.Phones, d.Phones as Nancy.DynamicDictionaryValue);
            updater.Set(x => x.SurName);
            //updater.Set(x => x.StyleId);
            //updater.Set(x => x.ToolId);
            //updater.Set(x => x.TypeId);
            //updater.Set(x => x.OS);

            //updater.Set(x => x.ActivityId);
            //updater.Set(x => x.GenreId);
            updater.Set(x => x.Music);
            updater.Set(x => x.SourceId);
            updater.Set(x => x.SourceUrl);
            updater.Set(x => x.TypeInfo);
            updater.Set(x => x.VkUrl);

            //updater.Set(x => x.PushID);
            //updater.Set(x => x.Comments, d.Comments as Nancy.DynamicDictionaryValue);
            //updater.Set(x => x.Post, d.Post as Nancy.DynamicDictionaryValue);

            //var part = updater.Object.GetDomainPart(updater.Db, user?.DomainId) ?? ClientPart.Empty;
            //updater.Set(x => x.IsBanned, d.IsBanned as Nancy.DynamicDictionaryValue);
            //updater.Set(x => x.Discount, d.Discount as Nancy.DynamicDictionaryValue);

            updater.Set(x => x.InSync, true);

            string phone = updater.Params["phone"];
            if (updater.IsNew && !string.IsNullOrWhiteSpace(phone))
            {
                var error = (updater.Db as DbConnection).TestPhoneExists(Guid.Empty, phone);
                if (error != null)
                    throw new UserException(error);
            }

            return base.OnUpdating(updater);
        }

        protected override void OnUpdated(Updater<Client> updater)
        {
            base.OnUpdated(updater);
            var user = this.CurUser(); // всегда непустой, т.к. анонимы не могут редактировать объекты

            string phone = updater.Params["phone"];
            if (updater.IsNew && !string.IsNullOrWhiteSpace(phone))
            {
                var resource = new Resource
                {
                    Kind = ResourceKind.ClientPhone,
                    ObjectId = updater.Object.Id,
                    Value = MiscUtils.FormatPhone(phone),
                };
                updater.Db.CreateInsert(resource);
            }
            var text = updater.IsNew ? "Создан клиент :" : "Изменен клиент: ";
            //text += user.Login + ": ";
            var changes = SysUtils.GetChangesText(updater);
            if (string.IsNullOrWhiteSpace(changes)) return;

            var msg = new Message
            {
                ClientId = updater.Object.Id,
                Date = DateTime.Now,
                Scope = ScopeType.Zone,
                DomainId = user.DomainId,
                Kind = MessageKind.System,
                SenderId = user.Id,
                Text = text + changes,
            };
            updater.Db.CreateInsert(msg);

        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAsync()
        {
            this.RequiresAuthentication();

            string filter = this.Request.Query["filter[value]"];
            if (string.IsNullOrWhiteSpace(filter)) return Ok(Itall.List2.Empty);

            //using (var Db = new DbConnection())
            {
                var query = Db.Clients.SearchByText(filter);
                //if (query == null) return Ok();

                var query1 =
                    from x in query
                        //var part = db.ClientParts.FirstOrDefault(y => y.ClientId==x.Id && y.DomainId == user.DomainId)
                    let phone = x.Resources
                        //.GetPhones(null)
                        .Where(r => r.Kind == ResourceKind.ClientPhone)
                        .Where(r => r.Value != null)
                        .FirstOrDefault()
                        .Value
                    select new
                    {
                        x.Id,
                        //Discount = part==null ?0 :part.Discount,
                        //Forfeit = part==null ?0 :part.Forfeit, 
                        Value = $" {x.LastName} {x.FirstName} {x.SurName} {MiscUtils.HidePhoneChars(phone)},  {MiscUtils.HideMailChars(x.Email)},", //: {part.Discount}%, , штрафы: {part.Forfeit}  {(part.IsBanned?"бан":"")}", 
                    };

                var query2 = query1.Take(10);
                var list = await query2.ToListAsync();

                if(list.Count == 0 && !string.IsNullOrWhiteSpace(filter))  // # 41997
                {
                    list.Add(new { Id=Guid.Empty, Value=filter});
                }

                return Json(list);
            }
        }

        /// <summary>
        /// Быстрый поиск на клиенте при вводе текста в поле
        /// </summary>
        [HttpGet("search2")]
        public async Task<IActionResult> Search2Async(string filter)
        {
            this.RequiresAuthentication();

            //string filter = this.Request.Query["filter"];
            if (string.IsNullOrWhiteSpace(filter))
                return Ok(Itall.List2.Empty);

            var query = Db.Clients.SearchByText(filter);
            //if (query == null) return Ok();

            var query1 =
                from x in query
                select new
                {
                    x.Id,
                    //Discount = part==null ?0 :part.Discount,
                    //Forfeit = part==null ?0 :part.Forfeit, 
                    x.LastName,
                    x.FirstName,
                    x.SurName,
                    //PhoneUtils.HidePhoneChars(phone)},  {Utils.HideMailChars(x.Email)},", //: {part.Discount}%, , штрафы: {part.Forfeit}  {(part.IsBanned?"бан":"")}", 
                };

            var query2 = query1.Take(10);
            var list = await query2.ToListAsync();

            return Json(list);
        }

        /// <summary>
        /// Список проштрафившихся клиентов
        /// </summary>
        [HttpGet("forfeits")]
        public async Task<IActionResult> GetForfeits()
        {
            this.RequiresAuthentication();

            // throw new UserException("Метод устарел! ");  - пока открываем:  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/44661/

            var user = this.CurUser();

            var query = Db.ClientParts
                .GetDomainObjects(user.DomainId)
                .Where(x => x.IsBanned || x.Forfeit > 0);

            var query1 =
                from x in query
                let orders = x.Client.Orders.Where(y => y.DomainId == user.DomainId)
                let last = orders
                    .OrderByDescending(y => y.DateFrom)
                    //.Select(y=>new { y.DateFrom, y.Date })
                    .Select(y => y.DateFrom)
                    .FirstOrDefault()
                select new
                {
                    Id = x.ClientId,
                    Fio = x.Client.LastName + ' ' + x.Client.FirstName + ' ' + x.Client.SurName,
                    x.IsBanned,
                    x.Forfeit,
                    Orders = orders.Count(),
                    Last = last == DateTime.MinValue ? null : (DateTime?)last,
                    //Last = last == null ?null : (DateTime?)last.DateFrom,
                    //LastD = last == null ? null : (DateTime?)last.Date,
                    //Last = last.DateFrom,
                    //LastD = last.Date,
                };

            var list = await query1.ToListAsync();

            return Json(list);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(string filter, string group)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.Clients);

            if (string.IsNullOrWhiteSpace(filter)) return Ok();

            var query = Db.Clients.SearchByText(filter);

            if (!string.IsNullOrWhiteSpace(group))
            {
                group = group.Trim();
                query = query
                    .Where(x => x.Groups.Contains(group));
            }

            var query1 =
                from x in query
                select new
                {
                    x.Id,
                    Fio = x.LastName + " " + x.FirstName + " " + x.SurName,
                    Email = MiscUtils.HideMailChars(x.Email),
                    Phones = MiscUtils.HidePhoneChars(x.Resources.FirstOrDefault().Value)
                };
            var list = await query1.Take(10).ToListAsync();
            return Json(list);
        }

        /// <summary>
        /// Получение информации о штрафе у клиента
        /// </summary>
        [HttpGet("forfeit")]
        public async Task<IActionResult> GetForfeitAsync(Guid? client)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            //if (!client.HasValue)
            client ??= user.ClientId;

            var part = Db.GetOrCreateClientPart(client, user?.DomainId, 22);
            //var forfeit = await Db.ForfeitAsync( user.DomainId, client);

            return Json(new
            {
				Forfeit = part.Forfeit,
                //Forfeit = forfeit,
            });
        }        





        [HttpGet("totals")]
        public async Task<IActionResult> TotalsAsync(
            string text,
            DateTime? dfrom,
            DateTime? dto,
            Guid? domain
            )
        {
            this.RequiresAuthentication();
            this.RequiresAdmin();

            //string text = Convert<string>(this.Request.Query.text);
            //DateTime? dfrom = Convert<DateTime?>(this.Request.Query.dfrom);
            //DateTime? dto = Convert<DateTime?>(this.Request.Query.dto);
            //Guid? domain = Convert<Guid?>(this.Request.Query.domain);


            var date1 = dfrom ?? DateTime.MinValue;
            var date2 = dto ?? DateTime.MaxValue;

            var qclients = Db.Clients.SearchByText(text);

            if (domain.HasValue)
                qclients = qclients.GetDomainObjects(domain, true);


            var qorders1 = Db.Orders  // получаем базовый список заказов
                    //.Where(o => o.Status != DocumentStatus.Unknow)
                    .Where(o => Sql.Between(o.DateFrom, date1, date2) || Sql.Between(o.DateTo, date1, date2))
                    .Select(o => new
                    {
                        o.Status,
                        o.ClientId,
                        o.Reason,
                        o.TotalOrder,
                        o.TotalPays,
                        //o.Forfeit,  // o.ForfeitSum
                        Forfeit = o.PaidForfeit,
                        DiscountSum = o.RoomClientDiscountSum + o.EqClientDiscountSum,
                    });

            //.Where(o =>
            //   o.DateFrom <= date1 && o.DateTo > date1 ||  // df .. D1 ... dt
            //   o.DateFrom < date2 && o.DateTo >= date2 ||   // df .. D2 ... dt
            //   o.DateFrom >= date1 && o.DateTo <= date2     // D1 .. dt ... dt .... D2
            //);
            var orders1 = await qorders1
                .Where(o => o.Status != OrderStatus.Unknown)
                .ToListAsync(); // в SQL делается долго

            // Попытка посчитать orders -> clients провалилась, т.к. неоптимальный запрос, считается очень долго
            //var orders01 = orders00;
            //if (domain.HasValue)
            //    orders01.Where(cl => cl.DomainId == domain);

            //var qclients00 =
            //    from o in orders01
            //    let cl = o.Client
            //    select new
            //    {
            //        cl.Id,
            //        City = cl.City.Name,
            //        Domain = cl.Domain.Name,
            //        cl.FirstName,
            //    };

            var qclients1 =
                from cl in qclients
                //let orders = qorders1.Where(o => o.ClientId == cl.Id)
                where qorders1.Any(o => o.ClientId == cl.Id)
                select new
                {
                    cl.Id,
                    Logins = cl.User == null ? 0 : 1,
                    cl.Email,
                    City = cl.City.Name,
                    Domain = cl.Domain.Name,
                    Name = (cl.FirstName ?? "") + " " + (cl.LastName ?? "") + " " + (cl.SurName ?? "")
                };
            var clients1 = await qclients1.ToListAsync();

            var clients =
                from cl in clients1
                let orders = orders1.Where(o => o.ClientId == cl.Id).Where(o => o.Status != OrderStatus.Unknown).ToList()
                where orders.Any()
                let reservs = orders.Where(y => y.Status == OrderStatus.Reserv)
                let paids = orders.Where(y => y.Status == OrderStatus.Closed)
                let cancels = orders.Where(y => y.Reason == CancelReason.Normal)  // y.Status == OrderStatus.Cancel && 
                let forfeits = orders.Where(y => y.Reason == CancelReason.ForfeitsConfirmed)  // y.Status == OrderStatus.Cancel && 

                let name = cl.Name // (cl.FirstName ?? "") + " " + (cl.LastName ?? "") + " " + (cl.SurName ?? "")

                select new
                {
                    cl.Id,
                    //Logins = cl.User == null ? 0 : 1,
                    cl.Logins,
                    //Name = x.FirstName == null ?"Без имени: " + x.Id :(x.FirstName + " " + x.LastName + " " + x.SurName),
                    //Name = ,
                    Name = $"<a href='#!/clients/edit?oid={cl.Id}'>{name}</a>",
                    cl.Email,
                    //City = cl.CityId == null ? "(не задан)" : cl.City.Name,
                    cl.City,
                    //Domain = cl.DomainId == null ? "(Мобильный)" : cl.Domain.Name,
                    cl.Domain,

                    Orders = orders.Count(),
                    Reservs = reservs.Count(),
                    Paids = paids.Count(),
                    Cancels = cancels.Count(),
                    Forfeits = forfeits.Count(),

                    SOrders = orders.Sum(x => x.TotalOrder),
                    SReservs = reservs.Sum(x => x.TotalOrder),
                    SPaids = paids.Sum(x => x.TotalPays),
                    SCancels = cancels.Sum(x => x.TotalOrder),
                    SForfeits = forfeits.Sum(x => x.Forfeit),
                    SDiscounts = orders.Sum(x => x.DiscountSum),
                };


            //var list = await clients.ToListAsync(); //.Take(100)
            var list = clients.ToList();
            return Json(list);
        }


        /// <summary>
        /// Отчет для PowerBI
        /// </summary>
        [HttpGet("totals-bi")]
        public async Task<IActionResult> TotalsBIAsync()
        {
            //var qorders = Db.Orders  // получаем базовый список заказов
            //    .Where(o => o.Status != OrderStatus.Unknow)
            //    .Select(o => new
            //    {
            //        o.Status,
            //        o.ClientId,
            //        o.Reason,
            //        o.TotalSum,
            //        o.ForfeitSum,
            //        DiscountSum = o.RoomClientDiscountSum + o.EqClientDiscountSum,
            //    });

            //var lorders = await qorders1.ToListAsync(); // в SQL делается долго
          

            //var qclients =
            //    from cl in Db.Clients
            //    //where qorders.Any(o => o.ClientId == cl.Id)
            //    select new
            //    {
            //        cl.Id,
            //        NLogins = cl.User == null ? 0 : 1,
            //        //Name = (cl.FirstName ?? "") + " " + (cl.LastName ?? "") + " " + (cl.SurName ?? "")
            //    };

            //var lclients = await qclients.ToListAsync();

            var clients =
                from cl in Db.Clients

                let orders = Db.Orders
                    .Where(o => o.ClientId == cl.Id)
                    .Where(o => o.Status != OrderStatus.Unknown)

                where orders.Any()

                let reservs = orders.Where(y => y.Status == OrderStatus.Reserv)
                let paids = orders.Where(y => y.Status == OrderStatus.Closed)
                let cancels = orders.Where(y =>y.Reason == CancelReason.Normal)  // || y.Reason == null) y.Status == OrderStatus.Cancel && 
                let forfeits = orders.Where(y => y.Reason == CancelReason.ForfeitsConfirmed) //y.Status == OrderStatus.Cancel && 

                select new
                {
                    cl.Id,

                    NLogins = cl.User == null ? 0 : 1,

                    NOrders = orders.Count(),
                    NReservs = reservs.Count(),
                    NPaids = paids.Count(),
                    NCancels = cancels.Count(),
                    NForfeits = forfeits.Count(),

                    SOrders = orders.Sum(o => o.TotalOrder),
                    SReservs = reservs.Sum(o => o.TotalOrder),
                    SPaids = paids.Sum(o => o.TotalPays),
                    SCancels = cancels.Sum(o => o.TotalOrder),
                    SForfeits = forfeits.Sum(o => o.PaidForfeit),// ForfeitSum
                    SDiscounts = orders.Sum(o => o.RoomClientDiscountSum + o.EqClientDiscountSum),
                };

            var list = await clients.ToListAsync();
            return Json(list);
        }




        [HttpGet("html/{id}")]
        public async Task<IActionResult> GetHtmlAsync(Guid id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var client = await Db.Clients
                //.LoadWith(x=>x.User)
                //.GetDomainObjects(user?.DomainId)
                .FindAsync(id);

            var parts = await Db.ClientParts
                .LoadWith(x => x.Domain)
                .Where(x => x.ClientId == id)
                //.Select(x => new
                //{
                //    x.Id,
                //    Domain = x.Domain.Name,
                //    x.Forfeit,
                //    x.Discount,
                //    HasForfeit = x.Forfeit > 0,
                //    HasDiscount = x.Discount > 0,
                //    x.IsBanned,
                //})
                .ToListAsync();

            var logins = await Db.Users
                .Where(x => x.ClientId == id)
                .ToListAsync();

            var model = new ClientModel
            {
                IsAdmin = user.IsSuper(),
                Client = client,
                Parts = parts, //.OfType<dynamic>().ToList(),
                Logins = logins,
                User = user,
            };

            //var viewname = user?.IsAdmin == true ? "client" : "client-any";
            var view = View("client", model);
            return view;
        }

        [HttpGet("info")]
        public async Task<IActionResult> GetInfoAsync(Guid? id, string filter)
        {
            if (id == null && string.IsNullOrWhiteSpace(filter))
                throw new ArgumentException("Должен быть задан ИД или фильтр");

            this.RequiresAuthentication();
            var user = this.CurUser();

            var qclients = Db.Clients
                .Finds(id)
                //.LoadWith(x => x.Domain)
                .SearchByText(filter);

            var client = await qclients
                .FirstOrDefaultAsync();

            if (client == null)
                return Ok();

            var part = Db.GetOrCreateClientPart(client.Id, user?.DomainId, 31);
            //var domain = client.DomainId == user.DomainId;  // client.DomainId == null || согл задаче 17062 - запрещаем модификацию мобильных клиентов

            //var forfeit = await Db.ForfeitAsync( user.DomainId, client.Id);

            //var docs = await Db.Abonements
            var history = await Db.Messages
                .Where(x => x.ClientId == client.Id)
                .Where(x => x.Kind == MessageKind.User)
                .OrderByDescending(x => x.Date)
                .Select(m => new { m.Date, m.Text, m.Kind })
                .Take(10)
                .ToListAsync();

            var parts = await Db.ClientParts
                .Where(x => x.ClientId == client.Id)
                .Select(m => new
                {
                    IsDiscount = m.Discount > 0,
                    IsForfeit = m.Forfeit > 0,
                    m.IsBanned,
                    m.PayKind,
                    m.DomainId,
                    Domain = m.Domain.Name,
                })
                .ToListAsync();

            var phones = await Db.Resources
                .Where(r => r.ObjectId == client.Id)
                .Where(r => r.Kind == ResourceKind.ClientPhone)
                .Select(r => r.Value)
                .ToListAsync();

            var res = new
            {
                client.Id,
                client.DateBirthday,
                client.Email,
                client.FirstName,
                client.LastName,
                client.SurName,
                PhotoUrl = client.PhotoUrl ?? "*",
                client.CityId,
                client.GroupId,
                client.Groups,
                client.Spheres,
                client.Types,
                client.Genres,
                client.Styles,
                client.Tools,

                phones,

                client.Gender,
                //client.ToolId,
                //client.StyleId,
                //client.TypeId,
                //IsDomain = domain,
                //Creator = client.CreatorDomain,
                //os = client.OS,
                //client.ActivityId,
                //client.GenreId,
                client.Music,
                //client.Comments,
                //client.Post,
                client.SourceId,
                client.SourceUrl,
                client.TypeInfo,
                vkUrl = client.VkUrl,
                //client.PushID,

                //PartId = part.Id,
                part?.Forfeit,
                //forfeit,
                part?.IsBanned,
                part?.Discount,
                part?.PayKind,
                //part.AssignedName,
                //part.EditorName,
                //part.HasWarnings,
                history,
                parts,
            };
            return Json(res);
        }



        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.Clients);

            var client = await Db.Clients
                .LoadWith(x => x.Domain)
                .FindAsync(id);

            var part = Db.GetOrCreateClientPart(id, user.DomainId, 23) ?? ClientPart.Empty;
            var domain = client.DomainId == user.DomainId;  // client.DomainId == null || согл задаче 17062 - запрещаем модификацию мобильных клиентов
            //var balance = CRM.PointsService.GetBalance(Db.Points.Where(p => p.User.ClientId == id));
            var balance = await Db.Transactions.Where(t => t.ClientId == id).BalanceAsync( Fin.Groups.REG_POINTS );
            //var forfeit = await Db.ForfeitAsync( user.DomainId, id); // пока оменяем для старой версии

            var res = new
            {
                client.Id,
                client.DateBirthday,
                client.Email,
                client.FirstName,
                client.LastName,
                client.SurName,
                PhotoUrl = client.PhotoUrl ?? "*",
                Forfeit = part.Forfeit,
                //forfeit,
                client.CityId,
                client.GroupId,
                client.Groups,
                client.Spheres,
                client.Types,
                client.Genres,
                client.Gender,
                client.Styles,
                client.Tools,
                //client.ToolId,
                //client.StyleId,
                //client.TypeId,
                IsDomain = domain,
                Creator = client.CreatorDomain,
                //os = client.OS,
                //client.ActivityId,
                //client.GenreId,
                client.Music,
                //client.Comments,
                //client.Post,
                client.SourceId,
                client.SourceUrl,
                client.TypeInfo,
                client.VkUrl,
                //client.PushID,
                Balance = balance,
                client.Notifications,

                PartId = part.Id,
                part.IsBanned,
                part.Discount,
                part.PayKind,
                //part.AssignedName,
                //part.EditorName,
                //part.HasWarnings,
            };
            return Json(res);
        }

        [HttpPost("upload")]
        [Obsolete]
        public async Task<IActionResult> UploadPhoto(bool update = false)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var file = this.Request.Form.Files.FirstOrDefault();

            var name = Guid.NewGuid().ToString();
            var filename = name + ".jpg"; //Path.GetExtension(file.Name);
            //filename = filename.Replace("/", @"\");
            var PhotoUrl = $"users/{user.Id}/{filename}";
            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/res/" + PhotoUrl);
            Itall.IO.Path2.EnsureExist(filepath);

            if (file != null)
            {
                //var size = Utils.ImageHelper.GetConfigWidthHeight();
                using var stream = Itall.Drawing.GraphicUtils.ResizeImage(file);
                using var image = Image.FromStream(stream);
                image.Save(filepath, ImageFormat.Jpeg);
                //image.Dispose();
                //stream.Dispose();
            }
            else
                PhotoUrl = null;

            if(update)
            {
                var client = user.ClientId;
                await Db.Clients
                    .Finds(client)
                    .Set(cl => cl.PhotoUrl, PhotoUrl)
                    .UpdateAsync();
            }
            return Json(new
            {
                PhotoUrl = PhotoUrl,
            });
        }


        // ADDED BY ELMSOFT: 2019-04-09 - непонятно какая версия
        [HttpPost("upload-1")]
        public IActionResult Upload1()
        //public void UploadAsync()
        {
            var file = this.Request.Form.Files.FirstOrDefault();
            if (file != null)
            {
                var type = file.ContentType;
                var sr = new StreamReader(file.OpenReadStream(), Encoding.GetEncoding(1251));
                List<string> strlineFromFile = new List<string>();
                while (!sr.EndOfStream)
                {
                    string strline = sr.ReadLine();
                    strlineFromFile.Add(strline);
                }
                sr.Close();
                var rowData = strlineFromFile.Skip(1).ToList();

                List<Client> clients = new List<Client>();
                foreach (var line in rowData)
                {
                    string[] elemParse = line.Split(';');
                    Client client = new Client();

                    client.Id = Guid.NewGuid();
                    client.FirstName = elemParse[0];
                    client.LastName = elemParse[1];
                    client.SurName = elemParse[2];
                    client.Email = elemParse[3];
                    client.DateBirthday = Convert.ToDateTime(elemParse[4]);

                    clients.Add(client);
                    Db.CreateInsert(client);
                }
             
            }
            return Ok();
        }


        static IQueryable<Client> searchClients(IQueryable<Client> query, string search, bool anyWhereSearch = false)
        {
            if (string.IsNullOrWhiteSpace(search)) return query;

            var words = search.Split(' ').Where(x => !string.IsNullOrWhiteSpace(x));
            foreach (var word in words)
            {
                if (anyWhereSearch)
                {
                    var phone = MiscUtils.FormatPhone(word);
                    query = query
                        .Where(x =>
                            x.FirstName.Contains(word) ||
                            x.LastName.Contains(word) ||
                            x.SurName.Contains(word) ||
                            x.Resources.Any(r => r.Value == phone) ||
                            ("=" + x.BitrixNum).StartsWith(word)
                        );
                }
                else
                    query = query
                            .Where(x =>
                                x.FirstName.Contains(word) ||
                                x.LastName.Contains(word) ||
                                x.SurName.Contains(word)
                            );
            }
            return query;
        }


    }
}



#region Misc


//#region Universal uploader                
//DataTable csvData = new DataTable();
//var col = strlineFromFile.Take(1).FirstOrDefault();
//var colFields = strlineFromFile.Take(1).FirstOrDefault().Split(';');
//foreach (string column in colFields)
//{
//    DataColumn datecolumn = new DataColumn(column);
//    datecolumn.AllowDBNull = true;
//    csvData.Columns.Add(datecolumn);
//}

//var rowData = strlineFromFile.Skip(1).ToList();
//for (int i = 0; i < rowData.Count; i++)
//{
//    string elem = rowData[i];
//    string[] elemParse = elem.Split(';');
//    csvData.Rows.Add(elemParse);
//}
//Dictionary<string, string> propClient = new Dictionary<string, string>();
//var clientProp = new Client();
//var propList = clientProp.GetType().GetProperties();
//foreach (var prop in propList)
//{
//    string propName = prop.Name;
//    var custAtthr = prop.CustomAttributes.ToArray();
//    string headerElem = "";
//    if (custAtthr != null && custAtthr.Length > 1)
//    {
//        headerElem = custAtthr[1].ConstructorArguments[0].Value.ToString();
//    }

//    propClient.Add(propName, headerElem);
//}
//#endregion  



///// <summary>
/////  Проверка почты на актуальность (added by ELMSOFT)
///// </summary>
//[Route("confirmemail")]
//public async Task<IActionResult> ConfirmEmail(Guid id)
//{
//    //this.RequiresAuthentication();

//    var client = await Db.Clients.FindAsync(id);
//    if (client != null)
//    {
//        // вставил код PSV
//        var r = await Db.Users.Finds(id)
//            .Set(u => u.IsConfirmed, true)
//            .UpdateAsync();

//        if (r > 0)
//            return Ok();

//        // старый код ElmSoft
//        //var user = await Db.Users.FindAsync(client.Id); ;
//        //if (user != null)
//        //{
//        //    user.IsConfirmed = true;
//        //    Db.Save(user);
//        //    return Ok();
//        //}
//    }

//    return BadRequest();
//}
#endregion
