using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My
{
    public static class SmsHelper
    {

        class SmsConfig
        {
            public string login { get; set; }
            public string password { get; set; }
            public string sender { get; set; }
            public string url { get; set; }
            public bool Test { get; set; }
        }


        public static void Config(IConfigurationSection config)
        {
            _Config = config.Get<SmsConfig>();
        }

        static SmsConfig _Config;


        public static async Task<CodeServiceResult> SendPhoneCodeAsync(string phone, string templateKey)
        {
            var code = new Random(DateTime.Now.Millisecond).Next(1001, 9999);
            phone = MiscUtils.FormatPhone(phone);
            CodeHelper.AddCode(phone, code);

            // посылаем код клиенту
            var model = new { Code = code };
            var template = WebApp.Current.DbTemplates.Get( templateKey );
            var smsres = await SmsHelper.SendSmsAsync(phone, template.Sms, model);

            var res = new CodeServiceResult
            {
                Result = smsres,
                Ok = smsres.Contains("=accepted"),
                Code = code,
            };
            return res;
        }


        /// <summary>
        /// Проверка введенного кода СМС
        /// </summary>
        public static bool TestSmsCode(string phone, int code)
        {
            var id = MiscUtils.FormatPhone(phone);
            if (_Config.Test) return code != 0;  // добавлен сценарий тестирования
            var res = CodeHelper.TestCode(id, code);
            return res;
        }


        /// <summary>
        /// Посылаем группу СМС сообщений разных видов
        /// </summary>
        public static async Task<string> SendSmsAsync(string phones, object model, params string[] keys)
        {
            var template = keys
                .Select(t => WebApp.Current.DbTemplates.Get(t)) //(App.Core.TemplateKind)
                .Where(t => t != null)
                .Where(t => !string.IsNullOrWhiteSpace(t.Sms))
                .FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(template?.Sms) && !string.IsNullOrWhiteSpace(phones))
            {
                var smsres = await SendSmsAsync(phones, template.Sms, model);
                return smsres;
            }
            else
                return null;

        }


        /// <summary>
        /// Посылаем смс
        /// </summary>
        public static async Task<string> SendSmsAsync(string phones, string template, object model)
        {
            if (string.IsNullOrWhiteSpace(phones)) return null;
                //throw new ArgumentNullException("Phone is empty");

            var text = Itall.WebUtils.View(template, model);

            System.Diagnostics.Debug.WriteLine($"SMS {(_Config.Test?"test":"")} {phones} : {text}");

            if (_Config == null)
                throw new ArgumentNullException("Config is null");

            if (_Config.Test)
                return "TEST=accepted";


            var res = "";
            foreach (var iphone in phones.Replace(';',',').Split(','))   // исправляем 
            {
                var phone = iphone.Trim();
                if (!phone.StartsWith("+7"))
                    phone = "+7" + phone;

#if DEBUG
                text += "," + phone;
                phone = "+79067098559";  // test me
#endif

                var args = new
                {
                    phone = phone,
                    text = text,

                    login = _Config.login,
                    password = _Config.password,
                    sender = _Config.sender,
                };
                res = await Itall.Net.NetUtils.GetStringAsync(_Config.url, args); //, client => client.Headers["User-Agent"] = "Fiddler");
                System.Diagnostics.Debug.WriteLine($"sms {phone}: {text}");
            }
            return res;
        }
    }
}