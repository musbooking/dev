module orders {
    
    export class OrderEditor {
        private detailsView = new orders.EditView();
        private win: $u.RefWin = new $u.RefWin("Редактирование брони");

        constructor(private onclose?: callback) {
            this.win.resize = false;
            //this.win.onHide = onclose;
            this.detailsView.onclose = () => this.closeEditor();
            this.win.config(this.detailsView.$config());
        }

        edit(id: number) {
            if (!id || typeof id != "string")
                return It.UI.w.error("Не выделен или не сохранен текущий заказ!");
            this.win.show(); 
            let vals = this.detailsView.$reload(id);
            //let head = getOrderText(vals);
            this.win.setHead("Карточка брони");
        }

        private closeEditor() {
            this.win.hide();
            if (this.onclose)
                this.onclose();
        }
    }

}

