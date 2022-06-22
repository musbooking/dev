module bases {
    
    export class GridView extends $u.View {

        grid = new $u.RefGrid(); 
          
        $config() {
            super.$config();   
             
            let gridCfg = this.grid.config().extend({ 
                columns: [  
                    //$.column("type").AsSelect(baseTypes).Header("Тип", 150).Sort().Filter(),
                    $u.column("sphereId").Header("Сфера").AsSelect(spheres.db.names()).Filter().Edit(),
                    $u.column("name").Header("Название", 200).Sort().Filter().Template($u.getViewLink("bases", "#name#")),
                    $u.column("description").Header("Описание", -1).Filter(),
                    $u.column("workTime").Header("Раб.Часы", 50), 
                    $u.column("weekendTime").Header("Вых.Часы", 50), 
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {  
                    //id: -1,
                    name: "без имени",
                },

                //url: db.itemsUrl,
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
            this.refresh();
        }


        private refresh() {
            let items = db.list();
            this.grid.refresh(items);
        }

    }

}