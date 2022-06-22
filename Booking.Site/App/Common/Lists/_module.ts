module lists {

    export abstract class DataSource extends app.AppDataSource {

        names(args?): any[] {
            let items = this.load("names", args);
            return items;
        }

    }

}