module clients {

    export class FilterView extends $u.PopupView {

        lastObject: any;

        $config() {

            let formCfg = this.form.config().extend({
                width: 400, 
                elements: [
                    $u.element("text").Label("ФИО, тел, email"),

                    $u.element("dfrom").Label("Дата с").AsDate(),  //.extend({ value: new Date(2012, 6, 8) }).RangeDates(minDate),
                    $u.element("dto").Label("По").AsDate(),        //.extend({ date: date.addDays(7) }).RangeDates(minDate),

                    $u.element("domain").Label("Партнер").AsSelect(domains.db.namesUrl),
                    //$.element("os").Label("Операц.система").AsSelect(clients.osTypes),
                    //$.element("groupId").Label("Группа контакта").AsSelect(groups.db.getNamesUrl(groups.GroupType.ContactType)),
                    //$.element("typeId").Label("Тип клиента").AsSelect(groups.db.getNamesUrl(groups.GroupType.ClientType)),
                    //$.element("cityId").Label("Город").AsSelect(groups.db.getNamesUrl(groups.GroupType.City)),
                    //$.element("toolId").Label("Муз.инструменты").AsSelect(groups.db.getNamesUrl(groups.GroupType.Tool)),
                    //$.element("styleId").Label("Муз.стиль").AsSelect(groups.db.getNamesUrl(groups.GroupType.MusicStyle)),

                    super.$config(),
                ],
            });

            return formCfg;
        }
    }

}