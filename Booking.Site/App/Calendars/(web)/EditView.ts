module calendars {

    export class EditView extends $u.View {

        private form = new $u.RefForm();
        private toolbar = new $u.RefUI();
        onCalendarLink = new It.Event();


        $config() {
            super.$config();

            let settings = this.form.config().extend({
                elementsConfig: {
                    labelWidth: 80,
                    //labelPosition: "top",
                },
                elements: [
                    $u.element("provider").Label('Источник').AsSelect(calendarSources).Disable(),
                    $u.element("name").Label('Календарь').AsSelect([]),
                    $u.element("minDate").Label('Обновлено').AsDate(true).Tooltip("Дата последней синхронизации").Disable(),
                    $u.element("roomId").Label("Комната").AsSelect(rooms.db.names(null, true)),
                    $u.element("timeZone").Label("Час.пояс").AsSelect(common.timeZones),
                    $u.element("isArchive").Label("На паузе").AsCheckbox(),
                    $u.element("watchStatus").Label("Push").AsSelect(watch_statuses).Readonly(),
                    $u.element("watchResult").Label("Push result").AsTextArea(100).Readonly(),
                    $u.element("attempts").Label("Попыток").Readonly(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                ],
                on: {
                    onBindApply: x => this.reload(x),
                    //onBindRequest : x => this.reload(x),
                    //onBindUpdate : x => this.reload(x),
                }
            });

            let view = $u.rows(
                $u.panelbar(
                    {},
                    $u.button("Связать").Click(() => this.link()),
                    //$.button("Связать с Outlook").Disable(true),
                    $u.button("Тест").Click(() => this.test()),
                    $u.button("Сохранить").Click(() => this.save()),
                    //{},
                ).Ref(this.toolbar),
                //$.template("<hr/>"),
                settings,
                {}
            );
            return view;
        }

        bind(table: $u.RefTable) {
            this.form.bind(table);
        }

        private reload(obj) {
            if (!obj) return this.enable(false);

            super.$reload(obj.id);
            this.enable(obj.provider);

            let calendars = obj.calendars || [];
            //if (obj.calendars)
            //    calendars = _.map(obj.calendars, (x: any) => { return { id: x.id, value: x.summary, }; });
            this.form.setElement(this.form.elements.name, { options: calendars });
        }

        private enable(enable: boolean) {
            this.form.enable(enable);
            this.toolbar.enable(enable);
        }


        private save() {
            if (!this.form.validate()) return false;
            this.form.updateBindings(); 
            return true;
        }

        private link() {
            if (!this.save()) return;
            let vals = this.form.values();

            let url = oauth2.authUrl(vals.id, vals.provider);
            //url += "&user=" + access.user.login;

            setTimeout(() => It.Web.openUrl(url, null, true), 100);
            webix.alert("Нажмите ОК для обновления связанных календарей", () => this.onCalendarLink.call());
        }

        private test() {
            if (!this.save()) return;
            let events = db.test(this.objectId) || [];
            //let sel = events.map((x: any) => x.name + (x.start ? x.start.dateTime : ""));JSON.stringify(sel)
            alert("Результат синхронизации: " + events);
        }

    }

}

