module clients {

    export class HtmlView extends $u.HtmlView {

        $reload(id) {
            let html = db.html(id);
            this.setHtml(html);
        }

    }

}