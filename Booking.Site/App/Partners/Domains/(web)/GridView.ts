module domains {

    export class GridView extends $u.View {

        /**  Установка параметров для набора доменных зон         */
        private setProps(vals: any): void {
            let sel_ids = this.grid.getSelectedIds();
            if (sel_ids.length == 0) return alert('Не выделены записи')
            if (!confirm(`Изменить параметры для ${sel_ids.length} записей?`)) return

            //alert(JSON.stringify(vals))
            for (var id of sel_ids) {
                vals.id = id
                db.save(vals)
            }
            this.reload()
            alert('Выделенный список обновлен');
        }

        private grid = new $u.RefGrid()
        private edform: EditForm = new EditForm()
        private fform = new $u.RefForm()
        private popupForm: PopupForm = new PopupForm().onAction(vals => this.setProps(vals));

        $config() {
            super.$config();

            let grid = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 1,
                columns: [
                    //$u.column("name").Header("Партнерская зона", 100).Sort(),
                    $u.column("name").Header("Партнер", 140).Template($u.getViewLink("domains", '#name#')).Sort().Filter().Footer({ content: "countColumn" }),
                    $u.column("status").Header("Статус").AsSelect(statuses).Sort().Filter().Edit(),
                    //$.column("name").Header("Зона доступа", -1).Sort().Edit().Template("<a href='{common.href}/domains/edit/?oid=#id#'>#name#</a>"),
                    //$u.column("allowShare").Header("Глав").AsCheckboxReadly().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("tarifId").Header("Тариф",130).AsSelect(tarifs.db.names()).Sort().Filter(),
                    $u.column("cityId").Header("Город").AsSelect(groups.db.names(groups.GroupType.City)).Sort().Filter(),
                    $u.column("debtComm").Header("Долг", 60).AsInt().Footer({ content: "summColumn" }).Sort(),
                    $u.column("lastComm").Header("Прошл.ком", 60).AsInt().Footer({ content: "summColumn" }).Sort(),
                    $u.column("currComm").Header("Тек.ком", 60).AsInt().Footer({ content: "summColumn" }).Sort(),
                    //$.column("rate").Header("Тек.тариф").AsInt().Edit(),
                    $u.column("createDate").Header("Создано.").AsDate().Sort(),
                    $u.column("initDate").Header("Иниц.").AsDate().Sort(),
                    $u.column("limitDate").Header("Срок").AsDate().Sort(),
                    $u.column("terminal").Header("Терминал", 140).Sort().Filter(),
                    $u.column("owners").Header("Ответственные", 240).Sort().Filter(),
                    $u.column("spheres").Header("Сферы",440).Sort().Filter(),
                    //$.column("nextRate").Header("След.тариф").AsInt().Edit(),
                    //$.column("balance").Header("Баланс").AsInt().Edit(), 
                    //$.column("description").Header("Описание"),
                ],
                scheme: {
                    $change: domain_css,
                },

                //data: db.loadItems(),
                save: db.getSaveCfg(true),
            }).Editable().Footer();

            let toolbar = $u.panelbar(
                this.grid.btnAdd(),
                this.grid.btnDel(),
                $u.button('Фильтр').Popup(this.$config_filter()),
                $u.button("Изменить").Popup(this.popupForm.$config().Size(500)),
                $u.button('Обновить').Click(() => this.reload()),
                $u.button("Иниц.").Tooltip("Создать права и админа").Click(() => this.initDomains()),
                $u.button("Пароль").Tooltip("Сбросить пароль админа").Click(() => this.resetPassword()),
                $u.button("Тест").Tooltip("Тестирование сервиса смены статусов").Click(() => this.testJob()),
                {},
                $u.button("Сохранить").Click(() => this.save()),
                //$.button("Пересчитать").Click(() => this.recalc()),
            );

            let view = $u.rows(
                toolbar,
                $u.cols(
                    grid,
                    this.edform.config().Size(350)
                )
            );
            return view;
        }

        private $config_filter() {
            let fform = this.fform.config().Labels(0,'top').extend({
                elements: [
                    $u.element('spheres').Label('Сферы').AsMultiSelect(spheres.db.names()),
                    $u.element('name').Label('Ответственный (ФИO,mails,login)'),
                    $u.element('sources').Label('Источники').AsMultiSelect(orders.sourceUserTypes),
                    $u.element('statuses').Label('Статус').AsMultiSelect(statuses),
                    $u.element('archive').Label('Показать с флагом Архив =').AsSelect(app.booleans),
                    $u.cols(
                        $u.button("Найти").Click(_ => this.reload()),
                        $u.button("Очистить").Click(_ => this.fform.clear()),
                        {},
                    ),
                ],
            });
            return fform;
        }


        $init() {
            super.$init();
            this.edform.form.bind(this.grid);
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.reload();
        }

        private initDomains() {
            let items = this.grid.getSelectedItems();
            items.forEach(item =>
                db.init(item.id, false)  // 58623 -item.allowShare AlloShare всегда false, передаем для совместимости 
            );

            webix.alert("Инициализированы выделенные партнерские зоны и созданы права по умолчанию");
            this.reload();
        }

        private resetPassword() {
            let curr = this.grid.getSelectedItem();
            if (!curr) return webix.message("Выделите запись");
            if (!confirm("Создать новый пароль для администратора зоны?")) return webix.message("Отмена действия");

            let res = db.reset(curr.id);
            webix.alert(`Администратор зоны, Login: ${res.login}, Password: ${res.password}`);
        }

        private testJob() {
            //this.save();
            db.job();
            this.reload();
            webix.message("Обработка статусов успешно выполнена");
        }

        private reload() {
            let filter = this.fform.ref ? this.fform.values() : {};
            let list = db.list(filter);
            this.grid.refresh(list);
        }

        private save() {
            this.edform.form.updateBindings();
        }

        //private recalc() {
        //    if (!this.form.form.validate()) return;

        //    this.save();
        //    let curr = this.grid.getSelectedItem();
        //    if (!curr) return webix.message("Выделите запись");  
        //    webix.confirm("Пересчитать текущую доменную зону?", x => {
        //        if (!x) return webix.message("Отмена действия");
        //        let res = paydocs.db.recalc(curr.id);
        //        // пересчитываем и обновляем 1 запись
        //        let row = db.list({ domain: curr.id });
        //        if(row && row[0])
        //            this.grid.callNoEvents(_ => this.grid.updateRow(curr.id, row[0]) );
        //        webix.alert(`Доменная зона пересчитана`);
        //    });
        //}

    }


}