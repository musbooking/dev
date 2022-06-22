using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using System.IO;
using LinqToDB;
using System.Collections.Generic;
using My.App;
using Itall.App.Data;
using System.Drawing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace My.App.Common
{
    //[Route("resources")]
    public class ResourcesController : UpdateDbController<Resource>
    {

        public static void Config(IConfigurationSection config)
        {
            config.Bind(_Watermark);
        }

        static Itall.Drawing.Watermark _Watermark = new Itall.Drawing.Watermark();

        protected override object OnUpdating(Updater<Resource> updater)
        {
            base.OnUpdating(updater);

            updater.Set(x => x.IsArchive);
            updater.Set(x => x.Kind);
            updater.Set(x => x.Name);
            updater.Set(x => x.Description);
            updater.Set(x => x.ObjectId);
            updater.Set(x => x.Value);
            updater.Set(x => x.Sort);

            var obj = updater.Object;
            if (obj.Kind == ResourceKind.ClientPhone) // если редактируем телефон, то помечаем клиента для синхронизации
            {
                updater.Db.GetTable<CRM.Client>()
                    .Where(x => x.Id == obj.ObjectId)
                    .Set(x => x.InSync, true)
                    .Update();
            }

            return base.OnUpdating(updater);
        }


        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync(ResourceKind kind, Guid id)
        {

            var query = Db.Resources
                //.GetDomainObjects(this.CurUser()?.DomainId)
                //.Where(x=>x.ObjectId==id)
                .Where(x => x.Kind == kind && x.ObjectId == id) //
                .Select(x => new
                {
                    x.Id,
                    x.Value,
                    x.Name,
                    x.Description,
                    x.Sort
                })
                .OrderBy(x => x.Sort);
            var list = await query.ToListAsync();
            return Json(list);
        }



        [HttpGet("cameras")]
        public Task<IActionResult> GetCamerasAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.Cameras);

            //ResourceKind kind = Convert<ResourceKind?>(this.Request.Query.kind) ?? ResourceKind.Camera;
            return getTypedResources(ResourceKind.BaseCamera);
        }



        /// <summary>
        /// Метод тестирует наличие в базе такого же значения
        /// </summary>
        [HttpGet("testPhone")]
        public IActionResult TestPhone(string phone, Guid id)
        {
            this.RequiresAuthentication();

            var error = Db.TestPhoneExists(id, phone);
            return Ok(error ?? "");
        }



        async Task<IActionResult> getTypedResources(ResourceKind kind)
        {
            var user = this.CurUser();
            var domain_id = user?.DomainId;
            //var resources = await Db.Resources
            //    .GetDomainObjects(user?.DomainId)
            //    .Where(y => y.Kind == kind).ToListAsync();

            var query =
                from x in Db.Bases.GetDomainObjects(domain_id, false)
                let resources = Db.Resources
                    .GetDomainObjects(domain_id, false)
                    .Where(y => y.Kind == kind)
                    .Where(y => y.ObjectId == x.Id)
                orderby x.SphereId, x.Name
                select new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    //x.Type,
                    x.SphereId,
                    Resources = resources,
                };
            var list = await query.ToListAsync();

            return Json(list);
        }



        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            var user = this.CurUser();

            var obj = await Db.Resources
                .GetDomainObjects(user?.DomainId)
                .FindAsync(id);

            return Json(new
            {
                obj.Id,
                obj.Value,
                obj.Name,
                obj.Description,
                obj.Sort,
            });
        }



        [HttpPost("upload")]
        public async Task<IActionResult> UploadAsync(Guid? room /*устарел*/, Guid? id, ResourceKind kind = ResourceKind.RoomPhoto)
        {
            var user = this.CurUser();
            var files = this.Request.Form.Files;
            id = id ?? room;  // for legacy

            var resourses = new List<Resource>();

            foreach (var file in files)
            {
                var name = Guid.NewGuid().ToString();
                var filename = name + ".jpg"; //Path.GetExtension(file.Name);
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/files/res/" + filename);
                Itall.IO.Path2.EnsureExist(filepath);

                var image = Image.FromStream(file.OpenReadStream());
                //var size = Utils.ImageHelper.GetConfigWidthHeight();
                _Watermark.ResizeAndWatermarkImage(image, filepath);

                // добавляем оригинальное изображение - его мы отображаем в привязке к комнате
                var sort = await Db.Resources
                    .Where(x => x.ObjectId == id).MaxAsync(x => (int?)x.Sort)
                    ?? 0;
                var resourse = new Resource
                {
                    ObjectId = id.Value,
                    Kind = kind,
                    //Name = Path.GetFileNameWithoutExtension(Path.GetFileName(file.Name)),
                    Name = name,
                    Value = filename,
                    DomainId = user?.DomainId,
                    Sort = sort + 1, //sort.HasValue ? sort + 1 : 0
                };
                resourses.Add(resourse);
                await Db.CreateInsertAsync(resourse);
            }
            return Json(resourses);
        }


        [HttpPost("clear")]
        public async Task<IActionResult> ClearImagesAsync()
        {
            /// Загружаем значчения картинок
            var res = await Db.Resources
                .Where(d => d.Kind == ResourceKind.RoomPhoto)
                .Select(d => d.Value)
                .ToListAsync();

            var clients = await Db.Clients
                .Select(d => d.PhotoUrl)
                .Where(v => v != null)
                .Distinct()
                .ToListAsync();

            var eqs = await Db.Equipments
                .Select(d => d.PhotoUrl)
                .Where(v => v != null)
                .Distinct()
                .ToListAsync();

            var bases = await Db.Bases
                .Select(d => d.Logo)
                .Where(v => v != null)
                .Distinct()
                .ToListAsync();

            // получаем единый словарь
            var all_dict = res
                .Union(clients)
                .Union(eqs)
                .Union(bases)
                .ToDictionary(v => v, v => v);

            var n = 0;
            var m = 0;
            check_file("files\\res");
            check_file("res");

            void check_file(string path)
            {

                var files = FileHelper.GetFiles("*.*", path);
                foreach (var file in files)
                {
                    n++;
                    if (all_dict.ContainsKey(file)) continue;
                    m++;
                    var filename_src = Directory.GetCurrentDirectory() + $"\\wwwroot\\{path}\\{file}";
                    var filename_dst = Directory.GetCurrentDirectory() + $"\\wwwroot\\_archive\\{path}\\{file}";
                    Itall.IO.Path2.EnsureExist(filename_dst);
                    System.IO.File.Move(filename_src, filename_dst);
                }
            }

            return Ok($"total: {n}, moved: {m}");
        }
    }
}