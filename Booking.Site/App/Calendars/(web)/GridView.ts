module calendars {

    export class GridView extends $u.View {

        private grid = new $u.RefGrid();
        private createForm: CreateView = new CreateView(this).onAction(vals => this.create(vals));
        private editForm: EditView = new EditView(this);

        $config() {
            super.$config();

            let w = 100;
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("[x]").AsCheckboxReadly(),
                    $u.column("provider").Header("Источник", 120).AsSelect(calendarSources),
                    $u.column("description").Header("Описание", -1),
                    $u.column("roomId").Header("Комната", w).AsSelect(rooms.db.names()),
                    $u.column("minDate").Header("Обновлен", -1).AsDate(webix.i18n.fullDateFormatStr),
                    $u.column("watchStatus").Header("Push").AsSelect(watch_statuses),
                    $u.column("attemtps").Header("Попыток").AsInt(),
                ],
                scheme: {
                    //id: -1,
                },

                save: db.getSaveCfg(true),
            }).Editable();

            let toolbar = $u.panelbar(
                //this.grid.btnAdd(),
                $u.icon("plus-circle").Popup(this.createForm.$config()).Tooltip("Добавить календарь"),
                this.grid.btnDel(),
                this.grid.btnRefresh(() => this.reload()),
                $u.icon("cloud-download").Click( _ => this.sync()).Tooltip("Синхронизировать выделенные календари"),
                $u.icon("cloud-upload").Click(_ => this.sync(true)).Tooltip("Тестировать PUSH-синхронизацию для выделенных календарей"),
                {});

            let view = $u.rows(
                toolbar,
                $u.cols(
                    gridCfg,
                    $u.splitter(),
                    this.editForm.$config().Size(380),
                ),
            );

            this.editForm.onCalendarLink.on(() => this.reload());

            return view;
        }


        $init() {
            super.$init();
            this.editForm.bind(this.grid);
        }

        $activate(args) {
            super.$activate(args);
            this.reload();
        }

        reload() {
            let list = db.list();
            this.grid.refresh(list);
        }

        private create(vals) {
            //let item = db.save(vals);
            //item.text = vals.text;
            //item.date = new Date();
            //item.url = "";
            //item.lastMsg = { date: new Date(), text: "создана заметка", login: "", };
            //this.list.callNoEvents(() => this.list.add(item, 0));
            let row = this.grid.add(vals);
            //setTimeout(() => this.list.updateCurrent(item), 1500);
        }

        private sync(last = false) {
            let ids = this.grid.getSelectedIds();
            let res = db.sync({ ids, last });
            this.reload();
            alert("Календарь успешно обновлен с результатом: " + res);
        }


    }


}