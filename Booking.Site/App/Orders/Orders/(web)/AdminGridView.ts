﻿module orders {

    export class AdminGridView extends $u.View {
        private filter: any = {};

        private grid = new $u.RefGrid();
        private filterView = new $u.RefForm();

        $config() {

            let allowSuperCRMEdit = system.context.allowCrmEdit()

            let grid = this.grid.config().extend({
                //height: 300, 
                columns: [
                    //$.column("idd").Header("Документ", 90).Template("#rustype#".addLink("{common.href}/#type#/edit/?oid=#id#")),
                    //$.column("idd").Header("", 30).Template($.Chars.pencil.addLink("{common.href}/#module#/edit/?oid=#id#")),
                    $u.column("idd").Header("", 30).Template($u.getViewLink("orders")).Visible(allowSuperCRMEdit),
                    $u.column("date").Header("Дата").AsDate(webix.i18n.dateFormatStr).Sort().Filter(),
                    $u.column("domainId").AsSelect(domains.db.names()).Header("Партнер", 100).Sort().Filter(),
                    $u.column("baseId").AsSelect(bases.db.names()).Header("База", 100).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.names(null, true)).Header("Комната", 100).Sort().Filter(),
                    $u.column("metro").Header("Метро").Sort().Filter(),

                    $u.column("total").Header("Сумма").AsInt().Sort().Filter().Footer(),
                    $u.column("forfeit").Header("Штрафы").AsInt().Sort().Filter().Footer(),
                    $u.column("text").Header("Описание", -1).Filter(),
                    $u.column("clientComment").Header("Комментарий", -1).Filter(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 100).Sort().Filter(),
                ],
                scheme: {
                    name: "без имени",
                    $init: function (obj) {
                        orders.logic.getStateCss(obj);
                    },
                },
            })
                .Tooltip("<b>Описание и комментарий:</b><br/><blockquote>#text#<hr/>#clientComment#</blockquote>")
                .Footer()
                .Autoheight();

            let filterCfg = this.filterView.config().extend({
                cols: [
                    $u.label("Список броней"),
                    $u.element("dfrom").Label("Дата с:", null, 60).AsDate().Size(180),
                    $u.element("dto").Label("По:", null, 40).AsDate().Size(160),   
                    //this.grid.btnAdd(),
                    //this.grid.btnDel(),
                    $u.icon("refresh").Click(() => this.reload()),
                    //this.pricesGrid.btnSave(),
                    {}
                ]
            });

            return $u.rows(filterCfg, grid);
        }

        $init() {
            super.$init();
            let d = new Date();
            this.filterView.setValuesEx({ dfrom: d.addDays(-7), dto: d });
        }

        reload(args?) {
            if (args)
                this.filter = args;
            let filter = webix.extend(this.filter, this.filterView.values(), true);
            let items = db.admlist(filter);
            this.grid.refresh(items);
        }
    }

}