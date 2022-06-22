var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// /// <reference path="../../_references.ts" />
var It;
(function (It) {
    var UI;
    (function (UI) {
        function loadPivotFiles(root) {
            if (root === void 0) { root = "lib/webix/pivot/"; }
            It.Web.loadCSS(root + "pivot.css?v=5.1.5");
            It.Web.loadJS(root + "pivot.js?v=5.1.5");
            //It.Web.loadJS(root + "cdn.webix.com/extras/xlsx.core.min.js");
            //It.Web.loadJS(root + "xlsx.core.min.js");
            It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
        }
        /** reference to the webix pivot */
        var RefPivot = /** @class */ (function (_super) {
            __extends(RefPivot, _super);
            function RefPivot(loadjs) {
                if (loadjs === void 0) { loadjs = true; }
                var _this = _super.call(this) || this;
                _this.loadjs = loadjs;
                return _this;
            }
            RefPivot.prototype.config = function () {
                if (this.loadjs)
                    loadPivotFiles();
                var config = new UI.Configs.PivotConfig(this);
                return config;
            };
            RefPivot.prototype.clearConfig = function (ask) {
                if (ask === void 0) { ask = false; }
                if (ask && !confirm("Сбросить настройки таблицы?"))
                    return;
                webix.storage.local.remove(this._configName);
                this.ref.setStructure(this._structure);
            };
            /**
             * Load, save, and clear config
             */
            RefPivot.prototype.setConfig = function (name, autosave) {
                var _this = this;
                if (autosave === void 0) { autosave = true; }
                this._structure = this.ref.getStructure();
                this._configName = location.host + "." + name;
                var config = webix.storage.local.get(this._configName);
                if (config)
                    this.ref.setStructure(config);
                if (autosave)
                    this.ref.attachEvent("onBeforeApply", function (structure) { return _this.saveConfig(structure); });
                return this;
            };
            RefPivot.prototype.saveConfig = function (structure) {
                //let config = this.pivot.ref.getStructure();
                webix.storage.local.put(this._configName, structure);
            };
            return RefPivot;
        }(UI.RefTable));
        UI.RefPivot = RefPivot;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var PivotConfig = /** @class */ (function (_super) {
                __extends(PivotConfig, _super);
                function PivotConfig(__pivot) {
                    var _this = _super.call(this) || this;
                    _this.__pivot = __pivot;
                    var view = {
                        view: "pivot",
                        id: _this.__pivot.id,
                        borderless: true,
                        totalColumn: "sumOnly",
                        footer: "sumOnly",
                    };
                    _this.extend(view);
                    return _this;
                }
                return PivotConfig;
            }(Configs.ContainerConfig));
            Configs.PivotConfig = PivotConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//# sourceMappingURL=pivots.js.map