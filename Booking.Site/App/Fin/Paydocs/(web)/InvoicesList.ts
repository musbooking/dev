module paydocs {

    export class InvoicesList {
        list = new $u.RefList();

        config(ext?) {
            let cfg = this.list.config().extend({
                template: 'http->'+It.Web.WebSource.base+ '/html/invoice-list.html',
                type: {
                    href: "#!",
                    height1: "auto",
                    height: 160,
                },
                select: false,
            }).Size();
            if (ext)
                cfg = cfg.extend(ext);
            return cfg;
        }

        public reload(domainId) {
            let invoices = paydocs.db.getInvoices({ domain: domainId });
            this.list.refresh(invoices);
        }

    }

}