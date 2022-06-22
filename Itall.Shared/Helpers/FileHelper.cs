using Itall;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace My
{
    /// <summary>
    /// Утилита для работы с изображениями
    /// </summary>
    public static class FileHelper
    {
        const string WWWROOT = @"wwwroot\";    // корневой каталог на сервере
        const string WWWROOT_RES = WWWROOT + @"res\";   // папка для записи файлов
        static string PREFIX = DateTime.Now.ToString("yyMMdd-HHmm"); // Начальное заполнение для файла
        static int N = 0;

        /// <summary>
        /// Генерирует уникальное имя файла с учетом папки, суффикаса
        /// </summary>
        public static (string rel, string full) GetFilePath(string filename, string folder, string suffix = null)
        {
            var ext = Path.GetExtension(filename);
            var filePath = $"{PREFIX}-{++N}{ext}";

            if (!string.IsNullOrEmpty(folder))
                filePath = $"{folder}/{filePath}";
            if (!string.IsNullOrEmpty(suffix))
                filePath += $".{suffix}{ext}";

            filePath = filePath.Replace("\\", "/");
            var fullPath = (WWWROOT_RES + filePath).Replace('\\', '/');
            return (filePath, fullPath);
        }


        ///// <summary>
        ///// Возвращается размер конечного изображения
        ///// </summary>
        //public static (int w, int h) GetConfigWidthHeight()
        //{
        //    var width = App.Configs.Get("image-width")?.AsInt ?? 800;
        //    var height = App.Configs.Get("image-height")?.AsInt ?? 800;
        //    return (width, height);
        //}



        /// <summary>
        /// Асинхронная запись в файл
        /// </summary>
        public static void LogFile(string text, string prefix = null)
        {
            //await Task.Delay(1000);  // async Task for LogFile().ConfigureAwait(false);

            //lock (_Lock)
            {
                var d = DateTime.Now;
                var fname = $"logs/{d.Year}-{d.Month}-{d.Day}.log";
                Itall.IO.Path2.EnsureExist(fname);

                System.IO.File.AppendAllTextAsync(fname, $"{d.ToUtcString()} {prefix}:   {text}\n").ConfigureAwait(false);
            }
        }



        /// <summary>
        /// Загрузка файла в локальную папку wwwroot/res/... на сервере и возрат относительного имени файла и полного пути
        /// </summary>
        public static async Task UploadFileAsync(Microsoft.AspNetCore.Http.IFormFile file, string fullPath)
        {
            if (string.IsNullOrWhiteSpace(fullPath))
                throw new NullReferenceException("path is null");

            Itall.IO.Path2.EnsureExist(fullPath);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            //newImage.Save(destfile, System.Drawing.Imaging.ImageFormat.Jpeg);
            //return fullPath;
        }


        public static void UploadResizeImage(Microsoft.AspNetCore.Http.IFormFile file, string filepath, int width = 0, int height = 0)
        {
            if (string.IsNullOrWhiteSpace(filepath))
                throw new NullReferenceException("path is null");

            Itall.IO.Path2.EnsureExist(filepath);


            using var stream = Itall.Drawing.GraphicUtils.ResizeImage(file, width, height);
            using var image = System.Drawing.Image.FromStream(stream);
            image.Save(filepath, System.Drawing.Imaging.ImageFormat.Jpeg);
        }

        /// <summary>
        /// Получаем список файлов по маске относительно WWWROOT
        /// </summary>
        public static IEnumerable<string> GetFiles(string mask = "*.*", string folder = null, bool replace_root = true)
        {
            var root = WWWROOT;
            if (folder != null)
                root += folder + "\\";
            IEnumerable<string> files = Directory.GetFiles(root, mask, SearchOption.AllDirectories);
            if (replace_root)
            {
                files = files
                    .Select(x => x.Replace(root, ""))
                    //.Where(x => !x.StartsWith("lib"))
                    ;
            }
            return files;
        }


    }
}