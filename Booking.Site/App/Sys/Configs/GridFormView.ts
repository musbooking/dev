module configs {

    export class GridFormView extends $u.View {

        private grid = new $u.RefGrid();
        private crform = new $u.RefForm();
        private edform = new $u.RefForm();

        $config() {
            super.$config();

            let grid = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Параметр", -1).Sort().Edit(),
                    $u.column("description").Header("Описание", -3).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),                ],
                scheme: {  
                    id: -1,
                },

                //data: db.list(),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.toolbar(
                    $u.icon("plus-circle").Popup(this.ui_create()),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.reload()),
                    {},
                    $u.button("Обновить сервер").Click(_ => this.reset()),
                ),
                $u.cols(
                    grid,
                    this.ui_form(),
                )
            );
            return view;
        }

        //activate(query, first: boolean) {
        //    super.activate(query, first);
        //    if (!first) this.grid.refresh();
        //}

        $init() {
            this.edform.bind(this.grid);
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.reload();
        }

        private ui_form() {
            let form = this.edform.config().extend({
                gravity: 0.7,
                elements: [
                    $u.cols(
                        $u.button("Сохранить").Click(() => this.save()),
                        //{ view: "button", value: "Закрыть", click: () => this.form.close(), width: 90, },
                        {},
                    ),
                    $u.element("name").Label("Параметр"),
                    $u.element("description").Label("Описание").AsTextArea(120),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),

                    $u.element("asBool").Label("Флаг").AsCheckbox(),
                    $u.element("asDate").Label("Дата").AsDate(),
                    $u.element("asLong").Label("Целое").AsInt(),
                    $u.element("asMoney").Label("Деньги").AsNumber(),
                    $u.element("asNumber").Label("Число").AsNumber(),
                    $u.element("asText").Label("Текст").AsTextArea(100),

                    $u.element("asVal").Label("Партнеры", "top").AsMultiSelect(domains.db.names()),
                    $u.element("asVal1").Label("Источники", "top").AsMultiSelect(orders.sourceTypes),
                    $u.element("asVal2").Label("Базы (только чтение)", "top").AsTextArea(150).Readonly(),
                    $u.element("asVal3").Label("Комнаты", "top").AsTextArea(150),

                    {},
                ],
            });
            return form;
        }


        private ui_create() {
            let form = this.crform.config().extend({
                gravity: 0.7,
                elements: [
                    $u.element("name").Label("Параметр", "top"),
                    $u.element("description").Label("Описание").AsTextArea(70),
                    {},
                    $u.cols(
                        {},
                        $u.button("Создать").Click(() => this.create()),
                    ),
                ],
            });
            return form;            
        }

        private create() {
            let vals = this.crform.values();
            this.grid.add(vals);
            this.crform.clear();
        } 
         
        private save() {
            this.edform.updateBindings();
        }

        private reload() {
            let list = db.list();
            this.grid.refresh(list);
        }

        private reset() {
            db.reset();
            webix.message("Параметры обновлены");
        }
    }

}