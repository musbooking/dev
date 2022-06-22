module rules {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //}


    export let create = {
        grid: () => new GridView(),
    }


    class RulesSource extends app.AppDataSource {
        itemsUrl = this.url('list');
    }

    /**
        * Сервис работы с правилами доступа
        */
    export let db = new RulesSource("rules");

}