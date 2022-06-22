module rooms {

    export class EditView extends $u.View {

        private form = new $u.RefForm();
        //private pricesView: prices.GridView = new prices.GridView(this);
        private uploader = new $u.RefUI();
        private files = new $u.RefDataView();
        //private calendarSyn: calendars.SettingsView = new calendars.SettingsView(this);
        private urlView: resources.UrlView = new resources.UrlView().owner(this);


        $config() {
            super.$config();

            let me = this;
            let w = 100;

            let uploader = {
                view: "uploader",
                id: this.uploader.id,
                value: "Загрузите фото или перетащите файл",  // 
                //link: this.files.id,
                upload: "api/resources/upload/",
                accept: "image/png, image/gif, image/jpg",
                datatype: "json",
                multiple: true,
                on: {
                    onFileUpload: function (items) {
                        //webix.message("Done");
                        let item = items[0];
                        me.files.callNoEvents(() => me.files.add(item));
                        // ELMSOFT 
                        var s = me.form.values(); 
                        s.files.insert(item.sort, {
                            "id": item.id,
                            "name": item.name,
                            "value": item.value,
                            "sort": item.sort,
                        });
                        me.form.setValues(s);
                    }
                },
            };

            const hoursTooltop = "Укажите на каких условиях возможны почасовые занятия по будням и выходным дням заранее в формате 0,6,15,24. Например: «0,6,12,13,14,15,16,17,18,21,24» - что означает с 0 до 6 комнату можно забронировать только на 6 часов, с 12 до 18 можно забронировать комнату на 1 час, а с 18 до 24 только на 3";
            const hhelp = "Укажите на каких условиях возможны почасовые занятия по будням и выходным дням день в день в формате 0,6,15,24. Например: «0,15,16,17,18,19,20,21,22,23,24» - что означает, что комнату можно забронировать только с 3 часов дня, и до окончания работы объекта комната доступна для бронирования по часу. (Понятие «сегодня» определяется датой, это значит, что условия бронирования указанное в этих полях вступает в силу в 00:01 сегодняшнего дня)";
            let view = this.form.config().Labels(150).extend({
                borderless: true,
                //width: 500,

                elements: [
                    $u.cols(
                        $u.button("Сохранить").Click(() => me.save()),
                        //$.button("Календарь").Click(() => me.setSync()),
                        //$.button("Календарь").Popup(this.calendarSyn.config()),
                        {}
                    ), 
                    $u.cols( 
                        $u.rows(
                            //$.element("id").Label("Код").AsLabel(),
                            $u.element("baseId").Label("База").AsSelect(bases.db.names(true)).Require().Tooltip("Выберите созданный в разделе «Базы» объект, в котором расположена комната"),
                            $u.element("name").Label("Название").Require().Tooltip("Введите название комнаты для потенциальных клиентов"),
                            $u.element("color").Label("Цвет").AsColor().Tooltip("Цвет в календаре"),
                            $u.element("shareId").Label("Общая комната").AsSelect(db.names(null, true)).Tooltip("Выберите общую комнату если это помещение используется в других сферах оказания услуг. Например, если эта комната используется на студии звукозаписи в качестве тон-зала, укажите ее в этом поле и в поле «общая комната» самого тон зала (Указывать нужно одну и ту же комнату)"),
                            $u.element("isArchive").Label("Архив").AsCheckbox().Tooltip("Используется для удаления комнаты из раздела «Календарь» и других, если в этой комнате были бронирования"),
                            //$.element("isPromo").Label("Акция").AsCheckbox(),
                            $u.element("allowMobile").Label("Мобильный доступ").AsCheckbox().Tooltip("Используется для публикации и скрытия комнаты в приложении. Не выставляйте эту галочку пока не убедитесь в полном заполнении информации в разделах «Базы», «Комнаты», «Позиции» и «Цены»"),

                            $u.element("defaultHours").Label("Часы бронирования").Tooltip(hoursTooltop),
                            $u.element("weekendHours").Label("Часы в выходные").Tooltip(hoursTooltop),
                            $u.element("todayHours").Label("Часы сегодня").Tooltip(hhelp),
                            $u.element("todayWkHours").Label("Часы вых. сегодня").Tooltip(hhelp),
                            $u.element("hoursBefore").Label("Часы до начала").AsNumber().Tooltip("Минимальное кол-во часов до бронирования"),

                            $u.element("minHours").Label("Мин.длительность - заранее, заранее вых, сег, сег вых. Пример: 2,3,1", 'top')
                                .Tooltip('Минимальная длительность бронирования - можно задавать частично, по умолчанию берется левая цифра, например: 2,0,3'),

                            //$.element("description").Label("Описание").AsTextArea(100),
                            $u.element("square").Label("Площадь").AsInt().Require().Tooltip("Укажите фактическую площадь комнаты в виде цифры. Например: 35"),
                            $u.element("features").Label("Доп.параметры комнаты", "top").AsMultiSelect([]).Tooltip("Выберите параметры, соответствующие комнате"),
                            $u.element("raider").Label("Райдер").AsTextArea().Autoheight().Min(0, 150).Require().Tooltip("Введите список оснащения комнаты. Аппарат, приспособления, цветовая гамма и оформление"),
                            $u.element("channelIds").Label("Способы оплаты").AsMultiSelect(paychannels.db.names()),

                            //this.calendarSyn.$config(),
                            //{},
                        ),
                        $u.rows(
                            $u.element("videoUrl").Label("Ссылка на видео").Tooltip("Вставьте ссылку на видео презентацию комнаты"),
                            this.urlView.$config().Size(0, 150),

                                //.OnChange( x => !x || me.form.elements.video.setValues(x)  ),
                            //$.element("video").AsTemplate((x: string) => '<video width="320" height="240" controls> <source src="'+ x +'" type1="video"></video>' ),
                            //$.element("video").AsTemplate((x: string) => '<embed src="'+ x +'" width="400px" height="200px"/>'),
                            $u.cols(
                                uploader,
                                //$.button("Удалить").Tooltip("Удалить выделенные фото")
                                // ELMSOFT delete files
                                this.files.btnDel().extend({
                                    on: {
                                        onItemClick: function (id, e) {
                                            var arr = me.files.data().config.store.order;
                                            var s = me.form.values();
                                            var temp = [];

                                            s.files.forEach(function (element) {
                                                var yes = arr.find(element.id);
                                                if (yes == -1) {
                                                    resources.db.delete(element.id);
                                                    temp.insert(0, element);
                                                }
                                            });

                                            temp.forEach(function (element) {
                                                s.files.remove(element);
                                            })

                                            me.form.setValues(s);
                                        },
                                    }
                                })
                            ),
                            this.files.config().extend({
                                //save: resources.db.getSaveCfg(true),
                                drag: "move",
                                select: true,
                                on: {
                                    onAfterDrop: function (data, e) {
                                        var s = me.form.values()
                                        var arr = me.files.data().config.store.order;
                                        var k = 0;
                                        if (s.files.length != 0) {
                                            arr.each(function (element) {
                                                s.files.findById(element).sort = k;
                                                k++;
                                            });
                                            me.form.setValues(s);
                                        }
                                    }
                                },
                            }).Template("<img src='files/res/#value#' width1='150' height='250' />").ItemSize("auto", 250)
                        )),

                    //this.pricesView.config(),
                    {},
                ],

                scheme: {
                    $change: x=> alert(x),
                },


                rules: {
                    $obj: function (x, obj) {
                        let n: number = me.files.get<webix.DataStore>().count();
                        return n > 2 || It.UI.w.error("Вставьте минимум 3 фото");
                    },
                }

            });
            return view;
        }

        $init() {
            super.$init();
            this.uploader.ref.addDropZone(this.files.ref.$view);
        }

        $reload(id) {
            super.$reload(id);
            this.uploader.set({
                //upload: "api/rooms/upload/" + this.objectId,
                formData: {
                    // room: id,  -- obsolete
                    id: id,
                    kind: resources.ResourceKind.RoomPhoto,
                },
            });

            let obj = this.form.load(db.getUrl(id));
            this.files.refresh(obj.files);
            this.urlView.$reload(id);
            //this.calendarSyn.$reload(obj.id);
            this.form.setElement("features", { suggest: groups.db.features({sphere: obj.sphereId}) });
        }

        private save() {
            if (!this.form.validate()) // || !this.calendarSyn.validate())
                return; // webix.message("Данные введены некорректно");

            this.form.values().files.forEach(function (element) {
                resources.db.save(element);
            })

            this.form.save(db.saveUrl(this.objectId), false);

            webix.message("Данные сохранены на сервере");
        }

        private setSync() {
            It.Web.openUrl("#!/services/sync", { oid: this.objectId }); 
        }


    }

}