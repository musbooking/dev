module orders {

    export class ForfeitsGridView extends $u.View {

        private grid = new $u.RefGrid();
        private editor: OrderEditor = new OrderEditor(() => this.refresh());

        $config() { 
            super.$config();
            //let cc = $.column("date").Header("Дата").AsDate();

            let gridCfg = this.grid.config().extend({
                columns: [
                    //$.column("id").AsInt().Header("(Код)", 40).Template("<a href='{common.href}/orders/edit/?oid=#id#'>#id#</a>"),
                    $u.column("date").Header("Дата").AsDate().Sort(),
                    $u.column("time").Header("Время"),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", -1).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", -1).Sort().Filter(),
                    $u.column("forfeit").AsInt().Header("Штраф").Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость").Sort().Footer({ content: "summColumn" }),
                    $u.column("types").Header("Позиция", -1).Sort().Filter(), // .AsMultiSelect(models.equipments.types).Header("Оборудование", 100).Edit()
                    $u.column("client").Header("Клиент", -1).Sort().Filter().Template(clients.getClientColumnTemplate()),
                    $u.column("text").Header("Описание", -1).Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date); //set value based on some data in incoming dataset
                        //obj.time = 
                    },
                },

                //url: models.orders.url("list", { status: models.OrderStatus.Cancel, reason: models.CancelReason.ForfeitsAskConfirm }),
                //url: db.itemsUrl(this.status, this.reason),
            }).Footer();

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
            let res = db.list({ forfeits: true, reason1111: CancelReason.ForfeitsConfirmed }); 
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

