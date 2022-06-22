module templates {

    export class EditView extends $u.View {

        private form = new $u.RefForm();

        $config() {

            let form = this.form.config().Labels(120).extend({
                elements: [
                    $u.header("Список шаблонов рассылок",
                        $u.button("Сохранить").Click(() => this.save()),
                    ),
                    $u.element("key").Label("Тип").AsSelect(kinds).Require(),
                    $u.element("name").Label("Название").Require(),
                    $u.element("description").Label("Описание").AsTextArea(100),

                    $u.element("subject").Label("Заголовок"),
                    $u.element("email").Label("Email (фикс)"),
                    $u.element("sms").Label("Шаблон СМС").AsTextArea(150),
                    $u.template("Шаблон письма"),
                    $u.element("text").Label("Шаблон письма").AsHtml().Size(-1, 600),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    {},
                ]
            });

            return form;
        }


        $reload(id) {
            super.$reload(id);
            let vals = db.get(id);
            vals.text = vals.text || '';
            this.form.setValues(vals);
        }

        private save() {
            if (!this.form.validate()) return;
            this.form.save(db.saveUrl(this.objectId), false);
            webix.message("Данные сохранены на сервере");
        }

    }


}