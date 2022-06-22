/// <reference path="mdformatter.ts" />
var It;
(function (It) {
    var UI;
    (function (UI) {
        var sceditors;
        (function (sceditors) {
            // модуль для использования редактора SCEditor https://www.sceditor.com/documentation/getting-started/
            webix.protoUI({
                //name: "sceditor",
                name: 'html-editor',
                //id: webix.uid(),
                _obj: undefined,
                //defaults: {
                //    template: "<textarea style='height: 100%; min-height: 200px; '></textarea>",
                //    //template: "<div contenteditable='true' style='height: 100%; min-height: 100px; '></div>",
                //    borderless: false,
                //    value: "HHHHHHHHHHHHHHHHH (webix-ext)",
                //},
                $init: function (cfg) {
                    var me = this;
                    UI.Data.loadJS("lib/sceditor/sceditor.min.js");
                    UI.Data.loadCSS("lib/sceditor/themes/default.min.css");
                    //Data.loadCSS("lib/sceditor/themes/office.min.css");
                    //Data.loadJS("lib/sceditor/formats/xhtml.js");
                    //Data.loadJS("lib/sceditor/formats/bbcode.js");
                    //Data.loadJSAsync("lib/sceditor/formats/xhtml.js", () => me._render_when_ready());
                    //sceditor.formats['markdown'] = mdformat;
                    UI.Data.loadJSAsync("lib/sceditor/ru.js", function () { return me._render_when_ready(); });
                    //this.$view.innerHTML = "<textarea style='height: 100%; min-height: 100px; '>DDD</textarea>";
                    //this.$view.firstElementChild.innerHTML = "<div contenteditable='true' style='height: 100%; min-height: 100px; '></div>";
                },
                _render_when_ready: function () {
                    if (this._obj)
                        return;
                    var elem = this.$view; //.lastElementChild.firstElementChild;
                    //elem.lang = 'ru';
                    //let tarea = document.getElementById('text111');
                    //sceditor.create(tarea, {
                    sceditor.create(elem, {
                        format: 'xhtml',
                        //format: 'bbcode',
                        //format: 'markdown',
                        //style: 'lib/sceditor/themes/content/default.min.css',
                        style: 'lib/sceditor/default.css?v=1',
                        //emoticonsEnabled: false,
                        // 
                        toolbar: 'size,color,removeformat|bold,italic,underline,strike|bulletlist,orderedlist,table,code,quote,horizontalrule,image,link,youtube|maximize,source',
                        //toolbar: 'bold,italic,underline,strike|bulletlist,orderedlist,code,quote,horizontalrule,image,link|source',
                        locale: 'ru-RU',
                        //emoticonsRoot: 'lib/sceditor/themes/content/default.min.css',
                        resizeEnabled: false,
                    });
                    //sceditor.plugins.paste2 = function () {
                    //    this.pasteRaw = function (e) {
                    //        // this will automatically be called when 'myplugin'
                    //        // is registered with an editor instance and there
                    //        // is a keydown event
                    //    };
                    //};
                    this._obj = sceditor.instance(elem);
                },
                getValue: function () {
                    //let elem = this.$view.firstElementChild;
                    if (!this._obj)
                        return "";
                    //return elem.innerHTML; 
                    var html = this._obj.val();
                    return html;
                },
                setValue: function (value, raw) {
                    //let elem = this.$view.firstElementChild;
                    //if (!elem) return;
                    //elem.innerHTML = value;
                    //sceditor.dom.parseHTML(value, elem);
                    //this._render_when_ready();
                    var html = this._obj.val(value || "");
                },
                $setSize: function (x, y) {
                    if (this._obj) {
                        // применить изменение размеров, когда библиотека будет готова
                        this._obj.width(x);
                        this._obj.height(y);
                    }
                    //else
                    webix.ui.textarea.prototype.$setSize.call(this, x, y);
                },
            }, webix.ui.textarea);
        })(sceditors = UI.sceditors || (UI.sceditors = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//# sourceMappingURL=sceditor-webix.js.map