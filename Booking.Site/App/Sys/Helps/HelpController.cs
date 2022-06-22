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
    public class HelpController : BaseAppController
    {

        public static void Config(IConfiguration config)
        {
            config.Bind(_Items);
        }

        //private static System.Dynamic.ExpandoObject _Config = new System.Dynamic.ExpandoObject();
        private static Dictionary<string, HelpItem> _Items = new Dictionary<string, HelpItem>();

        [HttpGet("config")]
        public IActionResult GetConfig()
        {
            var cfg = new
            {
                items = _Items.Values,
            };
            return Json(cfg);
        }

        class HelpItem
        {
            public string Url { get; set; }
            public string Page { get; set; }
            public string Text { get; set; }
        }
    }
}
