using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using My.App;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using Itall.Services;

namespace My.App.Partners
{
    /// <summary>
    /// Сервис и job по рассылке уведомлений об изменении статуса оплаты и сроков оплаты
    /// </summary>
    public class DomainStatusJob : AppJob
    {
        // Правила перевода состояния домена
        static readonly DomainStatusRule[] RULES = new[]
        {
            new DomainStatusRule{ Days = 0, CurStatus = DomainStatus.Payment, NextStatus = DomainStatus.Warning, Template = Sys.TemplateKind.DomainYellow},
            new DomainStatusRule{ Days = 6, CurStatus = DomainStatus.Warning, NextStatus = DomainStatus.PredLock, Template = Sys.TemplateKind.DomainBeforeBlock},
            new DomainStatusRule{ Days = 7, CurStatus = DomainStatus.PredLock, NextStatus = DomainStatus.Locked, Template = Sys.TemplateKind.DomainAfterBlock},
        };
        // список статусов кандидатоа на изменения - на основе оценки текущих статусов
        static readonly DomainStatus[] CHANGED_STATUSES = RULES.Select(r => r.CurStatus).ToArray();

        /// <summary>
        /// Праило изменения состояния
        /// </summary>
        class DomainStatusRule
        {
            public int Days; // Сколько дней прошло от текущей даты
            public DomainStatus CurStatus;
            public DomainStatus NextStatus;
            public string Template;

            public bool Allow(Domain domain)
            {
                if (domain.Status != CurStatus)
                    return false;

                //var n = domain.GetRemains(0); // исправлено на + 12-02-2019, тк были отрицалки
                var d0 = DateTime.Now.ToMidnight();
                var d1 = domain.LimitDate.Value.ToMidnight();
                var n = (d0 - d1).TotalDays;
                return n >= Days;
            }
        }

        public override async Task RunAsync()
        {
            using var db = new DbConnection();


            var domains = await
                db.Domains
                .Where(d => d.LimitDate != null)
                .Where(d => CHANGED_STATUSES.Contains(d.Status))
                //.Where(d => (d.LimitDate.Value - DateTime.Now).TotalDays <= 1) 
                .ToListAsync();

            foreach (var domain in domains)
            {
                var rule = RULES.FirstOrDefault(ch => ch.Allow(domain));
                if (rule == null)
                    continue;

                await sendMessageAsync(db, domain, rule.Template); // отсылаем письмо по шаблону

                await db.Finds(domain)
                    .Set(x => x.Status, x => rule.NextStatus)
                    .UpdateAsync(); // выставляем статус
            }

        }

        /// <summary>
        /// Обрабатываем оплату
        /// </summary>
        public async Task ApplyStatusAsync(DomainPaymentContext context)
        {
            context.Domain.Status = DomainStatus.Payment;   // записываем в объект
            await context.Db.Finds(context.Domain)                // дублируем запись в БД
                 .Set(x => x.Status, DomainStatus.Payment)
                 .UpdateAsync(); // выставляем статус
            await sendMessageAsync(context.Db, context.Domain, Sys.TemplateKind.DomainPayment); // template - отсылаем письмо по шаблону
        }

        async Task<bool> sendMessageAsync(DbConnection db, Domain domain, string kind) // Core.Template template)
        {
            var email = domain.Email;
            if (string.IsNullOrWhiteSpace(email)) return false;

            var msg = new Common.Message
            {
                Date = DateTime.Now,
                Kind = Common.MessageKind.System,
                //Text = $"Отправлено сообщение '{subject}' партнеру {domain.Name} по адресу: {email}",
                Text = $"Отправлено сообщение партнеру {domain.Name} по адресу: {email}",
                Scope = ScopeType.Zone,
            };

            try
            {
                App.AddDbMailJob(email, domain, db, domain.Id, kind);

                var template = App.DbTemplates.Get(kind);
                if (!string.IsNullOrWhiteSpace(template?.Sms) && !string.IsNullOrWhiteSpace(domain.Phone))
                {
                    var smsres = await SmsHelper.SendSmsAsync(domain.Phone, template.Sms, domain);
                    msg.Text += ", смс " + smsres;
                }
                else
                    msg.Text += ", без смс";

                await db.CreateInsertAsync(msg);
            }
            catch (Exception x)
            {
                msg.Kind = Common.MessageKind.Error;
                msg.Text = "Ошибка отправки почты: " + x.Message;
                var exists = true; // db.Orders.Any(y => y.Id == orderid);
                if (!exists)
                {
                    msg.OrderId = null;
                    msg.Text = "Ошибка отправки почты: " + x.Message + ", удален заказ";
                }
                db.CreateInsert(msg);
            }
            finally
            {
            }
            return true;
        }

    }
}


