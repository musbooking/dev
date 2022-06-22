module discounts {

    export class GridView extends $u.View {
         
        private grid = new $u.RefGrid();

        $config() {
            super.$config(); 

            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                    $u.column("orders").Header("Заказов").AsInt().Sort().Edit(),
                    $u.column("discount").Header("% скидки").AsInt().Sort().Edit(),
                ],
                scheme: {
                    //id: -1,
                    //date: new Date(),
                },

                //data: db.loadItems(),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = {
                rows: [
                    $u.panelbar(
                        this.grid.btnAdd(),
                        this.grid.btnDel(),
                        this.grid.btnRefresh(() => this.refresh()),
                        {},
                        $u.label("Список скидок, которые автоматически назначаются клиентам после оплаты")
                        ),
                    gridCfg,
                ],
            };
            return view;
        }


        $activate(args) {
            super.$activate(args);
            this.refresh();
        }

        private refresh() {
            let list = db.list();
            this.grid.refresh(list);
        }

    }

 
}