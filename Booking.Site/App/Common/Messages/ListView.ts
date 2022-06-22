module messages {

    export class ListView extends $u.View {
        filter: any = {};

        private list = new $u.RefList();
        private createMsgView: CreateView = new CreateView(this).onAction( vals => this.add(vals));
        private defaulVals;

        setDefaults(vals) {
            this.defaulVals = vals;
        }

        $config() {
            /*let grid = this.grid.config().extend({
                //height: 200,
                columns: [
                    $.column("date").Header("Дата").AsDate(),
                    $.column("sender").Header("Пользователь"),
                    $.column("scope").Header("Доступ").AsSelect(data.scopeTypes).Edit(),
                    $.column("text").Header("Описание", -1).Edit(),
                ],
                scheme: { 
                    name: "новое сообщение",
                },
                rowHeight: 80,
            }).Editable(db.getSaveCfg(true));
            */

            let list = this.list.config().extend({
                template: 'http->'+It.Web.WebSource.base+ '/html/message-list.html',
                type: {
                    href: "#!",
                    height: "auto",
                    d: x => webix.i18n.fullDateFormatStr(x.date),
                },
            }).Editable(db.getSaveCfg(true)).Scrollable();

            let toolbar = $u.toolbar(
                $u.label("Сообщения"),
                $u.button("Добавить").Popup(this.createMsgView.$config()),
                //$.button("Удалить").Click(() => this.del()), заблокировано удаление по просьбе Хоменко, 2018-04-06
                //this.grid.btnAdd(),
                //this.grid.btnDel(),
                //this.pricesGrid.btnRefresh(),
                //this.pricesGrid.btnSave(),
                {}
            );

            return $u.rows(toolbar, list).Size(0,800);
        }

        refresh() {
            //let filter = webix.extend(this.filter, this.filterView.values(), true);
            let items = db.list(this.filter);
            this.list.refresh(items);
        }

        private add(vals) {
            if (this.defaulVals)
                vals = webix.extend(vals, this.defaulVals, true);
            vals.date = new Date();
            this.list.add(vals,0);
            this.createMsgView.$clear();
        }

        //private del() {
        //    if (!confirm("Удалить сообщения?")) return;
        //    let items = this.list.getSelectedItems();
        //    items.forEach(item => {
        //        //if (dateDiff.inDays(item.date) > 1)
        //        //    webix.error("Нельзя удалить сообщение, которые старше 1 дня: " + item.text);
        //        //if (item.senderId != auth.Context.)
        //        //    webix.error("Нельзя удалить сообщение, которые старше 1 дня: " + item.text);
        //        //else
        //        this.list.removeRow(item.id);
        //    });
        //}

    }

}