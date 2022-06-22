module users {

    // список пользователей   
    class UsersSource extends app.AppDataSource {
        itemsUrl = this.url('list');

        search = (client) => this.load("search", { client });

        resetUserPassword = (userid) => this.post("resetUser", { user: userid });
    }
    export let db = new UsersSource("users");

    
    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridFormView();
    //}


    export let create = {
        grid: () => new GridFormView(),
    }
}