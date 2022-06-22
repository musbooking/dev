module expenses {

   
    export class GridView extends $u.View {

        private filterForm = new $u.RefForm();
        private grid = new $u.RefGrid();

        $config() {
            super.$config();

            let gridCfg = this.grid.config().extend({
                scrollAlignY: true,
                //scrollX: true,
                leftSplit: 3,

                columns: [
                    $u.column("id").Header("*", 30).Template(Symbols.pencil.link("{common.href}/expenses/edit/?oid=#id#")),
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("baseId").Header("База", 200).AsSelect(bases.db.names(false)).Sort().Filter(),  
                    $u.column("isPublic").Header("Отч").AsCheckboxReadly().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(), 
                    $u.column("totals").Header("Расход",65),
                    $u.column("login").Header("Пользователь", 170).Sort().Filter(),
                    $u.column("description").Header("Описание", 200).Sort().Filter(),
                    $u.column("details").Header("Позиции", 900).Sort().Filter(),
                ],  
                scheme: {
                    id: -1,
                    name: "новый элемент",
                    //type: this.type,
                },

                //url: db.getItemsUrl(this.type, this.domainOnly),
                save: db.getSaveCfg(true),

            }).Editable();


            let isAllDates = orders.logic.allowAnyReportDay();

            let filterCfg = this.filterForm.config().extend({
                cols: [
                    this.grid.btnAdd(),
                    //this.grid.btnDel(),
                    $u.element("dfrom").Label("Дата с", null, 50).Size(170).AsDate().Disable(!isAllDates),  //.extend({ value: new Date(2012, 6, 8) }).RangeDates(minDate),
                    $u.element("dto").Label("По", null, 40).Size(170).AsDate().Disable(!isAllDates),        //.extend({ date: date.addDays(7) }).RangeDates(minDate),
                    this.grid.btnRefresh(_ => this.refresh()),
                    //$.icon("file-excel-o").Click(() => this.export()).Tooltip("Экспортировать в Ексел").Hidden(!isAllDates),
                    {},
                ]
            });

            let view = $u.rows(
                filterCfg,
                gridCfg
            );
            return view;
        }

        $init() {
            super.$init();
            let d = new Date(Date.now());
            d = webix.Date.weekStart(d);
            this.filterForm.setValuesEx({ dfrom: d, dto: d.addDays(6) });
        }


        $activate(args) {
            super.$activate(args);
            this.refresh();
        }


        refresh() {
            let vals = this.filterForm.values();
            let rows = db.list_items(vals.dfrom, vals.dto);
            this.grid.refresh(rows);
        }

    }

}