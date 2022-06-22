/// <reference path="../../../_references.ts" />
///// <reference path="vue-dts/index.d.ts" />
/// <reference path="vue-dts/vue.d.ts" />

declare let Vue;

module It.UI {

    export interface RefUI {

        vue(data, methods?, computed?);

        //vbind(data) {
        //    alert('V-bind');
        //}
    }

    /*
     * Подключение Vue к элементу webix 
     */
    RefUI.prototype.vue = function (data, methods?, computed?) {
        let me: RefUI = this;
        let elem = $$(me.id);
        let div = elem.$view.firstElementChild;

        var vv = new Vue({
            el: div,
            data: data,
            methods: methods,
            // https://ru.vuejs.org/v2/guide/computed.html
            computed: computed,
        });

    }
}

module It.UI.vuejs {
    let _webix: any = webix;


    let vv = (<any>window).Vue;
    if (vv) {

        let _Views = [];

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
                let $view = $u.createModuleView(this.module, this.view);
                let config = $view.$config();
                this.webixId = webix.ui(config, this.$el);
                $view.$init();
                $view.$activate({});

                _Views.push(this.webixId);

                //let config = webix.copy(this.config);
                //config.$scope = this;

                //this.webixId = webix.ui(config, this.$el);
                //if (this.value)
                //    data_handler.call(this, this.value);
            },
            destroyed: function () {
                let i = _Views.indexOf(this.webixId);
                if (i > -1)
                    _Views.splice(i);
                webix.$$(this.webixId).destructor();
            }
        });

        window.onresize = function () {
            _Views.forEach(ui => $$(ui).resize());
        }

    }

}

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
