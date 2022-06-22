module resources {

    export class PhonesView extends $u.View {

        constructor(public kind: ResourceKind, public caption) {
            super();
        }

        private grid = new $u.RefGrid();
        private view = new $u.RefUI();

        $config(edit = true) {
            super.$config();

            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Тип", 100).AsSelect(phoneTypes).Sort().Edit(),
                    $u.column("value").Header("Телефон", -1).Edit().extend({format:"###", pattern: "(###) ###-##-##" }),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    kind: this.kind,
                },
                type: {
                    href: "#!",
                },

                rules: {
                    "value": (value, row) => {
                        let err = db.testPhone(row.id, value);
                        if (!err) return true;
                        It.UI.w.info(err);
                        return false;
                    },
                },

                //url: db.itemsUrl,
                save: db.getSaveCfg(true),
            }).Editable().Disable(!edit);

            let view = $u.rows(
                $u.panelbar(
                    $u.label(this.caption),
                    this.grid.btnAdd().Visible(edit),
                    this.grid.btnDel().Visible(edit),
                    //this.grid.btnRefresh(),
                    //this.grid.btnSave,
                    {}
                ),
                gridCfg
            ).Ref(this.view);
            return view;
        }

        $reload(id) {
            super.$reload(id);

            this.grid.scheme({ objectId: id, kind: this.kind });
            let res = db.getItems(this.kind, id);
            this.grid.refresh(res);
        }

        enable(enabled: boolean) {
            this.view.enable(enabled);
        }

    }
}