/// <reference path="../../../_references.ts" />
///// <reference path="vue-dts/index.d.ts" />
/// <reference path="vue-dts/vue.d.ts" />
var It;
(function (It) {
    var UI;
    (function (UI) {
        /*
         * Подключение Vue к элементу webix
         */
        UI.RefUI.prototype.vue = function (data, methods, computed) {
            var me = this;
            var elem = $$(me.id);
            var div = elem.$view.firstElementChild;
            var vv = new Vue({
                el: div,
                data: data,
                methods: methods,
                // https://ru.vuejs.org/v2/guide/computed.html
                computed: computed,
            });
        };
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
(function (It) {
    var UI;
    (function (UI) {
        var vuejs;
        (function (vuejs) {
            var _webix = webix;
            var vv = window.Vue;
            if (vv) {
                var _Views_1 = [];
                Vue.component("it-view", {
                    props: ['module', 'view'],
                    //watch: {
                    //    value: {
                    //        handler: data_handler
                    //    }
                    //},
                    //template: "<div style='background-color:yellowgreen;padding: 100px; margin: 20px'></div>",
                    //template: "<div style='margin-left: auto;margin-right: auto; justify-content: center'></div>",
                    template: "<div style='display: flex;  align-items: 'center'>VUE UI</div>",
                    mounted: function () {
                        var $view = $.createModuleView(this.module, this.view);
                        var config = $view.$config();
                        this.webixId = webix.ui(config, this.$el);
                        $view.$init();
                        $view.$activate({});
                        _Views_1.push(this.webixId);
                        //let config = webix.copy(this.config);
                        //config.$scope = this;
                        //this.webixId = webix.ui(config, this.$el);
                        //if (this.value)
                        //    data_handler.call(this, this.value);
                    },
                    destroyed: function () {
                        var i = _Views_1.indexOf(this.webixId);
                        if (i > -1)
                            _Views_1.splice(i);
                        webix.$$(this.webixId).destructor();
                    }
                });
                window.onresize = function () {
                    _Views_1.forEach(function (ui) { return $$(ui).resize(); });
                };
            }
        })(vuejs = UI.vuejs || (UI.vuejs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
// #region
//function data_handler(value) {
//    let view: any = $$(this.webixId);
//    if (typeof value === "object") {
//        if (view.setValues)
//            view.setValues(value);
//        else if (view.parse) {
//            view.clearAll();
//            view.parse(value)
//        }
//    } else if (view.setValue)
//        view.setValue(value);
//    _webix.ui.each(view, function (sub) {
//        if (sub.hasEvent && sub.hasEvent("onValue"))
//            sub.callEvent("onValue", [value]);
//    }, this, true);
//}
// #endregion
//# sourceMappingURL=vue-webix.js.map