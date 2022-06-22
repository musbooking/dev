module domains {

    export class QuickEditForm {

        form = new $.RefForm()

        config() {

            let formCfg = this.form.config().extend({
                //gravity: 0.5,
                elements: [
                    $.cols(
                        $.element("period").Label("Граница даты", "top").AsSelect(periods).Require(),
                        $.element("isPayment").Label("Только для оплаченных").AsCheckbox(true),
                        $.button('Пересчитать'),
                        {},
                    ),
                ],
            });

            return formCfg;
        }

    }

}