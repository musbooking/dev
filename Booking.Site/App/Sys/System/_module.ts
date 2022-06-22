module system {

    class SystemSource extends app.AppDataSource {

        context() {
            return this.load("context");
        }
    }

    export let dbsys = new SystemSource("system");
    
    export class SystemContext {
        browser: any
        id: guid
        login: string
        name: string
        isSuper: boolean = false
        domain: string
        domainId: guid
        clientId: guid
        isLimit: boolean;  // заблокирован в красной зоне
        isLimit0: boolean; // заблокирован в желтой зоне
        limitDate: Date;
        //allowShare: boolean; // главная зона или нет - убрана 58628
        remains: number;

        permissions: { [key: string]: boolean } = {};  // dictionary[string,bool]

        allow(operation) {
            // if (this.isSuper) return true;  убрана в 58623
            if (!this.permissions) return false;
            let res = this.permissions[operation] //|| this.permissions[auth.roles.super];
            return res === true;
        }

        /** Разрешаем редактирование справочников для доменных пользователей или при явных разрешениях CRM*/
        allowCrmEdit() {
            //let res = !this.isSuper || this.allow(auth.oper.crmView) && this.allow(auth.oper.crmEdit)
            let res = !this.isSuper || this.allow(auth.oper.crmEdit)   //58623 - добавлена только поддержка операции Crm Edit
            return res
        }
    }

    export let context: SystemContext;

    export function loadContext() {
        context = new SystemContext();

        if (!It.Web.auth.tokens.current)
            return;

        let ctx = dbsys.context();
        webix.extend(context, ctx, true);
    }

    // checkContext(); вызов делается явно в app.init()

}
    




