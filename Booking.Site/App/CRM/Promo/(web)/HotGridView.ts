module promo {

    export class HotGridView extends $u.View {

        private grid = new $u.RefGrid();
        private formview: HotEditView = new HotEditView(this);

        $config() {
            super.$config();
            
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Название", 100).Sort().Filter(),
                    $u.column("discount").Header("%", 60).AsInt().Sort().Filter(),
                    $u.column("discountSum").Header("Руб", 60).AsInt().Sort().Filter(),
                    $u.column("hours").Header("Время", -1).Filter(),
                    $u.column("description").Header("Описание", -3).Filter(),
                    $u.column("dateTo").Header("Дата").AsDate(),
                    //$.column("isIgnoreEquipment").Header("0-Оборуд").AsCheckbox().Sort().Edit(),
                    //$.column("isAction").Header("Акция").AsCheckbox().Sort().Edit(),
                    //$.column("id").AsInt().Header("(Код)", 50).Sort(), 
                ],
                scheme: { // defaults: https://docs.google.com/document/d/1SFW7Rc-jfzm1JPY7fNZwoVeiazKPEUWWGopLiZR0G8U/edit
                    id: -1,
                    name: "без имени",
                    type: PromoKind.Hot,
                    //groupKinds: "" + orders.GroupKind.Group,
                    clientDiscountKind: app.DiscountKind.IgnoreDiscount,
                    eqClientDiscountKind: app.DiscountKind.UseDiscount,
                    isOverride: true,
                    isToday: true,
                },

                //url: db.getItemsUrl(PromoKind.Hot),
                save: db.getSaveCfg(true),
            }).Editable();

            let view = $u.rows(
                $u.toolbar(
                    this.grid.btnAdd(),
                    this.grid.btnDel(),
                    this.grid.btnRefresh(),
                    {},
                    $u.icon("save").Click(_ => this.formview.form.updateBindings())
                ),
                $u.cols(
                    gridCfg,
                    $u.splitter(),
                    this.formview.$config().Size(300),
                )
            );
            return view;
        }

        $init() {
            super.$init();
            this.formview.form.bind(this.grid);
        }

        $reload(id?) {
            super.$reload(id);
            let list = db.list({ type: PromoKind.Hot });
            this.grid.refresh(list);
        }

        //activate(query, first: boolean) {
        //    super.activate(query, first);
        //    if (!first) this.grid.refresh();
        //}
    }


}