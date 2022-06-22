module paydocs {

    export class PayDocsGrid {
        grid = new $u.RefGrid();

        config() {
            let grid = this.grid.config().extend({
                //height: 200,
                columns: [
                    //$.column("idd").Header("*", 30).Template($.getViewLink("docs")),
                    $u.column("isCompleted").Header("Опл").AsCheckboxReadly(),
                    $u.column("date").Header("Дата").AsDate(),
                    $u.column("mobComm").Header("Комиссия").AsInt(),
                    $u.column("total").Header("Сумма").AsInt(),
                    $u.column("fio").Header("ФИО", 200),
                    $u.column("text").Header("Описание", -1),
                ],
                scheme: {
                    name: "без имени",
                },
            });
            return grid;
        }

        public reload(domainId) {
            let docs = db.getItems({ domain: domainId });
            this.grid.refresh(docs);
        }

    }

}