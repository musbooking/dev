using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using My.App.Orders;

namespace My.App.Fin.Tinkoff
{

    /// <summary>
    /// Проведение платежей через Тинькофф банк
    /// </summary>
    public class TinkoffController : PaymentController
    {

        [HttpPost("payment")]
        public async Task<IActionResult> PaymentAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var psvc = new PaymentService { Db = Db, User = user, };
            var payment = psvc.CreatePayment(Request.Form);

            var args = new TinkoffHelper.UrlArgs
            {
                TerminalKey = TinkoffHelper.Settings.TerminalKey,
                Amount = payment.Total * 100,
                OrderId = payment.Id.ToString(),
                Description = payment.Description,
            };

            var res = await args.GetPayUrl(TinkoffHelper.PaymentMethod.Init);

            return this.Json(new
            {
                Url = res.PaymentURL,
                Error = res.ErrorText,
                Status = System.Net.HttpStatusCode.TemporaryRedirect,
            });
        }


        /// <summary>
        /// Получение ссылки для разных вариантов оплаты
        /// </summary>
        [HttpGet("payment-url")]
        public async Task<IActionResult> GetPaymentUrl(PaymentArgs args )
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var psvc = new PaymentService { Db = Db, User = user, };
            var pinfo = await psvc.GetInfoAsync(args);
            var targs = pinfo.ToInitUrlArgs();
            var tres = await targs.GetPayUrl(TinkoffHelper.PaymentMethod.Init);

            var res = new
            {
                Url = tres.PaymentURL,
                Error = tres.ErrorText,
                Status = System.Net.HttpStatusCode.TemporaryRedirect,
                pinfo.Terminal,
                Channel = pinfo.Channel?.Name,
                PrepayUrl = pinfo.Channel?.PrepayUrl,
            };

            return this.Json(res);

        }

        /// <summary>
        /// Потдверждение оплаты Партнера через Тинькова
        /// </summary>
        [HttpPost("partner-confirm")]
        public async Task<IActionResult> PartnerConfirmAsync([FromBody] TinkoffHelper.ConfirmRes res)
        {
            Common.Message msg;
            var jsres = Newtonsoft.Json.JsonConvert.SerializeObject(res);

            try
            {
                var amount = res.Amount / 100;
                var payDocId = Guid.Parse(res.OrderId);

                var paydoc = await Db.PayDocs
                    .LoadWith(x => x.PayerDom)
                    .FindAsync(payDocId);

                if (paydoc == null)
                    throw new KeyNotFoundException("Не найдена оплата " + payDocId);


                Db.BeginTransaction1();

                // вызываем сервисы для уточнения условия платежа
                var psvc = new PaymentService { Db = Db, User = this.CurUser(), };
                psvc.DoPayment(paydoc);

                paydoc.PayResult = jsres;

                // сохраняем результаты в базе
                await Db.SaveAsync(paydoc.PayerDom);
                await Db.SaveAsync(paydoc);

                // создаем запись в истории
                msg = new Common.Message
                {
                    //OrderId = payDocId,
                    PayDocId = payDocId,
                    Date = DateTime.Now,
                    Kind = Common.MessageKind.System,
                    Scope = ScopeType.Zone,
                    Text = $"Прошла оплата Tinkoff на сумму: {amount} руб.",
                };
                await Db.CreateInsertAsync(msg);

                Db.CommitTransaction1();
            }

            catch (Exception x)
            {
                msg = new Common.Message
                {
                    Date = DateTime.Now,
                    Kind = Common.MessageKind.Error,
                    Scope = ScopeType.Zone,
                    Text = $"Tinkoff confirm Error: {x}: {jsres}" ,
                };
                await Db.CreateInsertAsync(msg);
                return Error("Ошибка при проведении оплаты: " + x.Message);
            }

            return Ok("OK");
        }

        static int _N = 0;

        /// <summary>
        /// Подтверждение оплаты клиента по Тинькову
        /// </summary>
        [HttpPost("client-confirm")]
        public async Task<IActionResult> ClientConfirmAsync([FromBody] TinkoffHelper.ConfirmRes args)
        {
            if (args == null) return Ok("answer is null: " + ++_N);

            if (args.IsConfirmed())
            {
                var job = Sys.JobHelper.CreateJob(args, Sys.JobKind.Tinkoff);
                var r = await Db.CreateInsertAsync(job);
            }

            return Ok("OK");
        }
       
    }

}

#region Misc


////var err = res.Success ? null : res.Message + " " + res.Details;  // появился 0 https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/37889/
//if (!res.Success)
//{
//    //WebApp.Current.Logger?.LogError($"Tinkoff error: {err}, {pureq.ReturnUrl}, {pureq.FailUrl}, {pureq.Email}, {key}, {res.ErrorCode}");
//    throw new UserException($"Error tinkoff payment: {res.ErrorText} {res.ErrorCode}");
//}

#endregion

