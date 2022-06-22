module groups {

    /**
     * РЕдактор типов параметров
    */
    export class FeaturesGridView extends $u.View {

        private grid = new $u.RefGrid();
        // private form = new EditForm(GroupType.RoomFeature);
        private form = new $u.RefForm()


        $config() {
            super.$config();
            let me = this;
            let grid = this.grid.config().extend({
                columns: [
                    $u.column().AsOrderMarker(),
                    $u.column("categoryId").Header("Тип", 150).Sort().AsSelect(db.names(GroupType.FeatureType)).Filter().Edit(),
                    $u.column("name").Header("Параметр", 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                    name: "новый параметр",
                    type: GroupType.RoomFeature,
                    order: 1000,
                },
                save: db.getSaveCfg(true),

            }).Editable().DragOrder((start, ids) => db.reindex(start, ids), true);

            let view = $u.rows(
                $u.panelbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.refresh()),
                    {},
                    $u.button("Сохранить").Click(() => this.form.updateBindings()),
                ),
                $u.cols(
                    grid,
                    this.configForm().Size(350)
                )
            );

            return view;
        }

        private configForm() {

            let form = this.form.config().extend({
                //gravity: 0.5,
                elements: [
                    $u.element("name").Label("Параметр комнаты", "top"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    //$.element("icon").Label("Иконка").Type('file'),
                    $u.element("sphereIds").Label("Сферы", "top").AsMultiSelect(spheres.db.names()),
                    $u.uploader("api/core/upload", (x, y, z) => this.setImage(y)).extend({
                        value: "Загрузить иконку",
                        formData: {
                            prefix: 'spheres',
                        },
                    }),  // console.log('upload', x, y, z)
                    $u.element("icon").AsTemplate((x: string) => ('res/' + x).img({ height: '50px', width: '50px' })),
                    {},
                ]
            });

            return form;
        }

        private setImage(img) {
            this.form.elements.icon.setValues(img.path);
        }


        $init() {
            super.$init();
            this.form.bind(this.grid);
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }

        private refresh() {
            let rows = db.list({ type: GroupType.RoomFeature });
            this.grid.refresh(rows);
        }


    }




}