module abonements {
   
    export class GridView extends $u.View {
         
        private grid = new $u.RefGrid();
        private filterForm = new $u.RefForm();

        $config() { 
            super.$config();

            let gridCfg = this.grid.config().extend({ 
                columns: [  
                    //$.column("idd").Header("*", 30).Template($.Chars.pencil.addLink("{common.href}/abonements/edit/?oid=#id#")), 
                    $u.column("idd").Header("*", 30).Template($u.getViewLink("abonements")),
                    $u.column("client").Header("Клиент", 200).Sort().Filter().Template(clients.getClientColumnTemplate()),
                    $u.column("dateFrom").Header("Начало").AsDate(),  
                    $u.column("dateTo").Header("Окончание").AsDate(),
                    $u.column("baseId").Header("База").AsSelect(bases.db.names(true)).Filter(),
                    $u.column("totalSum").Header("Стоимость", 70).AsInt().Footer({ content: "summColumn" }),
                    $u.column("reserv").Header("Резерв", 70).AsInt().Footer({ content: "summColumn" }),
                    $u.column("payments").Header("Оплачено", 70).AsInt().Footer({ content: "summColumn" }), 
                    $u.column("description").Header("Комментарии", -1).Filter(),
                ],
                scheme: {
                    client: "",
                    dateFrom: new Date().addDays(1),
                    dateTo: (new Date()).addDays(31),
                },

            }).Editable(db.getSaveCfg(true)).Footer();
              
            let filterCfg = this.filterForm.config().extend({
                cols: [
                    $u.element("dateFrom").Label("С", null, 30).Size(140).AsDate(),
                    $u.element("dateTo").Label("По", null, 40).Size(150).AsDate(),
                    //$.element("type").Label("Тип", null, 40).AsSelect(bases.baseTypes).Size(200),
                    $u.element("pays").Label("Оплата", null, 60).AsSelect(orders.payStatuses).Size(200),
                ]
            }); 
             
            let view = $u.rows( 
                $u.panelbar(
                    this.grid.btnAdd().Hidden(!logic.allowOrderCreate(null)),  // {dateForm:new Date().addDays(1), dateTo: new Date().addDays(31) }
                    //this.grid.btnDel(), 
                    //$.icon("minus-circle").Click(() => this.delSelected()).Tooltip("Удалить выделенные записи"),
                    //$.button("Фильтр").Popup( 
                    filterCfg, 
                    this.grid.btnRefresh(() => this.refresh()),
                    {}
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
            this.filterForm.setValuesEx({ dateFrom: d, dateTo: d.addMonth(1).addDays(-1) });
        }

        $activate(args) {
            super.$activate(args);
            this.refresh();
        }

        private refresh() {
            if (!this.filterForm.validate("Ошибки в параметрах")) return;
            let filter = this.filterForm.values();
            let list = db.list(filter);  
            this.grid.refresh(list);
        }

        //private delSelected() {
        //    let ids = this.grid.getSelectedIds();
        //}
    }
   

}