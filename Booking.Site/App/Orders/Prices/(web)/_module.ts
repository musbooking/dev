module prices {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") {
    //        let grid = new GridView();
    //        grid.onactivate = () => grid.reload2(null, null);
    //        grid.full = true;
    //        return grid;
    //    }
    //}


    export let create = {
        grid: () => {
            let grid = new GridView();
            grid.onactivate = () => grid.reload2(null, null);
            grid.full = true;
            return grid;
        },
    }


    class PricesSource extends app.AppDataSource {
        list_items = (roomid, baseid) => this.list( { room: roomid, base: baseid });
        baseItems = (baseid) => this.load("baseItems", { base: baseid });
    }
    /**
        * Сервис работы с ценами на комнату     
        */
    export let db = new PricesSource("prices");


    //export enum PriceKind {
    //    Solo = 1,
    //    Duet = 2,
    //}

    //export let pricesKinds = [
    //    { id: PriceKind.Solo, value: "Соло (1 чел)" },
    //    { id: PriceKind.Duet, value: "Дуэт (2 чел)" },
    //]; 


}