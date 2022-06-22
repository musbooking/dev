using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using LinqToDB;
using Itall;
using Microsoft.Extensions.Primitives;

namespace My
{
    /// <summary>
    /// Объект приложение
    /// </summary>
    public partial class WebApp : Itall.BaseWebApp
    {
        public static WebApp Current;

        public readonly AppSettings Settings = new AppSettings();
        //public new AppSettings Settings => WebApp.Settings;

        //public void Init(Microsoft.AspNetCore.Builder.IApplicationBuilder app)
        //{
        //    //HostUrl = "::" + app.ServerFeatures.Get<ASPS.Features.IServerAddressesFeature>().Addresses.FirstOrDefault();

        //    //var server = (ASPS.IServer)app.ApplicationServices.GetService(typeof(ASPS.IServer));
        //    //var saddr = (ASPS.Features.IServerAddressesFeature)server.Features[typeof(ASPS.Features.IServerAddressesFeature)];
        //    ////HostUrl = string.Join(", ",  saddr.Addresses); 
        //    //HostUrl = saddr.Addresses.FirstOrDefault();
        //    //if (HostUrl.EndsWith("/"))
        //    //    HostUrl = HostUrl.Substring(0, HostUrl.Length - 1); // убираем последний /

        //    ////var section = config.GetSection("server");
        //    ////HostUrl = section["host"];
        //}

        public void Config(IConfiguration config)
        {
            config.Bind(Settings);
            if (!string.IsNullOrWhiteSpace(Settings.Host))
                HostUrl = Settings.Host;
        }

        public void AddMailTask(string emails, string templateName, object data)
        //public void AddMailTask(string email, App.Core.TemplateKind kind, object data)
        {
            var template = Settings.Templates.Get(templateName);
            //var template = Templates2.Get(kind);
            if (template == null)
                throw new Exception("Email template not found: " + templateName);

            string subject = Itall.WebUtils.View(template.Subject, data);
            string body = Itall.WebUtils.View(template.Body, data);

            foreach (var iemail in emails.Replace(';',',').Split(';'))
            {
                var email = iemail.Trim();
                Tasks.AddTask(() => Mails.Send(email, subject, body));
            }
        }



        /// <summary>
        /// Список шаблонов, хранящихся в базе данных
        /// </summary>
        public App.Sys.TemplateManager DbTemplates = new App.Sys.TemplateManager();


        /// <summary>
        /// Создание задачи для отправки сообщений
        ///     Оставлено для совместимости
        /// </summary>
        //[Obsolete("Используй NotifyTask")]
        public App.Sys.Template AddDbMailTask(string emails, object data, Guid? id, params string[] kinds)
        {
            return NotifyUser(new App.Sys.User { Email = emails }, data, null, null, kinds);
        }

        public App.Sys.Template AddDbMailJob(string emails, object data, App.DbConnection db, Guid? objid, params string[] kinds)
        {
            return NotifyUser(new App.Sys.User { Email = emails }, data, db, objid, kinds);
        }

        /// <summary>
        /// флаг - используются ли нотификации как задания
        /// </summary>
        public bool NotifyAsJob = false;

        /// <summary>
        /// add mail for kinds, based on DB templates
        /// </summary>
        public App.Sys.Template NotifyUser(App.Sys.User user, object data, App.DbConnection db, Guid? objid, params string[] kinds)
        {
            if (user == null) return null;

            //var template = Templates.Get(templateName);
            var template = kinds
                .Select(x => DbTemplates.Get(x)) //(App.Core.TemplateKind)
                .Where(x => x != null)
                .FirstOrDefault();

            if (template == null)
                //throw new Exception("Email template not found: " + kind);
                return null;

            // Рассылка Emails
            var emails = user.Email;
            if (!string.IsNullOrWhiteSpace(emails))
            {
                var subject = Itall.WebUtils.View(template.Subject ?? "Без темы", data);
                var body = Itall.WebUtils.View(template.Text, data);

                var emails2 = emails.Split(',')
                    //.Where(em => !string.IsNullOrWhiteSpace(em))
                    .Where(em => em?.Contains('@') == true)
                    .Select(em => em.Trim());

                foreach (var email in emails2)
                {
                    System.Diagnostics.Debug.WriteLine("add email task: " + email + ", template: " + template?.Key);

                    if (NotifyAsJob)
                    {
                        var jbrec = new App.Sys.MailJobRecord
                        {
                            Email = email,
                            Subject = subject,
                            Body = body,
                        };
                        var job = App.Sys.JobHelper.CreateJob(jbrec, App.Sys.JobKind.Mail, objid);
                        job.Description = $"email {template.Name}: {email}";
                        db ??= new App.DbConnection();
                        var r = db.CreateInsertAsync(job).Result;
                    }
                    else
                    {
#if DEBUG
                        //var email2 = email.ToIdent(); //.Replace("@","_");
                        var subject_with_email = $"[{email}]:{subject}";
                        Mails.Send($"142106@gmail.com", subject_with_email, body, true);  // отладочная информация по   +{email2}
#else
                        Tasks.AddTask(() => Mails.Send(email, subject, body));
#endif

                    }

                }
            }


            //// Рассылка SMS - пока комментарим
            //var phones = user.Phone;
            //if (!string.IsNullOrWhiteSpace(template.Sms) && !string.IsNullOrWhiteSpace(phones))
            //{
            //    var sms = Itall.WebUtils.View(template.Sms, data);
            //    var phonesArray = phones.Split(",");
            //    foreach (var phone in phones)
            //    {

            //    }
            //}

            return template;
        }


    }


    public partial class AppSettings
    {
        public string Host { get; set; }

        /// <summary>
        /// appsettings.json templates
        /// </summary>
        public App.TemplatesConfig Templates = new App.TemplatesConfig();


    }



}
