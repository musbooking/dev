module paydocs {

    class PayDocsSource extends app.AppDataSource {

        getItems(args): any[] {
            let list = this.load("list", args);
            return list;
        }

        getInvoices(args): any[] {
            let list = this.load("invoices", args);
            return list;
        }

        recalc(domain: guid) {
            return this.post('recalc', {domain});
        }
    }

    export let db = new PayDocsSource("paydocs");



    class PaymentSource extends app.AppDataSource {

        payment(args) {
            return this.post("payment", args);
        }
    }

    export let paymentdb0 = new PaymentSource("payonline");
    export let paymentdb = new PaymentSource("tinkoff");
    export let testdb = new PaymentSource("paytest");
}