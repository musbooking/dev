module equipments {
      
    export class TotalsView extends $u.View {

        private form = new $u.RefForm();
        private grid = new $u.RefGrid();

        $config() {
            super.$config();

            let formCfg = {
                view: "form",
                id: this.form.id,
                borderless: true,

                cols: [
                    $u.element("base").Label("База", null, 50).Size(400).AsSelect(bases.db.names(true)),
                    $u.icon("refresh").Click( () => this.refresh()).Tooltip( "Пересчитать данные и обновить отчет"),
                    {},
                ]
            };

            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("groupId").AsSelect(groups.db.names(groups.GroupType.Equipment)).Header("Тип", 150).Sort(),
                    $u.column("name").Header("Название", -1).Sort(),
                    $u.column("price").Header("Цена").AsInt().Sort(),
                    $u.column("count").Header("Всего").AsInt().Sort(),
                    $u.column("used").Header("Использ").AsInt().Sort(),
                    $u.column("balance").Header("Остаток").AsInt().Sort(),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(),
                ],
            });

            let view = {
                rows: [
                    formCfg,
                    gridCfg,
                ],
            };
            return view;
        }

        private refresh() {
            let args = this.form.values();
            let list = db.totals(args.base);
            this.grid.refresh(list);
            webix.message("Отчет обновлен");
        }

    }


}