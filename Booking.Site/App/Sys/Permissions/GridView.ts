module permissions {

    export class GridView extends $u.View {

        grid = new $u.RefTree();
        form = new $u.RefForm();

        private setGroup(obj) {
            if (!obj || !obj.operation) return;
            let oper = auth.opers.findById(obj.operation);
            if (!oper) return;
            obj.group = oper.group;
            obj.description = oper.description;
        }

        $config() {
            super.$config();
            let me = this;
            let allowEditOpers = false; //config.allowEditOperations;

            let gridCfg = this.grid.configTreeTable().extend({
                columns: [
                    //$.column("baseId").AsSelect(models.bases.namesUrl).Header("База", 150).Sort().Edit().Filter(),
                    //$.column("group").Header("Группа2", 100).Template(obj => this.getGroup(obj)).Sort(),
                    $u.column("group").Header("Операция", -2)
                        .Template((obj, common) => {
                            if (obj.$group) return common.treetable(obj, common) + obj.group;
                            return "          " + auth.opers.findById(obj.operation, {}).value;
                        }),
                    //.Template("{common.treetable()} #group#"),

                    $u.column("operation").Header("Операция", 100).Sort().Filter(), //.AsSelect(config.operations),
                    $u.column("roles").Header("Роли", -1).Sort().Edit().Filter(),
                    $u.column("description").Header("Описание", -1),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(),
                ],
                scheme: {
                    id: -1,
                    //$group: "#group#",
                    //$sort: "#group#",
                    $group: {
                        by: "group",
                        map: {
                            votes: ["votes", "sum"],
                            group: ["group"]
                        }
                    },
                    //$sort: { by: "votes", as: "int", dir: "desc" },

                    //$group: {
                    //    by: obj => me.getGroup(obj)
                    //}
                    $init: obj => me.setGroup(obj)
                },

                //data: db.list(),
                save: db.getSaveCfg(true),
            }).Editable();

            let form = {
                view: "form",
                id: this.form.id,
                borderless: true,
                //width: 500,
                gravity: 0.6,

                elements: [
                    {
                        cols: [
                            $u.button("Сохранить").Click(() => this.save()),
                            //{ view: "button", value: "Закрыть", click: () => this.form.close(), width: 90, },
                            {},
                        ]
                    },
                    $u.element("operation").Label("Операция", "top").AsSelect(auth.opers).Disable(), //!allowEditOpers),
                    $u.element("roles").Label("Роли", "top").AsMultiSelect(roles.db.names()),
                    $u.element("description").Label("Описание").AsTextArea(0).Disable(),
                    {},
                ],
            };

            let view = {
                rows: [
                    $u.toolbar(
                        this.grid.btnAdd().Hidden(!allowEditOpers),
                        this.grid.btnDel().Hidden(!allowEditOpers),
                        //this.grid.btnRefresh().Disable(),
                        $u.button("Инициализировать").Click(() => this.initDomain()),
                        this.grid.btnRefresh(_ => this.refresh()),
                        {}),
                    {
                        cols: [
                            gridCfg,
                            form,
                        ],
                    },
                ],
            };
            return view;
        }

        $init() {
            this.form.bind(this.grid);
            this.refresh();
        }

        private refresh() {
            let items = db.list();
            this.grid.refresh(items);
        }

        private initDomain() {
            let ctx = system.context;
            domains.db.init(ctx.domainId, ctx.isSuper)
            this.refresh()
        }


        private save() {
            this.form.ref.save();
            //let id = this.form.values().id;
            //if (id < 1)
            //    this.form.save(models.permissions.saveUrl(), true);
            //else
            //    this.form.save(models.permissions.saveUrl(id), false);
        }

    }

}