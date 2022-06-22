using Itall;
using Itall.App.Auth;
using Microsoft.AspNetCore.Mvc;
using My.App.Sys;
using System;
using System.Linq;

namespace My
{
    public static partial class SysUtils
    {
        public static string HostUrl(this Controller controller, string path = "")
        {
            return controller.HttpContext.HostUrl(path);
        }

        //public static IActionResult Html(this Controller controller, string html, System.Text.Encoding encoding = null)
        //{
        //    return controller.Content(html, "text/html", encoding ?? System.Text.Encoding.UTF8);
        //}

        /// <summary>
        /// get current user
        /// </summary>
        public static User CurUser(this Itall.App.BaseController controller)
        {
            var user = controller.Login as User;
            return user;
        }

        /// <summary>
        /// get post-form parameter
        /// </summary>
        public static string Form(this Microsoft.AspNetCore.Http.HttpContext context, string name)
        {
            var val = context.Request.Form[name].FirstOrDefault();
            return val;
        }



        /// <summary>
        /// get current user
        /// </summary>
        public static User CurUser(this Microsoft.AspNetCore.Http.HttpContext context)
        {
            //var name = context.User?.Identity?.Name;
            //if(string.IsNullOrWhiteSpace(name))  // возникает рассогласование аутентификации
            //    name = context.Request.Cookies[Itall.App.Auth.AuthController.AUTH_COOKIE];
            var user = Itall.App.Auth.LoginsCache.Global.FindOrLoadLogin(context) as User;
            return user;
        }


        public static void RequiresAdmin(this Itall.App.BaseController controller)
        {
            var user = controller.Login as User;
            if (!user.IsSuper())
                throw new UnauthorizedAccessException("Необходимы права суперадминистратора системы");
        }


    }
}


