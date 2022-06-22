module promo {

    export class FilterForm { //extends $.View {

        form = new $.RefForm();

        config() {
            //super.$config();

            const dhelp = "Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»";
            const chelp = "Укажите будет ли распространяться скидка из карточки клиента на комнату или позиции у созданного условия. Например, у клиента 10% скидка на все услуги, но при бронировании комнаты попадающей под созданное условие скидка на комнату и оборудование не будет учитываться если выбрать значение «Блокируем» в обоих полях";
            const ahelp = "Выберите на каком объекте или в каких комнатах будут действовать параметры этого условия. Поля взаимоисключающие, это значит, что заполнено должно быть только одно (либо комнаты, либо базы).";
            const help4 = "Выберете календарный период действия параметров условия";

            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $.element("name").Label("Имя").Tooltip("Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»"),
                    $.element("discount").Label("Скидка, %").Tooltip(dhelp),
                    $.element("discountSum").Label("Скидка, руб").Tooltip(dhelp),
                    $.element("eqDiscount").Label("Скидка,% оборуд.").Tooltip(dhelp),
                    $.element("dayKinds").Label("Дни").AsMultiSelect(app.dayKinds).Tooltip("Выберите по каким дням будет действовать это условие или скидка"),
                    //$.element("groupKinds").Label("Группа").AsMultiSelect(orders.orderGroupKinds).Tooltip("Выберите на какие статусы групп будет распространяться это условие или скидка"),
                    $.element("clientDiscountKind").Label("Cкидка клиента комн").AsSelect(app.discountKinds).Tooltip(chelp),
                    $.element("eqClientDiscountKind").Label("Cкидка клиента оборуд.").AsSelect(app.discountKinds).Tooltip(chelp),
                    $.element("hours").Label("Часы").Tooltip("Пример: 6-18,20-24").Tooltip("Введите период действия этого условия или скидки в течении дня в формате «12-18». Например, если вы создаете условие для бронирование сольных репетиций заранее, то указав значение «9-12,21-24» условие будет работать с 9 до 12 утра и с 9 до 12 вечера"),
                    //$.element("isFixHours").Label("Фикс.часы").AsCheckbox().Tooltip("Фиксировать указанные часы для брони"),
                    $.element("isOverride").Label("Перекрывает").AsCheckbox().Tooltip("Выставите эту галочку если у вас несколько условий со схожими параметрами, и вы хотите, чтобы это условие было в приоритете"),
                    $.element("isToday").Label("Сегодня").AsCheckbox().Tooltip("При выставлении этой галочки параметры условия будут работать только день в день (с 00:01 сегодняшней даты)"),
                    //$.element("isAction").Label("Акция").AsCheckbox(),
                    $.element("isArchive").Label("Архив").AsCheckbox().Tooltip("Выставив этот параметр условие прекратит свое действие, но останется доступным для редактирования"),
                    $.element("allowBaseIds").Label("Разрешенные базы", "top").AsMultiSelect(bases.db.namesUrl).Tooltip(ahelp),
                    $.element("allowRoomIds").Label("Или разрешенные комнаты", "top").AsMultiSelect(rooms.db.names(undefined, true)).Tooltip(ahelp),
                    $.element("dateFrom").Label("Начало").AsDate().Tooltip(help4),
                    $.element("dateTo").Label("Окончание").AsDate().Tooltip(help4),
                    //$.element("isIgnoreEquipment").Label("0 за обор."),
                    $.element("description").Label("Описание").AsTextArea(100).Tooltip(""),
                    {},
                ],
            });

            return formCfg;
        }


    }


}