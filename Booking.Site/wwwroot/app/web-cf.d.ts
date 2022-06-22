declare module It.UI {
    let Ru: {
        Controls: {
            Ok: string;
            Cancel: string;
            Clear: string;
            Close: string;
            Back: string;
            Add: string;
            Del: string;
            Refresh: string;
            Save: string;
            Window: string;
            DelAsk: string;
            PhotoDragDrop: string;
        };
        Msg: {
            Reloaded: string;
        };
        Date: {
            Wait: string;
            Just: string;
            Sec: string;
            Min: string;
            Hour: string;
            Day: string;
            Ago: string;
        };
        Tooltips: {
            Add: string;
            AddTop: string;
            AddSub: string;
            Del: string;
            Save: string;
            Refresh: string;
            Expand: string;
            Collapse: string;
        };
        Excel: {
            Label: string;
            Help: string;
            Insert: string;
            Schema: string;
            InsertLabel: string;
            ResultLabel: string;
        };
        System: {
            LoginLink: string;
            LoginLabel: string;
            LoginHeader: string;
            Logout: string;
            PasswordLabel: string;
            PasswordLabel2: string;
            NotLogged: string;
            LoginOK: string;
            LoginCancel: string;
            RegisterHeader: string;
            NameLabel: string;
            EmailLabel: string;
            RegisterOK: string;
            RegisterResult: string;
        };
    };
}
declare module It.UI {
    let En: {
        Controls: {
            Ok: string;
            Cancel: string;
            Clear: string;
            Close: string;
            Back: string;
            Add: string;
            Del: string;
            Refresh: string;
            Save: string;
            Window: string;
            DelAsk: string;
            PhotoDragDrop: string;
        };
        Msg: {
            Reloaded: string;
        };
        Date: {
            Wait: string;
            Just: string;
            Sec: string;
            Min: string;
            Hour: string;
            Day: string;
            Ago: string;
        };
        Tooltips: {
            Add: string;
            AddTop: string;
            AddSub: string;
            Del: string;
            Save: string;
            Refresh: string;
            Expand: string;
            Collapse: string;
        };
        Excel: {
            Label: string;
            Help: string;
            Insert: string;
            Schema: string;
            InsertLabel: string;
            ResultLabel: string;
        };
        System: {
            LoginLink: string;
            LoginLabel: string;
            LoginHeader: string;
            Logout: string;
            PasswordLabel: string;
            PasswordLabel2: string;
            NotLogged: string;
            LoginOK: string;
            LoginCancel: string;
            RegisterHeader: string;
            NameLabel: string;
            EmailLabel: string;
            RegisterOK: string;
            RegisterResult: string;
        };
    };
}
declare module It.UI {
    let loc: {
        Controls: {
            Ok: string;
            Cancel: string;
            Clear: string;
            Close: string;
            Back: string;
            Add: string;
            Del: string;
            Refresh: string;
            Save: string;
            Window: string;
            DelAsk: string;
            PhotoDragDrop: string;
        };
        Msg: {
            Reloaded: string;
        };
        Date: {
            Wait: string;
            Just: string;
            Sec: string;
            Min: string;
            Hour: string;
            Day: string;
            Ago: string;
        };
        Tooltips: {
            Add: string;
            AddTop: string;
            AddSub: string;
            Del: string;
            Save: string;
            Refresh: string;
            Expand: string;
            Collapse: string;
        };
        Excel: {
            Label: string;
            Help: string;
            Insert: string;
            Schema: string;
            InsertLabel: string;
            ResultLabel: string;
        };
        System: {
            LoginLink: string;
            LoginLabel: string;
            LoginHeader: string;
            Logout: string;
            PasswordLabel: string;
            PasswordLabel2: string;
            NotLogged: string;
            LoginOK: string;
            LoginCancel: string;
            RegisterHeader: string;
            NameLabel: string;
            EmailLabel: string;
            RegisterOK: string;
            RegisterResult: string;
        };
    };
}
declare var warr: any;
declare module It.UI {
    var locEn: {
        Err: {
            Error: string;
            UnknownError: string;
            AccessError: string;
            ErrorText: string;
            ResNotFound: string;
            ValidationError: string;
            ValidationRequire: string;
            TemplateError: string;
            ClipboardError: string;
        };
        Date: {
            Wait: string;
            Just: string;
            Sec: string;
            Min: string;
            Hour: string;
            Day: string;
            Ago: string;
        };
    };
    let locRu: {
        Err: {
            Error: string;
            UnknownError: string;
            AccessError: string;
            ErrorText: string;
            ResNotFound: string;
            ValidationError: string;
            ValidationRequire: string;
            TemplateError: string;
            ClipboardError: string;
        };
        Date: {
            Wait: string;
            Just: string;
            Sec: string;
            Min: string;
            Hour: string;
            Day: string;
            Ago: string;
        };
    };
    let coreLocale: {
        Err: {
            Error: string;
            UnknownError: string;
            AccessError: string;
            ErrorText: string;
            ResNotFound: string;
            ValidationError: string;
            ValidationRequire: string;
            TemplateError: string;
            ClipboardError: string;
        };
        Date: {
            Wait: string;
            Just: string;
            Sec: string;
            Min: string;
            Hour: string;
            Day: string;
            Ago: string;
        };
    };
}
declare var $: any;
declare type callback = ((...args: any[]) => void);
declare type action<T> = (T: any) => void;
declare type func0<R> = () => R;
declare type func1<T, R> = (T: any) => R;
declare type guid = string;
declare type int = number;
declare module It.UI {
    type dialogType = "" | "warning" | "error";
    export var message2: (args: any) => any;
    export var message: (text: string, type?: dialogType) => any;
    export var confirmDialog: (args: any) => any;
    export var alertDialog: (args: any) => any;
    /** отображение типового диалогового окна */
    export var alert: (text: string, title?: string, type?: dialogType) => any;
    export var error: (text: string, title?: string) => any;
    /*** blink window tab - https://howto.lintel.in/how-to-blink-browser-tab/ */
    export var blinkTab: (message: any) => void;
    export {};
}
interface Array<T> {
    clear(): void;
    insert(index: number, item: T): any;
    filterNotEmpty(): T[];
    find(where: (x: T) => boolean): T;
    findById(id: any, defVal?: any): T;
    idval(id: any, defVal?: any): T;
    remove(item: T): number;
}
declare function resizeBrowser(): void;
/**
 * Скролл
 * @param id
 */
