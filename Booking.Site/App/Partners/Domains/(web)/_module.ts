module domains {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //    if (typeid == "edit") return new EditView();
    //    if (typeid == "service") {
    //        let view = new EditView();
    //        //view.reload(access.user.data.domain);
    //        return view;
    //    }
    //}

    export let create = {
        grid: () => new GridView(),
        reg: () => new RegView(),
        edit: () => new EditView(),
        service: () => new EditView(),
    }


    class DomainsSource extends app.AppDataSource {
        itemsUrl = this.url("list");

        job = () => this.load("job")

        init(id: guid, isSuper: boolean) {
            let ops = auth.opers;
            //let ops3 = ops.filter(x => x.shared === true);  // for test
            if (!isSuper)
                ops = ops.filter(x => x.super !== true);
            let ids = ops.map(x => x.id);
            let res = this.post("init", { id, operations: ids, role: auth.roles.super });
            return res;
        }

        reset(id) {
            let res = this.post("reset", { id });
            return res;
        }

        registry(info) {
            let res = this.post("registry", info);
            return res;
        }

        names = () => this.load("names")

        namesUrl = this.url("names")

    }

    export let db = new DomainsSource("domains");


    /**
    * Тип даты перехода по счету
    */
    export enum PeriodKind {
        ByCreateDate = 1,
        ByServiceDate = 2,
    }

    export let periods = [
        { id: PeriodKind.ByCreateDate, value: "По дате создания" },
        { id: PeriodKind.ByServiceDate, value: "По дате брони" },
    ];

    export enum DomainStatus {
        Unknown = 0,
        Payment = 1,

        Warning = 10,
        PredLock = 20,
        Locked = 30,

        Mamual = 100,
        New = 101,
    }

    export let statuses = [
        { id: DomainStatus.Payment, value: "Оплачено" },
        { id: DomainStatus.Warning, value: "Предупреждение" },
        { id: DomainStatus.PredLock, value: "Предблок" },
        { id: DomainStatus.Locked, value: "Блок" },
        { id: DomainStatus.Mamual, value: "Ручной" },
        { id: DomainStatus.New, value: "Новый" },
    ];

    export function domain_css(obj) {
        if (!obj.limitDate) return;
        let dd = It.dateDiff.inDays(obj.limitDate);
        if (dd > 7)
            obj.$css = "it-error";
        else if (dd > 0)
            obj.$css = "it-warning";
    }
}