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
var It;
(function (It) {
    var UI;
    (function (UI) {
        function loadPivotFiles(root) {
            if (root === void 0) { root = "lib/webix/pivot/"; }
            It.Web.loadCSS(root + "pivot.css?v=5.1.5");
            It.Web.loadJS(root + "pivot.js?v=5.1.5");
            It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
        }
        var RefPivot = (function (_super) {
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
            var PivotConfig = (function (_super) {
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
var It;
(function (It) {
    var UI;
    (function (UI) {
        var acejs;
        (function (acejs) {
            var _webix = webix;
            var _aceLoaded = true;
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
                    var _this = this;
                    window.It.Web.loadJSAsync("https://cdn.webix.com/components/ace/ace/src-min-noconflict/ace.js", function () { return _this._render_when_ready(); });
                },
                _render_when_ready: function () {
                    var basePath = "https://cdn.webix.com/components/ace/ace/src-min-noconflict/";
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
        })(acejs = UI.acejs || (UI.acejs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
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
                    this._mce_id = "webix_mce_" + this.config.id;
                    this.$view.innerHTML = "<textarea id='" + this._mce_id + "' style='width:1px; height:1px'></textarea>";
                    this._allowsClear = true;
                    tinyMCEPreInit = { query: "", base: "lib/tinymce5", suffix: ".min" };
                    tinyMCE.baseURL = "lib/tinymce/";
                    tinyMCE.suffix = ".min";
                    webix.require("../tinymce/tinymce.min.js", function () {
                        webix.html.addStyle(".mce-tinymce.mce-container{ border-width:0px !important}");
                        var config = this.config.config;
                        config.mode = "exact";
                        config.theme_url = "lib/tinymce/themes/modern/theme.min.js";
                        config.height = 300;
                        config.setup = webix.bind(this._mce_editor_setup, this);
                        config.elements = [this._mce_id];
                        config.id = this._mce_id;
                        config.paste_data_images = true;
                        config.plugins = "fullscreen table paste hr link image charmap print preview searchreplace visualblocks visualchars code media emoticons template textcolor autolink";
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
var app;
(function (app) {
    var AppDataSource = (function (_super) {
        __extends(AppDataSource, _super);
        function AppDataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AppDataSource.prototype.list = function (args) {
            return _super.prototype.load.call(this, "list", args);
        };
        AppDataSource.prototype.archive = function (id) {
            return this.post("archive", { id: id });
        };
        return AppDataSource;
    }(It.Web.WebSource));
    app.AppDataSource = AppDataSource;
    var UpdatesSource = (function (_super) {
        __extends(UpdatesSource, _super);
        function UpdatesSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UpdatesSource.prototype.reset = function (name) {
            if (name === void 0) { name = ""; }
            if (name)
                this.name = name;
            this.hash = this.getLastUpdateHash(this.name);
        };
        UpdatesSource.prototype.has = function (reset) {
            if (reset === void 0) { reset = false; }
            var hash = this.getLastUpdateHash(this.name);
            console.log("check: ", hash, this.hash);
            return hash != this.hash;
        };
        UpdatesSource.prototype.getLastUpdateHash = function (name) {
            var hash = this.load("last", { name: name });
            return hash;
        };
        return UpdatesSource;
    }(app.AppDataSource));
    app.UpdatesSource = UpdatesSource;
    app.meta = {
        timePattern: { mask: "##-##", allow: /[0-9]/g },
        timeValidator: function (x) { return x >= 0 && x <= 24; },
    };
    var DiscountKind;
    (function (DiscountKind) {
        DiscountKind[DiscountKind["Undefined"] = 0] = "Undefined";
        DiscountKind[DiscountKind["UseDiscount"] = 1] = "UseDiscount";
        DiscountKind[DiscountKind["IgnoreDiscount"] = 2] = "IgnoreDiscount";
    })(DiscountKind = app.DiscountKind || (app.DiscountKind = {}));
    app.discountKinds = [
        { id: DiscountKind.UseDiscount, value: "Учитываем" },
        { id: DiscountKind.IgnoreDiscount, value: "Блокируем" },
    ];
    var DayKind;
    (function (DayKind) {
        DayKind[DayKind["WorkFirstDay"] = 1] = "WorkFirstDay";
        DayKind[DayKind["WorkDay"] = 3] = "WorkDay";
        DayKind[DayKind["WorkLastDay"] = 5] = "WorkLastDay";
        DayKind[DayKind["Weekend1"] = 6] = "Weekend1";
        DayKind[DayKind["Weekend2"] = 7] = "Weekend2";
    })(DayKind = app.DayKind || (app.DayKind = {}));
    app.dayKinds = [
        { id: DayKind.WorkFirstDay, value: "Перв.Рабочий" },
        { id: DayKind.WorkDay, value: "Рабочий" },
        { id: DayKind.WorkLastDay, value: "Посл.Рабочий" },
        { id: DayKind.Weekend1, value: "СБ" },
        { id: DayKind.Weekend2, value: "ВС" },
    ];
    var NotifyKind;
    (function (NotifyKind) {
        NotifyKind[NotifyKind["Reserv"] = 1] = "Reserv";
        NotifyKind[NotifyKind["Payment"] = 2] = "Payment";
        NotifyKind[NotifyKind["Cancel"] = 3] = "Cancel";
        NotifyKind[NotifyKind["Forfeit"] = 4] = "Forfeit";
        NotifyKind[NotifyKind["Review"] = 5] = "Review";
    })(NotifyKind = app.NotifyKind || (app.NotifyKind = {}));
    app.notifications = [
        { id: NotifyKind.Reserv, value: "Резерв" },
        { id: NotifyKind.Payment, value: "Оплата" },
        { id: NotifyKind.Cancel, value: "Отмена" },
        { id: NotifyKind.Forfeit, value: "Штраф" },
        { id: NotifyKind.Review, value: "Отзыв" },
    ];
    app.booleans = [
        { id: 'false', value: "Нет" },
        { id: true, value: "Да" },
    ];
})(app || (app = {}));
var lists;
(function (lists) {
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DataSource.prototype.names = function (args) {
            var items = this.load("names", args);
            return items;
        };
        return DataSource;
    }(app.AppDataSource));
    lists.DataSource = DataSource;
})(lists || (lists = {}));
var common;
(function (common) {
    common.timeZones = [
        { id: "+02:00", value: "MSK–1 (UTC+2) Калининград" },
        { id: "+03:00", value: "MSK+0 (UTC+3) Москва" },
        { id: "+04:00", value: "MSK+1 (UTC+4) Самара" },
        { id: "+05:00", value: "MSK+2 (UTC+5) Екатеринбург" },
        { id: "+06:00", value: "MSK+3 (UTC+6) Омск" },
        { id: "+07:00", value: "MSK+4 (UTC+7) Красноярск" },
        { id: "+08:00", value: "MSK+5 (UTC+8) Иркутск" },
        { id: "+09:00", value: "MSK+6 (UTC+9) Якутск" },
        { id: "+10:00", value: "MSK+7 (UTC+10) Владивосток" },
        { id: "+11:00", value: "MSK+8 (UTC+11) Магадан" },
        { id: "+12:00", value: "MSK+9 (UTC+12) Камчатск" },
    ];
})(common || (common = {}));
var days;
(function (days) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("date").Header("Дата").AsDate().Sort().Edit(),
                    $u.column("isWeekend").Header("Выходной").AsCheckbox().Sort().Edit(),
                    $u.column("description").Header("Описание", -1).Edit(),
                ],
                scheme: {
                    date: new Date(),
                },
                data: days.db.list(),
                save: days.db.getSaveCfg(true),
            }).Editable();
            var view = {
                rows: [
                    $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function () { return _this.refresh(); }), {}),
                    gridCfg,
                ],
            };
            return view;
        };
        GridView.prototype.refresh = function () {
            var list = days.db.list();
            this.grid.refresh(list);
        };
        return GridView;
    }($u.View));
    days.GridView = GridView;
})(days || (days = {}));
var days;
(function (days) {
    days.create = {
        grid: function () { return new days.GridView(); },
    };
    var DaysSource = (function (_super) {
        __extends(DaysSource, _super);
        function DaysSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DaysSource.prototype.isWeekend = function (date) {
            if (!this.days)
                this.days = this.list();
            var sdate = webix.i18n.dateFormatStr(date);
            var daysDay = this.days.find(function (x) { return webix.i18n.dateFormatStr(x.date) == sdate; });
            if (!daysDay)
                return date.isWeekend();
            else
                return daysDay.isWeekend;
        };
        return DaysSource;
    }(app.AppDataSource));
    days.db = new DaysSource("days");
})(days || (days = {}));
var resources;
(function (resources) {
    var CamerasView = (function (_super) {
        __extends(CamerasView, _super);
        function CamerasView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.list = new $u.RefList();
            return _this;
        }
        CamerasView.prototype.$config = function () {
            var listCfg = this.list.config().extend({
                view: "dataview",
                itemheight: true,
                select: false,
                template: function (obj) {
                    var cls = "base_" + obj.type;
                    var html = "<div class='".concat(cls, "'><strong>").concat(obj.name, "</strong><hr>");
                    var res = obj.resources;
                    res.forEach(function (x) { return html += "<div>".concat(x.name, "</div>").link(x.value, { target: "_blank" }); });
                    html += "</div>";
                    return html;
                },
                type: {
                    height: 150,
                    width: 250
                },
                url: resources.db.camerasUrl,
            });
            var cfg = {
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
        };
        return CamerasView;
    }($u.View));
    resources.CamerasView = CamerasView;
})(resources || (resources = {}));
var resources;
(function (resources) {
    var PhonesView = (function (_super) {
        __extends(PhonesView, _super);
        function PhonesView(kind, caption) {
            var _this = _super.call(this) || this;
            _this.kind = kind;
            _this.caption = caption;
            _this.grid = new $u.RefGrid();
            _this.view = new $u.RefUI();
            return _this;
        }
        PhonesView.prototype.$config = function (edit) {
            if (edit === void 0) { edit = true; }
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Тип", 100).AsSelect(resources.phoneTypes).Sort().Edit(),
                    $u.column("value").Header("Телефон", -1).Edit().extend({ format: "###", pattern: "(###) ###-##-##" }),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    kind: this.kind,
                },
                type: {
                    href: "#!",
                },
                rules: {
                    "value": function (value, row) {
                        var err = resources.db.testPhone(row.id, value);
                        if (!err)
                            return true;
                        It.UI.w.info(err);
                        return false;
                    },
                },
                save: resources.db.getSaveCfg(true),
            }).Editable().Disable(!edit);
            var view = $u.rows($u.panelbar($u.label(this.caption), this.grid.btnAdd().Visible(edit), this.grid.btnDel().Visible(edit), {}), gridCfg).Ref(this.view);
            return view;
        };
        PhonesView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            this.grid.scheme({ objectId: id, kind: this.kind });
            var res = resources.db.getItems(this.kind, id);
            this.grid.refresh(res);
        };
        PhonesView.prototype.enable = function (enabled) {
            this.view.enable(enabled);
        };
        return PhonesView;
    }($u.View));
    resources.PhonesView = PhonesView;
})(resources || (resources = {}));
var resources;
(function (resources) {
    resources.create = {
        cameras: function () { return new resources.CamerasView(); },
    };
    var ResourceKind;
    (function (ResourceKind) {
        ResourceKind[ResourceKind["RoomPhoto"] = 3] = "RoomPhoto";
        ResourceKind[ResourceKind["RoomUrl"] = 4] = "RoomUrl";
        ResourceKind[ResourceKind["BaseCamera"] = 7] = "BaseCamera";
        ResourceKind[ResourceKind["ClientPhone"] = 8] = "ClientPhone";
    })(ResourceKind = resources.ResourceKind || (resources.ResourceKind = {}));
    resources.phoneTypes = [
        { id: "MOBILE", value: "Мобильный" },
        { id: "WORK", value: "Рабочий" },
        { id: "HOME", value: "Домашний" },
    ];
    resources.urlTypes = [
        { id: "sound", value: "Sound Cloud" },
        { id: "video", value: "Видео" },
        { id: "web", value: "Ссылка" },
        { id: "other", value: "Другое" },
    ];
    var ResourcesSource = (function (_super) {
        __extends(ResourcesSource, _super);
        function ResourcesSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.camerasUrl = _this.url("cameras");
            return _this;
        }
        ResourcesSource.prototype.getItems = function (kind, id) {
            var list = this.load("list", { kind: kind, id: id });
            return list;
        };
        ResourcesSource.prototype.testPhone = function (id, phone) {
            if (!phone)
                return null;
            return this.loadStr("testPhone", { id: id, phone: phone });
        };
        return ResourcesSource;
    }(app.AppDataSource));
    resources.db = new ResourcesSource("resources");
})(resources || (resources = {}));
var resources;
(function (resources) {
    var UrlView = (function (_super) {
        __extends(UrlView, _super);
        function UrlView() {
            var _this = _super.call(this) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        UrlView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Тип", 100).AsSelect(resources.urlTypes).Sort().Edit(),
                    $u.column("description").Header("Описание", -1).Edit(),
                    $u.column("value").Header("Ссылка", -1).Edit().Template("#value#".link("#value#", { target: '_blank' })),
                ],
                type: {
                    href: "#!",
                },
                save: resources.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.header("О площадке".tag("b"), this.grid.btnAdd(), this.grid.btnDel()), grid);
            return view;
        };
        UrlView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            this.grid.scheme({ objectId: id, kind: resources.ResourceKind.RoomUrl });
            var res = resources.db.getItems(resources.ResourceKind.RoomUrl, id);
            this.grid.refresh(res);
        };
        return UrlView;
    }($u.View));
    resources.UrlView = UrlView;
})(resources || (resources = {}));
var messages;
(function (messages) {
    var CreateView = (function (_super) {
        __extends(CreateView, _super);
        function CreateView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreateView.prototype.$config = function () {
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.label("Текст сообщения"),
                    $u.element("text").Label("Текст сообщения").AsHtmlEditor(200).Require(),
                    $u.element("scope").Label("Доступ").AsSelect(messages.scopeTypes).Tooltip("Если не указано, то везде"),
                    _super.prototype.$config.call(this),
                ],
            });
            return formCfg;
        };
        CreateView.prototype.$action = function () {
            this.hide();
            return _super.prototype.$action.call(this);
        };
        CreateView.prototype.$clear = function () {
            this.form.clear({ text: "" });
        };
        return CreateView;
    }($u.PopupView));
    messages.CreateView = CreateView;
})(messages || (messages = {}));
var messages;
(function (messages) {
    var ListView = (function (_super) {
        __extends(ListView, _super);
        function ListView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.filter = {};
            _this.list = new $u.RefList();
            _this.createMsgView = new messages.CreateView(_this).onAction(function (vals) { return _this.add(vals); });
            return _this;
        }
        ListView.prototype.setDefaults = function (vals) {
            this.defaulVals = vals;
        };
        ListView.prototype.$config = function () {
            var list = this.list.config().extend({
                template: 'http->' + It.Web.WebSource.base + '/html/message-list.html',
                type: {
                    href: "#!",
                    height: "auto",
                    d: function (x) { return webix.i18n.fullDateFormatStr(x.date); },
                },
            }).Editable(messages.db.getSaveCfg(true)).Scrollable();
            var toolbar = $u.toolbar($u.label("Сообщения"), $u.button("Добавить").Popup(this.createMsgView.$config()), {});
            return $u.rows(toolbar, list).Size(0, 800);
        };
        ListView.prototype.refresh = function () {
            var items = messages.db.list(this.filter);
            this.list.refresh(items);
        };
        ListView.prototype.add = function (vals) {
            if (this.defaulVals)
                vals = webix.extend(vals, this.defaulVals, true);
            vals.date = new Date();
            this.list.add(vals, 0);
            this.createMsgView.$clear();
        };
        return ListView;
    }($u.View));
    messages.ListView = ListView;
})(messages || (messages = {}));
var messages;
(function (messages) {
    var ScopeType;
    (function (ScopeType) {
        ScopeType[ScopeType["Any"] = 0] = "Any";
        ScopeType[ScopeType["Zone"] = 1] = "Zone";
        ScopeType[ScopeType["Private"] = 2] = "Private";
    })(ScopeType = messages.ScopeType || (messages.ScopeType = {}));
    messages.scopeTypes = [
        { id: ScopeType.Zone, value: "Партнер" },
        { id: ScopeType.Private, value: "Только я" },
    ];
    var MessageKind;
    (function (MessageKind) {
        MessageKind[MessageKind["Unknown"] = 0] = "Unknown";
        MessageKind[MessageKind["User"] = 1] = "User";
        MessageKind[MessageKind["System"] = 2] = "System";
        MessageKind[MessageKind["Error"] = 3] = "Error";
        MessageKind[MessageKind["Bitrix"] = 4] = "Bitrix";
        MessageKind[MessageKind["Review"] = 5] = "Review";
        MessageKind[MessageKind["Calendar"] = 7] = "Calendar";
        MessageKind[MessageKind["ViewRoom"] = 8] = "ViewRoom";
    })(MessageKind = messages.MessageKind || (messages.MessageKind = {}));
    var MessagesSource = (function (_super) {
        __extends(MessagesSource, _super);
        function MessagesSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MessagesSource;
    }(app.AppDataSource));
    messages.db = new MessagesSource("messages");
})(messages || (messages = {}));
var access;
(function (access) {
    var LoginView = (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        LoginView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var me = this;
            var help = '<div>Для получения доступа к системе бронирования обратитесь к администратору портала -&nbsp;<a href="mailto: partner@musbooking.com" target="_blank" rel="nofollow">partner@musbooking.com</a>&nbsp;или отправьте запрос на регистрацию, заполнив форму по адресу&nbsp;<a href="http://musbooking.com/zapros/" target="_blank" rel="nofollow">http://musbooking.com/zapros/</a></div>';
            var template = $u.template(help).Autoheight().Css("it-warning111");
            var header = "Вход в " + "MUSBOOKING".link("http://musbooking.com/", { target: "_blank" });
            var formCfg = this.form.config().extend({
                width: 300,
                padding: 10,
                borderless: false,
                elements: [
                    $u.cols($u.label(header.tag("div", { class: "it-login-header" })), { gravity: 0.1 }, $u.icon("question").Popup(template)).Autoheight().Css("it-login-header"),
                    { height: 20 },
                    $u.template('img/logo-2018.png'.img({ class: 'it-login-img' }).link("./")),
                    $u.cols($u.rows($u.element("login").Label('Логин').Value(It.Web.auth.logins.last).Require(), { height: 7 }, $u.element("password").Label('Пароль').Type('password').Require(), { height: 20 })),
                    $u.cols({}, $u.button("Войти").Type("form").Click(function () { return me.login(); }).Hotkey("enter"), $u.button("Закрыть").Click(It.Web.goReturnUrl)),
                ],
                elementsConfig: {}
            });
            return $u.viewCenter(formCfg);
        };
        LoginView.prototype.login = function () {
            if (!this.form.validate())
                return;
            var vals = this.form.values();
            var res = auth_logins.db.login(vals);
            if (!res)
                return;
            It.Web.auth.tokens.save(res.token);
            It.Web.auth.logins.save(vals.login);
            It.Web.goReturnUrl();
        };
        return LoginView;
    }($u.View));
    access.LoginView = LoginView;
})(access || (access = {}));
var access;
(function (access) {
    function run() {
        var navigator = new $u.Navigator();
        navigator.view.show();
        navigator.routers("access");
    }
    access.run = run;
    access.create = {
        default: function () { return new access.LoginView(); },
        login: function () { return new access.LoginView(); },
        logout: function () {
            It.Web.auth.tokens.clear();
            return new access.LoginView();
        },
    };
    var AuthSource = (function (_super) {
        __extends(AuthSource, _super);
        function AuthSource(controller) {
            return _super.call(this, controller, "api/") || this;
        }
        AuthSource.prototype.login = function (args) {
            return this.load("login");
        };
        AuthSource.prototype.checkLogin = function () {
            return this.load("check", null);
        };
        AuthSource.prototype.context = function () {
            return this.load("context");
        };
        return AuthSource;
    }(app.AppDataSource));
    access.AuthSource = AuthSource;
    access.dbauth = new AuthSource("auth");
    function checkLogin() {
        if (!It.Web.auth.tokens.current)
            return;
        access.dbauth.checkLogin();
    }
    access.checkLogin = checkLogin;
})(access || (access = {}));
var auth;
(function (auth) {
    auth.oper = {
        lists: "lists",
        listBases: "list-bases",
        equipments: "list-eq",
        eqRest: "eq-rest",
        promo: "promo",
        days: "days",
        orderPromo: "order-promo",
        statisticPromo: "statistic-promo",
        basesAll: "bases-all",
        cameras: "cameras",
        groups: "crm-lists",
        clients: "clients",
        clientFin: "client-fin",
        clientDiscBan: "l14",
        expGroups: "exp-groups",
        reviews: "reviews",
        crmView: "crm-view",
        crmEdit: "crm-edit",
        orders: "orders",
        orderNew: "order-new",
        orderFullAccess: "order-full",
        orderPay: "order-pay",
        orderPoints: "order-points",
        orderForfeit: "order-forfeit",
        orderEdit: "order-edit",
        orderEditHold: "order-edit-payd",
        orderEditGroup: "order-edit-group",
        orderHistory: "order-history",
        orderCancel: "order-cancel",
        orderCancelAny: "order-cancel-any",
        orderDelete: "order-delete",
        orderViewQuick: "order-view-quick",
        orderViewFull: "order-view-full",
        accounts: "accounts",
        anyReportDate: "accounts-all-dates",
        transEdit: "trans-edit",
        abonements: "abonements",
        abonementEdit: "ab-edit",
        abonementDel: "ab-del",
        abonementOrderEdit: "ab-order-edit",
        abonementOrderCalc: "ab-order-calc",
        abonementOrderCreate: "ab-order-create",
        orderReserv: "ab-order-reserv",
        abonementOrderPay: "ab-order-pay",
        expDocs: "exp-docs",
        expDocsAdmin: "exp-docs-admin",
        users: "users",
        domainsEdit: "domains-edit",
        anyIP: "any-ip",
        editIP: "ip-edit",
        domainsAll: "domains-all",
    };
    var groups = {
        lists: "Справочники",
        calendar: "Календарь",
        crm: "CRM",
        orders: "Бронь",
        account: "Учет и Отчеты",
        abonements: "Абонементы",
        admin: "Администрирование",
    };
    auth.opers = [
        { id: auth.oper.lists, value: "Настройка справочников", group: groups.lists, description: "Общий доступ к редактированию справочников" },
        { id: auth.oper.listBases, value: "Настройка баз и комнат", group: groups.lists, description: "Редактирование справочника баз и комнат" },
        { id: auth.oper.equipments, value: "Настройка позиций", group: groups.lists, description: "Редактирование справочника позиций и типов позиций" },
        { id: auth.oper.basesAll, value: "Доступ все базы", group: groups.lists, description: "предоставление доступа к любой базе" },
        { id: auth.oper.days, value: "Редактирование дат", group: groups.lists, description: "редактирование праздничных дат для календаря", super: true },
        { id: auth.oper.promo, value: "Управление промокодами", group: groups.lists, description: "Редактирование списков промокодов" },
        { id: auth.oper.cameras, value: "Камеры", group: groups.lists, description: "Доступ к камерам базы" },
        { id: auth.oper.groups, value: "CRM справочники", group: groups.lists, description: "Справочники CRM системы", super: true },
        { id: auth.oper.expGroups, value: "Статьи расходов", group: groups.lists, description: "Ввод статей расходов для указания в расходных документах" },
        { id: auth.oper.crmView, value: "CRM-справочники", group: groups.crm, description: "Доступ к CRM справочниками", super: true },
        { id: auth.oper.crmEdit, value: "CRM-редактирование", group: groups.crm, description: "Редактированиеs CRM данных", super: true },
        { id: auth.oper.clients, value: "Клиенты", group: groups.crm, description: "Поиск и работа с карточками клиентов" },
        { id: auth.oper.clientFin, value: "Финансы клиента", group: groups.crm, description: "Редактирование финансовых параметров клиентов" },
        { id: auth.oper.clientDiscBan, value: "Скидка, блок клиента", group: groups.crm, description: "Редактирование полей скидки и блокировки клиентов" },
        { id: auth.oper.orderEdit, value: "Редактирование календаря", group: groups.calendar, description: "Открытие брони на редактирование в календаре" },
        { id: auth.oper.orderViewQuick, value: "Краткий формат календаря", group: groups.calendar, description: "Отображение минимальной информации по брони в календаре" },
        { id: auth.oper.orderViewFull, value: "Полный формат календаря", group: groups.calendar, description: "Отображение полной информации по брони в календаре" },
        { id: auth.oper.orders, value: "Бронирование", group: groups.orders, description: "Общие операции с бронью" },
        { id: auth.oper.orderNew, value: "Создание брони", group: groups.orders, description: "Возможность создания новых броней в календаре" },
        { id: auth.oper.orderEditHold, value: "Редактирование опл. брони", group: groups.orders, description: "Возможность редактирования оплаченной брони с пересчетом" },
        { id: auth.oper.orderEditGroup, value: "Редактирование опций", group: groups.orders, description: "Возможность редактирования опций" },
        { id: auth.oper.orderHistory, value: "Просмотр истории", group: groups.orders, description: "Просмотр истории бронирования" },
        { id: auth.oper.orderPromo, value: "Выбор промокода", group: groups.orders, description: "Редактирование промокода в карточке брони" },
        { id: auth.oper.orderReserv, value: "Резерв брони", group: groups.orders, description: "Резервирование брони" },
        { id: auth.oper.orderCancel, value: "Отмена брони (правила)", group: groups.orders, description: "Выставление статуса Отмены у брони" },
        { id: auth.oper.orderCancelAny, value: "Отмена брони (любая)", group: groups.orders, description: "Отмена брони без проверки правил" },
        { id: auth.oper.orderPay, value: "Оплата брони", group: groups.orders, description: "Выставление статуса Оплаты у брони" },
        { id: auth.oper.orderForfeit, value: "Подтверждение штрафов", group: groups.orders, description: "Подтверждение штрафа у брони" },
        { id: auth.oper.orderPoints, value: "Списание баллов", group: groups.orders, description: "Возможность списания баллов" },
        { id: auth.oper.orderDelete, value: "Удаление брони", group: groups.orders, description: "Удаление брони из списков и календаря", super: true, },
        { id: auth.oper.orderFullAccess, value: "Любая операция с бронью", group: groups.orders, description: "Возможность резервирования, редактирования и удаления брони в любом статусе, в т.ч и оплаченной" },
        { id: auth.oper.reviews, value: "Отзывы по брони", group: groups.orders, description: "Работа с отзывами клиента по брони" },
        { id: auth.oper.accounts, value: "Движение денег", group: groups.account, description: "Доступ к отчету о движении денег" },
        { id: auth.oper.transEdit, value: "Редактирование транзакций", group: groups.account, description: "Возможность просмотра и редактирования тразнакций", super: true },
        { id: auth.oper.anyReportDate, value: "Движение - любой период", group: groups.account, description: "Возможность выставления любого периода в отчете о движении денег" },
        { id: auth.oper.statisticPromo, value: "Статистика промокодов", group: groups.account, description: "Отчет по статистике клиентов" },
        { id: auth.oper.eqRest, value: "Остатки ооборудования", group: groups.account, description: "Доступ к отчету об остатках оборудования на текущий момент" },
        { id: auth.oper.expDocs, value: "Расходные документы", group: groups.account, description: "Доступ к расходным документам" },
        { id: auth.oper.expDocsAdmin, value: "Расходные документы (Полн)", group: groups.account, description: "Полный доступ к редактированию расходных документов по базам" },
        { id: auth.oper.abonements, value: "Абонементы", group: groups.abonements, description: "Доступ к разделу 'Абонементы'" },
        { id: auth.oper.abonementEdit, value: "Абон-Редактирование", group: groups.abonements, description: "Редактирование данных абонемента" },
        { id: auth.oper.abonementDel, value: "Абон-Удаление", group: groups.abonements, description: "Удаление абонемента" },
        { id: auth.oper.abonementOrderCreate, value: "Абон-Добавление брони", group: groups.abonements, description: "Добавление брони в абонементах" },
        { id: auth.oper.abonementOrderEdit, value: "Абон-Изменение брони", group: groups.abonements, description: "Абонемент - изменение реквизитов брони в окне детальной информации" },
        { id: auth.oper.abonementOrderCalc, value: "Абон-Пересчет брони", group: groups.abonements, description: "Перерасчет брони в абонементе" },
        { id: auth.oper.abonementOrderPay, value: "Абон-Оплата брони", group: groups.abonements, description: "Оплата брони в абонементе" },
        { id: auth.oper.users, value: "Настройка пользователей", group: groups.admin, description: "Редактирование логинов пользователей" },
        { id: auth.oper.domainsEdit, value: "Настройка партнеров", group: groups.admin, description: "Редактирование настроек партнеров", super: true },
        { id: auth.oper.anyIP, value: "Доступ с любого IP", group: groups.admin, description: "Настройка разрешений для доступа с любого компьютера" },
        { id: auth.oper.editIP, value: "Настройки IP", group: groups.admin, description: "Настройка фильтров IP" },
        { id: auth.oper.domainsAll, value: "Все партнерские зоны", group: groups.admin, description: "Доступ ко всем партнерским зонам", super: true },
    ];
    auth.roles = {
        super: "super",
    };
})(auth || (auth = {}));
var system;
(function (system) {
    var SystemSource = (function (_super) {
        __extends(SystemSource, _super);
        function SystemSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SystemSource.prototype.context = function () {
            return this.load("context");
        };
        return SystemSource;
    }(app.AppDataSource));
    system.dbsys = new SystemSource("system");
    var SystemContext = (function () {
        function SystemContext() {
            this.isSuper = false;
            this.permissions = {};
        }
        SystemContext.prototype.allow = function (operation) {
            if (!this.permissions)
                return false;
            var res = this.permissions[operation];
            return res === true;
        };
        SystemContext.prototype.allowCrmEdit = function () {
            var res = !this.isSuper || this.allow(auth.oper.crmEdit);
            return res;
        };
        return SystemContext;
    }());
    system.SystemContext = SystemContext;
    function loadContext() {
        system.context = new SystemContext();
        if (!It.Web.auth.tokens.current)
            return;
        var ctx = system.dbsys.context();
        webix.extend(system.context, ctx, true);
    }
    system.loadContext = loadContext;
})(system || (system = {}));
var permissions;
(function (permissions) {
    var PermissionsSource = (function (_super) {
        __extends(PermissionsSource, _super);
        function PermissionsSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PermissionsSource;
    }(app.AppDataSource));
    permissions.PermissionsSource = PermissionsSource;
    permissions.db = new PermissionsSource("permissions2");
    permissions.create = {
        grid: function () { return new permissions.GridView(); },
    };
})(permissions || (permissions = {}));
var permissions;
(function (permissions) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefTree();
            _this.form = new $u.RefForm();
            return _this;
        }
        GridView.prototype.setGroup = function (obj) {
            if (!obj || !obj.operation)
                return;
            var oper = auth.opers.findById(obj.operation);
            if (!oper)
                return;
            obj.group = oper.group;
            obj.description = oper.description;
        };
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var me = this;
            var allowEditOpers = false;
            var gridCfg = this.grid.configTreeTable().extend({
                columns: [
                    $u.column("group").Header("Операция", -2)
                        .Template(function (obj, common) {
                        if (obj.$group)
                            return common.treetable(obj, common) + obj.group;
                        return "          " + auth.opers.findById(obj.operation, {}).value;
                    }),
                    $u.column("operation").Header("Операция", 100).Sort().Filter(),
                    $u.column("roles").Header("Роли", -1).Sort().Edit().Filter(),
                    $u.column("description").Header("Описание", -1),
                ],
                scheme: {
                    id: -1,
                    $group: {
                        by: "group",
                        map: {
                            votes: ["votes", "sum"],
                            group: ["group"]
                        }
                    },
                    $init: function (obj) { return me.setGroup(obj); }
                },
                save: permissions.db.getSaveCfg(true),
            }).Editable();
            var form = {
                view: "form",
                id: this.form.id,
                borderless: true,
                gravity: 0.6,
                elements: [
                    {
                        cols: [
                            $u.button("Сохранить").Click(function () { return _this.save(); }),
                            {},
                        ]
                    },
                    $u.element("operation").Label("Операция", "top").AsSelect(auth.opers).Disable(),
                    $u.element("roles").Label("Роли", "top").AsMultiSelect(roles.db.names()),
                    $u.element("description").Label("Описание").AsTextArea(0).Disable(),
                    {},
                ],
            };
            var view = {
                rows: [
                    $u.toolbar(this.grid.btnAdd().Hidden(!allowEditOpers), this.grid.btnDel().Hidden(!allowEditOpers), $u.button("Инициализировать").Click(function () { return _this.initDomain(); }), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}),
                    {
                        cols: [
                            gridCfg,
                            form,
                        ],
                    },
                ],
            };
            return view;
        };
        GridView.prototype.$init = function () {
            this.form.bind(this.grid);
            this.refresh();
        };
        GridView.prototype.refresh = function () {
            var items = permissions.db.list();
            this.grid.refresh(items);
        };
        GridView.prototype.initDomain = function () {
            var ctx = system.context;
            domains.db.init(ctx.domainId, ctx.isSuper);
            this.refresh();
        };
        GridView.prototype.save = function () {
            this.form.ref.save();
        };
        return GridView;
    }($u.View));
    permissions.GridView = GridView;
})(permissions || (permissions = {}));
var roles;
(function (roles) {
    var RolesSource = (function (_super) {
        __extends(RolesSource, _super);
        function RolesSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.names = function () { return _this.load("names"); };
            return _this;
        }
        return RolesSource;
    }(app.AppDataSource));
    roles.RolesSource = RolesSource;
    roles.db = new RolesSource("roles2");
    roles.create = {
        grid: function () { return new roles.GridView(); },
    };
})(roles || (roles = {}));
var roles;
(function (roles) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Имя роли", 200).Sort().Edit().Filter(),
                    $u.column("description").Header("Описания", -1).Sort().Edit().Filter(),
                ],
                scheme: {
                    id: -1,
                },
                data: roles.db.list(),
                save: roles.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.toolbar(this.grid.btnAdd(), this.grid.btnDel(), {}), gridCfg);
            return view;
        };
        return GridView;
    }($u.View));
    roles.GridView = GridView;
})(roles || (roles = {}));
var rules;
(function (rules) {
    rules.create = {
        grid: function () { return new rules.GridView(); },
    };
    var RulesSource = (function (_super) {
        __extends(RulesSource, _super);
        function RulesSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url('list');
            return _this;
        }
        return RulesSource;
    }(app.AppDataSource));
    rules.db = new RulesSource("rules");
})(rules || (rules = {}));
var rules;
(function (rules) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var toolbar = $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function () { return _this.refresh(); }), {});
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("ip").Header("IP").Sort().Edit(),
                    $u.column("description").Header("Описание", -1).Edit(),
                    $u.column("isDisabled").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {},
                data: rules.db.list(),
                save: rules.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows(toolbar, gridCfg);
            return view;
        };
        GridView.prototype.refresh = function () {
            var list = rules.db.list();
            this.grid.refresh(list);
        };
        return GridView;
    }($u.View));
    rules.GridView = GridView;
})(rules || (rules = {}));
var users;
(function (users) {
    var CreateView = (function (_super) {
        __extends(CreateView, _super);
        function CreateView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreateView.prototype.$config = function () {
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("login").Label("Логин").Require(),
                    $u.element("password").Label("Пароль").AsPassword().Require(),
                    $u.element("fio").Label("ФИО").AsTextArea(70),
                    $u.element("email").Label("e-mail"),
                    $u.element("roles").Label("Роли").AsMultiSelect(roles.db.names()),
                    $u.element("baseIds").Label("Базы").AsMultiSelect(bases.db.names()),
                    _super.prototype.$config.call(this),
                ],
            });
            return formCfg;
        };
        CreateView.prototype.$action = function () {
            this.hide();
            return _super.prototype.$action.call(this);
        };
        return CreateView;
    }($u.PopupView));
    users.CreateView = CreateView;
})(users || (users = {}));
var users;
(function (users) {
    var GridFormView = (function (_super) {
        __extends(GridFormView, _super);
        function GridFormView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.form = new $u.RefForm();
            _this.creator = new users.CreateView().onAction(function (vals) { return _this.create(vals); });
            return _this;
        }
        GridFormView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("login").Header("Логин", -1).Sort().Filter(),
                    $u.column("fio").Header("ФИО", -1).Sort().Filter(),
                    $u.column("roles").Header("Роли", -1).Sort().Edit().Filter(),
                    $u.column("isArchive").Header("Блок").Tooltip("Флаг блокировки клиента #login#").AsCheckbox().Sort(),
                ],
                scheme: {
                    id: -1,
                },
                data: users.db.list(),
                save: users.db.getSaveCfg(true),
            }).Editable();
            var form = this.form.config().extend({
                gravity: 0.7,
                elements: [
                    {
                        cols: [
                            $u.button("Сохранить").Click(function () { return _this.save(); }),
                            {},
                        ]
                    },
                    $u.element("login").Label("Логин").Disable(),
                    $u.element("fio").Label("ФИО").AsTextArea(70),
                    $u.element("email").Label("e-mail"),
                    $u.element("roles").Label("Роли").AsMultiSelect(roles.db.names()),
                    $u.element("baseIds").Label("Базы", 'top').AsMultiSelect(bases.db.namesUrl),
                    $u.element("domainIds").Label("Партнеры", 'top').AsMultiSelect(domains.db.namesUrl).Visible(system.context.allow(auth.oper.domainsEdit)),
                    $u.element("bitrixNum").Label("Код CRM").Tooltip("Внутренний код в CRM системе"),
                    $u.element("isArchive").Label("Арх").AsCheckbox(),
                    {},
                ],
            });
            var view = $u.rows($u.toolbar($u.button("Добавить").Popup(this.creator.$config()), this.grid.btnDel(), $u.button("Пароль").Tooltip("Сгенерировать новый пароль для пользователя").Click(function (_) { return _this.reset(); }), {}), $u.cols(grid, form));
            return view;
        };
        GridFormView.prototype.$init = function () {
            this.form.bind(this.grid);
        };
        GridFormView.prototype.create = function (vals) {
            this.grid.add(vals);
        };
        GridFormView.prototype.reset = function () {
            var user = this.grid.getSelectedItem();
            if (!user)
                return webix.message("Выделите пользователя");
            if (!confirm("\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C \u0434\u043B\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F ".concat(user.login, "?")))
                return webix.message("Сброс пароля отменен");
            var res = users.db.resetUserPassword(user.id);
            webix.alert({ title: "Генерация пароля для " + user.login, text: "Новый пароль: " + res.password });
        };
        GridFormView.prototype.save = function () {
            this.form.updateBindings();
        };
        return GridFormView;
    }($u.View));
    users.GridFormView = GridFormView;
})(users || (users = {}));
var users;
(function (users) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var editable = system.context.allowCrmEdit();
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("login").Header("Логин", 100).Sort().Edit(),
                    $u.column("phone").Header("Телефон", 100).Sort(),
                    $u.column("email").Header("E-mail", -1).Sort(),
                    $u.column("fio").Header("ФИО", -1).Sort().Edit(),
                    $u.column("fcm").Header("Push ID").Sort().Edit(),
                    $u.column("isConfirmed").Header("Подтв.", 60).AsCheckboxReadly().Sort().Visible(!editable),
                    $u.column("isArchive").Header("Блок").Tooltip("Флаг блокировки клиента #login#").AsCheckboxReadly().Sort().Visible(!editable)
                ],
                scheme: {
                    id: -1,
                },
                save: users.db.getSaveCfg(true),
            });
            if (editable) {
                grid.Editable().Columns($u.column("isConfirmed").Header("Подтв.").AsCheckbox().Sort().Visible(editable), $u.column("isArchive").Header("Блок").Tooltip("Флаг блокировки клиента #login#").AsCheckbox().Sort().Visible(editable));
            }
            return grid;
        };
        GridView.prototype.refresh = function (data) {
            this.grid.refresh(data);
            return this;
        };
        return GridView;
    }($u.View));
    users.GridView = GridView;
})(users || (users = {}));
var users;
(function (users) {
    var UsersSource = (function (_super) {
        __extends(UsersSource, _super);
        function UsersSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url('list');
            _this.search = function (client) { return _this.load("search", { client: client }); };
            _this.resetUserPassword = function (userid) { return _this.post("resetUser", { user: userid }); };
            return _this;
        }
        return UsersSource;
    }(app.AppDataSource));
    users.db = new UsersSource("users");
    users.create = {
        grid: function () { return new users.GridFormView(); },
    };
})(users || (users = {}));
var help;
(function (help) {
    var HelpSource = (function (_super) {
        __extends(HelpSource, _super);
        function HelpSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HelpSource.prototype.config = function () {
            return this.load("config");
        };
        return HelpSource;
    }(app.AppDataSource));
    var db = new HelpSource("help");
    var HelpConfig = (function () {
        function HelpConfig() {
            this.items = [
                { page: "test", text: "test", url: "" },
            ];
            this._current = this.items[0];
        }
        HelpConfig.prototype.current = function (page) {
            if (!page)
                return this._current;
            if (this.items.find)
                this._current = this.items.find(function (h) { return page.indexOf(h.page) >= 0; });
            return this._current;
        };
        return HelpConfig;
    }());
    help.HelpConfig = HelpConfig;
    function load() {
        var cfg = db.config();
        help.config = new HelpConfig();
        webix.extend(help.config, cfg, true);
    }
    help.load = load;
})(help || (help = {}));
var templates;
(function (templates) {
    templates.create = {
        grid: function () { return new templates.GridView(); },
        edit: function () { return new templates.EditView(); },
    };
    var DbSource = (function (_super) {
        __extends(DbSource, _super);
        function DbSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DbSource.prototype.names = function (args) {
            var items = this.loadList("names", args);
            return items;
        };
        return DbSource;
    }(lists.DataSource));
    templates.db = new DbSource("templates");
    var TemplateKind = (function () {
        function TemplateKind() {
        }
        TemplateKind.Unknown = "unknown";
        TemplateKind.Code = "code";
        TemplateKind.Registration = "registration";
        TemplateKind.Restore = "restore";
        TemplateKind.Feedback = "feedback";
        TemplateKind.CheckEmailConfirmation = "email-confirm";
        TemplateKind.Manual = "manual";
        TemplateKind.OrderReserv = "order.reserv";
        TemplateKind.OrderPaid = "order.paid";
        TemplateKind.OrderCancel = "order.cancel";
        TemplateKind.OrderForfeit = "order.forfeit";
        TemplateKind.OrderClose = "order.close";
        TemplateKind.OrderError = "order.error";
        TemplateKind.Request = "request";
        TemplateKind.RequestNew = ".new";
        TemplateKind.RequestUnprocessed = ".unprocessed";
        TemplateKind.RequestConfirmed = ".confirmed";
        TemplateKind.RequestCanceled = ".canceled";
        TemplateKind.OrderDomain = ".domain";
        TemplateKind.OrderService = ".service";
        TemplateKind.OrderBaseRequest = ".request";
        TemplateKind.OrderChannelCash = ".cash";
        TemplateKind.OrderChannelTinkoff = ".tinkoff";
        TemplateKind.OrderChannelInstruction = ".instruction";
        TemplateKind.DomainRegistration = "DomainRegistration";
        TemplateKind.DomainYellow = "DomainYellow";
        TemplateKind.DomainBeforeBlock = "DomainBeforeBlock";
        TemplateKind.DomainAfterBlock = "DomainAfterBlock";
        TemplateKind.DomainPayment = "DomainPayment";
        TemplateKind.ClientForfeit = "client.forfeit";
        TemplateKind.ClientBanTrue = "client.ban.true";
        TemplateKind.ClientBanFalse = "client.ban.false";
        TemplateKind.CalendarArchive = "calendar.archive";
        return TemplateKind;
    }());
    templates.TemplateKind = TemplateKind;
    templates.kinds = [
        { id: TemplateKind.Code, value: "СМС Код" },
        { id: TemplateKind.Registration, value: "Регистрация" },
        { id: TemplateKind.Restore, value: "Восстановление" },
        { id: TemplateKind.Feedback, value: "Обратная связь" },
        { id: TemplateKind.CheckEmailConfirmation, value: "Подтверждение почты" },
        { id: TemplateKind.Manual, value: "Ручная рассылка" },
        { id: TemplateKind.OrderError, value: "Бронь ошибка" },
        { id: TemplateKind.CalendarArchive, value: "Календарь - архивация" },
        { id: TemplateKind.DomainRegistration, value: "Партнер-Регистрация" },
        { id: TemplateKind.DomainYellow, value: "Партнер-Желтая" },
        { id: TemplateKind.DomainBeforeBlock, value: "Партнер-Перед блок." },
        { id: TemplateKind.DomainAfterBlock, value: "Партнер-После блок" },
        { id: TemplateKind.DomainPayment, value: "Партнер-Оплата" },
        { id: TemplateKind.ClientForfeit, value: "Клиент-изм.штрафа" },
        { id: TemplateKind.ClientBanTrue, value: "Клиент-бан" },
        { id: TemplateKind.ClientBanFalse, value: "Клиент-снятие бана" },
        { id: "review.new", value: "Отзыв-Новый" },
        { id: "review.processed", value: "Отзыв-Обработано" },
        { id: "review.ok", value: "Отзыв-Отвечено" },
        { id: "review.cancel", value: "Отзыв-Отмена" },
    ];
    function addRequestTemplates(btempl, btext) {
        btext = "Заявка " + btext;
        btempl = TemplateKind.Request + btempl;
        templates.kinds.push({ id: btempl, value: btext });
        templates.kinds.push({ id: btempl + TemplateKind.OrderDomain, value: btext + " (Партнер)" });
        templates.kinds.push({ id: btempl + TemplateKind.OrderService, value: btext + " (Сервис)" });
    }
    addRequestTemplates(TemplateKind.RequestNew, "новая");
    addRequestTemplates(TemplateKind.RequestCanceled, "отмена");
    addRequestTemplates(TemplateKind.RequestConfirmed, "подтверждение");
    addRequestTemplates(TemplateKind.RequestUnprocessed, "Не обработана");
    function addOrderTemplates(btempl, btext) {
        templates.kinds.push({ id: btempl + TemplateKind.OrderBaseRequest, value: btext + " (Заявка)" });
        templates.kinds.push({ id: btempl + TemplateKind.OrderChannelCash, value: btext + " (Наличные)" });
        templates.kinds.push({ id: btempl + TemplateKind.OrderChannelInstruction, value: btext + " (Инструкция)" });
        templates.kinds.push({ id: btempl + TemplateKind.OrderChannelTinkoff, value: btext + " (Тиньков)" });
    }
    addOrderTemplates(TemplateKind.OrderReserv, "Резерв");
    addOrderTemplates(TemplateKind.OrderReserv + TemplateKind.OrderDomain, "Резерв-Партнер");
    addOrderTemplates(TemplateKind.OrderPaid, "Оплата");
    addOrderTemplates(TemplateKind.OrderPaid + TemplateKind.OrderDomain, "Оплата-Партнер");
    addOrderTemplates(TemplateKind.OrderCancel, "Отмена");
    addOrderTemplates(TemplateKind.OrderCancel + TemplateKind.OrderDomain, "Отмена-Партнер");
    addOrderTemplates(TemplateKind.OrderForfeit, "Штраф");
    addOrderTemplates(TemplateKind.OrderForfeit + TemplateKind.OrderDomain, "Штраф-Партнер");
    addOrderTemplates(TemplateKind.OrderClose, "Закрыт");
    addOrderTemplates(TemplateKind.OrderClose + TemplateKind.OrderDomain, "Закрыт-Партнер");
})(templates || (templates = {}));
var templates;
(function (templates) {
    var FormView = (function (_super) {
        __extends(FormView, _super);
        function FormView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        FormView.prototype.$config = function () {
            var cfg = this.form.config().Labels(120).extend({
                elements: [
                    $u.header("Список шаблонов рассылок"),
                    $u.element("isArchive").Label("(x)").AsCheckbox(),
                    $u.element("key").Label("Тип", 'top').AsSelect(templates.kinds),
                    $u.element("name").Label("Название", 'top').Require(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    $u.element("text").Label("Шаблон").AsHtml().Size(200, 300),
                    {},
                ]
            });
            return cfg;
        };
        return FormView;
    }($u.View));
    templates.FormView = FormView;
})(templates || (templates = {}));
var templates;
(function (templates) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template(Symbols.pencil.link("{common.href}/templates/edit/?oid=#id#")),
                    $u.column("key").Header("Тип", 250).AsSelect(templates.kinds).Sort().Edit().Filter(),
                    $u.column("name").Header("Название", -1).Sort().Edit().Filter(),
                    $u.column("subject").Header("Заголовок", -1).Sort().Edit().Filter(),
                    $u.column("description").Header("Описание", -1).Edit().Filter(),
                    $u.column("isArchive").Header(Symbols.Cross).AsCheckbox().Sort().Filter(),
                ],
                scheme: {},
                save: templates.db.getSaveCfg(true),
            }).Editable();
            var toolbar = $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function () { return _this.reload(); }), {});
            var view = $u.rows(toolbar, gridCfg);
            return view;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.reload();
        };
        GridView.prototype.reload = function () {
            var list = templates.db.list();
            this.grid.refresh(list);
            webix.message($u.loc.Msg.Reloaded);
        };
        return GridView;
    }($u.View));
    templates.GridView = GridView;
})(templates || (templates = {}));
var templates;
(function (templates) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            var form = this.form.config().Labels(120).extend({
                elements: [
                    $u.header("Список шаблонов рассылок", $u.button("Сохранить").Click(function () { return _this.save(); })),
                    $u.element("key").Label("Тип").AsSelect(templates.kinds).Require(),
                    $u.element("name").Label("Название").Require(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    $u.element("subject").Label("Заголовок"),
                    $u.element("email").Label("Email (фикс)"),
                    $u.element("sms").Label("Шаблон СМС").AsTextArea(150),
                    $u.template("Шаблон письма"),
                    $u.element("text").Label("Шаблон письма").AsHtml().Size(-1, 600),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    {},
                ]
            });
            return form;
        };
        EditView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var vals = templates.db.get(id);
            vals.text = vals.text || '';
            this.form.setValues(vals);
        };
        EditView.prototype.save = function () {
            if (!this.form.validate())
                return;
            this.form.save(templates.db.saveUrl(this.objectId), false);
            webix.message("Данные сохранены на сервере");
        };
        return EditView;
    }($u.View));
    templates.EditView = EditView;
})(templates || (templates = {}));
var jobs;
(function (jobs) {
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DataSource.prototype.list = function (id) {
            return this.loadList("list", { id: id });
        };
        return DataSource;
    }(app.AppDataSource));
    jobs.db = new DataSource("jobs");
    var JobStatus;
    (function (JobStatus) {
        JobStatus[JobStatus["Unknown"] = 0] = "Unknown";
        JobStatus[JobStatus["Active"] = 1] = "Active";
        JobStatus[JobStatus["Pause"] = 2] = "Pause";
        JobStatus[JobStatus["Ok"] = 10] = "Ok";
        JobStatus[JobStatus["Error"] = 11] = "Error";
        JobStatus[JobStatus["Canceled"] = 12] = "Canceled";
    })(JobStatus = jobs.JobStatus || (jobs.JobStatus = {}));
    jobs.statuses = [
        { id: JobStatus.Unknown, value: '(неизвестно)' },
        { id: JobStatus.Active, value: 'Активно' },
        { id: JobStatus.Canceled, value: 'Отменено' },
        { id: JobStatus.Error, value: 'Ошибка' },
        { id: JobStatus.Ok, value: 'ОК' },
        { id: JobStatus.Pause, value: 'Пауза' },
    ];
})(jobs || (jobs = {}));
var settings_ui;
(function (settings_ui) {
    var SettingsView = (function (_super) {
        __extends(SettingsView, _super);
        function SettingsView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.editor = new $u.RefUI();
            return _this;
        }
        SettingsView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var view = this.form.config().extend({
                elements: [
                    $u.label("Административные настройки").Size(-1),
                    $u.cols($u.button("Обновить код Битрикс").Click(function () { return _this.refreshToken(); }), {}),
                    this.ui_editor(),
                    {},
                ]
            });
            return view;
        };
        SettingsView.prototype.ui_editor = function () {
            var _this = this;
            var editorCfg = $u.view("ace-editor").Ref(this.editor).extend({
                theme: "textmate",
                mode: "json",
            }).Size(0, 400);
            var view = $u.rows($u.toolbar($u.label("Файл конфигурации"), {}, $u.button("Обновить").Click(function () { return _this.load(); }), $u.button("Сохранить").Click(function () { return _this.save(); })), editorCfg);
            return view;
        };
        SettingsView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.load();
        };
        SettingsView.prototype.load = function () {
            var cfg = settings_ui.dbsystem.getConfig();
            var val = JSON.stringify(cfg, null, '\t');
            this.editor.setValue(val);
        };
        SettingsView.prototype.save = function () {
            try {
                var val = this.editor.getValue();
                var json = JSON.parse(val);
                settings_ui.dbsystem.saveConfig(json);
                webix.message("Файл конфигурации сохранен на сервере");
            }
            catch (err) {
                $u.w.error(err.name + ": " + err.message);
            }
        };
        SettingsView.prototype.refreshToken = function () {
            if (!confirm("Получить новый код Битрикс и записать в БД?"))
                return;
            var host = "".concat(location.protocol, "//").concat(location.host);
            var url = "https://hendrix.bitrix24.ru/oauth/authorize/?client_id=local.56376c666ab472.43252042&response_type=code&redirect_uri=https://hendrix.musbooking.com/&scope=crm,entity";
            It.Web.openUrl(url, null, true);
            alert("URL: " + url);
            webix.message("Новый авторизационный код битрикс успешно получен и сохранен: ");
        };
        return SettingsView;
    }($u.View));
    settings_ui.SettingsView = SettingsView;
})(settings_ui || (settings_ui = {}));
var settings_ui;
(function (settings_ui) {
    settings_ui.create = {
        edit: function () { return new settings_ui.SettingsView(); },
    };
    var System2Source = (function (_super) {
        __extends(System2Source, _super);
        function System2Source() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getConfig = function () { return _this.load("config"); };
            _this.saveConfig = function (cfg) { return _this.post("config", { data: cfg }); };
            return _this;
        }
        return System2Source;
    }(It.Web.WebSource));
    settings_ui.System2Source = System2Source;
    settings_ui.dbsystem = new System2Source("system");
})(settings_ui || (settings_ui = {}));
var configs;
(function (configs) {
    var GridFormView = (function (_super) {
        __extends(GridFormView, _super);
        function GridFormView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.crform = new $u.RefForm();
            _this.edform = new $u.RefForm();
            return _this;
        }
        GridFormView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Параметр", -1).Sort().Edit(),
                    $u.column("description").Header("Описание", -3).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                },
                save: configs.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.toolbar($u.icon("plus-circle").Popup(this.ui_create()), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.reload(); }), {}, $u.button("Обновить сервер").Click(function (_) { return _this.reset(); })), $u.cols(grid, this.ui_form()));
            return view;
        };
        GridFormView.prototype.$init = function () {
            this.edform.bind(this.grid);
        };
        GridFormView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.reload();
        };
        GridFormView.prototype.ui_form = function () {
            var _this = this;
            var form = this.edform.config().extend({
                gravity: 0.7,
                elements: [
                    $u.cols($u.button("Сохранить").Click(function () { return _this.save(); }), {}),
                    $u.element("name").Label("Параметр"),
                    $u.element("description").Label("Описание").AsTextArea(120),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    $u.element("asBool").Label("Флаг").AsCheckbox(),
                    $u.element("asDate").Label("Дата").AsDate(),
                    $u.element("asLong").Label("Целое").AsInt(),
                    $u.element("asMoney").Label("Деньги").AsNumber(),
                    $u.element("asNumber").Label("Число").AsNumber(),
                    $u.element("asText").Label("Текст").AsTextArea(100),
                    $u.element("asVal").Label("Партнеры", "top").AsMultiSelect(domains.db.names()),
                    $u.element("asVal1").Label("Источники", "top").AsMultiSelect(orders.sourceTypes),
                    $u.element("asVal2").Label("Базы (только чтение)", "top").AsTextArea(150).Readonly(),
                    $u.element("asVal3").Label("Комнаты", "top").AsTextArea(150),
                    {},
                ],
            });
            return form;
        };
        GridFormView.prototype.ui_create = function () {
            var _this = this;
            var form = this.crform.config().extend({
                gravity: 0.7,
                elements: [
                    $u.element("name").Label("Параметр", "top"),
                    $u.element("description").Label("Описание").AsTextArea(70),
                    {},
                    $u.cols({}, $u.button("Создать").Click(function () { return _this.create(); })),
                ],
            });
            return form;
        };
        GridFormView.prototype.create = function () {
            var vals = this.crform.values();
            this.grid.add(vals);
            this.crform.clear();
        };
        GridFormView.prototype.save = function () {
            this.edform.updateBindings();
        };
        GridFormView.prototype.reload = function () {
            var list = configs.db.list();
            this.grid.refresh(list);
        };
        GridFormView.prototype.reset = function () {
            configs.db.reset();
            webix.message("Параметры обновлены");
        };
        return GridFormView;
    }($u.View));
    configs.GridFormView = GridFormView;
})(configs || (configs = {}));
var configs;
(function (configs) {
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.list = function () { return _this.loadList("list"); };
            _this.reset = function () { return _this.post("reset"); };
            return _this;
        }
        return DataSource;
    }(app.AppDataSource));
    configs.db = new DataSource("configs");
    configs.create = {
        grid: function () { return new configs.GridFormView(); },
    };
})(configs || (configs = {}));
var calendars;
(function (calendars) {
    var CreateView = (function (_super) {
        __extends(CreateView, _super);
        function CreateView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreateView.prototype.$config = function () {
            var formCfg = this.form.config().Labels(100).extend({
                width: 400,
                elements: [
                    $u.label("Синхронизация с календарем".tag("strong")).Css("webix_toolbar"),
                    $u.element("provider").Label("Источник").AsSelect(calendars.calendarSources).Require(),
                    $u.element("roomId").Label("Комната").AsSelect(rooms.db.names(null, true)).Require(),
                    _super.prototype.$config.call(this),
                ],
            });
            return formCfg;
        };
        CreateView.prototype.$action = function () {
            if (!this.form.validate())
                return;
            this.hide();
            _super.prototype.$action.call(this);
            this.$clear();
            return true;
        };
        CreateView.prototype.$clear = function () {
            _super.prototype.$clear.call(this);
        };
        return CreateView;
    }($u.PopupView));
    calendars.CreateView = CreateView;
})(calendars || (calendars = {}));
var calendars;
(function (calendars_1) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.toolbar = new $u.RefUI();
            _this.onCalendarLink = new It.Event();
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var settings = this.form.config().extend({
                elementsConfig: {
                    labelWidth: 80,
                },
                elements: [
                    $u.element("provider").Label('Источник').AsSelect(calendars_1.calendarSources).Disable(),
                    $u.element("name").Label('Календарь').AsSelect([]),
                    $u.element("minDate").Label('Обновлено').AsDate(true).Tooltip("Дата последней синхронизации").Disable(),
                    $u.element("roomId").Label("Комната").AsSelect(rooms.db.names(null, true)),
                    $u.element("timeZone").Label("Час.пояс").AsSelect(common.timeZones),
                    $u.element("isArchive").Label("На паузе").AsCheckbox(),
                    $u.element("watchStatus").Label("Push").AsSelect(calendars_1.watch_statuses).Readonly(),
                    $u.element("watchResult").Label("Push result").AsTextArea(100).Readonly(),
                    $u.element("attempts").Label("Попыток").Readonly(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                ],
                on: {
                    onBindApply: function (x) { return _this.reload(x); },
                }
            });
            var view = $u.rows($u.panelbar({}, $u.button("Связать").Click(function () { return _this.link(); }), $u.button("Тест").Click(function () { return _this.test(); }), $u.button("Сохранить").Click(function () { return _this.save(); })).Ref(this.toolbar), settings, {});
            return view;
        };
        EditView.prototype.bind = function (table) {
            this.form.bind(table);
        };
        EditView.prototype.reload = function (obj) {
            if (!obj)
                return this.enable(false);
            _super.prototype.$reload.call(this, obj.id);
            this.enable(obj.provider);
            var calendars = obj.calendars || [];
            this.form.setElement(this.form.elements.name, { options: calendars });
        };
        EditView.prototype.enable = function (enable) {
            this.form.enable(enable);
            this.toolbar.enable(enable);
        };
        EditView.prototype.save = function () {
            if (!this.form.validate())
                return false;
            this.form.updateBindings();
            return true;
        };
        EditView.prototype.link = function () {
            var _this = this;
            if (!this.save())
                return;
            var vals = this.form.values();
            var url = calendars_1.oauth2.authUrl(vals.id, vals.provider);
            setTimeout(function () { return It.Web.openUrl(url, null, true); }, 100);
            webix.alert("Нажмите ОК для обновления связанных календарей", function () { return _this.onCalendarLink.call(); });
        };
        EditView.prototype.test = function () {
            if (!this.save())
                return;
            var events = calendars_1.db.test(this.objectId) || [];
            alert("Результат синхронизации: " + events);
        };
        return EditView;
    }($u.View));
    calendars_1.EditView = EditView;
})(calendars || (calendars = {}));
var calendars;
(function (calendars) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.createForm = new calendars.CreateView(_this).onAction(function (vals) { return _this.create(vals); });
            _this.editForm = new calendars.EditView(_this);
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var w = 100;
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("[x]").AsCheckboxReadly(),
                    $u.column("provider").Header("Источник", 120).AsSelect(calendars.calendarSources),
                    $u.column("description").Header("Описание", -1),
                    $u.column("roomId").Header("Комната", w).AsSelect(rooms.db.names()),
                    $u.column("minDate").Header("Обновлен", -1).AsDate(webix.i18n.fullDateFormatStr),
                    $u.column("watchStatus").Header("Push").AsSelect(calendars.watch_statuses),
                    $u.column("attemtps").Header("Попыток").AsInt(),
                ],
                scheme: {},
                save: calendars.db.getSaveCfg(true),
            }).Editable();
            var toolbar = $u.panelbar($u.icon("plus-circle").Popup(this.createForm.$config()).Tooltip("Добавить календарь"), this.grid.btnDel(), this.grid.btnRefresh(function () { return _this.reload(); }), $u.icon("cloud-download").Click(function (_) { return _this.sync(); }).Tooltip("Синхронизировать выделенные календари"), $u.icon("cloud-upload").Click(function (_) { return _this.sync(true); }).Tooltip("Тестировать PUSH-синхронизацию для выделенных календарей"), {});
            var view = $u.rows(toolbar, $u.cols(gridCfg, $u.splitter(), this.editForm.$config().Size(380)));
            this.editForm.onCalendarLink.on(function () { return _this.reload(); });
            return view;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.editForm.bind(this.grid);
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.reload();
        };
        GridView.prototype.reload = function () {
            var list = calendars.db.list();
            this.grid.refresh(list);
        };
        GridView.prototype.create = function (vals) {
            var row = this.grid.add(vals);
        };
        GridView.prototype.sync = function (last) {
            if (last === void 0) { last = false; }
            var ids = this.grid.getSelectedIds();
            var res = calendars.db.sync({ ids: ids, last: last });
            this.reload();
            alert("Календарь успешно обновлен с результатом: " + res);
        };
        return GridView;
    }($u.View));
    calendars.GridView = GridView;
})(calendars || (calendars = {}));
var calendars;
(function (calendars) {
    var SyncView = (function (_super) {
        __extends(SyncView, _super);
        function SyncView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SyncView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var view = $u.rows($u.panelbar($u.button("Синхронизировать календари").Click(function () { return _this.sync(); }), {}), { height: 1 });
            return view;
        };
        SyncView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
        };
        SyncView.prototype.sync = function () {
            var res = calendars.db.sync({ domain: this.objectId });
            alert("Результат синхронизации: " + res);
        };
        return SyncView;
    }($u.View));
    calendars.SyncView = SyncView;
})(calendars || (calendars = {}));
var calendars;
(function (calendars) {
    calendars.create = {
        grid: function () { return new calendars.GridView(); },
    };
    calendars.calendarSources = [
        { id: "google", value: "Google календарь" },
        { id: "microsoftOnline", value: "Outlook календарь" },
    ];
    var CalendarsSource = (function (_super) {
        __extends(CalendarsSource, _super);
        function CalendarsSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CalendarsSource.prototype.list = function (args) {
            return this.load("list", args);
        };
        CalendarsSource.prototype.sync = function (args) {
            var res = this.loadStr("sync", args);
            return res;
        };
        CalendarsSource.prototype.test = function (id) {
            return this.loadStr("test", { id: id });
        };
        return CalendarsSource;
    }(app.AppDataSource));
    calendars.db = new CalendarsSource("calendars");
    var OAuthSource = (function (_super) {
        __extends(OAuthSource, _super);
        function OAuthSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.authUrl = function (id, provider) { return _this.url("authorize", { id: id, provider: provider }); };
            return _this;
        }
        return OAuthSource;
    }(app.AppDataSource));
    calendars.oauth2 = new OAuthSource("oauth2");
    var WatchStatus;
    (function (WatchStatus) {
        WatchStatus[WatchStatus["Unknown"] = 0] = "Unknown";
        WatchStatus[WatchStatus["Error"] = 1] = "Error";
        WatchStatus[WatchStatus["Stop"] = 3] = "Stop";
        WatchStatus[WatchStatus["Active"] = 10] = "Active";
    })(WatchStatus = calendars.WatchStatus || (calendars.WatchStatus = {}));
    calendars.watch_statuses = [
        { id: WatchStatus.Unknown, value: '' },
        { id: WatchStatus.Stop, value: 'Стоп' },
        { id: WatchStatus.Active, value: 'Включено' },
        { id: WatchStatus.Error, value: 'Ошибки' },
    ];
})(calendars || (calendars = {}));
var docs;
(function (docs) {
    docs.create = {};
    docs.types = [
        { id: "abonement", value: "Абонемент" },
        { id: "order", value: "Заказ" },
    ];
    var DocsSource = (function (_super) {
        __extends(DocsSource, _super);
        function DocsSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DocsSource.prototype.list = function (args) {
            var list = this.load("list", args);
            return list;
        };
        return DocsSource;
    }(app.AppDataSource));
    docs.db = new DocsSource("docs");
})(docs || (docs = {}));
var docs;
(function (docs) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.filter = {};
            _this.grid = new $u.RefGrid();
            _this.filterView = new $u.RefForm();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("", 30).Template($u.getViewLink("#type#s")),
                    $u.column("type").Header("Документ", 90).AsSelect(docs.types).Filter().Sort(),
                    $u.column("date").Header("Дата").AsDate(webix.i18n.dateFormatStr).Sort().Filter(),
                    $u.column("total").Header("Сумма").AsInt().Sort().Filter().Footer({ content: "summColumn" }),
                    $u.column("forfeit").Header("Штрафы").AsInt().Sort().Filter().Footer({ content: "summColumn" }),
                    $u.column("text").Header("Описание", -1).Filter(),
                    $u.column("clientComment").Header("Комментарий", -1).Filter(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 100).Sort().Filter(),
                ],
                scheme: {
                    name: "без имени",
                    $init: function (obj) {
                        orders.logic.getStateCss(obj);
                    },
                },
            })
                .Tooltip("<b>Описание и комментарий:</b><br/><blockquote>#text#<hr/>#clientComment#</blockquote>")
                .Footer()
                .Autoheight();
            var filterCfg = this.filterView.config().extend({
                cols: [
                    $u.label("Список документов"),
                    $u.element("dfrom").Label("Дата с:", null, 60).AsDate().Size(180),
                    $u.element("dto").Label("По:", null, 40).AsDate().Size(160),
                    $u.icon("refresh").Click(function () { return _this.refresh(); }),
                    {}
                ]
            });
            return $u.rows(filterCfg, grid);
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d = new Date();
            this.filterView.setValuesEx({ dfrom: d, dto: d.addDays(7) });
        };
        GridView.prototype.refresh = function () {
            var filter = webix.extend(this.filter, this.filterView.values(), true);
            var items = docs.db.list(filter);
            this.grid.refresh(items);
        };
        return GridView;
    }($u.View));
    docs.GridView = GridView;
})(docs || (docs = {}));
var expenses;
(function (expenses) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.grid = new $u.RefGrid();
            _this.messagesView = new messages.ListView(_this);
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            this.groups = groups.db.names(groups.GroupType.Expense, true);
            var gridPanelCfg = $u.rows($u.toolbar(this.grid.btnAdd(), this.grid.btnDel(), $u.label("Распределение по статьям, сохраняются по кнопке 'Сохранить'").Size(-1), {}), this.grid.config().extend({
                columns: [
                    $u.column("groupId").Header("Статья", 200).AsSelect(this.groups).Edit(),
                    $u.column("amount").Header("Стоимость", 100).Edit().Footer({ content: "summColumn" }),
                    $u.column("description").Header("Описание", -1).Edit(),
                ],
                scheme: {},
                rules: {
                    "groupId": webix.rules.isNotEmpty,
                },
            }).Editable(expenses.itemsdb.getSaveCfg(false)).Footer());
            var allowAdmin = system.context.allow(auth.oper.expDocsAdmin);
            var view = this.form.config().Labels(100).extend({
                elements: [
                    $u.cols($u.button("Сохранить").Click(function () { return _this.save(); }), {}),
                    $u.element("baseId").Label("База").AsSelect(bases.db.names(true)).Require(null, !allowAdmin).Css("it-warning"),
                    $u.element("date").Label("Дата").AsDate().Disable(!allowAdmin).Css("it-warning"),
                    $u.cols($u.element("isPublic").Label("Отразить в отчетах").AsCheckbox(true).Tooltip("Расходы проведены для отражения в статистике").Css("it-warning"), $u.element("isArchive").Label("Архив").AsCheckbox(true)),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    $u.tabview()
                        .Tab("Статьи", gridPanelCfg)
                        .Tab("История", this.messagesView.$config())
                        .Autoheight()
                ],
            });
            return view;
        };
        EditView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var vals = this.form.load(expenses.db.getUrl(id));
            var items = vals.items;
            this.grid.refresh(items);
            this.grid.scheme({
                expenseId: id,
                groupId: this.groups.length > 0 ? this.groups[0].id : null,
            });
            this.messagesView.filter.expense = id;
            this.messagesView.refresh();
            this.messagesView.setDefaults({ expenseId: id });
        };
        EditView.prototype.save = function () {
            if (!this.form.validate())
                return;
            var s = 0;
            this.grid.save();
            this.form.save(expenses.db.saveUrl(this.objectId), false);
            webix.message("Данные сохранены на сервере");
        };
        return EditView;
    }($u.View));
    expenses.EditView = EditView;
})(expenses || (expenses = {}));
var expenses;
(function (expenses) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.filterForm = new $u.RefForm();
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                scrollAlignY: true,
                leftSplit: 3,
                columns: [
                    $u.column("id").Header("*", 30).Template(Symbols.pencil.link("{common.href}/expenses/edit/?oid=#id#")),
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("baseId").Header("База", 200).AsSelect(bases.db.names(false)).Sort().Filter(),
                    $u.column("isPublic").Header("Отч").AsCheckboxReadly().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("totals").Header("Расход", 65),
                    $u.column("login").Header("Пользователь", 170).Sort().Filter(),
                    $u.column("description").Header("Описание", 200).Sort().Filter(),
                    $u.column("details").Header("Позиции", 900).Sort().Filter(),
                ],
                scheme: {
                    id: -1,
                    name: "новый элемент",
                },
                save: expenses.db.getSaveCfg(true),
            }).Editable();
            var isAllDates = orders.logic.allowAnyReportDay();
            var filterCfg = this.filterForm.config().extend({
                cols: [
                    this.grid.btnAdd(),
                    $u.element("dfrom").Label("Дата с", null, 50).Size(170).AsDate().Disable(!isAllDates),
                    $u.element("dto").Label("По", null, 40).Size(170).AsDate().Disable(!isAllDates),
                    this.grid.btnRefresh(function (_) { return _this.refresh(); }),
                    {},
                ]
            });
            var view = $u.rows(filterCfg, gridCfg);
            return view;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d = new Date(Date.now());
            d = webix.Date.weekStart(d);
            this.filterForm.setValuesEx({ dfrom: d, dto: d.addDays(6) });
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.refresh();
        };
        GridView.prototype.refresh = function () {
            var vals = this.filterForm.values();
            var rows = expenses.db.list_items(vals.dfrom, vals.dto);
            this.grid.refresh(rows);
        };
        return GridView;
    }($u.View));
    expenses.GridView = GridView;
})(expenses || (expenses = {}));
var expenses;
(function (expenses) {
    expenses.create = {
        grid: function () { return new expenses.GridView(); },
        edit: function () { return new expenses.EditView(); },
    };
    var ExpDocSource = (function (_super) {
        __extends(ExpDocSource, _super);
        function ExpDocSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.list_items = function (dateFrom, dateTo) { return _this.list({ dateFrom: dateFrom, dateTo: dateTo }); };
            return _this;
        }
        return ExpDocSource;
    }(app.AppDataSource));
    expenses.db = new ExpDocSource("expenses");
    var ExpItemsSource = (function (_super) {
        __extends(ExpItemsSource, _super);
        function ExpItemsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.list_items = function (id) { return _this.list(id); };
            return _this;
        }
        return ExpItemsSource;
    }(app.AppDataSource));
    expenses.itemsdb = new ExpItemsSource("expitems");
})(expenses || (expenses = {}));
var paydocs;
(function (paydocs) {
    var CreatePayView = (function (_super) {
        __extends(CreatePayView, _super);
        function CreatePayView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreatePayView.prototype.$config = function () {
            var _this = this;
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("fio").Label("ФИО").Require(),
                    $u.element("email").Label("E-mail").Require(),
                    $u.element("phone").Label("Телефон с кодом +7").Require(),
                    $u.element("mobPhone").Label("Мобильный тел.  +7").Tooltip("Для уточнения данных по заказу"),
                    $u.element("tarifName").Label("Тариф").Readonly().Css("it-warning"),
                    $u.element("price").Label("Цена в мес").Readonly(),
                    $u.element("count").Label("Кол-во месяцев").AsCounter(1, 24).Value(1).OnChange(function (x) { return _this.recalc(); }).Error("Кол-во мес от 1 до 24"),
                    $u.element("comm").Label("Комиссия начисл.").Readonly(),
                    $u.element("total").Label("Сумма к оплате").Css("it-warning").Readonly().Require().Error("Введите кол-во месяцев для расчета оплаты"),
                    $u.element("agree").Label("Согласен с условиями " + "лицензии".link("./docs/license.html", { target: "_blank" })).AsCheckbox(true).Error("Требуется согласие с условиями лицензии"),
                    $u.element("offerta").Label("Согласен с условиями " + " договора-оферты".link("./docs/offerta.html", { target: "_blank" })).AsCheckbox(true).Error("Требуется согласие с условиями оферты"),
                    $u.element("direct").Label("Прямая оплата").AsCheckbox()
                        .Visible(system.context.allow(auth.oper.domainsEdit))
                        .Tooltip("Оплатить напрямую минуя платежный сервис (для администраторов)"),
                    _super.prototype.$config.call(this, "Оплатить "),
                ],
                rules: {
                    total: function (x) { return x > 0; },
                    count: function (x) { return x > 0 && x <= 24; },
                    agree: function (x) { return x == true; },
                    offerta: function (x) { return x == true; },
                    email: webix.rules.isEmail,
                }
            });
            return formCfg;
        };
        CreatePayView.prototype.load = function (vals) {
            if (this.id && this.id === vals.id)
                return;
            vals.count = 1;
            this.form.setValuesEx(vals);
            this.recalc();
        };
        CreatePayView.prototype.recalc = function () {
            var vals = this.form.values();
            vals.total = vals.count * parseInt(vals.price) + parseInt(0 + vals.comm);
            this.form.setValuesEx({ total: vals.total });
        };
        CreatePayView.prototype.invokeAction = function (vals0) {
            var vals = this.form.values();
            vals.text = "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u043E \u0442\u0430\u0440\u0438\u0444\u0443 ".concat(vals.tarifName, ": \u0444\u0438\u043A\u0441.\u0446\u0435\u043D\u0430 ").concat(vals.price, " \u0440./\u043C\u0435\u0441 \u0437\u0430 ").concat(vals.count, " \u043C\u0435\u0441. + \u043D\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u043D\u0430\u044F \u043C\u043E\u0431.\u043A\u043E\u043C\u0438\u0441\u0441\u0438\u044F ").concat(vals.comm, " \u0440., \u043D\u0430 \u043E\u0431\u0449\u0443\u044E \u0441\u0443\u043C\u043C\u0443 ").concat(vals.total);
            var res;
            if (vals.direct)
                res = paydocs.testdb.payment(vals);
            else
                res = paydocs.paymentdb.payment(vals);
            _super.prototype.invokeAction.call(this, vals);
            this.$clear();
            this.hide();
            if (!res)
                alert("Платеж успешно проведен");
            else if (!!res.error)
                It.UI.w.error("Ошибка платежа: " + res.error);
            else if (res.url && res.status == 307)
                It.Web.openUrl(res.url, undefined, true);
        };
        CreatePayView.prototype.$clear = function () {
            this.form.setValuesEx({ total: '', count: '', });
        };
        return CreatePayView;
    }($u.PopupView));
    paydocs.CreatePayView = CreatePayView;
})(paydocs || (paydocs = {}));
var paydocs;
(function (paydocs) {
    var InvoicesList = (function () {
        function InvoicesList() {
            this.list = new $u.RefList();
        }
        InvoicesList.prototype.config = function (ext) {
            var cfg = this.list.config().extend({
                template: 'http->' + It.Web.WebSource.base + '/html/invoice-list.html',
                type: {
                    href: "#!",
                    height1: "auto",
                    height: 160,
                },
                select: false,
            }).Size();
            if (ext)
                cfg = cfg.extend(ext);
            return cfg;
        };
        InvoicesList.prototype.reload = function (domainId) {
            var invoices = paydocs.db.getInvoices({ domain: domainId });
            this.list.refresh(invoices);
        };
        return InvoicesList;
    }());
    paydocs.InvoicesList = InvoicesList;
})(paydocs || (paydocs = {}));
var paydocs;
(function (paydocs) {
    var PayDocsGrid = (function () {
        function PayDocsGrid() {
            this.grid = new $u.RefGrid();
        }
        PayDocsGrid.prototype.config = function () {
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("isCompleted").Header("Опл").AsCheckboxReadly(),
                    $u.column("date").Header("Дата").AsDate(),
                    $u.column("mobComm").Header("Комиссия").AsInt(),
                    $u.column("total").Header("Сумма").AsInt(),
                    $u.column("fio").Header("ФИО", 200),
                    $u.column("text").Header("Описание", -1),
                ],
                scheme: {
                    name: "без имени",
                },
            });
            return grid;
        };
        PayDocsGrid.prototype.reload = function (domainId) {
            var docs = paydocs.db.getItems({ domain: domainId });
            this.grid.refresh(docs);
        };
        return PayDocsGrid;
    }());
    paydocs.PayDocsGrid = PayDocsGrid;
})(paydocs || (paydocs = {}));
var paydocs;
(function (paydocs) {
    var PayDocsSource = (function (_super) {
        __extends(PayDocsSource, _super);
        function PayDocsSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PayDocsSource.prototype.getItems = function (args) {
            var list = this.load("list", args);
            return list;
        };
        PayDocsSource.prototype.getInvoices = function (args) {
            var list = this.load("invoices", args);
            return list;
        };
        PayDocsSource.prototype.recalc = function (domain) {
            return this.post('recalc', { domain: domain });
        };
        return PayDocsSource;
    }(app.AppDataSource));
    paydocs.db = new PayDocsSource("paydocs");
    var PaymentSource = (function (_super) {
        __extends(PaymentSource, _super);
        function PaymentSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PaymentSource.prototype.payment = function (args) {
            return this.post("payment", args);
        };
        return PaymentSource;
    }(app.AppDataSource));
    paydocs.paymentdb0 = new PaymentSource("payonline");
    paydocs.paymentdb = new PaymentSource("tinkoff");
    paydocs.testdb = new PaymentSource("paytest");
})(paydocs || (paydocs = {}));
var paychannels;
(function (paychannels) {
    paychannels.create = {
        grid: function () { return new paychannels.GridView(); },
        form: function () { return new paychannels.FormView(); },
    };
    var PayChannelKind;
    (function (PayChannelKind) {
        PayChannelKind[PayChannelKind["Cash"] = 1] = "Cash";
        PayChannelKind[PayChannelKind["Instruction"] = 2] = "Instruction";
        PayChannelKind[PayChannelKind["Tinkoff"] = 3] = "Tinkoff";
    })(PayChannelKind = paychannels.PayChannelKind || (paychannels.PayChannelKind = {}));
    paychannels.kinds = [
        { id: PayChannelKind.Cash, value: "Наличными" },
        { id: PayChannelKind.Instruction, value: "По инструкции" },
        { id: PayChannelKind.Tinkoff, value: "Тинькофф" },
    ];
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url("list");
            _this.names = function () { return _this.load("names"); };
            return _this;
        }
        return DataSource;
    }(app.AppDataSource));
    paychannels.db = new DataSource("paychannels");
})(paychannels || (paychannels = {}));
var paychannels;
(function (paychannels) {
    var FormView = (function (_super) {
        __extends(FormView, _super);
        function FormView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        FormView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("name").Label("Имя").Require(),
                    $u.element("prepayUrl").Label("Ссылка на предоплату", "top"),
                    $u.element("kind").Label("Тип").AsSelect(paychannels.kinds),
                    $u.element("forfeit1").Label("Штраф мин").AsInt(),
                    $u.element("forfeit2").Label("Штраф макс").AsInt(),
                    $u.element("total1").Label("Итог мин").AsInt(),
                    $u.element("total2").Label("Итог макс").AsInt(),
                    $u.element("sources").Label("Источник").AsMultiSelect(orders.sourceTypes),
                    $u.element("partPc").Label("% от итога").AsInt(),
                    $u.element("isForfeits").Label("Для штрафа").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    {},
                ],
            });
            return formCfg;
        };
        FormView.prototype.prepay = function (val) {
            this.form.enable(val, "prepayUrl");
        };
        return FormView;
    }($u.View));
    paychannels.FormView = FormView;
})(paychannels || (paychannels = {}));
var paychannels;
(function (paychannels) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.formview = paychannels.create.form().owner(_this);
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Название", 200).Sort().Sort(),
                    $u.column("kind").Header("Тип").AsSelect(paychannels.kinds),
                    $u.column("description").Header("Описание", -1),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                },
                save: paychannels.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.toolbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.$reload(); }), {}, $u.icon("save").Click(function (_) { return _this.formview.form.updateBindings(); })), $u.cols(gridCfg, $u.splitter(), this.formview.$config().Size(300)));
            return view;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.formview.form.bind(this.grid);
        };
        GridView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var list = paychannels.db.list();
            this.grid.refresh(list);
        };
        return GridView;
    }($u.View));
    paychannels.GridView = GridView;
})(paychannels || (paychannels = {}));
var trans;
(function (trans) {
    var PartGridView = (function (_super) {
        __extends(PartGridView, _super);
        function PartGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            return _this;
        }
        PartGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var allowSuperCRMEdit = system.context.allowCrmEdit();
            var w = 160;
            var groups1 = trans.db.groups(1);
            var groups2 = trans.db.groups(2);
            var groups3 = trans.db.groups(3);
            var grid = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 2,
                columns: [
                    $u.column("date").Header("Дата").AsDate(webix.i18n.fullDateFormatStr).Sort().Edit(),
                    $u.column("total").AsInt().Header("Стоимость", 70).AsInt().Sort().Footer({ content: "summColumn" }).Edit(),
                    $u.column("register").Header("Регистр", w).AsSelect(groups1).Sort().Filter().Edit(),
                    $u.column("operation").Header("Операция", w).AsSelect(groups2).Sort().Filter().Edit(),
                    $u.column("details").Header("Детали", w).AsSelect(groups3).Sort().Filter().Edit(),
                    $u.column("sphere").Header("Сфера", w).Sort().Filter(),
                    $u.column("domain").Header("Партнер", w).Sort().Filter(),
                    $u.column("base").Header("База", w).Sort().Filter(),
                    $u.column("room").Header("Комната", w).Sort().Filter(),
                    $u.column("orderId").Header("Бронь", 50).Template($u.getViewLink("orders", "(...)", "#orderId#")),
                    $u.column("text").Header("Комментарий", w * 3).Edit(),
                ],
                save: trans.db.getSaveCfg(true),
                scheme: {},
            }).Footer();
            if (allowSuperCRMEdit)
                grid.Editable();
            var filter = this.filterForm.config().extend({
                cols: [
                    allowSuperCRMEdit ? this.grid.btnAdd() : $u.label(""),
                    allowSuperCRMEdit ? this.grid.btnDel() : $u.label(""),
                    $u.label("Фильтр"),
                    $u.element("dfrom").Label("Дата с:", null, 60).AsDate().Size(180),
                    $u.element("dto").Label("По:", null, 40).AsDate().Size(160),
                    this.grid.btnRefresh(function (_) { return _this.reload(_this.filter); }),
                    {}
                ]
            });
            return $u.rows(filter, grid).Min(-1, 400);
        };
        PartGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d = new Date();
            if (!!this.filterForm.ref)
                this.filterForm.setValuesEx({ dfrom: d.addDays(-7), dto: d });
        };
        PartGridView.prototype.reload = function (filter) {
            this.filter = filter;
            var fvals = this.filterForm.values();
            var args = { client: filter.clientId, order: filter.orderId, dfrom: fvals.dfrom, dto: fvals.dto };
            var res = trans.db.search(args);
            this.grid.refresh(res);
            this.grid.scheme(filter);
        };
        return PartGridView;
    }($u.View));
    trans.PartGridView = PartGridView;
})(trans || (trans = {}));
var tarifs;
(function (tarifs) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.form = tarifs.create.form();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("hasTarifs").Header("Подтариф").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Тариф", -1).Sort(),
                    $u.column("description").Header("Описание", -2).Sort(),
                    $u.column("price").Header("Фикс.цена").AsInt().Sort().Tooltip("Фиксированная цена"),
                    $u.column("destKind").Header("Назначение", 100).AsSelect(equipments.destKinds),
                    $u.column("isPayment").Header("Опл").AsCheckboxReadly().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    name: "новый тариф",
                    price: 0,
                    commission: 0,
                    months: 0,
                },
                data: tarifs.db.list(),
                save: tarifs.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function () { return _this.refresh(); }), {}, $u.icon("save").Click(function () { return _this.form.form.updateBindings(); }).Tooltip($u.loc.Tooltips.Save)), $u.cols(grid, $u.splitter(), this.form.$config().Size(300)));
            return view;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.form.bind(this.grid);
        };
        GridView.prototype.refresh = function () {
            var list = tarifs.db.list();
            this.grid.refresh(list);
        };
        return GridView;
    }($u.View));
    tarifs.GridView = GridView;
})(tarifs || (tarifs = {}));
var tarifs;
(function (tarifs) {
    tarifs.create = {
        grid: function () { return new tarifs.GridView(); },
        form: function () { return new tarifs.FormView(); },
    };
    var TarifsSource = (function (_super) {
        __extends(TarifsSource, _super);
        function TarifsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url("list");
            _this.names = function () { return _this.load("names"); };
            return _this;
        }
        return TarifsSource;
    }(app.AppDataSource));
    tarifs.db = new TarifsSource("tarifs");
})(tarifs || (tarifs = {}));
var tarifs;
(function (tarifs) {
    var FormView = (function (_super) {
        __extends(FormView, _super);
        function FormView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        FormView.prototype.$config = function () {
            var cfg = this.form.config().Labels(120).extend({
                elements: [
                    $u.header("Редактор тарифа"),
                    $u.element("name").Label("Название", "top").Require(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    $u.element("price").Label("Фикс.цена").AsInt().Tooltip("Фиксированная цена"),
                    $u.element("price1").Label("Цена 1 бронь").AsInt().Tooltip("Цена за 1 бронирование"),
                    $u.element("commission").Label("% ком").AsInt().Tooltip("% комиссии за резервирование"),
                    $u.element("payCommission").Label("% ком опл.").AsInt().Tooltip("% комиссии за оплаченный"),
                    $u.element("tarifIds").Label("Подтарифы", "top").AsMultiSelect(tarifs.db.names()).Tooltip("Вложенные тарифы"),
                    $u.element("sphereIds").Label("Сферы", "top").AsMultiSelect(spheres.db.names()).Tooltip("Вложенные тарифы"),
                    $u.element("destKind").Label("Назначение").AsSelect(equipments.destKinds),
                    $u.element("isArchive").Label("Архив (скрыть)").AsCheckbox(true),
                    {},
                ]
            });
            return cfg;
        };
        return FormView;
    }($u.View));
    tarifs.FormView = FormView;
})(tarifs || (tarifs = {}));
var domains;
(function (domains) {
    domains.create = {
        grid: function () { return new domains.GridView(); },
        reg: function () { return new domains.RegView(); },
        edit: function () { return new domains.EditView(); },
        service: function () { return new domains.EditView(); },
    };
    var DomainsSource = (function (_super) {
        __extends(DomainsSource, _super);
        function DomainsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url("list");
            _this.job = function () { return _this.load("job"); };
            _this.names = function () { return _this.load("names"); };
            _this.namesUrl = _this.url("names");
            return _this;
        }
        DomainsSource.prototype.init = function (id, isSuper) {
            var ops = auth.opers;
            if (!isSuper)
                ops = ops.filter(function (x) { return x.super !== true; });
            var ids = ops.map(function (x) { return x.id; });
            var res = this.post("init", { id: id, operations: ids, role: auth.roles.super });
            return res;
        };
        DomainsSource.prototype.reset = function (id) {
            var res = this.post("reset", { id: id });
            return res;
        };
        DomainsSource.prototype.registry = function (info) {
            var res = this.post("registry", info);
            return res;
        };
        return DomainsSource;
    }(app.AppDataSource));
    domains.db = new DomainsSource("domains");
    var PeriodKind;
    (function (PeriodKind) {
        PeriodKind[PeriodKind["ByCreateDate"] = 1] = "ByCreateDate";
        PeriodKind[PeriodKind["ByServiceDate"] = 2] = "ByServiceDate";
    })(PeriodKind = domains.PeriodKind || (domains.PeriodKind = {}));
    domains.periods = [
        { id: PeriodKind.ByCreateDate, value: "По дате создания" },
        { id: PeriodKind.ByServiceDate, value: "По дате брони" },
    ];
    var DomainStatus;
    (function (DomainStatus) {
        DomainStatus[DomainStatus["Unknown"] = 0] = "Unknown";
        DomainStatus[DomainStatus["Payment"] = 1] = "Payment";
        DomainStatus[DomainStatus["Warning"] = 10] = "Warning";
        DomainStatus[DomainStatus["PredLock"] = 20] = "PredLock";
        DomainStatus[DomainStatus["Locked"] = 30] = "Locked";
        DomainStatus[DomainStatus["Mamual"] = 100] = "Mamual";
        DomainStatus[DomainStatus["New"] = 101] = "New";
    })(DomainStatus = domains.DomainStatus || (domains.DomainStatus = {}));
    domains.statuses = [
        { id: DomainStatus.Payment, value: "Оплачено" },
        { id: DomainStatus.Warning, value: "Предупреждение" },
        { id: DomainStatus.PredLock, value: "Предблок" },
        { id: DomainStatus.Locked, value: "Блок" },
        { id: DomainStatus.Mamual, value: "Ручной" },
        { id: DomainStatus.New, value: "Новый" },
    ];
    function domain_css(obj) {
        if (!obj.limitDate)
            return;
        var dd = It.dateDiff.inDays(obj.limitDate);
        if (dd > 7)
            obj.$css = "it-error";
        else if (dd > 0)
            obj.$css = "it-warning";
    }
    domains.domain_css = domain_css;
})(domains || (domains = {}));
var domains;
(function (domains) {
    var EditForm = (function () {
        function EditForm() {
            this.form = new $u.RefForm();
        }
        EditForm.prototype.config = function () {
            var lw = 100;
            var formCfg = this.form.config().extend({
                elements: [
                    $u.element("name").Label("Зона доступа"),
                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)),
                    $u.element("email").Label("E-mail партнера").AsTextArea(70).Tooltip('Список почтовых адресов, разделенных ;'),
                    $u.element("phone").Label("Телефоны партнера").AsTextArea(70).Tooltip('Список телефонов, разделенных ;'),
                    $u.element("isArchive").Label("Архивная").AsSwitch(),
                    $u.element("createDate").Label("Создано").AsDate().Readonly(),
                    $u.element("initDate").Label("Инициализирована").AsDate().Readonly(),
                    $u.element("tarifId").Label("Текущий тариф", "top").AsSelect(tarifs.db.names()),
                    $u.element("period").Label("Граница даты", "top").AsSelect(domains.periods).Require(),
                    $u.element("isPayment").Label("Только для оплат").AsSwitch(),
                    $u.element("terminal").Label("ИД Терминала"),
                    $u.element("inn").Label("ИНН"),
                    $u.element("status").Label("Статус").AsSelect(domains.statuses),
                    $u.element("limitDate").Label("Срок").AsDate(),
                    $u.element("tarifIds").Label("Доступные тарифы", "top").AsMultiSelect(tarifs.db.names()),
                    $u.element("spheres").Label("Сферы", "top").AsTextArea(80).Disable(),
                    $u.element("paysTotal").Label("Оплаты").Readonly(),
                    $u.element("owners").Label("Ответственные").AsTextArea(80).Disable(),
                    $u.element("description").Label("Описание").AsTextArea(80),
                    {},
                ],
            });
            return formCfg;
        };
        return EditForm;
    }());
    domains.EditForm = EditForm;
})(domains || (domains = {}));
var domains;
(function (domains) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.headers = new $u.RefTemplate();
            _this.template = new $u.RefTemplate();
            _this.docsGrid = new paydocs.PayDocsGrid();
            _this.roomsGrid = new domains.RoomsView();
            _this.payview = new paydocs.CreatePayView(_this).onAction(function (_) { return _this.doPayment(); });
            _this.autoRenewalButton = new $u.RefUI();
            _this.invoicesList = new paydocs.InvoicesList();
            _this.form = new $u.RefForm();
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var form = this.form.config().Labels(110).extend({
                padding: 0,
                elements: [
                    $u.cols($u.element("period").Label("Граница даты").AsSelect(domains.periods).Require().Size(270), $u.element("isPayment").Label("Тариф оплат").AsCheckbox(true).Size(270).Tooltip("Использовать тариф для оплаченных броней"), $u.button('Пересчитать').Click(function (_) { return _this.recalc(); }), {}),
                ],
            });
            var header = this.headers.config("<h2>Партнер: #name#</h2>");
            var templ = this.template.config('http->' + It.Web.WebSource.base + '/html/domain-details.html', { tarif: {} }).extend({
                activeContent: {
                    cancelAutoRenewalButton: $u.button("Отменить автопролонгацию").Click(function (_) { return _this.cancelAutoReneval(); }).Ref(this.autoRenewalButton),
                },
            }).Min(0, 150);
            var invListExt = {
                activeContent: {
                    payButton: $u.button("Продлить!").Click($u.callActiveContent(function (id) { return _this.openPayment(id); }))
                },
            };
            var tarif = $u.rows($u.header("Информация о текущем тарифе"), form, this.invoicesList.config(invListExt), templ);
            var docs = $u.rows($u.toolbar($u.label("Список платежных документов").Size(-1)), this.docsGrid.config().Autoheight());
            var tabs = $u.tabview()
                .Tab("Тариф", tarif)
                .Tab("Документы", docs)
                .Tab("Площадки", this.roomsGrid.$config());
            var view = $u.rows(header.Size(0, 90), tabs.Autoheight(), {});
            return view;
        };
        EditView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var w = this.payview.win = new $u.RefWin("Оплата");
            w.resize = false;
            w.position = 'center';
            w.config(this.payview.$config());
            this.loadForm(undefined);
        };
        EditView.prototype.$reload = function (id) {
            if (!id)
                id = system.context.domainId;
            _super.prototype.$reload.call(this, id);
            this.loadForm(id);
            this.docsGrid.reload(id);
            this.roomsGrid.reload(id);
            this.invoicesList.reload(id);
        };
        EditView.prototype.openPayment = function (tarifId) {
            var invoice = this.invoicesList.list.getItem(tarifId);
            if (!invoice)
                return It.UI.w.error("Не выбран тариф");
            this.payview.openWindow();
            var vals = this.template.values();
            vals.tarifId = invoice.id;
            vals.tarifName = invoice.name;
            vals.price = invoice.price;
            vals.comm = invoice.mobComSum;
            this.payview.load(vals);
        };
        EditView.prototype.loadForm = function (id) {
            var vals = id ? domains.db.get(id) : { tarif: {} };
            vals.limit = webix.i18n.dateFormatStr(vals.limitDate);
            this.headers.setValues(vals);
            this.template.setValuesEx(vals);
            this.form.setValues(vals);
        };
        EditView.prototype.cancelAutoReneval = function () {
            if (!confirm("Отменить автопролонгацию?"))
                return;
            this.template.setValuesEx({ autoRenewal: false });
            alert("Автопролонгация тарифа прекращена. Для пролонгации тарифа используйте кнопку 'Продлить'");
            this.autoRenewalButton.enable(false);
            this.$reload(this.objectId);
        };
        EditView.prototype.doPayment = function () {
            this.payview.win.hide();
            this.$reload(this.objectId);
        };
        EditView.prototype.recalc = function () {
            if (!this.form.validate())
                return;
            if (!confirm("Пересчитать текущую доменную зону?"))
                return;
            var vals = this.form.values();
            domains.db.save({ id: this.objectId, period: vals.period, isPayment: vals.isPayment });
            var res = paydocs.db.recalc(this.objectId);
            this.loadForm(this.objectId);
            webix.alert("\u0414\u043E\u043C\u0435\u043D\u043D\u0430\u044F \u0437\u043E\u043D\u0430 \u043F\u0435\u0440\u0435\u0441\u0447\u0438\u0442\u0430\u043D\u0430");
        };
        return EditView;
    }($u.View));
    domains.EditView = EditView;
})(domains || (domains = {}));
var domains;
(function (domains) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.edform = new domains.EditForm();
            _this.fform = new $u.RefForm();
            _this.popupForm = new domains.PopupForm().onAction(function (vals) { return _this.setProps(vals); });
            return _this;
        }
        GridView.prototype.setProps = function (vals) {
            var sel_ids = this.grid.getSelectedIds();
            if (sel_ids.length == 0)
                return alert('Не выделены записи');
            if (!confirm("\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0434\u043B\u044F ".concat(sel_ids.length, " \u0437\u0430\u043F\u0438\u0441\u0435\u0439?")))
                return;
            for (var _i = 0, sel_ids_1 = sel_ids; _i < sel_ids_1.length; _i++) {
                var id = sel_ids_1[_i];
                vals.id = id;
                domains.db.save(vals);
            }
            this.reload();
            alert('Выделенный список обновлен');
        };
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 1,
                columns: [
                    $u.column("name").Header("Партнер", 140).Template($u.getViewLink("domains", '#name#')).Sort().Filter().Footer({ content: "countColumn" }),
                    $u.column("status").Header("Статус").AsSelect(domains.statuses).Sort().Filter().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("tarifId").Header("Тариф", 130).AsSelect(tarifs.db.names()).Sort().Filter(),
                    $u.column("cityId").Header("Город").AsSelect(groups.db.names(groups.GroupType.City)).Sort().Filter(),
                    $u.column("debtComm").Header("Долг", 60).AsInt().Footer({ content: "summColumn" }).Sort(),
                    $u.column("lastComm").Header("Прошл.ком", 60).AsInt().Footer({ content: "summColumn" }).Sort(),
                    $u.column("currComm").Header("Тек.ком", 60).AsInt().Footer({ content: "summColumn" }).Sort(),
                    $u.column("createDate").Header("Создано.").AsDate().Sort(),
                    $u.column("initDate").Header("Иниц.").AsDate().Sort(),
                    $u.column("limitDate").Header("Срок").AsDate().Sort(),
                    $u.column("terminal").Header("Терминал", 140).Sort().Filter(),
                    $u.column("owners").Header("Ответственные", 240).Sort().Filter(),
                    $u.column("spheres").Header("Сферы", 440).Sort().Filter(),
                ],
                scheme: {
                    $change: domains.domain_css,
                },
                save: domains.db.getSaveCfg(true),
            }).Editable().Footer();
            var toolbar = $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), $u.button('Фильтр').Popup(this.$config_filter()), $u.button("Изменить").Popup(this.popupForm.$config().Size(500)), $u.button('Обновить').Click(function () { return _this.reload(); }), $u.button("Иниц.").Tooltip("Создать права и админа").Click(function () { return _this.initDomains(); }), $u.button("Пароль").Tooltip("Сбросить пароль админа").Click(function () { return _this.resetPassword(); }), $u.button("Тест").Tooltip("Тестирование сервиса смены статусов").Click(function () { return _this.testJob(); }), {}, $u.button("Сохранить").Click(function () { return _this.save(); }));
            var view = $u.rows(toolbar, $u.cols(grid, this.edform.config().Size(350)));
            return view;
        };
        GridView.prototype.$config_filter = function () {
            var _this = this;
            var fform = this.fform.config().Labels(0, 'top').extend({
                elements: [
                    $u.element('spheres').Label('Сферы').AsMultiSelect(spheres.db.names()),
                    $u.element('name').Label('Ответственный (ФИO,mails,login)'),
                    $u.element('sources').Label('Источники').AsMultiSelect(orders.sourceUserTypes),
                    $u.element('statuses').Label('Статус').AsMultiSelect(domains.statuses),
                    $u.element('archive').Label('Показать с флагом Архив =').AsSelect(app.booleans),
                    $u.cols($u.button("Найти").Click(function (_) { return _this.reload(); }), $u.button("Очистить").Click(function (_) { return _this.fform.clear(); }), {}),
                ],
            });
            return fform;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.edform.form.bind(this.grid);
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.reload();
        };
        GridView.prototype.initDomains = function () {
            var items = this.grid.getSelectedItems();
            items.forEach(function (item) {
                return domains.db.init(item.id, false);
            });
            webix.alert("Инициализированы выделенные партнерские зоны и созданы права по умолчанию");
            this.reload();
        };
        GridView.prototype.resetPassword = function () {
            var curr = this.grid.getSelectedItem();
            if (!curr)
                return webix.message("Выделите запись");
            if (!confirm("Создать новый пароль для администратора зоны?"))
                return webix.message("Отмена действия");
            var res = domains.db.reset(curr.id);
            webix.alert("\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u0437\u043E\u043D\u044B, Login: ".concat(res.login, ", Password: ").concat(res.password));
        };
        GridView.prototype.testJob = function () {
            domains.db.job();
            this.reload();
            webix.message("Обработка статусов успешно выполнена");
        };
        GridView.prototype.reload = function () {
            var filter = this.fform.ref ? this.fform.values() : {};
            var list = domains.db.list(filter);
            this.grid.refresh(list);
        };
        GridView.prototype.save = function () {
            this.edform.form.updateBindings();
        };
        return GridView;
    }($u.View));
    domains.GridView = GridView;
})(domains || (domains = {}));
var domains;
(function (domains) {
    var RegView = (function (_super) {
        __extends(RegView, _super);
        function RegView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RegView.prototype.$config = function () {
            var _this = this;
            var form = this.form.config().Labels(100).extend({
                elements: [
                    $u.header("Регистрация нового партнера".tag("b")),
                    $u.element("name").Label("Название").Require(),
                    $u.element("email").Label("E-mail").Require(),
                    $u.element("city").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)).Require(),
                    $u.element("spheres").Label("Сферы деятельности", "top").AsMultiSelect(spheres.db.names()).Require(),
                    $u.cols({}, $u.button("Зарегистрироваться").Click(function (_) { return _this.register(); }).Size(200, 60), {}),
                    {},
                ],
            });
            var cfg = $u.cols({}, form.Min(400), {});
            return cfg;
        };
        RegView.prototype.$action = function () {
            if (!_super.prototype.$action.call(this))
                return false;
            this.hide();
            this.$clear();
            return true;
        };
        RegView.prototype.register = function () {
            if (!this.form.validate())
                return;
            var vals = this.form.values();
            vals.opers = RegView.OPERATIONS;
            domains.db.registry(vals);
            webix.alert('Партнерская зона успешно зарегистрирована. Проверьте пожалуйста почту');
        };
        RegView.OPERATIONS = [
            auth.oper.lists,
            auth.oper.listBases,
            auth.oper.basesAll,
            auth.oper.equipments,
            auth.oper.promo,
            auth.oper.clients,
            auth.oper.orders,
            auth.oper.orderCancel,
            auth.oper.orderCancelAny,
            auth.oper.orderDelete,
            auth.oper.orderEdit,
            auth.oper.orderEditGroup,
            auth.oper.orderEditHold,
            auth.oper.orderForfeit,
            auth.oper.orderNew,
            auth.oper.orderViewFull,
            auth.oper.orderViewQuick,
            auth.oper.users,
        ];
        return RegView;
    }($u.PopupView));
    domains.RegView = RegView;
})(domains || (domains = {}));
var discounts;
(function (discounts) {
    discounts.create = {
        grid: function () { return new discounts.GridView(); },
    };
    var DiscountsSource = (function (_super) {
        __extends(DiscountsSource, _super);
        function DiscountsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url("list");
            return _this;
        }
        return DiscountsSource;
    }(app.AppDataSource));
    discounts.db = new DiscountsSource("discounts");
})(discounts || (discounts = {}));
var discounts;
(function (discounts) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                    $u.column("orders").Header("Заказов").AsInt().Sort().Edit(),
                    $u.column("discount").Header("% скидки").AsInt().Sort().Edit(),
                ],
                scheme: {},
                save: discounts.db.getSaveCfg(true),
            }).Editable();
            var view = {
                rows: [
                    $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function () { return _this.refresh(); }), {}, $u.label("Список скидок, которые автоматически назначаются клиентам после оплаты")),
                    gridCfg,
                ],
            };
            return view;
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.refresh();
        };
        GridView.prototype.refresh = function () {
            var list = discounts.db.list();
            this.grid.refresh(list);
        };
        return GridView;
    }($u.View));
    discounts.GridView = GridView;
})(discounts || (discounts = {}));
var orders;
(function (orders) {
    orders.create = {
        'ask-grid': function () { return new orders.AskGridView(); },
        forfeits: function () { return new orders.ForfeitsGridView(); },
        edit: function () { return new orders.EditView(); },
        'filter-grid': function () { return new orders.FilterGridView(); },
        'filter-grid-full': function () { return new orders.FilterGridFullView(); },
        totals: function () { return new orders.TotalsView(); },
        requests: function () { return new orders.RequestsGridView(); },
        request: function () { return new orders.RequestView(); },
        totalscom: function () { return new orders.TotalsComView(); },
        calendar: function () { return new orders.CalendarView(); },
        search: function () { return new orders.SearchView(); },
        'search-s': function () { return new orders.SearchSuperView(); },
        'search-all': function () { return new orders.SearchAllView(); },
    };
    var OrdersSource = (function (_super) {
        __extends(OrdersSource, _super);
        function OrdersSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getAbonementItems = function (abonement) {
                return _this.load("abonement", { abonement: abonement });
            };
            _this.calendarUpdates = new app.UpdatesSource("updates");
            _this.forfeitUpdates = new app.UpdatesSource("updates");
            _this.calcUrl = _this.url("calc");
            return _this;
        }
        OrdersSource.prototype.clearCalendar = function (base, d1, d2) {
            return this.post('clear-calendar', { base: base, d1: d1, d2: d2 });
        };
        OrdersSource.prototype.list = function (args) {
            return this.load('list', args);
        };
        OrdersSource.prototype.admlist = function (args) {
            return this.load('admlist', args);
        };
        OrdersSource.prototype.requests = function (args) {
            return this.load('requests', args);
        };
        OrdersSource.prototype.search = function (filter) {
            var list = this.load("search", filter);
            return list;
        };
        OrdersSource.prototype.commissionUrl = function () {
            return this.url("commission");
        };
        OrdersSource.prototype.calc = function (item) {
            return this.post("calc", item);
        };
        OrdersSource.prototype.calendar = function (baseId, dateFrom, dateTo) {
            var list = this.load("calendar", { base: baseId, dateFrom: dateFrom, dateTo: dateTo });
            return list;
        };
        OrdersSource.prototype.totals = function (dfrom, dto) {
            var list = this.load("totals", { dfrom: dfrom, dto: dto }, false);
            return list;
        };
        OrdersSource.prototype.totalscom = function (args) {
            var list = this.load("totalscom", args, false);
            return list;
        };
        OrdersSource.prototype.setStatus = function (orderid, action) {
            var res = this.post("status", { id: orderid, act: action });
            return res;
        };
        return OrdersSource;
    }(app.AppDataSource));
    orders.db = new OrdersSource("orders");
    var OrderStatus;
    (function (OrderStatus) {
        OrderStatus[OrderStatus["Request"] = -1] = "Request";
        OrderStatus[OrderStatus["Unknow"] = 0] = "Unknow";
        OrderStatus[OrderStatus["Reserv"] = 1] = "Reserv";
        OrderStatus[OrderStatus["Closed"] = 10] = "Closed";
        OrderStatus[OrderStatus["Cancel"] = 11] = "Cancel";
    })(OrderStatus = orders.OrderStatus || (orders.OrderStatus = {}));
    orders.statuses = [
        { id: OrderStatus.Request, value: "Заявка" },
        { id: OrderStatus.Reserv, value: "Резерв" },
        { id: OrderStatus.Closed, value: "Закрыто" },
        { id: OrderStatus.Cancel, value: "Отменено" },
    ];
    var OrderAction;
    (function (OrderAction) {
        OrderAction[OrderAction["New"] = 0] = "New";
        OrderAction[OrderAction["Reserv"] = 1] = "Reserv";
        OrderAction[OrderAction["Paid"] = 10] = "Paid";
        OrderAction[OrderAction["CancelNormal"] = 11] = "CancelNormal";
        OrderAction[OrderAction["CancelForfeitAsk"] = 21] = "CancelForfeitAsk";
        OrderAction[OrderAction["CancelForfeitConfirm"] = 22] = "CancelForfeitConfirm";
        OrderAction[OrderAction["Close"] = 100] = "Close";
    })(OrderAction = orders.OrderAction || (orders.OrderAction = {}));
    var CancelReason;
    (function (CancelReason) {
        CancelReason[CancelReason["Unknown"] = 0] = "Unknown";
        CancelReason[CancelReason["Normal"] = 1] = "Normal";
        CancelReason[CancelReason["ForfeitsAsk"] = 3] = "ForfeitsAsk";
        CancelReason[CancelReason["ForfeitsConfirmed"] = 4] = "ForfeitsConfirmed";
    })(CancelReason = orders.CancelReason || (orders.CancelReason = {}));
    orders.cancelReasons = [
        { id: CancelReason.Normal, value: "Без штрафа" },
        { id: CancelReason.ForfeitsAsk, value: "Запрос" },
        { id: CancelReason.ForfeitsConfirmed, value: "Подтверждение" },
    ];
    var SourceKind;
    (function (SourceKind) {
        SourceKind[SourceKind["Abonements"] = 1] = "Abonements";
        SourceKind[SourceKind["Mobile"] = 2] = "Mobile";
        SourceKind[SourceKind["Site"] = 3] = "Site";
        SourceKind[SourceKind["Widget"] = 4] = "Widget";
        SourceKind[SourceKind["Bot"] = 5] = "Bot";
    })(SourceKind = orders.SourceKind || (orders.SourceKind = {}));
    orders.sourceKinds = [
        { id: SourceKind.Abonements, value: "Абонементы" },
        { id: SourceKind.Mobile, value: "Мобильные" },
        { id: SourceKind.Site, value: "Сайт" },
        { id: SourceKind.Widget, value: "Виджет" },
        { id: SourceKind.Bot, value: "Бот" },
    ];
    orders.payStatuses = [
        { id: 1, value: "Нет" },
        { id: 2, value: "Частично" },
        { id: 3, value: "Полностью" },
    ];
    var SourceType;
    (function (SourceType) {
        SourceType[SourceType["Web"] = 0] = "Web";
        SourceType[SourceType["Mobile"] = 1] = "Mobile";
        SourceType[SourceType["Imported"] = 2] = "Imported";
        SourceType[SourceType["Widget"] = 3] = "Widget";
        SourceType[SourceType["Bot"] = 4] = "Bot";
        SourceType[SourceType["Catalog"] = 5] = "Catalog";
        SourceType[SourceType["Sync"] = 6] = "Sync";
    })(SourceType = orders.SourceType || (orders.SourceType = {}));
    orders.sourceTypes = [
        { id: '' + SourceType.Web, value: "Сайт" },
        { id: SourceType.Mobile, value: "Мобильные" },
        { id: SourceType.Widget, value: "Виджет" },
        { id: SourceType.Catalog, value: "Каталог" },
        { id: SourceType.Bot, value: "Бот" },
        { id: SourceType.Imported, value: "Импорт" },
        { id: SourceType.Sync, value: "Синхронизация" },
    ];
    orders.sourceUserTypes = [
        { id: SourceType.Mobile, value: "Мобильные" },
        { id: SourceType.Widget, value: "Виджет" },
    ];
    var RequestStatus;
    (function (RequestStatus) {
        RequestStatus[RequestStatus["Unknown"] = 0] = "Unknown";
        RequestStatus[RequestStatus["New"] = 1] = "New";
        RequestStatus[RequestStatus["Processing"] = 2] = "Processing";
        RequestStatus[RequestStatus["Confirmed"] = 10] = "Confirmed";
        RequestStatus[RequestStatus["Canceled"] = 11] = "Canceled";
        RequestStatus[RequestStatus["Unprocessed"] = 12] = "Unprocessed";
    })(RequestStatus = orders.RequestStatus || (orders.RequestStatus = {}));
    orders.requestStatuses = [
        { id: RequestStatus.New, value: "Новая" },
        { id: RequestStatus.Processing, value: "В работе" },
        { id: RequestStatus.Confirmed, value: "Подтвержденная" },
        { id: RequestStatus.Canceled, value: "Отлонена" },
        { id: RequestStatus.Unprocessed, value: "Не обработана" },
    ];
    function getOrderText(vals) {
        var h1 = vals.dateFrom.getHours();
        var m1 = vals.dateFrom.getMinutes();
        var h2 = vals.dateTo.getHours();
        var m2 = vals.dateTo.getMinutes();
        if (h2 == 0)
            h2 = 24;
        var status = orders.statuses.findById(vals.status, {}).value || "без статуса";
        var reason = orders.cancelReasons.findById(vals.reason, {}).value || "";
        var text = "".concat(status, " ").concat(reason, ": ").concat(vals.baseName, ", ").concat(vals.roomName, " \u043D\u0430 ").concat(webix.i18n.dateFormatStr(vals.dateFrom), ", ").concat(h1, ":").concat(m1, "-").concat(h2, ":").concat(m2);
        return text;
    }
    orders.getOrderText = getOrderText;
})(orders || (orders = {}));
var abonements;
(function (abonements) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    var CreateWizard = (function (_super) {
        __extends(CreateWizard, _super);
        function CreateWizard() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        CreateWizard.prototype.$config = function () {
            var _this = this;
            var w = 70;
            var days = [
                $u.element("d1").Label("ПН").Size(w).AsCheckbox(true),
                $u.element("d2").Label("ВТ").Size(w).AsCheckbox(true),
                $u.element("d3").Label("СР").Size(w).AsCheckbox(true),
                $u.element("d4").Label("ЧТ").Size(w).AsCheckbox(true),
                $u.element("d5").Label("ПТ").Size(w).AsCheckbox(true),
                $u.element("d6").Label("СБ").Size(w).AsCheckbox(true),
                $u.element("d7").Label("ВС").Size(w).AsCheckbox(true),
            ];
            var formCfg = this.form.config().Labels(20).extend({
                elements: [
                    { cols: days },
                    $u.cols($u.element("t1").Label("Начало", null, 70).AsDate().Type("time").Size(180).Require(), $u.element("t2").Label("Окончание", null, 85).AsDate().Type("time").Size(200).Require(), {}),
                    $u.cols($u.button("Создать").Click(function () { return _this.onCreate(); }), $u.button("Очистить").Click(function () { return _this.form.clear(); }))
                ],
            });
            return formCfg;
        };
        CreateWizard.prototype.create = function (d1, d2) {
            if (!this.form.validate())
                return null;
            var items = [];
            var vals = this.form.values();
            var days = [vals.d7, vals.d1, vals.d2, vals.d3, vals.d4, vals.d5, vals.d6,];
            var t1 = vals.t1;
            var t2 = vals.t2;
            var ndays = (d2 - d1) / millisecondsPerDay;
            for (var i = 0; i <= ndays; i++) {
                var d = d1.addDays(i);
                var wday = d.getDay();
                var todo = days[wday];
                if (!todo)
                    continue;
                items.push({
                    date: d,
                    dateFrom: new Date(d.getFullYear(), d.getMonth(), d.getDate(), t1.getHours(), t1.getMinutes()),
                    dateTo: new Date(d.getFullYear(), d.getMonth(), d.getDate(), t2.getHours(), t2.getMinutes()),
                    wday: wday,
                });
            }
            return items;
        };
        CreateWizard.prototype.clickCreate = function () {
            if (this.onCreate)
                this.onCreate();
        };
        return CreateWizard;
    }($u.View));
    abonements.CreateWizard = CreateWizard;
})(abonements || (abonements = {}));
var abonements;
(function (abonements) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.ordersGrid = new $u.RefGrid();
            _this.ordersForm = new $u.RefForm();
            _this.wizard = new abonements.CreateWizard();
            _this.editor = new orders.OrderEditor(function () { return _this.refreshGrid(); });
            _this.messagesView = new messages.ListView(_this);
            _this.buttons = {
                create: new $u.RefUI(),
                createWizard: new $u.RefUI(),
                recalc: new $u.RefUI(),
                reserv: new $u.RefUI(),
                paid: new $u.RefUI(),
                close: new $u.RefUI(),
                save: new $u.RefUI(),
            };
            _this._Loading = false;
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var me = this;
            this.wizard.onCreate = function () { return _this.create(); };
            var bar = $u.cols($u.button("Сохранить").Click(function () { return _this.save(true); }), $u.button("Удалить").Click(function () { return _this.delete(); }).Hidden(!abonements.logic.allowDelete()), {});
            var formCfg = this.form.config().Labels(120).extend({
                elements: [
                    clients.getSearchColumn().OnChange(function (id) { return _this.clientUpdate(id); }),
                    $u.cols($u.rows($u.cols($u.element("dateFrom").Label("Начало").AsDate().Size(250), $u.element("baseId").Label("База", null, 70).AsSelect(bases.db.names(true)).OnChange(function (id) { return me.updateBase(id); }).Require(), $u.element("baseType").Visible(false)), $u.cols($u.element("dateTo").Label("Окончание").AsDate().Size(250), $u.element("roomId").Label("Комната", null, 70).AsSelect2([]).Require().OnChange(function () { return me.updateUI(); })).Size(-1), $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()).OnChange(function () { return me.updateUI(); }), $u.element("equipments").Label("Позиции").AsMultiSelect([]).OnChange(function () { return me.updateUI(); }), $u.element("promoId").Label("Промоакция").AsSelect(promo.db.names(true, promo.PromoKind.Action)), {}).Size(-1), $u.rows($u.element("clientDiscount").Label("Скидка клиента").AsNumber().Disable(), $u.element("discount").Label("Скидка абонем.").AsNumber().Disable().Tooltip("Временно заблокировано"), $u.element("totalReserv").Label("Резерв").AsNumber().Disable(), $u.element("totalPaid").Label("Оплата").AsNumber().Disable(), $u.element("forfeit").Label("Штраф тек.").AsNumber().Css("it-mark").Disable(), $u.element("totals").Label("Общая стоим.").Css("it-warning").AsNumber().Disable()).Size(300)),
                    $u.element("description").Label("Комментарий").AsTextArea(100),
                ],
            });
            var gridToolbar = $u.toolbar($u.button("Создание").Popup(this.wizard.$config()).Tooltip("Открытие мастера создания брони").Ref(this.buttons.createWizard), this.ordersGrid.btnAdd().Ref(this.buttons.create), $u.icon("minus-circle").Click(function () { return _this.deleteOrders(); }).Tooltip("Удалить выделенные брони"), this.ordersGrid.btnRefresh(function () { return _this.refreshGrid(); }), $u.button("Пересчет").Click(function () { return _this.recalc(false); }).Tooltip("Пересчет выделенных броней").Ref(this.buttons.recalc), $u.button("Открыть").Click(function () { return _this.openEditor(); }).Tooltip("Открыть выделенную бронь"), $u.button("Зарезервировать").Click(function () { return _this.doAction(orders.OrderAction.Reserv, "Зарезервировать выделенные брони?"); })
                .Tooltip("Резервирование выделенных броней").Ref(this.buttons.reserv), $u.button("Оплатить").Click(function () { return _this.doAction(orders.OrderAction.Paid, "Оплатить выделенные брони?"); })
                .Tooltip("Оплата выделенных броней").Ref(this.buttons.paid), $u.button("Закрыть").Click(function () { return _this.doAction(orders.OrderAction.Close, "Закрыть выделенные брони?"); })
                .Tooltip("Завершение выделенных броней").Ref(this.buttons.close), {}, $u.button("Сохранить").Click(function () { return _this.updateOrder(); })
                .Tooltip("Сохранение данных по брони").Ref(this.buttons.save));
            var ordersGrid = this.ordersGrid.config().extend({
                height: 200,
                columns: [
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", -1).Sort(),
                    $u.column("payForfeit").Header("Опл-Штр", 40).AsCheckbox(),
                    $u.column("payDate").Header("Дата оплаты").AsDate().Sort(),
                    $u.column("paidForfeit").AsInt().Header("Опл.Штраф", 80).Sort(),
                    $u.column("totalOrder").AsInt().Header("Стоимость", 80).Sort(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус").Sort(),
                    $u.column("errors").Header("Ошибки", -1),
                    $u.column("idd").Header("*", 30).Template(Symbols.calendar.link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("dateTo").Header("", 1).Size(1),
                ],
                scheme: {
                    abonementId: "",
                    totalOrder: 0,
                    dateFrom: new Date().addDays(1),
                    dateTo: (new Date()).addDays(1),
                    $change: function (obj) { return _this.setCSS(obj); },
                },
            }).Editable(orders.db.getSaveCfg(true)).Tooltip();
            var ordersForm = this.ordersForm.config().Labels(120).extend({
                gravity: 0.5,
                elements: [
                    $u.element("dateFrom").Label("Начало").AsDate(true).Require(),
                    $u.element("dateTo").Label("Окончание").AsDate(true).Require(),
                    $u.element("roomId").Label("Комната").AsSelect(rooms.db.namesUrl).Require(),
                    $u.element("promoId").AsSelect(promo.db.names(true, promo.PromoKind.Action)).Label("Промоакция"),
                    $u.element("totalOrder").Label("Сумма").Disable(),
                    $u.element("payDate").Label("Дата опл.").AsDate().Disable(),
                    $u.element("text").Label("Расчеты").AsHtmlLabel(100).Readonly(),
                    $u.element("errors").Label("Ошибки").AsHtmlLabel(100).Css("it-error").Readonly(),
                    {},
                ],
            });
            var ordersCfg = $u.rows(gridToolbar, $u.cols(ordersGrid, ordersForm).Scrollable());
            var view = $u.rows(bar, formCfg, $u.tabview()
                .Tab("Брони", ordersCfg)
                .Tab("История", this.messagesView.$config()));
            return view;
        };
        EditView.prototype.$init = function () {
            this.ordersForm.bind(this.ordersGrid);
            return { header: "Карточка абонемента", };
        };
        EditView.prototype.$reload = function (id) {
            try {
                this._Loading = true;
                _super.prototype.$reload.call(this, id);
                var url = abonements.db.getUrl(id);
                var vals = this.form.load(url);
                this.refreshGrid();
            }
            catch (err) {
                throw err;
            }
            finally {
                this._Loading = false;
                this.updateUI();
            }
            this.ordersForm.clear();
            this.calcTotals();
            this.messagesView.filter.abonement = id;
            this.messagesView.setDefaults({ abonementId: id });
            this.messagesView.refresh();
        };
        EditView.prototype.openEditor = function () {
            var item = this.ordersGrid.getSelectedItem();
            if (!item)
                return;
            this.editor.edit(item.id);
        };
        EditView.prototype.setCSS = function (obj) {
            if (!obj)
                return;
            orders.logic.getStateCss(obj);
            if (obj.errors)
                obj.$css = "it-error";
        };
        EditView.prototype.updateBase = function (baseid) {
            var baseType = null;
            if (baseid) {
                var basesCombo = this.form.elements.baseId;
                var bases_1 = basesCombo.getList();
                var base = bases_1.getItem(baseid);
                if (base)
                    baseType = base.type;
            }
            var eq = baseid ? equipments.db.names(baseid) : [];
            this.form.elements.equipments.define({ suggest: eq });
            var listRooms = baseid ? rooms.db.names(baseid) : [];
            this.form.elements.roomId.define({ suggest: listRooms });
            this.ordersForm.elements.roomId.define({ suggest: listRooms });
            this.form.setValuesEx({ baseType: baseType });
            this.updateUI();
        };
        EditView.prototype.updateUI = function () {
            if (this._Loading)
                return;
            var vals = this.form.values();
            var editable = abonements.logic.allowEdit(vals);
            var editableClient = editable && abonements.logic.allowEditClient(vals);
            this.form.enable(editable, "dateFrom");
            this.form.enable(editable, "dateTo");
            this.form.enable(editable, "baseId");
            this.form.enable(editable, "roomId");
            this.form.enable(editableClient, "clientId");
            this.ordersForm.enable(abonements.logic.allowOrderEdit(vals));
            this.buttons.save.visible(abonements.logic.allowOrderEdit(vals));
            this.buttons.create.visible(abonements.logic.allowOrderCreate(vals));
            this.buttons.createWizard.visible(abonements.logic.allowOrderCreate(vals));
            this.buttons.recalc.visible(abonements.logic.allowOrderRecalc(vals));
            this.buttons.reserv.visible(abonements.logic.allowOrderReserv(vals));
            this.buttons.paid.visible(abonements.logic.allowOrderPay(vals));
            this.ordersGrid.scheme({
                abonementId: vals.id,
                roomId: vals.roomId,
                baseId: vals.baseId,
                clientId: vals.clientId,
                discount: vals.clientDiscount,
                options: vals.options,
                dateFrom: '',
                dateTo: '',
            });
        };
        EditView.prototype.create = function () {
            var _this = this;
            if (!this.form.validate())
                return;
            var vals = this.form.values();
            var items = this.wizard.create(vals.dateFrom, vals.dateTo);
            if (!items)
                return;
            var rows = [];
            var grid = this.ordersGrid;
            items.forEach(function (item) {
                var row = {
                    dateFrom: item.dateFrom,
                    dateTo: item.dateTo,
                    baseId: vals.baseId,
                    roomId: vals.roomId,
                    clientId: vals.clientId,
                    payForfeit: true,
                    itemsJson: _this.eq2items(vals.equipments),
                    discount: vals.clientDiscount,
                    options: vals.options,
                    promoId: vals.promoId,
                };
                {
                    grid.add(row);
                    rows.push(row);
                }
            });
            setTimeout(function () {
                _this.calc(rows);
                _this.calcTotals();
                _this.save(false);
                webix.message("\u0421\u043E\u0437\u0434\u0430\u043D\u043E: ".concat(rows.length, " \u0431\u0440\u043E\u043D\u0435\u0439"));
            }, 2000);
        };
        EditView.prototype.delete = function () {
            if (!confirm("Удалить текущий абонемент и все связанные брони?"))
                return webix.message("Отменено удаление");
            if (abonements.db.archive(this.objectId)) {
                It.Web.historyBack();
                return webix.message("Бронь успешно удалена");
            }
        };
        EditView.prototype.clientUpdate = function (clientId) {
            if (!clientId)
                return;
            if (clientId.id)
                return;
            var client = clients.db.get(clientId);
            if (client.isBanned) {
                this.form.setValuesEx({ clientId: null });
                return It.UI.w.error("Клиент заблокирован!");
            }
            console.log('client update:', client);
            this.form.setValuesEx({ clientDiscount: client.discount, promo: client.promoCode, forfeit: client.forfeit });
            this.calcTotals();
        };
        EditView.prototype.updateOrder = function () {
            if (!this.ordersForm.validate())
                return;
            var vals = this.ordersForm.values();
            if (!vals.roomId)
                return;
            var res = this.calc([vals]);
            if (res) {
                return It.UI.error(res);
            }
            this.ordersForm.updateBindings();
            this.ordersGrid.save();
        };
        EditView.prototype.deleteOrders = function () {
            var _this = this;
            var items = this.ordersGrid.getSelectedItems();
            if (items.length == 0)
                return webix.message("Выделите брони для удаления");
            if (!confirm("Удалить безвозвратно выделенные брони?"))
                return webix.message("Удаление отменено");
            items.forEach(function (item) {
                if (abonements.logic.allowOrderDel(item))
                    _this.ordersGrid.removeRow(item.id);
                else
                    It.UI.w.error("Нельзя удалить бронь в статусе или нет прав на операцию");
            });
            this.calc([]);
            this.save(true);
            setTimeout(function (_) { return _this.refreshGrid(); }, 200);
        };
        EditView.prototype.eq2items = function (eq) {
            if (!eq)
                return undefined;
            var eqids = eq.split(',');
            var items = eqids.map(function (id) { return ({ eq: id, n: 1 }); });
            var jsitems = JSON.stringify(items);
            return jsitems;
        };
        EditView.prototype.calc = function (items) {
            var _this = this;
            var me = this;
            var errors = '';
            items.forEach(function (item) {
                var error = _this.calc_item(item);
                item.errors = error;
                errors += error;
            });
            me.calcTotals();
            return errors;
        };
        EditView.prototype.calc_item = function (item, update) {
            if (update === void 0) { update = true; }
            var me = this;
            var id = item.id;
            var errors = "";
            if (!abonements.logic.allowOrderRecalc(item))
                return It.UI.w.error("Недоступен пересчет для брони " + webix.i18n.dateFormatStr(item.dateFrom));
            if (typeof (item.id) != "string")
                id = null;
            var order = {
                id: id,
                roomId: item.roomId,
                dateFrom: item.dateFrom,
                dateTo: item.dateTo,
                itemsJson: item.itemsJson,
                options: item.options,
                clientId: item.clientId,
                promoId: item.promoId,
                check: true,
            };
            var res = orders.db.calc(order);
            if (res.errors) {
                item.$css = "it-error";
                item.errors = res.errors;
                errors += res.errors + '\n';
            }
            else if (res.isHold) {
            }
            else {
                item = webix.extend(item, res, true);
                item.totalSum = item.totalOrder;
                if (update)
                    me.ordersGrid.updateRow(item.id, item);
            }
            this.setCSS(res);
            return errors;
        };
        EditView.prototype.recalc = function (refresh) {
            if (refresh === void 0) { refresh = true; }
            var items = this.ordersGrid.getSelectedItems();
            this.calc(items);
            this.save(refresh);
        };
        EditView.prototype.calcTotals = function () {
            var sums = {}, totals = 0, n = 0;
            this.ordersGrid.forEach(function (row) {
                if (!row.totalSum)
                    return;
                if (row.status == orders.OrderStatus.Cancel)
                    return;
                var s = parseInt(row.totalSum);
                if (!sums[row.status])
                    sums[row.status] = s;
                else
                    sums[row.status] += s;
                totals += s;
                n++;
            });
            var discount = this.form.elements.discount.getValue();
            var forfeit = this.form.elements.forfeit.getValue();
            totals += forfeit;
            var totalReserv = Math.round((0 + sums[orders.OrderStatus.Reserv]) * (100 - discount) / 100);
            var totalPaid = Math.round((0 + sums[orders.OrderStatus.Closed]) * (100 - discount) / 100);
            this.form.setValuesEx({ totalReserv: totalReserv, totalPaid: totalPaid, totals: totals });
        };
        EditView.prototype.action2status = function (action) {
            switch (action) {
                case orders.OrderAction.New:
                    return orders.OrderStatus.Unknow;
                case orders.OrderAction.Reserv:
                    return orders.OrderStatus.Reserv;
                case orders.OrderAction.Paid:
                    return orders.OrderStatus.Reserv;
                case orders.OrderAction.CancelNormal:
                    return orders.OrderStatus.Cancel;
                case orders.OrderAction.CancelForfeitAsk:
                    return orders.OrderStatus.Cancel;
                case orders.OrderAction.CancelForfeitConfirm:
                    return orders.OrderStatus.Cancel;
                default:
                    return orders.OrderStatus.Reserv;
            }
        };
        EditView.prototype.doAction = function (action, text) {
            if (!this.form.validate())
                return;
            var items = this.ordersGrid.getSelectedItems();
            if (items.length == 0)
                return webix.message("Не выделено ни одной брони");
            var editing = false;
            items.forEach(function (item) {
                if (!item.id || typeof item.id != "string")
                    editing = true;
            });
            if (editing)
                return It.UI.w.error("Сначала сохраните данные");
            if (!confirm(text))
                return;
            var status = this.action2status(action);
            items.forEach(function (item) {
                if (action == orders.OrderAction.Paid && item.status == orders.OrderStatus.Cancel)
                    return;
                var res = orders.db.setStatus(item.id, action);
            });
            this.save(true);
            this.calcTotals();
        };
        EditView.prototype.save = function (refresh) {
            if (!this.form.validate())
                return;
            this.form.save(abonements.db.saveUrl(this.objectId), false);
            if (refresh) {
                this.refreshGrid();
                this.calcTotals();
            }
            else {
                this.ordersGrid.refresh();
            }
            webix.message("Данные сохранены на сервере");
        };
        EditView.prototype.refreshGrid = function () {
            var _this = this;
            var list = orders.db.getAbonementItems(this.objectId);
            list.forEach(function (obj) { return _this.setCSS(obj); });
            this.ordersGrid.refresh(list);
        };
        return EditView;
    }($u.View));
    abonements.EditView = EditView;
})(abonements || (abonements = {}));
var abonements;
(function (abonements) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template($u.getViewLink("abonements")),
                    $u.column("client").Header("Клиент", 200).Sort().Filter().Template(clients.getClientColumnTemplate()),
                    $u.column("dateFrom").Header("Начало").AsDate(),
                    $u.column("dateTo").Header("Окончание").AsDate(),
                    $u.column("baseId").Header("База").AsSelect(bases.db.names(true)).Filter(),
                    $u.column("totalSum").Header("Стоимость", 70).AsInt().Footer({ content: "summColumn" }),
                    $u.column("reserv").Header("Резерв", 70).AsInt().Footer({ content: "summColumn" }),
                    $u.column("payments").Header("Оплачено", 70).AsInt().Footer({ content: "summColumn" }),
                    $u.column("description").Header("Комментарии", -1).Filter(),
                ],
                scheme: {
                    client: "",
                    dateFrom: new Date().addDays(1),
                    dateTo: (new Date()).addDays(31),
                },
            }).Editable(abonements.db.getSaveCfg(true)).Footer();
            var filterCfg = this.filterForm.config().extend({
                cols: [
                    $u.element("dateFrom").Label("С", null, 30).Size(140).AsDate(),
                    $u.element("dateTo").Label("По", null, 40).Size(150).AsDate(),
                    $u.element("pays").Label("Оплата", null, 60).AsSelect(orders.payStatuses).Size(200),
                ]
            });
            var view = $u.rows($u.panelbar(this.grid.btnAdd().Hidden(!abonements.logic.allowOrderCreate(null)), filterCfg, this.grid.btnRefresh(function () { return _this.refresh(); }), {}), gridCfg);
            return view;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d0 = new Date();
            var n = 1 - d0.getDate();
            var d = d0.addDays(n);
            this.filterForm.setValuesEx({ dateFrom: d, dateTo: d.addMonth(1).addDays(-1) });
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.refresh();
        };
        GridView.prototype.refresh = function () {
            if (!this.filterForm.validate("Ошибки в параметрах"))
                return;
            var filter = this.filterForm.values();
            var list = abonements.db.list(filter);
            this.grid.refresh(list);
        };
        return GridView;
    }($u.View));
    abonements.GridView = GridView;
})(abonements || (abonements = {}));
var abonements;
(function (abonements) {
    var acc = auth.oper;
    var statuses = orders.OrderStatus;
    var fullAccess = function () { return system.context.allow(acc.orderFullAccess); };
    var Logic = (function () {
        function Logic() {
            this.allowEdit = function (x) { return fullAccess() || system.context.allow(acc.abonementEdit); };
            this.allowDelete = function () { return fullAccess() || system.context.allow(acc.abonementDel); };
            this.allowGroup = function (x) { return true; };
            this.allowEditClient = function (x) { return fullAccess() || !x.clientId; };
            this.allowForfeit = function (x) { return x.forfeit && x.forfeit != "0"; };
            this.allowOrderCreate = function (x) { return fullAccess() || system.context.allow(acc.abonementOrderCreate); };
            this.allowOrderEdit = function (x) { return fullAccess() || system.context.allow(acc.abonementOrderEdit); };
            this.allowOrderRecalc = function (x) { return fullAccess() || system.context.allow(acc.abonementOrderCalc) && (!x.status || !x.isHold); };
            this.allowOrderReserv = function (x) { return fullAccess() ||
                system.context.allow(acc.orderFullAccess) ||
                system.context.allow(acc.orderReserv) && (!x.status || x.status == statuses.Unknow || x.status == statuses.Cancel); };
            this.allowOrderPay = function (x) { return fullAccess() || system.context.allow(acc.abonementOrderPay); };
            this.allowOrderDel = function (x) { return fullAccess() || x.status == statuses.Unknow; };
        }
        return Logic;
    }());
    abonements.logic = new Logic();
})(abonements || (abonements = {}));
var abonements;
(function (abonements) {
    abonements.create = {
        grid: function () { return new abonements.GridView(); },
        edit: function () { return new abonements.EditView(); },
    };
    var AbonementsSource = (function (_super) {
        __extends(AbonementsSource, _super);
        function AbonementsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url("list");
            return _this;
        }
        return AbonementsSource;
    }(app.AppDataSource));
    abonements.db = new AbonementsSource("abonements");
})(abonements || (abonements = {}));
var spheres;
(function (spheres) {
    var ListView = (function (_super) {
        __extends(ListView, _super);
        function ListView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.list = new $u.RefList();
            _this.form = new spheres.EditForm();
            return _this;
        }
        ListView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var list = this.list.config().extend({
                template: 'http->' + It.Web.WebSource.base + '/html/group-spheres.html',
                type: {
                    href: "#!",
                    height: "auto",
                },
                scheme: {
                    id: -1,
                    name: "",
                },
            }).Editable(spheres.db.getSaveCfg(true));
            var view = $u.rows($u.toolbar(this.list.btnAdd(undefined, 0), this.list.btnDel(), this.list.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.button("Сохранить").Click(function () { return _this.form.form.updateBindings(); })), $u.cols(list, this.form.config().Size(350)));
            return view;
        };
        ListView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.form.bind(this.list);
        };
        ListView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        ListView.prototype.refresh = function () {
            var rows = spheres.db.list();
            this.list.refresh(rows);
        };
        return ListView;
    }($u.View));
    spheres.ListView = ListView;
})(spheres || (spheres = {}));
var spheres;
(function (spheres) {
    var EditForm = (function () {
        function EditForm() {
            this.form = new $u.RefForm();
        }
        EditForm.prototype.config = function () {
            var _this = this;
            var form = this.form.config().extend({
                elements: [
                    $u.element("name").Label("Сфера деятельности"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    $u.element("index").Label("Индекс").AsInt(),
                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    $u.uploader("api/core/upload", function (x, y, z) { return _this.setImage(y); }).extend({
                        value: "Загрузить иконку",
                        formData: {
                            prefix: 'spheres',
                        },
                    }),
                    $u.element("icon").AsTemplate(function (x) { return ('res/' + x).img({ height: '50px', width: '50px' }); }),
                    $u.element("limitM").Label("Срок, мес").AsInt(),
                    $u.element("limitD").Label("Срок, дн").AsInt(),
                    $u.element("values").Label("Опции", "top").AsMultiSelect(groups.db.names(groups.GroupType.OrderOption)),
                    $u.element("default").Label("Опция по умолч", "top").AsSelect(groups.db.names(groups.GroupType.OrderOption)),
                    $u.element("features").Label("Параметры сферы", "top").AsMultiSelect(groups.db.features()).Tooltip("Выберите параметры, соответствующие всем комнатам сферы"),
                    $u.element("kind").Label("Тип сферы").AsSelect(spheres.kinds),
                    {},
                ]
            });
            return form;
        };
        EditForm.prototype.setImage = function (img) {
            this.form.elements.icon.setValues(img.path);
        };
        return EditForm;
    }());
    spheres.EditForm = EditForm;
})(spheres || (spheres = {}));
var spheres;
(function (spheres) {
    spheres.create = {
        list: function () { return new spheres.ListView(); },
        edit: function () { return new spheres.EditForm(); },
    };
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.reindex = function (start, ids) { return _this.post("reindex", { start: start, ids: ids }); };
            return _this;
        }
        return DataSource;
    }(lists.DataSource));
    spheres.db = new DataSource("spheres");
    var SphereKind;
    (function (SphereKind) {
        SphereKind[SphereKind["Usual"] = 1] = "Usual";
        SphereKind[SphereKind["Teachers"] = 2] = "Teachers";
    })(SphereKind = spheres.SphereKind || (spheres.SphereKind = {}));
    spheres.kinds = [
        { id: SphereKind.Usual, value: 'Обычная' },
        { id: SphereKind.Teachers, value: 'Преподаватели' },
    ];
})(spheres || (spheres = {}));
var bases;
(function (bases) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.camerasGrid = new $u.RefGrid();
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var w = 100;
            var camerasGridCfg = this.camerasGrid.config().extend({
                height: 200,
                columns: [
                    $u.column("name").Header("Название", 200).Edit(),
                    $u.column("value").Header("Ссылка", -1).Edit(),
                ],
                scheme: {
                    name: "без имени",
                },
            }).Editable(resources.db.getSaveCfg());
            var hhelp = "Укажите часы работы базы по будням и выходным дням в формате 0-24. Например: «0-6,12-24» (означает что с 0 до 6 проходят ночные репетиции, с 6 до 12 объект не работает, далее объект работает с 12 утра до 12 вечера)";
            var view = this.form.config().extend({
                elementsConfig: {
                    labelWidth: 150,
                },
                elements: [
                    $u.cols($u.button("Сохранить").Click(function () { return _this.save(); }), {}),
                    $u.element("sphereId").Label("Сфера").AsSelect(spheres.db.names()).Require().Tooltip("Выберите сферу оказания услуг вашего объекта"),
                    $u.element("name").Label("Название").Require().Tooltip("Введите название объекта оказания услуг для потенциальных клиентов"),
                    $u.element("description").Label("Описание").AsTextArea(100).Require().Tooltip("Введите описание объекта оказания услуг. Описание транслируется в приложение и отображается в каждой комнате. Отразите в этом поле все особенности и сильные стороны вашего объекта, чтобы клиент выбрав одну из ваших комнат решил забронировать именно ее."),
                    $u.element("rules").Label("Правила").AsTextArea(100).Tooltip("Введите правила объекта оказания услуг"),
                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)).Require().Tooltip("Введите или выберите ближайший населенный пункт, в котором расположен объект оказания услуг"),
                    $u.element("address").Label("Адрес").AsTextArea(100).Require().Tooltip(" Введите точный адрес объекта без указания города"),
                    $u.cols($u.rows($u.element("phones").Label("Телефоны").Require().Tooltip("Укажите телефон, который будет использоваться для связи с объектом по вопросам бронирования"), $u.element("email").Label("e-mail").Require().Tooltip("Введите e-mail, который будет использоваться для уведомлений о новых бронированиях"), $u.element("direction").Label("Как пройти").AsTextArea(100).Require().Tooltip("Введите текстовое описание маршрута до вашего объекта от ближайшей станции метро или остановки общественного транспорта")), $u.rows($u.uploader("api/core/upload-image", function (x, img, z) { return _this.form.elements.logo.setValues(img.path); }).extend({
                        value: "Загрузить логотип",
                        formData: {
                            folder: 'bases',
                        },
                    }), $u.element("logo").AsTemplate(function (x) { return ('res/' + x).img({ height: '150px', width: '150px' }); })).Size(170)),
                    $u.cols($u.element("gpsLat").Label("GPS Latitude").Require().Tooltip("Укажите координаты входа на базу. Удобней всего скопировать их из Яндекс карт"), $u.element("workTime").Label("Часы (раб.дни)").Tooltip("Часы работы, пример: 09-18").Require().Tooltip(hhelp)),
                    $u.cols($u.element("gpsLong").Label("GPS longitude").extend({ rule: webix.rules.isNumber }).Require().Tooltip("Укажите координаты входа на базу. Удобней всего скопировать их из Яндекс карт"), $u.element("weekendTime").Label("Часы (вых.дни)").Tooltip("Часы работы, пример: 08-24").Require().Tooltip(hhelp)),
                    $u.element("metro").Label("Метро").Require().Tooltip("Укажите ближайшую или ближайшие станции метро через запятую. Если в городе нет метро, можно использовать ближайшую остановку общественного транспорта"),
                    $u.element("videoUrl").Label("Ссылка на маршрут").Require().Tooltip("Вставьте ссылку на ролик, изображение или описание как пройти. Если отсутствует можно использовать ссылку на раздел 'Контакты' вашего сайта, страницы в соц. сети или контрагента"),
                    $u.element("channelIds").Label("Способы оплаты").AsMultiSelect(paychannels.db.names()),
                    $u.cols($u.element("isRequest").Label("По заявке", null, 70).AsCheckbox().Size(120), $u.element("request").Label("Описание заявки").AsTextArea(100)),
                    $u.element("maxPointsPcPay").Label("Макс.% оплаты баллами ").AsInt(),
                    $u.element("isArchive").Label("Архив").AsCheckbox().Tooltip("Используется для архивации базы"),
                    $u.cols($u.button("Сохранить").Click(function () { return _this.save(); }), {}),
                    $u.toolbar($u.label("Список камер на базе").Size(-1), this.camerasGrid.btnAdd(), this.camerasGrid.btnDel()),
                    camerasGridCfg,
                ],
                rules: {}
            });
            return view;
        };
        EditView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var vals = this.form.load(bases.db.getUrl(id));
            var cameras = resources.db.getItems(resources.ResourceKind.BaseCamera, id);
            this.camerasGrid.refresh(cameras);
            this.camerasGrid.scheme({
                name: "камера",
                kind: resources.ResourceKind.BaseCamera,
                objectId: id,
            });
        };
        EditView.prototype.save = function () {
            if (!this.form.validate())
                return;
            this.form.save(bases.db.saveUrl(this.objectId), false);
            this.camerasGrid.save();
            webix.message("Данные сохранены на сервере");
        };
        return EditView;
    }($u.View));
    bases.EditView = EditView;
})(bases || (bases = {}));
var bases;
(function (bases) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("sphereId").Header("Сфера").AsSelect(spheres.db.names()).Filter().Edit(),
                    $u.column("name").Header("Название", 200).Sort().Filter().Template($u.getViewLink("bases", "#name#")),
                    $u.column("description").Header("Описание", -1).Filter(),
                    $u.column("workTime").Header("Раб.Часы", 50),
                    $u.column("weekendTime").Header("Вых.Часы", 50),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    name: "без имени",
                },
            }).Editable(bases.db.getSaveCfg(true));
            var view = {
                rows: [
                    $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}),
                    gridCfg,
                ],
            };
            return view;
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.refresh();
        };
        GridView.prototype.refresh = function () {
            var items = bases.db.list();
            this.grid.refresh(items);
        };
        return GridView;
    }($u.View));
    bases.GridView = GridView;
})(bases || (bases = {}));
var bases;
(function (bases) {
    bases.create = {
        grid: function () { return new bases.GridView(); },
        edit: function () { return new bases.EditView(); },
    };
    var BasesSource = (function (_super) {
        __extends(BasesSource, _super);
        function BasesSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.namesUrl = _this.url("names");
            _this.names = function (check) { return _this.loadList("names", { check: check }); };
            _this.getFull = function (type, date, hours, base) {
                var list = _this.load("full", { base: base, type: type, from: date, hours: hours });
                return list;
            };
            return _this;
        }
        return BasesSource;
    }(app.AppDataSource));
    bases.db = new BasesSource("bases");
})(bases || (bases = {}));
var equipments;
(function (equipments) {
    var BalanceView = (function (_super) {
        __extends(BalanceView, _super);
        function BalanceView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        BalanceView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var w = 35;
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("n").Header("Кол").Sort().AsNumber().Edit(),
                    $u.column("name").Header("Название", -1).Sort(),
                    $u.column("price").Header("Цена", 45).AsInt().Sort(),
                    $u.column("count").Header("Всего", w).AsInt().Sort(),
                    $u.column("used").Header("Исп", w).AsInt().Sort(),
                    $u.column("balance").Header("Ост", w).AsInt().Sort(),
                ],
            }).Editable().OnEdit(function (v, r) { return _this.changed(v, r); });
            return gridCfg;
        };
        BalanceView.prototype.refresh = function (list) {
            this.grid.refresh(list);
        };
        BalanceView.prototype.enable = function (enabled) {
            if (enabled === void 0) { enabled = true; }
            this.grid.enable(enabled);
        };
        BalanceView.prototype.changed = function (v, r) {
            var item = this.grid.getItem(r.row);
            if (item.n > item.balance) {
                webix.message("Превышен лимит позиции");
                item.n = item.balance;
            }
            this.onChange(v, r);
        };
        return BalanceView;
    }($u.View));
    equipments.BalanceView = BalanceView;
})(equipments || (equipments = {}));
var equipments;
(function (equipments) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.form = new equipments.EditForm();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                tooltip: true,
                columns: [
                    $u.column("groupId").AsSelect(groups.db.names(groups.GroupType.Equipment)).Header("Тип", 90).Sort().Filter().Tooltip("Выберите тип позиции, для дополнительных услуг используйте тип «Другое»"),
                    $u.column("name").Header("Название", -1).Sort().Filter().Tooltip("Введите название позиции в формате «Электрогитара Gibson SG»"),
                    $u.column("Kind").Header("Тип", 100).AsSelect(equipments.eqKinds).Filter().Edit(),
                    $u.column("price").Header("Цена").AsInt().Sort().Filter().Tooltip("Укажите цену за позицию.<br> Если оборудование предоставляется бесплатно введите «0»"),
                    $u.column("count").Header("Кол").AsInt().Sort().Filter().Tooltip("Укажите фактическое количество для позиции одного наименования на объекте.<br>Это поможет избежать бронирования одного и того же наименования несколькими клиентами"),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 150).Sort().Filter().Tooltip(" Выберите объект на котором предоставляется выбранное наименование позиции"),
                    $u.column("destKind").Header("Назначение", 100).AsSelect(equipments.destKinds).Filter().Edit(),
                    $u.column("allowMobile").Header("Моб").AsCheckboxReadly().Sort().Tooltip("Используйте галочку «моб» для публикации или удаления выбранной позиции в мобильном приложении"),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                },
                save: equipments.db.getSaveCfg(true),
            });
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.button("Сохранить").Click(function () { return _this.form.form.updateBindings(); })), $u.cols(grid, this.form.config().Size(350)));
            return view;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.form.bind(this.grid);
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        GridView.prototype.refresh = function () {
            var data = equipments.db.list();
            this.grid.refresh(data);
        };
        return GridView;
    }($u.View));
    equipments.GridView = GridView;
})(equipments || (equipments = {}));
var equipments;
(function (equipments) {
    var EditForm = (function () {
        function EditForm() {
            this.form = new $u.RefForm();
        }
        EditForm.prototype.config = function () {
            var _this = this;
            var form = this.form.config().extend({
                elements: [
                    $u.element("groupId").Label("Тип").AsSelect(groups.db.names(groups.GroupType.Equipment)).Tooltip("Выберите тип позиции, для дополнительных услуг используйте тип «Другое»"),
                    $u.element("name").Label("Название").Tooltip("Введите название позиции в формате «Электрогитара Gibson SG»"),
                    $u.element("kind").Label("Тип").AsSelect(equipments.eqKinds),
                    $u.element("description").Label("Описание").AsTextArea(100, "top").Tooltip("Введите описание позиции или его особенности. Клиентам в приложении эта информация не отображается.<br> Описание используется для вашего удобства, например, когда меняли струны на гитаре, или привезли новую тарелку"),
                    $u.uploader("api/core/upload-image", function (x, y, z) { return _this.setImage(y); }).extend({
                        value: "Загрузить фото",
                        accept: "image/*",
                        datatype: "json",
                        formData: {
                            folder: 'equipments',
                        },
                    }).Css('it-crop'),
                    $u.element("photoUrl").AsTemplate(function (x) { return ('res/' + x).img({ height: '150px', width: '350px' }); }),
                    $u.element("price").Label("Цена").AsInt().Tooltip("Укажите цену за позицию.<br> Если оборудование предоставляется бесплатно введите «0»"),
                    $u.element("count").Label("Кол").AsInt().Tooltip("Укажите фактическое количество для позиции одного наименования на объекте.<br>Это поможет избежать бронирования одного и того же наименования несколькими клиентами"),
                    $u.element("baseId").Label("База").AsSelect(bases.db.names(true)).Tooltip(" Выберите объект на котором предоставляется выбранное наименование позиции"),
                    $u.element("roomIds").Label("Комнаты").AsMultiSelect(rooms.db.names(null, true)).Tooltip(" Выберите объект на котором предоставляется выбранное наименование позиции"),
                    $u.element("destKind").Label("Назначение").AsSelect(equipments.destKinds),
                    $u.element("kf").Label("Кф проп.").AsInt().Tooltip("Кф. пропорции. Если 0, то стоимость оборуд. фиксирована, иначе = Цена * Кол-во часов / Кф"),
                    $u.element("allowMobile").Label("Моб").AsCheckbox().Tooltip("Используйте галочку «моб» для публикации или удаления выбранной позиции в мобильном приложении"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    {},
                ]
            });
            return form;
        };
        EditForm.prototype.setImage = function (img) {
            this.form.elements.photoUrl.setValues(img.path);
        };
        return EditForm;
    }());
    equipments.EditForm = EditForm;
})(equipments || (equipments = {}));
var order_rules;
(function (order_rules) {
    order_rules.create = {
        grid: function () { return new order_rules.GridView(); },
    };
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.reindex = function (start, ids) { return _this.post("reindex", { start: start, ids: ids }); };
            return _this;
        }
        DataSource.prototype.canCancelBase = function (baseid, dateCreate, dateFrom) {
            return this.load("can-cancel-base", {
                base: baseid,
                dateCreate: dateCreate,
                dateFrom: dateFrom,
            });
        };
        return DataSource;
    }(lists.DataSource));
    order_rules.db = new DataSource("orderrules");
    var OrderRuleIfKind;
    (function (OrderRuleIfKind) {
        OrderRuleIfKind[OrderRuleIfKind["SameDate"] = 1] = "SameDate";
        OrderRuleIfKind[OrderRuleIfKind["More"] = 2] = "More";
        OrderRuleIfKind[OrderRuleIfKind["Less"] = 3] = "Less";
    })(OrderRuleIfKind = order_rules.OrderRuleIfKind || (order_rules.OrderRuleIfKind = {}));
    var OrderRuleThenKind;
    (function (OrderRuleThenKind) {
        OrderRuleThenKind[OrderRuleThenKind["Always"] = 1] = "Always";
        OrderRuleThenKind[OrderRuleThenKind["More"] = 2] = "More";
        OrderRuleThenKind[OrderRuleThenKind["Less"] = 3] = "Less";
    })(OrderRuleThenKind = order_rules.OrderRuleThenKind || (order_rules.OrderRuleThenKind = {}));
    order_rules.ifkinds = [
        { id: OrderRuleIfKind.SameDate, value: 'День в день' },
        { id: OrderRuleIfKind.Less, value: 'Менее чем за' },
        { id: OrderRuleIfKind.More, value: 'Более чем за' },
    ];
    order_rules.thenkinds = [
        { id: OrderRuleThenKind.Always, value: 'Всегда' },
        { id: OrderRuleThenKind.Less, value: 'В течение' },
        { id: OrderRuleThenKind.More, value: 'Не позднее чем за' },
    ];
})(order_rules || (order_rules = {}));
var equipments;
(function (equipments) {
    var TotalsView = (function (_super) {
        __extends(TotalsView, _super);
        function TotalsView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.grid = new $u.RefGrid();
            return _this;
        }
        TotalsView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var formCfg = {
                view: "form",
                id: this.form.id,
                borderless: true,
                cols: [
                    $u.element("base").Label("База", null, 50).Size(400).AsSelect(bases.db.names(true)),
                    $u.icon("refresh").Click(function () { return _this.refresh(); }).Tooltip("Пересчитать данные и обновить отчет"),
                    {},
                ]
            };
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("groupId").AsSelect(groups.db.names(groups.GroupType.Equipment)).Header("Тип", 150).Sort(),
                    $u.column("name").Header("Название", -1).Sort(),
                    $u.column("price").Header("Цена").AsInt().Sort(),
                    $u.column("count").Header("Всего").AsInt().Sort(),
                    $u.column("used").Header("Использ").AsInt().Sort(),
                    $u.column("balance").Header("Остаток").AsInt().Sort(),
                ],
            });
            var view = {
                rows: [
                    formCfg,
                    gridCfg,
                ],
            };
            return view;
        };
        TotalsView.prototype.refresh = function () {
            var args = this.form.values();
            var list = equipments.db.totals(args.base);
            this.grid.refresh(list);
            webix.message("Отчет обновлен");
        };
        return TotalsView;
    }($u.View));
    equipments.TotalsView = TotalsView;
})(equipments || (equipments = {}));
var equipments;
(function (equipments) {
    equipments.create = {
        grid: function () { return new equipments.GridView(); },
        totals: function () { return new equipments.TotalsView(); },
    };
    var DestKind;
    (function (DestKind) {
        DestKind[DestKind["Addition"] = 1] = "Addition";
        DestKind[DestKind["Package"] = 2] = "Package";
    })(DestKind = equipments.DestKind || (equipments.DestKind = {}));
    equipments.destKinds = [
        { id: DestKind.Addition, value: "Дополнительно к заказу" },
        { id: DestKind.Package, value: "Пакетное предложение" },
    ];
    var EqKind;
    (function (EqKind) {
        EqKind[EqKind["None"] = 0] = "None";
        EqKind[EqKind["Other"] = 1] = "Other";
        EqKind[EqKind["Equipment"] = 2] = "Equipment";
        EqKind[EqKind["Service"] = 3] = "Service";
    })(EqKind = equipments.EqKind || (equipments.EqKind = {}));
    equipments.eqKinds = [
        { id: EqKind.Equipment, value: "Оборудование" },
        { id: EqKind.Service, value: "Услуга" },
        { id: EqKind.Other, value: "Другое" },
    ];
    var EquipmentsSource = (function (_super) {
        __extends(EquipmentsSource, _super);
        function EquipmentsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.namesUrl = _this.url("names");
            _this.names = function (baseid) { return _this.loadList('names', { base: baseid }); };
            _this.typesUrl = _this.url("types");
            _this.listUrl = _this.url("list");
            return _this;
        }
        EquipmentsSource.prototype.balance = function (baseid, orderid, dfrom, dto) {
            var list = this.load("balance", { base: baseid, order: orderid, dfrom: dfrom, dto: dto, all: true, empty: false, }, false);
            return list;
        };
        EquipmentsSource.prototype.totals = function (baseId) {
            var list = this.load("totals", { base: baseId });
            return list;
        };
        return EquipmentsSource;
    }(app.AppDataSource));
    equipments.db = new EquipmentsSource("equipments");
})(equipments || (equipments = {}));
var orders;
(function (orders) {
    var MODE = {
        Day: "rooms",
        Week: "weekrooms",
        Month: "month"
    };
    var _webix = webix;
    function loadScheduler() {
        var path = It.Web.WebSource.base + "/";
        It.Web.loadCSS("lib/scheduler/dhtmlxscheduler.css");
        It.Web.loadJS(path + "lib/scheduler/dhtmlxscheduler.js");
        It.Web.loadJS(path + "lib/scheduler/dhtmlxscheduler_units.js");
        It.Web.loadJS(path + "lib/scheduler/dhtmlxscheduler_limit.js");
        It.Web.loadJS(path + "lib/scheduler/dhtmlxscheduler_collision.js");
        It.Web.loadJS(path + "lib/webix/scheduler.js");
        It.Web.loadJS(path + "lib/scheduler/locale_ru.js");
    }
    var CalendarView = (function (_super) {
        __extends(CalendarView, _super);
        function CalendarView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.scheduler = new $u.RefUI();
            _this.date = new $u.RefUI();
            _this.sections = rooms.db.units();
            _this.timerid = setInterval(function () { return _this.checkUpdates(); }, 60 * 1000);
            _this.baseList = new $u.RefCombo();
            _this.currentMode = MODE.Day;
            _this.itemView = new orders.ItemView(_this);
            _this.loaded = false;
            return _this;
        }
        CalendarView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            _webix.require.disabled = true;
            loadScheduler();
            var me = this;
            var listbases = bases.db.names(true)
                .filter(function (b) { return b.sphere; })
                .sort(function (b1, b2) { return b1.sphere.localeCompare(b2.sphere); })
                .map(function (b) { return ({
                id: b.id,
                value: "".concat(b.sphere, ": ").concat(b.value),
                sphereId: b.sphereId,
                weekendHours: b.weekendHours,
                workHours: b.workHours
            }); });
            var editor = new orders.OrderEditor(function () { return me.refresh(); });
            var schedulerViewCfg = {
                view: "dhx-scheduler",
                id: this.scheduler.id,
                mode: MODE.Day,
                tooltip: {
                    template: "TTTTTTTT <span class='webix_strong'>Rating: </span> #rating#<br/>< span class='webix_strong' > Votes: </span> #votes#"
                },
                init: function () {
                    var sch = this._scheduler;
                    me.dhtmlScheduler = sch;
                    sch.config.xml_date = "%c";
                    sch.config.load_date = "%c";
                    sch.config.first_hour = 0;
                    sch.config.last_hour = 24.2;
                    sch.config.multi_day = false;
                    sch.config.details_on_create = false;
                    sch.config.edit_on_create = false;
                    sch.config.time_step = 60;
                    sch.config.drag_move = true;
                    sch.config.drag_resize = true;
                    sch.config.dblclick_create = false;
                    sch.config.details_on_dblclick = true;
                    sch.config.readonly = !orders.logic.allowEditCalendar();
                    sch.xy.scale_height = 40;
                    sch.locale.labels.confirm_deleting = "";
                    sch.config.start_on_monday = true;
                    sch.config.collision_limit = 1;
                    var unitsq = sch.createUnitsView({
                        name: MODE.Week,
                        property: "roomId",
                        list: sch.serverList("units1", []),
                        days: 7,
                    });
                    var units2 = sch.createUnitsView({
                        name: MODE.Day,
                        property: "roomId",
                        list: sch.serverList("units2", []),
                        days: 1,
                    });
                    sch.config.icons_select = [
                        "icon_details",
                        "icon_delete"
                    ];
                    var dformat = webix.Date.dateToStr("%d %M, %l", false);
                    var func_date_format = function (date) {
                        return dformat(date);
                    };
                    sch.templates.day_date = func_date_format;
                    sch.templates.weekrooms_second_scale_date = func_date_format;
                    sch.templates.event_class = orders.logic.getEventCss;
                    sch.templates.event_header = function (start, end, ev) {
                        return sch.templates.event_date(start) + "-" + sch.templates.event_date(end);
                    };
                    sch.templates.event_text = orders.logic.getEventTemplate;
                    sch.templates.month_scale_date = webix.Date.dateToStr("%l", false);
                    ;
                    sch.templates.event_bar_date = function (d) { return "aaaaaaa"; };
                    sch.templates.month_text = function (d) { return "bbbbb"; };
                    sch.templates.event_day = function (d) { return "cccc"; };
                    sch.templates.event_bar_day = function (d) { return "ddddd"; };
                    function add(ev) {
                        ev.text = "";
                        var res = orders.db.save({ id: 0, dateFrom: ev.start_date, dateTo: ev.end_date, clientComment: ev.text, roomId: ev.roomId, payForfeit: true });
                        return res.id;
                    }
                    ;
                    function isNew(id) {
                        return (typeof (id) != "string");
                    }
                    sch.attachEvent("onBeforeViewChange", function (old_mode, old_date, mode, date) {
                        if (date == old_date)
                            return;
                        me.currentDate = date;
                        me.refresh();
                        return true;
                    });
                    sch.attachEvent("onBeforeEventCreated", function (e) {
                        var allow = orders.logic.allowCreate();
                        return allow;
                    });
                    sch.attachEvent("onEventAdded", function (id, ev, x) {
                        var base = me.baseList.getItem();
                        var allow = orders.logic.allowCreate();
                        if (allow && rooms.db.allowTime(ev.start_date, ev.end_date, ev.roomId, base.id, base.domainId))
                            sch.showLightbox(ev.id);
                        else
                            sch.deleteEvent(id);
                    });
                    sch.attachEvent("onBeforeEventChanged", function (ev, obj, is_new) {
                        if (is_new || ev.status === 0)
                            return true;
                        It.UI.w.error("Нельзя передвигать бронь со статусом");
                        return false;
                    });
                    sch.attachEvent("onEventChanged", function (id, ev) {
                        if (isNew(ev.id))
                            return ev;
                        orders.db.save({ id: ev.id, dateFrom: ev.start_date, dateTo: ev.end_date, clientComment: ev.text, roomId: ev.roomId, });
                        return ev;
                    });
                    sch.attachEvent("onBeforeEventDelete", function (id, ev) {
                        if (isNew(id))
                            return true;
                        if (!orders.logic.allowDelete(ev)) {
                            alert("Нельзя удалять бронь");
                            return false;
                        }
                        var can = confirm("Удалить бронь?");
                        return can;
                    });
                    sch.attachEvent("onEventDeleted", function (id, ev) {
                        if (!isNew(id))
                            orders.db.archive(id);
                    });
                    var popup = webix.ui({
                        view: "popup",
                        top: 10,
                        left: 300,
                        body: me.itemView.$config(),
                    });
                    sch.attachEvent("onClick", function (id, e) {
                        popup.show({ x: e.clientX + 10, y: e.clientY });
                        me.itemView.$reload(id);
                        return false;
                    });
                    me.itemView.OnEdit.on(function (id) { return editor.edit(id); });
                    me.itemView.OnDelete.on(function (id) { return sch.deleteEvent(id); });
                    sch.showLightbox = function (id, ev1) {
                        var ev = this.getEvent(id);
                        if (!orders.logic.allowLightboxEdit(ev))
                            return It.UI.w.error("Данную бронь запрещено редактировать");
                        if (isNew(id))
                            id = add(ev);
                        if (popup.isVisible())
                            popup.hide();
                        editor.edit(id);
                    };
                },
                ready: function () {
                    me.refresh();
                    var el = document.getElementsByClassName("dhx_cal_today_button");
                    var item = el.item(0);
                    item.innerHTML = scheduler.locale.labels.dhx_cal_today_button;
                }
            };
            var view = $u.rows($u.panelbar($u.tabs({ id: MODE.Day, value: "День", width: 60 }, { id: MODE.Week, value: "Неделя", width: 60 }, { id: MODE.Month, value: "Месяц", width: 70 }).Size(300).OnChange(function (id) { return _this.setMode(id); }), $u.element("date").Label("На дату", null, 80).AsDate().Ref(this.date).OnChange(function (d) { return _this.dateChange(d); }).Value(new Date()).Size(200), $u.element("base").Label("База", null, 50).AsSelect(listbases, "richselect").Ref(this.baseList).OnChange(function (id) { return _this.refresh(); }), $u.icon("arrow-left").Tooltip("Предыдущая база").Click(function () { return _this.baseList.skipSelection(-1); }), $u.icon("arrow-right").Tooltip("Следующая база").Click(function () { return _this.baseList.skipSelection(1); }), $u.icon("refresh").Tooltip("Перезачитать данные с сервера").Click(function () { return _this.refresh(); }), $u.icon("trash").Tooltip("Удалить брони без статуса").Click(function () { return _this.clearOrders(); })), schedulerViewCfg);
            return view;
        };
        CalendarView.prototype.$init = function () {
            this.baseList.selectFirst();
            this.loaded = true;
            setTimeout(function (_) { return _webix.require.disabled = false; }, 1000);
        };
        CalendarView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (args.base) {
                if (this.dhtmlScheduler)
                    resizeBrowser();
                this.baseList.setValue(args.base);
            }
            if (args.date) {
                this.currentMode = MODE.Day;
                this.date.setValue(parseDate(args.date));
            }
        };
        CalendarView.prototype.refresh = function () {
            var base = this.baseList.getItem();
            if (!base)
                return;
            orders.db.calendarUpdates.reset("base-" + base.id);
            if (!this.loaded || !this.dhtmlScheduler)
                return;
            this.dhtmlScheduler.config.time_step = orders.logic.getTimeStep(base);
            this.dhtmlScheduler.config.hour_size_px = orders.logic.getHourSize(base);
            var sections = this.sections.filter(function (x) { return x.base == base.id; }).sort(function (x, y) { return x.order - y.order; });
            this.dhtmlScheduler.updateCollection("units1", sections);
            this.dhtmlScheduler.updateCollection("units2", sections);
            this.dhtmlScheduler.deleteMarkedTimespan();
            var times2 = [0];
            var lastTime = 0;
            if (this.currentMode == MODE.Day) {
                var SECS_1 = 60;
                var weekend = days.db.isWeekend(this.currentDate);
                var times = weekend ? base.weekendHours : base.workHours;
                times.forEach(function (x) {
                    if (x.from == lastTime) {
                        times2.pop();
                        times2.push(x.to * SECS_1);
                    }
                    else {
                        times2.push(x.from * SECS_1);
                        times2.push(x.to * SECS_1);
                    }
                    lastTime = x.to;
                });
                if (lastTime == 24)
                    times2.pop();
                else
                    times2.push(24 * SECS_1);
                var config1 = {
                    days: "fullweek",
                    zones: times2,
                };
                if (times && times.length > 0) {
                    this.dhtmlScheduler.config.first_hour = times[0].from;
                    this.dhtmlScheduler.config.last_hour = times[times.length - 1].to + 0.1;
                }
                this.dhtmlScheduler.blockTime(config1);
            }
            var d = this.getLastDate();
            var list = orders.db.calendar(base.id, this.currentDate, d);
            this.dhtmlScheduler.clearAll();
            this.dhtmlScheduler.parse(list, "json");
            if (this.dhtmlScheduler._date)
                this.dhtmlScheduler.updateView();
        };
        CalendarView.prototype.getLastDate = function () {
            var d = this.currentDate;
            if (this.currentMode == MODE.Week)
                d = d.addDays(6);
            else if (this.currentMode == MODE.Month)
                d = d.addMonth(1);
            return d;
        };
        CalendarView.prototype.checkUpdates = function () {
            var hasUpdates = orders.db.calendarUpdates.has();
            console.log("update", hasUpdates);
            if (hasUpdates) {
                this.refresh();
                webix.message("Календарь обновлен");
            }
        };
        CalendarView.prototype.dateChange = function (d) {
            var _this = this;
            this.currentDate = d;
            this.checkDate();
            if (this.dhtmlScheduler)
                this.dhtmlScheduler.setCurrentView(this.currentDate, this.currentMode);
            else
                setTimeout(function () { return _this.dateChange(d); }, 1000);
        };
        CalendarView.prototype.clearOrders = function () {
            if (!confirm("Удалить брони без статуса в календаре?"))
                return;
            var d = this.getLastDate();
            var base = this.baseList.getItem();
            var res = orders.db.clearCalendar(base.id, this.currentDate, d);
            this.refresh();
        };
        CalendarView.prototype.setMode = function (mode) {
            this.currentMode = mode;
            this.checkDate();
            this.dhtmlScheduler.setCurrentView(this.currentDate.addDays(1 / 100), mode);
            this.refresh();
        };
        CalendarView.prototype.checkDate = function () {
            if (this.currentMode == MODE.Week)
                this.currentDate = this.currentDate.addDays(1 - this.currentDate.getDay());
        };
        return CalendarView;
    }($u.View));
    orders.CalendarView = CalendarView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var action = orders.OrderAction;
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.createClientView = new clients.CreateView(_this).onAction(function (vals) { return _this.createClient(vals); });
            _this.equipmentsView = new equipments.BalanceView(_this);
            _this.messagesView = new messages.ListView(_this);
            _this.label = new $u.RefUI();
            _this.msgid = "msg" + webix.uid();
            _this.alertBans = new $u.RefUI();
            _this.alertForfeits = new $u.RefUI();
            _this.transView = new trans.PartGridView(_this);
            _this.transid = "trans" + webix.uid();
            _this.loaded = false;
            _this.buttons = {
                client: new $u.RefUI(),
                save: new $u.RefUI(),
                reserv: new $u.RefUI(),
                paid: new $u.RefUI(),
                close: new $u.RefUI(),
                cancel: new $u.RefUI(),
                forfeitAsk: new $u.RefUI(),
                forfeitConfirm: new $u.RefUI(),
            };
            _this._options = groups.db.options();
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            this.equipmentsView.onChange = function () { return _this.calc(); };
            var allow_history = system.context.allow(auth.oper.orderHistory);
            var tab_items = [
                { value: 'Бронь', id: this.form.id },
                { value: 'Транзакции', id: this.transid },
            ];
            if (allow_history)
                tab_items.push({ value: 'История', id: this.msgid });
            var tabs = $u.tabs.apply($u, tab_items).Value(this.form.id).Size(130);
            var baritems = [
                $u.button("Сохранить").Click(function () { return _this.save(true); }).Ref(this.buttons.save),
                $u.button("Резерв").Click(function () { return _this.status(action.Reserv, "Потвердить резервирование?", false, false); }).Ref(this.buttons.reserv),
                $u.button("Оплатить").Click(function () { return _this.status(action.Paid, "Подтвердить оплату?", true, true); }).Ref(this.buttons.paid).Type("green"),
                $u.button("Закрыть").Click(function () { return _this.status(action.Close, "Закрыть бронь?", true, true); }).Ref(this.buttons.close).Type("green"),
                $u.button("Отмена").Click(function () { return _this.status(action.CancelNormal, "Потвердить отмену без штрафа?", false, false); }).Ref(this.buttons.cancel).Type('danger'),
                $u.button("Неявка").Click(function () { return _this.status(action.CancelForfeitAsk, "Отменить со штрафом (с запросом на подтверждение у диспетчера)?", false, false); }).Ref(this.buttons.forfeitAsk).Type('danger'),
                $u.button("Сбор/П").Click(function () { return _this.status(action.CancelForfeitConfirm, "Подтвердить отмену со штрафом?", false, false); }).Ref(this.buttons.forfeitConfirm).Type('danger'),
                {},
                tabs,
            ];
            var left = [
                $u.cols(clients.getSearchColumn().OnChange(function (id, old) { return _this.clientUpdate(id); }), $u.icon("user-plus").Popup(this.createClientView.$config()).Ref(this.buttons.client).Tooltip("Создать клиента")),
                $u.element("comment").Label("Комментарий").AsTextArea(100),
                $u.element("clientComment").Label("Комментарий клиента").AsTextArea(100).Css("it-mark"),
                $u.label("Опции").Size(-1),
                $u.element("options").AsMultiSelect([]).OnChange(function () { return _this.calc(); }),
                $u.element("range").Label("Значение").AsInt().OnChange(function () { return _this.calc(); }),
                $u.element("equipments").Label("Позиции").AsMultiSelect([]).Visible(false),
                $u.element("itemsJson").Visible(false).Disable(),
                $u.label("Выберите позиции (укажите количество)", false),
                this.equipmentsView.$config().extend({ height: 200 }),
                $u.element("promoId").AsSelect(promo.db.names(true, promo.PromoKind.Action)).Label("Промоакция", "top").OnChange(function () { return _this.calc(); }),
            ];
            var right = [
                $u.element("payDate").Label("Дата оплаты").AsDate().Size(280),
                $u.element("date").Label("Дата брони").AsDate(true).Disable(),
                $u.element("roomPrice").Label("Сум. репетиции").AsNumber().Disable(),
                $u.element("eqPrice").Label("Сум. позиции").AsNumber().Disable(),
                $u.element("discount").Label("Скидка, %").AsNumber().Disable(),
                $u.element("hotPromo").Label("Горящая репет.").Disable(),
                $u.element("promo").Label("Промокод").Disable(),
                $u.element("forfeit").Label("Штраф").AsNumber().Disable().Css("it-mark").Tooltip("Начисленный ранее штраф клиента"),
                $u.element("paidForfeit").Label("Штраф Опл.").AsNumber().Disable().Css("it-mark").Tooltip("Начисленный ранее штраф клиента"),
                $u.element("payForfeit").Label("Оплачивать штраф", null, 150).AsCheckbox(false).OnChange(function () { return _this.calc(); }),
                $u.element("balance").Label("Баланс").AsInt().Disable(),
                $u.element("isPointsPay").Label("Списать баллы", null, 150).AsCheckbox(false).OnChange(function () { return _this.calc(); }),
                $u.element("totals").Label("Общая стоим.").Css("it-warning").AsNumber().Disable(),
                $u.element("text").Label("Расчет").AsHtmlLabel(300).Css('it-scroll-y'),
            ];
            var formCfg = this.form.config().extend({
                cols: [
                    { rows: left, gravity: 2 },
                    { width: 20 },
                    { rows: right },
                ],
            });
            var view = $u.rows({ cols: baritems }, $u.label("???").Ref(this.label), $u.template("  Клиент заблокирован у партнеров сервиса").Css("it-error").Ref(this.alertBans), $u.template("  Клиент имеет штраф у партнеров сервиса").Css("it-error").Ref(this.alertForfeits), $u.cells(formCfg, this.messagesView.$config().Id(this.msgid), this.transView.$config().Id(this.transid)).Size(730, 700), { gravity1111: 0.01 }).Scrollable();
            return view;
        };
        EditView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            this.loaded = false;
            var list = this.form.elements.clientId.getPopup().getList();
            list.clearAll();
            var vals = this.form.load(orders.db.getUrl(id));
            this.loaded = true;
            var text = orders.getOrderText(vals);
            this.label.setValue("   " + text);
            this.alertBans.visible(vals.hasBans);
            this.alertForfeits.visible(vals.hasForfeits);
            var eqlist = equipments.db.balance(vals.baseId, id, vals.dateFrom, vals.dateTo);
            this.equipments = eqlist.sort(function (x, y) { return (y.n - x.n); });
            this.setEquipmentsFromItemsJson(vals.itemsJson);
            this.equipmentsView.refresh(this.equipments);
            var suggest = {
                body: {
                    yCount: 50,
                    data: this.equipments,
                },
            };
            this.form.elements.equipments.define({ suggest: suggest });
            this.form.elements.equipments.refresh();
            var boptions = this._options.filter(function (x) { return x.bases.indexOf(vals.baseId) > -1; });
            this.form.setElement('options', { suggest: boptions, readonly: false });
            this.calc();
            this.applyUI(vals);
            this.messagesView.filter.order = id;
            this.messagesView.setDefaults({ orderId: id });
            this.messagesView.refresh();
            this.transView.reload({ orderId: id });
            return vals;
        };
        EditView.prototype.applyUI = function (vals) {
            var logic = orders.logic;
            var hold = vals.isHold;
            var editable = !hold && logic.allowEditOrder(vals);
            var editableAfterPaid = editable;
            var editableClient = editable && logic.allowEditClient(vals);
            this.form.enable(editable);
            this.buttons.forfeitAsk.enable(editable);
            this.buttons.forfeitConfirm.enable(editable);
            this.buttons.paid.enable(editable);
            this.buttons.reserv.enable(editable);
            this.buttons.save.enable(editable || logic.allowFullAccess());
            this.form.enable(logic.allowGroup(vals), "options");
            this.form.enable(editableClient, "clientId");
            this.buttons.client.enable(editableClient);
            this.form.enable(editableAfterPaid, "equipments");
            this.equipmentsView.enable(editableAfterPaid);
            this.form.enable(editableAfterPaid && logic.allowEditPaidForfeit(vals), "payForfeit");
            this.form.visible(logic.allowViewPromo(vals), "promoId");
            this.form.enable(logic.allowEditPromo(vals), "promoId");
            this.form.enable(logic.allowPoints(vals), "isPointsPay");
            this.form.enable(logic.allowEditPayDate(vals), "payDate");
            this.buttons.reserv.visible(logic.allowDoReserv(vals));
            this.buttons.cancel.visible(logic.allowDoCancel(vals));
            this.buttons.forfeitAsk.visible(logic.allowDoForfeit(vals));
            this.buttons.forfeitConfirm.visible(logic.allowDoForfeitConfirm(vals));
            this.buttons.close.visible(logic.allowDoClose(vals));
            this.buttons.paid.visible(logic.allowDoPaid(vals));
        };
        EditView.prototype.status = function (act, text, reserv, check) {
            if (!this.form.validate())
                return;
            if (!confirm(text))
                return;
            if (!this.save(false))
                return webix.message("Ошибка валидации данных");
            var vals = this.form.values();
            var res = {};
            if (reserv) {
                res = orders.db.setStatus(this.objectId, action.Reserv);
                if (check && res.paidForfeit != res.forfeit) {
                    var ok = confirm("\u0421\u0443\u043C\u043C\u0430 \u0441\u0431\u043E\u0440\u043E\u0432 \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0430\u0441\u044C \u0438 \u0441\u043E\u0441\u0442\u0430\u0432\u0438\u043B\u0430 ".concat(res.forfeit, " \u0440\u0443\u0431. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044E? "));
                    if (!ok)
                        return;
                }
                if (check && res.totalSum != res.originTotalSum) {
                    var ok = confirm("\u0418\u0442\u043E\u0433\u043E\u0432\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0430\u0441\u044C \u0438 \u0441\u043E\u0441\u0442\u0430\u0432\u0438\u043B\u0430 ".concat(res.totalSum, " \u0440\u0443\u0431. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u044E? "));
                    if (!ok)
                        return;
                }
            }
            res = orders.db.setStatus(this.objectId, act);
            if (res.errors) {
                It.UI.error(res.errors);
                return;
            }
            this.form.setValuesEx(res);
            orders.db.save({ id: this.objectId, originTotalSum: res.totalSum });
            this.close();
        };
        EditView.prototype.save = function (is_close) {
            if (!this.calc())
                return false;
            var r = this.form.values();
            var vals = {
                id: r.id,
                clientId: r.clientId,
                comment: r.comment,
                clientComment: r.clientComment,
                options: r.options,
                promoId: r.promoId,
                roomId: r.roomId,
                baseId: r.baseId,
                status: r.status,
                reason: r.reason,
                equipments: r.equipments,
                itemsJson: r.itemsJson,
                discount: r.discount,
                eqPrice: r.eqPrice,
                roomPrice: r.roomPrice,
                payForfeit: r.payForfeit,
                isPointsPay: r.isPointsPay,
                payDate: r.payDate,
                isHold: r.isHold,
                range: r.range,
                save: true,
                retrans: is_close,
            };
            if (is_close)
                vals.originTotalSum = r.totalSum;
            orders.db.save(vals);
            webix.message("Данные сохранены на сервере");
            if (is_close)
                this.close();
            return true;
        };
        EditView.prototype.calc = function () {
            if (!this.loaded)
                return false;
            try {
                this.loaded = false;
                var obj = this.form.values();
                var editable = orders.logic.allowEditOrder(obj);
                if (!editable) {
                    var text = "Пересчет заблокирован, бронь без статуса или давно оплачена";
                    webix.message(text);
                    this.form.elements.text.setValue(text);
                    return;
                }
                else {
                    var jsitems = this.getItemsJson();
                    this.form.elements.itemsJson.setValue(jsitems);
                    obj = this.form.save(orders.db.calcUrl, true);
                    this.form.elements.totals.setValue(obj.totalSum);
                }
                this.applyUI(obj);
                if (obj.errors) {
                    var err = obj.errors;
                    It.UI.w.info(err.replace('\r\n', '<hr/>'));
                    return false;
                }
            }
            finally {
                this.loaded = true;
            }
            return true;
        };
        EditView.prototype.close = function () {
            if (this.onclose)
                this.onclose();
        };
        EditView.prototype.createClient = function (vals) {
            var client = { id: this.createClientView.clientObject.id, value: this.createClientView.values.firstName };
            this.form.setValuesEx({ clientId: client.id });
            this.form.elements.clientId.setValue(client);
        };
        EditView.prototype.clientUpdate = function (clientId) {
            if (!clientId || clientId == "00000000-0000-0000-0000-000000000000")
                return;
            if (clientId.id)
                return;
            var client = clients.db.get(clientId);
            if (client.isBanned) {
                this.form.setValuesEx({ clientId: null });
                return It.UI.w.error("Клиент заблокирован!");
            }
            this.form.setValuesEx({ discount: client.discount, promo: client.promoCode, forfeit: client.forfeit, payForfeit222: !!client.forfeit, balance: client.balance });
            this.calc();
        };
        EditView.prototype.getItemsJson = function () {
            var list = this.equipments;
            var res = list.filter(function (x) { return x.n > 0; }).map(function (x) { return ({ eq: x.id, n: Math.min(x.count, x.n) }); });
            if (res.length == 0)
                return "";
            var json = JSON.stringify(res);
            return json;
        };
        EditView.prototype.setEquipmentsFromItemsJson = function (jsitems) {
            if (!jsitems)
                return;
            var eqlist = this.equipments;
            var items = JSON.parse(jsitems);
            items.forEach(function (item) {
                if (!item.eq)
                    return;
                var eq = eqlist.find(function (y) { return y.id == item.eq; });
                if (eq)
                    eq.n = item.n;
            });
        };
        return EditView;
    }($u.View));
    orders.EditView = EditView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var FilterGridView = (function (_super) {
        __extends(FilterGridView, _super);
        function FilterGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            _this.editor = new orders.OrderEditor();
            return _this;
        }
        FilterGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
            var logic = orders.logic;
            var gridCfg = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 1,
                columns: [
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("client").Header("Клиент", 150).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("sourceType").AsSelect(orders.sourceTypes).Header("Источник").Sort().Filter(),
                    $u.column("isPrepay").Header("Пред").AsCheckboxReadly(),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 140).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", 140).Sort().Filter(),
                    $u.column("promo").Header("Промокод", 50).Sort().Filter(),
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 70).AsNumber().Sort().Footer({ content: "summColumn" }),
                    $u.column("discounts").AsInt().Header("Скидка", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("eqSum").AsInt().Header("Доп.", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("comment").Header("Комментарий", 100).Filter(),
                    $u.column("clientComment").Header("Комм.клиента", 100).Filter(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 100).Sort().Filter(),
                    $u.column("options").Header("Опции", 180).Sort().Filter(),
                    $u.column("reason").AsSelect(orders.cancelReasons).Header("Отмена", 100).Sort().Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date);
                        logic.getStateCss(obj);
                    },
                },
            }).Tooltip("<h3>#client#</h3><hr/><blockquote>#comment# #clientComment#<br/>#options#</blockquote>").Footer();
            var date = new Date();
            var filterFormCfg = this.filterForm.config().extend({
                width: 400,
                elements: [
                    $u.element("search").Label("Названия"),
                    $u.element("dfrom").Label("Дата с").AsDate().Value(date.addDays(-7)),
                    $u.element("dto").Label("По").AsDate().Value(date),
                    $u.element("base").Label("База").AsSelect(bases.db.names(true)),
                    $u.element("promo").Label("Промокод", "top").AsSelect(promo.db.names(true, promo.PromoKind.Action)),
                    $u.element("status").Label("Статус документа").AsSelect(orders.statuses),
                    $u.element("option").Label("Опция").AsSelect(groups.db.options()),
                    $u.element("sources").Label("Источники").AsMultiSelect(orders.sourceKinds),
                    $u.element("eqtypes").Label("Тип позиции").AsMultiSelect(groups.db.names(groups.GroupType.Equipment)),
                    $u.element("eqs").Label("Позиции").AsMultiSelect(equipments.db.names()),
                    $u.element("sourceTypes").Label("Типы источн.").AsMultiSelect(orders.sourceTypes),
                    $u.element("prepay").Label("Только предоплата").AsCheckbox(),
                    $u.cols($u.button("Найти").Click(function () { return _this.refresh(); }).Tooltip("Пересчитать данные и обновить отчет"), $u.button("Очистить").Click(function () { return _this.filterForm.clear(); })),
                ]
            });
            var view = $u.rows($u.cols($u.button("Поиск").Popup(filterFormCfg), $u.button("Открыть").Click(function () { return _this.open(); }), $u.icon("file-excel-o").Click(function () { return _this.exportxlsx(); }).Tooltip("Экспортировать в Ексел"), {}), gridCfg);
            return view;
        };
        FilterGridView.prototype.refresh = function () {
            var filter = this.filterForm.values();
            var list = orders.db.search(filter);
            this.grid.refresh(list);
            webix.message("Отчет обновлен");
        };
        FilterGridView.prototype.open = function () {
            var item = this.grid.getSelectedItem();
            if (!item)
                return;
            this.editor.edit(item.id);
        };
        FilterGridView.prototype.exportxlsx = function () {
            this.grid.toExcel({
                filename: "orders-" + (new Date()).toLocaleDateString("ru"),
                name: "orders",
                filterHTML: true,
                columns: [
                    { id: "client", header1: "ККК" },
                    { id: "sourceType" },
                    { id: "dateFrom" },
                    { id: "baseId" },
                    { id: "roomId" },
                    { id: "promo" },
                    { id: "houurs" },
                    { id: "totalSum", exportType: "number" },
                    { id: "discounts", exportType: "number" },
                    { id: "eqSum", exportType: "number", exportFormat1: "#-##0.00" },
                    { id: "status" },
                ]
            });
            console.log('export xlsx');
        };
        return FilterGridView;
    }($u.View));
    orders.FilterGridView = FilterGridView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var AskGridView = (function (_super) {
        __extends(AskGridView, _super);
        function AskGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.editor = new orders.OrderEditor(function () { return _this.refresh(); });
            _this.timerid = setInterval(function () { return _this.checkUpdates(); }, 60 * 1000);
            return _this;
        }
        AskGridView.prototype.checkUpdates = function () {
            var res = orders.db.forfeitUpdates.has();
            if (res) {
                orders.db.forfeitUpdates.reset();
                It.UI.w.info("Получен новый штраф для подтверждения");
            }
        };
        AskGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            orders.db.forfeitUpdates.reset("forfeit-" + system.context.domainId);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", -1).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", -1).Sort().Filter(),
                    $u.column("fullForfeit").AsInt().Header("Штраф").Sort(),
                    $u.column("totalSum").AsInt().Header("Стоимость").Sort(),
                    $u.column("types").Header("Позиции", -1).Sort().Filter(),
                    $u.column("client").Header("Клиент", -1).Sort().Filter().Template(clients.getClientColumnTemplate()),
                    $u.column("text").Header("Описание", -1).Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date);
                    },
                },
            });
            var view = $u.rows($u.panelbar(this.grid.btnRefresh(function (_) { return _this.refresh(); }), $u.button("Открыть").Click(function () { return _this.open(); }), {}), gridCfg);
            return view;
        };
        AskGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.refresh();
        };
        AskGridView.prototype.refresh = function () {
            var res = orders.db.list({ status1: orders.OrderStatus.Reserv, reason: orders.CancelReason.ForfeitsAsk });
            this.grid.refresh(res);
            webix.message("Данные обновлены");
        };
        AskGridView.prototype.open = function () {
            var item = this.grid.getSelectedItem();
            if (!item)
                return;
            this.editor.edit(item.id);
        };
        return AskGridView;
    }($u.View));
    orders.AskGridView = AskGridView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var ForfeitsGridView = (function (_super) {
        __extends(ForfeitsGridView, _super);
        function ForfeitsGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.editor = new orders.OrderEditor(function () { return _this.refresh(); });
            return _this;
        }
        ForfeitsGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("date").Header("Дата").AsDate().Sort(),
                    $u.column("time").Header("Время"),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", -1).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", -1).Sort().Filter(),
                    $u.column("forfeit").AsInt().Header("Штраф").Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость").Sort().Footer({ content: "summColumn" }),
                    $u.column("types").Header("Позиция", -1).Sort().Filter(),
                    $u.column("client").Header("Клиент", -1).Sort().Filter().Template(clients.getClientColumnTemplate()),
                    $u.column("text").Header("Описание", -1).Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date);
                    },
                },
            }).Footer();
            var view = $u.rows($u.panelbar(this.grid.btnRefresh(function (_) { return _this.refresh(); }), $u.button("Открыть").Click(function () { return _this.open(); }), {}), gridCfg);
            return view;
        };
        ForfeitsGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.refresh();
        };
        ForfeitsGridView.prototype.refresh = function () {
            var res = orders.db.list({ forfeits: true, reason1111: orders.CancelReason.ForfeitsConfirmed });
            this.grid.refresh(res);
            webix.message("Данные обновлены");
        };
        ForfeitsGridView.prototype.open = function () {
            var item = this.grid.getSelectedItem();
            if (!item)
                return;
            this.editor.edit(item.id);
        };
        return ForfeitsGridView;
    }($u.View));
    orders.ForfeitsGridView = ForfeitsGridView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var acc = auth.oper;
    var sts = orders.OrderStatus;
    var fullAccess = function () { return system.context.isSuper || system.context.allow(acc.orderFullAccess); };
    var Logic = (function () {
        function Logic() {
            this.allowFullAccess = function () { return fullAccess(); };
            this.allowAnyReportDay = function () { return fullAccess() || system.context.allow(acc.anyReportDate); };
            this.allowEditCalendar = function () { return fullAccess() || system.context.allow(acc.orderEdit); };
            this.allowCreate = function () { return fullAccess() || system.context.allow(acc.orderNew); };
            this.allowLightboxEdit = function (ev) { return fullAccess() || !ev.abonementId; };
            this.allowDelete = function (ev) { return fullAccess() || ev.status == sts.Unknow || ev.status != sts.Closed && system.context.allow(acc.orderDelete); };
            this.allowEditOrder = function (v) { return fullAccess() || !v.isHold || system.context.allow(acc.orderCancelAny); };
            this.allowEditPaidForfeit = function (v) { return v.fullForfeit &&
                v.fullForfeit != "0" &&
                (fullAccess() || v.status != sts.Closed); };
            this.allowEditClient = function (v) { return !v.clientId; };
            this.allowGroup = function (v) { return fullAccess() ||
                system.context.allow(acc.orderEditGroup); };
            this.allowRemoveEquipments = function (v) { return fullAccess() ||
                v.status != sts.Closed; };
            this.allowFullForfeit = function (v) { return v.fullForfeit && v.status == sts.Cancel && (v.reason == orders.CancelReason.ForfeitsAsk); };
            this.allowViewPromo = function (v) { return fullAccess() ||
                system.context.allow(acc.orderPromo); };
            this.allowEditPromo = function (v) { return fullAccess() ||
                v.status != sts.Closed; };
            this.allowEditPayDate = function (v) { return fullAccess(); };
            this.allowHold = function (v) { return v.status == sts.Unknow; };
            this.allowPoints = function (v) { return fullAccess() ||
                system.context.allow(acc.orderPoints); };
            this.allowDoReserv = function (v) { return fullAccess() ||
                system.context.allow(acc.orderReserv) && (v.status == sts.Unknow || v.status == sts.Cancel); };
            this.allowDoCancel = function (v) { return fullAccess() ||
                system.context.allow(acc.orderCancelAny) ||
                system.context.allow(acc.orderCancel) && allowCancelRule(v); };
            this.allowDoCancel_test = function (v) { return fullAccess() ||
                allowCancelRule(v); };
            this.allowDoForfeit = function (v) { return fullAccess() ||
                v.status == sts.Reserv && check24h(v.dateFrom); };
            this.allowDoForfeitConfirm = function (v) { return fullAccess() ||
                v.reason == orders.CancelReason.ForfeitsAsk && system.context.allow(acc.orderForfeit); };
            this.allowDoPaid = function (v) { return fullAccess() ||
                v.status == sts.Reserv
                    && system.context && system.context.allow(acc.orderPay)
                    && v.totalPays != v.totalSum; };
            this.allowDoClose = function (v) { return fullAccess() ||
                v.status == sts.Reserv
                    && system.context && system.context.allow(acc.orderPay)
                    && v.totalPays == v.totalSum; };
        }
        Logic.prototype.getHourSize = function (base) {
            return 44;
        };
        Logic.prototype.getTimeStep = function (base) {
            if (!base)
                return 60;
            return 60;
        };
        Logic.prototype.getEventTemplate = function (start, end, ev) {
            var res = "";
            var comment = (ev.text + "").trim();
            if (comment != "")
                res += "<span class='fa fa-comment'/>\u00A0";
            switch (ev.sourceType) {
                case orders.SourceType.Mobile:
                case orders.SourceType.Catalog:
                    res += "<span class='fa fa-mobile' />";
                    break;
                case orders.SourceType.Widget:
                    res += "<span class='fa fa-table' />";
                    break;
                case orders.SourceType.Bot:
                    res += "<span class='fa fa-comments' />";
                    break;
                default:
                    break;
            }
            if (ev.abonementId)
                res += "<span class='fa fa-calendar' />".link("#!/abonements/edit/?oid=".concat(ev.abonementId));
            var sgroup = "<span class='fa ".concat(Logic.GROUPS[ev.group], "' ></span>");
            if (ev.clientId && system.context.allow(auth.oper.clients))
                res += "<a href='#!/clients/edit?oid=".concat(ev.clientId, "'>").concat(ev.name, "</a>");
            else
                res += "".concat(ev.name);
            res += ",".concat(sgroup, " ").concat(ev.totalSum, " \u0440\u0443\u0431. (\u043E\u043F\u043B ").concat(ev.totalPays, ", \u0432 \u0442\u0447 ").concat(ev.paidForfeit, " \u0448\u0442\u0440\u0430\u0444) ").concat(ev.types);
            var text = (ev.text + "").trim();
            if (text)
                res += " [<i>".concat(text, "</i>]");
            return res;
        };
        Logic.prototype.getEventCss = function (start, end, ev) {
            var css = "it-event it-status-" + ev.status;
            if (ev.payDate)
                css += " it-status-p";
            return css;
        };
        Logic.prototype.getStateCss = function (item) {
            if (item && item.status)
                item.$css = "it-status-" + item.status;
            if (item && item.payDate)
                item.$css += " it-status-p";
        };
        Logic.prototype.getRequstStateCss = function (item) {
            if (item && item.requestStatus)
                item.$css = "it-reqstatus-" + item.requestStatus;
        };
        Logic.GROUPS = ['question', 'fa-user', 'fa-user-plus', 'fa-users'];
        return Logic;
    }());
    function check24h(d) {
        var dh = It.dateDiff.inHoursAbs(d);
        return dh <= 24;
    }
    function allowCancelRule(order) {
        var res = order_rules.db.canCancelBase(order.baseId, order.date, order.dateFrom);
        return res.allow;
    }
    orders.logic = new Logic();
})(orders || (orders = {}));
var orders;
(function (orders) {
    var OrderEditor = (function () {
        function OrderEditor(onclose) {
            var _this = this;
            this.onclose = onclose;
            this.detailsView = new orders.EditView();
            this.win = new $u.RefWin("Редактирование брони");
            this.win.resize = false;
            this.detailsView.onclose = function () { return _this.closeEditor(); };
            this.win.config(this.detailsView.$config());
        }
        OrderEditor.prototype.edit = function (id) {
            if (!id || typeof id != "string")
                return It.UI.w.error("Не выделен или не сохранен текущий заказ!");
            this.win.show();
            var vals = this.detailsView.$reload(id);
            this.win.setHead("Карточка брони");
        };
        OrderEditor.prototype.closeEditor = function () {
            this.win.hide();
            if (this.onclose)
                this.onclose();
        };
        return OrderEditor;
    }());
    orders.OrderEditor = OrderEditor;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var SearchSuperView = (function (_super) {
        __extends(SearchSuperView, _super);
        function SearchSuperView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        SearchSuperView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template($u.getViewLink("orders")),
                    $u.column("client").Header("Клиент", -2).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("domain").Header("Партнер", -1).Sort().Filter(),
                    $u.column("base").Header("База", -1).Sort().Filter(),
                    $u.column("room").Header("Комната", -1).Sort().Filter(),
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("discounts").AsInt().Header("Скидка", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("mobComm").AsInt().Header("Комиссия", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("ignoreMobComm").Header("0-Ком").AsCheckbox().Sort().Visible(system.context.isSuper),
                    $u.column("text").Header("Описание", -1),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 80).Sort().Filter(),
                    $u.column("reason").AsSelect(orders.cancelReasons).Header("Отмена", 80).Sort().Filter(),
                    $u.column("sourceType").AsSelect(orders.sourceTypes).Header("Источник", 80).Sort().Filter(),
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date);
                        orders.logic.getStateCss(obj);
                    },
                },
                save: orders.db.commissionUrl(),
            }).Tooltip("#client#<div/>Скидка: #discount#%<p/>#text#").Footer();
            var view = $u.rows($u.panelbar($u.button("Обновить").Click(function () { return _this.$reload(_this.objectId); }), {}, $u.label("Статистика по связанным заказам для Суперадмина  ")), grid);
            return view;
        };
        SearchSuperView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var args = webix.copy(this.args);
            delete args.view;
            delete args.oid;
            delete args.module;
            args.archive = true;
            var res = orders.db.search(args);
            this.grid.refresh(res);
            webix.message("Данные обновлены");
        };
        return SearchSuperView;
    }($u.View));
    orders.SearchSuperView = SearchSuperView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var SearchView = (function (_super) {
        __extends(SearchView, _super);
        function SearchView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        SearchView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template($u.getViewLink("orders")),
                    $u.column("client").Header("Клиент", -2).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("base").Header("База", -1).Sort().Filter(),
                    $u.column("room").Header("Комната", -1).Sort().Filter(),
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("discounts").AsInt().Header("Скидка", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("mobComm").AsInt().Header("Комиссия", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("ignoreMobComm").Header("0-Ком").AsCheckbox().Sort().Visible(system.context.isSuper),
                    $u.column("text").Header("Описание", -1),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 80).Sort().Filter(),
                    $u.column("reason").AsSelect(orders.cancelReasons).Header("Отмена", 80).Sort().Filter(),
                    $u.column("sourceType").AsSelect(orders.sourceTypes).Header("Источник", 80).Sort().Filter(),
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date);
                        orders.logic.getStateCss(obj);
                    },
                },
                save: orders.db.commissionUrl(),
            }).Tooltip("#client#<div/>Скидка: #discount#%<p/>#text#").Footer();
            var view = $u.rows($u.panelbar($u.button("Обновить").Click(function () { return _this.$reload(_this.objectId); }), {}, $u.label("Статистика по связанным заказам    ")), grid);
            return view;
        };
        SearchView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (!this.first)
                this.$reload(this.objectId);
        };
        SearchView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var args = webix.copy(this.args);
            delete args.view;
            delete args.oid;
            delete args.module;
            args.archive = true;
            var res = orders.db.search(args);
            this.grid.refresh(res);
            webix.message("Данные обновлены");
        };
        return SearchView;
    }($u.View));
    orders.SearchView = SearchView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var SearchAllView = (function (_super) {
        __extends(SearchAllView, _super);
        function SearchAllView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            return _this;
        }
        SearchAllView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template($u.getViewLink("orders")),
                    $u.column("client").Header("Клиент", 200).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("date").Header("Дата").AsDate().Sort(),
                    $u.column("dateFrom").Header("Дата бр").AsDate().Sort(),
                    $u.column("payDate").Header("Дата опл").AsDate().Sort(),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 100).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", 100).Sort().Filter(),
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("discounts").AsInt().Header("Скидка", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("mobComm").AsInt().Header("Комиссия", 80).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("ignoreMobComm").Header("0-Ком").AsCheckbox().Sort().Visible(system.context.isSuper),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 80).Sort().Filter(),
                    $u.column("reason").AsSelect(orders.cancelReasons).Header("Отмена", 80).Sort().Filter(),
                    $u.column("sourceType").AsSelect(orders.sourceTypes).Header("Источник", 80).Sort().Filter(),
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#date#")),
                    $u.column("text").Header("Описание", 500),
                ],
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 3,
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date);
                        orders.logic.getStateCss(obj);
                    },
                },
                save: orders.db.commissionUrl(),
            }).Tooltip("#client#<div/>Скидка: #discount#%<p/>#text#").Footer();
            var filterCfg = this.filterForm.config().extend({
                cols: [
                    $u.element("dFrom").Label("С", null, 20).AsDate().Size(130),
                    $u.element("dTo").Label("По", null, 30).AsDate().Size(137),
                ]
            });
            var view = $u.rows($u.panelbar($u.button("Обновить").Click(function () { return _this.$reload(_this.objectId); }), filterCfg, {}, $u.label("Связанные брони")), gridCfg);
            return view;
        };
        SearchAllView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d0 = new Date();
            var n = 1 - d0.getDate();
            var d = d0.addDays(n);
            this.filterForm.setValuesEx({ dFrom: d, dTo1: d.addMonth(1).addDays(-1) });
        };
        SearchAllView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var args = webix.copy(this.args);
            delete args.view;
            delete args.oid;
            delete args.module;
            var filter = this.filterForm.values();
            webix.extend(args, filter, true);
            args.archive = true;
            var res = orders.db.search(args);
            this.grid.refresh(res);
        };
        return SearchAllView;
    }($u.View));
    orders.SearchAllView = SearchAllView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var ItemView = (function (_super) {
        __extends(ItemView, _super);
        function ItemView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.header = new $u.RefTemplate();
            _this.logic = new ViewLogic();
            _this.alert = new $u.RefUI();
            _this.OnEdit = new It.Event();
            _this.OnDelete = new It.Event();
            return _this;
        }
        ItemView.prototype.$config = function () {
            var _this = this;
            var toolbar = $u.header("Просмотр брони", $u.button("Редактировать").Click(function () { return _this.edit(); }), $u.button("Удалить").Click(function () { return _this.delete(); }).Ref(this.logic.ref(this.logic.states.delete)), $u.icon("close").Click(function () { return _this.hide(); }));
            var form = this.form.config().Labels(120).extend({
                elements: [
                    toolbar,
                    this.header.config('AAA').Size(-1, 40).Css('it-header'),
                    $u.cols($u.rows($u.element("equipments").Label("Позиции", "top").AsTextArea(400), $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options())), $u.rows($u.element("comment").Label("Комментарий").AsTextArea(100), $u.element("discount").Label("Скидка, %").AsInt(), $u.element("clientForfeit").Label("Прошлый штраф").AsNumber(), $u.element("totalSum").Label("Cтоимость общ").Css("it-warning").AsNumber())),
                    $u.template("  Клиент заблокирован или имеет штраф у партнеров сервиса").Css("it-error").Ref(this.alert),
                ]
            }).Readonly(true);
            return form.Size(600);
        };
        ItemView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var vals = orders.db.get(id);
            vals.comment += ' ' + vals.clientComment;
            if (vals.itemsJson) {
                var items = JSON.parse(vals.itemsJson);
                var names_1 = equipments.db.names();
                vals.equipments = items.map(function (x) { return "- ".concat(names_1.findById(x.eq, {}).value, " x").concat(x.n); }).join('\n');
            }
            else {
                vals.equipments = "";
            }
            this.form.setValues(vals);
            var header = orders.getOrderText(vals);
            this.header.set({ template: header });
            this.logic.check(vals);
            this.alert.visible(vals.hasBans || vals.hasForfeits);
        };
        ItemView.prototype.edit = function () {
            this.hide();
            this.OnEdit.call(this.objectId);
        };
        ItemView.prototype.delete = function () {
            this.hide();
            this.OnDelete.call(this.objectId);
        };
        return ItemView;
    }($u.PopupView));
    orders.ItemView = ItemView;
    var ViewLogic = (function (_super) {
        __extends(ViewLogic, _super);
        function ViewLogic() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.states = {
                delete: 1,
            };
            return _this;
        }
        ViewLogic.prototype.check = function (obj) {
            this.enable(this.states.delete, obj.status == orders.OrderStatus.Unknow);
        };
        return ViewLogic;
    }($u.UIManager));
})(orders || (orders = {}));
var orders;
(function (orders) {
    var TotalsView = (function (_super) {
        __extends(TotalsView, _super);
        function TotalsView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.filterForm = new $u.RefForm();
            _this.pivot = new $u.RefPivot();
            return _this;
        }
        TotalsView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var isAllDates = orders.logic.allowAnyReportDay();
            var formCfg = this.filterForm.config().extend({
                cols: [
                    $u.button("Сбросить").Click(function (_) { return _this.pivot.clearConfig(true); }).Tooltip("Сбросить настройки"),
                    $u.element("dfrom").Label("Дата с", null, 50).Size(170).AsDate().Disable(!isAllDates),
                    $u.element("dto").Label("По", null, 40).Size(170).AsDate().Disable(!isAllDates),
                    $u.icon("refresh").Click(function (_) { return _this.refresh(); }).Tooltip("Пересчитать данные и обновить отчет"),
                    $u.icon("file-excel-o").Click(function (_) { return _this.export(); }).Tooltip("Экспортировать в Ексел").Hidden(!isAllDates),
                    {},
                ]
            });
            var pivotCfg = this.pivot.config().extend({
                columnWidth: 80,
                fieldMap: {
                    baseSphere: "Сфера",
                    group: "Статья",
                    base: "База",
                    room: "Комната",
                    totals: "Сумма",
                    totalsOnline: "ОплБанк",
                    totalsCache: "ОплНал/з",
                    totalsBack: "Возвр.Нал",
                    totalsBackPred: "Возвр.Пред",
                    fullTotals: "Полн сумма",
                    discounts: "Скидки",
                    user: "Автор",
                    source: "Источник",
                    dayStr: "День",
                    channel: "Канал",
                },
                scheme: {},
                structure: {
                    filters: [
                        { name: "baseSphere", type: "select" },
                        { name: "group", type: "select" },
                        { name: "source", type: "select" },
                    ],
                    columns: [
                        { id: "dayStr", header: "День", sort: "string" },
                    ],
                    values: [
                        { name: "totals", operation: "sum" },
                    ],
                    rows: ["baseSphere", "base", "room", "group"],
                },
            });
            var view = $u.rows(formCfg, pivotCfg);
            return view;
        };
        TotalsView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d = new Date(Date.now());
            d = webix.Date.weekStart(d);
            var vals = { dfrom: d, dto: d.addDays(6) };
            this.filterForm.setValuesEx(vals);
            this.pivot.setConfig("pivot.orders.totals");
        };
        TotalsView.prototype.refresh = function () {
            var vals = this.filterForm.values();
            var list = orders.db.totals(vals.dfrom, vals.dto);
            this.pivot.refresh(list);
            webix.message("Отчет обновлен");
        };
        TotalsView.prototype.export = function () {
            var cfg = {
                filename: "totals " + (new Date()).toLocaleDateString("ru"),
                name: "totals",
                filterHTML: true,
            };
            this.pivot.toExcel(cfg);
        };
        return TotalsView;
    }($u.View));
    orders.TotalsView = TotalsView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var TotalsComView = (function (_super) {
        __extends(TotalsComView, _super);
        function TotalsComView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.filterForm = new $u.RefForm();
            _this.pivot = new $u.RefPivot();
            return _this;
        }
        TotalsComView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var isAllDates = orders.logic.allowAnyReportDay();
            var formCfg = this.filterForm.config().extend({
                cols: [
                    $u.button("Сбросить").Click(function (_) { return _this.pivot.clearConfig(true); }).Tooltip("Сбросить настройки"),
                    $u.element("dfrom").Label("Дата с", null, 50).Size(170).AsDate().Disable(!isAllDates),
                    $u.element("dto").Label("По", null, 40).Size(170).AsDate().Disable(!isAllDates),
                    $u.element("pfrom").Label("Оплата с", null, 60).Size(170).AsDate().Disable(!isAllDates),
                    $u.element("pto").Label("По", null, 40).Size(170).AsDate().Disable(!isAllDates),
                    $u.icon("refresh").Click(function (_) { return _this.refresh(); }).Tooltip("Пересчитать данные и обновить отчет"),
                    $u.icon("file-excel-o").Click(function (_) { return _this.export(); }).Tooltip("Экспортировать в Ексел").Hidden(!isAllDates),
                    {},
                ]
            });
            var pivotCfg = this.pivot.config().extend({
                columnWidth: 80,
                fieldMap: {
                    domain: "Партнер",
                    sphere: "Сфера",
                    users: "Ответственные",
                    type: "Тип",
                    total: "Сумма",
                },
                scheme: {},
                structure: {
                    filters: [],
                    rows: [
                        'domain',
                        'sphere',
                        'users',
                    ],
                    values: [
                        { name: "total", operation: "sum" },
                    ],
                    columns: [
                        "type",
                    ],
                },
            });
            var view = $u.rows(formCfg, pivotCfg);
            return view;
        };
        TotalsComView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d = new Date(Date.now());
            d = webix.Date.weekStart(d);
            var vals = { dfrom: d, dto: d.addDays(6), pfrom: d, pto: d.addDays(6) };
            this.filterForm.setValuesEx(vals);
            this.pivot.setConfig("pivot.orders.totalscom");
        };
        TotalsComView.prototype.refresh = function () {
            var vals = this.filterForm.values();
            var list = orders.db.totalscom(vals);
            this.pivot.refresh(list);
            webix.message("Отчет обновлен");
        };
        TotalsComView.prototype.export = function () {
            var cfg = {
                filename: "totals " + (new Date()).toLocaleDateString("ru"),
                name: "totals",
                filterHTML: true,
            };
            this.pivot.toExcel(cfg);
        };
        return TotalsComView;
    }($u.View));
    orders.TotalsComView = TotalsComView;
})(orders || (orders = {}));
var prices;
(function (prices) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.full = false;
            _this.grid = new $u.RefGrid();
            _this.editForm = new prices.EditForm();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var me = this;
            var promos = promo.db.names(true, promo.PromoKind.Rules);
            this.editForm.full = this.full;
            var pricesGridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                    $u.column("baseId").Header("База", 130).AsSelect(bases.db.namesUrl).Sort().Filter().Visible(this.full),
                    $u.column("roomId").Header("Комната", 100).AsSelect(rooms.db.namesUrl).Sort().Filter().Visible(this.full),
                    $u.column("timeFrom").AsInt().Header("С", 40).Sort(),
                    $u.column("timeTo").AsInt().Header("По", 40).Sort(),
                    $u.column("workingFPrice").AsInt().Header("Перв.Раб", 50).Sort(),
                    $u.column("workingPrice").AsInt().Header("Рабочие", 50).Sort(),
                    $u.column("workingLPrice").AsInt().Header("Посл.Раб", 50).Sort(),
                    $u.column("weekend1Price").AsInt().Header("СБ", 50).Sort(),
                    $u.column("weekend2Price").AsInt().Header("ВС", 50).Sort(),
                    $u.column("promoId").Header("Условие").AsSelect(promos).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -1).Filter(),
                ],
                scheme: {
                    timeFrom: 0,
                    timeTo: 24,
                    workingLPrice: 0,
                    workingPrice: 0,
                    workingFPrice: 0,
                    weekend1Price: 0,
                    weekend2Price: 0,
                },
                save: prices.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.toolbar($u.label("Список цен"), this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.reload2(null, null); }), {}, $u.icon("save").Click(function () { return _this.save(); })), $u.cols(pricesGridCfg, $u.splitter(), this.editForm.config()));
            return view;
        };
        GridView.prototype.$init = function () {
            this.editForm.form.bind(this.grid);
        };
        GridView.prototype.reload2 = function (roomid, baseid) {
            _super.prototype.$reload.call(this, roomid);
            var sh = {
                timeFrom: 0,
                timeTo: 24,
                workingLPrice: 0,
                workingPrice: 0,
                workingFPrice: 0,
                weekend1Price: 0,
                weekend2Price: 0,
                roomId: roomid,
                baseId: baseid
            };
            this.grid.scheme(sh);
            var data = prices.db.list_items(roomid, baseid);
            this.grid.refresh(data);
            return this;
        };
        GridView.prototype.save = function () {
            this.editForm.form.updateBindings();
        };
        return GridView;
    }($u.View));
    prices.GridView = GridView;
})(prices || (prices = {}));
var prices;
(function (prices) {
    prices.create = {
        grid: function () {
            var grid = new prices.GridView();
            grid.onactivate = function () { return grid.reload2(null, null); };
            grid.full = true;
            return grid;
        },
    };
    var PricesSource = (function (_super) {
        __extends(PricesSource, _super);
        function PricesSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.list_items = function (roomid, baseid) { return _this.list({ room: roomid, base: baseid }); };
            _this.baseItems = function (baseid) { return _this.load("baseItems", { base: baseid }); };
            return _this;
        }
        return PricesSource;
    }(app.AppDataSource));
    prices.db = new PricesSource("prices");
})(prices || (prices = {}));
var orders;
(function (orders) {
    var AdminGridView = (function (_super) {
        __extends(AdminGridView, _super);
        function AdminGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.filter = {};
            _this.grid = new $u.RefGrid();
            _this.filterView = new $u.RefForm();
            return _this;
        }
        AdminGridView.prototype.$config = function () {
            var _this = this;
            var allowSuperCRMEdit = system.context.allowCrmEdit();
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("", 30).Template($u.getViewLink("orders")).Visible(allowSuperCRMEdit),
                    $u.column("date").Header("Дата").AsDate(webix.i18n.dateFormatStr).Sort().Filter(),
                    $u.column("domainId").AsSelect(domains.db.names()).Header("Партнер", 100).Sort().Filter(),
                    $u.column("baseId").AsSelect(bases.db.names()).Header("База", 100).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.names(null, true)).Header("Комната", 100).Sort().Filter(),
                    $u.column("metro").Header("Метро").Sort().Filter(),
                    $u.column("total").Header("Сумма").AsInt().Sort().Filter().Footer(),
                    $u.column("forfeit").Header("Штрафы").AsInt().Sort().Filter().Footer(),
                    $u.column("text").Header("Описание", -1).Filter(),
                    $u.column("clientComment").Header("Комментарий", -1).Filter(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 100).Sort().Filter(),
                ],
                scheme: {
                    name: "без имени",
                    $init: function (obj) {
                        orders.logic.getStateCss(obj);
                    },
                },
            })
                .Tooltip("<b>Описание и комментарий:</b><br/><blockquote>#text#<hr/>#clientComment#</blockquote>")
                .Footer()
                .Autoheight();
            var filterCfg = this.filterView.config().extend({
                cols: [
                    $u.label("Список броней"),
                    $u.element("dfrom").Label("Дата с:", null, 60).AsDate().Size(180),
                    $u.element("dto").Label("По:", null, 40).AsDate().Size(160),
                    $u.icon("refresh").Click(function () { return _this.reload(); }),
                    {}
                ]
            });
            return $u.rows(filterCfg, grid);
        };
        AdminGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d = new Date();
            this.filterView.setValuesEx({ dfrom: d.addDays(-7), dto: d });
        };
        AdminGridView.prototype.reload = function (args) {
            if (args)
                this.filter = args;
            var filter = webix.extend(this.filter, this.filterView.values(), true);
            var items = orders.db.admlist(filter);
            this.grid.refresh(items);
        };
        return AdminGridView;
    }($u.View));
    orders.AdminGridView = AdminGridView;
})(orders || (orders = {}));
var rooms;
(function (rooms) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.uploader = new $u.RefUI();
            _this.files = new $u.RefDataView();
            _this.urlView = new resources.UrlView().owner(_this);
            return _this;
        }
        EditView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var me = this;
            var w = 100;
            var uploader = {
                view: "uploader",
                id: this.uploader.id,
                value: "Загрузите фото или перетащите файл",
                upload: "api/resources/upload/",
                accept: "image/png, image/gif, image/jpg",
                datatype: "json",
                multiple: true,
                on: {
                    onFileUpload: function (items) {
                        var item = items[0];
                        me.files.callNoEvents(function () { return me.files.add(item); });
                        var s = me.form.values();
                        s.files.insert(item.sort, {
                            "id": item.id,
                            "name": item.name,
                            "value": item.value,
                            "sort": item.sort,
                        });
                        me.form.setValues(s);
                    }
                },
            };
            var hoursTooltop = "Укажите на каких условиях возможны почасовые занятия по будням и выходным дням заранее в формате 0,6,15,24. Например: «0,6,12,13,14,15,16,17,18,21,24» - что означает с 0 до 6 комнату можно забронировать только на 6 часов, с 12 до 18 можно забронировать комнату на 1 час, а с 18 до 24 только на 3";
            var hhelp = "Укажите на каких условиях возможны почасовые занятия по будням и выходным дням день в день в формате 0,6,15,24. Например: «0,15,16,17,18,19,20,21,22,23,24» - что означает, что комнату можно забронировать только с 3 часов дня, и до окончания работы объекта комната доступна для бронирования по часу. (Понятие «сегодня» определяется датой, это значит, что условия бронирования указанное в этих полях вступает в силу в 00:01 сегодняшнего дня)";
            var view = this.form.config().Labels(150).extend({
                borderless: true,
                elements: [
                    $u.cols($u.button("Сохранить").Click(function () { return me.save(); }), {}),
                    $u.cols($u.rows($u.element("baseId").Label("База").AsSelect(bases.db.names(true)).Require().Tooltip("Выберите созданный в разделе «Базы» объект, в котором расположена комната"), $u.element("name").Label("Название").Require().Tooltip("Введите название комнаты для потенциальных клиентов"), $u.element("color").Label("Цвет").AsColor().Tooltip("Цвет в календаре"), $u.element("shareId").Label("Общая комната").AsSelect(rooms.db.names(null, true)).Tooltip("Выберите общую комнату если это помещение используется в других сферах оказания услуг. Например, если эта комната используется на студии звукозаписи в качестве тон-зала, укажите ее в этом поле и в поле «общая комната» самого тон зала (Указывать нужно одну и ту же комнату)"), $u.element("isArchive").Label("Архив").AsCheckbox().Tooltip("Используется для удаления комнаты из раздела «Календарь» и других, если в этой комнате были бронирования"), $u.element("allowMobile").Label("Мобильный доступ").AsCheckbox().Tooltip("Используется для публикации и скрытия комнаты в приложении. Не выставляйте эту галочку пока не убедитесь в полном заполнении информации в разделах «Базы», «Комнаты», «Позиции» и «Цены»"), $u.element("defaultHours").Label("Часы бронирования").Tooltip(hoursTooltop), $u.element("weekendHours").Label("Часы в выходные").Tooltip(hoursTooltop), $u.element("todayHours").Label("Часы сегодня").Tooltip(hhelp), $u.element("todayWkHours").Label("Часы вых. сегодня").Tooltip(hhelp), $u.element("hoursBefore").Label("Часы до начала").AsNumber().Tooltip("Минимальное кол-во часов до бронирования"), $u.element("minHours").Label("Мин.длительность - заранее, заранее вых, сег, сег вых. Пример: 2,3,1", 'top')
                        .Tooltip('Минимальная длительность бронирования - можно задавать частично, по умолчанию берется левая цифра, например: 2,0,3'), $u.element("square").Label("Площадь").AsInt().Require().Tooltip("Укажите фактическую площадь комнаты в виде цифры. Например: 35"), $u.element("features").Label("Доп.параметры комнаты", "top").AsMultiSelect([]).Tooltip("Выберите параметры, соответствующие комнате"), $u.element("raider").Label("Райдер").AsTextArea().Autoheight().Min(0, 150).Require().Tooltip("Введите список оснащения комнаты. Аппарат, приспособления, цветовая гамма и оформление"), $u.element("channelIds").Label("Способы оплаты").AsMultiSelect(paychannels.db.names())), $u.rows($u.element("videoUrl").Label("Ссылка на видео").Tooltip("Вставьте ссылку на видео презентацию комнаты"), this.urlView.$config().Size(0, 150), $u.cols(uploader, this.files.btnDel().extend({
                        on: {
                            onItemClick: function (id, e) {
                                var arr = me.files.data().config.store.order;
                                var s = me.form.values();
                                var temp = [];
                                s.files.forEach(function (element) {
                                    var yes = arr.find(element.id);
                                    if (yes == -1) {
                                        resources.db.delete(element.id);
                                        temp.insert(0, element);
                                    }
                                });
                                temp.forEach(function (element) {
                                    s.files.remove(element);
                                });
                                me.form.setValues(s);
                            },
                        }
                    })), this.files.config().extend({
                        drag: "move",
                        select: true,
                        on: {
                            onAfterDrop: function (data, e) {
                                var s = me.form.values();
                                var arr = me.files.data().config.store.order;
                                var k = 0;
                                if (s.files.length != 0) {
                                    arr.each(function (element) {
                                        s.files.findById(element).sort = k;
                                        k++;
                                    });
                                    me.form.setValues(s);
                                }
                            }
                        },
                    }).Template("<img src='files/res/#value#' width1='150' height='250' />").ItemSize("auto", 250))),
                    {},
                ],
                scheme: {
                    $change: function (x) { return alert(x); },
                },
                rules: {
                    $obj: function (x, obj) {
                        var n = me.files.get().count();
                        return n > 2 || It.UI.w.error("Вставьте минимум 3 фото");
                    },
                }
            });
            return view;
        };
        EditView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.uploader.ref.addDropZone(this.files.ref.$view);
        };
        EditView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            this.uploader.set({
                formData: {
                    id: id,
                    kind: resources.ResourceKind.RoomPhoto,
                },
            });
            var obj = this.form.load(rooms.db.getUrl(id));
            this.files.refresh(obj.files);
            this.urlView.$reload(id);
            this.form.setElement("features", { suggest: groups.db.features({ sphere: obj.sphereId }) });
        };
        EditView.prototype.save = function () {
            if (!this.form.validate())
                return;
            this.form.values().files.forEach(function (element) {
                resources.db.save(element);
            });
            this.form.save(rooms.db.saveUrl(this.objectId), false);
            webix.message("Данные сохранены на сервере");
        };
        EditView.prototype.setSync = function () {
            It.Web.openUrl("#!/services/sync", { oid: this.objectId });
        };
        return EditView;
    }($u.View));
    rooms.EditView = EditView;
})(rooms || (rooms = {}));
var rooms;
(function (rooms) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("order").Header("⟠", 35).Sort().Edit().Tooltip("Сортировка в календаре"),
                    $u.column("name").Header("Название", 200).Sort().Filter().Template($u.getViewLink("rooms", "#name#")),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 150).Sort().Filter(),
                    $u.column("raider").Header("Райдер", -1).Filter(),
                    $u.column("square").Header("Площадь").AsInt().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("color").Header("Цвет").AsColor().Edit().Size(30).Sort(),
                    $u.column("allowMobile").Header("Моб").AsCheckboxReadly().Sort(),
                    $u.column("shareId").AsSelect(rooms.db.names()).Header("Общая комната", 150).Sort().Filter(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    color: "#f89623",
                },
                type: {
                    href: "#!",
                },
                save: rooms.db.getSaveCfg(true),
            }).Editable();
            var view = {
                rows: [
                    $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}),
                    gridCfg,
                ],
            };
            return view;
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            this.refresh();
        };
        GridView.prototype.refresh = function () {
            var items = rooms.db.list();
            this.grid.refresh(items);
        };
        return GridView;
    }($u.View));
    rooms.GridView = GridView;
})(rooms || (rooms = {}));
var rooms;
(function (rooms_1) {
    rooms_1.create = {
        grid: function () { return new rooms_1.GridView(); },
        edit: function () { return new rooms_1.EditView(); },
    };
    var RoomsSource = (function (_super) {
        __extends(RoomsSource, _super);
        function RoomsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.itemsUrl = _this.url("list");
            _this.namesUrl = _this.url("names");
            _this.names = function (baseid, full) { return _this.load('names', { base: baseid, full: full }); };
            _this.units = function () { return _this.load("names").map(function (x) { return { id: x.id, key: x.id, label: x.value, base: x.baseId, order: x.order }; }); };
            return _this;
        }
        RoomsSource.prototype.allowTime = function (date1, date2, roomid, baseid, domainid) {
            var res = this.load("allowTime", { datefrom: date1, dateto: date2, room: roomid, base: baseid, domain: domainid });
            return res;
        };
        RoomsSource.prototype.allowHours = function (rooms, hours) {
            var res = this.loadStr("allowHours", { rooms: rooms, hours: hours });
            return res;
        };
        return RoomsSource;
    }(app.AppDataSource));
    rooms_1.db = new RoomsSource("rooms");
})(rooms || (rooms = {}));
var prices;
(function (prices) {
    var EditForm = (function () {
        function EditForm() {
            this.full = false;
            this.form = new $u.RefForm();
        }
        EditForm.prototype.config = function () {
            var hhelp = "Укажите цену за час по Будням и по Выходным (С помощью полей «Перв. Раб. И Посл. Раб. Можно настроить отдельную цену по понедельникам и по пятницам). Если цена за 3 часа не делится на ровное число, указывайте ближайшее число до «,», платформа округлит это число при формировании цены. Например, если три часа в выбранной комнате стоят 1100, то в полях необходимо указать цифру 367 (366,6)";
            var help4 = "Выберете календарный период действия параметров условия";
            var promos = promo.db.names(true, promo.PromoKind.Rules);
            var formCfg = this.form.config().Labels(100).extend({
                gravity: 0.5,
                elements: [
                    $u.element("baseId").Label("База", "top").AsSelect(bases.db.namesUrl).Visible(this.full).Tooltip("Выберите объект на котором будет действовать созданная цена"),
                    $u.element("roomId").Label("Комната", "top").AsSelect(rooms.db.names(undefined, true)).Visible(this.full).Tooltip("Выберите комнату в которой будет действовать созданная цена"),
                    $u.element("timeFrom").Label("С, час").AsCounter(0, 24).Require().Tooltip("Укажите промежуток действия выбранной цены"),
                    $u.element("timeTo").Label("По, час").AsCounter(0, 24).Require().Tooltip("Укажите промежуток действия выбранной цены"),
                    $u.element("workingFPrice").Label("Раб.Перв").Tooltip(hhelp),
                    $u.element("workingPrice").Label("Рабочие").Require().Tooltip(hhelp),
                    $u.element("workingLPrice").Label("Раб.Посл").Tooltip(hhelp),
                    $u.element("weekend1Price").Label("СБ").Require().Tooltip(hhelp),
                    $u.element("weekend2Price").Label("ВС").Require().Tooltip(hhelp),
                    $u.element("promoId").Label("Условие", "top").AsSelect(promos).Tooltip("Выберите условие при котором будет действовать созданная цена, например, условие для сольных репетиций. Условия создаются в разделе «Ценообразование»"),
                    $u.element("dateFrom").Label("Начало").AsDate().Tooltip(help4),
                    $u.element("dateTo").Label("Окончание").AsDate().Tooltip(help4),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    {},
                ],
            });
            return formCfg;
        };
        return EditForm;
    }());
    prices.EditForm = EditForm;
})(prices || (prices = {}));
var app;
(function (app) {
    console.log("booking-ap-lib: v2022-06-09 (1)");
    webix.i18n.setLocale('ru-RU');
    It.UI.coreLocale.Err.AccessError = 'Нет прав или истек срок действия для Вашего аккаунта. <p/>Для возобновления работы необходимо выполнить вход повторно' +
        'Выполнить вход'.link('access#!/access/login').tag('h3', { style: 'background-color: orange; margin: 10px;' }) +
        'Или перейти в Начало работы'.link('/').tag('h6');
    if (location.hostname == "" || location.hostname == 'localhost') {
        It.Web.WebSource.base = location.protocol + '//' + location.host;
    }
    webix.require.disabled = true;
    function init() {
        var _webix = webix;
        if (webix.env.mobile) {
            webix.skin.set('touch');
        }
        else {
            It.UI.Configs.defaults.padding = 5;
        }
        _webix.require.disabled = true;
        It.Web.auth.tokens.check();
        access.checkLogin();
        system.loadContext();
        help.load();
        It.Web.bindSocket('changes', (system.context || { login: 'guest' }).login, function (data) {
            return console.log('socket changes:', data);
        });
    }
    app.init = init;
    function run() {
        new $u.HtmlView("http->html/intro.html", "Краткое описание").show();
    }
    app.run = run;
    app.create = {
        default: function () { return new $u.HtmlView('http->' + It.Web.WebSource.base + '/html/start.html', "Начало работы"); },
        default1: function () { return new $u.HtmlView('http->' + It.Web.WebSource.base + '/cms/hello.html', "Начало работы"); },
        html: function () { return new $u.HtmlView(); },
    };
})(app || (app = {}));
var booking;
(function (booking) {
    function run() {
        var menu = getMenu();
        root(menu);
    }
    booking.run = run;
    booking.create = {
        default: function () { return new $u.HtmlView("cms/hello.html"); },
    };
    function root(menu) {
        var navigator = new $u.Navigator();
        var navbar = new $u.RefUI();
        var sidebar = $u.sidebarMenu(menu);
        var helpBtn = new $u.RefUI();
        sidebar.OnItemSelect(function (item) {
            if (item.url)
                It.Web.openUrl(item.url);
            navbar.set({ data: { value: item.value || "", description: item.description || "", } });
            document.title = item.value;
        });
        navigator.view.onOpen.on(function (x) {
            var h = help.config.current(location.hash || "./");
            helpBtn.visible(!!h);
            if (h) {
                helpBtn.set({ tooltip: h.text });
            }
            if (!x.init || !x.init.title)
                return;
            var title = x.init.title;
            var data = { value: title, description: "" };
            navbar.set({ data: data });
        });
        function openHelp() {
            It.Web.openUrl(help.config.current().url, null, true);
        }
        var root = {
            padding: 10,
            id: "app-root1",
            rows: [
                header(),
                infoBar(),
                $u.panelbar($u.sidebarButton(sidebar), $u.icon("question").Click(function (_) { return openHelp(); }).Ref(helpBtn), $u.template("<b>#value#</b><span/>  #description#", { value: "", description: "" }).Css("it-header-nav").Ref(navbar).Size(-1, 33), $u.icon("close").Click(function (_) { return navigator.close(); })),
                {
                    responsive: "app-root1",
                    cols: [
                        sidebar.Min(10, 100).extend({ collapsed: webix.env.mobile }),
                        $u.splitter().Visible(!webix.env.mobile),
                        navigator.view.$config().Min(450),
                    ]
                },
                footer(),
            ]
        };
        var scroll = {
            view: "scrollview",
            body: root,
        };
        $u.showView(scroll);
        navigator.routers("app");
        webix.ui.fullScreen();
    }
    booking.root = root;
    function getMenu() {
        var ctx = system.context;
        if (!ctx)
            return [
                { value: "Регистрация", url: "#!/domains/reg", description: "Регистрация нового партнера", visible: true, },
            ];
        var ops = auth.oper;
        var allowSuper = ctx.isSuper;
        var allowCrmView = allowSuper && ctx.allow(ops.crmView);
        var logged = !!ctx.login;
        var allowLists = ctx.allow(ops.lists);
        var allowClients = ctx.allow(ops.clients);
        var allowDomains = ctx.allow(ops.domainsEdit);
        var allowUsers = ctx.allow(ops.users);
        var allowOrders = ctx.allow(ops.orders);
        var allowPromo = ctx.allow(ops.promo);
        var allowDomainsAll = ctx.allow(ops.domainsAll);
        var allowReports = allowOrders;
        var menu_data = [
            {
                value: "Справочники", url: "#!/app/lists", icon: "table", description: "Общие справочники системы", visible: allowLists && allowSuper, data: [
                    { value: "Сферы деятельности", url: "#!/spheres/list", description: "Сферы деятельности", visible: allowLists, },
                    { value: "Типы фильтрации", url: "#!/groups/ftypes", description: "Типы фильтрации", visible: allowLists, },
                    { value: "Параметры комнат", url: "#!/groups/features", description: "Ввод параметров (особенностей) комнаты", visible: allowLists, },
                    { value: "Типы позиций", url: "#!/groups/equipments", description: "Ввод типов позиций", visible: allowLists, },
                    { value: "Опции брони", url: "#!/groups/options", description: "Опции бронирования", visible: allowLists, },
                    { value: "Даты", url: "#!/days/grid", description: "Праздники и выходные", visible: allowLists },
                ],
            },
            {
                value: "Справочники", url: "#!/app/lists", icon: "table", description: "Общие справочники системы", visible: allowLists && !allowSuper, data: [
                    { value: "Базы", url: "#!/bases/grid", description: "Редактирование баз", visible: ctx.allow(ops.listBases), },
                    { value: "Комнаты", url: "#!/rooms/grid", description: "Редактирование комнат", visible: ctx.allow(ops.listBases), },
                    { value: "Позиции", url: "#!/equipments/grid", description: "Ввод позиций", visible: ctx.allow(ops.equipments), },
                    { value: "Камеры", url: "#!/resources/cameras", description: "Просмотр камер", visible: ctx.allow(ops.cameras), },
                    { value: "Статьи расходов", url: "#!/groups/expenses", description: "Ввод статей расходов", visible: ctx.allow(ops.expGroups), },
                    { value: "Способы оплаты", url: "#!/paychannels/grid", description: "Каналы оплат", visible: allowUsers, },
                ]
            },
            {
                value: "CRM", url: "#!/app/lists", icon: "users", description: "Управление клиентами", visible: logged && !allowSuper, data: [
                    { value: "Клиенты", url: "#!/clients/list", description: "Поиск клиентов", visible: allowClients, },
                    { value: "Группы клиентов", url: "#!/groups/clients", description: "Справочник групп клиентов", visible: allowLists, },
                ]
            },
            {
                value: "CRM", url: "#!/app/lists", icon: "users", description: "Управление клиентами", visible: logged && allowSuper, data: [
                    { value: "Клиенты", url: "#!/clients/list", description: "Поиск клиентов", visible: allowClients, },
                    { value: "Анализ клиентов", url: "#!/clients/totals", description: "Анализ клиентской базы", visible: allowCrmView, },
                    { value: "Группы клиентов (все)", url: "#!/groups/allclients", description: "Справочник всех групп клиентов", visible: allowCrmView, },
                    { value: "Виды деятельности", url: "#!/groups/client-types", description: "Справочник видов деятельности", visible: allowCrmView, },
                    { value: "Города", url: "#!/groups/cities", description: "Справочник городов", visible: allowCrmView, },
                    { value: "Стили танцев", url: "#!/groups/styles", description: "Справочник стилей танцев", visible: allowCrmView, },
                    { value: "Инструменты", url: "#!/groups/tools", description: "Справочник музыкальных инструментов", visible: allowCrmView, },
                    { value: "Жанры", url: "#!/groups/genres", description: "Справочник жанров", visible: allowCrmView, },
                    { value: "Уровень навыков", url: "#!/groups/sources", description: "Справочник уровней навыков", visible: allowCrmView, },
                ]
            },
            {
                value: "Цены и промоакции", url: "#!/app/lists", icon: "dollar", description: "Прайсы, цены, и промоакции", visible: allowPromo, data: [
                    { value: "Промоакции (коды)", url: "#!/promo/codegrid", description: "Ввод числовых промоакций для мобильных", visible: allowSuper && allowPromo },
                    { value: "Правила отмены (общ) ", url: "#!/order_rules/grid", description: "Правила отмены брони (общие)", visible: allowSuper && allowPromo },
                    { value: "Цены", url: "#!/prices/grid", description: "Все базовые цены общим списком", visible: allowPromo && !allowSuper },
                    { value: "Условия", url: "#!/promo/rulesgrid", description: "Ввод условий ценообразования", visible: allowPromo && !allowSuper },
                    { value: "Правила отмены", url: "#!/order_rules/grid", description: "Правила отмены брони", visible: allowPromo && !allowSuper },
                    { value: "Промоакции (кампании)", url: "#!/promo/actgrid", description: "Ввод списков промоакций", visible: allowPromo && !allowSuper },
                    { value: "Горящие репетиции", url: "#!/promo/hotgrid", description: "Ввод горящих репетиций", visible: allowPromo && !allowSuper },
                    { value: "Автоскидки", url: "#!/discounts/grid", description: "Автоматические скидки на клиентов", visible: allowPromo && !allowSuper, },
                ]
            },
            {
                value: "Бронирование", url: "#!/app/lists", icon: "calendar", description: "Операции с бронью", visible: allowOrders && allowSuper, data: [
                    { value: "Отзывы (модерация)", url: "#!/reviews/grid-all", description: "Модерация рейтингов и отзывов", visible: allowOrders && allowSuper },
                ]
            },
            {
                value: "Бронирование", url: "#!/app/lists", icon: "calendar", description: "Операции с бронью", visible: allowOrders && !allowSuper, data: [
                    { value: "Календарь", url: "#!/orders/calendar", description: "Бронирование заказов", visible: allowOrders && !allowSuper },
                    { value: "Заявки", url: "#!/orders/requests", description: "Управление заявками", visible: allowOrders && !allowSuper },
                    { value: "Абонементы", url: "#!/abonements/grid", description: "Управление абонементами", visible: ctx.allow(ops.abonements) && !allowSuper },
                    { value: "Штрафы (подтв)", url: "#!/orders/ask-grid", description: "Запросы на подтверждение штрафов у диспетчеров", visible: ctx.allow(ops.orderForfeit) && !allowSuper },
                    { value: "Штрафы (брони)", url: "#!/orders/forfeits", description: "Список броней со штрафами", visible: ctx.allow(ops.orderForfeit) && !allowSuper },
                    { value: "Штрафники", url: "#!/clients/forfeits", description: "Список клиентов со штрафами", visible: ctx.allow(ops.orderForfeit) && !allowSuper, },
                    { value: "Рейтинги и Отзывы", url: "#!/reviews/grid", description: "Рейтинги и отзывы", visible: ctx.allow(ops.reviews) && !allowSuper },
                ]
            },
            {
                value: "Учет и отчеты", url: "#!/app/lists", icon: "cubes", description: "Различные отчеты", visible: allowReports, data: [
                    { value: "Статистика брони", url: "#!/orders/filter-grid", description: "Статистика по бронированиям", visible: ctx.allow(ops.statisticPromo) && !allowSuper },
                    { value: "Стат.брони (адм)", url: "#!/orders/filter-grid-full", description: "Полная статистика по бронированиям (админ)", visible: allowSuper && allowReports },
                    { value: "Движение", url: "#!/orders/totals", description: "Отчет по движению денег по базам", visible: ctx.allow(ops.accounts) && !allowSuper },
                    { value: "Транзакции", url: "#!/trans/grid", description: "Список транзакций", visible: allowSuper && allowReports },
                    { value: "Транзакции-Куб", url: "#!/trans/totals", description: "Анализ транзакций", visible: allowSuper && allowReports },
                    { value: "Остатки", url: "#!/equipments/totals", description: "Отчет по остаткам доп.оборудования", visible: ctx.allow(ops.eqRest) && !allowSuper },
                    { value: "Расходные документы", url: "#!/expenses/grid", description: "Ввод расходных документов", visible: (ctx.allow(ops.expDocs) || ctx.allow(ops.expDocsAdmin)) && !allowSuper, },
                ]
            },
            {
                value: "Администрирование", url: "#!/app/lists", icon: "user", description: "Администрирование системы", visible: allowUsers || allowDomains, data: [
                    { value: "Роли", url: "#!/roles/grid", description: "Роли", visible: allowUsers, },
                    { value: "Доступ", url: "#!/permissions/grid", description: "Права на операции", visible: allowUsers, },
                    { value: "Сотрудники", url: "#!/users/grid", description: "Ввод сотрудников", visible: allowUsers, },
                    { value: "Настройки", url: "#!/settings_ui/edit", description: "Настройки системы", visible: allowSuper && allowUsers, },
                    { value: "Партнеры", url: "#!/domains/grid", description: "Партнерские зоны доступа", visible: allowSuper && allowDomainsAll, },
                    { value: "Статистика партнеры", url: "#!/orders/totalscom", description: "Отчет по партнерской комиссии", visible: allowSuper && allowDomainsAll },
                    { value: "Тарифы", url: "#!/tarifs/grid", description: "Управление тарифами", visible: allowSuper && allowUsers, },
                    { value: "Версии (ред)", url: "#!/groups/edversions", description: "Редактирование версий", visible: allowSuper && allowUsers, },
                    { value: "Шаблоны", url: "#!/templates/grid", description: "Настройки шаблонов e-mail", visible: allowSuper && allowUsers, },
                    { value: "Параметры", url: "#!/configs/grid", description: "Ввод настроечных параметров", visible: allowSuper && allowUsers, },
                    { value: "Календари", url: "#!/calendars/grid", description: "Настройка синхронизации с календарями", visible: allowUsers && !allowSuper, },
                    { value: "Кабинет", url: "#!/domains/service", description: "Управление партнерской зоной доступа", visible: allowUsers && !allowSuper, },
                    { value: "IP доступ", url: "#!/rules/grid", description: "Правила доступа (IP фильтры)", visible: ctx.allow(ops.editIP) && !allowSuper, },
                    { value: "Рассылки", url: "#!/mailings/grid", description: "Управление почтовыми рассылками", visible: allowSuper && allowUsers, },
                ]
            },
            {
                value: "Общее", icon: "question-circle", description: "Общие операции", visible: logged, data: [
                    { value: "Версии (20.6.16)", url: "#!/groups/versions", description: "Просмотр версий", visible: logged, },
                ]
            },
        ];
        return menu_data;
    }
    function infoBar() {
        if (system.context) {
            var ctx = system.context;
            if (ctx.isLimit)
                return $u.label("Доступ к системе заблокирован").Css("it-error").Size(-1);
            if (ctx.isLimit0) {
                var txt = "\u0414\u043E \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F \u0441\u0440\u043E\u043A\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C ".concat(ctx.remains, " \u0434\u043D. <br/>\n").concat(webix.i18n.dateFormatStr(ctx.limitDate), " (7 \u0434\u043D\u0435\u0439 \u0441 \u0432\u044B\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0441\u0440\u043E\u043A\u0430 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u044B) \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0431\u0443\u0434\u0435\u0442 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430. \n\u041F\u0440\u043E\u0434\u043B\u0435\u043D\u0438\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u0440\u0430\u0437\u0434\u0435\u043B\u0435 \"\u041A\u0430\u0431\u0438\u043D\u0435\u0442\" ");
                return $u.template(txt).Css("it-error").Size(-1);
            }
        }
        return { height: 1 };
    }
    function header() {
        var popup = new $u.RefUI();
        var cfg = $u.cols($u.template('img/logo-2018.png'.img({ class: 'it-header-img-top' }).link("./")), {}, auth_logins.btLoginName(system.context.login + (system.context.isSuper ? ' (super)' : '')).Size(90), auth_logins.btLoginOut("access").Size(60)).Type("clean").Size(0, 40);
        return cfg;
    }
    function footer() {
        var _a;
        if (!((_a = system.context) === null || _a === void 0 ? void 0 : _a.browser))
            return {};
        var copyright = system.context.browser.copyright;
        return $u.template(copyright).Size();
    }
})(booking || (booking = {}));
var clients;
(function (clients) {
    var CreateView = (function (_super) {
        __extends(CreateView, _super);
        function CreateView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreateView.prototype.$config = function () {
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.label("Создание нового клиента").Css("it-header"),
                    $u.element("lastName").Label("Фамилия").Require(),
                    $u.element("firstName").Label("Имя").Require(),
                    $u.element("surName").Label("Отчество"),
                    $u.element("email").Label("Почта"),
                    $u.element("phone").Label("Телефон                  +7").Require(),
                    $u.element("dateBirthday").Label("Дата рождения").AsDate(),
                    $u.element("music").Label("О себе"),
                    $u.element("typeInfo").Label("Тип").Tooltip("Операционная система. Модель устройства"),
                    $u.element("gender").Label("Пол").AsSelect(clients.genders),
                    $u.element("types").Label("Виды деятельности").AsMultiSelect(groups.db.names(groups.GroupType.ActivityType)),
                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)),
                    $u.element("tools").Label("Муз.инструмент").AsMultiSelect(groups.db.names(groups.GroupType.Tool)),
                    $u.element("styles").Label("Стиль танца").AsMultiSelect(groups.db.names(groups.GroupType.MusicStyle)),
                    $u.element("spheres").Label("Сферы деят.").AsMultiSelect(spheres.db.names()),
                    $u.element("genres").Label("Муз. жанр").AsMultiSelect(groups.db.names(groups.GroupType.Genre)),
                    $u.element("sourceId").Label("Уровень навыков").AsSelect(groups.db.names(groups.GroupType.Skill)),
                    $u.element("vkUrl").Label("Страница в ВК"),
                    $u.element("sourceUrl").Label("Instagram"),
                    _super.prototype.$config.call(this, "Создать"),
                ],
            });
            return formCfg;
        };
        CreateView.prototype.invokeAction = function (vals) {
            this.clientObject = clients.db.save(vals);
            _super.prototype.invokeAction.call(this, vals);
            this.$clear();
            this.hide();
            webix.message("Клиент успешно создан");
        };
        return CreateView;
    }($u.PopupView));
    clients.CreateView = CreateView;
})(clients || (clients = {}));
var clients;
(function (clients) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.messagesView = new messages.ListView(_this);
            _this.phonesView = new resources.PhonesView(resources.ResourceKind.ClientPhone, "Телефоны").owner(_this);
            _this.transView = new trans.PartGridView(_this);
            _this.save_btn = new $u.RefUI();
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var w = 100;
            var allowSuper = clients.logic.allowSuper();
            var allowEdit = system.context.allowCrmEdit();
            var toolbar = $u.panelbar($u.button("Сохранить").Click(function () { return _this.save(); }).Ref(this.save_btn), {});
            var form = this.form.config().Labels(150).extend({
                labelWidth: 300,
                cols: [
                    $u.rows($u.cols($u.rows($u.element("lastName").Label("Фамилия").Require().Readonly(!allowEdit), $u.element("firstName").Label("Имя").Require().Css("it-warning").Readonly(!allowEdit), $u.element("surName").Label("Отчество").Readonly(!allowEdit), $u.element("email").Label("Почтовый адрес").Require().Readonly(!allowEdit), $u.element("dateBirthday").Label("Дата рождения").AsDate().Readonly(!allowEdit)).Size(-3), $u.rows($u.uploader("api/core/upload-image", function (x, y, z) { return _this.setImage(y); }).extend({
                        name: "uploader",
                        value: "Фотография",
                        accept: "image/*",
                        datatype: "json",
                        formData: {
                            folder: 'users/' + system.context.id,
                        },
                    }).Visible(allowEdit), $u.element("photoUrl").AsTemplate(function (x) { return ('res/' + x).img({ height: '110px', width: '100%' }); })).Size(-1)), $u.element("groups").Label("Группы клиента").AsMultiSelect(groups.db.names(groups.GroupType.ContactType, true)).Readonly(!allowEdit), $u.element("discount").Label("Скидка клиента, %").Tooltip("Постоянная скидка клиенту от партнера").Readonly(!allowEdit), $u.element("forfeit").Label("Штрафы").Disable().Tooltip("Ранее начисленные штрафы").Readonly(!allowEdit), $u.element("isBanned").Label("Заблокирован").AsCheckbox().Readonly(!allowEdit), $u.element("payKind").Label("Способ оплаты").AsSelect(clients.payKinds).Readonly(!allowEdit), $u.element("notifications").Label("Уведомления").AsMultiSelect(app.notifications).Readonly(!allowEdit), this.phonesView.$config(allowEdit).Size(0, 150).Disable(!allowEdit)),
                    $u.rows($u.element("music").Label("О себе").Readonly(!allowEdit), $u.element("typeInfo").Label("Данные об устройстве").Tooltip("Операционная система. Модель устройства").Readonly(!allowEdit), $u.element("gender").Label("Пол").AsSelect(clients.genders).Readonly(!allowEdit), $u.element("types").Label("Виды деятельности").AsMultiSelect(groups.db.names(groups.GroupType.ActivityType)).Readonly(!allowEdit), $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)).Readonly(!allowEdit), $u.element("tools").Label("Муз.инструмент").AsMultiSelect(groups.db.names(groups.GroupType.Tool)).Readonly(!allowEdit), $u.element("styles").Label("Стиль танца").AsMultiSelect(groups.db.names(groups.GroupType.MusicStyle)).Readonly(!allowEdit), $u.element("spheres").Label("Сферы деятельности").AsMultiSelect(spheres.db.names()).Readonly(!allowEdit), $u.element("genres").Label("Муз/жанр").AsMultiSelect(groups.db.names(groups.GroupType.Genre)).Readonly(!allowEdit), $u.element("sourceId").Label("Уровень навыков").AsSelect(groups.db.names(groups.GroupType.Skill)).Readonly(!allowEdit), $u.element("vkUrl").Label("Страница в ВК").Readonly(!allowEdit), $u.element("sourceUrl").Label("Instagram").Readonly(!allowEdit), $u.element("creator").Label("Кем создано").Disable().Visible(allowSuper).Readonly(!allowEdit)),
                ],
            });
            var tabs = $u.tabview()
                .Autoheight();
            if (allowSuper) {
                this.admOrdersView = new orders.AdminGridView(this);
                this.users = new users.GridView();
                this.faview = new favorites.GridView(this);
                tabs
                    .Tab("Транзакции", this.transView.$config())
                    .Tab("Брони (адм)", this.admOrdersView.$config())
                    .Tab("История", this.messagesView.$config())
                    .Tab("Избранное", this.faview.$config())
                    .Tab("Логины", this.users.$config());
            }
            else {
                this.docsView = new docs.GridView(this);
                this.htmlView = new clients.HtmlView().owner(this);
                tabs.Tab("Документы", this.docsView.$config())
                    .Tab("История", this.messagesView.$config())
                    .Tab("Справка", this.htmlView.$config());
            }
            var view = $u.rows(toolbar, form, tabs);
            return view;
        };
        EditView.prototype.setImage = function (img) {
            this.form.elements.photoUrl.setValues((img || {}).path);
        };
        EditView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var vals = this.form.load(clients.db.getUrl(id));
            var allowSuper = clients.logic.allowSuper();
            if (allowSuper) {
                this.faview.$reload(id);
                this.admOrdersView.reload({ client: id });
                this.transView.reload({ clientId: id });
                this.users.refresh(users.db.search(id));
            }
            else {
                this.docsView.filter.client = id;
                this.docsView.refresh();
                this.htmlView.$reload(id);
            }
            this.phonesView.$reload(id);
            this.messagesView.filter.client = id;
            this.messagesView.refresh();
            this.messagesView.setDefaults({ clientId: id });
            var enabled = clients.logic.allowEdit(vals);
            var allowFin = clients.logic.allowFin(vals);
            var allowDiscBan = clients.logic.allowDiscBan(vals);
            this.form.enable(enabled, "lastName");
            this.form.enable(enabled, "firstName");
            this.form.enable(enabled, "surName");
            this.form.enable(enabled, "email");
            this.form.enable(enabled, "dateBirthday");
            this.form.enable(enabled, "uploader");
            this.form.enable(allowFin, "forfeit");
            this.form.enable(allowDiscBan, "discount");
            this.form.enable(allowDiscBan, "isBanned");
            this.form.enable(allowDiscBan, "payKind");
            this.form.enable(enabled, "music");
            this.form.enable(enabled, "typeInfo");
            this.form.enable(enabled, "gender");
            this.form.enable(enabled, "groups");
            this.form.enable(enabled, "types");
            this.form.enable(enabled, "cityId");
            this.form.enable(enabled, "tools");
            this.form.enable(enabled, "styles");
            this.form.enable(enabled, "spheres");
            this.form.enable(enabled, "genres");
            this.form.enable(enabled, "sourceId");
            this.form.enable(enabled, "vkUrl");
            this.form.enable(enabled, "sourceUrl");
            this.phonesView.enable(enabled);
        };
        EditView.prototype.save = function () {
            if (!this.form.validate())
                return;
            var vals = this.form.save(clients.db.saveUrl(this.objectId), false);
            var has_part = !clients.logic.allowSuper();
            if (has_part) {
                var part = {
                    id: vals.partId,
                    isBanned: vals.isBanned,
                    payKind: vals.payKind,
                    discount: vals.discount,
                    forfeit: vals.forfeit,
                    assignedName: vals.assignedName,
                    editorName: vals.editorName,
                };
                clients.partsdb.save(part);
                this.htmlView.$reload(this.objectId);
            }
            webix.message("Данные о клиенте сохранены");
        };
        return EditView;
    }($u.View));
    clients.EditView = EditView;
})(clients || (clients = {}));
var clients;
(function (clients) {
    var FilterView = (function (_super) {
        __extends(FilterView, _super);
        function FilterView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FilterView.prototype.$config = function () {
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("text").Label("ФИО, тел, email"),
                    $u.element("dfrom").Label("Дата с").AsDate(),
                    $u.element("dto").Label("По").AsDate(),
                    $u.element("domain").Label("Партнер").AsSelect(domains.db.namesUrl),
                    _super.prototype.$config.call(this),
                ],
            });
            return formCfg;
        };
        return FilterView;
    }($u.PopupView));
    clients.FilterView = FilterView;
})(clients || (clients = {}));
var clients;
(function (clients) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.createView = new clients.CreateView().onAction(function (vals) { return _this.add(vals); });
            _this.form = new $u.RefForm();
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
            var filterFormCfg = this.form.config().extend({
                cols: [
                    $u.button("Создать").Popup(this.createView.$config()),
                    $u.icon("file-excel-o").Click(function () { return _this.exportxlsx(); }).Tooltip("Экспортировать в Ексел"),
                    $u.icon("database").Click(function () { return _this.exportocsv(); }).Tooltip("Экспортировать в csv"),
                    {},
                    $u.element("group").Label("Группа", null, 60).AsSelect(groups.db.names(groups.GroupType.ContactType, true)),
                    $u.element("text").Label("Поиск", null, 60).Tooltip("Поиск по ФИО, тел, email").AsSearch(function () { return _this.search(); }),
                ],
            });
            var fioLink = $u.getViewLink("clients", "(...)");
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("link").Header("", 40).Template(fioLink),
                    $u.column("fio").Header("ФИО", -1),
                    $u.column("email").Header("e-mail", 150),
                    $u.column("phones").Header("Телефоны", 150)
                ]
            });
            var cfg = $u.rows(filterFormCfg, gridCfg);
            return cfg;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
        };
        GridView.prototype.add = function (vals) {
            var _this = this;
            var g = this.grid;
            g.callNoEvents(function () { return g.add({
                id: _this.createView.clientObject.id,
                fio: vals.firstName + " " + vals.lastName,
                email: vals.email,
                phones: vals.phones,
            }); });
        };
        GridView.prototype.clear = function () {
            this.form.clear();
            this.search(false);
        };
        GridView.prototype.search = function (message) {
            if (message === void 0) { message = true; }
            var vals = this.form.values();
            var list = clients.db.items({ filter: vals.text, group: vals.group });
            this.grid.refresh(list);
            if (message)
                webix.message("Показано не более 10 записей");
        };
        GridView.prototype.exportxlsx = function () {
            this.grid.toExcel({
                filename: "clients " + (new Date()).toLocaleDateString("ru"),
                name: "clients",
                filterHTML: true,
                columns: [
                    { id: "fio", name: "ФИО" },
                    { id: "email", name: "e-mail" },
                    { id: "phones", name: "Телефоны" }
                ]
            });
            console.log('export xlsx');
        };
        GridView.prototype.exportocsv = function () {
            webix.csv.delimiter.cols = ";";
            this.grid.exportToFileCSV({
                filename: "clients " + (new Date()).toLocaleDateString("ru"),
                name: "clients",
                filterHTML: true,
                columns: [
                    { id: "fio", name: "fio" },
                    { id: "email", name: "email" },
                    { id: "phones", name: "phones" }
                ]
            });
            console.log('export csv');
        };
        GridView.prototype.importfromcsv = function () {
            webix.message("Данные загружены");
            console.log('import from csv');
        };
        return GridView;
    }($u.View));
    clients.GridView = GridView;
})(clients || (clients = {}));
var clients;
(function (clients) {
    var HtmlView = (function (_super) {
        __extends(HtmlView, _super);
        function HtmlView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HtmlView.prototype.$reload = function (id) {
            var html = clients.db.html(id);
            this.setHtml(html);
        };
        return HtmlView;
    }($u.HtmlView));
    clients.HtmlView = HtmlView;
})(clients || (clients = {}));
var clients;
(function (clients) {
    var TotalsView = (function (_super) {
        __extends(TotalsView, _super);
        function TotalsView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pivot = new $u.RefPivot();
            _this.filterView = new clients.FilterView(_this);
            return _this;
        }
        TotalsView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            this.filterView.onAction(function () { return _this.refresh(); });
            var toolbar = $u.panelbar($u.button("Найти").Popup(this.filterView.$config(), function (_) { return _this.onPopup(); }), $u.icon("file-excel-o").Click(function () { return _this.export(); }).Tooltip("Экспортировать в Ексел"), {});
            var pivotCfg = this.pivot.config().extend({
                columnWidth: 80,
                fieldMap: {
                    domain: "Партнер",
                    name: "ФИО",
                    email: "Email",
                    city: "Город",
                    logins: "Логины",
                    orders: "Заказы",
                    reservs: "Резервы",
                    paids: "Оплаты",
                    cancels: "Отмены",
                    forfeits: "Штрафы",
                    sOrders: "₽Заказы",
                    sReservs: "₽Резервы",
                    sPaids: "₽Оплаты",
                    sCancels: "₽Отмены",
                    sForfeits: "₽Штрафы",
                    sDiscounts: "₽Скидки",
                },
                structure: {
                    filters: [
                        { name: "city", type: "select" },
                    ],
                    columns: [],
                    values: [
                        { name: "logins", operation: "sum" },
                        { name: "orders", operation: "sum" },
                        { name: "reservs", operation: "sum" },
                        { name: "paids", operation: "sum" },
                        { name: "cancels", operation: "sum" },
                        { name: "forfeits", operation: "sum" },
                        { name: "sOrders", operation: "sum" },
                        { name: "sReservs", operation: "sum" },
                        { name: "sPaids", operation: "sum" },
                        { name: "sCancels", operation: "sum" },
                        { name: "sForfeits", operation: "sum" },
                        { name: "sDiscounts", operation: "sum" },
                    ],
                    rows: ["domain", "name"],
                },
            });
            var view = $u.rows(toolbar, pivotCfg);
            return view;
        };
        TotalsView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.pivot.setConfig("pivot.client.totals");
        };
        TotalsView.prototype.onPopup = function () {
        };
        TotalsView.prototype.refresh = function () {
            var filter = this.filterView.values;
            var list = clients.db.totals(filter);
            this.pivot.refresh(list);
            webix.message("\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E ".concat(list.length, ", \u043D\u043E \u043D\u0435 \u0431\u043E\u043B\u0435\u0435 1000 \u0437\u0430\u043F\u0438\u0441\u0435\u0439"));
        };
        TotalsView.prototype.export = function () {
            this.pivot.toExcel({
                filename: "totals " + (new Date()).toLocaleDateString("ru"),
                name: "totals",
                filterHTML: true,
            });
        };
        return TotalsView;
    }($u.View));
    clients.TotalsView = TotalsView;
})(clients || (clients = {}));
var clients;
(function (clients) {
    clients.create = {
        list: function () { return new clients.GridView(); },
        edit: function () { return new clients.EditView(); },
        totals: function () { return new clients.TotalsView(); },
        forfeits: function () { return new clients.ForfeitGridView(); },
    };
    var ClientPayKind;
    (function (ClientPayKind) {
        ClientPayKind[ClientPayKind["Default"] = 1] = "Default";
        ClientPayKind[ClientPayKind["Trust"] = 2] = "Trust";
        ClientPayKind[ClientPayKind["Doubt"] = 3] = "Doubt";
        ClientPayKind[ClientPayKind["Card"] = 4] = "Card";
    })(ClientPayKind = clients.ClientPayKind || (clients.ClientPayKind = {}));
    clients.payKinds = [
        { id: ClientPayKind.Default, value: "По умолчанию" },
        { id: ClientPayKind.Trust, value: "Доверять" },
        { id: ClientPayKind.Doubt, value: "Сомневаться" },
        { id: ClientPayKind.Card, value: "Только по карте" },
    ];
    clients.genders = [
        { id: "m", value: "Муж" },
        { id: "w", value: "Жен" },
    ];
    var ClientsSource = (function (_super) {
        __extends(ClientsSource, _super);
        function ClientsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.searchUrl = _this.url("search");
            return _this;
        }
        ClientsSource.prototype.getClientName = function (obj) {
            if (!obj)
                return "";
            var name = "".concat(obj.firstName, " ").concat(obj.lastName, " ").concat(obj.surName, " ").concat(obj.phones, " ").concat(obj.email);
            return name;
        };
        ClientsSource.prototype.forfeits = function (args) {
            var list = this.load("forfeits", args);
            return list;
        };
        ClientsSource.prototype.items = function (args) {
            var list = this.load("list", args);
            return list;
        };
        ClientsSource.prototype.totals = function (args) {
            var list = this.load("totals", args, false);
            return list;
        };
        ClientsSource.prototype.html = function (id) {
            return this.loadStr("html/" + id);
        };
        return ClientsSource;
    }(app.AppDataSource));
    clients.db = new ClientsSource("clients");
    var ClientPartsSource = (function (_super) {
        __extends(ClientPartsSource, _super);
        function ClientPartsSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ClientPartsSource;
    }(app.AppDataSource));
    clients.partsdb = new ClientPartsSource("clientparts");
    clients.logic = {
        allowSuper: function () { return system.context.isSuper; },
        allowEdit: function (client) { return client.isDomain || system.context.isSuper; },
        allowFin: function (client) { return system.context.allow(auth.oper.clientFin); },
        allowDiscBan: function (client) { return system.context.allow(auth.oper.clientDiscBan); },
    };
    function getSearchColumn() {
        var col = $u.element("clientId")
            .Label("Клиент", "top")
            .AsSelect(clients.db.searchUrl)
            .Require()
            .Tooltip("Для поиска введите часть ФИО, mail или телефон")
            .Css("it-warning");
        return col;
    }
    clients.getSearchColumn = getSearchColumn;
    function getClientColumnTemplate(idCol, nameCol) {
        if (idCol === void 0) { idCol = "#clientId#"; }
        if (nameCol === void 0) { nameCol = "#client#"; }
        var res = "";
        if (system.context.allow(auth.oper.clients))
            res = $u.getViewLink("clients", nameCol, idCol);
        else
            res = nameCol;
        return res;
    }
    clients.getClientColumnTemplate = getClientColumnTemplate;
})(clients || (clients = {}));
var clients;
(function (clients) {
    var ForfeitGridView = (function (_super) {
        __extends(ForfeitGridView, _super);
        function ForfeitGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        ForfeitGridView.prototype.$config = function () {
            var _this = this;
            var fioLink = $u.getViewLink("clients", "#fio#");
            var toolbar = $u.cols($u.button("Обновить").Click(function (_) { return _this.$reload(); }), {});
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("fio").Header("ФИО", -1).Template(fioLink).Sort(),
                    $u.column("isBanned").Header("Бан").AsCheckboxReadly().Sort(),
                    $u.column("forfeit").Header("Штраф").AsInt().Footer().Sort(),
                    $u.column("orders").Header("Броней").AsInt().Footer().Sort(),
                    $u.column("last").Header("Посл.бронь").AsDate().Sort(),
                ],
            }).Footer();
            var cfg = $u.rows(toolbar, grid);
            return cfg;
        };
        ForfeitGridView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var list = clients.db.forfeits();
            this.grid.refresh(list);
        };
        return ForfeitGridView;
    }($u.View));
    clients.ForfeitGridView = ForfeitGridView;
})(clients || (clients = {}));
var groups;
(function (groups) {
    var EditForm = (function () {
        function EditForm(type, header) {
            if (header === void 0) { header = "Название"; }
            this.type = type;
            this.header = header;
            this.form = new $u.RefForm();
        }
        EditForm.prototype.config = function () {
            var _this = this;
            var form = this.form.config().extend({
                elements: [
                    $u.element("name").Label(this.header, "top"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                ],
            });
            if (this.type == groups.GroupType.Version)
                form.Elements($u.element("description").Label("E-mail партнера").AsHtmlEditor(300, "top"));
            if (this.type == groups.GroupType.Equipment || this.type == groups.GroupType.RoomFeature)
                form.Elements($u.element("description").Label("Описание").AsTextArea(100, "top"), $u.uploader("api/core/upload", function (x, y, z) { return _this.setImage(y); }).extend({
                    value: "Загрузить иконку",
                    formData: {
                        prefix: 'spheres',
                    },
                }), $u.element("icon").AsTemplate(function (x) { return ('res/' + x).img({ height: '50px', width: '50px' }); }));
            form.Elements({});
            return form;
        };
        EditForm.prototype.setImage = function (img) {
            this.form.elements.icon.setValues(img.path);
        };
        return EditForm;
    }());
    groups.EditForm = EditForm;
})(groups || (groups = {}));
var groups;
(function (groups) {
    var FormListView = (function (_super) {
        __extends(FormListView, _super);
        function FormListView(settings, template) {
            var _this = _super.call(this) || this;
            _this.settings = settings;
            _this.template = template;
            _this.list = new $u.RefList();
            _this.form = new groups.EditForm(_this.settings.type);
            return _this;
        }
        FormListView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var list = this.list.config().extend({
                template: this.template,
                type: {
                    href: "#!",
                    height: "auto",
                },
                scheme: {
                    id: -1,
                    name: this.settings.name || "новый элемент",
                    type: this.settings.type,
                },
            }).Editable(groups.db.getSaveCfg(true));
            var view = $u.rows($u.toolbar(this.list.btnAdd(undefined, 0), this.list.btnDel(), this.list.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.button("Сохранить").Click(function () { return _this.form.form.updateBindings(); })), $u.cols(list, this.form.config().Size(350)));
            return view;
        };
        FormListView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.form.bind(this.list);
        };
        FormListView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        FormListView.prototype.refresh = function () {
            var rows = groups.db.list(this.settings);
            this.list.refresh(rows);
        };
        return FormListView;
    }($u.View));
    groups.FormListView = FormListView;
})(groups || (groups = {}));
var groups;
(function (groups) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView(settings, header) {
            var _this = _super.call(this) || this;
            _this.settings = settings;
            _this.header = header;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var me = this;
            var allowCrmEdit = system.context.allowCrmEdit();
            var allowRange = this.settings.type == groups.GroupType.OrderOption;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column().AsOrderMarker().Visible(allowCrmEdit),
                    $u.column("domain").Header("Партнер", 180).Sort().Filter().Visible(this.settings.viewDomain),
                    $u.column("name").Header(this.header, 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly(!allowCrmEdit).Sort(),
                    $u.column("isRange").Header("Диапазон").AsCheckboxReadly(!allowCrmEdit).Sort().Visible(allowRange),
                ],
                scheme: {
                    id: -1,
                    name: "новый элемент",
                    type: this.settings.type,
                    index: 1000,
                },
                save: groups.db.getSaveCfg(true),
            });
            if (allowCrmEdit) {
                grid.Editable().DragOrder(function (start, ids) { return groups.db.reindex(start, ids); }, true);
            }
            if (this.settings.gps) {
                grid.Columns($u.column("gpsLat").Header("GPS Lat", 100).Sort().Edit(), $u.column("gpsLong").Header("GPS Long", 100).Sort().Edit());
            }
            var view = $u.rows($u.panelbar(this.grid.btnAdd().Visible(allowCrmEdit), this.grid.btnDel().Visible(allowCrmEdit), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}), grid);
            return view;
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        GridView.prototype.refresh = function () {
            var rows = groups.db.list(this.settings);
            this.grid.refresh(rows);
        };
        return GridView;
    }($u.View));
    groups.GridView = GridView;
})(groups || (groups = {}));
var groups;
(function (groups) {
    var ListView = (function (_super) {
        __extends(ListView, _super);
        function ListView(itemsArgs, template) {
            var _this = _super.call(this) || this;
            _this.itemsArgs = itemsArgs;
            _this.template = template;
            _this.list = new $u.RefList();
            return _this;
        }
        ListView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var list = this.list.config().extend({
                template: this.template,
                select: false,
                type: {
                    href: "#!",
                    height: "auto",
                },
            });
            var view = $u.rows($u.panelbar(this.list.btnRefresh(function (_) { return _this.refresh(); }), {}), list);
            return view;
        };
        ListView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        ListView.prototype.refresh = function () {
            var rows = groups.db.list(this.itemsArgs);
            this.list.refresh(rows);
        };
        return ListView;
    }($u.View));
    groups.ListView = ListView;
})(groups || (groups = {}));
var groups;
(function (groups) {
    groups.create = {
        equipments: function () { return new groups.EqTypesGridView(); },
        features: function () { return new groups.FeaturesGridView(); },
        ftypes: function () { return new groups.GridView({ type: GroupType.FeatureType }, "Типы параметров"); },
        clients: function () { return new groups.GridView({ type: GroupType.ContactType, domain: true }, "Группа клиентов"); },
        allclients: function () { return new groups.GridView({ type: GroupType.ContactType, viewDomain: true }, "Группа клиентов (все)"); },
        cities: function () { return new groups.GridView({ type: GroupType.City, gps: true }, "Город"); },
        'client-types': function () { return new groups.GridView({ type: GroupType.ActivityType }, "Тип клиента"); },
        styles: function () { return new groups.GridView({ type: GroupType.MusicStyle }, "Музыкальный стиль"); },
        tools: function () { return new groups.GridView({ type: GroupType.Tool }, "Музыкальный инструмент"); },
        activities: function () { return new groups.GridView({ type: GroupType.Activity }, "Вид деятельности"); },
        genres: function () { return new groups.GridView({ type: GroupType.Genre }, "Музыкальный жанр"); },
        sources: function () { return new groups.GridView({ type: GroupType.Skill }, "Источник клиента"); },
        expenses: function () { return new groups.GridView({ type: GroupType.Expense, domain: true }, "Статья расходов"); },
        options: function () { return new groups.GridView({ type: GroupType.OrderOption, domain: false }, "Опции брони"); },
        edversions: function () { return new groups.FormListView({ type: GroupType.Version, sort: "-date", name: "версия" }, 'http->' + It.Web.WebSource.base + '/html/group-list.html'); },
        versions: function () { return new groups.ListView({ type: GroupType.Version, sort: "-date", archive: false }, 'http->' + It.Web.WebSource.base + '/html/group-list.html'); },
        reviews: function () { return new groups.GridView({ type: GroupType.Reviews }, "Типы отзывов"); },
    };
    var GroupType;
    (function (GroupType) {
        GroupType[GroupType["Equipment"] = 1] = "Equipment";
        GroupType[GroupType["ContactType"] = 2] = "ContactType";
        GroupType[GroupType["City"] = 3] = "City";
        GroupType[GroupType["Tool"] = 4] = "Tool";
        GroupType[GroupType["MusicStyle"] = 5] = "MusicStyle";
        GroupType[GroupType["ActivityType"] = 6] = "ActivityType";
        GroupType[GroupType["Skill"] = 7] = "Skill";
        GroupType[GroupType["Activity"] = 8] = "Activity";
        GroupType[GroupType["Genre"] = 9] = "Genre";
        GroupType[GroupType["RoomFeature"] = 10] = "RoomFeature";
        GroupType[GroupType["Expense"] = 11] = "Expense";
        GroupType[GroupType["Version"] = 12] = "Version";
        GroupType[GroupType["OrderOption"] = 14] = "OrderOption";
        GroupType[GroupType["FeatureType"] = 15] = "FeatureType";
        GroupType[GroupType["Reviews"] = 16] = "Reviews";
        GroupType[GroupType["Fin"] = 17] = "Fin";
    })(GroupType = groups.GroupType || (groups.GroupType = {}));
    var GroupsSource = (function (_super) {
        __extends(GroupsSource, _super);
        function GroupsSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.names = function (type, domain) { return _this.load("names", { type: type, domain: domain }); };
            _this.options = function () { return _this.load("options"); };
            _this.features = function (args) { return _this.load("features", args); };
            _this.reindex = function (start, ids) { return _this.post("reindex", { start: start, ids: ids }); };
            return _this;
        }
        return GroupsSource;
    }(app.AppDataSource));
    groups.db = new GroupsSource("groups");
})(groups || (groups = {}));
var groups;
(function (groups) {
    var FormGridView = (function (_super) {
        __extends(FormGridView, _super);
        function FormGridView(settings, header) {
            var _this = _super.call(this) || this;
            _this.settings = settings;
            _this.header = header;
            _this.grid = new $u.RefGrid();
            _this.form = new groups.EditForm(_this.settings.type);
            return _this;
        }
        FormGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                columns: [
                    $u.column().AsOrderMarker(),
                    $u.column("domain").Header("Партнер", 180).Sort().Filter().Visible(this.settings.viewDomain),
                    $u.column("name").Header(this.header, 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                    name: "новый элемент",
                    type: this.settings.type,
                    order: 1000,
                },
                save: groups.db.getSaveCfg(true),
            }).Editable().DragOrder(function (start, ids) { return groups.db.reindex(start, ids); }, true);
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.button("Сохранить").Click(function () { return _this.form.form.updateBindings(); })), $u.cols(grid, this.form.config().Size(350)));
            return view;
        };
        FormGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.form.bind(this.grid);
        };
        FormGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        FormGridView.prototype.refresh = function () {
            var rows = groups.db.list(this.settings);
            this.grid.refresh(rows);
        };
        return FormGridView;
    }($u.View));
    groups.FormGridView = FormGridView;
})(groups || (groups = {}));
var groups;
(function (groups) {
    var FeaturesGridView = (function (_super) {
        __extends(FeaturesGridView, _super);
        function FeaturesGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.form = new $u.RefForm();
            return _this;
        }
        FeaturesGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var me = this;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column().AsOrderMarker(),
                    $u.column("categoryId").Header("Тип", 150).Sort().AsSelect(groups.db.names(groups.GroupType.FeatureType)).Filter().Edit(),
                    $u.column("name").Header("Параметр", 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                    name: "новый параметр",
                    type: groups.GroupType.RoomFeature,
                    order: 1000,
                },
                save: groups.db.getSaveCfg(true),
            }).Editable().DragOrder(function (start, ids) { return groups.db.reindex(start, ids); }, true);
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.button("Сохранить").Click(function () { return _this.form.updateBindings(); })), $u.cols(grid, this.configForm().Size(350)));
            return view;
        };
        FeaturesGridView.prototype.configForm = function () {
            var _this = this;
            var form = this.form.config().extend({
                elements: [
                    $u.element("name").Label("Параметр комнаты", "top"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    $u.element("sphereIds").Label("Сферы", "top").AsMultiSelect(spheres.db.names()),
                    $u.uploader("api/core/upload", function (x, y, z) { return _this.setImage(y); }).extend({
                        value: "Загрузить иконку",
                        formData: {
                            prefix: 'spheres',
                        },
                    }),
                    $u.element("icon").AsTemplate(function (x) { return ('res/' + x).img({ height: '50px', width: '50px' }); }),
                    {},
                ]
            });
            return form;
        };
        FeaturesGridView.prototype.setImage = function (img) {
            this.form.elements.icon.setValues(img.path);
        };
        FeaturesGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.bind(this.grid);
        };
        FeaturesGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        FeaturesGridView.prototype.refresh = function () {
            var rows = groups.db.list({ type: groups.GroupType.RoomFeature });
            this.grid.refresh(rows);
        };
        return FeaturesGridView;
    }($u.View));
    groups.FeaturesGridView = FeaturesGridView;
})(groups || (groups = {}));
var promo;
(function (promo) {
    var ActGridView = (function (_super) {
        __extends(ActGridView, _super);
        function ActGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.formview = new promo.EditForm();
            return _this;
        }
        ActGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Название", 100).Sort().Error("Длина не более 10 символов").Filter(),
                    $u.column("discount").Header("Скидка", 60).AsInt().Sort().Filter(),
                    $u.column("description").Header("Описание", -1).Filter(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    type: promo.PromoKind.Action,
                },
                rules: {
                    "name": function (value) { return value && value.length <= 10; }
                },
                save: promo.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.toolbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.icon("save").Click(function (_) { return _this.formview.form.updateBindings(); })), $u.cols(gridCfg, $u.splitter(), this.formview.config()));
            return view;
        };
        ActGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.formview.form.bind(this.grid);
        };
        ActGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        ActGridView.prototype.refresh = function () {
            var list = promo.db.getItems(promo.PromoKind.Action);
            this.grid.refresh(list);
        };
        return ActGridView;
    }($u.View));
    promo.ActGridView = ActGridView;
})(promo || (promo = {}));
var promo;
(function (promo) {
    var CodeEditView = (function (_super) {
        __extends(CodeEditView, _super);
        function CodeEditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        CodeEditView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var ahelp = 'Список разрешенных зон, баз, или комнат';
            var dhelp = "Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»";
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("name").Label("Код").Disable(),
                    $u.element("discount").Label("Скидка, %"),
                    $u.element("discountSum").Label("Скидка, руб").Tooltip(dhelp),
                    $u.element("minHours").Label("Мин.часов").Tooltip("Минимальная длительность бронирования, часов"),
                    $u.element("isToday").Label("Сегодня").AsCheckbox().Tooltip("При выставлении этой галочки параметры условия будут работать только день в день (с 00:01 сегодняшней даты)"),
                    $u.element("allowDomainIds").Label("Разрешенные партнеры", "top").AsMultiSelect(domains.db.namesUrl).Tooltip(ahelp),
                    $u.element("allowBaseIds").Label("Разрешенные базы", "top").AsMultiSelect(bases.db.namesUrl).Tooltip(ahelp),
                    $u.element("allowRoomIds").Label("Или разрешенные комнаты", "top").AsMultiSelect(rooms.db.names(undefined, true)).Tooltip(ahelp),
                    $u.element("maxOrders").Label("Макс.заказов"),
                    $u.element("maxClientOrders").Label("Макс.по клиенту"),
                    $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    {},
                ],
            });
            return formCfg;
        };
        return CodeEditView;
    }($u.View));
    promo.CodeEditView = CodeEditView;
})(promo || (promo = {}));
var promo;
(function (promo) {
    var CodeGridView = (function (_super) {
        __extends(CodeGridView, _super);
        function CodeGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.formview = new promo.CodeEditView(_this);
            return _this;
        }
        CodeGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var ordersSearchUrl = $u.getLink("#name#", "orders/search-s/#id#?promo=#id#");
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("ПромоКод", 100).Sort().Error("Длина не более 10 символов")
                        .Template(ordersSearchUrl),
                    $u.column("discount").Header("Скидка", 60).AsInt().Sort(),
                    $u.column("maxOrders").Header("Заказы", 60).AsInt().Sort(),
                    $u.column("maxClientOrders").Header("Клиенты", 62).AsInt().Sort(),
                    $u.column("description").Header("Описание", -1),
                ],
                scheme: {
                    id: -1,
                    name: "",
                    type: promo.PromoKind.Number,
                },
                rules: {},
                save: promo.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.icon("save").Click(function (_) { return _this.formview.form.updateBindings(); })), $u.cols(gridCfg, $u.splitter(), this.formview.$config()));
            return view;
        };
        CodeGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.formview.form.bind(this.grid);
        };
        CodeGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        CodeGridView.prototype.refresh = function () {
            var list = promo.db.numItems();
            this.grid.refresh(list);
        };
        return CodeGridView;
    }($u.View));
    promo.CodeGridView = CodeGridView;
})(promo || (promo = {}));
var promo;
(function (promo) {
    var EditActView = (function (_super) {
        __extends(EditActView, _super);
        function EditActView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        EditActView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("name").Label("Имя"),
                    $u.element("discount").Label("Скидка, %"),
                    $u.element("discountSum").Label("Скидка, руб"),
                    $u.element("eqDiscount").Label("Скидка,% оборуд."),
                    $u.element("clientDiscountKind").Label("Скидка клиента").AsSelect(app.discountKinds),
                    $u.element("isArchive").Label("Блокировать").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(200),
                    {},
                ],
            });
            return formCfg;
        };
        return EditActView;
    }($u.View));
    promo.EditActView = EditActView;
})(promo || (promo = {}));
var promo;
(function (promo) {
    var EditForm = (function () {
        function EditForm() {
            this.form = new $u.RefForm();
        }
        EditForm.prototype.config = function () {
            var dhelp = "Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»";
            var chelp = "Укажите будет ли распространяться скидка из карточки клиента на комнату или позиции у созданного условия. Например, у клиента 10% скидка на все услуги, но при бронировании комнаты попадающей под созданное условие скидка на комнату и оборудование не будет учитываться если выбрать значение «Блокируем» в обоих полях";
            var ahelp = "Выберите на каком объекте или в каких комнатах будут действовать параметры этого условия. Поля взаимоисключающие, это значит, что заполнено должно быть только одно (либо комнаты, либо базы).";
            var help4 = "Выберете календарный период действия параметров условия";
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("name").Label("Имя").Tooltip("Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»"),
                    $u.element("discount").Label("Скидка, %").Tooltip(dhelp),
                    $u.element("discountSum").Label("Скидка, руб").Tooltip(dhelp),
                    $u.element("eqDiscount").Label("Скидка,% оборуд.").Tooltip(dhelp),
                    $u.element("dayKinds").Label("Дни").AsMultiSelect(app.dayKinds).Tooltip("Выберите по каким дням будет действовать это условие или скидка"),
                    $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()),
                    $u.element("range1").Label("С..").AsInt().Tooltip("Диапазон С"),
                    $u.element("range2").Label("..По").AsInt().Tooltip("Диапазон По"),
                    $u.element("clientDiscountKind").Label("Cкидка клиента комн").AsSelect(app.discountKinds).Tooltip(chelp),
                    $u.element("eqClientDiscountKind").Label("Cкидка клиента оборуд.").AsSelect(app.discountKinds).Tooltip(chelp),
                    $u.element("hours").Label("Часы").Tooltip("Введите период действия этого условия или скидки в течении дня в формате «12-18». Например, если вы создаете условие для бронирование сольных репетиций заранее, то указав значение «9-12,21-24» условие будет работать с 9 до 12 утра и с 9 до 12 вечера"),
                    $u.element("minHours").Label("Мин.часов").Tooltip("Минимальная длительность бронирования, часов"),
                    $u.element("isOverride").Label("Перекрывает").AsCheckbox().Tooltip("Выставите эту галочку если у вас несколько условий со схожими параметрами, и вы хотите, чтобы это условие было в приоритете"),
                    $u.element("isToday").Label("Сегодня").AsCheckbox().Tooltip("При выставлении этой галочки параметры условия будут работать только день в день (с 00:01 сегодняшней даты)"),
                    $u.element("isArchive").Label("Архив").AsCheckbox().Tooltip("Выставив этот параметр условие прекратит свое действие, но останется доступным для редактирования"),
                    $u.element("allowBaseIds").Label("Разрешенные базы", "top").AsMultiSelect(bases.db.namesUrl).Tooltip(ahelp),
                    $u.element("allowRoomIds").Label("Или разрешенные комнаты", "top").AsMultiSelect(rooms.db.names(undefined, true)).Tooltip(ahelp),
                    $u.element("dateFrom").Label("Начало").AsDate().Tooltip(help4),
                    $u.element("dateTo").Label("Окончание").AsDate().Tooltip(help4),
                    $u.element("description").Label("Описание").AsTextArea(100).Tooltip(""),
                    {},
                ],
            });
            return formCfg;
        };
        return EditForm;
    }());
    promo.EditForm = EditForm;
})(promo || (promo = {}));
var promo;
(function (promo) {
    var HotEditView = (function (_super) {
        __extends(HotEditView, _super);
        function HotEditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        HotEditView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            var formCfg = this.form.config().extend({
                elements: [
                    $u.element("name").Label("Имя"),
                    $u.element("discount").Label("Скидка, %").Error("Введите скидку в % или руб"),
                    $u.element("discountSum").Label("Скидка, руб").Error("Введите скидку в % или руб"),
                    $u.element("dateFrom").Label("С даты").AsDate(),
                    $u.element("dateTo").Label("По дату").AsDate(),
                    $u.element("hours").Label("Часы").Tooltip("Пример: 6-18,20-24").Error("Часы не разрешены в комнате"),
                    $u.template("Часы горящей репетиции должны соответстовать временным промежуткам выбранных комнат").Css("it-error"),
                    $u.element("isArchive").Label("Архив").AsCheckbox(),
                    $u.element("allowRoomIds").Label("Разрешенные комнаты", "top").AsMultiSelect(rooms.db.names(undefined, true)),
                    $u.element("options").Label("Опции", "top").AsMultiSelect(groups.db.options()),
                    $u.element("range1").Label("С..").AsInt().Tooltip("Диапазон С"),
                    $u.element("range2").Label("..По").AsInt().Tooltip("Диапазон По"),
                    $u.element("description").Label("Описание").AsTextArea(100),
                    {},
                ],
                rules: {
                    $obj: function (x) {
                        var perc = parseInt(x.discount);
                        var sum = parseInt(x.discountSum);
                        return perc && !sum || !perc && sum || It.UI.w.error("Не указана скидка или указаны обе скидки");
                    },
                },
            });
            return formCfg;
        };
        HotEditView.prototype.checkHours = function (hours, x) {
            var res = rooms.db.allowHours(x.allowRoomIds, hours);
            if (!res)
                return true;
            It.UI.w.error(res);
            return false;
        };
        return HotEditView;
    }($u.View));
    promo.HotEditView = HotEditView;
})(promo || (promo = {}));
var promo;
(function (promo) {
    var HotGridView = (function (_super) {
        __extends(HotGridView, _super);
        function HotGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.formview = new promo.HotEditView(_this);
            return _this;
        }
        HotGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Название", 100).Sort().Filter(),
                    $u.column("discount").Header("%", 60).AsInt().Sort().Filter(),
                    $u.column("discountSum").Header("Руб", 60).AsInt().Sort().Filter(),
                    $u.column("hours").Header("Время", -1).Filter(),
                    $u.column("description").Header("Описание", -3).Filter(),
                    $u.column("dateTo").Header("Дата").AsDate(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    type: promo.PromoKind.Hot,
                    clientDiscountKind: app.DiscountKind.IgnoreDiscount,
                    eqClientDiscountKind: app.DiscountKind.UseDiscount,
                    isOverride: true,
                    isToday: true,
                },
                save: promo.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.toolbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(), {}, $u.icon("save").Click(function (_) { return _this.formview.form.updateBindings(); })), $u.cols(gridCfg, $u.splitter(), this.formview.$config().Size(300)));
            return view;
        };
        HotGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.formview.form.bind(this.grid);
        };
        HotGridView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var list = promo.db.list({ type: promo.PromoKind.Hot });
            this.grid.refresh(list);
        };
        return HotGridView;
    }($u.View));
    promo.HotGridView = HotGridView;
})(promo || (promo = {}));
var promo;
(function (promo) {
    var RulesGridView = (function (_super) {
        __extends(RulesGridView, _super);
        function RulesGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.formview = new promo.EditForm();
            return _this;
        }
        RulesGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("name").Header("Название", 100).Sort().Error("Длина не более 100 символов").Filter(),
                    $u.column("discount").Header("Скидка", 60).AsInt().Sort().Filter(),
                    $u.column("description").Header("Описание", -1).Filter(),
                    $u.column("isAction").Header("Акция").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    type: promo.PromoKind.Rules,
                    $init: function (obj) {
                        obj.dateFrom = parseDate(obj.dateFrom);
                        obj.dateTo = parseDate(obj.dateTo);
                    },
                },
                rules: {
                    name: function (value) { return value && value.length < 100; },
                },
                save: promo.db.getSaveCfg(true),
            }).Editable();
            var view = $u.rows($u.toolbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.icon("save").Click(function (_) { return _this.formview.form.updateBindings(); })), $u.cols(gridCfg, $u.splitter(), this.formview.config()));
            return view;
        };
        RulesGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.formview.form.bind(this.grid);
        };
        RulesGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        RulesGridView.prototype.refresh = function () {
            var list = promo.db.getItems(promo.PromoKind.Rules);
            this.grid.refresh(list);
        };
        return RulesGridView;
    }($u.View));
    promo.RulesGridView = RulesGridView;
})(promo || (promo = {}));
var promo;
(function (promo) {
    promo.create = {
        rulesgrid: function () { return new promo.RulesGridView(); },
        actgrid: function () { return new promo.ActGridView(); },
        codegrid: function () { return new promo.CodeGridView(); },
        hotgrid: function () { return new promo.HotGridView(); },
    };
    var PromoKind;
    (function (PromoKind) {
        PromoKind[PromoKind["Action"] = 0] = "Action";
        PromoKind[PromoKind["Number"] = 1] = "Number";
        PromoKind[PromoKind["Rules"] = 2] = "Rules";
        PromoKind[PromoKind["Hot"] = 3] = "Hot";
    })(PromoKind = promo.PromoKind || (promo.PromoKind = {}));
    var PromoSource = (function (_super) {
        __extends(PromoSource, _super);
        function PromoSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getItems = function (type) { return _this.loadList("list", { type: type }); };
            _this.numItems = function () { return _this.loadList("numItems"); };
            _this.names = function (actuals, type) { return _this.load('names', { actuals: actuals, type: type }); };
            return _this;
        }
        return PromoSource;
    }(app.AppDataSource));
    promo.db = new PromoSource("promo");
})(promo || (promo = {}));
var points;
(function (points) {
    var PoinKind;
    (function (PoinKind) {
        PoinKind[PoinKind["Registration"] = 1] = "Registration";
        PoinKind[PoinKind["Profile"] = 2] = "Profile";
        PoinKind[PoinKind["Booking"] = 3] = "Booking";
        PoinKind[PoinKind["Invite"] = 4] = "Invite";
        PoinKind[PoinKind["Manual"] = 5] = "Manual";
        PoinKind[PoinKind["Payment"] = 10] = "Payment";
        PoinKind[PoinKind["RetBooking"] = 11] = "RetBooking";
    })(PoinKind = points.PoinKind || (points.PoinKind = {}));
    points.kinds = [
        { id: PoinKind.Registration, value: "Регистрация" },
        { id: PoinKind.Profile, value: "Профиль" },
        { id: PoinKind.Booking, value: "Бронирование" },
        { id: PoinKind.Invite, value: "Приглашение" },
        { id: PoinKind.Manual, value: "Вручную" },
        { id: PoinKind.Payment, value: "Оплата" },
        { id: PoinKind.RetBooking, value: "Отмена" },
    ];
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.list = function (client) { return _this.loadList("list", { client: client }); };
            return _this;
        }
        return DataSource;
    }(app.AppDataSource));
    points.db = new DataSource("points");
})(points || (points = {}));
var favorites;
(function (favorites) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("domain").Header("Партнер", -1).Sort(),
                    $u.column("base").Header("База", -1).Sort(),
                    $u.column("room").Header("Комната", -1).Sort(),
                    $u.column("dateAdded").Header("Добавлено").AsDate(webix.i18n.fullDateFormatStr).Sort(),
                    $u.column("dateRemoved").Header("Удалено").AsDate(webix.i18n.fullDateFormatStr).Sort(),
                    $u.column("isArchive").Header(It.symbols.Cross).AsCheckboxReadly().Sort(),
                ],
            });
            return grid;
        };
        GridView.prototype.$reload = function (clientid) {
            var data = favorites.db.list({ client: clientid });
            this.grid.refresh(data);
        };
        return GridView;
    }($u.PopupView));
    favorites.GridView = GridView;
})(favorites || (favorites = {}));
var favorites;
(function (favorites) {
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DataSource.prototype.add = function (room) {
            return this.post("add", { room: room });
        };
        DataSource.prototype.remove = function (room) {
            return this.post("remove", { room: room });
        };
        return DataSource;
    }(app.AppDataSource));
    favorites.db = new DataSource("favorites");
})(favorites || (favorites = {}));
var groups;
(function (groups) {
    var EqTypesGridView = (function (_super) {
        __extends(EqTypesGridView, _super);
        function EqTypesGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.form = new $u.RefForm();
            return _this;
        }
        EqTypesGridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var me = this;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column().AsOrderMarker(),
                    $u.column("name").Header("Параметр", 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                    name: "новый тип",
                    type: groups.GroupType.Equipment,
                    order: 1000,
                },
                save: groups.db.getSaveCfg(true),
            }).Editable().DragOrder(function (start, ids) { return groups.db.reindex(start, ids); }, true);
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.button("Сохранить").Click(function () { return _this.form.updateBindings(); })), $u.cols(grid, this.configForm().Size(350)));
            return view;
        };
        EqTypesGridView.prototype.configForm = function () {
            var form = this.form.config().extend({
                elements: [
                    $u.element("name").Label("Параметр комнаты", "top"),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    $u.element("sphereIds").Label("Сферы", "top").AsMultiSelect(spheres.db.names()),
                    {},
                ]
            });
            return form;
        };
        EqTypesGridView.prototype.setImage = function (img) {
            this.form.elements.icon.setValues(img.path);
        };
        EqTypesGridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.bind(this.grid);
        };
        EqTypesGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        EqTypesGridView.prototype.refresh = function () {
            var rows = groups.db.list({ type: groups.GroupType.Equipment });
            this.grid.refresh(rows);
        };
        return EqTypesGridView;
    }($u.View));
    groups.EqTypesGridView = EqTypesGridView;
})(groups || (groups = {}));
var groups;
(function (groups) {
    var FinGridView___old = (function (_super) {
        __extends(FinGridView___old, _super);
        function FinGridView___old() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        FinGridView___old.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var me = this;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("fin").Header("Код").AsNumber().Edit().Sort().Filter(),
                    $u.column("index").Header("Кф").AsNumber().Edit().Sort().Filter(),
                    $u.column("name").Header("Группа", 180).Sort().Filter().Edit(),
                    $u.column("description").Header("Описание", -2).Sort().Edit(),
                    $u.column("isArchive").Header("Арх").AsCheckbox().Sort().Edit(),
                ],
                scheme: {
                    id: -1,
                    name: "фин.группа",
                    type: groups.GroupType.Fin,
                    index: 0,
                },
                save: groups.db.getSaveCfg(true),
            }).Editable().DragOrder(function (start, ids) { return groups.db.reindex(start, ids); }, true);
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}), grid);
            return view;
        };
        FinGridView___old.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        FinGridView___old.prototype.refresh = function () {
            var rows = groups.db.list({ type: groups.GroupType.Fin });
            this.grid.refresh(rows);
        };
        return FinGridView___old;
    }($u.View));
    groups.FinGridView___old = FinGridView___old;
})(groups || (groups = {}));
var points;
(function (points) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("date").Header("Дата").AsDate().Sort().Edit(),
                    $u.column("kind").Header("Вид", 120).AsSelect(points.kinds).Sort().Filter().Edit(),
                    $u.column("prih").Header("Приход").AsInt().Sort().Edit().Footer({ content: "summColumn" }),
                    $u.column("rash").Header("Расход").AsInt().Sort().Edit().Footer({ content: "summColumn" }),
                    $u.column("description").Header("Описание", -1).Filter().Edit().Footer("Остаток"),
                    $u.column("zcount").Header("", 75).AsInt().Footer({ content: "summColumn" }).Template(' ').Edit(),
                ],
                scheme: {
                    $save: function (r) { return console.log('save', r); },
                    $update: function (r) { return console.log('update', r); },
                    $change: function (r) { return console.log('change', r); },
                    $serialize: function (r) { return console.log('serialize', r); },
                },
                save: points.db.getSaveCfg(true),
            }).Footer().Editable();
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.reload(_this.clientid); }), {}), gridCfg);
            return view.Min(-1, 400);
        };
        GridView.prototype.reload = function (clientid) {
            this.clientid = clientid;
            var res = points.db.list(clientid);
            this.grid.refresh(res);
            this.grid.scheme({ client: clientid });
        };
        return GridView;
    }($u.View));
    points.GridView = GridView;
})(points || (points = {}));
var promo;
(function (promo) {
    var FilterForm = (function () {
        function FilterForm() {
            this.form = new $.RefForm();
        }
        FilterForm.prototype.config = function () {
            var dhelp = "Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»";
            var chelp = "Укажите будет ли распространяться скидка из карточки клиента на комнату или позиции у созданного условия. Например, у клиента 10% скидка на все услуги, но при бронировании комнаты попадающей под созданное условие скидка на комнату и оборудование не будет учитываться если выбрать значение «Блокируем» в обоих полях";
            var ahelp = "Выберите на каком объекте или в каких комнатах будут действовать параметры этого условия. Поля взаимоисключающие, это значит, что заполнено должно быть только одно (либо комнаты, либо базы).";
            var help4 = "Выберете календарный период действия параметров условия";
            var formCfg = this.form.config().extend({
                width: 400,
                elements: [
                    $.element("name").Label("Имя").Tooltip("Введите название условия. Например: «Соло» или «Преподаватели». Будет отображаться в окне выбора условия раздела «Цены»"),
                    $.element("discount").Label("Скидка, %").Tooltip(dhelp),
                    $.element("discountSum").Label("Скидка, руб").Tooltip(dhelp),
                    $.element("eqDiscount").Label("Скидка,% оборуд.").Tooltip(dhelp),
                    $.element("dayKinds").Label("Дни").AsMultiSelect(app.dayKinds).Tooltip("Выберите по каким дням будет действовать это условие или скидка"),
                    $.element("clientDiscountKind").Label("Cкидка клиента комн").AsSelect(app.discountKinds).Tooltip(chelp),
                    $.element("eqClientDiscountKind").Label("Cкидка клиента оборуд.").AsSelect(app.discountKinds).Tooltip(chelp),
                    $.element("hours").Label("Часы").Tooltip("Пример: 6-18,20-24").Tooltip("Введите период действия этого условия или скидки в течении дня в формате «12-18». Например, если вы создаете условие для бронирование сольных репетиций заранее, то указав значение «9-12,21-24» условие будет работать с 9 до 12 утра и с 9 до 12 вечера"),
                    $.element("isOverride").Label("Перекрывает").AsCheckbox().Tooltip("Выставите эту галочку если у вас несколько условий со схожими параметрами, и вы хотите, чтобы это условие было в приоритете"),
                    $.element("isToday").Label("Сегодня").AsCheckbox().Tooltip("При выставлении этой галочки параметры условия будут работать только день в день (с 00:01 сегодняшней даты)"),
                    $.element("isArchive").Label("Архив").AsCheckbox().Tooltip("Выставив этот параметр условие прекратит свое действие, но останется доступным для редактирования"),
                    $.element("allowBaseIds").Label("Разрешенные базы", "top").AsMultiSelect(bases.db.namesUrl).Tooltip(ahelp),
                    $.element("allowRoomIds").Label("Или разрешенные комнаты", "top").AsMultiSelect(rooms.db.names(undefined, true)).Tooltip(ahelp),
                    $.element("dateFrom").Label("Начало").AsDate().Tooltip(help4),
                    $.element("dateTo").Label("Окончание").AsDate().Tooltip(help4),
                    $.element("description").Label("Описание").AsTextArea(100).Tooltip(""),
                    {},
                ],
            });
            return formCfg;
        };
        return FilterForm;
    }());
    promo.FilterForm = FilterForm;
})(promo || (promo = {}));
var reviews;
(function (reviews) {
    var GridAllView = (function (_super) {
        __extends(GridAllView, _super);
        function GridAllView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            _this.form = new $u.RefForm();
            _this.ansForm = new $u.RefForm();
            _this.msglist = new $u.RefList();
            return _this;
        }
        GridAllView.prototype.$config = function () {
            var _this = this;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template(It.symbols.calendar.link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("domain").Header("Партнер", -1).Sort().Filter(),
                    $u.column("client").Header("Клиент", 100).Sort().Filter().Template($u.getViewLink("clients", "#client#", "#clientId#")),
                    $u.column("base").Header("База", -1).Sort().Filter(),
                    $u.column("room").Header("Комната", -1).Sort().Filter(),
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("status").Header("Статус брони").AsSelect(orders.statuses).Sort().Filter(),
                    $u.column("rstatus").Header("Статус").AsSelect(reviews.statuses).Sort().Filter(),
                    $u.column("groupId").Header("Правило").AsSelect(groups.db.names(groups.GroupType.Reviews)).Sort().Filter(),
                    $u.column("value").Header("Оценка").Sort().AsInt().Footer({ content: "avgColumn" }),
                    $u.column("text").Header("Отзыв", -3).Sort().Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        orders.logic.getStateCss(obj);
                    },
                },
                save: reviews.db.getSaveCfg(true),
            }).Editable().Footer();
            var filter = this.filterForm.config().extend({
                cols: [
                    $u.element("date1").Label("Дата с", null, 60).Size(170).AsDate(),
                    $u.element("date2").Label("По", null, 30).Size(140).AsDate(),
                    $u.element("statuses").Label("Статусы", null, 60).AsMultiSelect(reviews.statuses).Size(-1).Value([reviews.ReviewStatus.Moderate]),
                    $u.button("Найти").Click(function () { return _this.reload(); }),
                    $u.button("Ответить").PopupCfg(this.ui_answer()),
                ]
            });
            var view = $u.rows(filter, grid);
            return view;
        };
        GridAllView.prototype.ui_answer = function () {
            var _this = this;
            var me = this;
            var row = null;
            function onAnswerShow(ax) {
                row = me.grid.getSelectedItem();
                if (!row)
                    return webix.message("Не выделена запись", "debug");
                me.form.setValues(row);
                var list = messages.db.list({ order: row.orderId, kind: messages.MessageKind.Review, desc: false });
                me.msglist.refresh(list);
            }
            var form = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("domain").Label("Партнер"),
                    $u.element("base").Label("База"),
                    $u.element("room").Label("Комната"),
                    $u.element("client").Label("Клиент"),
                    $u.element("text").Label("Текст сообщения").AsTextArea(100),
                ],
            }).Readonly(true).Disable(true);
            var msglist = this.msglist.config().extend({
                template: 'http->' + It.Web.WebSource.base + '/html/message-list.html',
                type: {
                    href: "#!",
                    height: "auto",
                    d: function (x) { return webix.i18n.fullDateFormatStr(x.date); },
                },
            }).Max(-1, 300).Scrollable();
            var ansform = this.ansForm.config().extend({
                width: 400,
                elements: [
                    $u.element("text").Label("Текст ответа партнеру").AsTextArea(100).Require(),
                    $u.cols($u.button("Обработать").Click(function (_) { return _this.reply(reviews.ReviewStatus.Processed); }), $u.button("Удалить").Click(function (_) { return _this.reply(reviews.ReviewStatus.Cancel); }), {}),
                ],
            });
            var view = $u.rows($u.label("Форма ответа модератора").Css('w3-panel w3-large w3-theme-l5'), form, msglist, ansform, { height: 40 });
            var popup = $u.popup(view).On('onShow', onAnswerShow);
            return popup;
        };
        GridAllView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.reload();
        };
        GridAllView.prototype.reload = function (args) {
            var filter = this.filterForm.values();
            filter.all = true;
            var data = reviews.db.list(filter);
            this.grid.refresh(data);
        };
        GridAllView.prototype.reply = function (status) {
            if (!this.ansForm.validate())
                return;
            var item = this.grid.getSelectedItem();
            if (!item)
                return webix.message("Не выделена запись", "debug");
            var vals = this.ansForm.values();
            var res = reviews.db.reply({ review: item.id, text: vals.text, status: status });
            this.ansForm.clear();
            this.reload();
            webix.message("Сообщение успешно отправлено");
        };
        return GridAllView;
    }($u.View));
    reviews.GridAllView = GridAllView;
})(reviews || (reviews = {}));
var reviews;
(function (reviews) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.form = new $u.RefForm();
            _this.filterForm = new $u.RefForm();
            _this.ansForm = new $u.RefForm();
            _this.msglist = new $u.RefList();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("idd").Header("*", 30).Template(It.symbols.calendar.link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("client").Header("Клиент", 100).Sort().Filter().Template($u.getViewLink("clients", "#client#", "#clientId#")),
                    $u.column("base").Header("База", -1).Sort().Filter(),
                    $u.column("room").Header("Комната", -1).Sort().Filter(),
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("status").Header("Статус брони").AsSelect(orders.statuses).Sort().Filter(),
                    $u.column("rstatus").Header("Статус").AsSelect(reviews.statuses).Sort().Filter(),
                    $u.column("groupId").Header("Правило").AsSelect(groups.db.names(groups.GroupType.Reviews)).Sort().Filter(),
                    $u.column("value").Header("Оценка").Sort().AsInt().Footer({ content: "avgColumn" }),
                    $u.column("text").Header("Отзыв", -3).Sort().Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        orders.logic.getStateCss(obj);
                    },
                },
                save: reviews.db.getSaveCfg(true),
            }).Editable().Footer();
            var filter = this.filterForm.config().extend({
                cols: [
                    $u.element("date1").Label("Дата с", null, 60).Size(170).AsDate(),
                    $u.element("date2").Label("По", null, 30).Size(140).AsDate(),
                    $u.element("statuses").Label("Статусы", null, 60).AsMultiSelect(reviews.statuses).Size(-1).Value([reviews.ReviewStatus.New]),
                    $u.button("Найти").Click(function () { return _this.reload(); }),
                    $u.button("Ответить").PopupCfg(this.ui_answer()),
                ]
            });
            var view = $u.rows(filter, grid);
            return view;
        };
        GridView.prototype.ui_answer = function () {
            var _this = this;
            var me = this;
            var row = null;
            function onAnswerShow(ax) {
                row = me.grid.getSelectedItem();
                if (!row)
                    return webix.message("Не выделена запись", "debug");
                me.form.setValues(row);
                var list = messages.db.list({ order: row.orderId, kind: messages.MessageKind.Review, desc: false });
                me.msglist.refresh(list);
            }
            var form = this.form.config().extend({
                width: 400,
                elements: [
                    $u.element("base").Label("База"),
                    $u.element("room").Label("Комната"),
                    $u.element("client").Label("Клиент"),
                    $u.element("text").Label("Текст сообщения").AsTextArea(100),
                ],
            }).Readonly(true).Disable(true);
            var msglist = this.msglist.config().extend({
                template: 'http->' + It.Web.WebSource.base + '/html/message-list.html',
                type: {
                    href: "#!",
                    height: "auto",
                    d: function (x) { return webix.i18n.fullDateFormatStr(x.date); },
                },
            }).Max(-1, 300).Scrollable();
            var ansform = this.ansForm.config().extend({
                width: 400,
                elements: [
                    $u.element("text").Label("Текст ответа").AsTextArea(100).Require(),
                    $u.cols($u.button("Пожаловаться").Click(function (_) { return _this.reply(reviews.ReviewStatus.Moderate); }), $u.button("Ответить").Click(function (_) { return _this.reply(reviews.ReviewStatus.Ok); }), {}),
                ],
            });
            var view = $u.rows($u.label("Форма ответа").Css('w3-panel w3-large w3-theme-l5'), form, msglist, ansform, { height: 40 });
            var popup = $u.popup(view).On('onShow', onAnswerShow);
            return popup;
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.reload();
        };
        GridView.prototype.reload = function (args) {
            var filter = this.filterForm.values();
            var data = reviews.db.list(filter);
            this.grid.refresh(data);
        };
        GridView.prototype.reply = function (status) {
            if (!this.ansForm.validate())
                return;
            var item = this.grid.getSelectedItem();
            if (!item)
                return webix.message("Не выделена запись", "debug");
            var vals = this.ansForm.values();
            var res = reviews.db.reply({ review: item.id, text: vals.text, status: status });
            this.ansForm.clear();
            this.reload();
            webix.message("Сообщение успешно отправлено");
        };
        return GridView;
    }($u.View));
    reviews.GridView = GridView;
})(reviews || (reviews = {}));
var reviews;
(function (reviews) {
    reviews.create = {
        grid: function () { return new reviews.GridView(); },
        'grid-all': function () { return new reviews.GridAllView(); },
    };
    var ReviewStatus;
    (function (ReviewStatus) {
        ReviewStatus[ReviewStatus["Unknown"] = 0] = "Unknown";
        ReviewStatus[ReviewStatus["New"] = 1] = "New";
        ReviewStatus[ReviewStatus["Moderate"] = 2] = "Moderate";
        ReviewStatus[ReviewStatus["Processed"] = 3] = "Processed";
        ReviewStatus[ReviewStatus["Changed"] = 4] = "Changed";
        ReviewStatus[ReviewStatus["Ok"] = 10] = "Ok";
        ReviewStatus[ReviewStatus["Cancel"] = 11] = "Cancel";
    })(ReviewStatus = reviews.ReviewStatus || (reviews.ReviewStatus = {}));
    reviews.statuses = [
        { id: ReviewStatus.New, value: "Новый" },
        { id: ReviewStatus.Moderate, value: "Модерация" },
        { id: ReviewStatus.Processed, value: "Обработано" },
        { id: ReviewStatus.Changed, value: "Изменено" },
        { id: ReviewStatus.Ok, value: "Отвечено" },
        { id: ReviewStatus.Cancel, value: "Отменено" },
    ];
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DataSource.prototype.add = function (args) {
            return this.post("add", args);
        };
        DataSource.prototype.reply = function (args) {
            return this.post("reply", args);
        };
        return DataSource;
    }(app.AppDataSource));
    reviews.db = new DataSource("reviews");
})(reviews || (reviews = {}));
var trans;
(function (trans) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var w = 160;
            var groups1 = trans.db.groups(1);
            var groups2 = trans.db.groups(2);
            var groups3 = trans.db.groups(3);
            var grid = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 2,
                columns: [
                    $u.column("date").Header("Дата").AsDate(webix.i18n.fullDateFormatStr).Sort(),
                    $u.column("total").AsInt().Header("Стоимость", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("register").Header("Регистр", w).AsSelect(groups1).Sort().Filter(),
                    $u.column("operation").Header("Операция", w).AsSelect(groups2).Sort().Filter(),
                    $u.column("details").Header("Детали", w).AsSelect(groups3).Sort().Filter(),
                    $u.column("sphere").Header("Сфера", w).Sort().Filter(),
                    $u.column("domain").Header("Партнер", w).Sort().Filter(),
                    $u.column("base").Header("База", w).Sort().Filter(),
                    $u.column("room").Header("Комната", w).Sort().Filter(),
                    $u.column("orderId").Header("Бронь", 50).Template($u.getViewLink("orders", "(...)", "#orderId#")),
                    $u.column("client").Header("Клиент", w).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("text").Header("Комментарий", w * 3),
                ],
                scheme: {},
            }).Footer();
            var date = new Date();
            var filterFormCfg = this.filterForm.config().extend({
                width: 400,
                elements: [
                    $u.element("dfrom").Label("Дата с").AsDate().Value(date.addDays(-7)),
                    $u.element("dto").Label("По").AsDate().Value(date.addDays(1)),
                    $u.element("register").Label("Регистр").AsSelect(groups1),
                    $u.element("operation").Label("Операция").AsSelect(groups2),
                    $u.element("details").Label("Детали").AsSelect(groups3),
                    $u.element("domain").Label("Партнер").AsSelect(domains.db.names()),
                    $u.element("sphere").Label("Сфера").AsSelect(spheres.db.names()),
                    $u.element("base").Label("База").AsSelect(bases.db.names(true)),
                    $u.element("room").Label("Комната").AsSelect(rooms.db.names(null, true)),
                    $u.element("eqtypes").Label("Тип позиции").AsMultiSelect(groups.db.names(groups.GroupType.Equipment)),
                    $u.cols($u.button("Найти").Click(function () { return _this.refresh(); }).Tooltip("Пересчитать данные и обновить отчет"), $u.button("Очистить").Click(function () { return _this.filterForm.clear(); })),
                ]
            });
            var view = $u.rows($u.cols($u.button("Поиск").Popup(filterFormCfg), $u.button("Открыть").Click(function () { return _this.open(); }), {}), grid);
            return view;
        };
        GridView.prototype.refresh = function () {
            var filter = this.filterForm.values();
            var list = trans.db.search(filter);
            this.grid.refresh(list);
            webix.message("Отчет обновлен");
        };
        GridView.prototype.open = function () {
            var item = this.grid.getSelectedItem();
            if (!item)
                return;
        };
        return GridView;
    }($u.View));
    trans.GridView = GridView;
})(trans || (trans = {}));
var trans;
(function (trans) {
    var TotalsView = (function (_super) {
        __extends(TotalsView, _super);
        function TotalsView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.filterForm = new $u.RefForm();
            _this.pivot = new $u.RefPivot();
            return _this;
        }
        TotalsView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var groups1 = trans.db.groups(1);
            var form = this.filterForm.config().extend({
                cols: [
                    $u.icon("refresh").Click(function (_) { return _this.refresh(); }).Tooltip("Пересчитать данные и обновить отчет"),
                    $u.element("register").Label("Регистр", null, 70).AsSelect(groups1),
                    $u.element("dfrom").Label("Дата с", null, 50).Size(170).AsDate(),
                    $u.element("dto").Label("По", null, 40).Size(170).AsDate(),
                    $u.icon("file-excel-o").Click(function (_) { return _this.export(); }).Tooltip("Экспортировать в Ексел"),
                    $u.button("Сбросить").Click(function (_) { return _this.pivot.clearConfig(true); }).Tooltip("Сбросить настройки"),
                    {},
                ]
            });
            var pivotCfg = this.pivot.config().extend({
                columnWidth: 80,
                fieldMap: {
                    register: "Регистр",
                    operation: "Операция",
                    details: "Детали",
                    client: "Клиент",
                    domain: "Партнер",
                    sphere: "Сфера",
                    group: "Опции",
                    base: "База",
                    room: "Комната",
                    total: "Сумма",
                    year: "Год",
                    month: "Месяц",
                    day: "День",
                    week: "Неделя",
                    weekDate: "Нач.Нед",
                    weekDay: "Д/нед",
                },
                scheme: {},
                structure: {
                    filters: [
                        { name: "sphere", type: "select" },
                        { name: "domain", type: "select" },
                    ],
                    columns: [
                        { id: "year", header: "Год", },
                        { id: "weekDate", header: "Нач.Нед", },
                        { id: "weekDay", header: "День", sort: "string" },
                    ],
                    values: [
                        { name: "total", operation: "sum" },
                    ],
                    rows: ["sphere", "domain", "operation"],
                },
            });
            var view = $u.rows(form, pivotCfg);
            return view;
        };
        TotalsView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            var d = new Date(Date.now());
            d = webix.Date.weekStart(d);
            var vals = { dfrom: d, dto: d.addDays(6) };
            this.filterForm.setValuesEx(vals);
            this.pivot.setConfig("pivot.trans.totals");
        };
        TotalsView.prototype.refresh = function () {
            var vals = this.filterForm.values();
            var list = trans.db.totals(vals);
            this.pivot.refresh(list);
            webix.message("Отчет обновлен");
        };
        TotalsView.prototype.export = function () {
            var cfg = {
                filename: "totals " + (new Date()).toLocaleDateString("ru"),
                name: "totals",
                filterHTML: true,
            };
            this.pivot.toExcel(cfg);
        };
        return TotalsView;
    }($u.View));
    trans.TotalsView = TotalsView;
})(trans || (trans = {}));
var trans;
(function (trans) {
    trans.create = {
        grid: function () { return new trans.GridView(); },
        totals: function () { return new trans.TotalsView(); },
    };
    var DbSource = (function (_super) {
        __extends(DbSource, _super);
        function DbSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.groups = function (level) { return _this.loadList("groups", { level: level }); };
            return _this;
        }
        DbSource.prototype.search = function (args) {
            return this.loadList('search', args);
        };
        DbSource.prototype.totals = function (args) {
            return this.loadList('totals', args);
        };
        return DbSource;
    }(app.AppDataSource));
    trans.db = new DbSource("trans");
})(trans || (trans = {}));
var orders;
(function (orders) {
    var FilterGridFullView = (function (_super) {
        __extends(FilterGridFullView, _super);
        function FilterGridFullView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            _this.editor = new orders.OrderEditor();
            return _this;
        }
        FilterGridFullView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            It.Web.loadJS("lib/webix-ext/xlsx.core.min.js");
            var logic = orders.logic;
            var gridCfg = this.grid.config().extend({
                scrollAlignY: true,
                scrollX: true,
                leftSplit: 1,
                columns: [
                    $u.column("idd").Header("*", 30).Template("&#128197;".link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("client").Header("Клиент", 150).Sort().Template(clients.getClientColumnTemplate()).Filter(),
                    $u.column("sourceType").AsSelect(orders.sourceTypes).Header("Источник").Sort().Filter(),
                    $u.column("isPrepay").Header("Пред").AsCheckboxReadly(true),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("domainId").AsSelect(domains.db.names()).Header("Партнер", 140).Sort().Filter(),
                    $u.column("sphereId").AsSelect(spheres.db.names()).Header("Сфера", 140).Sort().Filter(),
                    $u.column("baseId").AsSelect(bases.db.names(true)).Header("База", 140).Sort().Filter(),
                    $u.column("roomId").AsSelect(rooms.db.namesUrl).Header("Комната", 140).Sort().Filter(),
                    $u.column("promo").Header("Промокод", 50).Sort().Filter(),
                    $u.column("hours").Header("Часов", 50).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("totalSum").AsInt().Header("Стоимость", 70).AsNumber().Sort().Footer({ content: "summColumn" }),
                    $u.column("discounts").AsInt().Header("Скидка", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("eqSum").AsInt().Header("Доп.", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("mobComm").AsInt().Header("Ком.", 70).AsInt().Sort().Footer({ content: "summColumn" }),
                    $u.column("comment").Header("Комментарий", 100).Filter(),
                    $u.column("clientComment").Header("Комм.клиента", 100).Filter(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус", 100).Sort().Filter(),
                    $u.column("options").Header("Опции", 180).Sort().Filter(),
                    $u.column("reason").AsSelect(orders.cancelReasons).Header("Отмена", 100).Sort().Filter(),
                ],
                scheme: {
                    $init: function (obj) {
                        obj.date = parseDate(obj.date);
                        logic.getStateCss(obj);
                    },
                },
            }).Tooltip("<h3>#client#</h3><hr/><blockquote>#comment# #clientComment#<br/>#options#</blockquote>").Footer();
            var date = new Date();
            var filterFormCfg = this.filterForm.config().extend({
                width: 400,
                elements: [
                    $u.element("search").Label("Названия"),
                    $u.element("dfrom").Label("Дата с").AsDate().Value(date.addDays(-7)),
                    $u.element("dto").Label("По").AsDate().Value(date),
                    $u.element("base").Label("База").AsSelect(bases.db.names(true)),
                    $u.element("promo").Label("Промокод", "top").AsSelect(promo.db.names(true, promo.PromoKind.Action)),
                    $u.element("status").Label("Статус документа").AsSelect(orders.statuses),
                    $u.element("option").Label("Опция").AsSelect(groups.db.options()),
                    $u.element("sources").Label("Источники").AsMultiSelect(orders.sourceKinds),
                    $u.element("eqtypes").Label("Тип позиции").AsMultiSelect(groups.db.names(groups.GroupType.Equipment)),
                    $u.element("eqs").Label("Позиции").AsMultiSelect(equipments.db.names()),
                    $u.element("sourceTypes").Label("Типы источн.").AsMultiSelect(orders.sourceTypes),
                    $u.element("prepay").Label("Только предоплата").AsCheckbox(),
                    $u.element("domain").Label("Партнер").AsSelect(domains.db.names()),
                    $u.element("sphere").Label("Сфера").AsSelect(spheres.db.names()),
                    $u.cols($u.button("Найти").Click(function () { return _this.refresh(); }).Tooltip("Пересчитать данные и обновить отчет"), $u.button("Очистить").Click(function () { return _this.filterForm.clear(); })),
                ]
            });
            var view = $u.rows($u.cols($u.button("Поиск").Popup(filterFormCfg), $u.button("Открыть").Click(function () { return _this.open(); }), $u.icon("file-excel-o").Click(function () { return _this.exportxlsx(); }).Tooltip("Экспортировать в Ексел"), {}), gridCfg);
            return view;
        };
        FilterGridFullView.prototype.refresh = function () {
            var filter = this.filterForm.values();
            var list = orders.db.search(filter);
            this.grid.refresh(list);
            webix.message("Отчет обновлен");
        };
        FilterGridFullView.prototype.open = function () {
            var item = this.grid.getSelectedItem();
            if (!item)
                return;
            this.editor.edit(item.id);
        };
        FilterGridFullView.prototype.exportxlsx = function () {
            this.grid.toExcel({
                filename: "orders-" + (new Date()).toLocaleDateString("ru"),
                name: "orders",
                filterHTML: true,
                columns: [
                    { id: "client", header1: "ККК" },
                    { id: "sourceType" },
                    { id: "dateFrom" },
                    { id: "baseId" },
                    { id: "roomId" },
                    { id: "promo" },
                    { id: "houurs" },
                    { id: "totalSum", exportType: "number" },
                    { id: "discounts", exportType: "number" },
                    { id: "eqSum", exportType: "number", exportFormat1: "#-##0.00" },
                    { id: "status" },
                ]
            });
            console.log('export xlsx');
        };
        return FilterGridFullView;
    }($u.View));
    orders.FilterGridFullView = FilterGridFullView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var RequestView = (function (_super) {
        __extends(RequestView, _super);
        function RequestView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.grid = new $u.RefGrid();
            return _this;
        }
        RequestView.prototype.$config = function () {
            var _this = this;
            var toolbar = $u.panelbar($u.button("Сохранить").Click(function () { return _this.save(); }), {});
            var form = this.form.config().Labels(120).extend({
                elements: [
                    $u.cols($u.rows($u.element("discount").Label("Скидка, %").AsInt()), $u.rows($u.element("comment").Label("Комментарий").AsTextArea(100), $u.element("clientForfeit").Label("Прошлый штраф").AsNumber(), $u.element("totalSum").Label("Cтоимость общ").Css("it-warning").AsNumber())),
                ]
            });
            var grid = this.grid.config().extend({
                height: 200,
                columns: [
                    $u.column("idd").Header("*", 30).Template(Symbols.calendar.link("{common.href}/orders/calendar/?base=#baseId#&date=#dateFrom#")),
                    $u.column("dateFrom").Header("Дата").AsDate().Sort(),
                    $u.column("dateTo").Header("", 1).Size(1),
                    $.column("baseId").AsSelect(bases.db.names()).Header("База", -1).Sort(),
                    $u.column("roomId").AsSelect(rooms.db.names()).Header("Комната", -1).Sort(),
                    $u.column("totalOrder").AsInt().Header("Стоимость", 80).Sort(),
                    $u.column("status").AsSelect(orders.statuses).Header("Статус").Sort(),
                ],
                scheme: {},
            }).Tooltip();
            var view = $u.rows(toolbar, form, grid, {});
            return view;
        };
        RequestView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var vals = this.form.load(orders.db.getUrl(id));
            var data = orders.db.list({ request: id });
            this.grid.refresh(data);
        };
        RequestView.prototype.save = function () {
            if (!this.form.validate())
                return;
            var vals = this.form.save(orders.db.saveUrl(this.objectId), false);
            webix.message("Данные о заявке сохранены");
        };
        return RequestView;
    }($u.View));
    orders.RequestView = RequestView;
})(orders || (orders = {}));
var orders;
(function (orders) {
    var RequestsGridView = (function (_super) {
        __extends(RequestsGridView, _super);
        function RequestsGridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.filterForm = new $u.RefForm();
            _this.form = new $u.RefForm();
            _this.ansForm = new $u.RefForm();
            _this.msglist = new $u.RefList();
            return _this;
        }
        RequestsGridView.prototype.$config = function () {
            var _this = this;
            var grid = this.grid.config().extend({
                columns: [
                    $u.column("date").Header("Дата").AsDate().Sort().Filter(),
                    $u.column("domainId").Header("Партнер", 100).AsSelect(domains.db.names()).Sort().Filter(),
                    $u.column("base").Header("База", -1).Sort().Filter(),
                    $u.column("room").Header("Комната", -1).Sort().Filter(),
                    $u.column("client").Header("Клиент", -1).Sort().Filter().Template($u.getViewLink("clients", "#client#", "#clientId#")),
                    $u.column("requestStatus").Header("Статус").AsSelect(orders.requestStatuses).Sort().Filter(),
                    $u.column("countOrders").Header("Брони").Sort().AsInt().Footer(),
                    $u.column("countOrders").Header("*", 30).Template(It.symbols.calendar.link("{common.href}/orders/search/?request=#id#")),
                ],
                scheme: {
                    $init: function (obj) {
                        orders.logic.getRequstStateCss(obj);
                    },
                },
                save: orders.db.getSaveCfg(true),
            }).Editable().Footer();
            var filter = this.filterForm.config().extend({
                cols: [
                    $u.element("dfrom").Label("Дата с", null, 60).Size(170).AsDate(),
                    $u.element("dto").Label("По", null, 30).Size(140).AsDate(),
                    $u.button("Найти").Click(function () { return _this.reload(); }),
                    { gravity: -1 },
                ]
            });
            var view = $u.rows(filter, grid);
            return view;
        };
        RequestsGridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.reload();
        };
        RequestsGridView.prototype.reload = function (args) {
            var filter = this.filterForm.values();
            filter.all = true;
            var data = orders.db.requests(filter);
            this.grid.refresh(data);
        };
        return RequestsGridView;
    }($u.View));
    orders.RequestsGridView = RequestsGridView;
})(orders || (orders = {}));
var order_rules;
(function (order_rules) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            _this.form = new $u.RefForm();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var grid = this.grid.config().extend({
                tooltip: true,
                columns: [
                    $u.column().AsOrderMarker(),
                    $u.column("name").Header("Название", -1).Sort().Filter(),
                    $u.column("description").Header("Описание", -2).Sort().Filter(),
                    $u.column("baseId").Header("База", 140).AsSelect(bases.db.names()).Sort().Filter(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    id: -1,
                    name: "новое правило",
                    index: 10000,
                },
                save: order_rules.db.getSaveCfg(true),
            }).DragOrder(function (start, ids) { return order_rules.db.reindex(start, ids); }, true);
            var view = $u.rows($u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}, $u.button("Сохранить").Click(function () { return _this.form.updateBindings(); })), $u.cols(grid, this.configEditForm().Size(350)));
            return view;
        };
        GridView.prototype.configEditForm = function () {
            var css = { background: '#ebedf2' };
            var form = this.form.config().extend({
                elements: [
                    $u.element("name").Label("Название").Require(),
                    $u.element("baseId").Label("База").AsSelect(bases.db.names(true)),
                    $u.element("sources").Label("Источники").AsMultiSelect(orders.sourceTypes),
                    $u.label("ЕСЛИ бронирование").Css(css),
                    $u.element("ifKind").Label("Условие").AsSelect(order_rules.ifkinds).Require(),
                    $u.element("ifHours").Label("Часов").AsInt(),
                    $u.label("ТО отмена доступна").Css(css),
                    $u.element("thenKind").Label("Отмена").AsSelect(order_rules.thenkinds).Require(),
                    $u.element("thenHours").Label("Часов").AsInt(),
                    $u.element("description").Label("Описание").AsTextArea(100, "top"),
                    $u.element("isDefault").Label("По умолчанию").AsCheckbox().Visible(system.context.isSuper),
                    $u.element("isArchive").Label("Скрыть (архив)").AsCheckbox(),
                    {},
                ]
            });
            return form;
        };
        GridView.prototype.$init = function () {
            _super.prototype.$init.call(this);
            this.form.bind(this.grid);
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        GridView.prototype.refresh = function () {
            var data = order_rules.db.list();
            this.grid.refresh(data);
        };
        return GridView;
    }($u.View));
    order_rules.GridView = GridView;
})(order_rules || (order_rules = {}));
var domains;
(function (domains) {
    var PopupForm = (function (_super) {
        __extends(PopupForm, _super);
        function PopupForm() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PopupForm.prototype.$config = function () {
            var lw = 100;
            var form = this.form.config().extend({
                elements: [
                    $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)),
                    $u.element("tarifId").Label("Текущий тариф", "top").AsSelect(tarifs.db.names()),
                    $u.element("period").Label("Граница даты", "top").AsSelect(domains.periods),
                    $u.element("isPayment").Label("Только для оплат").AsSelect(app.booleans),
                    $u.element("status").Label("Статус").AsSelect(domains.statuses),
                    $u.element("limitDate").Label("Срок").AsDate(),
                    $u.element("tarifIds").Label("Доступные тарифы", "top").AsMultiSelect(tarifs.db.names()),
                    $u.element("isArchive").Label("Архивная").AsSelect(app.booleans),
                    _super.prototype.$config.call(this, "Изменить"),
                    {},
                ],
            });
            return form;
        };
        return PopupForm;
    }($u.PopupView));
    domains.PopupForm = PopupForm;
})(domains || (domains = {}));
var domains;
(function (domains) {
    var QuickEditForm = (function () {
        function QuickEditForm() {
            this.form = new $.RefForm();
        }
        QuickEditForm.prototype.config = function () {
            var formCfg = this.form.config().extend({
                elements: [
                    $.cols($.element("period").Label("Граница даты", "top").AsSelect(domains.periods).Require(), $.element("isPayment").Label("Только для оплаченных").AsCheckbox(true), $.button('Пересчитать'), {}),
                ],
            });
            return formCfg;
        };
        return QuickEditForm;
    }());
    domains.QuickEditForm = QuickEditForm;
})(domains || (domains = {}));
var domains;
(function (domains) {
    var RoomsView = (function (_super) {
        __extends(RoomsView, _super);
        function RoomsView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        RoomsView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("order").Header("⟠", 35).Sort().Edit().Tooltip("Сортировка в календаре"),
                    $u.column("name").Header("Название", 200).Sort().Filter(),
                    $u.column("base").Header("База", 150).Sort().Filter(),
                    $u.column("square").Header("Площадь").AsInt().Sort(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                    $u.column("allowMobile").Header("Моб").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    id: -1,
                    name: "без имени",
                    color: "#f89623",
                },
                type: {
                    href: "#!",
                },
                save: domains.db.getSaveCfg(true),
            }).Editable();
            var view = {
                rows: [
                    $u.panelbar(this.grid.btnRefresh(function (_) { return _this.reload(''); }), {}),
                    gridCfg,
                ],
            };
            return view;
        };
        RoomsView.prototype.reload = function (domain) {
            var items = rooms.db.list({ domain: domain });
            this.grid.refresh(items);
        };
        return RoomsView;
    }($u.View));
    domains.RoomsView = RoomsView;
})(domains || (domains = {}));
var mailings;
(function (mailings) {
    var EditView = (function (_super) {
        __extends(EditView, _super);
        function EditView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            _this.grid = new $u.RefGrid();
            return _this;
        }
        EditView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var gridPanelCfg = $u.rows($u.toolbar(this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this._reload_jobs(_this.objectId); }), {}), this.grid.config().extend({
                columns: [
                    $u.column("status").Header("Статус").AsSelect(jobs.statuses).Filter().Edit(),
                    $u.column("date").Header("Дата", 120).AsDate(webix.i18n.fullDateFormatStr),
                    $u.column("attempts").Header("Попыток").AsNumber().Filter(),
                    $u.column("description").Header("Описание", -1).Edit().Filter(),
                ],
                scheme: {},
                rules: {
                    "status": webix.rules.isNotEmpty,
                },
            }).Editable(jobs.db.getSaveCfg(true)).Footer());
            var temps = templates.db.names({ key: templates.TemplateKind.Manual });
            var view = this.form.config().Labels(100).extend({
                elements: [
                    $u.cols($u.button("Сохранить").Click(function () { return _this.save(); }), $u.button("Разослать").Click(function () { return _this.send(); }), {}),
                    $u.element("name").Label("Название"),
                    $u.cols($u.rows($u.element("templateId").Label("Шаблон").AsSelect(temps).Require(), $u.element("fromDate").Label("Старт с").AsDate(true), $u.element("status").Label("Статус").AsSelect(mailings.statuses).Readonly(), $u.element("description").Label("Описание").AsTextArea(100), $u.element("isArchive").Label("Архив").AsCheckbox()), $u.element("values").Label("Почтовые адреса").AsTextArea(400)),
                    $u.tabview()
                        .Tab("Рассылка", gridPanelCfg)
                        .Autoheight()
                ],
            });
            return view;
        };
        EditView.prototype.$reload = function (id) {
            _super.prototype.$reload.call(this, id);
            var vals = this.form.load(mailings.db.getUrl(id));
            this._reload_jobs(id);
        };
        EditView.prototype._reload_jobs = function (id) {
            var jblist = jobs.db.list(id);
            this.grid.refresh(jblist);
        };
        EditView.prototype.save = function () {
            if (!this.form.validate())
                return false;
            var s = 0;
            this.form.save(mailings.db.saveUrl(this.objectId), false);
            webix.message("Данные сохранены на сервере");
            return true;
        };
        EditView.prototype.send = function () {
            if (this.save() != true)
                return;
            mailings.db.send(this.objectId);
            this.$reload(this.objectId);
            webix.message("Отправлена рассылка");
        };
        return EditView;
    }($u.View));
    mailings.EditView = EditView;
})(mailings || (mailings = {}));
var mailings;
(function (mailings) {
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.grid = new $u.RefGrid();
            return _this;
        }
        GridView.prototype.$config = function () {
            var _this = this;
            _super.prototype.$config.call(this);
            var temps = templates.db.names({ key: templates.TemplateKind.Manual });
            var gridCfg = this.grid.config().extend({
                columns: [
                    $u.column("name").Header("Название", 200).Sort().Filter().Template($u.getViewLink("mailings", "#name#")),
                    $u.column("description").Header("Описание", -1).Filter(),
                    $u.column("fromDate").Header("Старт", 110).AsDate(webix.i18n.fullDateFormatStr).Edit(),
                    $u.column("status").Header("Статус").AsSelect(mailings.statuses).Filter().Edit(),
                    $u.column("ok").Header("Ок", 40),
                    $u.column("errors").Header("Ошиб", 45),
                    $u.column("templateId").Header("Шаблон", 250).AsSelect(temps).Filter(),
                    $u.column("isArchive").Header("Арх").AsCheckboxReadly().Sort(),
                ],
                scheme: {
                    name: "новая рассылка",
                },
            }).Editable(mailings.db.getSaveCfg(true));
            var view = {
                rows: [
                    $u.panelbar(this.grid.btnAdd(), this.grid.btnDel(), this.grid.btnRefresh(function (_) { return _this.refresh(); }), {}),
                    gridCfg,
                ],
            };
            return view;
        };
        GridView.prototype.$activate = function (args) {
            _super.prototype.$activate.call(this, args);
            if (this.first)
                this.refresh();
        };
        GridView.prototype.refresh = function () {
            var items = mailings.db.list();
            this.grid.refresh(items);
        };
        return GridView;
    }($u.View));
    mailings.GridView = GridView;
})(mailings || (mailings = {}));
var mailings;
(function (mailings) {
    mailings.create = {
        grid: function () { return new mailings.GridView(); },
        edit: function () { return new mailings.EditView(); },
    };
    var DataSource = (function (_super) {
        __extends(DataSource, _super);
        function DataSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.send = function (id) { return _this.post("send", { id: id }); };
            return _this;
        }
        return DataSource;
    }(lists.DataSource));
    mailings.db = new DataSource("mailings");
    var MailingStatus;
    (function (MailingStatus) {
        MailingStatus[MailingStatus["Unknown"] = 0] = "Unknown";
        MailingStatus[MailingStatus["Ok"] = 10] = "Ok";
    })(MailingStatus = mailings.MailingStatus || (mailings.MailingStatus = {}));
    mailings.statuses = [
        { id: MailingStatus.Ok, value: 'ОК' },
    ];
})(mailings || (mailings = {}));
//# sourceMappingURL=all.js.map