module expenses {
    
    /** edit base */
    export class EditView extends $u.View {

        private form = new $u.RefForm();
        private grid = new $u.RefGrid();
        private messagesView: messages.ListView = new messages.ListView(this);
        private groups: any[];

        $config() {
            super.$config();
            this.groups = groups.db.names(groups.GroupType.Expense, true);

            let gridPanelCfg = $u.rows(
                $u.toolbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    $u.label("Распределение по статьям, сохраняются по кнопке 'Сохранить'").Size(-1),
                    {}
                ),
                this.grid.config().extend({
                    //height: 200,
                    columns: [
                        $u.column("groupId").Header("Статья", 200).AsSelect(this.groups).Edit(),
                        $u.column("amount").Header("Стоимость", 100).Edit().Footer({ content: "summColumn" }),
                        $u.column("description").Header("Описание", -1).Edit(),
                    ],
                    scheme: {
                        //name: "без имени",
                        //groupId: g[0],
                    },
                    rules: {
                        "groupId": webix.rules.isNotEmpty,
                    },
                }).Editable(itemsdb.getSaveCfg(false)).Footer()
            );

            let allowAdmin = system.context.allow(auth.oper.expDocsAdmin);

            let view = this.form.config().Labels(100).extend({
                elements: [
                    $u.cols(
                        $u.button("Сохранить").Click(() => this.save()),
                        {}
                    ),
                    $u.element("baseId").Label("База").AsSelect(bases.db.names(true)).Require(null, !allowAdmin).Css("it-warning"),
                    $u.element("date").Label("Дата").AsDate().Disable(!allowAdmin).Css("it-warning"),
                    //$.cols(
                    //    $.element("date").Label("Дата").AsDate().Require().Css("it-warning"),
                    //    //$.element("totals").Label("Сумма").AsNumber().Disable()
                    //),
                    $u.cols(
                        $u.element("isPublic").Label("Отразить в отчетах").AsCheckbox(true).Tooltip("Расходы проведены для отражения в статистике").Css("it-warning"),
                        $u.element("isArchive").Label("Архив").AsCheckbox(true)
                    ),
                    $u.element("description").Label("Описание").AsTextArea(100),

                    $u.tabview()
                        .Tab("Статьи", gridPanelCfg)
                        .Tab("История", this.messagesView.$config())
                        .Autoheight()
                ],
            });

            return view;
        }

        $reload(id) {
            super.$reload(id);
            let vals = this.form.load(db.getUrl(id));
            let items = vals.items; //resources.db.getItems(resources.ResourceKind.BaseCamera, id);
            this.grid.refresh(items);
            this.grid.scheme({
                expenseId: id,
                groupId: this.groups.length > 0 ? this.groups[0].id : null,
            });

            this.messagesView.filter.expense = id;
            this.messagesView.refresh();
            this.messagesView.setDefaults({ expenseId: id });
        }

        private save() {
            if (!this.form.validate()) return;
            let s = 0;
            this.grid.save();
            //this.grid.forEach(x => s += parseInt(x.amount));
            //this.form.elements.totals.setValue(s);
            this.form.save(db.saveUrl(this.objectId), false);
            webix.message("Данные сохранены на сервере");
        }

    }

}