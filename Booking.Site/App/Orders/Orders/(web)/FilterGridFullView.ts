module orders {

    export class FilterGridFullView extends $u.View {

        private grid = new $u.RefGrid();
        private filterForm = new $u.RefForm();
        private editor = new OrderEditor(); //() => this.grid.refresh());


        $config() {
            super.$config();
            It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
            //let cc = $.column("date").Header("Дата").AsDate();
            let logic = orders.logic;

            let gridCfg = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 1,
                columns: [  //<span class="webix_icon_btn fa-refresh" style="max-width: 24px;"></span>
                    //$.column("id").AsInt().Header("(Ред)", 30).Template("<input type='button' value= '...'  onclick='open'>").extend({css:"webix_img_btn webix_icon_btn fa-refresh"}),
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("client").Header("Клиент", 150).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("sourceType").AsSelect(sourceTypes).Header("Источник").Sort().Filter(),
                    $u.column("isPrepay").Header("Пред").AsCheckboxReadly(true),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("domainId").AsSelect(domains.db.names()).Header("Партнер", 140).Sort().Filter(),
                    $u.column("sphereId").AsSelect(spheres.db.names()).Header("Сфера", 140).Sort().Filter(),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 140).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", 140).Sort().Filter(),
                    $u.column("promo").Header("Промокод", 50).Sort().Filter(), //AsSelect(promo.db.names()).
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 70).AsNumber().Sort().Footer({ content: "summColumn" }),
                    //$.column("types").Header("Оборудование", -1).Sort(), // .AsMultiSelect(models.equipments.types).Header("Оборудование", 100).Edit()
                    $u.column("discounts").AsInt().Header("Скидка", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("eqSum").AsInt().Header("Доп.", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("mobComm").AsInt().Header("Ком.", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("comment").Header("Комментарий", 100).Filter(),
                    $u.column("clientComment").Header("Комм.клиента", 100).Filter(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 100).Sort().Filter(),
                    //$.column("group").AsSelect(orderGroupKinds).Header("Группа", 80).Sort().Filter(),
                    //$.column("options").AsMultiSelect(groups.db.getOptions()).Header("Опции1", 80).Sort().Filter().Edit("multiselect"),
                    $u.column("options").Header("Опции", 180).Sort().Filter(),

                    $u.column("reason").AsSelect(cancelReasons).Header("Отмена", 100).Sort().Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date); //set value based on some data in incoming dataset
                        logic.getStateCss(obj);
                    },
                    //$change: ui.getStateCss, 
                },
            }).Tooltip("<h3>#client#</h3><hr/><blockquote>#comment# #clientComment#<br/>#options#</blockquote>").Footer(); //<div/>Обработан: #isConfirmed#

            let date = new Date();

            let filterFormCfg = this.filterForm.config().extend({
                width: 400,
                elements: [
                    $u.element("search").Label("Названия"),
                    $u.element("dfrom").Label("Дата с").AsDate().Value(date.addDays(-7)),  //.extend({ value: new Date(2012, 6, 8) }).RangeDates(minDate),
                    $u.element("dto").Label("По").AsDate().Value(date),        //.extend({ date: date.addDays(7) }).RangeDates(minDate),
                    $u.element("base").Label("База").AsSelect(bases.db.names(true)),
                    $u.element("promo").Label("Промокод", "top").AsSelect(promo.db.names(true, promo.PromoKind.Action)),
                    $u.element("status").Label("Статус документа").AsSelect(orders.statuses),
                    //$.element("group").Label("Статус группы").AsSelect(orderGroupKinds),
                    $u.element("option").Label("Опция").AsSelect(groups.db.options()),

                    $u.element("sources").Label("Источники").AsMultiSelect(sourceKinds),
                    $u.element("eqtypes").Label("Тип позиции").AsMultiSelect(groups.db.names(groups.GroupType.Equipment)),
                    $u.element("eqs").Label("Позиции").AsMultiSelect(equipments.db.names()),
                    $u.element("sourceTypes").Label("Типы источн.").AsMultiSelect(orders.sourceTypes),
                    $u.element("prepay").Label("Только предоплата").AsCheckbox(),

                    $u.element("domain").Label("Партнер").AsSelect(domains.db.names()),
                    $u.element("sphere").Label("Сфера").AsSelect(spheres.db.names()),

                    $u.cols(
                        $u.button("Найти").Click(() => this.refresh()).Tooltip("Пересчитать данные и обновить отчет"),
                        $u.button("Очистить").Click(() => this.filterForm.clear())
                    ),
                ]
            });

            let view = $u.rows(
                $u.cols(
                    $u.button("Поиск").Popup(filterFormCfg),
                    $u.button("Открыть").Click(() => this.open()),
                    $u.icon("file-excel-o").Click(() => this.exportxlsx()).Tooltip("Экспортировать в Ексел"),
                    {}
                ),
                gridCfg
            );
            return view;
        }

        private refresh() {
            let filter = this.filterForm.values();
            let list = db.search(filter);
            this.grid.refresh(list);
            webix.message("Отчет обновлен");
        }

        private open() {
            let item = this.grid.getSelectedItem();
            if (!item) return;
            this.editor.edit(item.id);
        }

        ///  55485 Добавить выгрузку в Excel результатов поиска в разделе "Статистика брони"
        private exportxlsx() {
            this.grid.toExcel({
                filename: "orders-" + (new Date()).toLocaleDateString("ru"), // for filename
                name: "orders",
                filterHTML: true,
                //rawValues: true,
                columns: [
                    { id: "client", header1: "ККК" },
                    { id: "sourceType" },
                    { id: "dateFrom" },
                    { id: "baseId" },
                    { id: "roomId" },
                    { id: "promo" },
                    { id: "houurs" },
                    { id: "totalSum", exportType: "number"},
                    { id: "discounts", exportType: "number" },
                    { id: "eqSum", exportType: "number", exportFormat1: "#-##0.00" },
                    { id: "status" },
                    //{ id: "" },
                ]
            });
            console.log('export xlsx');
        }


    }

    
}

