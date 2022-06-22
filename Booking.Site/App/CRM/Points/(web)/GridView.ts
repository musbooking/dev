module points {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        private clientid;

        $config() { 
            super.$config();
            //let cc = $.column("date").Header("Дата").AsDate();

            let gridCfg = this.grid.config().extend({
                columns: [
                    //$.column("id").AsInt().Header("(Код)", 40).Template("<a href='{common.href}/orders/edit/?oid=#id#'>#id#</a>"),
                    $u.column("date").Header("Дата").AsDate().Sort().Edit(),
                    $u.column("kind").Header("Вид", 120).AsSelect(kinds).Sort().Filter().Edit(),
                    $u.column("prih").Header("Приход").AsInt().Sort().Edit().Footer({ content: "summColumn" }),
                    $u.column("rash").Header("Расход").AsInt().Sort().Edit().Footer({ content: "summColumn" }),
                    $u.column("description").Header("Описание", -1).Filter().Edit().Footer("Остаток"),
                    $u.column("zcount").Header("", 75).AsInt().Footer({ content: "summColumn" }).Template(' ').Edit(),
                ],
                scheme: {
                    //$init: function (obj) {
                    //    obj.date = parseDate(obj.date); //set value based on some data in incoming dataset
                    //},
                    $save: r => console.log('save', r), 
                    $update: r => console.log('update', r), 
                    $change: r => console.log('change', r), 
                    $serialize: r => console.log('serialize', r), 
                    //$serialize: function (obj) {
                    //    obj.count = obj.prih + obj.rash; 
                    //},
                },
                save: db.getSaveCfg(true),

            }).Footer().Editable();

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.reload(this.clientid)),
                    //this.grid.btnSave,
                    {}),
                gridCfg
            );
            return view.Min(-1,400);
        }

        reload(clientid) {
            this.clientid = clientid;
            let res = db.list(clientid); 
            this.grid.refresh(res);
            this.grid.scheme({ client: clientid });
        }


    }

}

