module trans {

    export class PartGridView extends $u.View {

        private grid = new $u.RefGrid();
        private filterForm = new $u.RefForm();

        private filter;

        $config() { 
            super.$config();

            let allowSuperCRMEdit = system.context.allowCrmEdit()
            let w = 160;
            let groups1 = db.groups(1);
            let groups2 = db.groups(2);
            let groups3 = db.groups(3);

            let grid = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 2,
                columns: [  //<span class="webix_icon_btn fa-refresh" style="max-width: 24px;"></span>
                    //$.column("id").AsInt().Header("(Ред)", 30).Template("<input type='button' value= '...'  onclick='open'>").extend({css:"webix_img_btn webix_icon_btn fa-refresh"}),
                    //$u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#date#")),
                    $u.column("date").Header("Дата").AsDate(webix.i18n.fullDateFormatStr).Sort().Edit(),
                    $u.column("total").AsInt().Header("Стоимость", 70).AsInt().Sort().Footer({ content: "summColumn" }).Edit(),
                    //$u.column("sourceType").AsSelect(sourceTypes).Header("Источник").Sort().Filter(),
                    $u.column("register").Header("Регистр", w).AsSelect(groups1).Sort().Filter().Edit(),  //.AsSelect(fingroups)
                    $u.column("operation").Header("Операция", w).AsSelect(groups2).Sort().Filter().Edit(),
                    $u.column("details").Header("Детали", w).AsSelect(groups3).Sort().Filter().Edit(),
                    $u.column("sphere").Header("Сфера", w).Sort().Filter(),
                    $u.column("domain").Header("Партнер", w).Sort().Filter(),
                    $u.column("base").Header("База", w).Sort().Filter(),
                    $u.column("room").Header("Комната", w).Sort().Filter(),
                    //$u.column("id").AsInt().Header("(Код)", 40).Template("<a href='{common.href}/orders/edit/?oid=#id#'>#id#</a>"),
                    $u.column("orderId").Header("Бронь", 50).Template($u.getViewLink("orders", "(...)", "#orderId#")),
                    //$u.column("client").Header("Клиент", w).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("text").Header("Комментарий", w * 3).Edit(),

                ],
                save: db.getSaveCfg(true),
                scheme: {
                },
            }).Footer();

            if (allowSuperCRMEdit)
                grid.Editable(); 

            let filter = this.filterForm.config().extend({
                cols: [
                    allowSuperCRMEdit ? this.grid.btnAdd() : $u.label(""),
                    allowSuperCRMEdit ? this.grid.btnDel() : $u.label(""),
                    $u.label("Фильтр"),
                    $u.element("dfrom").Label("Дата с:", null, 60).AsDate().Size(180),
                    $u.element("dto").Label("По:", null, 40).AsDate().Size(160),
                    this.grid.btnRefresh(_ => this.reload(this.filter)),
                    //this.pricesGrid.btnSave(),
                    {}
                ]
            });

            return $u.rows(filter, grid).Min(-1, 400);
        }

        $init() {
            super.$init();
            let d = new Date();
            if (!!this.filterForm.ref)  // проверяем, т.к. иногда форма отключена
                this.filterForm.setValuesEx({ dfrom: d.addDays(-7), dto: d });
        }

        reload(filter) {
            this.filter = filter;
            var fvals = this.filterForm.values();
            var args = { client: filter.clientId, order: filter.orderId, dfrom: fvals.dfrom, dto: fvals.dto };
            let res = db.search(args); 
            this.grid.refresh(res);
            this.grid.scheme(filter);
            //this.grid.set({editable: }).
        }


    }

}

