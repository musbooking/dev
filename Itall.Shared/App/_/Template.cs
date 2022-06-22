using LinqToDB;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace My.App
{
    // idea: https://stackoverflow.com/questions/32558941/render-razor-view-to-string-in-asp-net-core
    // code: https://gist.github.com/ahmad-moussawi/1643d703c11699a6a4046e57247b4d09

    /// <summary>
    /// Управление шаблонами для подстановки в рассылки
    /// </summary>
    public class TemplatesConfig
    {
        //public static TemplatesConfig Global = new TemplatesConfig();

        public void Configurate(IConfiguration config)
        {
            //List = config..Get<Dictionary<string, Template>>();
            config.Bind(Dict);

            var tt =
                from x in Dict
                let file = x.Value.File
                where !string.IsNullOrWhiteSpace(file)
                //var body = x.Value.Body
                //where body.Length > 0
                //var path = body[0]
                //where path.StartsWith("@")
                select new { template = x.Value, file };

            var apppath = WebApp.MapPath();
            foreach (var t in tt)
            {
                var file = Path.Combine(apppath, t.file);
                var html = File.ReadLines(file);
                t.template.Body = html.ToArray();
            }
            //List = config.Get<Dictionary<string, Template>>();
        }

        public ConfigTemplate Get(string name)
        {
            //Newtonsoft.Json.Linq.JObject templates = App.Current.ConfigFile.Data.templates;
            //var objtemplate = templates[name];
            //var template = objtemplate.ToObject<Template>();
            var template = Dict[name];
            return template;
        }

        public readonly Dictionary<string, ConfigTemplate> Dict = new Dictionary<string, ConfigTemplate>();
        //public static List<Template> List { get; set; } = new List<Template>();
    }


    public partial class ConfigTemplate
    {
        public bool Disable { get; set; }
        public string Subject { get; set; }
        public string[] Body { get; set; }
        public string File { get; set; }
        public string Sms { get; set; }
        public string Mail { get; set; }

        //public List<string> Items { get; set; } = new List<string>();
    }
}


