module calendars {

    export class SyncView extends $u.View {

        $config() {
            super.$config();

            let view = $u.rows(
                $u.panelbar(
                    $u.button("Синхронизировать календари").Click(() => this.sync()),
                    {}
                ),
                {height: 1}
            );
            return view;
        }

        $reload(id) {
            super.$reload(id);
        }

        private sync() {
            let res = db.sync({ domain: this.objectId });
            alert("Результат синхронизации: "+ res);
        }


    }


}