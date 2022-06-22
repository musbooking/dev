module rooms {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //    if (typeid == "edit") return new EditView();
    //}

    export let create = {
        grid: () => new GridView(),
        edit: () => new EditView(),
    }


    class RoomsSource extends app.AppDataSource {
        itemsUrl = this.url("list");

        namesUrl = this.url("names");
        names = (baseid?, full?) => this.load('names', { base: baseid, full });

        units = () => this.load("names").map(x => { return { id: x.id, key: x.id, label: x.value, base: x.baseId, order: x.order }; });

        allowTime(date1: Date, date2: Date, roomid, baseid, domainid): boolean {
            let res = this.load("allowTime", { datefrom: date1, dateto: date2, room: roomid, base: baseid, domain: domainid });
            return res;
        }

        allowHours(rooms: string, hours: string): string {
            let res = this.loadStr("allowHours", { rooms, hours });
            return res;
        }
    }

    /**
    * Сервис работы с комнатами
    */
    export let db = new RoomsSource("rooms");
}