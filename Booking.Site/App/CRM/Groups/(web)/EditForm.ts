module groups {

    /**
     * Универсальный редактор группы
    */
    export class EditForm {

        constructor(private type: GroupType, private header = "Название") {
            //super();
        }

        form = new $u.RefForm()

        config() {

            let form = this.form.config().extend({
                //gravity: 0.5,
                elements: [
                    $u.element("name").Label(this.header, "top"), 
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                ],
            });

            if (this.type == GroupType.Version)
                form.Elements(
                    $u.element("description").Label("E-mail партнера").AsHtmlEditor(300, "top"),
                );

            if (this.type == GroupType.Equipment || this.type == GroupType.RoomFeature)
                form.Elements(
                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    //$.element("icon").Label("Иконка").Type('file'),
                    $u.uploader("api/core/upload", (x, y, z) => this.setImage(y)).extend({
                        value: "Загрузить иконку",
                        formData: {
                            prefix: 'spheres',
                        },
                    }),  // console.log('upload', x, y, z)
                    $u.element("icon").AsTemplate((x: string) => ('res/' + x).img({ height: '50px', width: '50px' })),
                );


            form.Elements(
                {},
            );

            return form;
        }

        private setImage(img) {
            this.form.elements.icon.setValues(img.path);
        }
    }

}