module rules {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();

        $config() {
            super.$config();

            let toolbar = $u.panelbar(
                this.grid.btnAdd(),
                this.grid.btnDel(),
                this.grid.btnRefresh(() => this.refresh()),
                {}
            );

            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("ip").Header("IP").Sort().Edit(),
                    $u.column("description").Header("Описание", -1).Edit(),
                    $u.column("isDisabled").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    //id: -1,
                },

                data: db.list(),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                toolbar,
                gridCfg
            );

            return view;
        }

        //activate(args) {
        //    super.activate(args);
        //    this.refresh();
        //}

        private refresh() {
            let list = db.list();
            this.grid.refresh(list);
        }

    }


}