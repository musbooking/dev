module promo {

    export class HotEditView extends $u.View {

        form = new $u.RefForm();

        $config() {
            super.$config();

            let formCfg = this.form.config().extend({
                //width: 400,
                elements: [
                    $u.element("name").Label("Имя"),
                    $u.element("discount").Label("Скидка, %").Error("Введите скидку в % или руб"),
                    $u.element("discountSum").Label("Скидка, руб").Error("Введите скидку в % или руб"),
                    //$.element("eqDiscount").Label("Скидка,% оборуд."),
                    //$.element("dayKinds").Label("Дни").AsMultiSelect(dayKinds),
                    //$.element("groupKinds").Label("Группа").AsMultiSelect(orders.orderGroupKinds),
                    //$.element("clientDiscountKind").Label("Cкидка клиента комн").AsSelect(discountKinds),
                    //$.element("eqClientDiscountKind").Label("Cкидка клиента оборуд.").AsSelect(discountKinds),
                    $u.element("dateFrom").Label("С даты").AsDate(),
                    $u.element("dateTo").Label("По дату").AsDate(),
                    $u.element("hours").Label("Часы").Tooltip("Пример: 6-18,20-24").Error("Часы не разрешены в комнате"),
                    $u.template("Часы горящей репетиции должны соответстовать временным промежуткам выбранных комнат").Css("it-error"),
                    //$.element("isFixHours").Label("Фикс.часы").AsCheckbox().Tooltip("Фиксировать указанные часы для брони"),
                    //$.element("isOverride").Label("Перекрывает").AsCheckbox().Tooltip("Если выбрано, то условия перекрывают все остальное"),
                    //$.element("isToday").Label("Сегодня").AsCheckbox(),
                    //$.element("isAction").Label("Акция").AsCheckbox(),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    //$.element("allowBaseIds").Label("Разрешенные базы", 0, "top").AsMultiSelect(bases.db.namesUrl),
                    $u.element("allowRoomIds").Label("Разрешенные комнаты", "top").AsMultiSelect(rooms.db.names(undefined, true)),
                    $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()),
                    $u.element("range1").Label("С..").AsInt().Tooltip("Диапазон С"),
                    $u.element("range2").Label("..По").AsInt().Tooltip("Диапазон По"),


                    //$.element("isIgnoreEquipment").Label("0 за обор."),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    {},
                ],
                rules: {
                    $obj: x => {
                        let perc = parseInt(x.discount);
                        let sum = parseInt(x.discountSum);
                        return perc && !sum || !perc && sum || It.UI.w.error("Не указана скидка или указаны обе скидки");
                    },
                    // hours: (h,x) => this.checkHours(h,x), отказались согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/19136/
                },
            });

            return formCfg;
        }

        private checkHours(hours, x) {
            let res = rooms.db.allowHours(x.allowRoomIds, hours);
            if (!res) return true;

            It.UI.w.error(res);
            return false;
        }


    }


}