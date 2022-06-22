// /// <reference path="../../_references.ts" />
module It.UI {

    function loadPivotFiles(root = "lib/webix/pivot/") {
        It.Web.loadCSS(root + "pivot.css?v=5.1.5");
        It.Web.loadJS(root + "pivot.js?v=5.1.5");
        //It.Web.loadJS(root + "cdn.webix.com/extras/xlsx.core.min.js");
        //It.Web.loadJS(root + "xlsx.core.min.js");
        It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
    }


    /** reference to the webix pivot */
    export class RefPivot extends RefTable {
        constructor(private loadjs = true) {
            super();
        }
        config(): Configs.PivotConfig {
            if (this.loadjs)
                loadPivotFiles();

            let config = new Configs.PivotConfig(this);
            return config;
        }

        private _configName: string;
        private _structure;

        clearConfig(ask = false) {
            if (ask && !confirm("Сбросить настройки таблицы?"))
                return;
            webix.storage.local.remove(this._configName);
            this.ref.setStructure(this._structure);
        }


        /**
         * Load, save, and clear config
         */
        setConfig(name: string, autosave = true) {

            this._structure = this.ref.getStructure();

            this._configName = location.host + "." + name;

            let config = webix.storage.local.get(this._configName);
            if (config)
                this.ref.setStructure(config);

            if (autosave)
                this.ref.attachEvent("onBeforeApply", structure => this.saveConfig(structure)); 

            return this;
        }

        saveConfig(structure) {
            //let config = this.pivot.ref.getStructure();
            webix.storage.local.put(this._configName, structure);
        }
    }

}

module It.UI.Configs {
    export class PivotConfig extends ContainerConfig {

        constructor(protected __pivot: UI.RefPivot) {
            super();
            let view = {
                view: "pivot",
                id: this.__pivot.id,
                borderless: true,
                totalColumn: "sumOnly",
                footer: "sumOnly",
            };
            this.extend(view);
        }

    }
}