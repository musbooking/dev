module spheres {

    export class ListView extends $u.View {

        private list = new $u.RefList();
        private form = new EditForm();

        $config() {
            super.$config();

            let list = this.list.config().extend({
                template: 'http->'+It.Web.WebSource.base+ '/html/group-spheres.html',
                type: {
                    href: "#!",
                    height: "auto",
                },
                scheme: {
                    id: -1,
                    name: "",
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
                ),
                //{},
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
            let rows = db.list();
            this.list.refresh(rows);
            //$u.message("okokokoo o <h2> okokokok </h2>okok", '');
            //$u.alert("okokokoo o <h2> okokokok </h2>okok", 'information', '');
        }


    }

}