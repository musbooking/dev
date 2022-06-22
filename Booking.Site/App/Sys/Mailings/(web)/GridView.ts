module mailings {
    
    export class GridView extends $u.View {

        grid = new $u.RefGrid(); 
          
        $config() {
            super.$config();   

            let temps = templates.db.names({ key: templates.TemplateKind.Manual })

            let gridCfg = this.grid.config().extend({ 
                columns: [  
                    //$.column("type").AsSelect(baseTypes).Header("Тип", 150).Sort().Filter(),
                    $u.column("name").Header("Название", 200).Sort().Filter().Template($u.getViewLink("mailings", "#name#")),
                    $u.column("description").Header("Описание", -1).Filter(),
                    $u.column("fromDate").Header("Старт", 110).AsDate(webix.i18n.fullDateFormatStr).Edit(),
                    $u.column("status").Header("Статус").AsSelect(statuses).Filter().Edit(),
                    $u.column("ok").Header("Ок", 40),
                    $u.column("errors").Header("Ошиб", 45),
                    $u.column("templateId").Header("Шаблон", 250).AsSelect(temps).Filter(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {  
                    //id: -1,
                    name: "новая рассылка",
                },
            }).Editable(db.getSaveCfg(true));

            let view = {
                rows: [
                    $u.panelbar(
                        this.grid.btnAdd(),
                        this.grid.btnDel(),
                        this.grid.btnRefresh(_ => this.refresh()),
                        {}),
                    gridCfg,
                ],
            };
            return view;
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }


        private refresh() {
            let items = db.list();
            this.grid.refresh(items);
        }

    }

}