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
    let locale: {
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
    var message2: (args: any) => any;
    var message: (text: string, type?: dialogType) => any;
    var confirm: (args: any) => any;
    var dialog: (args: any) => any;
    /** отображение типового диалогового окна */
    var alert: (text: string, title?: string, type?: dialogType) => any;
    var error: (text: string, title?: string) => any;
}
interface Array<T> {
    clear(): void;
    findById(id: any, defVal?: any): T;
    insert(index: number, item: T): any;
    filterNotEmpty(): T[];
    find(where: (x: T) => boolean): T;
    remove(item: T): number;
}
declare function resizeBrowser(): void;
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
    addDays(n: number): Date;
    addMonth(n: number): Date;
}
declare function dateFormat(d: Date, full?: boolean): string;
declare const regDate: RegExp;
declare function jsonDateParse(key: any, value: any): any;
declare function parseDate(val: any): any;
declare function isValidDate(date: any): boolean;
declare var __days: string[];
declare function getWeekDay(d: Date): string;
declare var loc: {
    Wait: string;
    Just: string;
    Sec: string;
    Min: string;
    Hour: string;
    Day: string;
    Ago: string;
};
/**
 * Возвращаем, сколько времени прошло до текущего момента
 */
declare function passedTime(date: Date): string;
declare var dateDiff: {
    inHoursAbs: (d1: any, d2?: Date) => number;
    inHours: (d1: any, d2?: Date) => number;
    inDays: (d1: any, d2?: Date) => number;
    inWeeks: (d1: any, d2?: Date) => number;
    inMonths: (d1: any, d2?: Date) => number;
    inYears: (d1: any, d2?: Date) => number;
    inPassedTime: typeof passedTime;
};
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
declare module It.Web {
    function json(rq: XMLHttpRequest, dateParse?: boolean): any;
    function list(rq: XMLHttpRequest, dateParse?: boolean): any[];
    function tree(rq: XMLHttpRequest, id?: string, parent?: string, data?: string): any[];
    function text(rq: XMLHttpRequest): string;
    function get(url: string, args?: any): XMLHttpRequest;
    function post(url: string, args?: any): XMLHttpRequest;
    function put(url: string, args?: any): XMLHttpRequest;
    function del(url: string, args?: any): XMLHttpRequest;
    function request(url: string, cmd?: string, args?: any, json?: boolean): XMLHttpRequest;
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
    function error(response: any): boolean;
}
declare namespace It.Web {
    function loadJSAsync(file: string, onload: action<string>): void;
    /** check and load javascript file once  */
    function loadJS(file: string): void;
    /** check and load css once  */
    function loadCSS(file: string): void;
    /**
     * �������� ���������� �����
     */
    function loadText(file: string): string;
    function download(content: any, fileName: any, mimeType?: any): boolean;
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
        loadTree(url: string, id?: string, parent?: string, args?: any): any[];
        loadStr(url: string, args?: any): string;
        get(id: any): any;
        post(url: string, obj?: any): any;
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
    function bindSocket(code: string, id: string, caller: any): WebSocket;
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
