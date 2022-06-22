module discounts {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //}

    export let create = {
        grid: () => new GridView(),
    }


    class DiscountsSource extends app.AppDataSource {
        itemsUrl = this.url("list");

    }

    export let db = new DiscountsSource("discounts");
}