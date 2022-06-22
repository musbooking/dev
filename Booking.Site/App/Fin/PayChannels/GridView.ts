module paychannels {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        private formview = create.form().owner(this);

        $config() {
            super.$config();
            
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Название", 200).Sort().Sort(),
                    $u.column("kind").Header("Тип").AsSelect(kinds),
                    $u.column("description").Header("Описание", -1),
                    //$.column("isPrepay").Header("Пред").AsCheckboxReadly().Sort(),
                    //$.column("isRequest").Header("Заявка").AsCheckboxReadly().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),

                ],
                scheme: { 
                    id: -1,
                    name: "без имени",
                },
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.toolbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.$reload()),
                    {},
                    $u.icon("save").Click(_ => this.formview.form.updateBindings())
                ),
                $u.cols(
                    gridCfg,
                    $u.splitter(),
                    this.formview.$config().Size(300),
                )
            );
            return view;
        }

        $init() {
            super.$init();
            this.formview.form.bind(this.grid);
        }

        $reload(id?) {
            super.$reload(id);
            let list = db.list();
            this.grid.refresh(list);
        }

        //activate(query, first: boolean) {
        //    super.activate(query, first);
        //    if (!first) this.grid.refresh();
        //}
    }


}