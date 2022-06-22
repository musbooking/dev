module abonements {
   
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    export class CreateWizard extends $u.View {
        private form = new $u.RefForm();

        onCreate: callback; //(args: any[]) => void;

        $config() {

            let w = 70;

            let days = [
                $u.element("d1").Label("ПН").Size(w).AsCheckbox(true),
                $u.element("d2").Label("ВТ").Size(w).AsCheckbox(true),
                $u.element("d3").Label("СР").Size(w).AsCheckbox(true),
                $u.element("d4").Label("ЧТ").Size(w).AsCheckbox(true),
                $u.element("d5").Label("ПТ").Size(w).AsCheckbox(true),
                $u.element("d6").Label("СБ").Size(w).AsCheckbox(true),
                $u.element("d7").Label("ВС").Size(w).AsCheckbox(true),
            ];

            let formCfg = this.form.config().Labels(20).extend({
                //autowidth: true,
                elements: [
                    { cols: days },
                    $u.cols(
                        $u.element("t1").Label("Начало", null,  70).AsDate().Type("time").Size(180).Require(),
                        $u.element("t2").Label("Окончание", null, 85).AsDate().Type("time").Size(200).Require(),
                        {}
                    ),
                    $u.cols(
                        $u.button("Создать").Click(() => this.onCreate()),
                        $u.button("Очистить").Click(() => this.form.clear())
                    )
                ],
            });
            return formCfg;
        }

        create(d1: Date, d2: Date): any[] {
            if (!this.form.validate()) return null;

            let items = [];
            let vals = this.form.values();
            let days = [vals.d7, vals.d1, vals.d2, vals.d3, vals.d4, vals.d5, vals.d6, ];
            let t1: Date = vals.t1;
            let t2: Date = vals.t2;
            let ndays = (<any>d2 - <any>d1) / millisecondsPerDay;

            for (let i = 0; i <= ndays; i++) {
                let d = d1.addDays(i);
                let wday = d.getDay();
                let todo = days[wday];
                if (!todo) continue;

                items.push({
                    date: d,
                    dateFrom: new Date(d.getFullYear(), d.getMonth(), d.getDate(), t1.getHours(), t1.getMinutes()),
                    dateTo: new Date(d.getFullYear(), d.getMonth(), d.getDate(), t2.getHours(), t2.getMinutes()),
                    wday,
                });
            }

            return items;
        }

        private clickCreate() {
            if (this.onCreate)
                this.onCreate();
        }
    }

    
}