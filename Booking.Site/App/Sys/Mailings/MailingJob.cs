using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy-security;
using LinqToDB.Mapping;
using LinqToDB;
using Itall;

namespace My.App.Sys
{
    /// <summary>
    /// Сервис для управления рассылками
    /// </summary>
    public class MailingJob: AppJob
    {
        public override async Task RunAsync()
        {
            using var db = new App.DbConnection();

            var now = DateTime.Now;

            // ищем все активные рассылки, у которых дата превышает текущую
            var qmailings =
                from m in db.Mailings
                    .GetActuals()
                    .LoadWith(m => m.Template)
                where m.Status == MailingStatus.Unknown
                where m.FromDate < now
                select m;

            var mailings = await qmailings.ToListAsync();
            if (mailings.Count == 0) return;

            var svc = new MailingService {Db = db };
            foreach (var mailing in mailings)
            {
                await svc.SendAsync(mailing);
            }

        }
    }

}
