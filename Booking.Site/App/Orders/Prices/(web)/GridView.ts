module prices {

    export class GridView extends $u.View {

        //constructor(private autoload = false) {
        //    super();
        //}
        public full = false;
        private grid = new $u.RefGrid();
        private editForm = new EditForm();

        $config() {
            super.$config();

            let me = this;
            let promos = promo.db.names(true, promo.PromoKind.Rules);
            this.editForm.full = this.full;

            let pricesGridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(), 
                    $u.column("baseId").Header("База", 130).AsSelect(bases.db.namesUrl).Sort().Filter().Visible(this.full),
                    $u.column("roomId").Header("Комната", 100).AsSelect(rooms.db.namesUrl).Sort().Filter().Visible(this.full),
                    $u.column("timeFrom").AsInt().Header("С", 40).Sort(),
                    $u.column("timeTo").AsInt().Header("По", 40).Sort(),
                    $u.column("workingFPrice").AsInt().Header("Перв.Раб", 50).Sort(),
                    $u.column("workingPrice").AsInt().Header("Рабочие", 50).Sort(),
                    $u.column("workingLPrice").AsInt().Header("Посл.Раб", 50).Sort(),
                    $u.column("weekend1Price").AsInt().Header("СБ", 50).Sort(),
                    $u.column("weekend2Price").AsInt().Header("ВС", 50).Sort(),
                    $u.column("promoId").Header("Условие").AsSelect(promos).Sort().Filter().Edit(), 
                    $u.column("description").Header("Описание", -1).Filter(),
                ],

                scheme: {
                    timeFrom: 0,
                    timeTo: 24,
                    workingLPrice: 0,
                    workingPrice: 0,
                    workingFPrice: 0,
                    weekend1Price: 0, 
                    weekend2Price: 0, 
                },

                save: prices.db.getSaveCfg(true),

            }).Editable();


            let view = $u.rows(
                $u.toolbar(
                    $u.label("Список цен"),
                    this.grid.btnAdd(),
                    //$.icon("plus").Click(() => this.create()),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(_ => this.reload2(null,null)),
                    {},
                    $u.icon("save").Click(() => this.save())
                ),
                $u.cols(
                    pricesGridCfg,
                    $u.splitter(),
                    this.editForm.config(),
                )
            );
            return view;
        }

        $init() {
            this.editForm.form.bind(this.grid);
        }

        reload2(roomid, baseid) {
            super.$reload(roomid);
            let sh = {
                timeFrom: 0,
                timeTo: 24,
                workingLPrice: 0,
                workingPrice: 0,
                workingFPrice: 0,
                weekend1Price: 0,
                weekend2Price: 0,
                roomId: roomid,
                baseId: baseid
            };
            this.grid.scheme(sh);

            let data = db.list_items(roomid, baseid);
            this.grid.refresh(data);
            return this;
        }

        //private create() {
        //    this.grid.bindNew();
        //}

        private save() {
            this.editForm.form.updateBindings();
        }
    }

}