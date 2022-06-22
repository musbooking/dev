module messages {

    export class CreateView extends $u.PopupView {

        $config() {

            let formCfg = this.form.config().extend({
                width: 400,
                elements: [ 
                    $u.label("Текст сообщения"),
                    $u.element("text").Label("Текст сообщения").AsHtmlEditor(200).Require(),
                    $u.element("scope").Label("Доступ").AsSelect(scopeTypes).Tooltip("Если не указано, то везде"),
                   super.$config(), 
                ],
            }); 

            return formCfg;
        } 

        $action() {
            this.hide();
            return super.$action();
        }

        $clear() {
            this.form.clear({text: ""});
        }
    }

}