module promo {

    export class CodeGridView extends $u.View {

        private grid = new $u.RefGrid();
        private formview: CodeEditView = new CodeEditView(this);


        $config() {
            super.$config();

            //let ttt = $.getViewLink("orders", "#name#", "#id#", "search");
            let ordersSearchUrl = $u.getLink("#name#", "orders/search-s/#id#?promo=#id#");

            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("ПромоКод", 100).Sort().Error("Длина не более 10 символов")
                        .Template( ordersSearchUrl ),
                    $u.column("discount").Header("Скидка", 60).AsInt().Sort(),
                    $u.column("maxOrders").Header("Заказы", 60).AsInt().Sort(),
                    $u.column("maxClientOrders").Header("Клиенты", 62).AsInt().Sort(),
                    $u.column("description").Header("Описание", -1),
                ],
                scheme: {
                    id: -1,
                    name: "",
                    type: PromoKind.Number,
                },
                rules: {
                    //"username": webix.rules.isNotEmpty,
                    //"name": function (value) { return value && value.length <=10; }
                },

                //url: db.numItemsUrl,
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_=>this.refresh()),
                    {},
                    $u.icon("save").Click(_ => this.formview.form.updateBindings())
                ),
                $u.cols(
                    gridCfg,
                    $u.splitter(),
                    this.formview.$config()
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
            let list = db.numItems();
            this.grid.refresh(list);
        }
    }


}