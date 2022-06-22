module settings_ui {

    //export function create(typeid: string): any {
    //    if (typeid == "settings") return new SettingsView();
    //}
    export let create = {
        edit: () => new SettingsView(),
    }

    export class System2Source extends It.Web.WebSource {
        getConfig = () => this.load("config");
        saveConfig = (cfg) => this.post("config", { data: cfg }); 
    }
    export let dbsystem = new System2Source("system"); 

}


//module admin {

//    //export function create(typeid: string): any {
//    //    //if (typeid == "users") return new GridFormView();
//    //    if (typeid == "settings") return new SettingsView();
//    //}


//    export let create = {
//        settings: () => new SettingsView(),
//    }

//}