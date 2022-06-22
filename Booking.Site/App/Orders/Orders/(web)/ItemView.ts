module orders {

    export class ItemView extends $u.PopupView {

        //private form = new $.RefForm();
        private header = new $u.RefTemplate();
        private logic = new ViewLogic();
        private alert = new $u.RefUI();

        OnEdit = new It.Event();
        OnDelete = new It.Event();

        $config() {

            let toolbar = $u.header("Просмотр брони",
                $u.button("Редактировать").Click(() => this.edit()),
                $u.button("Удалить").Click(() => this.delete()).Ref(this.logic.ref(this.logic.states.delete)),
                $u.icon("close").Click(() => this.hide()),
            );

            let form = this.form.config().Labels(120).extend({
                elements: [
                    toolbar,
                    this.header.config('AAA').Size(-1, 40).Css('it-header'),

                    $u.cols(
                        $u.rows(
                            $u.element("equipments").Label("Позиции", "top").AsTextArea(400), //.AsMultiSelect([]) //equipments.db.names())
                                //.Size(-1, 400).extend({ inputHeight: false, }),
                            $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()),
                        ),
                        $u.rows(
                            $u.element("comment").Label("Комментарий").AsTextArea(100),
                            $u.element("discount").Label("Скидка, %").AsInt(),
                            $u.element("clientForfeit").Label("Прошлый штраф").AsNumber(),
                            $u.element("totalSum").Label("Cтоимость общ").Css("it-warning").AsNumber(),
                        ),
                    ),
                    $u.template("  Клиент заблокирован или имеет штраф у партнеров сервиса").Css("it-error").Ref(this.alert),
                ]
            }).Readonly(true);

            return form.Size(600);
        }


        $reload(id) {
            super.$reload(id);
            let vals = db.get(id);
            vals.comment += ' ' + vals.clientComment;
            if (vals.itemsJson) {
                let items: any[] = JSON.parse(vals.itemsJson)
                let names = equipments.db.names()
                vals.equipments = items.map(x => `- ${names.findById(x.eq, {}).value} x${x.n}`).join('\n');
            }
            else {
                vals.equipments = ""
            }
            this.form.setValues(vals);
            let header = getOrderText(vals);
            this.header.set({ template: header });
            this.logic.check(vals);
            this.alert.visible(vals.hasBans || vals.hasForfeits);
        }

        private edit() {
            this.hide();
            this.OnEdit.call(this.objectId);
        }

        private delete() {
            this.hide();
            this.OnDelete.call(this.objectId);
            //webix.message('Бронь удалена');
        }
    }


    class ViewLogic extends $u.UIManager {
        states = {
            delete: 1,
        }

        check(obj) {
            this.enable(this.states.delete, obj.status == orders.OrderStatus.Unknow);
        }
    }

}