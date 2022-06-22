module orders {

    let action = orders.OrderAction;
    //let RESERV_ACTIONS = [action.Paid, action.Close, action.CancelForfeitAsk, action.CancelNormal];

    //let ACTION_STATUS = {
    //    '0': OrderStatus.Unknow,
    //    '1': OrderStatus.Reserv,
    //    '10': OrderStatus.Reserv,
    //    '11': OrderStatus.Cancel,
    //    '21': OrderStatus.Cancel,
    //    '22': OrderStatus.Cancel,
    //    '100': OrderStatus.Closed,
    //}

    //    New = 0,
    //    Reserv = 1, //OrderStatus.Reserv
    //    Paid = 10, //OrderStatus.Closed,
    //    CancelNormal = 11,
    //    CancelForfeitAsk = 21,
    //    CancelForfeitConfirm = 22,
    //    Close = 100,

    export class EditView extends $u.View {

        private form = new $u.RefForm();
        //private searchView = new clients.SearchView();
        private createClientView: clients.CreateView = new clients.CreateView(this).onAction(vals => this.createClient(vals));
        private equipmentsView: equipments.BalanceView = new equipments.BalanceView(this);
        private messagesView: messages.ListView = new messages.ListView(this);
        private label = new $u.RefUI();
        private msgid = "msg" + webix.uid();
        private alertBans = new $u.RefUI();
        private alertForfeits = new $u.RefUI();
        private transView: trans.PartGridView = new trans.PartGridView(this);
        private transid = "trans" + webix.uid(); 

        private equipments: any[];
        private loaded = false;

        private buttons = {
            //bitrix: new $.RefUI(),
            client: new $u.RefUI(),
            save: new $u.RefUI(),
            reserv: new $u.RefUI(),
            paid: new $u.RefUI(),
            close: new $u.RefUI(),
            cancel: new $u.RefUI(),
            forfeitAsk: new $u.RefUI(),
            forfeitConfirm: new $u.RefUI(),
        };


        $config() {
            super.$config();
            //let me = this;

            this.equipmentsView.onChange = () => this.calc();
            //this.searchView.onSelect = (client) => this.clientUpdate(client);

            let allow_history = system.context.allow(auth.oper.orderHistory)

            let tab_items = [
                { value: 'Бронь', id: this.form.id },
                { value: 'Транзакции', id: this.transid },
                //{ value: 'История', id: this.msgid }
            ]
            if (allow_history)
                tab_items.push({ value: 'История', id: this.msgid })

            let tabs = $u.tabs(...tab_items).Value(this.form.id).Size(130);

            let baritems = [
                //$.button("Найти клиента").Ref(this.buttons.find).Popup(this.searchView.config()),
                //$.button("Битрикс").Click(() => this.openBitrixUrl()).Ref(this.buttons.bitrix).Tooltip("Открыть клиента в Битриксе"),
                $u.button("Сохранить").Click(() => this.save(true)).Ref(this.buttons.save), //.Css({ "background-color": "magenta !important" }),
                $u.button("Резерв").Click(() => this.status(action.Reserv, "Потвердить резервирование?", false, false)).Ref(this.buttons.reserv),
                $u.button("Оплатить").Click(() => this.status(action.Paid, "Подтвердить оплату?", true, true)).Ref(this.buttons.paid).Type("green"),
                $u.button("Закрыть").Click(() => this.status(action.Close, "Закрыть бронь?", true, true)).Ref(this.buttons.close).Type("green"),
                $u.button("Отмена").Click(() => this.status(action.CancelNormal, "Потвердить отмену без штрафа?", false, false)).Ref(this.buttons.cancel).Type('danger'),
                $u.button("Неявка").Click(() => this.status(action.CancelForfeitAsk, "Отменить со штрафом (с запросом на подтверждение у диспетчера)?", false, false)).Ref(this.buttons.forfeitAsk).Type('danger'),
                $u.button("Сбор/П").Click(() => this.status(action.CancelForfeitConfirm, "Подтвердить отмену со штрафом?", false, false)).Ref(this.buttons.forfeitConfirm).Type('danger'),
                {},
                tabs,
            ];

            let left = [
                //$.element("clientBitrixNum").Label("Клиент в Битрикс").AsSearch(() => this.clientSearch(), "Введите код Битрикс-24"),
                //$.element("client").Label("Клиент").AsTextArea(60).Require().Readonly(),
                $u.cols(
                    clients.getSearchColumn().OnChange((id,old) => this.clientUpdate(id)),
                    $u.icon("user-plus").Popup(this.createClientView.$config()).Ref(this.buttons.client).Tooltip("Создать клиента")
                ),
                $u.element("comment").Label("Комментарий").AsTextArea(100),
                $u.element("clientComment").Label("Комментарий клиента").AsTextArea(100).Css("it-mark"),
                //$.element("group").AsSelect(orderGroupKinds).Label("Статус группы").OnChange(() => this.calc()),
                $u.label("Опции").Size(-1),
                //$u.element("options").Label("Опции", "top").AsMultiSelect([]).OnChange(() => this.calc()).Readonly(true),
                $u.element("options").AsMultiSelect([]).OnChange(() => this.calc()),
                $u.element("range").Label("Значение").AsInt().OnChange(() => this.calc()),
                $u.element("equipments").Label("Позиции").AsMultiSelect([]).Visible(false), //.OnChange((newv, oldv) => this.changeEquipments(newv, oldv)), //models.equipments.namesUrl
                $u.element("itemsJson").Visible(false).Disable(),  // fake items control
                $u.label("Выберите позиции (укажите количество)", false),
                this.equipmentsView.$config().extend({ height: 200 }),

                $u.element("promoId").AsSelect(promo.db.names(true, promo.PromoKind.Action)).Label("Промоакция", "top").OnChange(() => this.calc()),

            ];

            let right = [
                //$u.element("isHold").Label("Не пересчитывать", null, 150).AsCheckbox(false).OnChange(() => this.calc()),
                $u.element("payDate").Label("Дата оплаты").AsDate().Size(280),
                $u.element("date").Label("Дата брони").AsDate(true).Disable(),
                $u.element("roomPrice").Label("Сум. репетиции").AsNumber().Disable(),
                $u.element("eqPrice").Label("Сум. позиции").AsNumber().Disable(),
                $u.element("discount").Label("Скидка, %").AsNumber().Disable(),//.On("onChange", () => this.calc()),
                $u.element("hotPromo").Label("Горящая репет.").Disable(),
                $u.element("promo").Label("Промокод").Disable(),

                //$.element("isRoomPromo").Label("Акция комнаты").AsCheckbox().Disable(),
                $u.element("forfeit").Label("Штраф").AsNumber().Disable().Css("it-mark").Tooltip("Начисленный ранее штраф клиента"),
                $u.element("paidForfeit").Label("Штраф Опл.").AsNumber().Disable().Css("it-mark").Tooltip("Начисленный ранее штраф клиента"),
                //$u.element("fullForfeit").Label("Штраф Полный").AsNumber().Disable().Css("it-mark").Tooltip("Прошлый и текущий штрафы в сумме"),
                $u.element("payForfeit").Label("Оплачивать штраф", null, 150).AsCheckbox(false).OnChange(() => this.calc()),
                $u.element("balance").Label("Баланс").AsInt().Disable(),
                $u.element("isPointsPay").Label("Списать баллы", null, 150).AsCheckbox(false).OnChange(() => this.calc()),

                $u.element("totals").Label("Общая стоим.").Css("it-warning").AsNumber().Disable(),
                //$.button("...").Popup( , "Пояснения" )
                $u.element("text").Label("Расчет").AsHtmlLabel(300).Css('it-scroll-y'), 
                //$.element("status").Label("Статус").AsSelect(models.orderStatuses).Disable(),
                //$.element("reason").Label("Причина отмены").AsSelect(models.cancelReasons).Disable(),
                //$.element("xxx").Label("Вычисление").templ(models.cancelReasons).Disable(),
            ];

            let formCfg = this.form.config().extend({
                //width: 730,

                cols: [
                    { rows: left, gravity: 2 },
                    { width: 20 },
                    { rows: right },
                ],
            });

            //let accordion = {
            //    view: "accordion",
            //    //multi: false,
            //    rows: [
            //        { header: "Основные реквизиты брони", body: formCfg },
            //        { header: "История сообщений", body: this.messages.config(), collapsed: true }
            //    ]
            //};

            let view = $u.rows(
                { cols: baritems },
                $u.label("???").Ref(this.label),
                $u.template("  Клиент заблокирован у партнеров сервиса").Css("it-error").Ref(this.alertBans),
                $u.template("  Клиент имеет штраф у партнеров сервиса").Css("it-error").Ref(this.alertForfeits),
                //accordion
                $u.cells(
                    formCfg,
                    this.messagesView.$config().Id(this.msgid),
                    this.transView.$config().Id(this.transid)
                ).Size(730, 700),
                {gravity1111: 0.01}
            ).Scrollable();
            return view;
        }

        private _options: any[] = groups.db.options();

        $reload(id) {
            super.$reload(id); 

            this.loaded = false;

            //this.form.setElement("clientId", { options: [] }); из-за этого не вызывается серверная функция
            let list = this.form.elements.clientId.getPopup().getList();
            list.clearAll();

            let vals = this.form.load(db.getUrl(id));
            //data.client = models.clients.getClientName(data.clientInfo);
            this.loaded = true;

            let text = getOrderText(vals);
            this.label.setValue("   " + text); 

            this.alertBans.visible(vals.hasBans);
            this.alertForfeits.visible(vals.hasForfeits);

            // load equipments
            let eqlist = equipments.db.balance(vals.baseId, id, vals.dateFrom, vals.dateTo);
            this.equipments = eqlist.sort((x, y) => (y.n - x.n)); 
            this.setEquipmentsFromItemsJson(vals.itemsJson);
            //this.equipments = eq.sort((x, y) => (y.checked ? 1 : 0) - (x.checked ? 1 : 0));
            //this.setEqIds(vals.equipments);
            this.equipmentsView.refresh(this.equipments);

            //let names = models.equipments.names(vals.baseId);
            let suggest = {
                body: {
                    yCount: 50,
                    data: this.equipments,
                },
            };
            this.form.elements.equipments.define({ suggest: suggest });
            this.form.elements.equipments.refresh();

            let boptions = this._options.filter(x => x.bases.indexOf(vals.baseId)>-1); 
            this.form.setElement('options', { suggest: boptions, readonly: false });

            // recalc & reload form elements
            this.calc();
            this.applyUI(vals);

            this.messagesView.filter.order = id;
            // this.messagesView.filter.client = system.context.clientId;  для сообщений показываем полностью
            this.messagesView.setDefaults({ orderId: id });
            this.messagesView.refresh();

            this.transView.reload({ orderId: id }) //, clientId: vals.clientId.id ?? vals.clientId }); - временно убрал фильтр по клиенту  53823 

            return vals;
        }


        /** visible/ enable UI elements */
        private applyUI(vals) {
            let logic = orders.logic;
            // apply element status   
            let hold = vals.isHold
            let editable = !hold && logic.allowEditOrder(vals)//  && !vals.isHold; убрано в документе, 3-й пул https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/43835/
            let editableAfterPaid = editable// || logic.allowEditAfterPaid(vals);
            let editableClient = editable && logic.allowEditClient(vals)
            //let allowCancel = logic.allowEditOrder(vals)

            this.form.enable(editable);
            //this.buttons.cancel.enable(allowCancel);
            this.buttons.forfeitAsk.enable(editable);
            this.buttons.forfeitConfirm.enable(editable);
            this.buttons.paid.enable(editable);
            this.buttons.reserv.enable(editable);
            //this.buttons.cancel.enable(allowCancel);

            this.buttons.save.enable(editable || logic.allowFullAccess());  // см Пул 4/2 - https://docs.google.com/document/d/1tJAy4X6WdLchpZWjWVpXgso0bXsLeSOWK2GW6e-PM9I/edi

            this.form.enable(logic.allowGroup(vals), "options"); 
            //this.form.enable(false, "options"); 
            //this.form.setElement("options", { readonly: false}); 
            //this.form.enable(editable && logic.allowEditGroup(vals), "options");
            //this.form.enable(editableClient, "clientBitrixNum");    
            this.form.enable(editableClient, "clientId");
            this.buttons.client.enable(editableClient);
            //this.form.enable(editable, "clientComment");
            this.form.enable(editableAfterPaid, "equipments");
            this.equipmentsView.enable(editableAfterPaid);
            this.form.enable(editableAfterPaid && logic.allowEditPaidForfeit(vals), "payForfeit");
            //this.form.visible(logic.allowFullForfeit(vals), "fullForfeit");
            this.form.visible(logic.allowViewPromo(vals), "promoId");
            this.form.enable(logic.allowEditPromo(vals), "promoId");
            this.form.enable(logic.allowPoints(vals), "isPointsPay");
            this.form.enable(logic.allowEditPayDate(vals), "payDate");
            //this.form.enable(logic.allowHold(vals), "isHold");

            // apply buttons status
            //this.buttons.bitrix.visible(logic.allowOpenBitrix(vals));
            //this.buttons.find.visible(editableClient);
            //this.buttons.save.visible(editableAfterPaid);
            this.buttons.reserv.visible(logic.allowDoReserv(vals));
            this.buttons.cancel.visible(logic.allowDoCancel(vals));
            this.buttons.forfeitAsk.visible(logic.allowDoForfeit(vals));
            this.buttons.forfeitConfirm.visible(logic.allowDoForfeitConfirm(vals));
            this.buttons.close.visible(logic.allowDoClose(vals));
            this.buttons.paid.visible(logic.allowDoPaid(vals)); // if reserv
        }

        private status(act: orders.OrderAction, text: string, reserv: boolean, check: boolean) {
            // let status: OrderStatus = ACTION_STATUS[act]
            // this.form.setValuesEx({ status: status })

            // if (status != OrderStatus.Cancel && !this.form.validate()) return; // можно отменять при любой валидации

            if (!this.form.validate()) return
            if (!confirm(text)) return

            if (!this.save(false)) return webix.message("Ошибка валидации данных");

            // пересчитываем статус
            let vals = this.form.values();
            let res: any = {}   // результат расчета при смене статуса

            //let price = this.getPrice(vals);

            // если требуется пересчет, то вызываем резервирование
            if (reserv) { // RESERV_ACTIONS.indexOf(act) >= 0) {
                res = db.setStatus(this.objectId, action.Reserv);
                // если требуется проверка, то также 
                if (check && res.paidForfeit != res.forfeit) {  // добавлена проверка согласно 51678 - сравниваем стоимость
                    let ok = confirm(`Сумма сборов изменилась и составила ${res.forfeit} руб. Продолжить операцию? `)
                    if (!ok) return
                }
                // если требуется проверка, то также 
                if (check && res.totalSum != res.originTotalSum) {  // добавлена проверка согласно 51678 - сравниваем стоимость
                    let ok = confirm(`Итоговая стоимость изменилась и составила ${res.totalSum} руб. Продолжить операцию? `)
                    if (!ok) return
                }
            }

            // добавляем перевод статуса и дополнительную проверку ошибки - 39181
            res = db.setStatus(this.objectId, act);
            if (res.errors) {
                It.UI.error(res.errors)
                return
            }

            this.form.setValuesEx(res);

            db.save({ id: this.objectId, originTotalSum: res.totalSum })  // обновляем начальную сумму

            this.close();
        }


        private save(is_close: boolean) {
            //if (!this.form.validate()) return;
            if (!this.calc()) return false;
            //this.form.save(models.orders.saveUrl(this.objectId), false);
            let r = this.form.values();
            //let equipments = models.equipments.getIds(this.equipments);
            let vals: any = {
                id: r.id,
                clientId: r.clientId,
                comment: r.comment,
                clientComment: r.clientComment,
                //group: r.group,
                options: r.options,
                promoId: r.promoId,
                roomId: r.roomId,
                baseId: r.baseId,
                status: r.status,
                reason: r.reason,
                equipments: r.equipments,
                itemsJson: r.itemsJson,
                discount: r.discount,
                eqPrice: r.eqPrice,
                roomPrice: r.roomPrice,
                //forfeit: r.forfeit,
                payForfeit: r.payForfeit,
                isPointsPay: r.isPointsPay,
                payDate: r.payDate,
                isHold: r.isHold,
                range: r.range,
                save: true,
                retrans: is_close, // регенерируем проводки, если сохраняем и закрываем форму
            };
            if (is_close)  
                vals.originTotalSum = r.totalSum  // меняем начальную сумму, только если идет полное сохранение
            db.save(vals);
            //It.Web.put(db.saveUrl(this.objectId), vals);
            //models.orders.updates.add(this.objectId);
            webix.message("Данные сохранены на сервере");
            if (is_close) this.close();
            return true;
        }

        private calc(): boolean {
            if (!this.loaded) return false;
            //if (!this.form.validate()) return; 

            try {
                this.loaded = false;

                let obj = this.form.values();

                let editable = orders.logic.allowEditOrder(obj); // obj.isHold

                if (!editable) {
                    let text = "Пересчет заблокирован, бронь без статуса или давно оплачена";
                    webix.message(text);
                    this.form.elements.text.setValue(text);
                    //obj = this.form.save(db.calcUrl, true);
                    return;
                }
                else {
                    // отсечка убрана согласно замечанию к фин. модели Итоговые правки п.4
                    //if (!obj.isHold) {  // добавлена отсечка, чтобы не пересчитывать закрытую бронь, но сохранить все значения
                    //let eqids = this.getEqIds();
                    //let listEquipments = eqids.join(",");
                    //this.form.elements.equipments.setValue(listEquipments);

                    let jsitems = this.getItemsJson();
                    this.form.elements.itemsJson.setValue(jsitems);
                    obj = this.form.save(db.calcUrl, true);
                    //let price = this.getPrice(data);
                    this.form.elements.totals.setValue(obj.totalSum);  // считаем суммарную стоимость
                }

                //console.log('calculate', JSON.stringify(obj))
                this.applyUI(obj);

                if (obj.errors) {
                    let err: string = obj.errors;
                    It.UI.w.info(err.replace('\r\n', '<hr/>'));
                    return false;
                }
            }
            finally {
                this.loaded = true;
            }
            return true;
        }



        private close() {
            if (this.onclose)
                this.onclose();
        }


        private createClient(vals) {
            let client = { id: this.createClientView.clientObject.id, value: this.createClientView.values.firstName };
            this.form.setValuesEx({ clientId: client.id });
            this.form.elements.clientId.setValue(client);
        }
         
        private clientUpdate(clientId) {
            if (!clientId || clientId == "00000000-0000-0000-0000-000000000000") return;  /// № 41997 дополнительно возвращается пустой клиент, чтобы не сбрасывать текст
            if (clientId.id) return; // клиент ранее уже был загружен, переносить данные не имеет смысла //clientId = clientId.id;
            let client = clients.db.get(clientId); 
            if (client.isBanned) {
                this.form.setValuesEx({ clientId: null });
                return It.UI.w.error("Клиент заблокирован!");
            }
            //$.elements.clientBitrixNum.setValue(obj.)
            //this.form.setValues(client);
            this.form.setValuesEx({ discount: client.discount, promo: client.promoCode, forfeit: client.forfeit, payForfeit222:!!client.forfeit, balance: client.balance });
            //webix.message("Найден клиент, обновлены данные ");
            this.calc();
        }
         

        /** Получение массива Items в формате Json */
        private getItemsJson() {
            let list = this.equipments
            let res = list.filter(x => x.n > 0).map(x => ({ eq: x.id, n: Math.min(x.count, x.n) }))
            if (res.length == 0) return ""
            var json = JSON.stringify(res)
            return json
        }

        /**  Запись в массив из Json Items   */
        private setEquipmentsFromItemsJson(jsitems: string) {
            if (!jsitems) return;
            let eqlist= this.equipments
            let items = JSON.parse(jsitems)
            items.forEach(item => {
                if (!item.eq) return
                let eq = eqlist.find(y => y.id == item.eq);
                if (eq) eq.n = item.n;
            });
        }

    }

}





        //private getPrice(vals) {
        //    let price = vals.roomPrice * (1 - vals.discount / 100);
        //    price = Math.round(price);
        //    return price
        //}

        //private getEqIds(): any[] {
        //    let list = this.equipments
        //    let res = list.filter(x => x.checked).map(x => x.id)
        //    return res
        //}

        //private setEqIds(eqs: string) {
        //    if (!eqs) return;
        //    let eqids = eqs.split(","); //.map(x=> parse(x));
        //    let list = this.equipments
        //    //eqbalance.filter(x=> eqids[1]).forEach(x=> x.checked = true);
        //    eqids.forEach(id => {
        //        let eq = list.find(y => y.id == id);
        //        if (eq) eq.checked = true;
        //    });
        //}

                //private changeEquipments(newv, oldv) {
        //    if (!this.loaded) return;
        //    //if (!newv || !oldv) return;
        //    let vals = this.form.values();
        //    let allow = orders.logic.allowRemoveEquipments(vals);
        //    if (newv < oldv && !allow) {
        //        alert("Нельзя удалять позицию!");
        //        return;
        //    } 
        //    this.calc();
        //}

        //private clientSearch() {
        //    let num = this.form.elements.clientBitrixNum.getValue();
        //    let client = app.bitrix.getClient("ID", num);
        //    this.clientUpdate(client);
        //}