declare function scrollElement(id: any): boolean;
/**
 * Usage:
 *   let ctor = constructor(item.form);
 *   let view: $.View = new ctor();
 */
declare function constructor(classname: string): any;
/** set property path */
declare function getPropValue(obj: any, path: string): any;
/** set property path */
declare function setPropValue(obj: any, path: string, value: any): void;
/** x % y */
declare function percent(x: number, y: number): number;
declare let span: HTMLSpanElement;
declare function html2text(html: any): string;
declare function Guid(): string;
/** copy props */
declare function copy(target: any, src: any, override?: boolean): void;
declare function getSelectedText(): string;
declare function getSelectedHtml(): string;
interface Date {
    isWeekend(): any;
    addHours(n: number): Date;
    addDays(n: number): Date;
    addMonth(n: number): Date;
    toLocaleJSON(): string;
}
declare function pad(number: any): any;
declare function dateFormat(d: Date, full?: boolean): string;
declare const regDate: RegExp;
declare function jsonDateParse(key: any, value: any): any;
declare function parseDate(val: any): any;
declare function isValidDate(date: any): boolean;
declare var __days: string[];
declare function getWeekDay(d: Date): string;
/**
 * Возвращаем, сколько времени прошло до текущего момента
 */
declare function passedTime(date: Date): string;
declare module It {
    var dateDiff: {
        format: typeof dateFormat;
        weekDay: typeof getWeekDay;
        valid: typeof isValidDate;
        parse: typeof parseDate;
        inHoursAbs: (d1: any, d2?: Date) => number;
        inHours: (d1: any, d2?: Date) => number;
        inDays: (d1: any, d2?: Date) => number;
        inWeeks: (d1: any, d2?: Date) => number;
        inMonths: (d1: any, d2?: Date) => number;
        inYears: (d1: any, d2?: Date) => number;
        inPassedTime: typeof passedTime;
    };
}
interface String {
    maxleft(n: number): any;
    htmlEncode(): any;
    parseUrl(string: any): any;
    link(url: string, args?: any): string;
    tag(tag: string, args?: any): string;
    img(args?: any): string;
    args(args?: any): string;
    replaceAll(search: any, replacement: any): string;
}
declare let Symbols: {
    calendar: string;
    pencil0: string;
    pencil1: string;
    pencil: string;
    play: string;
    pencil3: string;
    basket: string;
    Check: string;
    Cross: string;
};
declare let regex: RegExp;
declare module It {
    let symbols: {
        calendar: string;
        pencil0: string;
        pencil1: string;
        pencil: string;
        play: string;
        pencil3: string;
        basket: string;
        Check: string;
        Cross: string;
    };
}
declare module It {
    var clipboard: {
        getData: () => any;
        setData: (text: any) => any;
        clearData: () => any;
    };
    /** Уникальный идентификатор */
    function uid(): number;
    class Event {
        on(handler: callback): void;
        clear(): void;
        call(...args: any[]): void;
        private _handlers;
    }
    function isMobile(): boolean;
    let mobile: {
        Android: () => RegExpMatchArray;
        BlackBerry: () => RegExpMatchArray;
        iOS: () => RegExpMatchArray;
        Opera: () => RegExpMatchArray;
        Windows: () => RegExpMatchArray;
        any: () => RegExpMatchArray;
    };
}
declare module It.storage.cookies {
    function read(name: string): string;
    function write(name: string, value: string, days?: number): void;
    function remove(name: string): void;
}
declare module It.storage.local {
    function get(name: string): any;
    function remove(name: string): void;
    function put(name: string, obj: any): void;
}
declare module It.Web {
    /** services for tree data operations */
    class TreeService {
        data: any;
        lookup: any;
        list: any[];
        idAttr: string;
        parentAttr: string;
        childrenAttr: string;
        expand(ids: number[], onload: (Object: any) => Object): any[];
        loadTree(list: any[], idAttr: string, parentAttr: string, childrenAttr: string): any[];
    }
}
interface XMLHttpRequest {
    json(dateParse?: boolean, error?: boolean): any;
    text(): string;
    list(dateParse?: boolean): any[];
    tree(id?: string, parent?: string, data?: string): any[];
}
declare module It.Web {
    function list2tree(list: any[], id?: string, parent?: string, data?: string): any[];
    function get(url: string, args?: any): XMLHttpRequest;
    /**
     * Функция запроса без токена
     */
    function get0(url: string): XMLHttpRequest;
    function post(url: string, args?: any, json?: boolean): XMLHttpRequest;
    function put(url: string, args?: any): XMLHttpRequest;
    function del(url: string, args?: any): XMLHttpRequest;
    /** Request timeout - error for sync operations */
    function request(url: string, cmd?: string, args?: any, json?: boolean, use_token?: boolean, error?: boolean): XMLHttpRequest;
    function openUrl(url?: string, args?: any, isNew?: boolean): void;
    function parseUrlQuery(qstr: string): any;
    /**
     * Convert object args {p1:11,p2:'aaa'} -> "p1=11 p2='aaa'"
     */
    function args2attr(args: any): string;
    function args2style(args: any): string;
    /**
     * Возвращает значение запроса без ?
     */
    function getUrlQuery(data: any, encode?: boolean): string;
    function historyBack(reload?: boolean): void;
    function goReturnUrl(): void;
    /** Функция отображения ошибки запроса */
    function error(response: any, dialog?: boolean): boolean;
}
declare namespace It.Web {
    function loadJSAsync(file: string, onload: action<string>): void;
    /** check and load javascript file once  */
    function loadJS(file: string): void;
    /** check and load css once  */
    function loadCSS(file: string): void;
    /** check and load html once  */
    function loadHtml(file: string, target: any): void;
    /**
     * �������� ���������� �����
     */
    function loadText(file: string): string;
    function download(content: any, fileName: any, mimeType?: any): any;
}
declare namespace It.Web {
    class WebSource {
        controller: string;
        prefix: string;
        constructor(controller: string, prefix?: string);
        static base: string;
        url(action: string, args?: any): string;
        getUrl(id: any): string;
        saveUrl(id?: any): string;
        save(obj: any): any;
        delete(id: any): any;
        load(url: string, args?: any, dateParse?: boolean): any;
        loadList(url: string, args?: any, dateParse?: boolean): any[];
        loadTree(url: string, id?: string, parent?: string, args?: any, data?: any): any[];
        loadStr(url: string, args?: any): string;
        get(id: any): any;
        post(url: string, obj?: any, json?: boolean): any;
        put(url: string, obj?: any): any;
        getSaveCfg(autoupdate?: boolean): {
            url: string;
            updateFromResponse: boolean;
            autoupdate: boolean;
            on: {
                onAfterSaveError: (id: any, text: any, data: any, err: any) => boolean;
            };
        };
    }
}
declare module It.Web {
    /**
     * Базовый источник данных для любых внещних service
     */
    abstract class UrlSource {
        protected baseUrl: string;
        protected controller: string;
        protected prefix: string;
        constructor(baseUrl: string, controller: string);
        url(args?: any): string;
        load(name: string, args?: any): any;
        getUrl(id: any): string;
        saveUrl(id?: any): string;
        listUrl: (args?: any) => string;
        getSaveCfg(autoupdate?: boolean): {
            url: string;
            updateFromResponse: boolean;
            autoupdate: boolean;
            on: {
                onAfterSaveError: (id: any, text: any, data: any, err: any) => boolean;
            };
        };
    }
}
declare module It.Web.auth {
    class AuthSource extends WebSource {
        login(args: any): any;
        logout(): any;
        registration(args: any): any;
        check(): any;
    }
    let db: AuthSource;
}
declare module It.Web {
    function bindSocket(channel: string, key: string, caller: any): WebSocket;
}
declare module It.Web.auth.tokens {
    let current: string;
    function save(token: string): void;
    function check(): any;
    function clear(): void;
}
declare module It.Web.auth.logins {
    let last: string;
    function save(login: string): void;
}
interface Object {
    assign(x: any, y: any): any;
}
declare module app {
    class CoreDataSource extends It.Web.WebSource {
        upload_crop(file: any, folder: string, size?: number, origin?: boolean): any;
        guids(n?: number): any[];
    }
    let db: CoreDataSource;
    interface IObject {
        id: guid;
    }
}
declare module It.UI {
    function column(id?: string, map?: string): Configs.ColumnConfig;
    function element(name?: string): Configs.ElementConfig;
    function panelbar(...items: any[]): Configs.ContainerConfig;
    function toolbar(...items: any[]): Configs.ContainerConfig;
    /**
     * { align: "absolute", body: grid, css: 'webix_form, gravity: 1, left: 20, top: 20, bottom: 20, right: 20, },
     *  https://docs.webix.com/desktop__alignment.html
     */
    function align(body: any, align?: string, left?: number, top?: number, bottom?: number, right?: number): Configs.ContainerConfig;
    /**
     * Панель навигации с возвратом
     */
    function headbar(text: string, ...items: any[]): Configs.ContainerConfig;
    /**
     * Заголовок без вычура
     */
    function header(text?: string, ...items: any[]): Configs.ContainerConfig;
    function label(label: string, autowidth?: boolean): Configs.ItemConfig;
    function view(name: string): Configs.ContainerConfig;
    /**
     * view with tabs: tab(header, body)...
     */
    function tabview(): Configs.TabViewConfig;
    /**
     * top tab bar
     */
    function tabs(...tabs: any[]): Configs.TabsConfig;
    function button(label: string): Configs.ItemConfig;
    function template(text: any, data?: any): Configs.ItemConfig;
    function separator(): {
        template: string;
        width: number;
    };
    function popup(config: any, position?: string): Configs.ContainerConfig;
    function uploader(url: string, onload?: callback): Configs.BaseConfig;
    function splitter(border?: boolean): Configs.ItemConfig;
    function space(gravity?: number): Configs.ItemConfig;
    function icon(icon: string, label?: string): Configs.ItemConfig;
    function cells(...cells: any[]): Configs.ContainerConfig;
    function cols(...cols: any[]): Configs.ContainerConfig;
    function rows(...rows: any[]): Configs.ContainerConfig;
    function colsview(view: string, cols: any[]): Configs.ContainerConfig;
    function viewCenter(viewCfg: any): {
        rows: ({
            maxHeight: number;
            cols?: undefined;
        } | {
            cols: any[];
            maxHeight?: undefined;
        })[];
    };
}
declare module webix {
    let skin: any;
    function message(config: any): void;
    function alert(config: any): void;
    function require(url: string, callback: (args?: any) => void, target: any): void;
    interface env {
        mobile: boolean;
    }
}
declare module It.UI.w {
    let patterns2: {
        phone: {
            mask: string;
            allow: RegExp;
        };
        card: {
            mask: string;
            allow: RegExp;
        };
        date: {
            mask: string;
            allow: RegExp;
        };
        datetime: {
            mask: string;
            allow: RegExp;
        };
    };
    function error(text: string): void;
    function info(text: string): void;
}
declare module It.UI.Configs {
    class BaseConfig {
        protected id: any;
        protected options: any;
        protected on: any;
        protected tooltip: any;
        protected width: number;
        protected minWidth: number;
        protected minHeight: number;
        protected maxWidth: number;
        protected maxHeight: number;
        protected autoheight: boolean;
        protected height: number;
        protected gravity: number;
        protected type: any;
        protected hidden: boolean;
        protected margin: number;
        protected padding: number;
        protected paddingX: number;
        protected paddingY: number;
        protected css: string;
        protected attributes: any;
        protected view: string;
        protected autowidth: boolean;
        protected scroll: any;
        protected disabled: boolean;
        protected checkOn(): any;
        protected checkType(): any;
        On(event: string, callback: callback): this;
        extend(config: any): this;
        Type(type: any, condition?: boolean): this;
        View(view: string): this;
        Id(id: string): this;
        Disable(disabled?: boolean): this;
        Ref(ref: RefUI): this;
        Tooltip(template: any): this;
        Attributes(attributes: any): this;
        Scrollable(): this;
        /**
         * Size
         * if no params - autoheight
         * if <0 - gravity
         */
        Size(width?: any, height?: any): this;
        /**
         * Высота по умолчанию
         * @param auto
         */
        Autoheight(auto?: boolean): this;
        /**
         * Автоматический ресайзинг при смене размера родительского контейнера
        */
        AutoResize(): this;
        /**
         * Min width
         */
        Min(width: number, height?: number): this;
        /**
         * Max size
         */
        Max(width: number, height?: number): this;
        Padding(x: any, y?: any): this;
        Margin(x: any): this;
        Visible(visible: boolean): this;
        Css(css: any, append?: boolean): this;
    }
}
declare module It.UI.Configs {
    class ContainerConfig extends BaseConfig {
        template: any;
        view: any;
        protected autoheight: boolean;
        cols: any[];
        rows: any[];
        protected responsive: any;
        protected responsiveCell: any;
        Cols(...items: any[]): void;
        Rows(...items: any[]): void;
        /**
         * hidden: true/false
         * moved: id:"a1", rows:[ { responsive:"a1", ...
         * see: https://docs.webix.com/desktop__responsive_layout.html
         */
        Responsive(resp: any): this;
        KeepResponsive(resp?: boolean): this;
        Flex(flex?: boolean): this;
    }
}
declare module It.UI.Configs {
    class TableConfig extends ContainerConfig {
        private table;
        protected orderName: string;
        protected lastId: number;
        protected editable: boolean;
        protected editaction: string;
        protected save: any;
        columns: any[];
        constructor(table: UI.RefTable);
        Editable(saveConfig?: any, edit?: boolean): this;
        Columns(...items: any[]): void;
        Unselectable(): this;
        OnSelect(onselect: callback): this;
        /**
         *
         * returns [ids] of selection
         */
        OnSelectChange(onselect: action<any>): this;
        OnItemSelect(onselect: action<any>): this;
        OnItemClick(onclick: action<any>): this;
        OnAdd(onadd: action<any>): this;
        /**
         * Tooltip
         * @param tooltip = string or {template: string}
         */
        Tooltip(template?: string): this;
        protected onLoadError(text: any, xml: any, ajax: any, owner: any, err: any): void;
    }
}
declare module It.UI.Configs {
    class ColumnConfig extends BaseConfig {
        id: string;
        private map?;
        constructor(id: string, map?: string);
        private header;
        private editor;
        private sort;
        private fillspace;
        private template;
        private suggest;
        private format;
        private numberFormat;
        private invalidMessage;
        private footer;
        private _settings;
        AsInt(): this;
        AsNumber(nformat?: string): this;
        AsDate(format?: webix.WebixCallback): this;
        AsCheckbox(threeState?: boolean): this;
        AsCheckboxReadly(readonly?: boolean): this;
        AsRadio(): this;
        /**
         * Символ сортировки
         * @param char
         */
        AsOrderMarker(char?: string): this;
        AsColor(): this;
        AsSelect(list: any, editor?: string): this;
        AsSuggest(list: any, editor?: string): this;
        /**
         * НЕ РАБОТАЕТ!!! edit as multiselect dropdown list
         */
        AsMultiSelect(list: any, editor?: string): this;
        /**
         * header - text or  { css: 'multiline', height: 60, text: 'Текст' }
         */
        Header(header: any, width?: number): this;
        /**
         * function(obj) or string
         * @param template
         */
        Template(template: any): this;
        Expression(func: func1<any, any>): this;
        /**
         * string or function(obj, congig)
         *   see http://docs.webix.com/desktop__tooltip.html
         */
        Tooltip(template: any): this;
        /**
         * Sample:
         *    format( webix.i18n.numberFormat ), see https://docs.webix.com/datatable__formatting.html
         */
        Format(format: any): this;
        /**
         * Sample:
         *   format("1'111.00") // number format editor
         */
        Pattern(pattern: string): this;
        Sort(): this;
        /**
         * See: https://docs.webix.com/desktop__editing.html#text
         */
        Edit(editor?: string): this;
        Filter(): this;
        /** countColumn, summColumn, avgColumn, see:
         * http://docs.webix.com/datatable__headers_footers.html
         */
        Footer(footer?: any): this;
        Error(text: string): this;
    }
}
declare module It.UI.Configs {
    class DataViewConfig extends TableConfig {
        private list;
        constructor(list: UI.RefDataView);
        Template(template: any): this;
        ItemSize(width?: any, height?: any): this;
    }
}
declare module It.UI.Configs {
    class ElementConfig extends BaseConfig {
        name: string;
        constructor(name: string);
        protected label: string;
        protected labelRight: string;
        protected labelWidth: number;
        protected labelPosition: string;
        protected timepicker: boolean;
        protected readonly: boolean;
        protected format: any;
        protected validate: any;
        protected required: boolean;
        protected invalidMessage: string;
        protected value: any;
        protected editable: boolean;
        protected scroll: any;
        protected borderless: boolean;
        protected yCount: number;
        protected template: string;
        protected keyPressTimeout: number;
        protected pattern: any;
        protected placeholder: string;
        protected bottomLabel: string;
        protected min: number;
        protected max: number;
        protected vertical: boolean;
        /**
         * Добавление подписи
         * @param label
         * @param width
         * @param position - top, right
         */
        Label(label: string, position?: string, width?: number): this;
        LabelR(label: string): this;
        /**
        * Паттерн ввода
        * @param pattern  sample: { mask:"###-## ########", allow:/[0-9]/g}
        */
        Format(pattern: any, use?: boolean): this;
        Readonly(readonly?: boolean): this;
        On(event: string, handler: callback): this;
        OnChange(handler: callback): this;
        Validate(func: Function, messge?: string): this;
        Require(messge?: string, required?: boolean): this;
        RangeDates(d1: Date, d2?: Date): this;
        Error(text: string): this;
        Value(val: any): this;
        MaxLength(n: number): this;
        Tooltip(template: any): this;
        Placeholder(placeholder: any): this;
        BottomLabel(label?: string): this;
        AsLabel(): this;
        AsTemplate(template: any, autoheight?: boolean): this;
        AsHtmlLabel(height?: number): this;
        AsText(): this;
        AsImage(url?: string, style?: string): this;
        AsNumber(format?: string): this;
        AsInt(format?: string): this;
        AsCounter(min?: number, max?: number): this;
        AsSearch(searchClick?: callback, placeholder?: string): this;
        AsTextArea(height?: number, position?: string): this;
        /**
         * Встроенный DIV редактор html
         */
        AsHtmlEditor(height?: number, position?: string): this;
        /**
         * Tiny MCE editor
         */
        AsHtml(): this;
        AsCodeEditor(mode?: string, height?: number, position?: string): this;
        AsDate(timepicker?: boolean): this;
        AsTime(): this;
        AsMonth(): this;
        AsYear(): this;
        AsColor(): this;
        AsCheckbox(right?: boolean): this;
        AsSwitch(onLabel?: string, offLabel?: string): this;
        AsPassword(): this;
        AsEmail(): this;
        AsUrl(): this;
        AsTelephone(pattern?: {
            /**
             * Добавление подписи
             * @param label
             * @param width
             * @param position - top, right
             */
            mask: string;
            allow: RegExp;
        }): this;
        AsRadio(options: any): this;
        private autocomplete;
        AsSelect(options: any, view?: string): this;
        /**
         * Расширенный SELECT
         * @param options
         * @param template - шаблон
         * @param server - выполняется ли поиск на сервере по ссылке
         */
        AsSelect2(options: any, template?: string, filter?: string, server?: boolean): this;
        AsMultiSelect(options: any, server?: boolean, view?: string, template?: string): this;
    }
}
declare module It.UI.Configs {
    class FormConfig extends ContainerConfig {
        private __container;
        constructor(__container: UI.RefDataContainer);
        elementsConfig: any;
        elements: any[];
        Labels(width: number, position?: string): this;
        Readonly(val: boolean): this;
        Elements(...items: any[]): void;
    }
}
declare module It.UI.Configs {
    class GridConfig extends TableConfig {
        private grid;
        private scheme;
        protected footer: boolean;
        protected subrow: string;
        protected subRowHeight: any;
        protected drag: any;
        constructor(grid: RefGrid);
        /**
         * event for common.radio(), common.checkbox() templates
         * see: https://webix.com/snippet/3559b627
         *
         * @param action (row,col,value) => void
         */
        OnCheck(action: callback): this;
        /**
         * Отслеживание изменений
         * @param action (vals, column)
         * vals: old, value
         * column: column: string, config, ...
         * https://docs.webix.com/api__refs__editability.html
         * https://docs.webix.com/api__editability_onaftereditstop_event.html
         */
        OnEdit(action: callback): this;
        /**
         * Позволяет сортировать записи перетаскиванием,
         * Если задан orderColumn - то только в спец. колонке
         */
        DragOrder(action: callback, orderColumn?: boolean): this;
        Subrow(template: string, height?: string): this;
        Footer(): this;
    }
}
declare module It.UI.Configs {
    class ItemConfig extends BaseConfig {
        private click;
        private popup;
        private hotkey;
        protected align: string;
        protected batch: string;
        constructor(view?: string);
        Click(onclick: callback): this;
        Align(align: any): this;
        Hidden(hidden: boolean): this;
        Hotkey(hotkey: string): this;
        Batch(batch: string): this;
        /**
         *
         * @param config
         * @param create - oncreate callback  or true (autocreate)
         */
        Popup(config: any, create?: callback): this;
        PopupCfg(config: PopupConfig): this;
        OnChange(action: action<any>): this;
    }
}
declare module It.UI.Configs {
    class ListConfig extends TableConfig {
        private list;
        constructor(list: UI.RefList);
        DragDrop(ordername: string): this;
        Editable(saveConfig?: any): this;
        private onOrderDrop;
    }
}
declare module It.UI.Configs {
    class PopupConfig extends BaseConfig {
        protected config: any;
        protected head?: any;
        constructor(config: any, head?: any);
        OnPopup(onpopup: callback): this;
    }
}
declare module It.UI.Configs {
    abstract class BaseTreeConfig extends TableConfig {
        protected tree: UI.RefTree;
        constructor(tree: UI.RefTree);
        DragDrop(): this;
        private onBeforeDrop;
        private onAfterDrop;
    }
}
declare module It.UI.Configs {
    class TabsConfig extends ItemConfig {
        protected multiview: boolean;
        protected options: any[];
        protected value: string;
        protected optionWidth: any;
        constructor(tabs: any[]);
        Value(id: string): this;
        /**
         * if no width - auto
         */
        TabWidth(width?: string): this;
    }
}
declare module It.UI.Configs {
    class TabViewConfig extends ItemConfig {
        protected value: string;
        protected cells: any[];
        tabbar: {
            optionWidth: string;
        };
        constructor();
        Value(id: string): this;
        Tab(header: string, body: any, tab?: any): this;
    }
}
declare module It.UI.Configs {
    class TreeConfig extends BaseTreeConfig {
        private editor;
        private editValue;
        constructor(tree: UI.RefTree);
        Editable(property: string): this;
        /**
         * Sample: "{common.icon()} {common.folder()}<span>#value#<span>"
         */
        Template(template: any): this;
    }
}
declare module It.UI.Configs {
    class TreeTableConfig extends BaseTreeConfig {
        constructor(tree: UI.RefTree);
    }
}
declare module It.UI.Configs {
    class MultiViewConfig extends ContainerConfig {
        constructor(id: any);
    }
}
declare module It.UI.Configs {
    let HREF_PREFIX: string;
    var defaults: {
        keyDelay: number;
        padding: number;
        labelWidth: number;
        placeholders: boolean;
        dropwidth: number;
        /** Use icon or buttons   */
        toolbarIcon: boolean;
        select: string;
        multiselect: string;
        dateedit: boolean;
        input_numtype: string;
    };
    function custom_checkbox(obj: any, common: any, value: any): "<div class='fa fa-chevron-down'></div>" | "<div class='webix_table_checkbox notchecked'></div>";
}
declare module It.UI {
    /**
     reference to the UI control
    */
    class RefUI {
        id: any;
        protected _ref: any;
        get ref(): any;
        setAttrId(id: any): void;
        set(vals: any, refresh?: boolean): void;
        bind(table: RefTable, filter?: (slave: any, master: any) => boolean): void;
        updateBindings(): boolean;
        visible(val: boolean): void;
        enable(enable?: boolean): void;
        getValue(): any;
        setValue(value: any): any;
        setValues(value: any): any;
        getText(): string;
        toExcel(options?: any): void;
        get<T>(): T;
    }
}
declare module It.UI {
    class RefContainer extends RefUI {
        getChildViews(): webix.ui.view[];
        collapse(collapse?: boolean): void;
    }
}
declare module It.UI {
    /**
     * base data container (form, template, ..)
     */
    class RefDataContainer extends RefContainer {
        /** load form values from the server */
        load(url: string, args?: any): any;
        values(changed?: boolean): any;
        /**
         * Присвоение данных с расширением текущих значений формы]
         */
        setValuesEx(vals: any): any;
        setValues(vals: any): any;
        clearValidation(): void;
    }
}
declare module It.UI {
    class RefForm extends RefDataContainer {
        dataSource?: Web.WebSource;
        constructor(dataSource?: Web.WebSource);
        onSave: (vals: any) => void;
        /** список контролов */
        get elements(): any;
        enable(val: boolean, element?: string): void;
        visible(val: boolean, element?: string): void;
        clear(vals?: {}): void;
        setElement(element: any, config: any): void;
        /** post/put all form values */
        save(url: string, ispost: boolean, args?: any): any;
        isChanged(): boolean;
        /** clear changes, dirty = false */
        clearChanges(): any;
        validate(error?: string): any;
        clearValidation(): void;
        config(): Configs.FormConfig;
    }
}
declare module It.UI {
    /** abstract view for grid & tree */
    class RefTable extends RefUI {
        asEditAbility(): webix.EditAbility;
        /**
         * add,delete, filter, count, ...  https://docs.webix.com/api__refs__datastore.html
         */
        asDataStore(): webix.DataStore;
        btnAdd_fn(vals: callback, index?: any): Configs.ItemConfig;
        btnAdd(value?: any, index?: any): Configs.ItemConfig;
        btnDel(): Configs.ItemConfig;
        btnSave(): Configs.ItemConfig;
        btnRefresh(onclick?: callback): Configs.ItemConfig;
        textFilter(expr?: string, label?: string): Configs.ContainerConfig;
        /**
         * See: http://docs.webix.com/api__link__ui.datatable_filter.html
         * @param func
         */
        filterByFunc(func: any): void;
        filterByExpr(expr: string, text: any): void;
        getItems(filter?: any): any;
        /**
         * get data processor
         */
        data(): webix.DataProcessor;
        callNoEvents(func: callback): void;
        delSelected(ask?: boolean): boolean;
        getSelectedItem(): any;
        getSelectedId(): any;
        getSelectedItems(): any[];
        getSelectedIds(): any[];
        getItem(id: any): any;
        containsFilter(col: any): any;
        clearFilter(): void;
        refresh(data?: any): void;
        forEach(action: action<any>): void;
        reload(data: any, idProp: string): void;
        showItem(id: any): void;
        selectFirst(): void;
        selectLast(): void;
        select(id: any): void;
        clearSelection(): void;
        save(): void;
        cancel(): void;
        add(vals?: {}, index?: number, parentId?: string | number): any;
        /**
         * сбрасывает курсор для связанных форм и позволяет создавать новую запись при сохранении
         */
        bindNew(): void;
        updateCurrent(vals: any): any;
        updateRow(id: any, vals: any): any;
        removeRow(id: any): void;
        removeRows(ids: any[]): void;
        scheme(vals: any): void;
        attachOnSelect(onselect: (row: any) => void): void;
    }
}
declare module It.UI {
    /** reference to the webix list */
    class RefCombo extends RefUI {
        getItems(): any[];
        /**  get item by id, or selected item   */
        getItem(id?: any): any;
        selectFirst(): void;
        select(id: any): void;
        skipSelection(skip: number): void;
    }
}
declare module It.UI {
    /** reference to the webix list */
    class RefList extends RefTable {
        config(): Configs.ListConfig;
    }
}
declare module It.UI {
    class RefDataView extends RefTable {
        config(): Configs.DataViewConfig;
    }
}
declare module It.UI {
    /**
    * define popup (context) menu,
    *   + init(): attachTo(refui)
    */
    class RefMenu extends RefUI {
        /**
         * define & show context menu
         * item:  { value: "TEXT", icon: "plus", click: (obj,menu_item) => func(...) },
         */
        configCtxMenu(items: any[]): Configs.ContainerConfig;
        attachTo(control: RefUI): void;
    }
}
declare module It.UI {
    /** reference to the webix grid */
    class RefGrid extends RefTable {
        config(): Configs.GridConfig;
        clearSelection(): void;
        adjustRowHeight(column?: string): void;
        importFromCSV(config: any): void;
        /**
         *
         * @param config - схема конфигурации колонок]
         * @param csv - csv текст
         */
        importTableFromCSV(config: any, csv: any): void;
        exportToCSV(scheme: any): void;
        exportToFileCSV(scheme: any): void;
        getExportCSV(table: any, scheme: any, separator?: string): string;
    }
}
declare module It.UI {
    /** reference to the webix tree */
    class RefTree extends RefTable {
        asTreeStore(): webix.TreeStore;
        asTreeList(): webix.TreeCollection;
        asTreeAPI(): webix.TreeAPI;
        configTree(): Configs.TreeConfig;
        configTreeTable(): Configs.TreeTableConfig;
        btnAddTop(): Configs.ItemConfig;
        btnAddSub(): Configs.ItemConfig;
        btnExpand(): Configs.ItemConfig;
        btnCollapse(): Configs.ItemConfig;
        expand(id?: any): void;
        collapse(id?: any): void;
        getParentId(obj: any): any;
        setOrder(order: number): void;
        /**
         * Обновляет индексы текущей ветви
         * @param id
         */
        reindex(id: number | string, current?: any): void;
        addTop(item?: {}): void;
        addSub(item?: {}, parentId?: any): any;
        /**
         * gets index of the node in a specific branch
         * https://docs.webix.com/api__link__ui.tree_getbranchindex.html
         */
        getBranchIndex(id: any, parentId?: any): number;
        create(): {};
        /**
         * Сдвиг уровня влево (уменьшение)
         */
        shiftLeft(item: any): void;
        /**
         * Сдвиг уровня вправо (Увеличение)
         */
        shiftRight(item: any): void;
        /**
         * Активация редактора текста элемента
         */
        edit(id: any): void;
    }
}
declare module It.UI {
    /** Окно, обязательно вызывать config(viewCfg)   */
    class RefWin extends RefContainer {
        head: string;
        constructor(head?: string);
        modal: boolean;
        move: boolean;
        resize: boolean;
        onHide: callback;
        position: string;
        private headerLabel;
        private cfg;
        config(viewConfig: any): {
            view: string;
            id: any;
            head: {
                view: string;
                margin: number;
                cols: ({
                    view: string;
                    label: string;
                    id: any;
                    icon?: undefined;
                    click?: undefined;
                } | {
                    view: string;
                    icon: string;
                    click: () => void;
                    label?: undefined;
                    id?: undefined;
                })[];
            };
            modal: boolean;
            move: boolean;
            position: string;
            resize: boolean;
            body: any;
        };
        setHead(head: string): void;
        show(head?: string): void;
        hide(): void;
    }
}
declare module It.UI {
    class RefTemplate extends RefDataContainer {
        /**
         * template source
         * @param template - url (http->) or html string
         */
        config(template: any, data?: any): Configs.FormConfig;
    }
}
declare module It.UI {
    class RefHtmlForm extends RefForm {
        private template;
        /**
         * template source
         * @param template - url (http->) or html string
         */
        constructor(template: any);
        config(): Configs.FormConfig;
    }
}
declare module It.UI {
}
declare module It.UI {
    interface INavigateArgs {
        key?: string;
        module?: string;
        view?: string;
        $view?: any;
        oid?: any;
    }
}
import $u = It.UI;
declare module It.UI {
    function getVisibleMenuTree(menu: any[]): any[];
    /**
    * Иерархическое меню в виде панели bar
    */
    function sidebarMenu(menu: any[]): Configs.TreeConfig;
    /**
     * Кнопка
     */
    function sidebarButton(sidebar: any): any;
    /**
    * Иерархическое меню в виде дерева
    * {url, value, description, data: [] }
    */
    function treeMenu(menu: any[], navigator?: Navigator, bar?: RefUI): Configs.TreeConfig;
}
declare var routie: any;
declare module It.UI {
    /**
    * Класс для управления навигацией и роутингом в приложении
    */
    class Navigator {
        view: MultiView;
        defaultView: string;
        open(args: INavigateArgs): void;
        close(): void;
        $deactivate(): void;
        /**
         * register default module for routing
         * @param module
         */
        routers(module: string): void;
    }
}
declare module It.UI {
    function createModuleView(module: string, typeid: any): UI.View;
    function getViewLink(module: string, content?: string, id?: string, view?: string): string;
    function getLink(content: string, url: any): string;
    function openView(nav: $u.INavigateArgs, args?: any, isNew?: boolean): void;
    function uidialog(viewCfg: any, head?: any, modal?: boolean, move?: boolean): {
        view: string;
        id: any;
        head: {
            view: string;
            margin: number;
            cols: ({
                view: string;
                label: string;
                id: any;
                icon?: undefined;
                click?: undefined;
            } | {
                view: string;
                icon: string;
                click: () => void;
                label?: undefined;
                id?: undefined;
            })[];
        };
        modal: boolean;
        move: boolean;
        position: string;
        resize: boolean;
        body: any;
    };
    /**
     * Вызов события Action, для корректной передачи this  и Id текущего элемента
     * @param f
     */
    function callActiveContent(f: any): () => void;
}
declare module It.UI {
    /**
     * Класс для управления множеством UI элементов
     * ОСнова для StateMachine, UILogic
     */
    class UIManager {
        refs: any[];
        ref(state: any, autocreate?: boolean): RefUI;
        visible(state: any, visible: boolean): void;
        enable(state: any, enable: boolean): void;
    }
}
declare module It.UI {
    let css: {
        table: {
            table: {
                display: string;
            };
            row: {
                display: string;
            };
            cell: {
                display: string;
            };
        };
        overflow: {
            auto: {
                overflow: string;
            };
            hidden: {
                overflow: string;
            };
            visible: {
                overflow: string;
            };
            scroll: {
                overflow: string;
            };
        };
        pos: {
            margin: (n: number) => {
                margin: string;
            };
            padding: (n: number) => {
                margin: string;
            };
            marginp: (n: number) => {
                margin: string;
            };
            paddingp: (n: number) => {
                margin: string;
            };
            relative: {
                position: string;
            };
            absolute: {
                position: string;
            };
            fixed: {
                position: string;
            };
            left: {
                float: string;
            };
            right: {
                float: string;
            };
            clear_left: {
                clear: string;
            };
            clear_right: {
                clear: string;
            };
            clear_both: {
                clear: string;
            };
            none: {
                display: string;
            };
            flex: {
                display: string;
            };
            inline: {
                display: string;
            };
        };
    };
    /**
     * Получаем CSS стиль по его объектному описанию
     */
    function getCssStyle(style: any): string;
    /**
     * Переопределение существующего стиля, напр:  setCssStyle('.mylist .webix_dataview_item', { margin: '0px', border: 0 });
     */
    function setCssStyle(style: string, ...styles: any[]): void;
    function html(tag?: string, attrs?: any): HtmlTag;
    class HtmlTag {
        tag(name: any, attrs?: any): this;
        text(text: string): this;
        attr(attrs: any): this;
        /**
         * Задание inline стилея через список стилевых объектов
         */
        style(...styles: any[]): this;
        /**
         * стиль, м.б. задан как строкой, так и аттрибутами объекта (в этом случае стиль создается автоматически)
         */
        css(...styles: any[]): this;
        raw(html: string): this;
        /**
         * Добавляем вложенные теги
         */
        tags(...tags: HtmlTag[]): this;
        toHtml(): string;
        div(attrs?: any): this;
        private _checkRaw;
        private _tag;
        private _raw;
        private _class;
        private _text;
        private _attrs;
        private _style;
        private _parent;
        private _tags;
    }
}
declare module It.UI {
    class View {
        protected _owner?: View;
        constructor(_owner?: View);
        static Empty: {
            height: number;
        };
        objectId: any;
        win: $u.RefWin;
        args: any;
        first: boolean;
        active: boolean;
        onactivate: callback;
        onclose: callback;
        protected _views: View[];
        $config(): any;
        $init(): any;
        owner(owner: View): this;
        /** Вызывается при повторной активации представления  */
        $activate(args: any): void;
        $deactivate(): void;
        protected parseId(args: INavigateArgs): void;
        $reload(id?: any): void;
        show(args?: any): this;
        protected _getUrlArgs(): any;
        openWindow(): void;
    }
}
declare module It.UI {
    /**
    * Текстовое представление
    */
    class TextEditView extends View {
        text: any;
        constructor(text: any);
        $config(): {
            template: any;
        };
    }
}
declare module It.UI {
    /**
      * base view for selectors,
      * usage: $.icon("xxx").Click(() => this.setView(viewArgs)).Tooltip("xxxxxxxxx"),
      */
    abstract class SelectorView extends View {
        protected navigator: Navigator;
        protected currentView: any;
        protected current?: $u.INavigateArgs;
        $reload(id: any): void;
        $deactivate(): void;
        protected setView(args: INavigateArgs, id?: any): any;
        protected select(args: any): any;
    }
}
declare module It.UI {
    /**
         * class for tree editors
         * need to override menu()
         */
    abstract class TreeEditView extends View {
        protected tree: RefTree;
        protected views: MultiView;
        settings: {
            width: number;
        };
        abstract menu(): any[];
        $config(): any;
        $init(): any;
        configTree(data: any): {
            view: string;
            id: any;
            width: number;
            select: boolean;
            navigation: boolean;
            data: any;
            on: {
                onAfterSelect: (id: any) => void;
            };
        };
        $activate(args: any): void;
        private onChangeTopic;
    }
}
declare module It.UI {
    class HtmlView extends View {
        private source;
        private title;
        constructor(source?: string, title?: string);
        private template;
        private scrollable;
        $init(): {
            title: string;
        };
        $config(): any;
        scroll(scrollable?: boolean): this;
        setHtml(html: string): void;
        loadUrl(url: string): void;
    }
}
declare module It.UI {
    class MultiView extends View {
        onOpen: Event;
        private refview;
        private tabs;
        private lastKey;
        $config(): Configs.MultiViewConfig;
        open(key: any, args: INavigateArgs): any;
        close(): void;
        $activate(args: any): void;
        $deactivate(): void;
        private getLastViewObject;
    }
}
declare module It.UI {
    /**
  * Extends View by buttons "Do", "Clear", and form
  */
    class PopupView extends View {
        form: RefForm;
        private _onaction;
        private _onclear;
        protected: any;
        private _values;
        get values(): any;
        $config(okText?: string, clearText?: string): any;
        onAction(onaction: action<any>): this;
        onClear(onclear: callback): this;
        $action(): boolean;
        $clear(): void;
        hide(): void;
        protected invokeAction(vals: any): void;
    }
}
declare module It.UI {
    function showView(cfg: any): webix.ui.baseview;
    function initScroll(init?: boolean): void;
}
declare module auth_logins {
    class LoginView extends $u.View {
        private form;
        $config(): any;
        private login;
    }
}
declare module auth_logins {
    let create: {
        default: () => LoginView;
        reg: () => RegistrationView;
        login: () => LoginView;
        logout: () => $u.HtmlView;
    };
    class AuthSource extends It.Web.WebSource {
        login(args: any): any;
        logout(): any;
        registration(args: any): any;
        check(): any;
    }
    let db: AuthSource;
    function run(): void;
    function btLoginName(name?: string): $u.Configs.ItemConfig;
    function btLoginOut(module?: string): $u.Configs.ItemConfig;
}
declare module auth_logins {
    class RegistrationView extends $u.View {
        private form;
        $config(): any;
        private register;
    }
}
declare module skins {
    let skins: {
        id: string;
        value: string;
    }[];
    let skin: any;
    function load(): boolean;
    function selector(): $u.Configs.ElementConfig;
}
declare module It.UI {
    /**
     * Отображение множества View, привязынных к данным
     * Загрузка forms.reload( items )
     * Ограничение - несколько десятков (до 100)
     */
    class ContainerView extends $u.View {
        private _Creator;
        constructor(_Creator: func1<any, $u.View>);
        private _RefContainer;
        $config(): Configs.ContainerConfig;
        reload(list: any[]): void;
        private buildRuleViews;
    }
}
