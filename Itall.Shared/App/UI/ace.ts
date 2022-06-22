////// <reference path="../../corejs/web/requests.ts" />
module It.UI.acejs {
    //debugger;
    let _webix: any = webix;
    declare let ace;    

    let _aceLoaded = true;
    //let itw = It.Web;

    webix.protoUI({
        name: "ace-editor",
        defaults: {
            mode: "javascript",
            theme: "monokai"
        },

        $init: function (config) {
            this.$ready.push(this._render_cm_editor); 
        },

        _render_cm_editor: function () {
            //$.Data.loadJS("http://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/ace.js");
            //$.Data.loadJS("http://cdn.webix.com/components/ace/ace/src-min-noconflict/ace.js");

            //webix.require(
            //    //"ace/src-min-noconflict/ace.js"
            //    //"http://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/ace.js"
            //    "http://cdn.webix.com/components/ace/ace/src-min-noconflict/ace.js"
            //, this._render_when_ready, this);

            (<any>window).It.Web.loadJSAsync("https://cdn.webix.com/components/ace/ace/src-min-noconflict/ace.js", () => this._render_when_ready());
        },

        _render_when_ready: function () {
            //let basePath = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/";//webix.codebase + "ace/src-min-noconflict/";
            let basePath = "https://cdn.webix.com/components/ace/ace/src-min-noconflict/";

            ace.config.set("basePath", basePath);
            ace.config.set("modePath", basePath);
            ace.config.set("workerPath", basePath);
            ace.config.set("themePath", basePath); 

            this.editor = ace.edit(this.$view);
            this.editor.$blockScrolling = Infinity;

            this.editor.setOptions({
                fontFamily: "consolas,monospace",
                fontSize: "12pt"
            });

            if (this.config.theme)
                this.editor.setTheme("ace/theme/" + this.config.theme);
            if (this.config.mode)
                this.editor.getSession().setMode("ace/mode/" + this.config.mode);
            if (this.config.value)
                this.setValue(this.config.value);
            if (this._focus_await)
                this.focus();

            this.editor.navigateFileStart();
            this.callEvent("onReady", [this.editor]);
        },

        setValue: function (value) {
            if (!value && value !== 0)
                value = "";

            this.config.value = value;
            if (this.editor) {
                this.editor.setValue(value);
            }
        },

        getValue: function () {
            return this.editor ? this.editor.getValue() : this.config.value;
        },

        focus: function () {
            this._focus_await = true;
            if (this.editor)
                this.editor.focus();
        },

        getEditor: function () {
            return this.editor;
        }

    }, _webix.ui.view, webix.EventSystem);

}