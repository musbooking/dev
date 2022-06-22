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
using Itall.App.Data;
using Itall;
using System.Threading;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Fin
{
#if !DEBUG1111 // открываем тестовый для админов - https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/19424/

    /// <summary>
    /// ТЕстовая подсистема проведения платежей
    /// </summary>
    //[Route("paytest")]
    public class PayTestController : PaymentController
    {

        //public PayTestModule() : base("/")
        //{
        //    Post["/", true] = PaymentAsync;
        //}


        [HttpPost("payment")]
        public async Task<IActionResult> PaymentAsync()
        {
            this.RequiresAuthentication();
            var user = this.CurUser();
            user.Require(Sys.Operations.DomainsEdit);
            //if (!user.Allow(Core.Operations.DomainsAll))
            //{
            //    var ids = user.DomainGuids(null);
            //    domains0 = domains0.Where(x => ids.Contains(x.Id));
            //}

            Db.BeginTransaction1();

            var psvc = new PaymentService { Db = Db, User = user,};
            var payment = psvc.CreatePayment(this.Request.Form);
            psvc.DoPayment(payment);

            await Db.SaveAsync(payment.PayerDom);
            await Db.SaveAsync(payment);

            Db.CommitTransaction1();

            return Ok();
        }


    }
#endif
}
