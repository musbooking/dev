module app.configs {

    class DataSource extends app.DataSource {

        menu() {
            return this.load("menu");
        }
    }

    export let db = new DataSource("cfg");

}