#region --- Misc ----


//// проверяем статусы для периодов
//foreach (var check in STATUSES)
//{
//    if(n >= check.Key) // Если кол-во пропущенных дней после оплаты больше заданного
//    {
//        if(domain.OldStatus == null || (domain.OldStatus & check.Value) == 0) // если не было отправки письма с соотв статусом
//        {
//            var kind = getTemplateKind(check.Value);
//            //var t = App.Templates2.Templates["domain_" + st.Value]; 
//            //var t = App.Templates2.Get(kind);
//            await sendMessageAsync(db, domain, kind); // отсылаем письмо по шаблону

//            await db.Finds(domain)
//                .Set(x => x.OldStatus, x => (x.OldStatus ?? 0) | check.Value)
//                .UpdateAsync(); // выставляем статус
//        }
//        break;
//    }
//}


//string getTemplateKind(OldDomainStatus status)
//{
//    // var template = App.Templates2.Get(Core.TemplateKind.Restore);
//    switch (status)
//    {
//        case OldDomainStatus.Yellow:
//            return Sys.TemplateKind.DomainYellow;

//        case OldDomainStatus.Paid:
//            return Sys.TemplateKind.DomainPayment;

//        case OldDomainStatus.BeforeBlock:
//            return Sys.TemplateKind.DomainBeforeBlock;

//        case OldDomainStatus.AfterBlock:
//            return Sys.TemplateKind.DomainAfterBlock;

//        default:
//            return Sys.TemplateKind.DomainYellow;
//    }
//}

//if (n < -7) // after block
//{
//    if ((domain.MailStatus & DomainMailStatus.AfterBlock) == 0)
//    {

//    }
//    continue;
//}
//if (n < -6) // before block
//{
//    if ((domain.MailStatus & DomainMailStatus.BeforeBlock) == 0)
//    {

//    }
//    continue;
//}

//if (n < 0) // yellow
//{
//    if ((domain.MailStatus & DomainMailStatus.Yellow) == 0)
//    {

//    }
//    continue;
//}



//switch (domain.MailStatus)
//{
//    case DomainMailStatus.
//    default:
//        break;
//}
//await sendMail(db, domain);

//public void Run(OrderContext context)
//{
//    //var templates = App.Current.Config.Data.templates;
//    var clEmail = context.Order?.Client?.Email;
//    var baseEmail = context.Order?.Room?.Base?.Email;

//    // если пользователь не зарегистрирован или забанен - то не посылаем
//    var user = context.Db
//        .GetTable<Admins.User>()
//        .FirstOrDefaultAsync(x => x.ClientId == context.Order.ClientId)
//        .Result;

//    if (user == null || user.IsArchive) return;
//    var templ = Common.TemplatesConfig.Global;

//    switch (context.Status)
//    {
//        case DocumentStatusEx.Reserv:
//            if (context.Order.SourceType == SourceType.Mobile && !string.IsNullOrWhiteSpace(baseEmail))
//            {
//                sendMail(context, templ.Get("order_reserv_mobile"), baseEmail);
//            }
//            sendMail(context, templ.Get("order_reserv"), clEmail);
//            break;

//        case DocumentStatusEx.Paid:
//            sendMail(context, templ.Get("order_paid"), clEmail);
//            break;

//        case DocumentStatusEx.Cancel:
//            sendMail(context, templ.Get("order_cancel"), clEmail);

//            // Отправляем собственнику при мобильной отмене
//            if (context.Order.SourceType == SourceType.Mobile)
//            {
//                sendMail(context, templ.Get("order_cancel"), context.Order.Room?.Base?.Email);
//            }
//            break;

//        case DocumentStatusEx.ForfeitConfirm:
//            sendMail(context, templ.Get("order_forfeit"), clEmail);
//            break;

//        default: // игнорируем другие статусы
//            return;
//    }
//}
#endregion