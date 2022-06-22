module orders {

    export class AskGridView extends $u.View {

        // GridView(true, docs.DocumentStatus.Cancel, CancelReason.ForfeitsAskConfirm);
        //constructor(public autorefresh = false, public status?: docs.DocumentStatus, public reason?: CancelReason) {
        //    super();
        // }
         
        private grid = new $u.RefGrid();
        private editor: OrderEditor = new OrderEditor(() => this.refresh());
        private timerid = setInterval(() => this.checkUpdates(), 60*1000);

        private checkUpdates() {
            let res = db.forfeitUpdates.has();
            if (res) {
                db.forfeitUpdates.reset();
                It.UI.w.info("Получен новый штраф для подтверждения");
            }
        }

        $config() { 
            super.$config();
            //let cc = $.column("date").Header("Дата").AsDate();

            db.forfeitUpdates.reset("forfeit-" + system.context.domainId);

            let gridCfg = this.grid.config().extend({
                columns: [
                    //$.column("id").AsInt().Header("(Код)", 40).Template("<a href='{common.href}/orders/edit/?oid=#id#'>#id#</a>"),
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", -1).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", -1).Sort().Filter(),
                    $u.column("fullForfeit").AsInt().Header("Штраф").Sort(),
                    $u.column("totalSum").AsInt().Header("Стоимость").Sort(),
                    $u.column("types").Header("Позиции", -1).Sort().Filter(), // .AsMultiSelect(models.equipments.types).Header("Оборудование", 100).Edit()
                    $u.column("client").Header("Клиент", -1).Sort().Filter().Template(clients.getClientColumnTemplate()),
                    $u.column("text").Header("Описание", -1).Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date); //set value based on some data in incoming dataset
                    },
                },

                //url: models.orders.url("list", { status: models.OrderStatus.Cancel, reason: models.CancelReason.ForfeitsAskConfirm }),
                //url: db.itemsUrl(this.status, this.reason),
            });

            let view = $u.rows(
                $u.panelbar(
                    //this.grid.btnAdd(),
                    //this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.refresh()),
                    //this.grid.btnSave,
                    $u.button("Открыть").Click( () => this.open() ),
                    {}),
                gridCfg
            );
            return view;
        }

        $activate(args) {
            super.$activate(args);
            //if (!this.first && this.autorefresh)
            this.refresh();
        }

        private refresh() {
            let res = db.list({ status1: orders.OrderStatus.Reserv, reason: CancelReason.ForfeitsAsk }); // GridView(true, docs.DocumentStatus.Cancel, );
            this.grid.refresh(res);
            webix.message("Данные обновлены");
        }

        private open() {
            let item = this.grid.getSelectedItem();
            if (!item) return;
            this.editor.edit(item.id);
        }

    }

}

