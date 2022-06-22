using My.App;
using My.App.Sys;
using Itall;
using Itall.App;
using LinqToDB;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using My.App.Common;

namespace My
{
    partial class SysUtils
    {
        public static string GetSourceName(App.Orders.SourceType type)
        {
            switch (type)
            {
                case App.Orders.SourceType.Web:
                    return "Web";
                case App.Orders.SourceType.Mobile:
                    return "Моб.";
                case App.Orders.SourceType.Calendar:
                    return "Календарь";
                case App.Orders.SourceType.Widget:
                    return "Виджет";
                case App.Orders.SourceType.Bot:
                    return "Бот";
                case App.Orders.SourceType.Catalog:
                    return "Каталог";
                //case SourceType.MobilePre:
                //    return "Моб-пред.";
                //case SourceType.WidgetPre:
                //    return "Виджет-пред.";
                //case SourceType.CatalogPre:
                //    return "Каталог-пред";
                default:
                    return "";
            }
        }


        public static void RequiresShare(this Itall.App.BaseController controller)
        {
            var user = controller.Login as User;
            if (!user.IsSuper() == true)
                throw new UnauthorizedAccessException("Требуется доступ к общим данным");
        }


        // округление до 5
        public static int Round5(double x)
        {
            var res = Math.Round((x + 0.1) / 5.0) * 5;
            return (int)res;
        }

        /// <summary>
        /// Формирование текста для обновления свойств
        /// </summary>
        public static string GetChangesText<T>(Itall.App.Data.Updater<T> updater) where T : Itall.Models.DbObject
        {
            var groups = DbCache.Groups.Get();
            var changes =
                from x in updater.GetChanges()
                let disp = x.Property.GetDisplayName(false)
                where !string.IsNullOrWhiteSpace(disp)
                let v = getName(x.NewValue, x.Property)
                select $"{disp}= '{v}'";

            var text = string.Join(", ", changes);
            return text;
        }

        static object getName(object v, PropertyInfo prop)
        {
            if (!(v is Guid)) return v;

            var gid = (Guid)v;

            var group = DbCache.Groups.Get().GetValueOrDefault2(gid, null);
            return group != null ? group.Name : gid.ToString();

            //var nameattr = prop.GetAttr<System.ComponentModel.TypeConverterAttribute>();
            //if(nameattr==null) return v;
            //var name = nameattr.ConverterTypeName;

            //if (name == AppObject.GROUP_NAME)
            //    return Modules.GroupsModule.Groups.Get().GetValueOrDefault(gid, Modules.GroupsModule.Default).Name;
            //if (name == AppObject.BASE_NAME)
            //    return Modules.BasesModule.Groups.Get().GetValueOrDefault(gid, Modules.GroupsModule.Default).Name;

            //return "attribute???" + name;
        }

        //public static void ResizeAndWatermarkImage(Image image, string destfile, int width, int height)
        //{
        //    //var image = Image.FromStream(file.OpenReadStream());
        //    //SysUtils.ResizeAndWatermarkImage(image, filepath, ImageWidth, ImageHeight);


        //    //using (var image = Image.FromFile(srcfile))
        //    using (var newImage = Itall.Drawing.GraphicUtils.ResizeImage(image, width, height, Watermark))
        //    {
        //        newImage.Save(destfile, System.Drawing.Imaging.ImageFormat.Jpeg);
        //    }
        //}

        //public static Image Watermark = null;


        public const string ERROR_PASSWORD = "Пароль должен содержать не менее 6 знаков и 1 цифры";

        //         
        public static void SendBaseUpdate(Guid? baseid)
        {
            if (baseid == null) return;
            UpdateHelper.Update($"base-{baseid}");
        }

        //          
        public static void SendForfeitUpdate(Guid? domainid)
        {
            if (domainid == null) return;
            UpdateHelper.Update($"forfeit-{domainid}");
        }



        public static string CreatePassword()
        {
            //var psw = String2.CreatePassword(App.Current.Config.PasswordLen, App.Current.Config.PasswordSpecLen);
            var psw = String2.CreatePassword(6, 0);
            //if (hash) psw = String2.HashPassword(psw);
            return psw;
        }

        public static void SaveMessage(App.Common.Message msg)
        {
            //bool save = App.Current?.ConfigFile?.Data?.server?.save ?? false;
            //if (!save) return;

            using var db = new App.DbConnection();
            db.CreateInsert(msg);  //db.SaveChangesAsync();

        }

        public static bool CheckPasswordStrength(string password)
        {
            if (password == null || password.Length < 6)
                return false;

            // if password has a number, plus one
            //if (!Regex.IsMatch(password, @"[\d]", RegexOptions.ECMAScript))
            //    return false;

            // if password has a special character, plus one
            //if (Regex.IsMatch(password, @"[~`!@#$%\^\&\*\(\)\-_\+=\[\{\]\}\|\\;:'\""<\,>\.\?\/£]", RegexOptions.ECMAScript))
            //    return true;

            return true;
        }

    }
}


