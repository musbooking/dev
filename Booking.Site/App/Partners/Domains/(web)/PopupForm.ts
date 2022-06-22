module domains {


    export class PopupForm extends $u.PopupView {

        $config() {

            let lw = 100;

            let form = this.form.config().extend({
                //gravity: 0.5,
                elements: [

                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)),
                    $u.element("tarifId").Label("Текущий тариф", "top").AsSelect(tarifs.db.names()),
                    $u.element("period").Label("Граница даты", "top").AsSelect(periods),
                    $u.element("isPayment").Label("Только для оплат").AsSelect(app.booleans),
                    $u.element("status").Label("Статус").AsSelect(statuses),

                    $u.element("limitDate").Label("Срок").AsDate(),
                    $u.element("tarifIds").Label("Доступные тарифы", "top").AsMultiSelect(tarifs.db.names()),

                    $u.element("isArchive").Label("Архивная").AsSelect(app.booleans),

                    super.$config("Изменить"),                    
                    {},

                ],
            });

            return form;
        }

    }

}