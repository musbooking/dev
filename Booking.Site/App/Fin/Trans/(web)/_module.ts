module trans {

    export let create = {
        grid: () => new GridView(),
        totals: () => new TotalsView(),
    }


    class DbSource extends app.AppDataSource {

        search(args) {
            return this.loadList('search', args);
        }

        totals(args) {
            return this.loadList('totals', args);
        }

        groups = (level?) => this.loadList("groups", { level: level });
    }

    /** * Работа с проводками */
    export let db = new DbSource("trans");


}

