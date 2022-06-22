module roles {

    
    // список ролей
    export class RolesSource extends app.AppDataSource {
        //itemsUrl = this.url('list');
        names = () => this.load("names");
    }
    export let db = new RolesSource("roles2");

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //}


    export let create = {
        grid: () => new GridView(),
    }

}