module promo {

    export class EditActView extends $u.View {

        form = new $u.RefForm();

        $config() {
            super.$config();

            let formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("name").Label("Имя"),
                    $u.element("discount").Label("Скидка, %"),
                    $u.element("discountSum").Label("Скидка, руб"),
                    $u.element("eqDiscount").Label("Скидка,% оборуд."),
                    $u.element("clientDiscountKind").Label("Скидка клиента").AsSelect(app.discountKinds),
                    //$.element("dayKinds").Label("Дни").AsMultiSelect(data.dayKinds),
                    //$.element("groupKinds").Label("Группа").AsMultiSelect(orders.data.orderGroupKinds),
                    //$.element("hours").Label("Часы").Tooltip("Пример: 6-18,20-24"),
                    //$.element("isToday").Label("Сегодня").AsCheckbox(),
                    $u.element("isArchive").Label("Блокировать").AsCheckbox(),
                    //$.element("isAction").Label("Акция").AsCheckbox(),
                    //$.element("dateFrom").Label("Начало").AsDate(),
                    //$.element("dateTo").Label("Окончание").AsDate(),
                    //$.element("isIgnoreEquipment").Label("0 за обор."),
                    $u.element("description").Label("Описание").AsTextArea(200),
                    {},
                ],
            });

            return formCfg;
        }


    }


}