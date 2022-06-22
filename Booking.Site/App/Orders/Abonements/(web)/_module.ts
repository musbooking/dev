module abonements {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //    if (typeid == "edit") return new EditView();
    //}

    export let create = {
        grid: () => new GridView(),
        edit: () => new EditView(),
    }
     
    class AbonementsSource extends app.AppDataSource {
        itemsUrl = this.url("list");
    }

    export let db = new AbonementsSource("abonements");

}