module roles {

    export class GridView extends $u.View {

        grid = new $u.RefGrid();

        $config() {
            super.$config();

            let gridCfg = this.grid.config().extend({
                columns: [
                    //$.column("baseId").AsSelect(models.bases.namesUrl).Header("База", 150).Sort().Edit().Filter(),
                    //$.column("isArchive").Header("[x]").AsCheckbox().Sort().Edit(),
                    $u.column("name").Header("Имя роли", 200).Sort().Edit().Filter(),
                    $u.column("description").Header("Описания", -1).Sort().Edit().Filter(),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(),
                ],
                scheme: {
                    id: -1,
                },

                data: db.list(),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.toolbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    //this.grid.btnRefresh(),
                    //this.grid.btnSave,
                    {}),
                gridCfg,
            );
            return view;
        }

    }

}