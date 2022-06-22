module equipments {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //    if (typeid == "totals") return new TotalsView();
    //}


    export let create = {
        grid: () => new GridView(),
        totals: () => new TotalsView(),
    }

    /**
    * Назначение позиции (оборудования)
    */
    export enum DestKind {
        Addition = 1,  // Дополнительно к заказу
        Package = 2,   // Пакетное предложение
    }


    /**
    * Список назначений
    */
    export let destKinds = [
        { id: DestKind.Addition, value: "Дополнительно к заказу" },
        { id: DestKind.Package, value: "Пакетное предложение" },
    ];

    /**
     * Тип оборудования
    */
    export enum EqKind {
        None = 0,
        Other = 1,   // Прочее
        Equipment = 2,   // Оборудование
        Service = 3,   // Услуги
    }

    /**
    * Список типов оборудования
    */
    export let eqKinds = [
        { id: EqKind.Equipment, value: "Оборудование" },
        { id: EqKind.Service, value: "Услуга" },
        { id: EqKind.Other, value: "Другое" },
    ];





    class EquipmentsSource extends app.AppDataSource {
        namesUrl = this.url("names");
        names = (baseid?: number) => this.loadList('names', { base: baseid });
        typesUrl = this.url("types");
        listUrl = this.url("list");

        balance(baseid, orderid: number, dfrom: Date, dto: Date): any[] {
            let list = this.load("balance", { base: baseid, order: orderid, dfrom, dto, all: true, empty: false, }, false);
            return list;
        }

        totals(baseId: number): any[] {
            let list = this.load("totals", { base: baseId });
            return list;
        }
    }


    /** * Сервис работы с оборудованием */
    export let db = new EquipmentsSource("equipments");

}