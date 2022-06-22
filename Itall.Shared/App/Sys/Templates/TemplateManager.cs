using System.Collections.Generic;
using System.Linq;

namespace My.App.Sys
{
    public class TemplateManager
    {
        public Template Get(string key)
        {
            var templ = Templates
                .GetActuals()
                .Where(x => x.Key == key)
                .FirstOrDefault();

            //if (templ == null)
            //    throw new UserException("Не найден шаблон письма " + kind.ToString());
            return templ;
        }


        IList<Template> Templates => DbCache.Templates.Get();

    }

}
