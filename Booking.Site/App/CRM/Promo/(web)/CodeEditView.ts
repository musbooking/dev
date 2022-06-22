module promo {

    export class CodeEditView extends $u.View {

        form = new $u.RefForm();

        $config() {
            super.$config();

            const ahelp = 'Список разрешенных зон, баз, или комнат';
            const dhelp = "Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»";

            let formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("name").Label("Код").Disable(),
                    $u.element("discount").Label("Скидка, %"),
                    $u.element("discountSum").Label("Скидка, руб").Tooltip(dhelp),
                    $u.element("minHours").Label("Мин.часов").Tooltip("Минимальная длительность бронирования, часов"),
                    $u.element("isToday").Label("Сегодня").AsCheckbox().Tooltip("При выставлении этой галочки параметры условия будут работать только день в день (с 00:01 сегодняшней даты)"),

                    $u.element("allowDomainIds").Label("Разрешенные партнеры", "top").AsMultiSelect(domains.db.namesUrl).Tooltip(ahelp),
                    $u.element("allowBaseIds").Label("Разрешенные базы", "top").AsMultiSelect(bases.db.namesUrl).Tooltip(ahelp),
                    $u.element("allowRoomIds").Label("Или разрешенные комнаты", "top").AsMultiSelect(rooms.db.names(undefined, true)).Tooltip(ahelp),

                    $u.element("maxOrders").Label("Макс.заказов"),
                    $u.element("maxClientOrders").Label("Макс.по клиенту"),
                    $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100),

                    {},
                ],
            });

            return formCfg;
        }


    }


}