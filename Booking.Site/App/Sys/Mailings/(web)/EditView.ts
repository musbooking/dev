module mailings {
    
    /** edit base */
    export class EditView extends $u.View {

        private form = new $u.RefForm();
        private grid = new $u.RefGrid();
        //private messagesView: messages.ListView = new messages.ListView(this);
        //private groups: any[];

        $config() {
            super.$config();

            //this.groups = groups.db.names(groups.GroupType.Expense, true);

            let gridPanelCfg = $u.rows(
                $u.toolbar(
                    // this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this._reload_jobs(this.objectId)),
                    //$u.label("Распределение по статьям, сохраняются по кнопке 'Сохранить'").Size(-1),
                    {}
                ),
                this.grid.config().extend({
                    //height: 200,
                    columns: [
                        $u.column("status").Header("Статус").AsSelect(jobs.statuses).Filter().Edit(),
                        $u.column("date").Header("Дата", 120).AsDate(webix.i18n.fullDateFormatStr),
                        $u.column("attempts").Header("Попыток").AsNumber().Filter(),
                        $u.column("description").Header("Описание", -1).Edit().Filter(),
                    ],
                    scheme: {
                        //name: "без имени",
                        //groupId: g[0],
                    },
                    rules: {
                        "status": webix.rules.isNotEmpty,
                    },
                }).Editable(jobs.db.getSaveCfg(true)).Footer()
            );

            let temps = templates.db.names({ key: templates.TemplateKind.Manual })
            

            let view = this.form.config().Labels(100).extend({
                elements: [
                    $u.cols(
                        $u.button("Сохранить").Click(() => this.save()),
                        $u.button("Разослать").Click(() => this.send()),
                        {}
                    ),
                    $u.element("name").Label("Название"), //.AsDate().Disable(!allowAdmin).Css("it-warning"),
                    $u.cols(
                        $u.rows(
                            $u.element("templateId").Label("Шаблон").AsSelect(temps).Require(),
                            $u.element("fromDate").Label("Старт с").AsDate(true),
                            $u.element("status").Label("Статус").AsSelect(statuses).Readonly(),
                            $u.element("description").Label("Описание").AsTextArea(100),
                            $u.element("isArchive").Label("Архив").AsCheckbox(),
                        ),
                        $u.element("values").Label("Почтовые адреса").AsTextArea(400)

                    ),

                    $u.tabview()
                        .Tab("Рассылка", gridPanelCfg)
                        //.Tab("История", this.messagesView.$config())
                        .Autoheight()
                ],
            });

            return view;
        }

        $reload(id) {
            super.$reload(id);
            let vals = this.form.load(db.getUrl(id));
            this._reload_jobs(id);

            //this.grid.scheme({
            //    expenseId: id,
            //    groupId: this.groups.length > 0 ? this.groups[0].id : null,
            //});

            //this.messagesView.filter.expense = id;
            //this.messagesView.refresh();
            //this.messagesView.setDefaults({ expenseId: id });
        }

        private _reload_jobs(id: guid) {
            //id ??= this.objectId
            let jblist = jobs.db.list( id )
            this.grid.refresh(jblist)
        }
        
        private save() {
            if (!this.form.validate()) return false; //webix.message("Ошибка в данных 1", "error");

            let s = 0;
            //this.grid.save();
            //this.grid.forEach(x => s += parseInt(x.amount));
            //this.form.elements.totals.setValue(s);
            this.form.save(db.saveUrl(this.objectId), false);
            webix.message("Данные сохранены на сервере");
            return true;
        }

        private send() {
            if (this.save()!=true) return

            db.send(this.objectId)  // отправляем почтовые соощения
            this.$reload(this.objectId )  // перезачитываем задания
            webix.message("Отправлена рассылка")
        }

    }

}