module groups {

   /**
    * добавил грид с формой редактирования, но оказалось никому не нужной
    */
    export class FormGridView extends $u.View {

        constructor(private settings, private header: string) {
            super();
        }

        private grid = new $u.RefGrid();
        private form = new EditForm(this.settings.type);

        $config() {
            super.$config();

            let grid = this.grid.config().extend({
                columns: [
                    $u.column().AsOrderMarker(),
                    $u.column("domain").Header("Партнер", 180).Sort().Filter().Visible(this.settings.viewDomain),
                    $u.column("name").Header(this.header, 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                    name: "новый элемент",
                    type: this.settings.type,
                    order: 1000,
                },
                save: db.getSaveCfg(true),
            }).Editable().DragOrder((start, ids) => db.reindex(start, ids), true); 

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.refresh()),
                    {},
                    $u.button("Сохранить").Click(() => this.form.form.updateBindings()),
                ),
                $u.cols(
                    grid,
                    this.form.config().Size(350)
                )
            );
            return view;
        }

        $init() {
            super.$init();
            this.form.form.bind(this.grid);
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }

        private refresh() {
            let rows = db.list(this.settings);
            this.grid.refresh(rows);
        }


    }

}