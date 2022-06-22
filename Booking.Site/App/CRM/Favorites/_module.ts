module favorites {

    class DataSource extends app.AppDataSource {

        add(room: guid) {
            return this.post("add", { room: room });
        }

        remove(room: guid): any[] {
            return this.post("remove", { room: room });
        }
    }

    export let db = new DataSource("favorites");

}