module domains {

    /** edit base */
    export class EditView extends $u.View {

        //private form = new $.RefHtmlForm((obj, common) => "fffffffff"); 
        private headers = new $u.RefTemplate()
        private template = new $u.RefTemplate()
        private docsGrid: paydocs.PayDocsGrid = new paydocs.PayDocsGrid()
        private roomsGrid: domains.RoomsView = new domains.RoomsView()
        private payview: paydocs.CreatePayView = new paydocs.CreatePayView(this).onAction(_ => this.doPayment())
        private autoRenewalButton = new $u.RefUI()
        private invoicesList: paydocs.InvoicesList = new paydocs.InvoicesList()
        //private calendarSyncView: calendars.SyncView = new calendars.SyncView()
        private form = new $u.RefForm()

        $config() {
            super.$config();

            let form = this.form.config().Labels(110).extend({
                //gravity: 1,
                padding: 0,
                //width: 800,
                elements: [
                    $u.cols(
                        $u.element("period").Label("Граница даты").AsSelect(periods).Require().Size(270),
                        $u.element("isPayment").Label("Тариф оплат").AsCheckbox(true).Size(270).Tooltip("Использовать тариф для оплаченных броней"),
                        $u.button('Пересчитать').Click(_ => this.recalc()),
                        {},
                    ),
                ],
            });

            let header = this.headers.config("<h2>Партнер: #name#</h2>")

            let templ = this.template.config('http->'+It.Web.WebSource.base+ '/html/domain-details.html', { tarif: {} }).extend({
                activeContent: {
                    cancelAutoRenewalButton: $u.button("Отменить автопролонгацию").Click(_ => this.cancelAutoReneval()).Ref(this.autoRenewalButton),
                    //form: form,
                },
            }).Min(0, 150);

            let invListExt = {
                activeContent: {
                    payButton: $u.button("Продлить!").Click($u.callActiveContent(id => this.openPayment(id))) //.Popup(this.payview.config(), _ => this.loadPayForm()),
                    //invoices: invListCfg,
                },
            };

            let tarif = $u.rows(
                $u.header("Информация о текущем тарифе"),
                form,
                this.invoicesList.config(invListExt),
                templ
            )

            let docs = $u.rows(
                $u.toolbar(
                    $u.label("Список платежных документов").Size(-1)
                ),
                this.docsGrid.config().Autoheight(),
            )

            let tabs: $u.Configs.TabViewConfig = $u.tabview()
                .Tab("Тариф", tarif)
                .Tab("Документы", docs)
                .Tab("Площадки", this.roomsGrid.$config())
                //.Size(0, 400)
                ;

            let view = $u.rows(
                //$.cols(
                //    $.button("Сохранить").Click(() => this.save()),
                //    {}
                //),
                //this.calendarSyncView.$config(),
                //qform,
                header.Size(0,90),

                //$u.header("Информация о текущем тарифе"),

                //form,
                //templ,

                //this.invoicesList.config(invListExt),

                tabs.Autoheight(),

                {},
            );
            return view;
        }

        $init() {
            super.$init();
            let w = this.payview.win = new $u.RefWin("Оплата");
            w.resize = false;
            w.position = 'center';
            w.config(this.payview.$config());
            this.loadForm(undefined); // подсовываем фиктивный объект, чтобы не сыпалась форма
        }

        $reload(id) {
            if (!id)
                id = system.context.domainId;
            super.$reload(id);

            this.loadForm(id);
            //this.loadPayForm(vals);
            // this.loadDocsGrid();
            this.docsGrid.reload(id);
            this.roomsGrid.reload(id);
            this.invoicesList.reload(id);
            //this.calendarSyncView.$reload(id);
            //this.qform.setValues(vals);
        }

        private openPayment(tarifId) {
            let invoice = this.invoicesList.list.getItem(tarifId);
            if (!invoice)
                return It.UI.w.error("Не выбран тариф");

            this.payview.openWindow();

            let vals = this.template.values();
            vals.tarifId = invoice.id;
            vals.tarifName = invoice.name;
            vals.price = invoice.price;
            vals.comm = invoice.mobComSum;
            this.payview.load(vals);
        }


        private loadForm(id) {
            let vals = id ? db.get(id) : { tarif: {} };
            vals.limit = webix.i18n.dateFormatStr(vals.limitDate);
            this.headers.setValues(vals);
            //vals.renewal = vals.autoRenewal ? "ddd" :"Автопролонгация тарифа прекращена. Для пролонгации тарифа используйте кнопку 'Оплатить'";
            this.template.setValuesEx(vals);
            this.form.setValues(vals);
        }

        private cancelAutoReneval() {
            if (!confirm("Отменить автопролонгацию?")) return;
            this.template.setValuesEx({ autoRenewal: false });
            alert("Автопролонгация тарифа прекращена. Для пролонгации тарифа используйте кнопку 'Продлить'");
            this.autoRenewalButton.enable(false);
            this.$reload(this.objectId);
        }

        private doPayment() {
            this.payview.win.hide();
            this.$reload(this.objectId);
            //this.loadDocsGrid();
        }

        private recalc() {
            if (!this.form.validate()) return;
            if (!confirm("Пересчитать текущую доменную зону?")) return;

            let vals = this.form.values();
            db.save({ id: this.objectId, period: vals.period, isPayment: vals.isPayment });
            let res = paydocs.db.recalc(this.objectId);

            this.loadForm(this.objectId);
            webix.alert(`Доменная зона пересчитана`);
        }

        //private save() { 
        //    //this.form.save(db.saveUrl(this.objectId), false);
        //    let vals = this.form.values();
        //    db.save(vals);
        //    webix.message("Данные сохранены на сервере");
        //}

    }

}