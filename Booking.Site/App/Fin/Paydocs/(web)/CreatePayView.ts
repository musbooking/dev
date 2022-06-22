module paydocs {

    export class CreatePayView extends $u.PopupView {

        $config() {

            let formCfg = this.form.config().extend({
                width: 400, 
                elements: [
                    $u.element("fio").Label("ФИО").Require(),
                    $u.element("email").Label("E-mail").Require(),
                    $u.element("phone").Label("Телефон с кодом +7").Require(),
                    $u.element("mobPhone").Label("Мобильный тел.  +7").Tooltip("Для уточнения данных по заказу"),
                    $u.element("tarifName").Label("Тариф").Readonly().Css("it-warning"),
                    $u.element("price").Label("Цена в мес").Readonly(),
                    $u.element("count").Label("Кол-во месяцев").AsCounter(1, 24).Value(1).OnChange(x => this.recalc()).Error("Кол-во мес от 1 до 24"),
                    $u.element("comm").Label("Комиссия начисл.").Readonly(),
                    $u.element("total").Label("Сумма к оплате").Css("it-warning").Readonly().Require().Error("Введите кол-во месяцев для расчета оплаты"),

                    //$.element("auto").Label("Автопролонгация тарифа согласно " + "условиям".link("./conditions.html", { target: "_blank" }), -1).AsCheckbox(true),
                    $u.element("agree").Label("Согласен с условиями " + "лицензии".link("./docs/license.html", { target: "_blank" })).AsCheckbox(true).Error("Требуется согласие с условиями лицензии"),
                    $u.element("offerta").Label("Согласен с условиями " + " договора-оферты".link("./docs/offerta.html", { target: "_blank" })).AsCheckbox(true).Error("Требуется согласие с условиями оферты"),

                    $u.element("direct").Label("Прямая оплата").AsCheckbox()
                        .Visible(system.context.allow(auth.oper.domainsEdit))
                        .Tooltip("Оплатить напрямую минуя платежный сервис (для администраторов)"),

                    //$.template("Нажимая кнопку 'Оплатить', я соглашаюсь с "+ "условиями".addLink("./docs/conditions.html", {target: "_blank"}) + " автоматического продления и списания соответствующих сумм оплаты с моей банковской карты").Size(),

                    super.$config("Оплатить "),
                ],
                rules: {
                    total: x => x > 0,
                    count: x => x>0 && x<=24,
                    agree: x => x == true,
                    offerta: x => x == true,
                    email: webix.rules.isEmail,
                }
            });

            return formCfg;
        }
        private id;

        load(vals) {
            if (this.id && this.id === vals.id) return; // повторный вызов игнорим
            vals.count = 1;
            this.form.setValuesEx(vals); //{id: vals.id, total: vals.total, count: 1});
            this.recalc();
        }

        private recalc() {
            let vals = this.form.values();
            vals.total = vals.count * parseInt(vals.price) + parseInt(0 + vals.comm);
            this.form.setValuesEx({ total: vals.total });
        }

        protected invokeAction(vals0) {
            let vals = this.form.values();
            vals.text = `Оплата по тарифу ${vals.tarifName}: фикс.цена ${vals.price} р./мес за ${vals.count} мес. + начисленная моб.комиссия ${vals.comm} р., на общую сумму ${vals.total}`;
            let res: any;
            if (vals.direct)
                res = paydocs.testdb.payment(vals);
            else
                res = paydocs.paymentdb.payment(vals);

            super.invokeAction(vals)
            this.$clear();
            this.hide();

            if (!res)
                alert("Платеж успешно проведен");
            else if (!!res.error)
                It.UI.w.error("Ошибка платежа: " + res.error);
            else if(res.url && res.status==307) // redirect
                It.Web.openUrl(res.url, undefined, true);
        }

        $clear() {
            //super.clear();
            this.form.setValuesEx({ total: '', count: '', });
        }
    }

}