module clients {

    //export function create(typeid: string): any {
    //    if (typeid == "list") return new GridView();
    //    if (typeid == "totals") return new TotalsView();
    //    if (typeid == "edit") return new EditView();
    //    if (typeid == "forfeits") return new ForfeitGridView();
    //}


    export let create = {
        list: () => new GridView(),
        edit: () => new EditView(),
        totals: () => new TotalsView(),
        forfeits: () => new ForfeitGridView(),
    }

    export enum ClientPayKind {
        Default = 1,
        Trust = 2,
        Doubt = 3,
        Card = 4,  
    }

    export let payKinds = [
        { id: ClientPayKind.Default, value: "По умолчанию" },
        { id: ClientPayKind.Trust, value: "Доверять" },
        { id: ClientPayKind.Doubt, value: "Сомневаться" },
        { id: ClientPayKind.Card, value: "Только по карте" },
    ];


    //export let osTypes = [
    //    { id: "ios", value: "iOS" },
    //    { id: "adr", value: "Android" },
    //];

    export let genders = [
        { id: "m", value: "Муж" },
        { id: "w", value: "Жен" },
    ];

    class ClientsSource extends app.AppDataSource {
        //bitrixTemplate = "https://hendrix.bitrix24.ru/crm/contact/show";

        getClientName(obj) {
            if (!obj) return "";
            let name = `${obj.firstName} ${obj.lastName} ${obj.surName} ${obj.phones} ${obj.email}`;
            return name;
        }

        searchUrl = this.url("search");

        //searchClients(fio: string, phones: string, bitrixnum: string): any[] {
        //    let list = this.load("search", { fio, phones, bitrixnum });
        //    return list;
        //}

        forfeits(args?): any[] {
            let list = this.load("forfeits", args);
            return list;
        }

        items(args): any[] {
            let list = this.load("list", args);
            return list;
        }

        totals(args): any[] {
            let list = this.load("totals", args, false);
            return list;
        }

        html(id) {
            return this.loadStr("html/" + id);
        }

    }

    export let db = new ClientsSource("clients");

    class ClientPartsSource extends app.AppDataSource {
    }

    export let partsdb = new ClientPartsSource("clientparts");


    // управление праваами доступа в карточке клиента
    export let logic = {
        allowSuper: () => system.context.isSuper,

        allowEdit: (client) => client.isDomain || system.context.isSuper,

        allowFin: (client) => system.context.allow(auth.oper.clientFin),

        allowDiscBan: (client) => system.context.allow(auth.oper.clientDiscBan),
    }


    export function getSearchColumn() {
        let col = $u.element("clientId")
            .Label("Клиент", "top")
            .AsSelect(clients.db.searchUrl)
            .Require()
            //.Size(200, 30)
            .Tooltip("Для поиска введите часть ФИО, mail или телефон")
            .Css("it-warning");
        return col;
    }

    export function getClientColumnTemplate(idCol = "#clientId#", nameCol = "#client#") {
        let res = "";
        if (system.context.allow(auth.oper.clients))
            res = $u.getViewLink("clients", nameCol, idCol);
        else
            res = nameCol;
        return res;
    } 

    //export function allowClientEdit(client) {
    //    //let domainId = (<any>auth.Context).domainId;
    //    return client.domainId == null || client.domainId == domainId; 
    //}

    //export function getClientTemplate() {
    //    let res = "";
    //    //if (auth.Context.allow(acc.orderViewFull))
    //    //    res = "#client#".addLink(clients.db.bitrixTemplate + "/#clientBitrixNum#/", { target: "_blank" });
    //    //else
    //    //    res = "#client#";
    //    res = "#client#".addLink("{common.href}/clients/edit?oid=#clientId#");
    //    return res;
    //}

}