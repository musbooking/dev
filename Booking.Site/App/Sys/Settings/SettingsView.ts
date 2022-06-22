module settings_ui {

    /** edit base */
    export class SettingsView extends $u.View {

        private form = new $u.RefForm();
        private editor = new $u.RefUI();
        //private settingsView: SettingsView = new SettingsView(this);
        //private configView: SettingsFileView = new SettingsFileView(this); 

        $config() {
            super.$config();

            let view = this.form.config().extend({ 
                elements: [ 
                    $u.label("Административные настройки").Size(-1),
                    $u.cols(
                        $u.button("Обновить код Битрикс").Click(() => this.refreshToken()),
                        //{ view: "button", value: "Закрыть", click: () => this.form.close(), width: 90, },
                        {}
                    ),
                    //this.settingsView.$config(),
                    //$u.cols(
                    //    $u.label("Sql diffs".link("api/sql/diff")),
                    //    $u.label("Sql sync".link("api/sql/sync")),
                    //    {}
                    //),

                    //this.configView.$config(), 
                    this.ui_editor(),
                    {},
                ]
            });
            return view;
        }

        ui_editor() {
            let editorCfg = $u.view("ace-editor").Ref(this.editor).extend({
                theme: "textmate",
                mode: "json",
                //value: JSON.stringify([{ name: 'aaa', id: 124 }], null, '\t'),
            }).Size(0, 400);

            let view = $u.rows(
                $u.toolbar(
                    $u.label("Файл конфигурации"),
                    {},
                    $u.button("Обновить").Click(() => this.load()),
                    $u.button("Сохранить").Click(() => this.save())
                ),
                editorCfg
            );
            return view;
        }


        $activate(args) {
            super.$activate(args);
            if(this.first)
                this.load();
        }


        private load() {
            let cfg = dbsystem.getConfig();
            let val = JSON.stringify(cfg, null, '\t');
            this.editor.setValue(val);
        }

        private save() {
            try {
                let val = this.editor.getValue();
                let json = JSON.parse(val);
                dbsystem.saveConfig(json);
                webix.message("Файл конфигурации сохранен на сервере");
            }
            catch (err) {
                $u.w.error(err.name + ": " + err.message);
            }
        }


        private refreshToken() {
            //this.form.save(models.bases.saveUrl(this.objectId), false);
            if (!confirm("Получить новый код Битрикс и записать в БД?")) return;
            let host = `${location.protocol}//${location.host}`;
            //let url = "https://hendrix.bitrix24.ru/oauth/authorize/?client_id=local.56376c666ab472.43252042&response_type=code&redirect_uri="+ host +"/&scope=crm,entity";
            let url = "https://hendrix.bitrix24.ru/oauth/authorize/?client_id=local.56376c666ab472.43252042&response_type=code&redirect_uri=https://hendrix.musbooking.com/&scope=crm,entity";
            It.Web.openUrl(url, null, true);
            alert("URL: " + url);
            webix.message("Новый авторизационный код битрикс успешно получен и сохранен: ");
        }

    }

}