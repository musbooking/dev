module groups {

   
    export class FormListView extends $u.View {

        constructor(private settings, private template: string) {
            super();
        }

        private list = new $u.RefList();
        private form = new EditForm(this.settings.type);

        $config() {
            super.$config();

            let list = this.list.config().extend({
                template: this.template,
                type: {
                    href: "#!",
                    height: "auto",
                },
                scheme: {
                    id: -1,
                    name: this.settings.name || "новый элемент",
                    type: this.settings.type,
                },
            }).Editable(db.getSaveCfg(true));

            let view = $u.rows(
                $u.toolbar(
                    this.list.btnAdd(undefined, 0), //{ name: "версия", description: "" }),
                    this.list.btnDel(),
                    this.list.btnRefresh(_ => this.refresh()),
                    {},
                    $u.button("Сохранить").Click(() => this.form.form.updateBindings()),
                ),
                $u.cols(
                    list,
                    this.form.config().Size(350)
                )
            );
            return view;
        }

        $init() {
            super.$init();
            this.form.form.bind(this.list);
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }

        private refresh() {
            let rows = db.list(this.settings);
            this.list.refresh(rows);
        }


    }

}