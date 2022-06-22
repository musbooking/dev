module orders {
    /** Поиск и отображения броней для Суперадмина - api/orders/search */
    export class SearchSuperView extends $u.View {

        private grid = new $u.RefGrid();

        $config() {
            super.$config();
           
            let grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template($u.getViewLink("orders")),
                    $u.column("client").Header("Клиент", -2).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("domain").Header("Партнер", -1).Sort().Filter(),
                    $u.column("base").Header("База", -1).Sort().Filter(),
                    $u.column("room").Header("Комната", -1).Sort().Filter(),
                    //$.column("baseId").AsSelect(bases.db.names(true)).Header("База", -1).Sort().Filter(),
                    //$.column("roomId").AsSelect(rooms.db.names()).Header("Комната", -1).Sort().Filter(),
                    //$.column("promoId").AsSelect(promo.db.names()).Header("Промокод", -1).Sort(),
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("discounts").AsInt().Header("Скидка", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("mobComm").AsInt().Header("Комиссия", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("ignoreMobComm").Header("0-Ком").AsCheckbox().Sort().Visible(system.context.isSuper),
                    $u.column("text").Header("Описание", -1),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 80).Sort().Filter(),
                    $u.column("reason").AsSelect(orders.cancelReasons).Header("Отмена", 80).Sort().Filter(),
                    $u.column("sourceType").AsSelect(sourceTypes).Header("Источник", 80).Sort().Filter(),
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date); 
                        logic.getStateCss(obj);
                    },
                    //$change: ui.getStateCss,
                },
                save: db.commissionUrl(),
            }).Tooltip("#client#<div/>Скидка: #discount#%<p/>#text#").Footer(); //<div/>Обработан: #isConfirmed#

            let view = $u.rows(
                $u.panelbar(
                    $u.button("Обновить").Click(() => this.$reload(this.objectId)),
                    {},
                    $u.label("Статистика по связанным заказам для Суперадмина  "), 
                ),
                grid
            );
            return view;
        }

        //$activate(args) {
        //    super.$activate(args);
        //    if (!this.first)
        //        this.$reload(this.objectId);
        //}

        $reload(id) {
            super.$reload(id);

            //let args = this.getUrlArgs();
            let args = webix.copy(this.args);
            delete args.view;
            delete args.oid;
            delete args.module;

            args.archive = true; // учитываем архив согласно таску 16376 
            let res = db.search(args);
            this.grid.refresh(res);
            webix.message("Данные обновлены");
        }
    }


}