module bases {

    /** edit base */
    export class EditView extends $u.View {

        private form = new $u.RefForm();
        private camerasGrid = new $u.RefGrid();
        //private pricesView: prices.GridView = new prices.GridView(this);


        $config() {
            super.$config();

            let w = 100;

            let camerasGridCfg = this.camerasGrid.config().extend({
                height: 200,
                columns: [
                    $u.column("name").Header("Название", 200).Edit(),
                    $u.column("value").Header("Ссылка", -1).Edit(),
                ],
                scheme: {
                    name: "без имени",
                },

            }).Editable(resources.db.getSaveCfg());

            const hhelp = "Укажите часы работы базы по будням и выходным дням в формате 0-24. Например: «0-6,12-24» (означает что с 0 до 6 проходят ночные репетиции, с 6 до 12 объект не работает, далее объект работает с 12 утра до 12 вечера)";
            let view = this.form.config().extend({
                elementsConfig: {
                    labelWidth: 150,
                },
                elements: [
                    $u.cols(
                        $u.button("Сохранить").Click(() => this.save()),
                        {}
                    ),
                    //$.element("id").Label("Код").AsLabel(),
                    //$.element("type").Label("Тип базы").AsSelect(baseTypes).Require().Tooltip("Выберите сферу оказания услуг вашего объекта"),
                    $u.element("sphereId").Label("Сфера").AsSelect(spheres.db.names()).Require().Tooltip("Выберите сферу оказания услуг вашего объекта"),
                    $u.element("name").Label("Название").Require().Tooltip("Введите название объекта оказания услуг для потенциальных клиентов"),
                    $u.element("description").Label("Описание").AsTextArea(100).Require().Tooltip("Введите описание объекта оказания услуг. Описание транслируется в приложение и отображается в каждой комнате. Отразите в этом поле все особенности и сильные стороны вашего объекта, чтобы клиент выбрав одну из ваших комнат решил забронировать именно ее."),
                    $u.element("rules").Label("Правила").AsTextArea(100).Tooltip("Введите правила объекта оказания услуг"),
                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)).Require().Tooltip("Введите или выберите ближайший населенный пункт, в котором расположен объект оказания услуг"),
                    $u.element("address").Label("Адрес").AsTextArea(100).Require().Tooltip(" Введите точный адрес объекта без указания города"),
                    $u.cols(
                        $u.rows(
                            $u.element("phones").Label("Телефоны").Require().Tooltip("Укажите телефон, который будет использоваться для связи с объектом по вопросам бронирования"),
                            $u.element("email").Label("e-mail").Require().Tooltip("Введите e-mail, который будет использоваться для уведомлений о новых бронированиях"),
                            $u.element("direction").Label("Как пройти").AsTextArea(100).Require().Tooltip("Введите текстовое описание маршрута до вашего объекта от ближайшей станции метро или остановки общественного транспорта"),
                        ),
                        $u.rows(
                            $u.uploader("api/core/upload-image", (x, img, z) => this.form.elements.logo.setValues(img.path)  ).extend({
                                value: "Загрузить логотип",
                                formData: {
                                    folder: 'bases',
                                },
                            }),  // console.log('upload', x, y, z)
                            $u.element("logo").AsTemplate((x: string) => ('res/' + x).img({ height: '150px', width: '150px' })),
                        ).Size(170)
                    ),

                    $u.cols(
                        $u.element("gpsLat").Label("GPS Latitude").Require().Tooltip("Укажите координаты входа на базу. Удобней всего скопировать их из Яндекс карт"),
                        $u.element("workTime").Label("Часы (раб.дни)").Tooltip("Часы работы, пример: 09-18").Require().Tooltip(hhelp), //.Format(meta.timePattern)
                    ),
                    $u.cols(
                        $u.element("gpsLong").Label("GPS longitude").extend({ rule: webix.rules.isNumber }).Require().Tooltip("Укажите координаты входа на базу. Удобней всего скопировать их из Яндекс карт"),
                        $u.element("weekendTime").Label("Часы (вых.дни)").Tooltip("Часы работы, пример: 08-24").Require().Tooltip(hhelp), //.Format(meta.timePattern)
                    ),
                    $u.element("metro").Label("Метро").Require().Tooltip("Укажите ближайшую или ближайшие станции метро через запятую. Если в городе нет метро, можно использовать ближайшую остановку общественного транспорта"),
                    $u.element("videoUrl").Label("Ссылка на маршрут").Require().Tooltip("Вставьте ссылку на ролик, изображение или описание как пройти. Если отсутствует можно использовать ссылку на раздел 'Контакты' вашего сайта, страницы в соц. сети или контрагента"),

                    $u.element("channelIds").Label("Способы оплаты").AsMultiSelect(paychannels.db.names()),
                    $u.cols(
                        $u.element("isRequest").Label("По заявке", null, 70).AsCheckbox().Size(120),
                        $u.element("request").Label("Описание заявки").AsTextArea(100),
                    ),
                    $u.element("maxPointsPcPay").Label("Макс.% оплаты баллами ").AsInt(),
                    $u.element("isArchive").Label("Архив").AsCheckbox().Tooltip("Используется для архивации базы"),

                    //this.pricesView.config(),

                    $u.cols(
                        $u.button("Сохранить").Click(() => this.save()),
                        {}
                    ),

                    $u.toolbar(
                        $u.label("Список камер на базе").Size(-1),
                        this.camerasGrid.btnAdd(),
                        this.camerasGrid.btnDel()
                    ),
                    camerasGridCfg,
                ],

                rules: {
                    //$obj: obj =>
                    //    !obj.channelIds && !obj.isRequest ||
                    //    obj.channelIds && !obj.isRequest ||
                    //    !obj.channelIds && obj.isRequest ||
                    //    //this.check(obj.channelIds) ||
                    //    It.UI.w.error("Можно заполнить либо 'Предоплата', либо 'По заявке'"),
                }

            });
            return view;
        }

        //private check(channels: string) {
        //    if (!channels) return false;
        //    let ids = channels.split('')
        //}

        $reload(id) {
            super.$reload(id);
            let vals = this.form.load(db.getUrl(id));
            let cameras = resources.db.getItems(resources.ResourceKind.BaseCamera, id);
            this.camerasGrid.refresh(cameras);
            this.camerasGrid.scheme({
                name: "камера",
                kind: resources.ResourceKind.BaseCamera,
                objectId: id,
            });
            //this.pricesView.reload2(null, id);
        }

        private save() {
            if (!this.form.validate()) return;
            this.form.save(db.saveUrl(this.objectId), false);
            this.camerasGrid.save();
            webix.message("Данные сохранены на сервере");
        }

    }

}