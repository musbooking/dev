using Itall;
using LinqToDB;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Sys
{
    /// <summary>
    /// Группа отчетов, #52893 
    /// </summary>
    public enum TemplateGroup
    {
        None = 0,
        Cash = 1,
        Instruction = 2,
        Tinkoff = 3,
        Request = 4,
    }



    /// <summary>
    /// Константы шаблонов
    /// </summary>
    public static class TemplateKind
    {
        public const string Unknown = "unknown";
        public const string Code = "code";
        public const string Registration = "registration";
        public const string Restore = "restore";
        public const string Feedback = "feedback";
        public const string CheckEmailConfirmation = "email-confirm";
        public const string Manual = "manual";

        public const string Request = "request";

        public const string OrderReserv = "order.reserv";
        public const string OrderPaid = "order.paid";
        public const string OrderCancel = "order.cancel";
        public const string OrderForfeit = "order.forfeit";
        public const string OrderClose = "order.close";  //-- пока блокируем, чтобы везде показывать оплату  #51189 - back 71867
        public const string OrderError = "order.error";

        public const string OrderDomain = ".domain";
        public const string OrderChannel = ".ch-";
        public const string OrderBaseRequest = ".request";  // заявка на уровне базы
        public const string OrderService = ".service";


        public const string DomainRegistration = "DomainRegistration";
        public const string DomainYellow = "DomainYellow";
        public const string DomainBeforeBlock = "DomainBeforeBlock";
        public const string DomainAfterBlock = "DomainAfterBlock";
        public const string DomainPayment = "DomainPayment";

        public const string ClientForfeit = "client.forfeit";
        public const string ClientBanTrue = "client.ban.true";
        public const string ClientBanFalse = "client.ban.false";

        public const string ReviewNew = "review.new";
        public const string ReviewProcessed = "review.processed";
        public const string ReviewOk = "review.ok";
        public const string ReviewCancel = "review.cancel";

        public const string CalendarArchive = "calendar.archive";
    }

}



#region --- Misc ----

//public enum TemplateKind
//{
//    Unknown = 1,
//    Code = 2,
//    Registration = 3,
//    Restore = 5,
//    Feedback = 6,

//    OrderReserv = 11,
//    OrderReservDomain = 12,
//    OrderReservRequest = 13,
//    OrderReservRequestDomain = 14,
//    OrderReservPrepay = 15,
//    OrderReservPrepayDomain = 16,

//    OrderPaid = 21,
//    OrderPaidDomain = 22,
//    OrderPaidRequest = 23,
//    OrderPaidRequestDomain = 24,
//    OrderPaidPrepay = 25,
//    OrderPaidPrepayDomain = 26,

//    OrderCancel = 31,
//    OrderCancelDomain = 32,
//    OrderCancelRequest = 33,
//    OrderCancelRequestDomain = 34,
//    OrderCancelPrepay = 35,
//    OrderCancelPrepayDomain = 36,

//    OrderForfeit = 41,
//    OrderForfeitDomain = 42,
//    OrderForfeitRequest = 43,
//    OrderForfeitRequestDomain = 44,
//    OrderForfeitPrepay = 45,
//    OrderForfeitPrepayDomain = 46,

//    DomainRegistration = 100,
//    DomainYellow = 101,
//    DomainBeforeBlock = 102,
//    DomainAfterBlock = 103,
//    DomainPayment = 104,
//}
#endregion
