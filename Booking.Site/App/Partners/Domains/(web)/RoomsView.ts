module domains {

    export class RoomsView extends $u.View {

        grid = new $u.RefGrid();

        $config() {
            super.$config();



            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("order").Header("⟠", 35).Sort().Edit().Tooltip("Сортировка в календаре"),
                    $u.column("name").Header("Название", 200).Sort().Filter(), //.Template($u.getViewLink("rooms", "#name#")),
                    $u.column("base").Header("База", 150).Sort().Filter(),
                    //$u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 150).Sort().Filter(),
                    //$.column("name").Header("Название", 200).Sort().Filter().Template("<a href='{common.href}/rooms/edit/?oid=#id#'>#name#</a>"),
                    //$u.column("raider").Header("Райдер", -1).Filter(),
                    $u.column("square").Header("Площадь").AsInt().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    //$u.column("color").Header("Цвет").AsColor().Edit().Size(30).Sort(),
                    $u.column("allowMobile").Header("Моб").AsCheckboxReadly().Sort(),
                    //$u.column("shareId").AsSelect(db.names()).Header("Общая комната", 150).Sort().Filter(),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(), 
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    color: "#f89623",
                },
                type: {
                    href: "#!",
                },

                //url: db.itemsUrl,
                save: db.getSaveCfg(true),
            }).Editable();

            let view = {
                rows: [
                    $u.panelbar(
                        //this.grid.btnAdd(),
                        //this.grid.btnDel(),
                        this.grid.btnRefresh(_ => this.reload('')),
                        //this.grid.btnSave,
                        {}),
                    gridCfg,
                ],
            };
            return view;
        }

        public reload(domain: guid) {
            let items = rooms.db.list({domain: domain});
            this.grid.refresh(items);
        }

    }

}