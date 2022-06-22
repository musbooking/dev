module favorites {

    export class GridView extends $u.PopupView {
        private grid = new $u.RefGrid();

        $config() {
            let grid = this.grid.config().extend({
                //fixedRowHeight: false,
                columns: [
                    $u.column("domain").Header("Партнер", -1).Sort(),
                    $u.column("base").Header("База", -1).Sort(),
                    $u.column("room").Header("Комната", -1).Sort(),
                    $u.column("dateAdded").Header("Добавлено").AsDate(webix.i18n.fullDateFormatStr).Sort(),
                    $u.column("dateRemoved").Header("Удалено").AsDate(webix.i18n.fullDateFormatStr).Sort(),
                    $u.column("isArchive").Header(It.symbols.Cross).AsCheckboxReadly().Sort(),
                ],
            });
            return grid;
        } 

        $reload(clientid: guid) {
            let data = db.list({ client: clientid });
            this.grid.refresh(data);
        }

    }

}