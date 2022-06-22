module access {

    export class LoginView extends $u.View {

        private form = new $u.RefForm();

        $config(): any {
            super.$config();

            //if (Context) lastLogin = Context.login;

            let me = this;

            let help = '<div>Для получения доступа к системе бронирования обратитесь к администратору портала -&nbsp;<a href="mailto: partner@musbooking.com" target="_blank" rel="nofollow">partner@musbooking.com</a>&nbsp;или отправьте запрос на регистрацию, заполнив форму по адресу&nbsp;<a href="http://musbooking.com/zapros/" target="_blank" rel="nofollow">http://musbooking.com/zapros/</a></div>';
            let template = $u.template(help).Autoheight().Css("it-warning111");
            let header = "Вход в " + "MUSBOOKING".link("http://musbooking.com/", { target: "_blank" });


            let formCfg = this.form.config().extend({
                width: 300,
                padding: 10,
                borderless: false,
                elements:
                [
                    $u.cols(
                        $u.label(header.tag("div", { class: "it-login-header" })),
                        { gravity: 0.1 },
                        $u.icon("question").Popup(template),
                        ).Autoheight().Css("it-login-header"),

                    { height: 20 },
                    $u.template('img/logo-2018.png'.img({ class: 'it-login-img' }).link("./")),

                    $u.cols(
                        $u.rows(
                            $u.element("login").Label('Логин').Value(It.Web.auth.logins.last).Require(),
                            { height: 7 },
                            $u.element("password").Label('Пароль').Type('password').Require(),
                            { height: 20 },
                        ),
                    ),

                    $u.cols(
                        {},
                        $u.button("Войти").Type("form").Click(() => me.login()).Hotkey("enter"),
                        $u.button("Закрыть").Click(It.Web.goReturnUrl),
                        //$.button("Помощь").Popup(template),
                    ),
                    //template,
                ],
                elementsConfig: {
                    //labelPosition: "top",
                }
            });

            return $u.viewCenter(formCfg);
        }

        private login() {

            if (!this.form.validate()) return;

            //let res = this.form.post("./api/auth/login");
            let vals = this.form.values();
            let res = auth_logins.db.login(vals);

            if (!res) return;

            // добавляем токен в хранилище
            It.Web.auth.tokens.save(res.token);

            // запоминаем логин
            It.Web.auth.logins.save(vals.login);

            It.Web.goReturnUrl();
        }
    }
}