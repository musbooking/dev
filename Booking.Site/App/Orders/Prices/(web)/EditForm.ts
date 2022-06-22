module prices {

    export class EditForm { //extends $.View {

        full = false;
        form = new $u.RefForm();

        config() {

            const hhelp = "Укажите цену за час по Будням и по Выходным (С помощью полей «Перв. Раб. И Посл. Раб. Можно настроить отдельную цену по понедельникам и по пятницам). Если цена за 3 часа не делится на ровное число, указывайте ближайшее число до «,», платформа округлит это число при формировании цены. Например, если три часа в выбранной комнате стоят 1100, то в полях необходимо указать цифру 367 (366,6)";
            const help4 = "Выберете календарный период действия параметров условия";

            let promos = promo.db.names(true, promo.PromoKind.Rules);

            let formCfg = this.form.config().Labels(100).extend({
                gravity: 0.5,
                elements: [
                    $u.element("baseId").Label("База", "top").AsSelect(bases.db.namesUrl).Visible(this.full).Tooltip("Выберите объект на котором будет действовать созданная цена"),
                    $u.element("roomId").Label("Комната", "top").AsSelect(rooms.db.names(undefined, true)).Visible(this.full).Tooltip("Выберите комнату в которой будет действовать созданная цена"),
                    $u.element("timeFrom").Label("С, час").AsCounter(0, 24).Require().Tooltip("Укажите промежуток действия выбранной цены"), //.Format(app.meta.timePattern).Validate(app.meta.timeValidator),
                    $u.element("timeTo").Label("По, час").AsCounter(0, 24).Require().Tooltip("Укажите промежуток действия выбранной цены"), //.Format(app.meta.timePattern).Validate(app.meta.timeValidator),
                    $u.element("workingFPrice").Label("Раб.Перв").Tooltip(hhelp),
                    $u.element("workingPrice").Label("Рабочие").Require().Tooltip(hhelp),
                    $u.element("workingLPrice").Label("Раб.Посл").Tooltip(hhelp),
                    $u.element("weekend1Price").Label("СБ").Require().Tooltip(hhelp),
                    $u.element("weekend2Price").Label("ВС").Require().Tooltip(hhelp),
                    $u.element("promoId").Label("Условие", "top").AsSelect(promos).Tooltip("Выберите условие при котором будет действовать созданная цена, например, условие для сольных репетиций. Условия создаются в разделе «Ценообразование»"),
                    $u.element("dateFrom").Label("Начало").AsDate().Tooltip(help4),
                    $u.element("dateTo").Label("Окончание").AsDate().Tooltip(help4),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    {},
                ],
            });
            return formCfg;
        }


    }


}