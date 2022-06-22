using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Itall;
//using Npgsql;
//using LinqToDB.Configuration;
//using LinqToDB.Data;
using Microsoft.AspNetCore.WebSockets;

namespace My.Site
{

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            //Configuration = configuration;

            // add Win-1251 Encoder
            //System.Text.Encoding.code
            //var t1 = System.Text.Encoding.GetEncodings();
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            //var t2 = System.Text.Encoding.GetEncoding(1251); 

            WebApp.Current = new WebApp
            {
#if !DEBUG
                NotifyAsJob = true,
#endif
            };
            Configuration = configuration;
        }


        IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Установка русской культуры
            var cc = new System.Globalization.CultureInfo("ru-RU", true);
            System.Globalization.CultureInfo.CurrentCulture = cc;
            System.Globalization.CultureInfo.CurrentUICulture = cc;
            System.Globalization.CultureInfo.DefaultThreadCurrentCulture = cc;
            System.Globalization.CultureInfo.DefaultThreadCurrentUICulture = cc;

            // old - .net core 3.1
            //services.AddMvc()
            //    .AddMvcFeatures()
            //    //.AddApplicationPart( typeof(CommonStartup).Assembly )
            //    .AddApplicationPart(typeof(WebUtils).Assembly)
            //    ; // чтобы увидеть контроллеры в других сборках при тестировании

            services.AddRazorPages()
                .AddJsonOptions(options =>
                {
                    //options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
                    //options.JsonSerializerOptions.IgnoreNullValues = true;
                    //options.JsonSerializerOptions.PropertyNameCaseInsensitive = false;
                    //options.JsonSerializerOptions.PropertyNamingPolicy = null;
                    //options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(
                    //    System.Text.Unicode.UnicodeRanges.BasicLatin, System.Text.Unicode.UnicodeRanges.All);
                    options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
                });

            //System.Text.Encodings.Web.JavaScriptEncoder.Default.
            //Newtonsoft.Json.JsonConvert.DefaultSettings = () => new Newtonsoft.Json.JsonSerializerSettings {StringEscapeHandling = Newtonsoft.Json.StringEscapeHandling.EscapeHtml };

            //services.AddControllers(opt =>
            //    {
            //        //opt.Filters.Add(new ConsumesAttribute("application/xml"));
            //        //opt.RespectBrowserAcceptHeader = true; // false by default
            //        //opt.InputFormatters.Clear();
            //        //opt.InputFormatters.Add(new Microsoft.AspNetCore.Mvc.Formatters.XmlSerializerInputFormatter(opt));
            //    })
            //    //.AddNewtonsoftJson(options =>
            //    //{
            //    //    //options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter(new Newtonsoft.Json.Serialization.CamelCaseNamingStrategy()));
            //    //    //options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            //    //})
            //    //.AddXmlSerializerFormatters()
            //    //.AddXmlDataContractSerializerFormatters()
            //    ;

            //services.AddSignalR();
            services.AddCors();


            //services.AddMvc(options =>
            // {
            //     // Add to global model binders so you don't need to use the [ModelBinder] attribute.
            //     var arrayModelBinderProvider = options.ModelBinderProviders.OfType<Microsoft.AspNetCore.Mvc.ModelBinding.Binders.ArrayModelBinderProvider>().First();
            //     options.ModelBinderProviders.Insert(
            //         options.ModelBinderProviders.IndexOf(arrayModelBinderProvider),
            //         new Itall.Modules.DelimitedArrayModelBinderProvider());
            // });


            services.AddTokens(Configuration.GetSection("tokens"));
            //CommonStartup.ConfigureServices(services);
            services.AddSession();
            services.AddSingleton<Itall.App.Auth.IAuthProvider>(new Itall.App.Auth.Tokens.TokenProvider());
            services.AddSingleton<Itall.App.Auth.ILoginProvider>(new App.Sys.UserLoginProvider());
            services.AddSingleton<Itall.App.Auth.ILoginProvider2>(new App.Sys.UserLoginProvider());
            services.AddSingleton<Itall.App.Auth.IOAuth2Request>(new App.Calendars.CalendarAuthorizer());
            //services.AddSingleton<Itall.Modules.Mails.IMailProvider>(new Itall.Modules.Mails.MailProvider());

            services.AddScoped<LinqToDB.Data.DataConnection, App.DbConnection>();

            var conn = Configuration.GetConnectionString("DefaultConnection");
            //services.AddLinqToDBContext<My.App.DbConnection>((provider, options) =>
            //{
            //    options
            //    //will configure the AppDataConnection to use
            //    //SqlServer with the provided connection string
            //    //there are methods for each supported database
            //    //.UseSqlServer(conn)
            //    .UsePostgreSQL(conn)

            //    //default logging will log everything using
            //    //an ILoggerFactory configured in the provider
            //    .UseDefaultLogging(provider);
            //});

            //services.AddWebSockets(cfg => { cfg.KeepAliveInterval = TimeSpan.FromHours(1); });
            //System.Net.ServicePointManager.MaxServicePointIdleTime = 250 * 1000; // около 1h - https://coderoad.ru/40502921/-NET-WebSockets-%D0%BF%D1%80%D0%B8%D0%BD%D1%83%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE-%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82-%D0%BD%D0%B5%D1%81%D0%BC%D0%BE%D1%82%D1%80%D1%8F-%D0%BD%D0%B0-keep-alive-%D0%B8-%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D1%8C-%D0%BD%D0%B0
            //var ttt = System.Net.WebSockets.ClientWebSocket.DefaultKeepAliveInterval;

            //services.Configure<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProviderOptions>(options =>
            //{
            //    options.Level = CompressionLevel.Optimal;
            //});

            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, Microsoft.Extensions.Logging.ILoggerFactory loggerFactory)
        {
            app.UseAuthentication();

            app.UseHttpsRedirection();

            app.UseResponseCompression();

            app.UseCors(builder =>
            {
                builder.AllowAnyOrigin();
                builder.AllowAnyHeader();
                builder.AllowAnyMethod();
                //builder.AllowCredentials();
            });

            // add sockets
            app.UseWebSockets();
            app.UseMiddleware<App.WebSocketMiddleware>();


            WebApp.Current.Logger = loggerFactory.CreateLogger("booking");

            if (true) // всегда возвращаем ошибку для анализа
            {
                app.UseDeveloperExceptionPage();
                //app.UseBrowserLink();
            }
            else
            {
                //app.UseExceptionHandler("/Error");
            }

            config(WebApp.Current);

            //app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions { ServeUnknownFileTypes = true });
            app.UseRouting();

            app.UseStatusCodePages();

            //app.UseSignalR(cfg =>
            //{
            //    cfg.MapHub<Modules.Chat>("chat"); 
            //});

            // remove when: 2.2 --> 3.1
            //app.UseMvc(routes =>
            //{
            //    routes.MapRoute(
            //        name: "default",
            //        template: "{controller}/{action=Index}/{id?}");
            //});

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });
        }

        void config(WebApp wapp)
        {
            //NpgsqlConnection.GlobalTypeMapper.UseJsonNet(new[] { typeof(My.App.Orders.OrderItem) });

            var conn = Configuration.GetConnectionString("DefaultConnection");

            //var provider = new LinqToDB.DataProvider.PostgreSQL.PostgreSQLDataProvider();
            var provider = LinqToDB.DataProvider.PostgreSQL.PostgreSQLTools.GetDataProvider();
            //App.DbConnection.AddConfiguration("Default", conn, provider);
            App.DbConnection.Config(conn, provider);
            //LinqToDB.LinqDbUtils.Config(conn, provider.Name);

            //var db = new App.DbConnection();
            //db.CreateDbTable<App.Sys.User>();
            //LinqToDB.DataProvider.SqlServer.SqlServerTools.

            SmsHelper.Config(Configuration.GetSection("sms"));
            App.Common.ResourcesController.Config(Configuration.GetSection("watermark"));
            App.Partners.DomainDiscountService.Config(Configuration.GetSection("rate_discounts"));
            //wapp.Templates.Config(Configuration.GetSection("templates"));
            App.Sys.SystemController.Config(Configuration.GetSection("browser"));
            App.Sys.HelpController.Config(Configuration.GetSection("help"));
            //App.Partners.PointsService.Config(Configuration.GetSection("points"));
            Itall.App.Auth.OAuth2Utils.Configurate(Configuration.GetSection("oauth2"));
            //App.Partners.PayOnlineController.Config(Configuration.GetSection("payOnline"));    //Configuration.Data.payOnline);
            App.Fin.Tinkoff.TinkoffHelper.Config(Configuration.GetSection("tinkoff"));

            wapp.Mails.Configurate(Configuration.GetSection("smtp"));

            wapp.Config(Configuration.GetSection("server"));
            wapp.Services.Add(new App.Sys.FilterAction());

            wapp.Tasks.OnError = (task, err) => SysUtils.SaveMessage(new App.Common.Message
            {
                Date = DateTime.Now,
                Kind = App.Common.MessageKind.Error,
                Text = err.Message,
                Scope = App.ScopeType.Zone,
            });
            wapp.Tasks.Start(3);

            //wapp.Tasks.AddTask( () => wapp.Mails.Send("142106@gmail.com", "aaaaa", "bbbbbbb") );

            App.Configs.OnLoad += (obj, ev) =>
            {
                var sz = Itall.Drawing.GraphicUtils.DefaultImageSize;
                Itall.Drawing.GraphicUtils.DefaultImageSize.Width = App.Configs.Get("image-width")?.AsInt ?? sz.Width;
                Itall.Drawing.GraphicUtils.DefaultImageSize.Height = App.Configs.Get("image-height")?.AsInt ?? sz.Height;
            };
            App.Configs.Reload();


            // Сервисы обработки заказов
            new Itall.Services.JobService(wapp.Settings.OrdersSyncSec,
                new App.Orders.PayExpiredJob(), // настраиваем синхронизацию блокировок заказов
                new App.Orders.OrderAutoJob(), // настраиваем сервис авто операций
                new App.Orders.RequestAutoJob(), // настраиваем сервис обработки статусов заявок
                new App.Fin.Tinkoff.TinkoffJob() // настраиваем сервис обработки оплат
                );

            //jobService.Jobs.Add(new App.Partners.DomainStatusJob()); // рассылка нотификаций при окончании сроков оплат

            // Управление статусами доменов
            new Itall.Services.JobService(wapp.Settings.DomainsSyncSec, 
                new App.Partners.DomainStatusJob());

            // управление почтой
            new Itall.Services.JobService(wapp.Settings.MailSyncSec, 
                new App.Sys.MailingJob(),  // сервис обработки рассылок
                new App.Sys.MailJob()); // сервис рассылки почтовых сообщений

            // настраиваем синхронизацию календарей
            new Itall.Services.JobService(wapp.Settings.CalendarsSetWatchSec, new App.Calendars.CalendarSetWatchJob());
            new Itall.Services.JobService(wapp.Settings.GoogleSyncFullSec, 
                new App.Calendars.CalendarSyncJob { Provider = App.Calendars.CalendarProvider.GOOGLE });
            new Itall.Services.JobService(wapp.Settings.OutlookSyncFullSec, 
                new App.Calendars.CalendarSyncJob { Provider = App.Calendars.CalendarProvider.MSONLINE });
            new Itall.Services.JobService(wapp.Settings.CalendarsSyncPushSec, new App.Calendars.CalendarSyncJob { UpdatesOnly = true });

        }

    }
}



