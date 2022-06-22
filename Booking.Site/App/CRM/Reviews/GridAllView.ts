module reviews {

    /** Просмотр всех отзывов для модерации */
    export class GridAllView extends $u.View {

        protected grid = new $u.RefGrid();
        protected filterForm = new $u.RefForm();
        protected form = new $u.RefForm();
        protected ansForm = new $u.RefForm();
        private msglist = new $u.RefList();

        $config() {
            let grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template(It.symbols.calendar.link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("domain").Header("Партнер", -1).Sort().Filter(),
                    $u.column("client").Header("Клиент", 100).Sort().Filter().Template($u.getViewLink("clients", "#client#", "#clientId#") ),
                    $u.column("base").Header("База", -1).Sort().Filter(),
                    $u.column("room").Header("Комната", -1).Sort().Filter(),
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("status").Header("Статус брони").AsSelect(orders.statuses).Sort().Filter(),
                    $u.column("rstatus").Header("Статус").AsSelect(statuses).Sort().Filter(),
                    $u.column("groupId").Header("Правило").AsSelect(groups.db.names(groups.GroupType.Reviews)).Sort().Filter(),
                    $u.column("value").Header("Оценка").Sort().AsInt().Footer({ content: "avgColumn" }),
                    $u.column("text").Header("Отзыв", -3).Sort().Filter(),
                ],
                scheme: {
                    //productId: 0,
                    $init: function (obj) {
                        orders.logic.getStateCss(obj);
                        //obj.date = parseDate(obj.date); //set value based on some data in incoming dataset
                    },
                },

                save: db.getSaveCfg(true),
            }).Editable().Footer();

            let filter = this.filterForm.config().extend({
                cols: [
                    //$u.element("date").Label("На дату", null, 60).Size(170).AsDate(),
                    $u.element("date1").Label("Дата с", null, 60).Size(170).AsDate(),
                    $u.element("date2").Label("По", null, 30).Size(140).AsDate(),
                    $u.element("statuses").Label("Статусы", null, 60).AsMultiSelect(statuses).Size(-1).Value([ReviewStatus.Moderate]),
                    $u.button("Найти").Click(() => this.reload()),
                    $u.button("Ответить").PopupCfg(this.ui_answer()), //.Popup(this.ui_answer(), _ => this.onAnswerShow()),
                ]
            }); 


            let view = $u.rows(
                filter,
                grid
            );

            return view;
        }

        private ui_answer() {
            let me = this;
            let row = null;

            function onAnswerShow(ax) {
                row = me.grid.getSelectedItem();
                if (!row) return webix.message("Не выделена запись", "debug");
                me.form.setValues(row);
                let list = messages.db.list({ order: row.orderId, kind: messages.MessageKind.Review, desc:false });
                me.msglist.refresh(list);
            }

            let form = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("domain").Label("Партнер"),
                    $u.element("base").Label("База"),
                    $u.element("room").Label("Комната"),
                    $u.element("client").Label("Клиент"),
                    //$u.element("groupId").Label("Правило").AsSelect(groups.db.names(groups.GroupType.Reviews)),
                    $u.element("text").Label("Текст сообщения").AsTextArea(100),
                ],
            }).Readonly(true).Disable(true);

            let msglist = this.msglist.config().extend({
                template: 'http->' + It.Web.WebSource.base + '/html/message-list.html',
                type: {
                    href: "#!",
                    height: "auto",
                    d: x => webix.i18n.fullDateFormatStr(x.date),
                },
            }).Max(-1, 300).Scrollable();

            let ansform = this.ansForm.config().extend({
                width: 400,
                elements: [
                    //$u.element("group").Label("Правило").AsSelect(groups.db.names(groups.GroupType.Reviews)),
                    $u.element("text").Label("Текст ответа партнеру").AsTextArea(100).Require(),
                    $u.cols(
                        $u.button("Обработать").Click(_ => this.reply(ReviewStatus.Processed)),
                        //$u.button("Ответить пользователю").Click(_ => this.reply(ReviewStatus.Ok)),
                        $u.button("Удалить").Click(_ => this.reply(ReviewStatus.Cancel)),
                        {},
                    ),
                ],
            });

            let view = $u.rows(
                $u.label("Форма ответа модератора").Css('w3-panel w3-large w3-theme-l5'),
                form,
                msglist,
                ansform,
                {height: 40},
            );

            let popup = $u.popup(view).On('onShow', onAnswerShow);

            return <any>popup;
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.reload();
        }

        reload(args?) {
            let filter = this.filterForm.values();
            filter.all = true;
            let data = db.list(filter);
            this.grid.refresh(data);
        }

        private reply(status: ReviewStatus) {
            if (!this.ansForm.validate()) return;

            let item = this.grid.getSelectedItem();
            if (!item) return webix.message("Не выделена запись", "debug");

            let vals = this.ansForm.values();
            let res = db.reply({ review: item.id, text: vals.text, status: status });
            this.ansForm.clear();
            this.reload();

            webix.message("Сообщение успешно отправлено");
        }
    }

   
}