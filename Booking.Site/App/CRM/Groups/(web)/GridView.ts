module groups {


    export class GridView extends $u.View {

        constructor(private settings, private header: string) {
            super();
        }

        private grid = new $u.RefGrid();

        $config() {
            super.$config();
            let me = this;

            let allowCrmEdit = system.context.allowCrmEdit()
            let allowRange = this.settings.type == GroupType.OrderOption

            let grid = this.grid.config().extend({
                columns: [
                    $u.column().AsOrderMarker().Visible(allowCrmEdit), 
                    $u.column("domain").Header("Партнер", 180).Sort().Filter().Visible(this.settings.viewDomain),
                    $u.column("name").Header(this.header, 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly(!allowCrmEdit).Sort(),
                    $u.column("isRange").Header("Диапазон").AsCheckboxReadly(!allowCrmEdit).Sort().Visible(allowRange),
                ],
                scheme: {
                    id: -1,
                    name: "новый элемент",
                    type: this.settings.type,
                    index: 1000,
                },
                //url: db.getItemsUrl(this.type, this.domainOnly),
                save: db.getSaveCfg(true),
            })
            if (allowCrmEdit) {
                grid.Editable().DragOrder((start, ids) => db.reindex(start, ids), true)
            }


            if (this.settings.gps) {
                grid.Columns(
                    $u.column("gpsLat").Header("GPS Lat", 100).Sort().Edit(),
                    $u.column("gpsLong").Header("GPS Long", 100).Sort().Edit(),
                );
            }

            //if (this.settings.type == GroupType.Sphere)
            //    grid.Columns(
            //        $.column("values").Header("Статусы", 100).AsSelect(["aaa","bbb","nnn"]).Sort().Edit(),
            //    );


            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd().Visible(allowCrmEdit),
                    this.grid.btnDel().Visible(allowCrmEdit),
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
            let rows = db.list(this.settings);
            this.grid.refresh(rows);
        }


    }

}