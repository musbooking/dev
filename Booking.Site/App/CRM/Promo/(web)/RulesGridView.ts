module promo {

    export class RulesGridView extends $u.View {

        private grid = new $u.RefGrid();
        private formview = new EditForm();

        $config() {
            super.$config();
            
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Название", 100).Sort().Error("Длина не более 100 символов").Filter(),
                    $u.column("discount").Header("Скидка", 60).AsInt().Sort().Filter(),
                    $u.column("description").Header("Описание", -1).Filter(),
                    //$.column("isIgnoreEquipment").Header("0-Оборуд").AsCheckbox().Sort().Edit(),
                    $u.column("isAction").Header("Акция").AsCheckboxReadly().Sort(),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(), 
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    type: PromoKind.Rules,

                    $init: function (obj) {
                        obj.dateFrom = parseDate(obj.dateFrom); 
                        obj.dateTo = parseDate(obj.dateTo); 
                        //logic.getStateCss(obj);
                    },
                },
                rules: {
                    //"username": webix.rules.isNotEmpty,
                    name: value => value && value.length <100, 
                },

                //url: db.getItemsUrl(PromoKind.Rules),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.toolbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh( _ => this.refresh()),
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
            let list = db.getItems(PromoKind.Rules);
            this.grid.refresh(list);
        }
    }


}