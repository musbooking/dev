
// extenstions for Webix modules
module It.UI.tinymce {
    var ui: any = webix.ui;


    // http://tinymce.moxiecode.com/js/tinymce/docs/api/index.html#class_tinymce.Editor.html
    // add view for tinymce
    declare var tinymce;
    declare var tinyMCE;
    declare var tinyMCEPreInit;

    webix.protoUI({
        //name: "tinymce-editor",
        name: "html-editor",
        defaults: {
            config: { theme: "modern", },
            value: "",
        },
        $init: function (config) {
            this.$view.className += " webix_selectable";
            this.$ready.push(this.render);
        },
        render: function () {
            this._set_inner_size();
        },
        _init_tinymce_once: function () {
            //set id for future usage
            this._mce_id = "webix_mce_" + this.config.id;
            this.$view.innerHTML = "<textarea id='" + this._mce_id + "' style='width:1px; height:1px'></textarea>";
            this._allowsClear = true; // to clear editor

            //path to tinymce codebase
            tinyMCEPreInit = { suffix: "", query: "", base: "lib/tinymce" };

            webix.require("../tinymce/tinymce.min.js", function (first_time) {
                if (first_time) {
                    //woraround event logic in tinymce
                    tinymce.dom.Event.domLoaded = true;
                    webix.html.addStyle(".mceLayout{ border-width:0px !important}\n.mceLayout tr.mceFirst td {border-top:none !important;}");
                }

                var config = this.config.config;
                config.mode = "exact";
                config.height = 300;
                config.minheight = 10;
                config.oninit = webix.bind(this._mce_editor_ready, this);
                config.elements = [this._mce_id];
                config.id = this._mce_id;
                //config.language = "ru";
                config.paste_data_images = true;
                config.gecko_spellcheck = true;
                config.browser_spellcheck = true;
                config.menubar = false;

                //config.selector = 'textarea';
                //config.convert_urls = false;
                //config.default_link_target = "_blank";
                //config.file_browser_callback = function(field_name, url, type, win) {  // old format for file picker, see: http://pixabay.com/ru/blog/posts/direct-image-uploads-in-tinymce-4-42/
                //    var tt = 12;
                //}
                //config.file_picker_callback = function(callback, value, meta) {
                //    // Provide file and text for the link dialog
                //    if (meta.filetype == 'file') {
                //        callback('mypage.html', { text: 'My text' });
                //    }

                //    // Provide image and alt text for the image dialog
                //    if (meta.filetype == 'image') {
                //        if (!value) {
                //            window.alert("Введите ссылку на изображение");
                //            return;
                //        }
                //        if (!window.confirm("Загрузить изображение на сервер?")) return;
                //        //if (!input_file_element) {
                //        //    input_file_element = $(document.createElement('input'));
                //        //    input_file_element.attr("type", "file");
                //        //}
                //        //input_file_element.trigger('click');
                //        callback('myimage.jpg', { alt: 'My alt text' });
                //    }

                //    // Provide alternative source and posted for the media dialog
                //    if (meta.filetype == 'media') {
                //        callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
                //    }
                //}


                // formats
                //config.content_css = "lib/webix/skins/compact.css, app/app.css";

                //config.apply_source_formatting = true;  // from http://www.tinymce.com/wiki.php/Configuration3x:apply_source_formatting
                //config.style_formats_merge = true;  // for custom formats
                //config.style_formats = [  // from http://www.tinymce.com/wiki.php/Configuration:style_formats
                //    { title: 'Bold text', inline: 'b' },
                //    { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
                //    { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
                //    { title: 'Example 1', inline: 'span', classes: 'example1' },
                //    { title: 'Example 2', inline: 'span', classes: 'example2' },
                //    { title: 'Table styles' },
                //    { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
                //]
                
                // http://www.tinymce.com/wiki.php/Controls
                //config.plugins = [
                //    'advlist autolink lists link image charmap print preview anchor textcolor',
                //    'searchreplace visualblocks code fullscreen',
                //    'insertdatetime media table contextmenu paste code help wordcount'
                //];
                config.plugins = "fullscreen table paste hr link image charmap print preview searchreplace visualblocks visualchars code media emoticons template textcolor autolink"; // sh4tinymce  jbimages
                //config.menu = {
                //    file: { title: 'Файл', items: 'newdocument save | print preview' },
                //    eidt: { title: 'Правка', items: 'undo redo | cut copy paste pastetext | searchreplace selectall' },
                //    insert: { title: 'Вставка', items: 'hr charmap anchor emoticons template | link unlink image  media' },  // jbimages
                //    view: { title: 'Вид', items: 'fullscreen | visualaid visualblocks visualchars code' },
                //    format: { title: 'Формат', items: 'forecolor backcolor | bold italic underline strikethrough superscript subscript | formats | removeformat' },
                //    table: { title: 'Таблица', items: 'inserttable tableprops deletetable | cell row column' },
                //};
                // http://www.tinymce.com/wiki.php/Configuration:toolbar
                config.toolbar = '';
                //config.toolbar = ' insert | undo redo | forecolor backcolor styleselect blockquote | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | fullscreen';
                // TODO:  sh4tinymce
                config.statusbar = false;
                //config.menubar = false;

                tinyMCE.suffix = '.min';
                tinyMCE.init(config);

            }, this);

            this._init_tinymce_once = function () { };
        },
        _mce_editor_ready: function (editor) {
            this._3rd_editor = tinyMCE.get(this._mce_id);
            this.setValue(this.config.value + "");
            if (this._focus_await)
                this.focus();
            this._set_inner_size();
        },
        _set_inner_size: function () {
            if (!this._3rd_editor || !this.$width) return;
            var height_fix = 11;
            var editor = document.getElementById(this._mce_id + "_tbl");
            if (!editor) {
                editor = this.$view.childNodes[0];
                height_fix = 5;
            }
            var iframe = document.getElementById(this._mce_id + "_ifr");

            if (editor) {
                if (!this._mce_delta)
                    this._mce_delta = parseInt(editor.style.height, 10) - parseInt(iframe.style.height, 10) + height_fix;

                editor.style.width = this.$width - 3 + "px";
                editor.style.height = this.$height - 3 + "px";
                var body: any = editor.children[0];
                var menu_height = body.children[0].clientHeight + body.children[1].clientHeight + 5;
                if (menu_height > 200) menu_height = 73; // TODO: set size
                iframe.style.height = this.$height - menu_height + "px";
                //iframe.style.height = this.$height - this._mce_delta + "px";
                //console.log("tinymce size: ", this.$height, this._mce_delta, editor.style.height, iframe.style.height);
            }
        },
        $setSize: function (x, y) {
            if (ui.view.prototype.$setSize.call(this, x, y)) {
                this._init_tinymce_once();
                this._set_inner_size();
            }
        },

        setValue: function (value) {
            if (value == null) value = "";
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
        getEditor: function () {
            return this._3rd_editor;
        },
        isDirty: function () {
            return this._3rd_editor.isDirty();
        }
    }, ui.view);

    //// experiments with editors
    //webix.protoUI({
    //    name: "multilist",

    //    editor: {view:"text"},

    //    setValue: function (value) {
    //        console.log("set: ", value);
    //    },

    //    getValue: function () {
    //        return "aa";
    //    },

    //    getEditor: function () {
    //        return this._3rd_editor;
    //    },

    //}, ui.view);
}


