module equipments {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        private form = new EditForm();

        $config() {
            super.$config();

            let grid = this.grid.config().extend({
                tooltip: true,
                columns: [
                    $u.column("groupId").AsSelect(groups.db.names(groups.GroupType.Equipment)).Header("Тип", 90).Sort().Filter().Tooltip("Выберите тип позиции, для дополнительных услуг используйте тип «Другое»"),
                    //$.column("roomId").AsSelect(models.rooms.names).Header("Комната", 150).Sort().Filter(),
                    $u.column("name").Header("Название", -1).Sort().Filter().Tooltip("Введите название позиции в формате «Электрогитара Gibson SG»"),
                    $u.column("Kind").Header("Тип", 100).AsSelect(eqKinds).Filter().Edit(),
                    $u.column("price").Header("Цена").AsInt().Sort().Filter().Tooltip("Укажите цену за позицию.<br> Если оборудование предоставляется бесплатно введите «0»"),
                    $u.column("count").Header("Кол").AsInt().Sort().Filter().Tooltip("Укажите фактическое количество для позиции одного наименования на объекте.<br>Это поможет избежать бронирования одного и того же наименования несколькими клиентами"),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 150).Sort().Filter().Tooltip(" Выберите объект на котором предоставляется выбранное наименование позиции"),
                    //$.column("description").Header("Описание", -1).Filter().Tooltip("Введите описание оборудования или его особенности. Клиентам в приложении эта информация не отображается.<br> Описание используется для вашего удобства, например, когда меняли струны на гитаре, или привезли новую тарелку"),
                    $u.column("destKind").Header("Назначение",100).AsSelect(destKinds).Filter().Edit(),
                    $u.column("allowMobile").Header("Моб").AsCheckboxReadly().Sort().Tooltip("Используйте галочку «моб» для публикации или удаления выбранной позиции в мобильном приложении"),
                    //$u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                },

                //url: db.listUrl,
                save: db.getSaveCfg(true),
            });

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.refresh()),
                    {},
                    $u.button("Сохранить").Click(() => this.form.form.updateBindings()),
                ),

                $u.cols(
                    grid,
                    this.form.config().Size(350),
                ),
            );
            return view;
        }

        $init() {
            super.$init();
            this.form.form.bind(this.grid);
        }

        //activate(query, first: boolean) {
        //    super.activate(query, first);
        //    if (!first) this.grid.refresh();
        //}

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }

        refresh() {
            var data = db.list();
            this.grid.refresh(data);
        }
    }


}