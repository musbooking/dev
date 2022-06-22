module help {

    class HelpSource extends app.AppDataSource {

        config() {
            return this.load("config");
        }
    }

    let db = new HelpSource("help");
    
    export class HelpConfig {
        items = [
            { page: "test", text: "test", url: "" },
        ];

        private _current = this.items[0];// присваиваем фейковое значение при загрузке

        current(page?: string) {
            if (!page)
                return this._current;
            // find help
            if (this.items.find)
                this._current = this.items.find(h => page.indexOf(h.page) >= 0);
            return this._current;
        }
    }

    export let config: HelpConfig;

    export function load() {
        let cfg = db.config();
        config = new HelpConfig();
        webix.extend(config, cfg, true);
        //let items: any[] = cfg.items; //config.items.(cfg.items);
        //items.forEach(x => config.items.push(x)); 
    }


}
    




