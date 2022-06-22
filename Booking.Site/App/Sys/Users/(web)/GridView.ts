module users {

    export class GridView extends $u.View {

        grid = new $u.RefGrid();

        $config() {
            super.$config();

            let editable = system.context.allowCrmEdit()

            let grid = this.grid.config().extend({
                columns: [
                    //$.column("baseId").AsSelect(models.bases.namesUrl).Header("База", 150).Sort().Edit().Filter(),
                    $u.column("login").Header("Логин", 100).Sort().Edit(),
                    $u.column("phone").Header("Телефон", 100).Sort(),
                    $u.column("email").Header("E-mail", -1).Sort(),
                    $u.column("fio").Header("ФИО", -1).Sort().Edit(),
                    $u.column("fcm").Header("Push ID").Sort().Edit(),
                    $u.column("isConfirmed").Header("Подтв.", 60).AsCheckboxReadly().Sort().Visible(!editable),
                    $u.column("isArchive").Header("Блок").Tooltip("Флаг блокировки клиента #login#").AsCheckboxReadly().Sort().Visible(!editable)
                ],
                scheme: {
                    id: -1,
                },

                //url: system.data.users.itemsUrl,
                save: users.db.getSaveCfg(true),
            })

            if (editable) {
                grid.Editable().Columns(
                    $u.column("isConfirmed").Header("Подтв.").AsCheckbox().Sort().Visible(editable),
                    $u.column("isArchive").Header("Блок").Tooltip("Флаг блокировки клиента #login#").AsCheckbox().Sort().Visible(editable),
                )
            }

            //let view = $.rows(
            //    $.toolbar(
            //        //this.grid.btnAdd(),
            //        //$.button("Добавить").Popup(this.creator.config()),
            //        this.grid.btnDel(),
            //        this.grid.btnRefresh(),
            //        //$.button("Пароль").Tooltip("Сгенерировать новый пароль для пользователя").Click(_ => this.reset()),
            //        {}
            //    ),
            //    gridCfg
            //);
            return grid;
        }

        refresh(data) {
            this.grid.refresh(data);
            return this;
        }


    }

}