module equipments {

      export class BalanceView extends $u.View {

        private grid = new $u.RefGrid();
        onChange: callback;

        $config() {
            super.$config();

            let w = 35;
            let gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("n").Header("Кол").Sort().AsNumber().Edit(),
                    //$.column("groupId").AsSelect(groups.db.getNames(groups.GroupType.Equipment)).Header("Тип", -1).Sort(),
                    $u.column("name").Header("Название", -1).Sort(),
                    $u.column("price").Header("Цена", 45).AsInt().Sort(),
                    $u.column("count").Header("Всего", w).AsInt().Sort(),
                    $u.column("used").Header("Исп", w).AsInt().Sort(),
                    $u.column("balance").Header("Ост", w).AsInt().Sort(),
                ],
                //}).Editable().On("onCheck", this.onChange); // from: http://webix.com/snippet/a57f4c5f
            }).Editable().OnEdit((v,r)=> this.changed(v,r)); // изменили на кол-во

            return gridCfg;
        }

        refresh(list) {
            this.grid.refresh(list);
        }

        enable(enabled = true) {
            this.grid.enable(enabled);
          }

          changed(v, r) {
              let item = this.grid.getItem(r.row)
              if (item.n > item.balance) {
                  webix.message("Превышен лимит позиции");
                  item.n = item.balance
              }
              this.onChange(v,r)
          }

    }

}