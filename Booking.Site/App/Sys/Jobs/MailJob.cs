using LinqToDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Sys
{
    /// <summary>
    /// Обработчик отправки сообщений для блокировки заказов с просроченным временем оплаты
    /// </summary>
    public class MailJob : AppJob
    {
        public override async Task RunAsync()
        {
            using var db = new App.DbConnection();

            var now = DateTime.Now;

            var qmails =
                from mail in db.GetTable<JobEntity>()
                where mail.Kind == JobKind.Mail
                where mail.Status == JobStatus.Active
                where mail.MinDate == null || mail.MinDate > now
                orderby mail.CreatedDate   // old jobs first
                select mail;

            //var n = await qmails.CountAsync(); // for test
            
            var mails = await qmails
                .Take(App.Settings.MailSyncPage)
                .ToListAsync();

            foreach (var mail in mails)
            {
                await sendMail(db, mail);
            }

        }

        /// <summary>
        /// попытка отправить сообщение
        /// </summary>
        private async Task sendMail(DbConnection db, JobEntity mail_job)
        {
            var mail_rec = Itall.JsonUtils.JsonToObject<MailJobRecord>(mail_job.Value);

            var msg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.Job,
                Scope = ScopeType.Any,
                Text = $"Отправка сообщения {mail_rec.Email}: {mail_rec.Subject} ",
                Updated = DateTime.Now,
            };

            try
            {
                mail_job.Attempts++;
                App.Mails.Send(mail_rec.Email, mail_rec.Subject, mail_rec.Body);
                mail_job.Status = JobStatus.Ok;
                mail_job.Date = DateTime.Now;
                mail_job.Value = null;  // чистим лог сообщения 73065 
            }
            catch (Exception x)
            {
                msg.Text += x.ToString();
                var max = App.Settings.MailAttempts;
                if ( mail_job.Attempts >= max)  // если равно или больше максимальное - прерываем
                {
                    mail_job.Status = JobStatus.Error;
                    msg.Text += $"Превышено кол-во попыток {max}";
                }
            }
            await db.UpdateAsync(mail_job);

            msg.ObjectId = mail_job.Id;
            await db.CreateInsertAsync(msg);
        }
    }


}