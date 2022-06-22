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
    /// <summary>
    /// Базовый механизм проведения платежей в платежном агрегаторе
    /// </summary>
    //[Route("")]
    public abstract class PaymentController : DbController
    {

        [HttpGet("ok")]
        public dynamic PaymentOk(dynamic arg)
        {
            //return Response.AsText("Платеж обработан магазином успешно. Пожалуйста, вернитесь на страницу магазина и обновите кабинет");
            return View("payment-confirm");
        }

        [HttpGet("error")]
        public dynamic PaymentError(dynamic arg)
        {
            //return Response.AsText("Произошла ошибка при проведении платежа. Пожалуйста, повторите платеж");
            return View("payment-error");
        }

    }

}


#region --- Misc -----


//private async Task<IActionResult> PaymentAsync()
//{
//    this.RequiresAuthentication();

//    using (var db = new AppDb())
//    {
//        db.BeginTransaction();


//        // основная обработка оплаты через сервис
//        var res = await BeginPayment(payment, domain);
//        await db.CreateInsertAsync(payment);
//        EndPayment(db, payment, domain);

//        // раз все совпадает, то задаем оплату для заказов
//        if (payment.MobComm > 0)
//        {
//            invOrders
//                .Set(x => x.MobComPayId, payment.Id)
//                .Update();
//        }

//        db.CommitTransaction();
//        return res;
//}


///// <summary>
///// Обязательный метод отправки платежа
///// </summary>
///// <param name="payment"></param>
///// <returns></returns>
//protected abstract Task<IActionResult> BeginPayment(PayDoc payment, Domain domain);

///// <summary>
///// Необязательный метод завершения отправки платежа
///// </summary>
///// <param name="payment"></param>
//protected virtual void EndPayment(AppDb db, PayDoc payment, Domain domain)
//{
//}
#endregion

