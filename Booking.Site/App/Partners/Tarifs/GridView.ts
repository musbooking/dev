module tarifs {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        private form = create.form();

        $config() {
            super.$config();

            let grid = this.grid.config().extend({
                columns: [
                    $u.column("hasTarifs").Header("Подтариф").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Тариф", -1).Sort(),
                    $u.column("description").Header("Описание", -2).Sort(),
                    $u.column("price").Header("Фикс.цена").AsInt().Sort().Tooltip("Фиксированная цена"),
                    $u.column("destKind").Header("Назначение", 100).AsSelect(equipments.destKinds),
                    $u.column("isPayment").Header("Опл").AsCheckboxReadly().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    name: "новый тариф",
                    price: 0,
                    commission: 0,
                    months: 0,
                },

                data: db.list(),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(() => this.refresh()),
                    {},
                    $u.icon("save").Click(() => this.form.form.updateBindings()).Tooltip($u.loc.Tooltips.Save),
                ),
                $u.cols(
                    grid,
                    $u.splitter(),
                    this.form.$config().Size(300),
                ),
            );
            return view;
        }


        $init() {
            super.$init();
            this.form.form.bind(this.grid);
        }


        private refresh() {
            let list = db.list();
            this.grid.refresh(list);
        }

    }


}