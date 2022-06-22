module domains {

    /**
     * Форма регистрации новой партнерской зоны
     */
    export class RegView extends $u.PopupView {

        $config() {

            let form = this.form.config().Labels(100).extend({
                //width: 400,
                elements: [
                    $u.header("Регистрация нового партнера".tag("b")),
                    $u.element("name").Label("Название").Require(),
                    $u.element("email").Label("E-mail").Require(),
                    $u.element("city").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)).Require(),
                    $u.element("spheres").Label("Сферы деятельности", "top").AsMultiSelect(spheres.db.names()).Require(),
                    //super.$config(),  
                    $u.cols(
                        {},
                        $u.button("Зарегистрироваться").Click(_ => this.register()).Size(200, 60),
                        {},
                    ),
                    {},
                ],
            });

            let cfg = $u.cols(
                {},
                form.Min(400),
                {},
            );
            return cfg;
        }

        $action(): boolean {
            if (!super.$action()) return false;
            this.hide();
            this.$clear();
            return true;
        }

        private register() {
            if (!this.form.validate()) return;
            let vals = this.form.values();
            vals.opers = RegView.OPERATIONS;
            db.registry(vals);
            webix.alert('Партнерская зона успешно зарегистрирована. Проверьте пожалуйста почту');
        }

        static OPERATIONS = [
            auth.oper.lists,
            auth.oper.listBases,
            auth.oper.basesAll, 
            auth.oper.equipments,
            auth.oper.promo,
            auth.oper.clients,

            auth.oper.orders,
            auth.oper.orderCancel,
            auth.oper.orderCancelAny,
            auth.oper.orderDelete,
            auth.oper.orderEdit,
            auth.oper.orderEditGroup,
            auth.oper.orderEditHold,
            auth.oper.orderForfeit,
            auth.oper.orderNew,
            auth.oper.orderViewFull,
            auth.oper.orderViewQuick,

            auth.oper.users,
            ];

    }


}

