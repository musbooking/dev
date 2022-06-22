module templates {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        //private formView: FormView = new FormView(this);

        $config() {
            super.$config();

            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template(Symbols.pencil.link("{common.href}/templates/edit/?oid=#id#")), 
                    // $.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#date#")),

                    $u.column("key").Header("Тип", 250).AsSelect(kinds).Sort().Edit().Filter(),
                    // $u.column("key").Header("Тип", 250).Sort().Edit(),
                    $u.column("name").Header("Название", -1).Sort().Edit().Filter(),
                    $u.column("subject").Header("Заголовок", -1).Sort().Edit().Filter(),
                    $u.column("description").Header("Описание", -1).Edit().Filter(),
                    $u.column("isArchive").Header(Symbols.Cross).AsCheckbox().Sort().Filter(),
                ],
                scheme: {
                    //id: -1,
                },
                save: db.getSaveCfg(true),
            }).Editable();

            let toolbar = $u.panelbar(  // header('Список шаблонов рассылок',
                this.grid.btnAdd(),
                this.grid.btnDel(),
                this.grid.btnRefresh(() => this.reload()),
                //$.icon("save").Click(() => this.formView.form.updateBindings()).Tooltip($.loc.Tooltips.Save)
                {},
            );

            let view = $u.rows(
                toolbar,
                gridCfg,
            );

            return view;
        }


        $init() {
            super.$init();
            //this.formView.form.bind(this.grid);
            this.reload();
        }

        //$activate(args) {
        //    super.$activate(args);
        //    //this.formView.form.bind(this.grid);
        //    if(!this.first)
        //        this.reload();
        //}

        reload() {
            let list = db.list();
            this.grid.refresh(list);
            webix.message($u.loc.Msg.Reloaded);
        }

    }


}