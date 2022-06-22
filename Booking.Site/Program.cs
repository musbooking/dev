using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace My.Site
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = WebHost.CreateDefaultBuilder(args)
                //.ConfigureAppConfiguration(config => { config. })
                //.ConfigureKestrel(config => 
                //{ 
                //    config.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(2);  
                //    config.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(1);  
                //})
                .UseStartup<Startup>()
                .Build();
             
            host.Run();
        }

        // в результате отказался - какие-то труднопрогнозируемые ошибки
        //static void config(WebHostBuilderContext ctx, IConfigurationBuilder config)
        //{
        //    //config.AddJsonFile("appsettings1.json", false, true);
        //    config.AddJsonFile("appsettings.config.json", false, true);
        //}

    }
}
