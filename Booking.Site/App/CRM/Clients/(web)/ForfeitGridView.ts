module clients {

    export class ForfeitGridView extends $u.View {

        private grid = new $u.RefGrid();

        $config() {
            let fioLink = $u.getViewLink("clients", "#fio#");

            let toolbar = $u.cols(
                $u.button("Обновить").Click(_ => this.$reload()),
                {},
            );

            let grid = this.grid.config().extend({
                columns: [
                    $u.column("fio").Header("ФИО", -1).Template(fioLink).Sort(),
                    $u.column("isBanned").Header("Бан").AsCheckboxReadly().Sort(),
                    $u.column("forfeit").Header("Штраф").AsInt().Footer().Sort(),
                    $u.column("orders").Header("Броней").AsInt().Footer().Sort(),
                    $u.column("last").Header("Посл.бронь").AsDate().Sort(),
                ],

            }).Footer();

            let cfg = $u.rows(
                toolbar,
                grid,
            );

            return cfg;
        }


        $reload(id?) {
            super.$reload(id);

            let list = db.forfeits();
            this.grid.refresh(list);
        }
        
    }
    
}