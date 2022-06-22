module configs {

    // список пользователей   
    class DataSource extends app.AppDataSource {
        list = () => this.loadList("list");
        reset = () => this.post("reset");
    }
    export let db = new DataSource("configs");

    
    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridFormView();
    //}

    export let create = {
        grid: () => new GridFormView(),
    }

}