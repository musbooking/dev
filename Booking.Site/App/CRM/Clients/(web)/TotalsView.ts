module clients {

    //const STORAGE_PIVOT = location.host + "pivot.client.totals";


    export class TotalsView extends $u.View {

        //private filterForm = new $.RefForm();
        private pivot = new $u.RefPivot();
        private filterView:FilterView  = new FilterView(this);

        $config() {
            super.$config();

            //$.loadPivotFiles();

            this.filterView.onAction( () => this.refresh());

            let toolbar = $u.panelbar(
                $u.button("Найти").Popup(this.filterView.$config(), _ => this.onPopup()),
                //$.icon("refresh").Click(() => this.refresh()).Tooltip( "Пересчитать данные и обновить отчет"),
                $u.icon("file-excel-o").Click(() => this.export()).Tooltip("Экспортировать в Ексел"),
                {}
            );

            let pivotCfg = this.pivot.config().extend( {
                //view: "pivot",
                //id: this.pivot.id,
                //max: true,
                //select: true,
                //totalColumn: "sumOnly",
                //footer: "sumOnly",
                columnWidth: 80,

                fieldMap: {
                    domain:"Партнер",
                    name: "ФИО",
                    email: "Email",
                    city: "Город",

                    logins: "Логины",
                    orders: "Заказы",
                    reservs: "Резервы",
                    paids: "Оплаты",
                    cancels: "Отмены",
                    forfeits: "Штрафы",

                    sOrders: "₽Заказы", //₽ &reg;
                    sReservs: "₽Резервы",
                    sPaids: "₽Оплаты",
                    sCancels: "₽Отмены",
                    sForfeits: "₽Штрафы",
                    sDiscounts: "₽Скидки",
                }, 
               
                structure: {
                    filters: [
                        { name: "city", type: "select" },
                    ],

                    columns: [
                        //"city",
                    ],
                    values: [
                        { name: "logins", operation: "sum" },

                        { name: "orders", operation: "sum" },
                        { name: "reservs", operation: "sum" },
                        { name: "paids", operation: "sum" },
                        { name: "cancels", operation: "sum" },
                        { name: "forfeits", operation: "sum" },

                        { name: "sOrders", operation: "sum" },
                        { name: "sReservs", operation: "sum" },
                        { name: "sPaids", operation: "sum" },
                        { name: "sCancels", operation: "sum" },
                        { name: "sForfeits", operation: "sum" },
                        { name: "sDiscounts", operation: "sum" },
                    ],

                    rows: ["domain", "name" ], //"Course"

                },

                //on: {
                //    onBeforeApply: structure => {
                //        //let config = this.pivot.ref.getStructure();
                //        webix.storage.local.put(STORAGE_PIVOT, structure);
                //    }
                //}

            });

            let view = $u.rows(
                toolbar,
                pivotCfg
            );
            return view;
        }

        $init() {
            super.$init();
            this.pivot.setConfig("pivot.client.totals");
            //let config = webix.storage.local.get(STORAGE_PIVOT);
            //if (config)
            //    this.pivot.ref.setStructure(config);
        }

        private onPopup() {
            //let d = new Date(Date.now());
            //d = webix.Date.weekStart(d);
            //this.filterView.form.setValues({ dfrom: d, dto: d.addDays(6) });
        }

        private refresh() {
            let filter = this.filterView.values;
            let list = db.totals(filter);
            this.pivot.refresh(list);

            webix.message(`Загружено ${list.length}, но не более 1000 записей`);
        }

        private export() {
            this.pivot.toExcel({
                filename: "totals " + (new Date()).toLocaleDateString("ru"), // for filename
                name: "totals", // for sheet name
                filterHTML: true,
            });
        }

    }
    
}

