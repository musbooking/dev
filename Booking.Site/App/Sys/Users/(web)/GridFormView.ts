module users {

    export class GridFormView extends $u.View {

        private grid = new $u.RefGrid();
        private form = new $u.RefForm();
        private creator: CreateView = new CreateView().onAction( vals => this.create(vals));

        $config() {
            super.$config();

            let grid = this.grid.config().extend({
                columns: [
                    //$.column("baseId").AsSelect(models.bases.namesUrl).Header("База", 150).Sort().Edit().Filter(),
                    $u.column("login").Header("Логин", -1).Sort().Filter(),
                    $u.column("fio").Header("ФИО", -1).Sort().Filter(),
                    $u.column("roles").Header("Роли", -1).Sort().Edit().Filter(),
                    $u.column("isArchive").Header("Блок").Tooltip("Флаг блокировки клиента #login#").AsCheckbox().Sort(),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(),  
                ],
                scheme: {  
                    id: -1,
                },

                data: db.list(),
                save: users.db.getSaveCfg(true),
            }).Editable();

            let form = this.form.config().extend({
                gravity: 0.7,
                elements: [
                    {
                        cols: [
                            $u.button("Сохранить").Click(() => this.save()),
                            //{ view: "button", value: "Закрыть", click: () => this.form.close(), width: 90, },
                            {},
                        ]
                    },
                    //$.element("id").Label("Код").AsLabel(),
                    $u.element("login").Label("Логин").Disable(),
                    //$.element("password").Label("Пароль").AsPassword(),
                    $u.element("fio").Label("ФИО").AsTextArea(70),
                    $u.element("email").Label("e-mail"),
                    $u.element("roles").Label("Роли").AsMultiSelect(roles.db.names()),
                    $u.element("baseIds").Label("Базы", 'top').AsMultiSelect(bases.db.namesUrl),
                    $u.element("domainIds").Label("Партнеры", 'top').AsMultiSelect(domains.db.namesUrl).Visible(system.context.allow(auth.oper.domainsEdit)),
                    $u.element("bitrixNum").Label("Код CRM").Tooltip("Внутренний код в CRM системе"),
                    $u.element("isArchive").Label("Арх").AsCheckbox(),
                    {},
                ],
            });

            let view = $u.rows(
                $u.toolbar(
                    //this.grid.btnAdd(),
                    $u.button("Добавить").Popup(this.creator.$config()),
                    this.grid.btnDel(),
                    //this.grid.btnRefresh(),
                    $u.button("Пароль").Tooltip("Сгенерировать новый пароль для пользователя").Click(_ => this.reset()),
                    {}
                ),
                $u.cols(
                    grid,
                    form
                )
            );
            return view;
        }

        //activate(query, first: boolean) {
        //    super.activate(query, first);
        //    if (!first) this.grid.refresh();
        //}

        $init() {
            this.form.bind(this.grid);
        }

        private create(vals) {
            //users.db.save(vals);
            this.grid.add(vals);
        } 

        private reset() {
            let user = this.grid.getSelectedItem();
            if (!user) return webix.message("Выделите пользователя");
            if (!confirm(`Сгенерировать новый пароль для пользователя ${user.login}?`)) return webix.message("Сброс пароля отменен");
            let res = db.resetUserPassword(user.id);
            webix.alert({ title: "Генерация пароля для " + user.login, text: "Новый пароль: " + res.password });
        }
         
        private save() {
            this.form.updateBindings();
        }

    }

}