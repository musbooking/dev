module resources {

    /**
     * Список ресурсов по площадке  
     * https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/31066/
    */
    export class UrlView extends $u.View {

        constructor() {
            super();
        }

        private grid = new $u.RefGrid();

        $config() {
            super.$config();
            let grid = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Тип", 100).AsSelect(urlTypes).Sort().Edit(),
                    $u.column("description").Header("Описание", -1).Edit(),
                    $u.column("value").Header("Ссылка", -1).Edit().Template("#value#".link("#value#", {target: '_blank'})),
                ],
                type: {
                    href: "#!",
                },

                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.header("О площадке".tag("b"), 
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                ),
                grid,
            );

            return view;
        }

        $reload(id) {
            super.$reload(id);

            this.grid.scheme({ objectId: id, kind: resources.ResourceKind.RoomUrl });
            let res = db.getItems(resources.ResourceKind.RoomUrl, id);
            this.grid.refresh(res);
        }

    }
}