module messages {

    export enum ScopeType {
        Any = 0,
        Zone = 1,
        Private = 2,
    }

    /** * Список типов диапазона */
    export let scopeTypes = [
        //{ id: ScopeType.Any, value: "Везде" },
        { id: ScopeType.Zone, value: "Партнер" },
        { id: ScopeType.Private, value: "Только я" },
    ];


    /// <summary>
    /// Тип сообщения
    /// </summary>
    export enum MessageKind {
        Unknown = 0,
        User = 1,
        System = 2,
        Error = 3,
        Bitrix = 4,
        Review = 5, // отзыввы 
        Calendar = 7,  // история по календарю
        ViewRoom = 8,  // просмотр комнаты
    }


    class MessagesSource extends app.AppDataSource {

        //list(args): any[] {
        //    let list = this.load("list", args);
        //    return list;
        //}
    }

    export let db = new MessagesSource("messages");

}