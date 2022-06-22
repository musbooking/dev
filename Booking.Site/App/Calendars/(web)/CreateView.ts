module calendars {
    
    export class CreateView extends $u.PopupView { 

        $config() {

            let formCfg = this.form.config().Labels(100).extend({
                width: 400,
                elements: [ 
                    $u.label("Синхронизация с календарем".tag("strong")).Css("webix_toolbar"),
                    $u.element("provider").Label("Источник").AsSelect(calendarSources).Require(),
                    $u.element("roomId").Label("Комната").AsSelect(rooms.db.names(null, true)).Require(),
                    super.$config(),  
                ],
            });
            return formCfg;
        }

        $action(): boolean {
            if (!this.form.validate()) return;

            this.hide();
            super.$action();
            this.$clear();
            return true;
        }

        $clear() {
            //this.form.clear({name: ""});
            super.$clear();  // на всякий - добиваем, иначе остается мусор
        }
    }


}

