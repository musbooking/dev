using Itall;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace My.App
{
    /// <summary>
    /// Ядерный контроллер приложения
    /// </summary>
    public class CoreController: Itall.App.BaseApiController
    {
        /// <summary>
        /// Get embeded resource content
        ///     sample:  /template: 'http->My.Modules.Items.Notes._web_.item.html'
        /// </summary>
        [HttpGet("resc/{name}"), Produces("application/json")]
        public async Task<string> GetResourceContentAsync(string name)
        {
            var assembly = System.Reflection.Assembly.GetExecutingAssembly();
            var resourceStream = assembly.GetManifestResourceStream(name);
            if (resourceStream == null)
                return "Resource not found: " + name;
            using var reader = new System.IO.StreamReader(resourceStream, System.Text.Encoding.UTF8);
            return await reader.ReadToEndAsync();
        }


        /// <summary>
        /// generate guid
        /// </summary>
        [HttpGet("guids")]
        public IActionResult GetGuids(int n = 1)
        {
            if (n < 1 || n > 100) throw new Exception("n = 1..100");

            var guids = Enumerable.Range(1, n)
                .Select(i => Guid.NewGuid())
                .ToList();

            return Json(guids);
        }

        //static string PREFIX = DateTime.Now.ToString("yyMMdd-HHmm"); // Начальное заполнение для файла
        //static int N = 0;


        [HttpPost("upload")]
        public async Task<IActionResult> UploadAsync(string prefix = "" /* устарел, убрать после 2021-05*/, string folder = null)
        {
            var file = this.Request.Form.Files.FirstOrDefault();
            if (file?.Length == 0) return Ok();

            //var ext = Path.GetExtension(file.FileName);
            //var filePath = $"{PREFIX}-{++N}{ext}";
            //if (!string.IsNullOrEmpty(prefix))
            //    filePath = prefix + "\\" + filePath;
            
            folder = folder ?? prefix;
            var path = FileHelper.GetFilePath(file.FileName, folder);
            await FileHelper.UploadFileAsync(file, path.full);

            return Json(new { file.Name, file.Length,  Path = path.rel, });
        }

        /// <summary>
        /// Загрузка изображений с одновременным сжатием картинки и преобразованием в jpeg
        /// </summary>
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImageAsync( string folder, int width = 0, int height = 0, bool origin = false)
        {
            var file = this.Request.Form.Files.FirstOrDefault();

            if (origin)
            {
                var origin_path = FileHelper.GetFilePath(file.FileName, folder, "origin");
                await FileHelper.UploadFileAsync(file, origin_path.full);
            }

            var path = FileHelper.GetFilePath(".jpeg", folder);
            FileHelper.UploadResizeImage(file, path.full, width, height);

            return Json(new { file.Name, file.Length, Path = path.rel, });
        }




        [HttpPost("upload-crop")]
        public async Task<IActionResult> UploadImageCropAsync(string folder, int size, bool origin = false)
        {
            var file = this.Request.Form.Files.FirstOrDefault();
            if (file == null || file?.Length == 0) return Json(new { });  // возвращаем пустой результат

            //var ext = Path.GetExtension(file.FileName);
            //var filePath = $"{PREFIX}-{++N}{ext}";
            //if (!string.IsNullOrEmpty(prefix))
            //    filePath = prefix + "/" + filePath;

            //var fullPath = (WWWROOT_RES + filePath).Replace('\\', '/');
            //Itall.IO.Path2.EnsureExist(fullPath);

            if (origin)
            {
                //var r = await ImageHelper.UploadFileAsync(file, filePath + $".origin{ext}");
                var origin_path = FileHelper.GetFilePath(file.FileName, folder, "origin");
                await FileHelper.UploadFileAsync(file, origin_path.full);
            }


            // Конвертируем файл в jpeg image
            System.Drawing.Image originImage;
            using (var reqStream = file.OpenReadStream())
            {
                originImage = System.Drawing.Image.FromStream(reqStream);
            }

            // сохраняем файл
            var file_path = FileHelper.GetFilePath(file.FileName, folder);
            if (size > 0)
            { 
                // если ресайзить - то через image
                var d = Math.Min(originImage.Width, originImage.Height) / 2;
                var x0 = originImage.Width / 2;
                var y0 = originImage.Height / 2;
                //var image1 = Itall.Drawing.GraphicUtils.CropImage(originImage, size0, size0);
                //var image = Itall.Drawing.GraphicUtils.ResizeImage(image1, size, size);

                var image = Itall.Drawing.GraphicUtils.CropImage(originImage,
                    //System.Drawing.Rectangle.FromLTRB(1,1,size0-1,size0-1),
                    System.Drawing.Rectangle.FromLTRB( x0 - d, y0 - d, x0 + d, y0 + d),
                    System.Drawing.Rectangle.FromLTRB(0, 0, size, size));

                image.Save(file_path.full, System.Drawing.Imaging.ImageFormat.Png);
                //originImage.Save(fullPath + ".origin.png", System.Drawing.Imaging.ImageFormat.Png);
            }
            else
            {
                originImage.Save(file_path.full, System.Drawing.Imaging.ImageFormat.Jpeg);
            }

            return Json(new { file.Name, file.Length, Path = file_path.rel, });
        }


        [HttpGet("files")]
        public IActionResult GetFileNames(string mask = "*.*", [ModelBinder(typeof(Itall.App.DelimitedArrayModelBinder))]string[] dirs = null)
        {
            //var files = Directory.GetFiles(WWWROOT, mask, SearchOption.AllDirectories);
            //var res = files
            //    .Select(x => x.Replace(WWWROOT, ""))
            //    //.Where(x => !x.StartsWith("lib"))
            //    ;

            var files = FileHelper.GetFiles(mask);

            if (dirs?.Length > 0)
            {
                var dirs2 = dirs
                    .Select(s => s.Replace('/', '\\'))
                    .ToList();
                files = files
                    .Where(x => dirs2.Any(d => x.Contains(d)));
            }

            return Json(files);
        }



    }
}


#region Misc

// , bool user = false 
//var user_obj = this.CurUser();
//if (user && user_obj != null)
//{
//    folder += "/" + user_obj
//}



//var fullPath = FOLDER + filePath;
//Itall.IO.Path2.EnsureExist(fullPath);

//using (var stream = new FileStream(fullPath, FileMode.Create))
//{
//    await file.CopyToAsync(stream);
//}
////newImage.Save(destfile, System.Drawing.Imaging.ImageFormat.Jpeg);
//var path = filePath?.Replace(@"\", "/");

#endregion
