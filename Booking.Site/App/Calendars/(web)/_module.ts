module calendars {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //}


    export let create = {
        grid: () => new GridView(),
    }

    export let calendarSources = [
        { id: "google", value: "Google календарь" },
        //{ id: "windowsLive", value: "Outlook календарь" },
        { id: "microsoftOnline", value: "Outlook календарь" },
    ]; 


    // Источник данных для работы с календарями
    class CalendarsSource extends app.AppDataSource {

        list( args? ): any[] {
            return this.load("list", args);
        }

        sync(args) {
            let res = this.loadStr("sync", args); //{ domain: domainid, ids });
            return res;
        }

        test(id): string {
            return this.loadStr("test", { id });
        }

    }
    export let db = new CalendarsSource("calendars");


    // Класс для работы с OAuth2 источниками
    class OAuthSource extends app.AppDataSource {
        authUrl = (id, provider) => this.url("authorize", { id, provider })
    }
    export let oauth2 = new OAuthSource("oauth2");


    export enum WatchStatus {
        Unknown = 0,
        Error = 1,
        Stop = 3,  // календарь и нотификация были заблокированы
        Active = 10,  // календарь подписан на PUSH уведомления
    }


    export let watch_statuses = [
        { id: WatchStatus.Unknown, value: '' },
        { id: WatchStatus.Stop, value: 'Стоп' },
        { id: WatchStatus.Active, value: 'Включено' },
        { id: WatchStatus.Error, value: 'Ошибки' },
    ];




    //// Класс для работы с гугл-сервисами
    //class GoogleSource extends app.AppDataSource {

    //}
    //export let google = new GoogleSource("google"); // 2-й параметр - уничтожаем api вызов
   
}