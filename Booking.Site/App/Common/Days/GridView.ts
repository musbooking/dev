module days {

    export class GridView extends $u.View {
         
        private grid = new $u.RefGrid();

        $config() {
            super.$config(); 

            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("date").Header("Дата").AsDate().Sort().Edit(),
                    $u.column("isWeekend").Header("Выходной").AsCheckbox().Sort().Edit(),
                    $u.column("description").Header("Описание", -1).Edit(),
                    //g.column("id").AsInt().Header("(Код)", 50).Sort(), 
                ],
                scheme: {
                    //id: -1,
                    date: new Date(),
                },

                data: db.list(),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = {
                rows: [
                    $u.panelbar(
                        this.grid.btnAdd(),
                        this.grid.btnDel(),
                        this.grid.btnRefresh(() => this.refresh()),
                        {}),
                    gridCfg,
                ],
            };
            return view;
        }

        //activate(query, first: boolean) {
        //    super.activate(query, first);
        //    if (!first) this.grid.refresh();
        //}

        private refresh() {
            let list = db.list();
            this.grid.refresh(list);
        }

    }

 
}