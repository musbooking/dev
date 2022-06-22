module tarifs {

    export class FormView extends $u.View {
        form = new $u.RefForm();

        $config() {

            let cfg = this.form.config().Labels(120).extend({
                elements: [
                    $u.header("Редактор тарифа"),
                    $u.element("name").Label("Название","top").Require(),
                    $u.element("description").Label("Описание").AsTextArea(100),

                    $u.element("price").Label("Фикс.цена").AsInt().Tooltip("Фиксированная цена"),
                    $u.element("price1").Label("Цена 1 бронь").AsInt().Tooltip("Цена за 1 бронирование"),
                    $u.element("commission").Label("% ком").AsInt().Tooltip("% комиссии за резервирование"),
                    $u.element("payCommission").Label("% ком опл.").AsInt().Tooltip("% комиссии за оплаченный"),
                    $u.element("tarifIds").Label("Подтарифы", "top").AsMultiSelect(db.names()).Tooltip("Вложенные тарифы"),
                    $u.element("sphereIds").Label("Сферы", "top").AsMultiSelect(spheres.db.names()).Tooltip("Вложенные тарифы"),
                    $u.element("destKind").Label("Назначение").AsSelect(equipments.destKinds),

                    $u.element("isArchive").Label("Архив (скрыть)").AsCheckbox(true),

                    {},
                ]
            });

            return cfg;
        }

    }


}