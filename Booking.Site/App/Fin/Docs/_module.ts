module docs {

    //export function create(typeid: string): any {
    //    //if (typeid == "grid") return new GridView();
    //}


    export let create = {
        //grid: () => new GridView(),
        //edit: () => new EditView(),
        //service: () => new EditView(),
    }


    export let types = [
        { id: "abonement", value: "Абонемент" },
        { id: "order", value: "Заказ" },
    ];

    class DocsSource extends app.AppDataSource {

        list(args): any[] {
            let list = this.load("list", args);
            return list;
        }
    }

    export let db = new DocsSource("docs");
}