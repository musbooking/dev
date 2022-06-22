module promo {

    export class ActGridView extends $u.View {

        private grid = new $u.RefGrid();
        private formview: EditForm = new EditForm();

        $config() {
            super.$config();
            
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Название", 100).Sort().Error("Длина не более 10 символов").Filter(),
                    $u.column("discount").Header("Скидка", 60).AsInt().Sort().Filter(),
                    $u.column("description").Header("Описание", -1).Filter(),
                    //$.column("isIgnoreEquipment").Header("0-Оборуд").AsCheckbox().Sort().Edit(),
                    //$.column("isAction").Header("Акция").AsCheckbox().Sort().Edit(),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(), 
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    type: PromoKind.Action,
                },
                rules: {
                    //"username": webix.rules.isNotEmpty,
                    "name": function (value) { return value && value.length <=10; }
                },

                //url: db.getItemsUrl(PromoKind.Action),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.toolbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh( _=> this.refresh()),
                    {},
                    $u.icon("save").Click(_ => this.formview.form.updateBindings())
                ),
                $u.cols(
                    gridCfg,
                    $u.splitter(),
                    this.formview.config()
                )
            );
            return view;
        }

        $init() {
            super.$init();
            this.formview.form.bind(this.grid);
        }

        $activate(args) {
            super.$activate(args);
            if (this.first) this.refresh();
        }

        private refresh() {
            let list = db.getItems(PromoKind.Action);
            this.grid.refresh(list);
        }
    }


}