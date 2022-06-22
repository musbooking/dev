using Itall.App.Data;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace My.App
{
    public partial class ConfigsController : UpdateDbController<ConfigItem>
    {
        protected override object OnUpdating(Updater<ConfigItem> updater)
        {
            updater.Set(x => x.Name);
            updater.Set(x => x.Description);
            updater.Set(x => x.IsArchive);

            updater.Set(x => x.AsBool);
            updater.Set(x => x.AsDate);
            //updater.Set(x => x.AsInt);
            updater.Set(x => x.AsLong);
            updater.Set(x => x.AsMoney);
            updater.Set(x => x.AsNumber);
            updater.Set(x => x.AsText);
            updater.Set(x => x.AsVal);
            updater.Set(x => x.AsVal1);
            updater.Set(x => x.AsVal2);
            updater.Set(x => x.AsVal3);

            OnUpdating2(updater);

            Configs.Reload();

            return base.OnUpdating(updater);
        }


        /// <summary>
        /// Расширение метода OnUpdating для контроллеров
        /// </summary>
        partial void OnUpdating2(Updater<ConfigItem> updater);


        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync()
        {
            //this.RequiresAuthentication();
            //this.CurUser().Require(Sys.Operations.AdminAccess);

            var query = Db.GetTable<ConfigItem>()
                //.GetDomainObjects(this.CurUser()?.DomainId)
                //.Where()
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.IsArchive,

                    x.AsBool,
                    x.AsDate,
                    x.AsLong,
                    x.AsMoney,
                    x.AsNumber,
                    x.AsText,
                    x.AsVal,
                    x.AsVal1,
                    x.AsVal2,
                    x.AsVal3,
                });
            var res = await query.ToListAsync();
            return Json(res);
        }

        [HttpPost("reset")]
        public void Reset()
        {
            Configs.Reload();
        }

    }
}
