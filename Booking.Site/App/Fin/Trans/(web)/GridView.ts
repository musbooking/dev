module trans {
   
    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        private filterForm = new $u.RefForm();


        $config() {
            super.$config();
            //let cc = $.column("date").Header("Дата").AsDate();
            let w = 160;
            //let fingroups = groups.db.names(groups.GroupType.Fin).sort(x => x.index);
            let groups1 = db.groups(1);
            let groups2 = db.groups(2);
            let groups3 = db.groups(3);
            //debugger;

            let grid = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 2,
                columns: [  //<span class="webix_icon_btn fa-refresh" style="max-width: 24px;"></span>
                    //$.column("id").AsInt().Header("(Ред)", 30).Template("<input type='button' value= '...'  onclick='open'>").extend({css:"webix_img_btn webix_icon_btn fa-refresh"}),
                    //$u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#date#")),
                    $u.column("date").Header("Дата").AsDate(webix.i18n.fullDateFormatStr).Sort(),
                    $u.column("total").AsInt().Header("Стоимость", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    //$u.column("sourceType").AsSelect(sourceTypes).Header("Источник").Sort().Filter(),
                    $u.column("register").Header("Регистр", w).AsSelect(groups1).Sort().Filter(),  //.AsSelect(fingroups)
                    $u.column("operation").Header("Операция", w).AsSelect(groups2).Sort().Filter(),
                    $u.column("details").Header("Детали", w).AsSelect(groups3).Sort().Filter(),
                    $u.column("sphere").Header("Сфера", w).Sort().Filter(),
                    $u.column("domain").Header("Партнер", w).Sort().Filter(),
                    $u.column("base").Header("База", w).Sort().Filter(),
                    $u.column("room").Header("Комната", w).Sort().Filter(),
                    //$u.column("id").AsInt().Header("(Код)", 40).Template("<a href='{common.href}/orders/edit/?oid=#id#'>#id#</a>"),
                    $u.column("orderId").Header("Бронь", 50).Template($u.getViewLink("orders", "(...)", "#orderId#")),
                    $u.column("client").Header("Клиент", w).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("text").Header("Комментарий", w*3),

                ],
                scheme: {
                },
            }).Footer(); 

            let date = new Date();

            let filterFormCfg = this.filterForm.config().extend({
                width: 400,
                elements: [
                    //$u.element("search").Label("Названия"),
                    $u.element("dfrom").Label("Дата с").AsDate().Value(date.addDays(-7)),  //.extend({ value: new Date(2012, 6, 8) }).RangeDates(minDate),
                    $u.element("dto").Label("По").AsDate().Value(date.addDays(1)),        //.extend({ date: date.addDays(7) }).RangeDates(minDate),

                    $u.element("register").Label("Регистр").AsSelect(groups1),
                    $u.element("operation").Label("Операция").AsSelect(groups2),
                    $u.element("details").Label("Детали").AsSelect(groups3),

                    $u.element("domain").Label("Партнер").AsSelect(domains.db.names()),
                    $u.element("sphere").Label("Сфера").AsSelect(spheres.db.names()),
                    $u.element("base").Label("База").AsSelect(bases.db.names(true)),
                    $u.element("room").Label("Комната").AsSelect(rooms.db.names(null, true)),
                    //$u.element("promo").Label("Промокод", "top").AsSelect(promo.db.names(true, promo.PromoKind.Action)),
                    //$u.element("status").Label("Статус документа").AsSelect(docs.docStatuses),
                    //$.element("group").Label("Статус группы").AsSelect(orderGroupKinds),
                    //$u.element("option").Label("Опция").AsSelect(groups.db.options()),

                    //$u.element("sources").Label("Источники").AsMultiSelect(sourceKinds),
                    $u.element("eqtypes").Label("Тип позиции").AsMultiSelect(groups.db.names(groups.GroupType.Equipment)),
                    //$u.element("sourceTypes").Label("Типы источн.").AsMultiSelect(orders.sourceTypes),

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
                    {}
                ),
                grid
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
            //this.editor.edit(item.id);
        }
    }

    
}

