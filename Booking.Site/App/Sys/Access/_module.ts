module access {

    export function run() {
        let navigator = new $u.Navigator();
        navigator.view.show();
        navigator.routers("access");
    }

    //export function create(typeid: string): any {
    //    if (typeid == "default") return new LoginView();
    //    if (typeid == "login") return new LoginView();
    //    if (typeid == "logout") {
    //        auth_logins.tokens.clear();
    //        return new LoginView();
    //    }
    //}


    export let create = {
        default: () => new LoginView(),
        login: () => new LoginView(),
        logout: () => {
            It.Web.auth.tokens.clear();
            return new LoginView();
        },
    }


    export type allow = (x) => boolean;



    // сервис авторизации
    export class AuthSource extends app.AppDataSource {

        constructor(controller: string) {
            super(controller, "api/"); // все делаем с префиксом 
        }

        login(args) {
            return this.load("login");
        }

        checkLogin() {
            return this.load("check", null);
        }

        context() {
            return this.load("context");
        }

    }
    export let dbauth = new AuthSource("auth");

    export function checkLogin() {

        if (!It.Web.auth.tokens.current)
            return;

        dbauth.checkLogin();
    }

    //checkLogin(); вызов явно в app.init()


}