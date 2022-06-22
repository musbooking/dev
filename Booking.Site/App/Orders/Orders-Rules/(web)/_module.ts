module order_rules {

    export let create = {
        grid: () => new GridView(),
    }

    class DataSource extends lists.DataSource {
        reindex = (start, ids) => this.post("reindex", { start, ids })

        canCancelBase(baseid: guid, dateCreate, dateFrom) {
            return this.load("can-cancel-base", {
                base: baseid,
                dateCreate: dateCreate,
                dateFrom: dateFrom,
                });
        }
    }

    export let db = new DataSource("orderrules");

    /** Тип IF-условия правила */
    export enum OrderRuleIfKind {
        SameDate = 1,
        More = 2,
        Less = 3,
    }


    /*  Тип ELSE-условия правила */
    export enum OrderRuleThenKind {
        Always = 1,
        More = 2,
        Less = 3,
    }

    export let ifkinds = [
        { id: OrderRuleIfKind.SameDate, value: 'День в день' },
        { id: OrderRuleIfKind.Less, value: 'Менее чем за' },
        { id: OrderRuleIfKind.More, value: 'Более чем за' },
    ];

    export let thenkinds = [
        { id: OrderRuleThenKind.Always, value: 'Всегда' },
        { id: OrderRuleThenKind.Less, value: 'В течение' },
        { id: OrderRuleThenKind.More, value: 'Не позднее чем за' },
    ];


}