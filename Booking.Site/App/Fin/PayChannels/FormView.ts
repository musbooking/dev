module paychannels {

    export class FormView extends $u.View {

        form = new $u.RefForm();

        $config() {
            super.$config();

            let formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("name").Label("Имя").Require(),
                    //$.element("isPrepay").Label("Предоплата").AsCheckbox().OnChange(v => this.prepay(v)),
                    $u.element("prepayUrl").Label("Ссылка на предоплату", "top"),
                    $u.element("kind").Label("Тип").AsSelect(kinds),
                    $u.element("forfeit1").Label("Штраф мин").AsInt(),
                    $u.element("forfeit2").Label("Штраф макс").AsInt(),
                    $u.element("total1").Label("Итог мин").AsInt(),
                    $u.element("total2").Label("Итог макс").AsInt(),
                    $u.element("sources").Label("Источник").AsMultiSelect(orders.sourceTypes),
                    $u.element("partPc").Label("% от итога").AsInt(),
                    $u.element("isForfeits").Label("Для штрафа").AsCheckbox(),
                    //$.element("isRequest").Label("Только по заявке").AsCheckbox(),
                    //$.element("allowBaseIds").Label("Разрешенные базы", "top").AsMultiSelect(bases.db.namesUrl),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    {},
                ],
            });

            return formCfg;
        }

        private prepay(val) {
            this.form.enable(val, "prepayUrl" );
        }

    }


}