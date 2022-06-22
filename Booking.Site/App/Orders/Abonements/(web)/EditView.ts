module abonements {

    /** edit base */
    export class EditView extends $u.View {

        private form = new $u.RefForm();
        private ordersGrid = new $u.RefGrid();
        private ordersForm = new $u.RefForm();
        //private searchView = new clients.SearchView();
        private wizard = new CreateWizard();
        private editor: orders.OrderEditor = new orders.OrderEditor(() => this.refreshGrid());
        private messagesView:messages.ListView  = new messages.ListView(this);

        private buttons = {
            //find: new $.RefUI(),
            create: new $u.RefUI(),
            createWizard: new $u.RefUI(),
            recalc: new $u.RefUI(),
            reserv: new $u.RefUI(),
            paid: new $u.RefUI(),
            close: new $u.RefUI(),
            save: new $u.RefUI(),
        };

        $config() {
            super.$config();

            let me = this;
            //this.searchView.onSelect = (client) => this.clientUpdate(client);
            this.wizard.onCreate = () => this.create();

            let bar = $u.cols(
                //$.button("Найти клиента").Popup(this.searchView.config()).Ref(this.buttons.find),
                $u.button("Сохранить").Click(() => this.save(true)),
                $u.button("Удалить").Click(() => this.delete()).Hidden(!logic.allowDelete()),
                {}
            );

            let formCfg = this.form.config().Labels(120).extend({
                elements: [
                    clients.getSearchColumn().OnChange(id => this.clientUpdate(id)),
                    $u.cols(
                        $u.rows(
                            //$.element("clientBitrixNum").Label("Клиент в Битрикс").AsSearch(() => this.clientSearch(), "Введите код Битрикс-24"),
                            //$.element("client").Label("Клиент").AsTextArea(60).Require().Readonly(),
                            $u.cols(
                                $u.element("dateFrom").Label("Начало").AsDate().Size(250),
                                $u.element("baseId").Label("База", null, 70).AsSelect(bases.db.names(true)).OnChange((id) => me.updateBase(id)).Require(),
                                $u.element("baseType").Visible(false)
                            ),
                            $u.cols(
                                $u.element("dateTo").Label("Окончание").AsDate().Size(250),
                                $u.element("roomId").Label("Комната", null, 70).AsSelect2([]).Require().OnChange(() => me.updateUI())
                            ).Size(-1),
                            //$.cols(        
                            //    { minWidth: 300, gravity: 1 },
                            //    $.element("group").Label("Группа", 90).AsSelect(orders.orderGroupKinds).Require().OnChange(() => me.updateUI())
                            //),
                            //$.element("group").Label("Группа").AsSelect(orders.orderGroupKinds).Require().OnChange(() => me.updateUI()),
                            $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()).OnChange(() => me.updateUI()),
                            $u.element("equipments").Label("Позиции").AsMultiSelect([]).OnChange(() => me.updateUI()),
                            $u.element("promoId").Label("Промоакция").AsSelect(promo.db.names(true, promo.PromoKind.Action)),
                            {}
                        ).Size(-1),

                        $u.rows(
                            $u.element("clientDiscount").Label("Скидка клиента").AsNumber().Disable(),
                            $u.element("discount").Label("Скидка абонем.").AsNumber().Disable().Tooltip("Временно заблокировано"),
                            $u.element("totalReserv").Label("Резерв").AsNumber().Disable(),
                            $u.element("totalPaid").Label("Оплата").AsNumber().Disable(),
                            $u.element("forfeit").Label("Штраф тек.").AsNumber().Css("it-mark").Disable(),
                            $u.element("totals").Label("Общая стоим.").Css("it-warning").AsNumber().Disable(),
                        ).Size(300)
                    ),
                    $u.element("description").Label("Комментарий").AsTextArea(100),
                ],
            });


            let gridToolbar = $u.toolbar(
                //$.label("Брони"),
                $u.button("Создание").Popup(this.wizard.$config()).Tooltip("Открытие мастера создания брони").Ref(this.buttons.createWizard),
                this.ordersGrid.btnAdd().Ref(this.buttons.create),
                //this.grid.btnDel(),
                $u.icon("minus-circle").Click(() => this.deleteOrders()).Tooltip("Удалить выделенные брони"),
                this.ordersGrid.btnRefresh(() => this.refreshGrid()),
                $u.button("Пересчет").Click(() => this.recalc(false)).Tooltip("Пересчет выделенных броней").Ref(this.buttons.recalc),
                $u.button("Открыть").Click(() => this.openEditor()).Tooltip("Открыть выделенную бронь"),
                $u.button("Зарезервировать").Click(() => this.doAction(orders.OrderAction.Reserv, "Зарезервировать выделенные брони?"))
                    .Tooltip("Резервирование выделенных броней").Ref(this.buttons.reserv),
                $u.button("Оплатить").Click(() => this.doAction(orders.OrderAction.Paid, "Оплатить выделенные брони?"))
                    .Tooltip("Оплата выделенных броней").Ref(this.buttons.paid),
                $u.button("Закрыть").Click(() => this.doAction(orders.OrderAction.Close, "Закрыть выделенные брони?"))
                    .Tooltip("Завершение выделенных броней").Ref(this.buttons.close),
                {},
                $u.button("Сохранить").Click(() => this.updateOrder())
                    .Tooltip("Сохранение данных по брони").Ref(this.buttons.save)
            );

            let ordersGrid = this.ordersGrid.config().extend({
                height: 200,
                columns: [
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    //$.column("baseId").AsSelect(models.bases.namesUrl).Header("База", -1).Sort(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", -1).Sort(),
                    $u.column("payForfeit").Header("Опл-Штр", 40).AsCheckbox(),
                    $u.column("payDate").Header("Дата оплаты").AsDate().Sort(),
                    $u.column("paidForfeit").AsInt().Header("Опл.Штраф", 80).Sort(),
                    $u.column("totalOrder").AsInt().Header("Стоимость", 80).Sort(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус").Sort(),
                    //$.column("text").Header("Текст", 40).Tooltip("#text#"),
                    $u.column("errors").Header("Ошибки", -1), //.Css("it-error").Tooltip("#errors#"),
                    $u.column("idd").Header("*", 30).Template(Symbols.calendar.link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("dateTo").Header("", 1).Size(1),
                ],
                scheme: {
                    abonementId: "",
                    totalOrder: 0,
                    dateFrom: new Date().addDays(1),
                    dateTo: (new Date()).addDays(1),
                    $change: obj => this.setCSS(obj),
                },
            }).Editable(orders.db.getSaveCfg(true)).Tooltip(); //.OnAdd(r=> { r.abonementId = me.objectId });

            let ordersForm = this.ordersForm.config().Labels(120).extend({
                gravity: 0.5,
                elements: [
                    $u.element("dateFrom").Label("Начало").AsDate(true).Require(),
                    $u.element("dateTo").Label("Окончание").AsDate(true).Require(),
                    $u.element("roomId").Label("Комната").AsSelect(rooms.db.namesUrl).Require(),
                    $u.element("promoId").AsSelect(promo.db.names(true, promo.PromoKind.Action)).Label("Промоакция"),
                    $u.element("totalOrder").Label("Сумма").Disable(),
                    $u.element("payDate").Label("Дата опл.").AsDate().Disable(),
                    $u.element("text").Label("Расчеты").AsHtmlLabel(100).Readonly(),
                    $u.element("errors").Label("Ошибки").AsHtmlLabel(100).Css("it-error").Readonly(),
                    {},
                ],
            });

            let ordersCfg = $u.rows(
                gridToolbar,
                $u.cols(
                    ordersGrid,
                    ordersForm
                ).Scrollable()
            );

            let view = $u.rows(
                bar,
                formCfg,
                $u.tabview()
                    .Tab("Брони", ordersCfg)
                    .Tab("История", this.messagesView.$config())
            );

            return view;
        }

        $init() {
            this.ordersForm.bind(this.ordersGrid);
            return { header: "Карточка абонемента", };
        }

        private _Loading = false;

        $reload(id) {
            try {
                this._Loading = true;
                super.$reload(id);
                let url = db.getUrl(id);
                let vals = this.form.load(url);
                this.refreshGrid();

            }
            catch(err) {
                throw err;
            }
            finally {
                this._Loading = false;
                this.updateUI();
            }
            this.ordersForm.clear();
            this.calcTotals();
            // messages
            this.messagesView.filter.abonement = id;
            this.messagesView.setDefaults({ abonementId: id });
            this.messagesView.refresh();
        }

        private openEditor() {
            let item = this.ordersGrid.getSelectedItem();
            if (!item) return;
            this.editor.edit(item.id);
        }

        // apply CSS for items
        private setCSS(obj) {
            if (!obj) return;
            //obj.date = parseDate(obj.date); //set value based on some data in incoming dataset
            orders.logic.getStateCss(obj);
            if (obj.errors) obj.$css = "it-error";
        }

        private updateBase(baseid) {
            let baseType = null;

            if (baseid) {
                let basesCombo = this.form.elements.baseId;
                let bases = basesCombo.getList();
                //let pp = bases. 
                //bases.findById = Array.prototype.findById;
                //let base = bases.findById(item => item.id == baseid, {}).value;
                let base = bases.getItem(baseid);
                //if(base && base.length>0) baseType = base[0].type;
                if (base) baseType = base.type;
            }

            // update equipments, rooms
            let eq = baseid ? equipments.db.names(baseid) : [];
            this.form.elements.equipments.define({ suggest: eq });
            //this.form.elements.equipments.refresh();

            let listRooms = baseid ? rooms.db.names(baseid) : [];
            this.form.elements.roomId.define({ suggest: listRooms });
            //this.form.elements.roomId.refresh();

            this.ordersForm.elements.roomId.define({ suggest: listRooms });

            this.form.setValuesEx({ baseType });
            this.updateUI();
        }

        private updateUI() {
            if (this._Loading) return;

            let vals = this.form.values(); 
            let editable = logic.allowEdit(vals);
            let editableClient = editable && logic.allowEditClient(vals);

            //let eq = vals.baseId ? equipments.db.names(vals.baseId) : [];
            //this.form.elements.equipments.define({ suggest: eq });
            //this.form.elements.equipments.refresh();
            this.form.enable(editable, "dateFrom");
            this.form.enable(editable, "dateTo");
            this.form.enable(editable, "baseId");
            this.form.enable(editable, "roomId");
            //this.form.visible(logic.allowGroup(vals), "group");
            //this.form.visible(logic.allowForfeit(vals), "forfeit");
            //this.form.enable(editable, "equipments");
            //this.form.enable(editable, "group");
            //this.form.enable(editable, "description");
            //this.form.enable(editable, "");

            this.form.enable(editableClient, "clientId");
            this.ordersForm.enable(logic.allowOrderEdit(vals));
            //this.buttons.find.visible(editableClient);
            this.buttons.save.visible(logic.allowOrderEdit(vals));
            this.buttons.create.visible(logic.allowOrderCreate(vals));
            this.buttons.createWizard.visible(logic.allowOrderCreate(vals));
            this.buttons.recalc.visible(logic.allowOrderRecalc(vals));
            this.buttons.reserv.visible(logic.allowOrderReserv(vals));
            this.buttons.paid.visible(logic.allowOrderPay(vals));

            this.ordersGrid.scheme({
                abonementId: vals.id,
                roomId: vals.roomId,
                baseId: vals.baseId,
                clientId: vals.clientId,
                //equipments: vals.equipments,
                discount: vals.clientDiscount,
                options: vals.options,
                dateFrom: '',
                dateTo: '',
            });
        }

        private create() {
            if (!this.form.validate()) return;
            let vals = this.form.values();

            let items = this.wizard.create(vals.dateFrom, vals.dateTo);
            if (!items) return;

            let rows = [];
            let grid = this.ordersGrid;
            items.forEach((item) => {
                let row = {
                    dateFrom: item.dateFrom,
                    dateTo: item.dateTo,
                    baseId: vals.baseId,
                    roomId: vals.roomId,
                    clientId: vals.clientId,
                    payForfeit: true,
                    //equipments: vals.equipments,
                    itemsJson: this.eq2items(vals.equipments),
                    discount: vals.clientDiscount,
                    options: vals.options,
                    promoId: vals.promoId,
                };
                // пока блокируем анализ - невостребован, см 51678
                //let err = this.calc_item(row, false)
                //if (err) {
                //    It.UI.message(err, 'error')
                //}
                //else
                {
                    grid.add(row);
                    rows.push(row);
                }
            });
            setTimeout(() => {
                this.calc(rows);  // временно разрешим, см 51678
                this.calcTotals()
                this.save(false);
                webix.message(`Создано: ${rows.length} броней`);
            }, 2000);
        }

        private delete() {
            if (!confirm("Удалить текущий абонемент и все связанные брони?"))
                return webix.message("Отменено удаление");
            if (db.archive(this.objectId)) {
                It.Web.historyBack();
                return webix.message("Бронь успешно удалена");
            }
        }

        //private clientSearch() {
        //    let num = this.form.elements.clientBitrixNum.getValue();
        //    let client = app.bitrix.getClient("ID", num);
        //    this.clientUpdate(client);
        //}

        private clientUpdate(clientId) {
            if (!clientId) return;
            if (clientId.id) return; // клиент ранее уже был загружен, переносить данные не имеет смысла //clientId = clientId.id;
            let client = clients.db.get(clientId);
            if (client.isBanned) {
                this.form.setValuesEx({ clientId: null });
                return It.UI.w.error("Клиент заблокирован!");
            }
            //$.elements.clientBitrixNum.setValue(obj.)
            //this.form.setValues(client);
            console.log('client update:', client)
            this.form.setValuesEx({ clientDiscount: client.discount, promo: client.promoCode, forfeit: client.forfeit })
            this.calcTotals()

            //if (!client) return;
            ////$.elements.clientBitrixNum.setValue(obj.)
            //this.form.setValues({
            //    //clientId: client.id,
            //    //client: client.name,
            //    clientDiscount: client.discount,
            //    forfeit: client.forfeit,
            //});
            //webix.message("Найден клиент, обновлены данные из Битрикс24");
        }

        private updateOrder() {
            if (!this.ordersForm.validate()) return;
            let vals = this.ordersForm.values();
            if (!vals.roomId) return;
            //setTimeout(() => {
            //});
            let res = this.calc([vals]);
            if (res) {
                return It.UI.error(res)
            }
            this.ordersForm.updateBindings();
            //this.save(false);
            this.ordersGrid.save();
        }

        private deleteOrders() {
            let items = this.ordersGrid.getSelectedItems();
            if (items.length == 0) return webix.message("Выделите брони для удаления");

            if (!confirm("Удалить безвозвратно выделенные брони?"))
                return webix.message("Удаление отменено");
            items.forEach(item => {
                if (logic.allowOrderDel(item))
                    this.ordersGrid.removeRow(item.id);
                else
                    It.UI.w.error("Нельзя удалить бронь в статусе или нет прав на операцию");
            })
            this.calc([]);
            this.save(true);
            setTimeout( _ => this.refreshGrid(), 200);
        }

        eq2items(eq: string): string {
            if (!eq) return undefined;
            let eqids = eq.split(',')
            let items = eqids.map(id => ({ eq: id, n: 1 }) )
            let jsitems = JSON.stringify(items)
            return jsitems
        }

        private calc(items: any[]) {
            let me = this;
            let errors = ''
            items.forEach(item => {
                let error = this.calc_item(item)
                item.errors = error
                errors += error
            });
            me.calcTotals();
            return errors
        }

        private calc_item(item, update = true) {
            let me = this
            let id = item.id
            let errors = ""

            if (!logic.allowOrderRecalc(item))
                return It.UI.w.error("Недоступен пересчет для брони " + webix.i18n.dateFormatStr(item.dateFrom));

            if (typeof (item.id) != "string") id = null;
            let order = {
                id: id,
                roomId: item.roomId,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                //equipments: item.equipments,
                itemsJson: item.itemsJson,
                options: item.options,
                clientId: item.clientId,
                //discount: item.discount || 0,
                promoId: item.promoId,
                check: true,
            };
            let res = orders.db.calc(order);
            if (res.errors) {
                item.$css = "it-error"
                item.errors = res.errors
                errors += res.errors + '\n'
            }
            else if (res.isHold) {
                // ничего не делаем
            } else {
                item = webix.extend(item, res, true);
                item.totalSum = item.totalOrder; // исправляем, тк с сервера возвращается значение в totalOrder
                if(update)
                    me.ordersGrid.updateRow(item.id, item);
            }
            this.setCSS(res)
            return errors
        }


        /** Кнопка пересчет */
        private recalc(refresh = true) {
            let items = this.ordersGrid.getSelectedItems() 
            this.calc(items)
            this.save(refresh)
        }

        private calcTotals() {
            let sums: any = {}, totals = 0, n = 0;
            this.ordersGrid.forEach(row => {
                if (!row.totalSum) return;
                if (row.status == orders.OrderStatus.Cancel) return
                //if (!row.totalOrder || row.status != models.OrderStatus.Reserv && row.status != models.OrderStatus.Paid) return;
                let s = parseInt(row.totalSum)
                if (!sums[row.status])
                    sums[row.status] = s;
                else
                    sums[row.status] += s;
                totals += s;
                n++;
            });

            let discount = this.form.elements.discount.getValue()
            let forfeit = this.form.elements.forfeit.getValue()
            totals += forfeit
            let totalReserv = Math.round((0 + sums[orders.OrderStatus.Reserv]) * (100 - discount) / 100)
            let totalPaid = Math.round((0 + sums[orders.OrderStatus.Closed]) * (100 - discount) / 100)
            this.form.setValuesEx({ totalReserv, totalPaid, totals })
        }

        private action2status(action: orders.OrderAction): orders.OrderStatus {
            switch (action) {
                case orders.OrderAction.New:
                    return orders.OrderStatus.Unknow;
                case orders.OrderAction.Reserv:
                    return orders.OrderStatus.Reserv;
                case orders.OrderAction.Paid:
                    return orders.OrderStatus.Reserv;
                case orders.OrderAction.CancelNormal:
                    return orders.OrderStatus.Cancel;
                case orders.OrderAction.CancelForfeitAsk:
                    return orders.OrderStatus.Cancel;
                case orders.OrderAction.CancelForfeitConfirm:
                    return orders.OrderStatus.Cancel;
                default:
                    return orders.OrderStatus.Reserv;
            }
        }

        private doAction(action: orders.OrderAction, text: string) {
            if (!this.form.validate()) return;

            let items = this.ordersGrid.getSelectedItems();
            if (items.length == 0) return webix.message("Не выделено ни одной брони");

            // проверка редактирования записей
            let editing = false;
            items.forEach(item => {
                if (!item.id || typeof item.id != "string")
                    editing = true;
            });
            if (editing)
                return It.UI.w.error("Сначала сохраните данные");

            if (!confirm(text)) return;

            let status = this.action2status(action);
            items.forEach(item => {
                // if (item.status == status) return;  // если статус не изменился, то игнорим- убрано согласно 43835 дока пакет 3 
                if (action == orders.OrderAction.Paid && item.status == orders.OrderStatus.Cancel) return; // нельзя оплачивать отмененные брони, таск https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18328/
                let res = orders.db.setStatus(item.id, action);
            });
            //this.refreshGrid();
            this.save(true);
            this.calcTotals();
        }

        private save(refresh: boolean) {
            if (!this.form.validate()) return;
            this.form.save(db.saveUrl(this.objectId), false);
            //this.grid.save();
            if (refresh) { //setTimeout(() => { this.refreshGrid(); this.calcTotals() }, 1000);
                this.refreshGrid();
                this.calcTotals();
            }
            else {
                this.ordersGrid.refresh()
            }
            webix.message("Данные сохранены на сервере");
        }

        private refreshGrid() {
            let list: [] = orders.db.getAbonementItems(this.objectId);
            list.forEach(obj => this.setCSS(obj))
            this.ordersGrid.refresh(list);
            //this.gridForm.clear();
            //this.gridForm.elements.text.setValue("");
            //this.gridForm.elements.errors.setValue("");
        }

    }


}