module permissions {

    // наборы прав
    export class PermissionsSource extends app.AppDataSource {
        //itemsUrl = this.url('list');
    }
    export let db = new PermissionsSource("permissions2");

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //}


    export let create = {
        grid: () => new GridView(),
    }
}