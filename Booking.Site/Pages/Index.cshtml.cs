using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace My.Site.Pages
{
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
            var agent = Request.Headers["User-Agent"];

            //var q = this.Request.Query.FirstOrDefault();
            var q = this.RouteData.Values["module"] ?? "booking";

            this.Config = new AppConfig
            {
                IsMobile = Itall.WebUtils.IsMobile(agent),
                Module = "" + q,
                Title = "Musbooking",
            };
        }

        public AppConfig Config;
    }


    public class AppConfig
    {
        public string Title { get; set; }
        public bool IsMobile { get; set; }
        public string Module { get; set; }
    }
}
