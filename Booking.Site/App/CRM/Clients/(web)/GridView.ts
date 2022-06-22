module clients {

    export class GridView extends $u.View {

        private createView: CreateView = new CreateView().onAction(vals => this.add(vals));
        private form = new $u.RefForm();
        private grid = new $u.RefGrid();

        $config() {
            // ADDED BY ELMSOFT: 2019-04-09
            super.$config();
            It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
            let filterFormCfg = this.form.config().extend({

                cols: [
                    $u.button("Создать").Popup(this.createView.$config()),
                    $u.icon("file-excel-o").Click(() => this.exportxlsx()).Tooltip("Экспортировать в Ексел"),
                    $u.icon("database").Click(() => this.exportocsv()).Tooltip("Экспортировать в csv"),
                    //$u.uploader("api/clients/upload", (x, y, z) => this.importfromcsv()).extend({
                    //    value: "Загрузить в базу",
                    //    multiple: false, autosend: true,
                    //    name: "files",
                    //    accept: "file/*",
                    //    datatype: "json"
                    //}),

                    {},
                    $u.element("group").Label("Группа", null, 60).AsSelect(groups.db.names(groups.GroupType.ContactType, true)),
                    $u.element("text").Label("Поиск", null, 60).Tooltip("Поиск по ФИО, тел, email").AsSearch(() => this.search()),
                    //$.element("fio").Label("ФИО", 60),
                    //$.element("mail").Label("e-mail", 60),
                    //$.element("phones").Label("Телефоны", 80),

                    //$.button("Искать").Click(() => this.search()),
                    //$.button("Очистить").Click(() => this.clear()).Tooltip("Очистить введенные значения"),
                ],
            });
            let fioLink = $u.getViewLink("clients", "(...)");

            // ADDED BY ELMSOFT: 2019-04-09
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("link").Header("", 40).Template(fioLink),
                    $u.column("fio").Header("ФИО", -1),
                    $u.column("email").Header("e-mail", 150),
                    $u.column("phones").Header("Телефоны", 150)
                ]

            });

            let cfg = $u.rows(
                filterFormCfg,
                gridCfg
            );
            return cfg;
        }

        $init() {
            super.$init();

        }

        private add(vals) {
            let g = this.grid;
            g.callNoEvents(() => g.add({
                id: this.createView.clientObject.id,
                fio: vals.firstName + " " + vals.lastName,
                email: vals.email,
                phones: vals.phones,
            }));
        }

        private clear() {
            this.form.clear();
            this.search(false);
        }

        private search(message = true) {
            let vals = this.form.values();
            //let list = db.getItems({ mail: vals.mail, fio: vals.fio, phones: vals.phones } );
            let list = db.items({ filter: vals.text, group: vals.group });
            this.grid.refresh(list);
            if (message)
                webix.message("Показано не более 10 записей");
        }

        // ADDED BY ELMSOFT: 2019-04-09
        private exportxlsx() {
            this.grid.toExcel({
                filename: "clients " + (new Date()).toLocaleDateString("ru"), // for filename
                name: "clients",
                filterHTML: true,
                columns: [
                    { id: "fio", name: "ФИО" },
                    { id: "email", name: "e-mail" },
                    { id: "phones", name: "Телефоны" }
                ]
            });
            console.log('export xlsx');
        }

        // ADDED BY ELMSOFT: 2019-04-09
        private exportocsv() {
            webix.csv.delimiter.cols = ";";
            this.grid.exportToFileCSV({
                filename: "clients " + (new Date()).toLocaleDateString("ru"), // for filename
                name: "clients", // for sheet name
                filterHTML: true,
                columns: [
                    { id: "fio", name: "fio" },
                    { id: "email", name: "email" },
                    { id: "phones", name: "phones" }
                ]
            });
            console.log('export csv');
        }

        // ADDED BY ELMSOFT: 2019-04-09
        private importfromcsv() {
            webix.message("Данные загружены");
            console.log('import from csv');
        }
    }
}