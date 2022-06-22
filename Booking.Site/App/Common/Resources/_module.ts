module resources {

    //export function create(typeid: string): any {
    //    if (typeid == "cameras") return new CamerasView();
    //}


    export let create = {
        cameras: () => new CamerasView(),
    }


    export enum ResourceKind {
        RoomPhoto = 3,
        RoomUrl = 4,
        BaseCamera = 7,
        ClientPhone = 8,
    }

    export let phoneTypes = [
        { id: "MOBILE", value: "Мобильный" },
        { id: "WORK", value: "Рабочий" },
        { id: "HOME", value: "Домашний" },
    ];


    export let urlTypes = [
        { id: "sound", value: "Sound Cloud" },
        { id: "video", value: "Видео" },
        { id: "web", value: "Ссылка" },
        { id: "other", value: "Другое" },
    ];


    class ResourcesSource extends app.AppDataSource {

        getItems(kind: ResourceKind, id): any[] {
            let list = this.load("list", { kind, id });
            return list;
        }

        testPhone(id: string, phone: string) {
            if (!phone) return null;
            return this.loadStr("testPhone", { id, phone });
        }


        camerasUrl = this.url("cameras");

    }

    export let db = new ResourcesSource("resources");

}