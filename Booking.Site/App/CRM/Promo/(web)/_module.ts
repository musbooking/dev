module promo {

    //export function create(typeid: string): any {
    //    if (typeid == "rulesgrid") return new RulesGridView();
    //    if (typeid == "actgrid") return new ActGridView();
    //    if (typeid == "codegrid") return new CodeGridView();
    //    if (typeid == "hotgrid") return new HotGridView();
    //}


    export let create = {
        rulesgrid: () => new RulesGridView(),
        actgrid: () => new ActGridView(),
        codegrid: () => new CodeGridView(),
        hotgrid: () => new HotGridView(),
    }

    export enum PromoKind {
        Action = 0,
        Number = 1,
        Rules = 2,
        Hot = 3,
    }



    class PromoSource extends app.AppDataSource {
        getItems = (type: PromoKind) => this.loadList("list", { type });

        numItems = () => this.loadList("numItems");

        //namesUrl = this.url("names");

        names = (actuals?: boolean, type?: PromoKind) => this.load('names', { actuals, type });

        //getOrders = (promoId) => this.load("orders", { promo: promoId });
    }

    export let db = new PromoSource("promo");
}