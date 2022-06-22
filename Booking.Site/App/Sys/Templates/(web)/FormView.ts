module templates {

    export class FormView extends $u.View {
        form = new $u.RefForm();

        $config() {

            let cfg = this.form.config().Labels(120).extend({
                elements: [
                    $u.header("Список шаблонов рассылок"),
                    $u.element("isArchive").Label("(x)").AsCheckbox(),
                    $u.element("key").Label("Тип", 'top').AsSelect(kinds),
                    $u.element("name").Label("Название", 'top').Require(), 
                    $u.element("description").Label("Описание").AsTextArea(100),
                    $u.element("text").Label("Шаблон").AsHtml().Size(200,300),
                    {},
                ]
            });

            return cfg;
        }

    }

   
}