module equipments {

    export class EditForm {

        constructor() {
            //super();
        }

        form = new $u.RefForm()

        config() {

            let form = this.form.config().extend({
                //gravity: 0.5,
                elements: [
                    $u.element("groupId").Label("Тип").AsSelect(groups.db.names(groups.GroupType.Equipment)).Tooltip("Выберите тип позиции, для дополнительных услуг используйте тип «Другое»"),
                    //$.column("roomId").AsSelect(models.rooms.names).Header("Комната", 150).Sort().Filter(),
                    $u.element("name").Label("Название").Tooltip("Введите название позиции в формате «Электрогитара Gibson SG»"),
                    $u.element("kind").Label("Тип").AsSelect(eqKinds),
                    $u.element("description").Label("Описание").AsTextArea(100, "top").Tooltip("Введите описание позиции или его особенности. Клиентам в приложении эта информация не отображается.<br> Описание используется для вашего удобства, например, когда меняли струны на гитаре, или привезли новую тарелку"),
                    $u.uploader("api/core/upload-image", (x, y, z) => this.setImage(y)).extend({
                        value: "Загрузить фото",
                        accept: "image/*",
                        datatype: "json",
                        formData: {
                            folder: 'equipments',
                        },
                    }).Css('it-crop'),  // console.log('upload', x, y, z)
                    $u.element("photoUrl").AsTemplate((x: string) => ('res/' + x).img({ height: '150px', width: '350px' })),

                    $u.element("price").Label("Цена").AsInt().Tooltip("Укажите цену за позицию.<br> Если оборудование предоставляется бесплатно введите «0»"),
                    $u.element("count").Label("Кол").AsInt().Tooltip("Укажите фактическое количество для позиции одного наименования на объекте.<br>Это поможет избежать бронирования одного и того же наименования несколькими клиентами"),
                    $u.element("baseId").Label("База").AsSelect(bases.db.names(true)).Tooltip(" Выберите объект на котором предоставляется выбранное наименование позиции"),
                    $u.element("roomIds").Label("Комнаты").AsMultiSelect(rooms.db.names(null, true)).Tooltip(" Выберите объект на котором предоставляется выбранное наименование позиции"),
                    $u.element("destKind").Label("Назначение").AsSelect(destKinds),
                    //$u.element("isSkipTime").Label("Не учитывать время").AsCheckbox(true),
                    $u.element("kf").Label("Кф проп.").AsInt().Tooltip("Кф. пропорции. Если 0, то стоимость оборуд. фиксирована, иначе = Цена * Кол-во часов / Кф"),
                    $u.element("allowMobile").Label("Моб").AsCheckbox().Tooltip("Используйте галочку «моб» для публикации или удаления выбранной позиции в мобильном приложении"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    {},
                ]
            });

            return form;
        }

        private setImage(img) {
            this.form.elements.photoUrl.setValues(img.path);
        }
    }

}