#region Misc


        //private void JobService_OnError(object sender, Itall.Services.ErrorArgs e)
        //{
        //    // App.Current.Logger?.Error(e.Error, "Job error " + sender.GetType());
        //}


// OnOrderStstus Change services
//wapp.Services.Add(new App.Orders.OrderCalcUtils());
//wapp.Services.Add(new App.Orders.OrderDocService());
//wapp.Services.Add(new App.Orders.OrderMailService()); // обязательно после Doc
//wapp.Services.Add(new App.Partners.TarifService());
//wapp.Services.Add(new App.Partners.OrderDiscountService());

// change to --> PartnerUtils.ApplyPayments
//wapp.Services.Add(new App.Partners.DomainDiscountService());
//wapp.Services.Add(new App.Partners.DomainStatusJob()); // ???

//happ.Services.Add(new Modules.Calendars.CalendarAuthorizer());
//wapp.Services.Add(new App.Calendars.Google.GoogleProvider());
//wapp.Services.Add(new App.Calendars.Outlook.OutlookProvider());

//dynamic domains = Configuration.GetSection("domains").Get<System.Dynamic.ExpandoObject>();
//int dsynctime = int.Parse(domains?.synctime ?? "0") ?? 0;
//dynamic calendars = Configuration.GetSection("calendars").Get<System.Dynamic.ExpandoObject>();
//int synctime = int.Parse(calendars?.synctime) ?? 0;

// define bitrix sync
//int syncTime = Configuration.Data.bitrix.synctime ?? 0;

// Bitrix init - remove 2020-07-28
//var sharedConnString = Configuration.GetConnectionString("SharedConnection");
//dynamic bitrix = Configuration.GetSection("bitrix").Get<System.Dynamic.ExpandoObject>();
//App.Bitrix.BitrixHelper.Config(bitrix, sharedConnString);
//int syncTime = int.Parse(bitrix.synctime) ?? 0;

//if (syncTime > 0)
//{
//    var btxSyncService = new Itall.Services.JobService();
//    btxSyncService.OnError += JobService_OnError;
//    btxSyncService.Jobs.Add(new App.Bitrix.BitrixClientsSyncJob());
//    //syncService.Jobs.Add(new BitrixNewUsersJob());
//    btxSyncService.Jobs.Add(new App.Bitrix.BitrixDealsJob());
//    btxSyncService.Jobs.Add(new App.Bitrix.BitrixArchivedDealsJob());

//    btxSyncService.Start(syncTime);
//}

// Немедленное тестирование сервисов
//new App.Orders.OrderHoldJob().RunAsync().Wait();
// new App.Orders.OrderAutoPayJob().RunAsync().Wait();

#endregion