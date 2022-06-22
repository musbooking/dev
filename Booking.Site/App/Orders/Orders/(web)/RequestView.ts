module orders {

    export class RequestView extends $u.View { 

        private form = new $u.RefForm();
        //private ordersView: orders.AdminGridView = new orders.AdminGridView(this);
        private grid = new $u.RefGrid();


        $config() {

            let toolbar = $u.panelbar(
                $u.button("Сохранить").Click(() => this.save()),
                //$.button("Excel").Click(() => this.form.toExcel()),
                {}
            );

            let form = this.form.config().Labels(120).extend({
                elements: [
                    $u.cols(
                        $u.rows(
                            $u.element("discount").Label("Скидка, %").AsInt(),
                        ),
                        $u.rows(
                            $u.element("comment").Label("Комментарий").AsTextArea(100),
                            $u.element("clientForfeit").Label("Прошлый штраф").AsNumber(),
                            $u.element("totalSum").Label("Cтоимость общ").Css("it-warning").AsNumber(),
                        ),
                    ),
                ]
            });

            //let tabs: $u.Configs.TabViewConfig = $u.tabview()
            //    .Tab("Брони", this.ordersView.$config().Size(0,-1))
            //    .Size(0, 800)
            //    //.Autoheight()
            //    ;

            let grid = this.grid.config().extend({
                height: 200,
                columns: [
                    $u.column("idd").Header("*", 30).Template(Symbols.calendar.link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("dateTo").Header("", 1).Size(1),
                    $.column("baseId").AsSelect(bases.db.names()).Header("База", -1).Sort(),
                    $u.column("roomId").AsSelect(rooms.db.names()).Header("Комната", -1).Sort(),
                    $u.column("totalOrder").AsInt().Header("Стоимость", 80).Sort(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус").Sort(),
                    //$.column("text").Header("Текст", 40).Tooltip("#text#"),
                ],
                scheme: {
                },
            }).Tooltip(); //.OnAdd(r=> { r.abonementId = me.objectId });

            let view = $u.rows(
                toolbar,
                form,
                //tabs
                //this.ordersView.$config(),
                grid,
                {}
            );

            return view;
        }


        $reload(id) {
            super.$reload(id);
            let vals = this.form.load(db.getUrl(id));
            let data = db.list({request:id});
            this.grid.refresh(data);
        }

        private save() {
            if (!this.form.validate()) return;
            let vals = this.form.save(db.saveUrl(this.objectId), false);

            webix.message("Данные о заявке сохранены");
        }


    }




}