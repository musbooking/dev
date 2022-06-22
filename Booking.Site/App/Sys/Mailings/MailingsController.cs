using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Itall;
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Sys
{
    /// <summary>
    /// Контроллер для управления рассылками
    /// </summary>
    public class MailingsController : ListController<Mailing>
    {

        protected override object OnUpdating(Updater<Mailing> updater)
        {
            updater.Set(x => x.Values);
            updater.Set(x => x.Status);
            updater.Set(x => x.FromDate);
            updater.Set(x => x.TemplateId);

            return base.OnUpdating(updater);
        }

        /// <summary>
        /// Формирование и отправка рассылки
        /// </summary>
        [HttpPost("send")]
        public async Task<IActionResult> SendAsync(Guid id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var svc = new MailingService { Db= Db, User = user };
            await svc.SendAsync(id);

            return Ok();
        }
        

        [HttpGet("list")]
        public async Task<IActionResult> GetListAsync()
        {
            this.RequiresAuthentication();
            var domainId = this.CurUser()?.DomainId ?? Guid.Empty;

            var mailings = 
                from m in Db.Mailings
                let jobs = Db.Jobs.Where(j => j.ObjectId == m.Id)
                select new
                {
                    m.Id,
                    m.Name,
                    m.TemplateId,
                    m.IsArchive,
                    m.FromDate,
                    m.Status,
                    Errors = jobs.Count(j => j.Status == JobStatus.Error),
                    Ok = jobs.Count(j => j.Status == JobStatus.Ok),
                };

            var res = await mailings.ToListAsync();
            return Json(res);
        }


        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetObjectAsync(Guid id)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var m = await Db.Mailings
                .GetDomainObjects(user?.DomainId, true)
                .FindAsync(id);

            var res = new
            {
                m.Id,
                m.Description,
                m.Name,
                m.Values,
                //m.Status,
                m.TemplateId
            };
            return Json(res);
        }



    }
}
