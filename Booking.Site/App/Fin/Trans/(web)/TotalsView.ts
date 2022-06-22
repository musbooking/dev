module trans {

    export class TotalsView extends $u.View {

        private filterForm = new $u.RefForm();
        private pivot = new $u.RefPivot();

        $config() {
            super.$config();

            let groups1 = db.groups(1);
            let form = this.filterForm.config().extend({ 
                cols: [
                    $u.icon("refresh").Click(_ => this.refresh()).Tooltip("Пересчитать данные и обновить отчет"),
                    $u.element("register").Label("Регистр", null, 70).AsSelect(groups1),
                    $u.element("dfrom").Label("Дата с", null, 50).Size(170).AsDate(),  //.extend({ value: new Date(2012, 6, 8) }).RangeDates(minDate),
                    $u.element("dto").Label("По", null, 40).Size(170).AsDate(),        //.extend({ date: date.addDays(7) }).RangeDates(minDate),
                    $u.icon("file-excel-o").Click(_ => this.export()).Tooltip("Экспортировать в Ексел"),
                    $u.button("Сбросить").Click(_ => this.pivot.clearConfig(true)).Tooltip("Сбросить настройки"),
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
                    register: "Регистр",
                    operation: "Операция",
                    details: "Детали",

                    client: "Клиент",
                    domain: "Партнер",
                    sphere: "Сфера",
                    group: "Опции",
                    base: "База",
                    room: "Комната",

                    total: "Сумма",

                    year: "Год",
                    month: "Месяц",
                    day: "День",
                    week: "Неделя", 
                    weekDate: "Нач.Нед", 
                    weekDay: "Д/нед",
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
                        //{ name: "register", type: "select" },
                        { name: "sphere", type: "select" },
                        { name: "domain", type: "select" },
                    ],

                    columns: [
                        //"dayStr", 
                        //{ id: "date", sort1: "server", header: "aaaaa", },
                        { id: "year", header: "Год", },
                        //{ id: "month", header: "Месяц", },
                        { id: "weekDate", header: "Нач.Нед", },
                        { id: "weekDay", header: "День", sort: "string"},
                        //{ id: "day", header: "День", },
                    ],
                    values: [
                        { name: "total", operation: "sum" },
                        //{ name: "discounts", operation: "sum" },
                        //{ name: "fullTotals", operation: "sum" },
                    ],

                    rows: ["sphere", "domain", "operation" ], //"Course", "details"

                },

                //url: type.url("getCourseItems"),
                //ready: function () {
                //    //this.operations.f1 = function (data) {
                //    //    return 123;
                //    //}
                //}
            });


            let view = $u.rows(
                form,
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

            this.pivot.setConfig("pivot.trans.totals");

        }

        private refresh() {
            //if (!this.filterForm.validate()) return;
            let vals = this.filterForm.values();
            let list = db.totals(vals);
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

