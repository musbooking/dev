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
    public class MailingService: DbService
    {
        /// <summary>
        /// Отправка сообщений
        /// </summary>
        public async Task SendAsync(Guid id)
        {
            var mailing = await Db.Mailings
                .LoadWith(m => m.Template)
                .FindAsync(id);

            if (mailing.TemplateId == null)
                throw new UserException("Не задан шаблон отправки");

            if (string.IsNullOrWhiteSpace(mailing.Values))
                throw new UserException("Отсутствуют введеные почтовые адреса");

            await SendAsync(mailing);
        }

        /// <summary>
        /// Собственно отправка сообщений
        /// </summary>
        public async Task SendAsync(Mailing mailing)
        { 
            var mails = mailing.Values?.Split("\n")
                .Where(m => !string.IsNullOrWhiteSpace(m));
            var templ_key = mailing.Template.Key;

            foreach (var mail in mails)
            {
                var data = new
                {
                    Mailing = new
                    {
                        mailing.Id,
                        mailing.Name,
                        mailing.Description,
                        Template = mailing.Template?.Name,
                    },
                    Mail = mail,
                };
                App.AddDbMailJob(mail, data, Db, mailing.Id, templ_key);
            }
            
            // выставляем флаг выполненной рассылки
            await Db.Finds(mailing)
                .Set(m => m.Status, MailingStatus.Ok)
                .UpdateAsync();

        }
    }

}
