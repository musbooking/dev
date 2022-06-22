module orders {

    export class TotalsView extends $u.View {

        private filterForm = new $u.RefForm();
        private pivot = new $u.RefPivot();

        $config() {
            super.$config();

            //$.loadPivotFiles();

            let isAllDates = orders.logic.allowAnyReportDay();

            let formCfg = this.filterForm.config().extend({ 
                cols: [
                    $u.button("Сбросить").Click(_ => this.pivot.clearConfig(true)).Tooltip("Сбросить настройки"),
                    $u.element("dfrom").Label("Дата с", null, 50).Size(170).AsDate().Disable(!isAllDates),  //.extend({ value: new Date(2012, 6, 8) }).RangeDates(minDate),
                    $u.element("dto").Label("По", null, 40).Size(170).AsDate().Disable(!isAllDates),        //.extend({ date: date.addDays(7) }).RangeDates(minDate),
                    $u.icon("refresh").Click(_ => this.refresh()).Tooltip( "Пересчитать данные и обновить отчет"),
                    $u.icon("file-excel-o").Click(_ => this.export()).Tooltip("Экспортировать в Ексел").Hidden(!isAllDates),
                    {},
                ]
            });

            let pivotCfg = this.pivot.config().extend( {
                //view: "pivot",
                //id: this.pivot.id,
                //max: true,
                //select: true,
                //totalColumn: "sumOnly",
                //footer: "sumOnly",
                columnWidth: 80,

                fieldMap: {
                    baseSphere: "Сфера",
                    group: "Статья",
                    base: "База",
                    room: "Комната",
                    totals: "Сумма",
                    totalsOnline: "ОплБанк",
                    totalsCache: "ОплНал/з",
                    totalsBack: "Возвр.Нал",
                    totalsBackPred: "Возвр.Пред",
                    fullTotals: "Полн сумма",
                    discounts: "Скидки",
                    user: "Автор",
                    source: "Источник",
                    //year: "Год",
                    //month: "Месяц",
                    //day: "День",
                    dayStr: "День", 
                    channel: "Канал",
                }, //date: "Дата"

                scheme: {
                    //$init: function (obj) {
                    //    obj.date = webix.i18n.dateFormatStr( obj.date);
                    //    //obj.Status1 = "S" + obj.Status;
                    //    //if (obj.Status > 20) obj.css = "it-header1";
                    //},
                    //$sort: { by: "dayStr" },
                    //$sort: "#dayStr#",
                    //$sort: function (item1, item2) {
                    //    //let d1 = webix.i18n.dateFormatDate(item1.date);
                    //    //let d2 = webix.i18n.dateFormatDate(item2.date);
                    //    //return d1 < d2;
                    //    return item1.date < item2.date;
                    //},
                },
                
                structure: {
                    filters: [
                        { name: "baseSphere", type: "select" },
                        { name: "group", type: "select" },
                        { name: "source", type: "select" },
                    ],

                    columns: [
                        //"dayStr", 
                        //{ id: "date", sort1: "server", header: "aaaaa", },
                        //{ id: "year", header: "Год", },
                        //{ id: "month", header: "Месяц", },
                        //{ id: "week", header: "Неделя", },
                        { id: "dayStr", header: "День", sort: "string"},
                        //{ id: "day", header: "День", },
                    ],
                    values: [
                        { name: "totals", operation: "sum" },
                        //{ name: "discounts", operation: "sum" },
                        //{ name: "fullTotals", operation: "sum" },
                    ],

                    rows: ["baseSphere", "base", "room", "group" ], //"Course"

                },

                //url: type.url("getCourseItems"),

                //ready: function () {
                //    //this.operations.f1 = function (data) {
                //    //    return 123;
                //    //}
                //}
            });


            let view = $u.rows(
                formCfg,
                pivotCfg
            );
            return view;
        }

        $init() {
            super.$init();

            // set init filter form values
            let d = new Date(Date.now());
            d = webix.Date.weekStart(d);
            let vals = { dfrom: d, dto: d.addDays(6) };
            this.filterForm.setValuesEx(vals);

            this.pivot.setConfig("pivot.orders.totals");

        }

        private refresh() {
            let vals = this.filterForm.values();
            let list = db.totals(vals.dfrom, vals.dto);
            this.pivot.refresh(list);
            webix.message("Отчет обновлен");
        }

        private export() {
            let cfg = {
                filename: "totals " + (new Date()).toLocaleDateString("ru"), // for filename
                name: "totals", // for sheet name
                filterHTML: true,
            };
            this.pivot.toExcel(cfg);
        }

    }
    
}

