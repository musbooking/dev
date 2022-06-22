module clients {

    export class CreateView extends $u.PopupView {

        clientObject: any;

        $config() {

            let formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.label("Создание нового клиента").Css("it-header"),
                    $u.element("lastName").Label("Фамилия").Require(),
                    $u.element("firstName").Label("Имя").Require(),
                    $u.element("surName").Label("Отчество"),
                    $u.element("email").Label("Почта"),
                    $u.element("phone").Label("Телефон                  +7").Require(),
                    $u.element("dateBirthday").Label("Дата рождения").AsDate(),

                    // https://hendrix.bitrix24.ru/company/personal/user/180/tasks/task/view/36685/
                    $u.element("music").Label("О себе"),
                    $u.element("typeInfo").Label("Тип").Tooltip("Операционная система. Модель устройства"),
                    $u.element("gender").Label("Пол").AsSelect(clients.genders),
                    $u.element("types").Label("Виды деятельности").AsMultiSelect(groups.db.names(groups.GroupType.ActivityType)),
                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)),
                    $u.element("tools").Label("Муз.инструмент").AsMultiSelect(groups.db.names(groups.GroupType.Tool)),
                    $u.element("styles").Label("Стиль танца").AsMultiSelect(groups.db.names(groups.GroupType.MusicStyle)),
                    $u.element("spheres").Label("Сферы деят.").AsMultiSelect(spheres.db.names()),
                    $u.element("genres").Label("Муз. жанр").AsMultiSelect(groups.db.names(groups.GroupType.Genre)),
                    $u.element("sourceId").Label("Уровень навыков").AsSelect(groups.db.names(groups.GroupType.Skill)),
                    $u.element("vkUrl").Label("Страница в ВК"),
                    $u.element("sourceUrl").Label("Instagram"),

                    //$u.element("os").Label("Операц.система").AsSelect(clients.osTypes),
                    ////$.element("groupId").Label("Группа контакта").AsSelect(groups.db.getNames(groups.GroupType.ContactType)),
                    //$u.element("groupIds").Label("Группы клиента").AsMultiSelect(groups.db.names(groups.GroupType.ContactType, true)),
                    //$u.element("typeId").Label("Тип клиента").AsSelect(groups.db.names(groups.GroupType.ClientType)),
                    //$u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)),
                    //$u.element("toolId").Label("Муз.инструменты").AsSelect(groups.db.names(groups.GroupType.Tool)),
                    //$u.element("styleId").Label("Муз.стиль").AsSelect(groups.db.names(groups.GroupType.MusicStyle)),

                    super.$config("Создать"),
                ],
            });

            return formCfg;
        }

        protected invokeAction(vals) {

            this.clientObject = db.save(vals);

            super.invokeAction(vals)
            this.$clear();
            this.hide();
            webix.message("Клиент успешно создан");

        }
    }

}