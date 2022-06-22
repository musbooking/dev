module tarifs {

    export let create = {
        grid: () => new GridView(),
        form: () => new FormView(),
    };

    class TarifsSource extends app.AppDataSource {
        itemsUrl = this.url("list");
        names = () => this.load("names");
    }

    export let db = new TarifsSource("tarifs"); 
}