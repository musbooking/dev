using Itall;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace My.App.Sys
{
    public partial class CfgController : DbController
    {
        //public static string MenuPath = "appmenu.json";

        ///// <summary>
        ///// Метод возвращает список пунктов меню, который хранится в JSON файле
        ///// Список возвращается с учетом прав доступа и политик
        ///// </summary>
        //[HttpGet("menu")]
        //public IActionResult GetMenu()

        System.Collections.IEnumerable getMenu( string file )
        {
            var user = this.CurUser();

            try
            {
                var roots = Itall.JsonUtils.JsonFileToObject<CfgMenu[]>(WebApp.MapPath(file));
                var res = getmenu(roots);
                return res;
            }
            catch (Exception x)
            {
                throw new UserException("Ошибка при загрузке меню: " + x);
            }


            bool allow(CfgMenu menu)
            {
                if (menu.Block) return false;

                var opers = menu.Access?.Split(',')
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .ToArray();

                if (opers?.Length > 0)
                {
                    if (user == null) return false; // если есть операции доступа, то гости запрещены
                    var _allow = opers.Any(op => user.Allow(op));
                    if (!_allow) return false;
                }

                var policies = menu.If?.Split(',');
                if (policies?.Length > 0)
                {
                    var _deny = policies.Any(p => !checkPolicy(this.HttpContext, p));
                    if (_deny) return false;
                }

                return true;
            }

            System.Collections.IEnumerable getmenu(CfgMenu[] items)
            {
                return items?
                .Where(m => allow(m))
                .Select(m => new
                {
                    m.Text,
                    m.Kind,
                    Link = m.Link ?? "",
                    Icon = m.Icon ?? "",
                    Items = getmenu(m.Items),
                    m.Default,
                    m.Disabled,
                })
                .ToList();
            }

        }

        static bool checkPolicy(HttpContext http, string key)
        {
            if (string.IsNullOrWhiteSpace(key)) return true; // по умолчанию ок

            switch (key)
            {
                case "guest":  //"Неавторизованные пользователи",
                    return http.CurUser() == null;

                case "login":  //Авторизованные пользователи
                    return http.CurUser() != null;

                case "mobile":  //Мобильные девайсы
                    return Itall.WebUtils.IsMobile(http.Request.Headers["User-Agent"]);

                case "desktop":  //Компьютеры
                    return !Itall.WebUtils.IsMobile(http.Request.Headers["User-Agent"]);

                    //default:  //
                    //    return false;
            }
            var res = false;
            policy(http, key, ref res);
            return res;
        }

        /// <summary>
        /// Расширенные методы определения полиса
        /// </summary>
        static partial void policy(HttpContext http, string key, ref bool res);

    }
}
