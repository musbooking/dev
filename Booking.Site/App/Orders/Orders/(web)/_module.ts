module orders {

    //export function create(typeid: string): any {
    //    if (typeid == "ask-grid") return new AskGridView();
    //    if (typeid == "forfeits") return new ForfeitsGridView();
    //    if (typeid == "edit") return new EditView();
    //    if (typeid == "filter-grid") return new FilterGridView();
    //    if (typeid == "totals") return new TotalsView();
    //    if (typeid == "calendar") return new CalendarView();
    //    if (typeid == "search") return new SearchMobView();
    //    if (typeid == "search-all") return new SearchAllView();
    //}


    export let create = {
        'ask-grid': () => new AskGridView(),
        forfeits: () => new ForfeitsGridView(),
        edit: () => new EditView(),
        'filter-grid': () => new FilterGridView(),
        'filter-grid-full': () => new FilterGridFullView(),
        totals: () => new TotalsView(),
        requests: () => new RequestsGridView(),
        request: () => new RequestView(),
        totalscom: () => new TotalsComView(),
        calendar: () => new CalendarView(),
        search: () => new SearchView(),
        'search-s': () => new SearchSuperView(),
        'search-all': () => new SearchAllView(),
    }



    class OrdersSource extends app.AppDataSource {
        // Очистка календаря за интервал
        clearCalendar(base, d1: Date, d2: Date): any {
            return this.post('clear-calendar', { base: base, d1: d1, d2: d2 });
        }

        //items = (status?: docs.DocumentStatus, reason?: CancelReason) => this.loadItems({ status: status || null, reason: reason || null });
        list(args) {
            return this.load('list', args);
        }

        admlist(args) {
            return this.load('admlist', args);
        }

        requests(args) {
            return this.load('requests', args);
        }

        //itemsUrl2 = ( ddfrom: Date, ddto: Date, search?: string, status?) => {
        //    //let d1 = webix.i18n.dateFormatStr(dfrom);
        //    //let d2 = webix.i18n.dateFormatStr(dto);//.toUTCString();
        //    let dfrom = ddfrom.toLocaleDateString();//.valueOf();
        //    let dto = ddto.toLocaleDateString();//.valueOf();
        //    return this.url("items2", {search, dfrom, dto, status });
        //}

        search(filter) {
            //debugger
            let list = this.load("search", filter);
            return list;
        }

        getAbonementItems = (abonement) => {
            return this.load("abonement", { abonement });
        }

        //archive(id: number): void {
        //    let res = this.load("archive", { id: id});
        //}

        commissionUrl() {
            return this.url("commission");
        }

        calendarUpdates = new app.UpdatesSource("updates")

        forfeitUpdates = new app.UpdatesSource("updates")

        calcUrl = this.url("calc")

        calc(item) {
            return this.post("calc", item);
        }

        calendar(baseId: number, dateFrom: Date, dateTo: Date) {
            let list = this.load("calendar", { base: baseId, dateFrom, dateTo });
            return list;
        }

        totals(dfrom: Date, dto: Date) {
            let list = this.load("totals", { dfrom: dfrom, dto: dto }, false);
            return list;
        }

        totalscom(args) {
            let list = this.load("totalscom", args, false);
            return list;
        }

        /** изменение статуса через action     */
        setStatus(orderid: number, action: orders.OrderAction) {
            //let url = this.url("status");
            let res = this.post("status", { id: orderid, act: action });
            return res;
        }

    }

    /** * Работа с заказами */
    export let db = new OrdersSource("orders");


    /**
    * Статус брони
    */
    export enum OrderStatus {
        Request = -1,
        Unknow = 0,
        Reserv = 1,
        Closed = 10,
        Cancel = 11,

        //Done = 100,
        //ForfeitAsk = 21,
        //ForfeitConfirm = 22,
    }

    /** * Список статусов документа  */
    export let statuses = [
        //{ id: 0, value: "" },
        { id: OrderStatus.Request, value: "Заявка" },
        { id: OrderStatus.Reserv, value: "Резерв" },
        { id: OrderStatus.Closed, value: "Закрыто" },
        { id: OrderStatus.Cancel, value: "Отменено" },
        //{ id: 100, value: "Выполнено" },
    ];

    export enum OrderAction {
        New = 0,
        Reserv = 1, //OrderStatus.Reserv
        Paid = 10, //OrderStatus.Closed,

        CancelNormal = 11,
        CancelForfeitAsk = 21,
        CancelForfeitConfirm = 22,

        Close = 100,
    }



    /**
    * Причина отмены бронирования
    */
    export enum CancelReason {
        Unknown = 0,
        Normal = 1,
        //ClientOut = 2,
        ForfeitsAsk = 3,
        ForfeitsConfirmed = 4,
    }


    /**
    * Список причин отмены бронирования
    */
    export let cancelReasons = [
        //{ id: 0, value: "" },
        { id: CancelReason.Normal, value: "Без штрафа" },
        //{ id: 2, value: "Клиент не пришел" },
        { id: CancelReason.ForfeitsAsk, value: "Запрос" },
        { id: CancelReason.ForfeitsConfirmed, value: "Подтверждение" },
    ];



    //export enum GroupKind {
    //    Unknown = 0,
    //    Solo = 1,
    //    Duet = 2,
    //    Group = 3,
    //}

    ///**
    //* Виды групп
    //*/
    //export let orderGroupKinds = [
    //    //{ id: 0, value: "" },
    //    { id: GroupKind.Solo, value: "Соло" },
    //    { id: GroupKind.Duet, value: "Дуэт" },
    //    { id: GroupKind.Group, value: "Группа" },
    //];


    // для отчетов в orders/filter-grid
    export enum SourceKind {
        Abonements = 1,
        Mobile = 2,
        Site = 3,
        Widget = 4,
        Bot = 5,
    }

    export let sourceKinds = [
        //{ id: 0, value: "" },
        { id: SourceKind.Abonements, value: "Абонементы" },
        { id: SourceKind.Mobile, value: "Мобильные" },
        { id: SourceKind.Site, value: "Сайт" },
        { id: SourceKind.Widget, value: "Виджет" },
        { id: SourceKind.Bot, value: "Бот" },
    ];


    export let payStatuses = [
        { id: 1, value: "Нет" },
        { id: 2, value: "Частично" },
        { id: 3, value: "Полностью" },
    ];

    export enum SourceType {
        Web = 0,
        Mobile = 1,
        Imported = 2,
        Widget = 3,
        Bot = 4,
        Catalog = 5,
        Sync = 6,  // Синхронизация с внешним сайтом

        //MobilePre = 11, // мобильная предоплата
        //WidgetPre = 13, // виджет предоплата
        //CatalogPre = 15, // каталог предоплата
    }

    export let sourceTypes = [
        //{ id: 0, value: "" },
        { id: ''+SourceType.Web, value: "Сайт" },
        { id: SourceType.Mobile, value: "Мобильные" },
        //{ id: SourceType.MobilePre, value: "Мобильные.пред" },
        { id: SourceType.Widget, value: "Виджет" },
        //{ id: SourceType.WidgetPre, value: "Виджет.пред" },
        { id: SourceType.Catalog, value: "Каталог" },
        //{ id: SourceType.CatalogPre, value: "Каталог.пред" },
        { id: SourceType.Bot, value: "Бот" },
        { id: SourceType.Imported, value: "Импорт" },
        { id: SourceType.Sync, value: "Синхронизация" },
    ];

    export let sourceUserTypes = [
        { id: SourceType.Mobile, value: "Мобильные" },
        //{ id: SourceType.MobilePre, value: "Мобильные.пред" },
        { id: SourceType.Widget, value: "Виджет" },
        //{ id: SourceType.WidgetPre, value: "Виджет.пред" },
    ];

    /** Статусы заявок */
    export enum RequestStatus {
        Unknown = 0,
        New = 1, // Новая,
        Processing = 2, // В работе,
        Confirmed = 10, // Подтверждена,
        Canceled = 11, // Отклонена, 
        Unprocessed = 12, // Не обработана
    }

    export let requestStatuses = [
        { id: RequestStatus.New, value: "Новая" },
        { id: RequestStatus.Processing, value: "В работе" },
        { id: RequestStatus.Confirmed, value: "Подтвержденная" },
        { id: RequestStatus.Canceled, value: "Отлонена" },
        { id: RequestStatus.Unprocessed, value: "Не обработана" },
        //{ id: RequestStatus., value: "" },
    ];


    export function getOrderText(vals) {
        let h1 = vals.dateFrom.getHours();
        let m1 = vals.dateFrom.getMinutes();
        let h2 = vals.dateTo.getHours();
        let m2 = vals.dateTo.getMinutes();

        if (h2 == 0) h2 = 24;

        let status = orders.statuses.findById(vals.status, {}).value || "без статуса";
        let reason = cancelReasons.findById(vals.reason, {}).value || "";
        let text = `${status} ${reason}: ${vals.baseName}, ${vals.roomName} на ${webix.i18n.dateFormatStr(vals.dateFrom)}, ${h1}:${m1}-${h2}:${m2}`; //, ${h2 - h1}ч

        return text;
    }


    //export function banAlert() {
    //    return $u.template("  Клиент заблокирован или имеет штраф у партнеров сервиса").Css("it-error");
    //}

}

