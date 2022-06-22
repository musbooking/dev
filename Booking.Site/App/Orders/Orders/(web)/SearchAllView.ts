module orders {

    export class SearchAllView extends $u.View {

        private grid = new $u.RefGrid();
        private filterForm = new $u.RefForm();

        $config() {
            super.$config();
           
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template($u.getViewLink("orders")),
                    $u.column("client").Header("Клиент", 200).Sort().Template(clients.getClientColumnTemplate()).Filter(),

                    $u.column("date").Header("Дата").AsDate().Sort(),
                    $u.column("dateFrom").Header("Дата бр").AsDate().Sort(),
                    $u.column("payDate").Header("Дата опл").AsDate().Sort(),

                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 100).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", 100).Sort().Filter(),
                    //$.column("promoId").AsSelect(promo.db.names()).Header("Промокод", -1).Sort(),
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("discounts").AsInt().Header("Скидка", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("mobComm").AsInt().Header("Комиссия", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("ignoreMobComm").Header("0-Ком").AsCheckbox().Sort().Visible(system.context.isSuper),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 80).Sort().Filter(),
                    $u.column("reason").AsSelect(orders.cancelReasons).Header("Отмена", 80).Sort().Filter(),
                    $u.column("sourceType").AsSelect(sourceTypes).Header("Источник", 80).Sort().Filter(), 
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#date#")),
                    $u.column("text").Header("Описание", 500),
                ],

                // добавляем горизонтальный скролл
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 3,

                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date); //set value based on some data in incoming dataset
                        logic.getStateCss(obj);
                    },
                    //$change: ui.getStateCss,
                },
                save: db.commissionUrl(),
            }).Tooltip("#client#<div/>Скидка: #discount#%<p/>#text#").Footer(); //<div/>Обработан: #isConfirmed#

            let filterCfg = this.filterForm.config().extend({
                cols: [
                    $u.element("dFrom").Label("С", null, 20).AsDate().Size(130),
                    $u.element("dTo").Label("По", null, 30).AsDate().Size(137),
                ]
            }); 

            let view = $u.rows(
                $u.panelbar(
                    $u.button("Обновить").Click(() => this.$reload(this.objectId)),
                    filterCfg,
                    {},
                    $u.label("Связанные брони"), 
                ),
                gridCfg
            );
            return view;
        }

        $init() {
            super.$init();
            let d0 = new Date();
            let n = 1 - d0.getDate();
            let d = d0.addDays(n);
            this.filterForm.setValuesEx({ dFrom: d, dTo1: d.addMonth(1).addDays(-1) });
        }

        $reload(id) {
            super.$reload(id);

            //let args = this.getUrlArgs();
            let args = webix.copy(this.args);
            delete args.view;
            delete args.oid;
            delete args.module;

            let filter = this.filterForm.values();
            webix.extend(args, filter, true);

            args.archive = true; // учитываем архив согласно таску 16376 
            let res = db.search(args);
            this.grid.refresh(res);
            //webix.message("Данные обновлены");
        }
    }


}