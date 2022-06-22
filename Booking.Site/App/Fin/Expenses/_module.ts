module expenses {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //    if (typeid == "edit") return new EditView();
    //}


    export let create = {
        grid: () => new GridView(),
        edit: () => new EditView(),
    }


    class ExpDocSource extends app.AppDataSource {
        list_items = (dateFrom, dateTo) => this.list({ dateFrom, dateTo });
    }
    /**
        * Сервис работы с группами оборудования
        */
    export let db = new ExpDocSource("expenses");


    class ExpItemsSource extends app.AppDataSource {
        list_items = (id) => this.list(id);
    }
    /**
        * Сервис работы с группами оборудования
        */
    export let itemsdb = new ExpItemsSource("expitems");

}