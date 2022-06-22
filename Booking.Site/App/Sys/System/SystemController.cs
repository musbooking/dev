using Itall;
using LinqToDB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My.App.Sys
{
    //[Route("api/system")]
    public class SystemController : BaseAppController
    {
        public SystemController(IEnumerable<Sys.IAction<HttpContext>> httpactions)
        {
            _HttpAactions = httpactions;
        }

        public static void Config(IConfiguration config)
        {
            //_Config = new ClientConfig();
            config.Bind(_Config);
            //_Config = config.Get<System.Dynamic.ExpandoObject>();
        }

        /// <summary>
        /// Конфигурация приложения
        /// </summary>
        //class ClientConfig
        //{
        //    public string Title { get; set; }

        //    public string Header { get; set; }

        //    public string Copyright { get; set; }

        //    public bool Save { get; set; }

        //    public System.Drawing.Size Images { get; set; }
        //}

        //private static ClientConfig _Config;
        private static System.Dynamic.ExpandoObject _Config = new System.Dynamic.ExpandoObject();
        //private static Dictionary<string, object> _Config = new Dictionary<string, object>();


        IEnumerable<Sys.IAction<HttpContext>> _HttpAactions;

        [HttpGet("context")]
        public IActionResult GetContext()
        {
            _HttpAactions.ForEachTry(s => s.Invoke(Sys.ActionType.OpenSite, HttpContext));
            //var scope = (Scope)HttpContext.Items[Scope.VAR_NAME];

            var user = this.CurUser();

            var ldate = user?.Domain?.LimitDate ?? DateTime.Now; // дата окончания срока

            var context = new
            {
                Id = user?.Id,
                Name = user?.Name,
                ClientId = user?.ClientId,
                Roles = user?.GetRolesAsArray(),
                Login = user?.Login,
                IsSuper = user?.IsSuper(),
                IsLimit = user?.IsLimited(),
                IsLimit0 = user?.IsLimited(0),
                Remains = user?.Domain?.GetRemains(Sys.User.LIMIT_DAYS),
                LimitDate = ldate.AddDays(Sys.User.LIMIT_DAYS),
                Settings = new
                {
                    //Domain = user?.Domain,
                },
                user?.Permissions,
                Domain = user?.Domain?.Name ?? "",
                DomainId = user?.DomainId ?? null,
                //AllowShare = user?.Domain?.AllowShare ?? false,

                Browser = _Config,
                //Client = new
                //{
                //    header = _Config.Header,
                //    copyright = _Config.Copyright,
                //}
            };


#if DEBUG111
                var msg = new Message
                {

                    Date = DateTime.Now,
                    Kind = MessageKind.System,
                    Text = $"login: {login}", //, ip: {Request.UserHostAddress}",
                };
                db.CreateInsert(msg);
#endif
            return Json(context);
        }

        [HttpGet("config")]
        public IActionResult getConfig()
        {
            //this.RequiresAdmin();

            //var cfg = NancyApp.Current.GetConfig();
            ////return Response.AsJson((object)cfg.Data);
            ////var text = System.IO.File.ReadAllText(cfg.ConfigFile);
            ////text = text.ReplaceLineBreaks(""); //.Replace('"', '\'');
            ////return text;
            //var res = Itall.JsonUtils.ObjectToJson(cfg.Data);
            //return res;
            return Json(new
            {
                error = "Settings editor is blocked",
            });
        }

        [HttpPost("config")]
        public IActionResult SaveConfig(string data)
        {
            //this.RequiresAdmin();

            //var data1 = Itall.JsonUtils.JsonToObject<dynamic>(data);
            //var cfg = NancyApp.Current.GetConfig();
            //cfg.Save(data1);
            //return OK();
            throw new NotImplementedException();
        }

    }
}
