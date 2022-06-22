module order_rules {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        private form = new $u.RefForm()

        $config() {
            super.$config();

            let grid = this.grid.config().extend({
                tooltip: true,
                columns: [
                    $u.column().AsOrderMarker(), 
                    $u.column("name").Header("Название", -1).Sort().Filter(),
                    $u.column("description").Header("Описание", -2).Sort().Filter(),
                    $u.column("baseId").Header("База", 140).AsSelect(bases.db.names()).Sort().Filter(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    id: -1,
                    name: "новое правило",
                    index: 10000,
                },

                //url: db.listUrl,
                save: db.getSaveCfg(true),
            }).DragOrder((start, ids) => db.reindex(start, ids), true);

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.refresh()),
                    {},
                    $u.button("Сохранить").Click(() => this.form.updateBindings()),
                ),

                $u.cols(
                    grid,
                    this.configEditForm().Size(350),
                ),
            );
            return view;
        }

        private configEditForm() {
            let css = { background: '#ebedf2' };

            let form = this.form.config().extend({
                //gravity: 0.5,
                elements: [
                    $u.element("name").Label("Название").Require(),
                    $u.element("baseId").Label("База").AsSelect(bases.db.names(true)),
                    $u.element("sources").Label("Источники").AsMultiSelect(orders.sourceTypes),

                    $u.label("ЕСЛИ бронирование").Css(css),
                    $u.element("ifKind").Label("Условие").AsSelect(ifkinds).Require(),
                    $u.element("ifHours").Label("Часов").AsInt(),
                    $u.label("ТО отмена доступна").Css(css),
                    $u.element("thenKind").Label("Отмена").AsSelect(thenkinds).Require(),
                    $u.element("thenHours").Label("Часов").AsInt(),

                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    $u.element("isDefault").Label("По умолчанию").AsCheckbox().Visible(system.context.isSuper),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    {},
                ]
            });

            return form;
        }


        $init() {
            super.$init();
            this.form.bind(this.grid);
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }

        refresh() {
            var data = db.list();
            this.grid.refresh(data);
        }
    }


}