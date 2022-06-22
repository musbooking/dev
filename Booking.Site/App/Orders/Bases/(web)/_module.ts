module bases {
    
    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //    if (typeid == "edit") return new EditView();
    //}


    export let create = {
        grid: () => new GridView(),
        edit: () => new EditView(),
    }

    ///**  Виды баз */
    //export enum baseType {
    //    Repetition = 10,
    //    Dance = 20,
    //    Records = 30,
    //}

    //export let baseTypes = [
    //    { id: baseType.Repetition, value: "Репетиционные базы" },
    //    { id: baseType.Dance, value: "Танцевальные студии" },
    //    { id: baseType.Records, value: "Студии звукозаписи" },
    //];


    class BasesSource extends app.AppDataSource {
        namesUrl = this.url("names");

        names = (check?: boolean) => this.loadList("names", { check: check });

        //itemsUrl = this.url("items");
        //list(args?) {
        //    return super.load("list0", args);
        //}


        getFull = (type: number, date: Date, hours: number, base?) => {
            let list = this.load("full", { base, type, from: date, hours });
            return list;
        };
    }
    /**
        * Сервис работы с репетиционными базами
        */
    export let db = new BasesSource("bases");

}