using LinqToDB;
using Microsoft.Extensions.Logging;
using My.App.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Fin.Tinkoff
{
    /// <summary>
    /// Обработчик отправки сообщений для блокировки заказов с просроченным временем оплаты
    /// </summary>
    public class TinkoffJob : AppJob
    {
        public override async Task RunAsync()
        {
            using var db = new App.DbConnection();

            var now = DateTime.Now;

            var qjobs =
                from mail in db.GetTable<JobEntity>()
                where mail.Kind == JobKind.Tinkoff
                where mail.Status == JobStatus.Active
                //where mail.MinDate == null || mail.MinDate > now
                orderby mail.CreatedDate   // old jobs first
                select mail;

            //var n = await qmails.CountAsync(); // for test
            
            var jobs = await qjobs
                .Take(App.Settings.MailSyncPage)
                .ToListAsync();
            var psvc = new PaymentService { Db = db, };

            foreach (var job in jobs)
            {
                await payment(psvc, job);
            }

        }

        /// <summary>
        /// обрабатываем платеж банка
        /// </summary>
        private async Task payment(PaymentService psvc, JobEntity job)
        {
            var db = psvc.Db;
            var jmsg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.Job,
                Scope = ScopeType.Any,
                Text = $"Обработка оплаты Тиньков: {job.Value} ",
                Updated = DateTime.Now,
            };

            try
            {
                var args = Itall.JsonUtils.JsonToObject<TinkoffHelper.ConfirmRes>(job.Value);
                var success = args.Success && args.IsConfirmed();
                // обработка платежа
                var pres = TinkoffHelper.ConvertBankResArgs2PaymentRes(args);
                await psvc.ClientPayment(pres, success);
                await sendCheckAsync(psvc, pres, job.Value);  // // отправка чеков

                job.Status = JobStatus.Ok;
                job.Date = DateTime.Now;
                //job.Value = null;  // чистим лог сообщения 73065 
            }
            catch (Exception err)
            {
                jmsg.Text += err.ToString();
                job.Description += "ERROR: " + err.ToString();
                //#if !DEBUG
                job.Status = JobStatus.Error;
//#endif
            }
            await db.UpdateAsync(job);

            jmsg.ObjectId = job.Id;
            await db.CreateInsertAsync(jmsg);
        }


        /// <summary>
        /// Отправка чеков в Тиньков
        /// </summary>
        async Task sendCheckAsync(PaymentService psvc,  PaymentRes pres, string text)
        {
            var db = psvc.Db;
            // Tinkoff Отправка чека - см 81781 -
            var pargs = new PaymentArgs
            {
                Id = pres.Id,
                Total = pres.Total,
                Type = pres.Type,
            };
            var pinfo = await psvc.GetInfoAsync(pargs);

            if (!string.IsNullOrWhiteSpace(pinfo.Inn))
            {
                var targs = pinfo.ToCheckUrlArgs(pres.PaymentId);
                var res = await targs.GetPayUrl(TinkoffHelper.PaymentMethod.Check);
                //var resjs = Itall.JsonUtils.ObjectToJson(res);

                var check_msg = new Common.Message
                {
                    //OrderId = pinfo.Type == PaymentType.Order ? pinfo.Id.Value : null,
                    //ObjectId = pinfo.Id,
                    Kind = Common.MessageKind.System,
                    Date = DateTime.Now,
                    Scope = ScopeType.Any,
                    Text = "Оплата чека: " + text,
                    Updated = DateTime.Now,
                };
                await db.CreateInsertAsync(check_msg);
            }
        }

    }


}