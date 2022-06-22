using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Itall;
using System.Linq;

namespace My.App
{
    public class AppController : Itall.App.BaseController
    {
        [HttpGet("version")]
        public IActionResult GetVersion()
        {
            // добавляем список задач в версию
            var info = new {
                ver1 = 7,
                ver2 = 5,
                ver3 = 2,

                year= 22, 
                month= 06, 
                day= 15, 
                num= 2, 
                branch= "master", 
                tasks= new[] 
                {
                    "7.5.2-2",
                    "88971",
                    "89957",
                    "88971-2",
                    "81781-3",
                    "88209",
                    "82371",
                    "87659",
                    "7.5.1"
                }
            };  
            var dateNum = info.year * 10000 + info.month * 100 + info.day;
            //var tasksStr = string.Join(',', ver.tasks);

            var res = new
            {
                Version = $"{info.ver1}.{info.ver2}.{info.ver3}.{dateNum}.{info.num} ({info.branch})",
                Numbers = new[] { info.ver1, info.ver2, info.ver3 },  // , dateNum, ver.num
                Date = new DateTime( 2000+info.year, info.month, info.day ),
                Value = info,
            };
            return Json(res);
        }


    }
}
