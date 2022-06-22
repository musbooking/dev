module domains {

    export class EditForm {

        form = new $u.RefForm()

        config() {

            let lw = 100;

            let formCfg = this.form.config().extend({
                //gravity: 0.5,
                elements: [

                    $u.element("name").Label("Зона доступа"),
                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)),
                    $u.element("email").Label("E-mail партнера").AsTextArea(70).Tooltip('Список почтовых адресов, разделенных ;'),
                    $u.element("phone").Label("Телефоны партнера").AsTextArea(70).Tooltip('Список телефонов, разделенных ;'),
                    //$.column("name").Header("Зона доступа", -1).Template("<a href='{common.href}/domains/edit/?oid=#id#'>#name#</a>"),
                    //$u.element("allowShare").Label("Главная").AsSwitch(),
                    $u.element("isArchive").Label("Архивная").AsSwitch(),
                    $u.element("createDate").Label("Создано").AsDate().Readonly(),
                    $u.element("initDate").Label("Инициализирована").AsDate().Readonly(),
                    $u.element("tarifId").Label("Текущий тариф", "top").AsSelect(tarifs.db.names()),
                    $u.element("period").Label("Граница даты", "top").AsSelect(periods).Require(),
                    $u.element("isPayment").Label("Только для оплат").AsSwitch(),
                    $u.element("terminal").Label("ИД Терминала"),
                    $u.element("inn").Label("ИНН"),
                    $u.element("status").Label("Статус").AsSelect(statuses),

                    $u.element("limitDate").Label("Срок").AsDate(),
                    $u.element("tarifIds").Label("Доступные тарифы", "top").AsMultiSelect(tarifs.db.names()),
                    $u.element("spheres").Label("Сферы", "top").AsTextArea(80).Disable(), //.AsMultiSelect(spheres.db.names()),
                    $u.element("paysTotal").Label("Оплаты").Readonly(),
                    $u.element("owners").Label("Ответственные").AsTextArea(80).Disable(),
                    $u.element("description").Label("Описание").AsTextArea(80),

                    //$.element("baseId").Label("База", lw, "top").AsSelect(bases.db.namesUrl).Visible(this.full),
                    //$.element("roomId").Label("Комната", lw, "top").AsSelect(rooms.db.names(undefined, true)).Visible(this.full),
                    //$.element("timeFrom").Label("С, час", lw).AsCounter(0, 24).Require().Readonly(), //.Format(app.meta.timePattern).Validate(app.meta.timeValidator),
                    //$.element("timeTo").Label("По, час", lw).AsCounter(0, 24).Require().Readonly(), //.Format(app.meta.timePattern).Validate(app.meta.timeValidator),
                    //$.element("workingFPrice").Label("Раб.Перв", lw),
                    //$.element("workingPrice").Label("Рабочие", lw).Require(),
                    //$.element("workingLPrice").Label("Раб.Посл", lw),
                    //$.element("weekendPrice").Label("Выходные", lw).Require(),
                    //$.element("promoId").Label("Условие", lw, "top").AsSelect(promos),
                    //$.element("isArchive").Label("Архив", lw).AsCheckbox(),
                    
                    {},
                ],
            });

            return formCfg;
        }

    }

}