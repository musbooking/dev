// extenstions for Webix modules
var It;
(function (It) {
    var UI;
    (function (UI) {
        var tinymce;
        (function (tinymce_1) {
            var ui = webix.ui;
            webix.protoUI({
                name: "html-editor",
                defaults: {
                    config: { theme: "modern", statusbar: false, menubar: false, },
                    barHeight: 74,
                    value: ""
                },
                $init: function (config) {
                    It.Web.loadJS('lib/tinymce/tinymce.min.js');
                    this.$view.className += " webix_selectable";
                    this._waitEditor = webix.promise.defer();
                    this.$ready.push(this.render);
                },
                render: function () {
                    this._set_inner_size();
                },
                _init_tinymce_once: function () {
                    //set id for future usage
                    this._mce_id = "webix_mce_" + this.config.id;
                    this.$view.innerHTML = "<textarea id='" + this._mce_id + "' style='width:1px; height:1px'></textarea>";
                    this._allowsClear = true; // PSV: to clear editor
                    //path to tinymce codebase
                    tinyMCEPreInit = { query: "", base: "lib/tinymce5", suffix: ".min" };
                    tinyMCE.baseURL = "lib/tinymce/";
                    tinyMCE.suffix = ".min";
                    webix.require("../tinymce/tinymce.min.js", function () {
                        //if (!tinymce.dom.Event.domLoaded) {
                        //    //woraround event logic in tinymce
                        //    tinymce.dom.Event.domLoaded = true;
                        //    webix.html.addStyle(".mce-tinymce.mce-container{ border-width:0px !important}");
                        //}
                        webix.html.addStyle(".mce-tinymce.mce-container{ border-width:0px !important}");
                        var config = this.config.config;
                        config.mode = "exact";
                        //config.base = "lib/tinymce0/";
                        //config.baseURL = "lib/tinymce1/";
                        //config.document_base_url = "lib/tinymce/";
                        config.theme_url = "lib/tinymce/themes/modern/theme.min.js";
                        //config.skin_url = "lib/tinymce4/";
                        config.height = 300;
                        config.setup = webix.bind(this._mce_editor_setup, this);
                        config.elements = [this._mce_id];
                        //config.language = "ru";
                        config.id = this._mce_id;
                        config.paste_data_images = true; // https://www.tinymce.com/docs/plugins/paste/
                        config.plugins = "fullscreen table paste hr link image charmap print preview searchreplace visualblocks visualchars code media emoticons template textcolor autolink"; // sh4tinymce  jbimages
                        config.toolbar = ' insert | undo redo | forecolor backcolor styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code';
                        tinyMCE.init(config);
                    }, this);
                    this._init_tinymce_once = function () { };
                },
                _mce_editor_setup: function (editor) {
                    editor.on("init", webix.bind(this._mce_editor_ready, this));
                },
                _mce_editor_ready: function (editor) {
                    this._3rd_editor = tinyMCE.get(this._mce_id);
                    this._set_inner_size();
                    this._waitEditor.resolve(this._3rd_editor);
                    this.setValue(this.config.value);
                    if (this._focus_await)
                        this.focus();
                },
                _set_inner_size: function () {
                    if (!this._3rd_editor || !this.$width)
                        return;
                    this._3rd_editor.theme.resizeTo(this.$width, this.$height - this.config.barHeight);
                },
                $setSize: function (x, y) {
                    if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
                        this._init_tinymce_once();
                        this._set_inner_size();
                    }
                },
                setValue: function (value) {
                    this.config.value = value;
                    if (this._3rd_editor)
                        this._3rd_editor.setContent(value);
                },
                getValue: function () {
                    return this._3rd_editor ? this._3rd_editor.getContent() : this.config.value;
                },
                focus: function () {
                    this._focus_await = true;
                    if (this._3rd_editor)
                        this._3rd_editor.focus();
                },
                getEditor: function (waitEditor) {
                    return waitEditor ? this._waitEditor : this._3rd_editor;
                }
            }, webix.ui.view);
        })(tinymce = UI.tinymce || (UI.tinymce = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//# sourceMappingURL=tinymce-webix.js.map