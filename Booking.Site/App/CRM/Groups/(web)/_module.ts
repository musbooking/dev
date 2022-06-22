module groups {

    //export function create(typeid: string): any {
    //    // this.type, this.domainOnly
    //    if (typeid == "equipments") return new GridView({ type: GroupType.Equipment }, "Тип оборудования");
    //    if (typeid == "features") return new GridView({ type: GroupType.RoomFeature }, "Параметр комнаты");
    //    if (typeid == "clients") return new GridView({ type: GroupType.ContactType, domain: true }, "Группа клиентов");
    //    if (typeid == "allclients") return new GridView({ type: GroupType.ContactType, viewDomain: true }, "Группа клиентов (все)");
    //    if (typeid == "cities") return new GridView({ type: GroupType.City, gps: true }, "Город");
    //    if (typeid == "client-types") return new GridView({ type: GroupType.ClientType }, "Тип клиента");
    //    if (typeid == "styles") return new GridView({ type: GroupType.MusicStyle }, "Музыкальный стиль");
    //    if (typeid == "tools") return new GridView({ type: GroupType.Tool }, "Музыкальный инструмент");

    //    if (typeid == "activities") return new GridView({ type: GroupType.Activity }, "Вид деятельности");
    //    if (typeid == "genres") return new GridView({ type: GroupType.Genre }, "Музыкальный жанр");
    //    if (typeid == "sources") return new GridView({ type: GroupType.Source }, "Источник клиента");

    //    if (typeid == "expenses") return new GridView({ type: GroupType.Expense, domain: true }, "Статья расходов");
    //    //if (typeid == "spheres") return new GridView({ type: GroupType.Sphere, domain: false }, "Сферы деятельности");
    //    if (typeid == "spheres") return new FormListView(
    //        { type: GroupType.Sphere, name: "Сфера деятельности" }, 'http->html/group-spheres.html'); //groups.spheresHtmpl.toHtml());

    //    if (typeid == "options") return new GridView({ type: GroupType.OrderOption, domain: false }, "Опции брони");

    //    if (typeid == "edversions") return new FormListView({ type: GroupType.Version, sort: "-date", name: "версия" }, 'http->html/group-list.html' ); //"http->./html/group-list.html");
    //    if (typeid == "versions") return new ListView({ type: GroupType.Version, sort: "-date", archive: false }, 'http->html/group-list.html');
    //}

    export let create = {
        //grid: () => new GridView(),
        //equipments:  () => new GridView({ type: GroupType.Equipment }, "Тип позиции"),
        equipments: () => new EqTypesGridView(),
        features: () => new FeaturesGridView(),
        ftypes: () => new GridView({ type: GroupType.FeatureType }, "Типы параметров"),

        clients:  () => new GridView({ type: GroupType.ContactType, domain: true }, "Группа клиентов"),
        allclients:  () => new GridView({ type: GroupType.ContactType, viewDomain: true }, "Группа клиентов (все)"),
        cities:  () => new GridView({ type: GroupType.City, gps: true }, "Город"),
        'client-types':  () => new GridView({ type: GroupType.ActivityType }, "Тип клиента"),
        styles:  () => new GridView({ type: GroupType.MusicStyle }, "Музыкальный стиль"),
        tools:  () => new GridView({ type: GroupType.Tool }, "Музыкальный инструмент"),

        activities:  () => new GridView({ type: GroupType.Activity }, "Вид деятельности"),
        genres:  () => new GridView({ type: GroupType.Genre }, "Музыкальный жанр"),
        sources:  () => new GridView({ type: GroupType.Skill }, "Источник клиента"),

        expenses:  () => new GridView({ type: GroupType.Expense, domain: true }, "Статья расходов"),
        //spheres:  () => new FormListView(
        //    { type: GroupType.Sphere, name: "Сфера деятельности" }, 'http->html/group-spheres.html'), //groups.spheresHtmpl.toHtml());

        options:  () => new GridView({ type: GroupType.OrderOption, domain: false }, "Опции брони"),

        edversions:  () => new FormListView({ type: GroupType.Version, sort: "-date", name: "версия" }, 'http->'+It.Web.WebSource.base+ '/html/group-list.html'), //"http->./html/group-list.html");
        versions: () => new ListView({ type: GroupType.Version, sort: "-date", archive: false }, 'http->' + It.Web.WebSource.base + '/html/group-list.html'),

        reviews: () => new GridView({ type: GroupType.Reviews }, "Типы отзывов"),

        //fin: () => new FinGridView(),
    }


    /**
    * Виды групп
    */
    export enum GroupType {
        Equipment = 1,
        ContactType = 2,
        City = 3,
        Tool = 4,
        MusicStyle = 5,
        ActivityType = 6,
        Skill = 7,
        Activity = 8,
        Genre = 9,
        RoomFeature = 10,
        Expense = 11,
        Version = 12,
        //Sphere = 13,
        OrderOption = 14,
        FeatureType = 15,
        Reviews = 16,
        Fin = 17,   // финансовые регистры, операции, детализации
    }

    //export let types = [
    //    { id: GroupsSource, value: "" },
    //];

    class GroupsSource extends app.AppDataSource {
        names = (type, domain?: boolean) => <any[]>this.load("names", { type, domain: domain })

        options = () => this.load("options")

        features = (args?) => this.load("features", args)

        //finnames = _ => this.load("finnames")

        //list = (args) => this.list(args) // { type, domain: domain });

        reindex = (start, ids) => this.post("reindex", {start, ids})
    }
    /**
        * Сервис работы с группами позиций
        */
    export let db = new GroupsSource("groups");

}