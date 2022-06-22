module users {

    export class CreateView extends $u.PopupView {

        $config() {

            let formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("login").Label("Логин").Require(),
                    $u.element("password").Label("Пароль").AsPassword().Require(),
                    $u.element("fio").Label("ФИО").AsTextArea(70),
                    $u.element("email").Label("e-mail"),

                    $u.element("roles").Label("Роли").AsMultiSelect(roles.db.names()),
                    $u.element("baseIds").Label("Базы").AsMultiSelect(bases.db.names()),

                    super.$config(),
                ],
            });

            return formCfg;
        }

        $action() {
            this.hide();
            return super.$action();
        }
    }

}