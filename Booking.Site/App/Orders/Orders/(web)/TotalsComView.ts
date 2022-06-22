module orders {

    /** Отчет по комиссиям партнерам */
    export class TotalsComView extends $u.View {

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
                    $u.element("pfrom").Label("Оплата с", null, 60).Size(170).AsDate().Disable(!isAllDates),  //.extend({ value: new Date(2012, 6, 8) }).RangeDates(minDate),
                    $u.element("pto").Label("По", null, 40).Size(170).AsDate().Disable(!isAllDates),        //.extend({ date: date.addDays(7) }).RangeDates(minDate),
                    $u.icon("refresh").Click(_ => this.refresh()).Tooltip( "Пересчитать данные и обновить отчет"),
                    $u.icon("file-excel-o").Click(_ => this.export()).Tooltip("Экспортировать в Ексел").Hidden(!isAllDates),
                    {},
                ]
            });

            let pivotCfg = this.pivot.config().extend( {
                columnWidth: 80,

                fieldMap: {
                    domain: "Партнер",
                    sphere: "Сфера",
                    users: "Ответственные",
                    type: "Тип",
                    total: "Сумма",
                    //debt: "Долг",
                    //previous: "Пред",
                    //current: "Текущ",
                    //income: "Опл",
                }, 

                scheme: {
                   
                },
                
                structure: {
                    filters: [
                        //{ name: "baseSphere", type: "select" },
                        //{ name: "group", type: "select" },
                    ],

                    rows: [
                        'domain',
                        'sphere',
                        'users',
                        //{ id: "year", header: "Год", },
                        //{ id: "month", header: "Месяц", },
                        //{ id: "week", header: "Неделя", },
                        //{ id: "dayStr", header: "День", sort: "string"},
                        //{ id: "day", header: "День", },
                    ],

                    values: [
                        { name: "total", operation: "sum" },
                        //{ name: "debt", operation: "sum" },
                        //{ name: "previous", operation: "sum" },
                        //{ name: "current", operation: "sum" },
                        //{ name: "income", operation: "sum" },
                    ],

                    columns: [
                        "type",
                    ], //["baseSphere", "base", "room", "group" ], //"Course"

                },
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
            let vals = { dfrom: d, dto: d.addDays(6), pfrom: d, pto: d.addDays(6) };
            this.filterForm.setValuesEx(vals);

            this.pivot.setConfig("pivot.orders.totalscom");

        }

        private refresh() {
            let vals = this.filterForm.values();
            let list = db.totalscom(vals);
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

