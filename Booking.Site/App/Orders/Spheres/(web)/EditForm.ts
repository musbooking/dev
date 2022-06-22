module spheres  {

    export class EditForm {

        form = new $u.RefForm()

        config() {

            let form = this.form.config().extend({
                //gravity: 0.5,
                elements: [
                    $u.element("name").Label( "Сфера деятельности"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),

                    $u.element("index").Label("Индекс").AsInt(),
                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    //$.element("icon").Label("Иконка").Type('file'),
                    $u.uploader("api/core/upload", (x, y, z) => this.setImage(y)).extend({
                        value: "Загрузить иконку",
                        formData: {
                            prefix: 'spheres',
                        },
                    }),  // console.log('upload', x, y, z)
                    $u.element("icon").AsTemplate((x: string) => ('res/' + x).img({ height: '50px', width: '50px' })),
                    //$.element("limit").Label("Срок").AsNumber().Pattern({ mask: "## мес.## дн.", allow: /[0-9]/g }).Placeholder('?? мес. ?? дн'),
                    $u.element("limitM").Label("Срок, мес").AsInt(), //.Pattern({ mask: "##", allow: /[0-9]/g }),
                    $u.element("limitD").Label("Срок, дн").AsInt(),
                    $u.element("values").Label("Опции", "top").AsMultiSelect(groups.db.names(groups.GroupType.OrderOption)),
                    $u.element("default").Label("Опция по умолч", "top").AsSelect(groups.db.names(groups.GroupType.OrderOption)),
                    $u.element("features").Label("Параметры сферы", "top").AsMultiSelect(groups.db.features()).Tooltip("Выберите параметры, соответствующие всем комнатам сферы"),
                    $u.element("kind").Label("Тип сферы").AsSelect(kinds),
                    {},
                ]
            });
            return form;
        }

        private setImage(img) {
            this.form.elements.icon.setValues(img.path);
        }
    }

}