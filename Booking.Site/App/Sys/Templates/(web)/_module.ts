module templates {


    export let create = {
        grid: () => new GridView(),
        edit: () => new EditView(),
    }


    class DbSource extends lists.DataSource {

        names(args?): any[] {
            let items = this.loadList("names", args);
            return items;
        } 

    }

    export let db = new DbSource("templates");

    export class TemplateKind {
        static readonly Unknown = "unknown";
        static readonly Code = "code";
        static readonly Registration = "registration";
        static readonly Restore = "restore";
        static readonly Feedback = "feedback";
        static readonly CheckEmailConfirmation = "email-confirm";
        static readonly Manual = "manual";

        // операции с бронью
        static readonly OrderReserv = "order.reserv";
        static readonly OrderPaid = "order.paid";
        static readonly OrderCancel = "order.cancel";
        static readonly OrderForfeit = "order.forfeit";
        static readonly OrderClose = "order.close";
        static readonly OrderError = "order.error";

        // операции с заявками
        static readonly Request = "request";
        static readonly RequestNew = ".new";
        static readonly RequestUnprocessed  = ".unprocessed";
        static readonly RequestConfirmed = ".confirmed";
        static readonly RequestCanceled = ".canceled";


        //
        static readonly OrderDomain = ".domain";
        static readonly OrderService = ".service";
        static readonly OrderBaseRequest = ".request";

        // по способу оплаты
        static readonly OrderChannelCash = ".cash";
        static readonly OrderChannelTinkoff = ".tinkoff";
        static readonly OrderChannelInstruction = ".instruction";


        static readonly DomainRegistration = "DomainRegistration";
        static readonly DomainYellow = "DomainYellow";
        static readonly DomainBeforeBlock = "DomainBeforeBlock";
        static readonly DomainAfterBlock = "DomainAfterBlock";
        static readonly DomainPayment = "DomainPayment";

        static readonly ClientForfeit = "client.forfeit";
        static readonly ClientBanTrue = "client.ban.true";
        static readonly ClientBanFalse = "client.ban.false";

        static readonly CalendarArchive = "calendar.archive";
    }
   


    export let kinds = [
        //{ id: TemplateKind.Unknown, value: "" },
        { id: TemplateKind.Code, value: "СМС Код" },
        { id: TemplateKind.Registration, value: "Регистрация" },
        { id: TemplateKind.Restore, value: "Восстановление" },
        { id: TemplateKind.Feedback, value: "Обратная связь" },
        { id: TemplateKind.CheckEmailConfirmation, value: "Подтверждение почты" },
        { id: TemplateKind.Manual, value: "Ручная рассылка" },

        //{ id: TemplateKind.OrderClose, value: "Бронь закрыта" },
        { id: TemplateKind.OrderError, value: "Бронь ошибка" },
        { id: TemplateKind.CalendarArchive, value: "Календарь - архивация" },

        { id: TemplateKind.DomainRegistration, value: "Партнер-Регистрация" },
        { id: TemplateKind.DomainYellow, value: "Партнер-Желтая" },
        { id: TemplateKind.DomainBeforeBlock, value: "Партнер-Перед блок." },
        { id: TemplateKind.DomainAfterBlock, value: "Партнер-После блок" },
        { id: TemplateKind.DomainPayment, value: "Партнер-Оплата" },

        { id: TemplateKind.ClientForfeit, value: "Клиент-изм.штрафа" },
        { id: TemplateKind.ClientBanTrue, value: "Клиент-бан" },
        { id: TemplateKind.ClientBanFalse, value: "Клиент-снятие бана" },

        { id: "review.new", value: "Отзыв-Новый" },
        { id: "review.processed", value: "Отзыв-Обработано" },
        { id: "review.ok", value: "Отзыв-Отвечено" },
        { id: "review.cancel", value: "Отзыв-Отмена" },

        //{ id: TemplateKind., value: "" },

    ]; 

    /** добавляем шаблоны для заявок */
    function addRequestTemplates(btempl: string, btext: string) {
        btext = "Заявка " + btext;
        btempl = TemplateKind.Request + btempl;
        kinds.push({ id: btempl, value: btext });
        kinds.push({ id: btempl + TemplateKind.OrderDomain, value: btext + " (Партнер)" });
        kinds.push({ id: btempl + TemplateKind.OrderService, value: btext + " (Сервис)" });
    }
    addRequestTemplates(TemplateKind.RequestNew, "новая");
    addRequestTemplates(TemplateKind.RequestCanceled, "отмена");
    addRequestTemplates(TemplateKind.RequestConfirmed, "подтверждение");
    addRequestTemplates(TemplateKind.RequestUnprocessed, "Не обработана");


    /** добавляем шаблоны - завка, наличные, инструктор, тиньков */
    function addOrderTemplates(btempl: string, btext: string) {
        kinds.push({ id: btempl + TemplateKind.OrderBaseRequest, value: btext + " (Заявка)" });
        kinds.push({ id: btempl + TemplateKind.OrderChannelCash, value:  btext+ " (Наличные)" });
        kinds.push({ id: btempl + TemplateKind.OrderChannelInstruction, value:  btext+ " (Инструкция)" });
        kinds.push({ id: btempl + TemplateKind.OrderChannelTinkoff, value:  btext+ " (Тиньков)" });
    }

    addOrderTemplates( TemplateKind.OrderReserv, "Резерв");
    addOrderTemplates( TemplateKind.OrderReserv + TemplateKind.OrderDomain, "Резерв-Партнер");
    addOrderTemplates( TemplateKind.OrderPaid, "Оплата");
    addOrderTemplates( TemplateKind.OrderPaid + TemplateKind.OrderDomain, "Оплата-Партнер");
    addOrderTemplates( TemplateKind.OrderCancel, "Отмена");
    addOrderTemplates( TemplateKind.OrderCancel + TemplateKind.OrderDomain, "Отмена-Партнер");
    addOrderTemplates( TemplateKind.OrderForfeit, "Штраф");
    addOrderTemplates( TemplateKind.OrderForfeit + TemplateKind.OrderDomain, "Штраф-Партнер");
    addOrderTemplates(TemplateKind.OrderClose, "Закрыт");
    addOrderTemplates(TemplateKind.OrderClose + TemplateKind.OrderDomain, "Закрыт-Партнер");
    //addTemplate(TemplateKind.OrderClose, "Закрыт");
    
}