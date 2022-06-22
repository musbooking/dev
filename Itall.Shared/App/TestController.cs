using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Itall;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace My.App
{
    /// <summary>
    /// API для тестирования приложения
    /// </summary>
    //[Route("")]
    public class TestController : Itall.App.BaseController
    {
        /// <summary>
        /// Тестирование основных параметров сервера и запроса
        /// </summary>
        [HttpGet("info")]
        public async Task<IActionResult> GetInfo()
        {
            var sb = "".ToBuilder();
            WebUtils.Request2Strings( Request, sb );

            //try
            //{
            //    var geo = (await GetGeoAsync());
            //    sb.AppendLine($"Geo= {geo.Country}, {geo.Country_code}<br>");
            //}
            //catch (Exception err) 
            //{
            //    sb.AppendLine($"Geo error: {err}<br>");
            //}

            var pp = System.Net.NetworkInformation.IPGlobalProperties.GetIPGlobalProperties();
            //sb.AppendLine($"DhcpScopeName= {pp.DhcpScopeName}<br>");
            //sb.AppendLine($"DomainName= {pp.DomainName}<br>");
            sb.AppendLine($"HostName= {pp.HostName}<br>");
            //sb.AppendLine($"IsWinsProxy= {pp.IsWinsProxy}<br>");
            sb.AppendLine($"NodeType= {pp.NodeType}<br>");

            sb.AppendLine($".NET version= {Environment.Version}<br>");
            sb.AppendLine($"OS version= {Environment.OSVersion}<br>");

            sb.AppendLine($"Server Region: {System.Globalization.RegionInfo.CurrentRegion.EnglishName}<br>");

            sb.AppendLine($"Before collect GC Memory: {GC.GetTotalMemory(false)}<br>");
            sb.AppendLine($"After collect GC Memory: {GC.GetTotalMemory(false)}<br>");
            sb.AppendLine($"Force GC Memory: {GC.GetTotalMemory(true)}<br>");


            // need  app.UseRequestLocalization();
            //var requestCulture = Request.HttpContext.Features.Get<Microsoft.AspNetCore.Localization.IRequestCultureFeature>().RequestCulture;
            //var r2 = requestCulture.RequestCulture.

            var res = sb.ToString();
            return Html(res);
        }



        /// <summary>
        /// Тестирование колбеков
        /// </summary>
        [Route("callback/{*url}")]
        public IActionResult CallbackAsync()
        {
            var sb = new StringBuilder();
            WebUtils.Request2Strings( Request, sb);
            var text = sb.ToString();

            FileHelper.LogFile(text, "callback");
            return Ok(text);
        }


        /// <summary>
        /// test socket
        /// </summary>
        [HttpGet("socket/{channel}/{key}")]
        public async Task<IActionResult> TestSocketAsync(string channel, string key)
        {
            var dict = System.Web.HttpUtility.ParseQueryString(HttpContext.Request.QueryString.Value);
            var obj = dict.AllKeys.ToDictionary(k => k, k => dict[k]);

            //await WebApp.SendSocketAsync(channel, key, obj);
            var mgr = App.WebSocketManager.GetManager(channel);
            await mgr.SendAsync(key ?? "all", obj);

            // что-то еще? достаточно? 
            //await My.WebApp.Current.Mails.TestSendAsync("sergpy@mail.ru", "Тест 3333", "Боди 3333");
            //await My.WebApp.Current.Mails.TestSendAsync("142106@gmail.com", "Тест 111", "Боди 1111");
            //await My.WebApp.Current.Mails.TestSendAsync("serg4it@gmail.com", "Тест 222", "Боди 2222");

            var json = Newtonsoft.Json.JsonConvert.SerializeObject (obj);
            return Ok($"Send socket:  {channel}/{key} ==> {json}");
        }


    }
}
