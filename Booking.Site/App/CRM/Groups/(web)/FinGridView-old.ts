module groups {


    export class FinGridView___old extends $u.View {

        //constructor(private settings, private header: string) {
        //    super();
        //}

        private grid = new $u.RefGrid();

        $config() {
            super.$config();
            let me = this;
            let grid = this.grid.config().extend({
                columns: [
                    //$u.column().AsOrderMarker(),
                    $u.column("fin").Header("Код").AsNumber().Edit().Sort().Filter(),
                    $u.column("index").Header("Кф").AsNumber().Edit().Sort().Filter(),
                    $u.column("name").Header("Группа", 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                    name: "фин.группа",
                    type: GroupType.Fin,
                    index: 0,
                },
                save: db.getSaveCfg(true),

            }).Editable().DragOrder((start, ids) => db.reindex(start, ids), true); 
             

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.refresh()),
                    {}),
                grid
            );
            return view;
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }

        private refresh() {
            let rows = db.list({ type: GroupType.Fin });
            this.grid.refresh(rows);
        }


    }

}