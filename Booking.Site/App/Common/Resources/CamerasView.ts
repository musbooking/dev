module resources {

    export class CamerasView extends $u.View {
        private list = new $u.RefList();
         
        $config() {
            let listCfg = this.list.config().extend({
                view: "dataview",
                itemheight: true,
                select: false,
                //template: "<div>#name#</div> #id# UUU",
                template: function (obj) {
                    let cls = "base_" + obj.type;
                    let html = `<div class='${cls}'><strong>${obj.name}</strong><hr>`; //${obj.id}<br/>class='overall'
                    let res: any[] = obj.resources;
                    res.forEach(x=> html += `<div>${x.name}</div>`.link(x.value, {target:"_blank"}));
                    html += "</div>";
                    return html;
                },
                type: {
                    height: 150,     //  dimensions of each dataview item
                    width: 250
                },
                url: db.camerasUrl,
            });

            let cfg = {
                rows: [
                    {
                        cols: [
                            $u.label("Список камер"),
                            this.list.btnRefresh(),
                            {},
                        ],
                    },
                    listCfg,
                ],
            };
            return cfg;
        }
    }

}