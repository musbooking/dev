using Itall;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Itall.Services;
using LinqToDB;
using My.App;
using Itall.Models;
using Microsoft.AspNetCore.Http;

namespace My.App.Sys
{
    ///// <summary>
    ///// login event arguments
    ///// </summary>
    //public class LoginContext
    //{
    //    //public Nancy.NancyModule Module;
    //    public LoginInfo LoginInfo;
    //}


    /// <summary>
    /// Фильтрация входа по IP
    /// </summary>
    public class FilterAction: IService<HttpContext>
    {
        void IService<HttpContext>.Run(HttpContext context)
        {
            //var user = context.

            //if (context.LoginInfo.Allow(Permission.AnyIP))
            //    return;

            //var rules = AccessRulesModule.Rules.Get();
            //foreach (var rule in rules)
            //{
            //    if( rule.Value.Allow(context))
            //        return;
            //}

            throw new UnauthorizedAccessException("Запрещен вход с данного компьютера");
        }


    }
}