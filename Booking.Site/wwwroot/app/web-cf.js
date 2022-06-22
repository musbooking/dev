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
        UI.Ru = {
            Controls: {
                Ok: "Выполнить",
                Cancel: "Отмена",
                Clear: "Очистить",
                Close: "Закрыть",
                Back: "Назад",
                Add: 'Создать',
                Del: 'Удалить',
                Refresh: 'Обновить',
                Save: 'Сохранить',
                Window: "Окно",
                DelAsk: "Удалить выделенные записи?",
                PhotoDragDrop: "Загрузите фото или перетащите мышью",
            },
            Msg: {
                Reloaded: "Данные обновлены",
            },
            Date: {
                Wait: 'ждем',
                Just: 'только что',
                Sec: 'сек.',
                Min: 'мин.',
                Hour: 'час.',
                Day: 'дн.',
                Ago: 'назад',
            },
            Tooltips: {
                Add: "Добавить новую запись",
                AddTop: "Добавить корневую",
                AddSub: "Добавить вложенную",
                Del: "Удалить выделенные записи",
                Save: "Сохранить изменения на сервере",
                Refresh: "Обновить данные",
                Expand: "Развернуть поддерево",
                Collapse: "Свернуть поддерево",
            },
            Excel: {
                Label: "Данные из Excel",
                Help: "Скопируйте и вставьте строки в Excel",
                Insert: "Вставьте строки из Excel",
                Schema: "Схема",
                InsertLabel: "Вставить",
                ResultLabel: "Импорт завершен",
            },
            System: {
                LoginLink: "Вход",
                LoginLabel: "Логин",
                LoginHeader: "ВХОД В СИСТЕМУ",
                Logout: "Выход",
                PasswordLabel: "Пароль",
                PasswordLabel2: "Пароль (повтор)",
                NotLogged: "Гость",
                LoginOK: "Войти",
                LoginCancel: "Закрыть",
                RegisterHeader: "РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ",
                NameLabel: "ФИО",
                EmailLabel: "E-mail (Логин)",
                RegisterOK: "Регистрировать",
                RegisterResult: "Вы успешно зарегистрировались",
            },
        };
        var i18n = window.webix.i18n;
        if (i18n) {
            i18n.pivot = {
                columns: "Колонки",
                count: "кол",
                fields: "Поля",
                filters: "Фильтр",
                max: "макс",
                min: "мин",
                operationNotDefined: "Операция не определена",
                pivotMessage: "[Настройка]",
                rows: "Строки",
                select: "выбор",
                sum: "сум",
                text: "текст",
                values: "Значения",
                windowTitle: "Конфигурация",
                windowMessage: "[Передвиньте поле в нужную область]",
            };
        }
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        UI.En = {
            Controls: {
                Ok: "Ok",
                Cancel: "Cancel",
                Clear: "Clear",
                Close: "Close",
                Back: "Back",
                Add: 'Add',
                Del: 'Delete',
                Refresh: 'Refresh',
                Save: 'Save',
                Window: "Window",
                DelAsk: "Delete selected records?",
                PhotoDragDrop: "Open or drag&drop Image",
            },
            Msg: {
                Reloaded: "List reloaded",
            },
            Date: {
                Wait: 'wait',
                Just: 'just ',
                Sec: 'sec.',
                Min: 'min.',
                Hour: 'hr.',
                Day: 'd.',
                Ago: 'ago',
            },
            Tooltips: {
                Add: "Add new item",
                AddTop: "Add root",
                AddSub: "Insert SubItem",
                Del: "Delete selected items",
                Save: "Save changes",
                Refresh: "Reload data",
                Expand: "Expand subtree",
                Collapse: "Collapse subtree",
            },
            Excel: {
                Label: "Data from Excel",
                Help: "Copy & Paste rows in Excel",
                Insert: "Paste rows from Excel",
                Schema: "Schema",
                InsertLabel: "Paste",
                ResultLabel: "Import complete",
            },
            System: {
                LoginLink: "Login",
                LoginLabel: "Login",
                LoginHeader: "LOGIN FORM",
                Logout: "Logout",
                PasswordLabel: "Password",
                PasswordLabel2: "Password (confirm)",
                NotLogged: "Guest",
                LoginOK: "Sign In",
                LoginCancel: "Close",
                RegisterHeader: "REGISTER FORM",
                NameLabel: "Name",
                EmailLabel: "E-mail (Login)",
                RegisterOK: "Register",
                RegisterResult: "You have successfully registered",
            },
        };
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        UI.loc = UI.Ru;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
// for IE11 supports
var warr = window.Array;
if (!warr.prototype.find) {
    warr.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
var It;
(function (It) {
    var UI;
    (function (UI) {
        UI.locEn = {
            Err: {
                Error: "Error",
                UnknownError: "Unknown error without details",
                AccessError: "Access error: ",
                ErrorText: "Ooops!! Unexpected error",
                //ErrorText1: "Ооопс! Что-то на сервере пошло не так... <p/> Попробуйте обновить страницу<br/>",
                ResNotFound: "Server resource not found",
                //+ "Ошибка записана в базу, мы уже работаем над ее исправлением. <br/>" +
                //+ "Наша команда уже на связи, и не оставит Вас в беде! <br/>"
                //+ "При повторе обратитесь к системному администратору <p/>"
                //+ "<img src = 'http://xaxa-net.ru/uploads/posts/2016-01/1453127143_selfi-kot-3_xaxa-net.ru.jpg' height= '342' width= '342' style='float: right' /> <p/>  " // http://img15.nnm.me/3/9/a/f/2/5d165dc8297764c114b3661ba48.jpg
                //+ "Минздрав предупреждает:<br/> каждый рабочий день укорачивает жизнь на сутки"
                //+ "",
                ValidationError: "Data validation error",
                ValidationRequire: "Requires value",
                TemplateError: "Error on load HTML: ",
                ClipboardError: "Can't paste HTML",
            },
            Date: {
                Wait: 'wait',
                Just: 'just ',
                Sec: 'sec.',
                Min: 'min.',
                Hour: 'hr.',
                Day: 'd.',
                Ago: 'ago',
            },
        };
        UI.locRu = {
            Err: {
                Error: "Ошибка",
                UnknownError: "(не получена детальная информация об ошибке)",
                AccessError: "Ошибка доступа, или не выполнен вход в систему",
                ErrorText: "Произошла неожиданная ошибка",
                ResNotFound: "Серверный ресурс не найден",
                //ErrorText1: "Ооопс! Что-то на сервере пошло не так... <p/> Попробуйте обновить страницу<br/>"
                //    //+ "Ошибка записана в базу, мы уже работаем над ее исправлением. <br/>" +
                //    + "Наша команда уже на связи, и не оставит Вас в беде! <br/>"
                //    + "При повторе обратитесь к системному администратору <p/>"
                //    + "<img src = 'http://xaxa-net.ru/uploads/posts/2016-01/1453127143_selfi-kot-3_xaxa-net.ru.jpg' height= '342' width= '342' style='float: right' /> <p/>  " // http://img15.nnm.me/3/9/a/f/2/5d165dc8297764c114b3661ba48.jpg
                //    //+ "Минздрав предупреждает:<br/> каждый рабочий день укорачивает жизнь на сутки"
                //    + "",
                ValidationError: "Ошибка данных",
                ValidationRequire: "Заполните значение поля",
                TemplateError: "Ошибка при загрузке HTML: ",
                ClipboardError: "Не поддерживается вставка HTML из буфера",
            },
            Date: {
                Wait: 'ждем',
                Just: 'только что',
                Sec: 'сек.',
                Min: 'мин.',
                Hour: 'час.',
                Day: 'дн.',
                Ago: 'назад',
            },
        };
        UI.coreLocale = UI.locRu;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
// export default It.UI
var It;
(function (It) {
    var UI;
    (function (UI) {
        // origin: http://dhtmlx.github.io/message/
        // see docs: https://docs.dhtmlx.com/message__windows_description.html
        var ithtml = {};
        UI.message2 = function (args) { return ithtml.message(args); };
        UI.message = function (text, type) { return ithtml.message({
            text: text,
            expire: 4000,
            type: type
        }); };
        ;
        UI.confirmDialog = function (args) { return ithtml.confirm(args); };
        UI.alertDialog = function (args) { return ithtml.alert(args); };
        /** отображение типового диалогового окна */
        UI.alert = function (text, title, type) { return ithtml.alert({
            title: title,
            text: text,
            type: type,
        }); };
        UI.error = function (text, title) { return ithtml.alert({
            title: title,
            text: text,
            type: "error",
        }); };
        /*** blink window tab - https://howto.lintel.in/how-to-blink-browser-tab/ */
        UI.blinkTab = function (message) {
            var oldTitle = document.title, /* save original title */ timeoutId, blink = function () { document.title = document.title == message ? ' ' : message; }, /* function to BLINK browser tab */ clear = function () {
                clearInterval(timeoutId);
                document.title = oldTitle;
                window.onmousemove = null;
                timeoutId = null;
            };
            if (!timeoutId) {
                timeoutId = setInterval(blink, 1000);
                window.onmousemove = clear; /* stop changing title on moving the mouse */
            }
        };
        (function () {
            var _dhx_msg_cfg = null;
            function callback(config, result) {
                var usercall = config.callback;
                modality(false);
                config.box.parentNode.removeChild(config.box);
                _dhx_msg_cfg = config.box = null;
                if (usercall)
                    usercall(result);
            }
            function modal_key(e) {
                if (_dhx_msg_cfg) {
                    e = e || event;
                    var code = e.which || event.keyCode;
                    if (ithtml.message.keyboard) {
                        if (code == 13 || code == 32)
                            callback(_dhx_msg_cfg, true);
                        if (code == 27)
                            callback(_dhx_msg_cfg, false);
                    }
                    if (e.preventDefault)
                        e.preventDefault();
                    return !(e.cancelBubble = true);
                }
            }
            //if (document.attachEvent)
            //    document.attachEvent("onkeydown", modal_key);
            //else
            document.addEventListener("keydown", modal_key, true);
            var _cover;
            function modality(mode) {
                if (!_cover) {
                    _cover = document.createElement("DIV");
                    //necessary for IE only
                    _cover.onkeydown = modal_key;
                    _cover.className = "dhx_modal_cover";
                    document.body.appendChild(_cover);
                }
                var height = document.body.scrollHeight;
                _cover.style.display = mode ? "inline-block" : "none";
            }
            function button(text, result) {
                return "<div class='ithtml_popup_button' result='" + result + "' ><div>" + text + "</div></div>";
            }
            var t;
            function info(text) {
                if (!t.area) {
                    t.area = document.createElement("DIV");
                    t.area.className = "ithtml_message_area";
                    t.area.style[t.position] = "5px";
                    document.body.appendChild(t.area);
                }
                t.hide(text.id);
                var message = document.createElement("DIV");
                message.innerHTML = "<div>" + text.text + "</div>";
                message.className = "ithtml-info ithtml-" + text.type;
                message.onclick = function () {
                    t.hide(text.id);
                    text = null;
                };
                if (t.position == "bottom" && t.area.firstChild)
                    t.area.insertBefore(message, t.area.firstChild);
                else
                    t.area.appendChild(message);
                if (text.expire > 0)
                    t.timers[text.id] = window.setTimeout(function () {
                        t.hide(text.id);
                    }, text.expire);
                t.pull[text.id] = message;
                message = null;
                return text.id;
            }
            function _boxStructure(config, ok, cancel) {
                var box = document.createElement("DIV");
                box.className = " ithtml_modal_box ithtml-" + config.type;
                box.setAttribute("dhxbox", "1");
                var inner = '';
                if (config.width)
                    box.style.width = config.width;
                if (config.height)
                    box.style.height = config.height;
                if (config.title)
                    inner += '<div class="ithtml_popup_title">' + config.title + '</div>';
                inner += '<div class="ithtml_popup_text"><span>' + (config.content ? '' : config.text) + '</span></div><div  class="ithtml_popup_controls">';
                if (ok)
                    inner += button(config.ok || "OK", true);
                if (cancel)
                    inner += button(config.cancel || "Cancel", false);
                if (config.buttons) {
                    for (var i = 0; i < config.buttons.length; i++)
                        inner += button(config.buttons[i], i);
                }
                inner += '</div>';
                box.innerHTML = inner;
                if (config.content) {
                    var node = config.content;
                    if (typeof node == "string")
                        node = document.getElementById(node);
                    if (node.style.display == 'none')
                        node.style.display = "";
                    box.childNodes[config.title ? 1 : 0].appendChild(node);
                }
                box.onclick = function (e) {
                    e = e || event;
                    var source = e.target || e.srcElement;
                    if (!source.className)
                        source = source.parentNode;
                    if (source.className == "ithtml_popup_button") {
                        var result = source.getAttribute("result");
                        result = (result == "true") || (result == "false" ? false : result);
                        callback(config, result);
                    }
                };
                config.box = box;
                if (ok || cancel)
                    _dhx_msg_cfg = config;
                return box;
            }
            function _createBox(config, ok, cancel) {
                var box = config.tagName ? config : _boxStructure(config, ok, cancel);
                if (!config.hidden)
                    modality(true);
                document.body.appendChild(box);
                var x = config.left || Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - box.offsetWidth) / 2));
                var y = config.top || Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - box.offsetHeight) / 2));
                if (config.position == "top")
                    box.style.top = "-3px";
                else
                    box.style.top = y + 'px';
                box.style.left = x + 'px';
                //necessary for IE only
                box.onkeydown = modal_key;
                box.focus();
                if (config.hidden)
                    ithtml.modalbox.hide(box);
                return box;
            }
            function alertPopup(config) {
                return _createBox(config, true, false);
            }
            function confirmPopup(config) {
                return _createBox(config, true, true);
            }
            function boxPopup(config) {
                return _createBox(config);
            }
            function box_params(text, type, callback) {
                if (typeof text != "object") {
                    if (typeof type == "function") {
                        callback = type;
                        type = "";
                    }
                    text = { text: text, type: type, callback: callback };
                }
                return text;
            }
            function params(text, type, expire, id) {
                if (typeof text != "object")
                    text = { text: text, type: type, expire: expire, id: id };
                text.id = text.id || t.uid();
                text.expire = text.expire || t.expire;
                return text;
            }
            ithtml.alert = function () {
                var text = box_params.apply(this, arguments);
                text.type = text.type || "confirm";
                return alertPopup(text);
            };
            ithtml.confirm = function () {
                var text = box_params.apply(this, arguments);
                text.type = text.type || "alert";
                return confirmPopup(text);
            };
            ithtml.modalbox = function () {
                var text = box_params.apply(this, arguments);
                text.type = text.type || "alert";
                return boxPopup(text);
            };
            ithtml.modalbox.hide = function (node) {
                while (node && node.getAttribute && !node.getAttribute("dhxbox"))
                    node = node.parentNode;
                if (node) {
                    node.parentNode.removeChild(node);
                    modality(false);
                }
            };
            t = ithtml.message = function (text, type, expire, id) {
                text = params.apply(this, arguments);
                text.type = text.type || "info";
                var subtype = text.type.split("-")[0];
                switch (subtype) {
                    case "alert":
                        return alertPopup(text);
                    case "confirm":
                        return confirmPopup(text);
                    case "modalbox":
                        return boxPopup(text);
                    default:
                        return info(text);
                    //break;
                }
            };
            t.seed = (new Date()).valueOf();
            t.uid = function () { return t.seed++; };
            t.expire = 4000;
            t.keyboard = true;
            t.position = "top";
            t.pull = {};
            t.timers = {};
            t.hideAll = function () {
                for (var key in t.pull)
                    t.hide(key);
            };
            t.hide = function (id) {
                var obj = t.pull[id];
                if (obj && obj.parentNode) {
                    window.setTimeout(function () {
                        obj.parentNode.removeChild(obj);
                        obj = null;
                    }, 2000);
                    obj.className += " hidden";
                    if (t.timers[id])
                        window.clearTimeout(t.timers[id]);
                    delete t.pull[id];
                }
            };
        })();
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//let tt = [1, 2, 3];
//let tt1 = tt.find(x => x == 3);
//Array.prototype.find = function (where) { 
//    // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/find
//    // TEST:
//    //let arr = [
//    //    { x: 1, y: 'a', },
//    //    { x: 2, y: 'b', },
//    //];
//    //let z1 = arr.find(a => a.x == 2);
//    //let z2 = arr.find(a => a.x == 5);
//    //let z3 = arr.find(a => a.y == 'a');
//    //let z4 = arr.find(a => a.y == 'bbb');
//    if (this == null) {
//        throw new TypeError('Array.prototype.find called on null or undefined');
//    }
//    if (typeof where !== 'function') {
//        throw new TypeError('where must be a function');
//    }
//    let list = this;
//    let length = list.length;
//    let value;
//    for (let i = 0; i < length; i++) {
//        value = list[i];
//        if (where(value)) {
//            return value;
//        }
//    }
//    return undefined;
//}
Array.prototype.findById = function (id, defVal) {
    if (!id)
        return defVal;
    var obj = this.find(function (x) { return x.id == id; });
    if (!obj)
        return defVal;
    return obj;
};
Array.prototype.idval = function (id, defVal) {
    if (defVal === void 0) { defVal = ""; }
    if (!id)
        return defVal;
    var obj = this.findById(id);
    if (!obj)
        return defVal;
    return obj.value;
};
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index < 0)
        return -1;
    this.splice(index, 1);
    return index;
};
Array.prototype.filterNotEmpty = function () {
    var res = this.filter(function (x) { return !!x; });
    return res;
};
Array.prototype.clear = function () {
    this.splice(0, this.length);
};
//function htmlDecode(input) {
//    return String(input)
//        .replace(/&/g, '&')
//        .replace(/"/g, '"')
//        .replace(/</g, '');
//}
/// send resize event
function resizeBrowser() {
    //window.dispatchEvent(new Event('resize'));
    var width = window.outerWidth;
    var height = window.outerHeight;
    window.resizeTo(width - 1, height);
    window.resizeTo(width + 1, height);
}
/**
 * Скролл
 * @param id
 */
function scrollElement(id) {
    var el = document.getElementById(id);
    if (!el)
        return false;
    var rect = el.getBoundingClientRect();
    var isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight);
    if (!isVisible)
        el.scrollIntoView();
    return !isVisible;
}
window.scrollElement = scrollElement;
/**
 * Usage:
 *   let ctor = constructor(item.form);
 *   let view: $.View = new ctor();
 */
function constructor(classname) {
    if (!classname)
        throw new Error("classname is empty");
    var target = window;
    var names = classname.split(".");
    names.forEach(function (nm) {
        return target = target[nm];
    });
    return target;
}
/** set property path */
function getPropValue(obj, path) {
    var schema = obj; // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
        var elem = pList[i];
        if (!schema[elem])
            schema[elem] = {};
        schema = schema[elem];
    }
    var res = schema[pList[len - 1]];
    return res;
}
/** set property path */
function setPropValue(obj, path, value) {
    var schema = obj; // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
        var elem = pList[i];
        if (!schema[elem])
            schema[elem] = {};
        schema = schema[elem];
    }
    schema[pList[len - 1]] = value;
}
/** x % y */
function percent(x, y) {
    if (!x || !y)
        return 0;
    var p = x * 100 / y;
    return Math.floor(p);
}
var span;
function html2text(html) {
    if (span == null)
        span = document.createElement('span');
    span.innerHTML = html;
    var text = span.textContent || span.innerText;
    return text;
}
function Guid() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
/** copy props */
function copy(target, src, override) {
    if (override === void 0) { override = true; }
    var props = Object.getOwnPropertyNames(src);
    props.forEach(function (name) {
        //if (override )
        target[name] = src[name];
    });
}
/// получение ссылки на выделенный текст
function getSelectedText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    else if (document.getSelection) { // && document.selection.type != "Control") {
        var sel = document.getSelection();
        text = sel.getRangeAt(0).toString();
    }
    return text;
}
// from: http://stackoverflow.com/questions/5222814/window-getselection-return-html
function getSelectedHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    }
    else
        throw new Error("Clipboard Error");
    // else if (typeof document.selection != "undefined") {
    //    if (document.selection.type == "Text") {
    //        html = document.selection.createRange().htmlText;
    //    }
    //}
    return html;
}
/// <reference path="_loc.ts" />
//  import "../loc.ts";
Date.prototype.isWeekend = function () {
    var day = this.getDay();
    var res = (day == 6) || (day == 0);
    return res;
};
Date.prototype.addHours = function (n) {
    var dat = new Date(this.valueOf());
    dat.setHours(dat.getHours() + n);
    return dat;
};
Date.prototype.addDays = function (n) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + n);
    return dat;
};
Date.prototype.addMonth = function (n) {
    var dat = new Date(this.valueOf());
    dat.setMonth(dat.getMonth() + n);
    return dat;
};
function pad(number) {
    return (number < 10) ? '0' + number : number;
}
/** Конфертируем дату в Json с учетом сдвига - HR task 79725 */
Date.prototype.toLocaleJSON = function dateToString() {
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        '.' + (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
};
function dateFormat(d, full) {
    if (full === void 0) { full = true; }
    if (!d)
        return "";
    var d1 = full
        ? ["" + d.getDate(), "" + (d.getMonth() + 1), "" + d.getFullYear(), "" + d.getHours(), "" + d.getMinutes()]
        : ["" + d.getDate(), "" + (d.getMonth() + 1), "" + d.getFullYear()];
    // let d1 = full
    //     ?["0" + d.getDate(), "0" + (d.getMonth() + 1), "" + d.getFullYear(), "0" + d.getHours(), "0" + d.getMinutes()]
    //     :["0" + d.getDate(), "0" + (d.getMonth() + 1), "" + d.getFullYear()];
    // for (let i = 0; i < d1.length; i++) {
    //   d1[i] = d1[i].slice(-2);
    // }
    return d1.slice(0, 3).join(".") + " " + d1.slice(3).join(":");
}
//const jsontext = '{ "hiredate": "2008-01-01T12:00:00Z", "birthdate": "2008-12-25T12:00:00Z" }';
var regDate = /^\d{4}-\d{2}-\d{2}.*$/; // format: yyyy-mm-dd...
// URL  https://msdn.microsoft.com/ru-ru/library/cc836466(v=vs.94).aspx
/// usage: JSON.parse(data, jsonDateParse) 
function jsonDateParse(key, value) {
    if ((typeof value === 'string') &&
        (value !== null) &&
        //    (value.length > 18) &&
        //    (value.indexOf(":") > 5)) 
        (isValidDate(value)))
        return parseDate(value);
    return value;
}
;
//see: https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
function parseDate(val) {
    var n = Date.parse(val);
    if (n)
        return new Date(n);
    return val;
}
function isValidDate(date) {
    if (!date)
        return false;
    if (date instanceof Date)
        return true;
    //if (typeof date == "string") return false;
    if (typeof date.getMonth === 'function')
        return true;
    if (!date.match)
        return false;
    return date.match(regDate) != null;
}
var __days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
function getWeekDay(d) {
    if (!d)
        return "";
    return __days[d.getDay()];
}
/**
 * Возвращаем, сколько времени прошло до текущего момента
 */
function passedTime(date) {
    var loc = It.UI.coreLocale.Date;
    if (!date)
        return '';
    var d0 = Date.now();
    var diff = d0 - date.getTime(); // разница в миллисекундах
    if (diff < 0) { // в будущем
        return loc.Wait;
    }
    if (diff < 1000) { // прошло менее 1 секунды
        return loc.Just;
    }
    var sec = Math.floor(diff / 1000); // округлить diff до секунд
    if (sec < 60) {
        return sec + ' ' + loc.Sec + ' ' + loc.Ago;
    }
    var min = Math.floor(sec / 60); // округлить diff до минут
    if (min < 60) {
        return min + ' ' + loc.Min + ' ' + loc.Ago;
    }
    var hr = Math.floor(min / 60); // округлить diff до часов
    if (hr < 24) {
        return hr + ' ' + loc.Hour + ' ' + loc.Ago;
    }
    var dd = Math.floor(hr / 24); // округлить diff до дней
    if (dd < 10) {
        return dd + ' ' + loc.Day + ' ' + loc.Ago;
    }
    // форматировать дату, с учетом того, что месяцы начинаются с 0
    var d = dateFormat(date);
    return d;
}
var It;
(function (It) {
    //export var parseDate = parseDate
    It.dateDiff = {
        format: dateFormat,
        weekDay: getWeekDay,
        valid: isValidDate,
        parse: parseDate,
        inHoursAbs: function (d1, d2) {
            if (d2 === void 0) { d2 = new Date(); }
            return Math.abs(It.dateDiff.inHours(d1, d2));
        },
        inHours: function (d1, d2) {
            if (d2 === void 0) { d2 = new Date(); }
            if (!d1)
                return 0;
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            return (t2 - t1) / (3600 * 1000);
        },
        inDays: function (d1, d2) {
            if (d2 === void 0) { d2 = new Date(); }
            if (!d1)
                return 0;
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            return (t2 - t1) / (24 * 3600 * 1000);
        },
        inWeeks: function (d1, d2) {
            if (d2 === void 0) { d2 = new Date(); }
            if (!d1)
                return 0;
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            return (t2 - t1) / (24 * 3600 * 1000 * 7);
        },
        inMonths: function (d1, d2) {
            if (d2 === void 0) { d2 = new Date(); }
            if (!d1)
                return 0;
            var d1Y = d1.getFullYear();
            var d2Y = d2.getFullYear();
            var d1M = d1.getMonth();
            var d2M = d2.getMonth();
            return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
        },
        inYears: function (d1, d2) {
            if (d2 === void 0) { d2 = new Date(); }
            if (!d1)
                return 0;
            return d2.getFullYear() - d1.getFullYear();
        },
        inPassedTime: passedTime,
    };
})(It || (It = {}));
// interface Number {
//     toTime();
// }
// Number.prototype.toTime = function () { 
//     let me: any = this;
//     let hours = Math.floor(me / 60);
//     let minutes: any = me % 60;
//     if (minutes < 10) minutes = "0" + minutes;
//     return `${hours}:${minutes}`;
// }
//declare module global {
//    declare interface String {}
//}
var Symbols = {
    calendar: "&#128197;",
    pencil0: "&#9016",
    pencil1: "&#9997",
    pencil: "&#9998;",
    play: "►",
    pencil3: "&#128393;",
    basket: '&#128722;',
    Check: '✔',
    Cross: '✘',
    //editor: "<i class='fa fa-pencil-square-o' aria-hidden='true'></i>",  приходится кликать дважды
};
String.prototype.replaceAll = function (search, replacement) {
    if (!this)
        return '';
    var res = this.replace(new RegExp(search, 'g'), replacement);
    return res;
};
String.prototype.maxleft = function (n) {
    if (!this)
        return "";
    if (this.length < n)
        return this + "";
    else
        return this.substring(0, n);
};
//String.prototype.format = function (...args) {
//    //let args = <any[]><any>arguments;
//    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
//        if (m == "{{") { return "{"; }
//        if (m == "}}") { return "}"; }
//        return args[n];
//    });
//};
String.prototype.htmlEncode = function () {
    if (!this)
        return "";
    return this
        .replace(/&/g, '&amp;')
        //.replace(/"/g, '&quot;')
        //.replace(/'/g, ''')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(?:\r\n|\r|\n)/g, '<br/>');
    //.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
};
var regex = /[?&]([^=#]+)=([^&#]*)/g;
String.prototype.parseUrl = function (url) {
    if (!url)
        return {};
    var params = {}, match;
    while (match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params;
};
String.prototype.link = function (url, args) {
    if (!url)
        return this;
    //return "<a href='" + url + "'>" + this + "</a>";
    if (args === true)
        args = { target: '_blank' };
    if (args)
        args.href = url;
    else
        args = { href: url };
    return this.tag("a", args);
};
String.prototype.tag = function (tag, args) {
    if (!tag)
        return this;
    var attr = It.Web.args2attr(args);
    return "<".concat(tag, " ").concat(attr, ">").concat(this, "</").concat(tag, ">");
};
/*
* Usage: "http://url.jpg".img()
*/
String.prototype.img = function (args) {
    var sattrs = It.Web.args2attr(args);
    return "<img src='".concat(this, "' ").concat(sattrs, "/>");
};
var It;
(function (It) {
    It.symbols = Symbols;
})(It || (It = {}));
var It;
(function (It) {
    It.clipboard = {
        getData: function () { return window.clipboardData.getData("Text"); },
        setData: function (text) { return window.clipboardData.setData("Text", text); },
        clearData: function () { return window.clipboardData.clearData(); },
    };
    var _uid = new Date().valueOf();
    /** Уникальный идентификатор */
    function uid() {
        return ++_uid;
    }
    It.uid = uid;
    var Event = /** @class */ (function () {
        function Event() {
            this._handlers = [];
        }
        Event.prototype.on = function (handler) {
            if (handler)
                this._handlers.push(handler);
        };
        Event.prototype.clear = function () {
            this._handlers.clear();
        };
        Event.prototype.call = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._handlers.forEach(function (x) { return x.apply(void 0, args); });
        };
        return Event;
    }());
    It.Event = Event;
    function isMobile() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPad/i) ||
            //navigator.userAgent.match(/Safari/i) || --- google chrome is safari ??
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        else {
            return false;
        }
    }
    It.isMobile = isMobile;
    It.mobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod|Safary/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return (navigator.userAgent.match(/IEMobile/i) ||
                navigator.userAgent.match(/WPDesktop/i));
        },
        any: function () {
            return (It.mobile.Android() ||
                It.mobile.BlackBerry() ||
                It.mobile.iOS() ||
                It.mobile.Opera() ||
                It.mobile.Windows());
        }
    };
})(It || (It = {}));
var It;
(function (It) {
    var storage;
    (function (storage) {
        var cookies;
        (function (cookies) {
            // https://gist.github.com/mindplay-dk/c86bf338d16d37344136
            function read(name) {
                var result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
                return result ? result[1] : null;
            }
            cookies.read = read;
            function write(name, value, days) {
                //if (!days) {
                //    days = 365 * 20;
                //}
                if (days === void 0) { days = 365 * 20; }
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toUTCString();
                document.cookie = name + "=" + value + expires + "; path=/";
            }
            cookies.write = write;
            function remove(name) {
                write(name, "", -1);
            }
            cookies.remove = remove;
        })(cookies = storage.cookies || (storage.cookies = {}));
    })(storage = It.storage || (It.storage = {}));
})(It || (It = {}));
var It;
(function (It) {
    var storage;
    (function (storage_1) {
        var local;
        (function (local) {
            var storage = window.localStorage; // IE Edge - local-storage не работает с локальными файлами || (<any>window).Storage; // IE Edge
            function get(name) {
                if (!storage)
                    return undefined;
                var json = storage.getItem(name);
                if (!json)
                    return undefined;
                var data = JSON.parse(json);
                return data;
            }
            local.get = get;
            function remove(name) {
                if (!storage)
                    return;
                storage.removeItem(name);
            }
            local.remove = remove;
            function put(name, obj) {
                if (!storage)
                    return;
                var json = JSON.stringify(obj);
                storage.setItem(name, json);
            }
            local.put = put;
        })(local = storage_1.local || (storage_1.local = {}));
    })(storage = It.storage || (It.storage = {}));
})(It || (It = {}));
var It;
(function (It) {
    var Web;
    (function (Web) {
        /** services for tree data operations */
        var TreeService = /** @class */ (function () {
            function TreeService() {
                this.data = null;
            }
            TreeService.prototype.expand = function (ids, onload) {
                var list = [];
                for (var id in ids) {
                    var obj = this.lookup[ids[id]];
                    if (onload)
                        obj = onload(obj);
                    list.push(obj);
                }
                return list;
            };
            TreeService.prototype.loadTree = function (list, idAttr, parentAttr, childrenAttr) {
                var me = this;
                me.list = list;
                me.idAttr = idAttr || 'id';
                me.parentAttr = parentAttr || 'parent';
                me.childrenAttr = childrenAttr || 'children';
                me.data = [];
                me.lookup = {};
                // cache obj
                list.forEach(function (obj) {
                    var id = obj[me.idAttr];
                    me.lookup[id] = obj;
                    //obj[me.childrenAttr] = [];
                });
                list.forEach(function (obj) {
                    var parent = obj[me.parentAttr];
                    if (parent !== undefined && parent) {
                        var lparent = me.lookup[parent];
                        //if (!parent[me.childrenAttr]) parent[me.childrenAttr] = [];
                        if (lparent) {
                            var arr = lparent[me.childrenAttr];
                            if (!arr) {
                                arr = [];
                                lparent[me.childrenAttr] = arr;
                            }
                            arr.push(obj);
                        }
                        else
                            me.data.push(obj);
                    }
                    else
                        me.data.push(obj);
                });
                return me.data;
            };
            return TreeService;
        }());
        Web.TreeService = TreeService;
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
// 123456
XMLHttpRequest.prototype.json = function (dateParse, error) {
    if (dateParse === void 0) { dateParse = true; }
    if (error === void 0) { error = true; }
    var rq = this;
    if (error && It.Web.error(rq))
        return undefined;
    if (!rq.responseText)
        return undefined;
    //let json = JSON.parse(rq.responseText);
    var json;
    if (dateParse)
        json = JSON.parse(rq.responseText, jsonDateParse);
    else
        json = JSON.parse(rq.responseText);
    return json;
};
XMLHttpRequest.prototype.list = function (dateParse) {
    if (dateParse === void 0) { dateParse = true; }
    var rq = this;
    if (!rq.responseText)
        return undefined;
    var js = rq.json(dateParse);
    return js;
};
XMLHttpRequest.prototype.tree = function (id, parent, data) {
    if (id === void 0) { id = "id"; }
    if (parent === void 0) { parent = "parentId"; }
    if (data === void 0) { data = "data"; }
    var rq = this;
    if (!rq.responseText)
        return undefined;
    var js = rq.json();
    return It.Web.list2tree(js, id, parent, data);
};
XMLHttpRequest.prototype.text = function () {
    var rq = this;
    if (It.Web.error(rq))
        return undefined;
    return rq.responseText;
};
var It;
(function (It) {
    var Web;
    (function (Web) {
        ///** Сдвиг даты  */
        //export let DateOffset = 0
        ///** Конфертируем дату в Json с учетом сдвига - HR task 79725 */
        //function dateToString(date: Date) {
        //    if (DateOffset == 0) return date
        //    return date.addHours(DateOffset).toJSON()
        //}
        //export function json(rq: XMLHttpRequest, dateParse = true) {
        //    if (It.Web.error(rq)) return undefined;
        //    if (!rq.responseText) return undefined;
        //    //let json = JSON.parse(rq.responseText);
        //    let json: any;
        //    if (dateParse)
        //        json = JSON.parse(rq.responseText, jsonDateParse);
        //    else
        //        json = JSON.parse(rq.responseText);
        //    return json;
        //};
        //export function list(rq: XMLHttpRequest, dateParse = true) {
        //    if (!rq.responseText) return undefined;
        //    let js: any[] = json( rq, dateParse); 
        //    return js;
        //};
        //export function tree(rq: XMLHttpRequest, id= "id", parent= "parentId", data= "data"): any[] {
        //    if (!rq.responseText) return undefined;
        //    let js: any[] = json(rq);
        //    return list2tree(js, id, parent, data);
        //};
        //export function text(rq: XMLHttpRequest) {
        //    if (It.Web.error(rq)) return undefined;
        //    return rq.responseText;
        //};
        function list2tree(list, id, parent, data) {
            if (id === void 0) { id = "id"; }
            if (parent === void 0) { parent = "parentId"; }
            if (data === void 0) { data = "data"; }
            var treeService = new It.Web.TreeService();
            var res = treeService.loadTree(list, id, parent, data);
            res.service = treeService;
            return res;
        }
        Web.list2tree = list2tree;
        ;
        function get(url, args) {
            if (!args)
                args = {};
            args._v = It.uid();
            var qry = getUrlQuery(args, true);
            if (url.indexOf('?') < 0)
                url += '?';
            url += qry;
            return request(url, "GET");
        }
        Web.get = get;
        /**
         * Функция запроса без токена
         */
        function get0(url) {
            return request(url, "GET", undefined, undefined, false, false);
        }
        Web.get0 = get0;
        function post(url, args, json) {
            if (args === void 0) { args = null; }
            return request(url, "POST", args, json);
        }
        Web.post = post;
        function put(url, args) {
            if (args === void 0) { args = null; }
            return request(url, "PUT", args);
        }
        Web.put = put;
        function del(url, args) {
            if (args === void 0) { args = null; }
            return request(url, "DELETE", args);
        }
        Web.del = del;
        /** Request timeout - error for sync operations */
        // export var timeout = 0
        function request(url, cmd, args, json, use_token, error) {
            if (cmd === void 0) { cmd = "GET"; }
            if (json === void 0) { json = false; }
            if (use_token === void 0) { use_token = true; }
            if (error === void 0) { error = true; }
            var xhr = new XMLHttpRequest();
            xhr.open(cmd, url, false); // `false` makes the request synchronous
            //if (timeout)
            //    xhr.timeout = timeout
            var token = Web.auth.tokens.current;
            if (use_token && token)
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            if (cmd != "GET" && args) {
                if (json) {
                    args = JSON.stringify(args); // не проходит, почему-то не понимает сервер ??
                    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
                    //console.log('request-json', args)
                }
                else if (args instanceof File) {
                    var ff = 123;
                    // ничего не делаем - посылаем файл так
                }
                else {
                    args = objectToFormData(args);
                }
            }
            try {
                xhr.send(args);
            }
            catch (err) {
                if (error) {
                    var msg = err.name + "<br /><br />" + err.message; // + "<br /><br />" + e.stack;
                    It.UI.error(msg);
                }
                throw new Error("load error: " + JSON.stringify(err));
            }
            return xhr;
        }
        Web.request = request;
        function objectToFormData(obj, namespace, form) {
            var fd = form || new FormData();
            var formKey;
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (namespace) {
                        formKey = namespace + '[' + property + ']';
                    }
                    else {
                        formKey = property;
                    }
                    // if the property is an object, but not a File,
                    // use recursivity.
                    var val = obj[property];
                    if (isValidDate(val)) {
                        if (!val.toJSON) // если не Date
                            val = new Date(val.replace(' ', 'T'));
                        if (val.toJSON) // если не Date
                            val = val.toLocaleJSON(val);
                        fd.append(formKey, val);
                    }
                    else if (val instanceof File || val instanceof FileList) { // FileList не работает на сервере - не переходит в Form.Files.
                        fd.append(formKey, val);
                    }
                    else if (typeof val === 'object' && !(val instanceof File) && !(val instanceof FileList)) {
                        objectToFormData(val, property, fd);
                        fd.append(formKey, val);
                    }
                    else {
                        // if it's a string or a File object
                        fd.append(formKey, val);
                    }
                }
            }
            return fd;
        }
        ;
        function openUrl(url, args, isNew) {
            if (isNew === void 0) { isNew = false; }
            if (!url) {
                location.hash = "/";
                location.reload();
                return;
            }
            url = url || location.pathname;
            var target = isNew ? "_blank" : "_self";
            if (args) {
                delete args.module;
                delete args.view;
                //delete args.oid;
                url += getUrlQuery(args);
            }
            open(url, target);
        }
        Web.openUrl = openUrl;
        function parseUrlQuery(qstr) {
            var query = {};
            var qi = qstr.indexOf("?") + 1;
            if (qi > 0) {
                var a = qstr.substr(qi).split("&");
                for (var i = 0; i < a.length; i++) {
                    var b = a[i].split("=");
                    var c1 = decodeURIComponent(b[0].trim());
                    var c2 = decodeURIComponent(b[1] || "");
                    query[c1] = c2;
                }
            }
            return query;
        }
        Web.parseUrlQuery = parseUrlQuery;
        /**
         * Convert object args {p1:11,p2:'aaa'} -> "p1=11 p2='aaa'"
         */
        function args2attr(args) {
            if (!args)
                return "";
            var res = "";
            for (var name_1 in args) {
                res += " " + name_1 + "='" + args[name_1] + "'";
            }
            return res;
        }
        Web.args2attr = args2attr;
        function args2style(args) {
            if (!args)
                return "";
            var res = "";
            for (var name_2 in args) {
                res += "".concat(name_2, ":").concat(args[name_2], ";");
            }
            return res;
        }
        Web.args2style = args2style;
        /**
         * Возвращает значение запроса без ?
         */
        function getUrlQuery(data, encode) {
            if (encode === void 0) { encode = true; }
            if (!data)
                return "";
            if (typeof data === "string")
                return data;
            var url = "";
            for (var prop in data) {
                var val = data[prop];
                if (!val)
                    continue;
                // TODO: if (webix.isDate(val))
                //    val = webix.i18n.dateFormatStr(val);
                if (isValidDate(val))
                    //val = val.toJSON(); - превращает в дату без локали
                    val = val.toLocaleJSON();
                if (encode)
                    url += encodeURI(prop) + "=" + encodeURI(val) + "&";
                else
                    url += prop + "=" + val + "&";
            }
            return url.substring(0, url.length - 1);
        }
        Web.getUrlQuery = getUrlQuery;
        function historyBack(reload) {
            if (reload === void 0) { reload = false; }
            window.history.back();
            if (reload)
                setTimeout(function () { return location.reload(); }, 300);
        }
        Web.historyBack = historyBack;
        function goReturnUrl() {
            var query = parseUrlQuery(location.search);
            if (query && query.returnUrl)
                openUrl(query.returnUrl || "./");
            else
                historyBack(true);
        }
        Web.goReturnUrl = goReturnUrl;
        var loc = It.UI.coreLocale.Err;
        /** Функция отображения ошибки запроса */
        function error(response, dialog) {
            if (dialog === void 0) { dialog = true; }
            if (response.status == 200)
                return false;
            if (response)
                console.log(response.responseText);
            var text = loc.UnknownError;
            var status = loc.Error + " " + response.status + ": " + response.statusText;
            if (response.status == 401) { // if not in system module
                var err = loc.AccessError + ' (' + response.responseText + ')';
                if (dialog)
                    It.UI.error(err, loc.ErrorText);
                else
                    console.error('response error', response.responseURL, err);
                return true;
            }
            else if (response.status == 500) {
                text = loc.ErrorText;
            }
            else if (response.status == 404) {
                text = loc.ResNotFound;
            }
            else if (response) {
                status = ""; // Блокируем, чтобы не пугать пользователей на UserException
                text = response.responseText || text;
                //if (text.) {
                //    text = JSON.stringify(text, null, '<br/>');
                // }
            }
            //text = text.replace("\\r\\n", "<br/>").replace("\\n\\r", "<br/>");
            text = text.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
            if (dialog)
                It.UI.error(text, status);
            else
                console.error('response error', response.responseURL + " " + status, text);
            // webix.alert({
            //     title: loc.Error + " " + response.status + ": " + response.statusText,
            //     type: "alert-error",
            //     //ok: UI.loc.Controls.Close,
            //     text: text,
            //     top: 50,
            //     width: 400,
            // });
            throw new Error(text);
        }
        Web.error = error;
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
//namespace It {
//  /**
//   * Оставлено для совместимости
//   */
//  export var parseUrlQuery = It.Web.parseUrlQuery;
//}
var It;
(function (It) {
    var Web;
    (function (Web) {
        var _loadedFiles = {};
        function loadJSAsync(file, onload) {
            if (_loadedFiles[file]) {
                if (onload)
                    onload("");
                return null;
            }
            _loadedFiles[file] = true;
            var script = document.createElement('script');
            script.src = file;
            script.onload = onload;
            document.head.appendChild(script);
        }
        Web.loadJSAsync = loadJSAsync;
        /** check and load javascript file once  */
        function loadJS(file) {
            if (_loadedFiles[file])
                return null;
            _loadedFiles[file] = true;
            //let res: any = webix.ajax().sync().get(file, {}); //headers({Accept: "text/html"})..headers({ "Content-Type": "application/javascript" })
            var res = Web.get(file);
            if (Web.error(res, false))
                return null;
            // add script
            //document.write("<script language='javascript'>");
            //document.write(res); //No need to append  
            //document.write("</script>");
            var oScript = document.createElement("script");
            oScript.language = "javascript";
            oScript.type = "text/javascript";
            //oScript.id = sId;
            //oScript.defer = true;
            oScript.text = res.responseText;
            //oScript.setAttribute("href", file); �� ���������� ��������� ��������� 
            document.head.appendChild(oScript);
        }
        Web.loadJS = loadJS;
        /** check and load css once  */
        function loadCSS(file) {
            if (_loadedFiles[file])
                return null;
            _loadedFiles[file] = true;
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", file);
            document.head.appendChild(link);
        }
        Web.loadCSS = loadCSS;
        /** check and load html once  */
        function loadHtml(file, target) {
            if (_loadedFiles[file])
                return null;
            //_loadedFiles[file] = true;
            var html = loadText(file); // 
            console.log('loading link:', file);
            //document.getElementById(this.id).insertAdjacentHTML(<any>'afterEnd', html);
            var dom = target ? document.getElementById(target) : document.createElement("div");
            if (!target)
                document.body.appendChild(dom);
            dom.innerHTML = html;
            var scripts = dom.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; ++i) {
                var script = scripts[i];
                if (script.src)
                    //document.head.appendChild(script); // �� ���������, � ���������� �� �������
                    It.Web.loadJS(script.src);
                if (script.innerHTML) {
                    try {
                        eval(script.innerHTML);
                    }
                    catch (x) {
                        console.error('script error: ', x, script.innerHTML);
                    }
                }
            }
        }
        Web.loadHtml = loadHtml;
        /**
         * �������� ���������� �����
         */
        function loadText(file) {
            var s = _loadedFiles[file];
            if (s)
                return s;
            //let res: any = webix.ajax().sync().get(file, {}); //headers({Accept: "text/html"})..headers({ "Content-Type": "application/javascript" })
            var res = Web.get(file);
            if (Web.error(res, false))
                return null;
            s = res.responseText;
            _loadedFiles[file] = s;
            return s;
        }
        Web.loadText = loadText;
        // download (client SaveAs content)
        function download(content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';
            var sb = navigator.msSaveBlob;
            if (sb) { // IE10
                return sb(new Blob([content], { type: mimeType }), fileName);
            }
            else if ('download' in a) { //html5 A[download]
                a.href = "data:".concat(mimeType, ",").concat(encodeURIComponent(content));
                a.setAttribute('download', fileName);
                document.body.appendChild(a);
                setTimeout(function () {
                    a.click();
                    document.body.removeChild(a);
                }, 66);
                return true;
            }
            else { //do iframe dataURL download (old ch+FF):
                var f_1 = document.createElement('iframe');
                document.body.appendChild(f_1);
                f_1.src = "data:".concat(mimeType, ",").concat(encodeURIComponent(content));
                setTimeout(function () {
                    document.body.removeChild(f_1);
                }, 333);
                return true;
            }
        }
        Web.download = download;
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
var It;
(function (It) {
    var Web;
    (function (Web) {
        var __QVER = new Date().valueOf();
        var WebSource = /** @class */ (function () {
            function WebSource(controller, prefix) {
                if (prefix === void 0) { prefix = "api/"; }
                this.controller = controller;
                this.prefix = prefix;
            }
            WebSource.prototype.url = function (action, args) {
                if (args === void 0) { args = {}; }
                //args._v = __QVER++;
                var url = "".concat(WebSource.base, "/").concat(this.prefix).concat(this.controller, "/").concat(action, "/?") + Web.getUrlQuery(args);
                return url;
            };
            WebSource.prototype.getUrl = function (id) {
                return "".concat(WebSource.base, "/").concat(this.prefix).concat(this.controller, "/get/").concat(id); //?_v=${__QVER++}`;
            };
            WebSource.prototype.saveUrl = function (id) {
                if (!id)
                    id = "";
                return "".concat(WebSource.base, "/").concat(this.prefix).concat(this.controller, "/save/").concat(id);
            };
            WebSource.prototype.save = function (obj) {
                var id = obj.id;
                if (id) {
                    var url = this.saveUrl(id);
                    return Web.put(url, obj).json();
                }
                else {
                    var url1 = this.saveUrl();
                    return Web.post(url1, obj).json();
                }
            };
            WebSource.prototype.delete = function (id) {
                var url = this.saveUrl(id);
                return Web.del(url).json();
            };
            WebSource.prototype.load = function (url, args, dateParse) {
                if (dateParse === void 0) { dateParse = true; }
                var rq = Web.get(this.url(url), args);
                //if(!rq.json) return undefined;
                return rq.json(dateParse);
            };
            WebSource.prototype.loadList = function (url, args, dateParse) {
                if (dateParse === void 0) { dateParse = true; }
                var rq = Web.get(this.url(url), args);
                //if(!rq.list) return undefined;
                return rq.list(dateParse);
            };
            WebSource.prototype.loadTree = function (url, id, parent, args, data) {
                var rq = Web.get(this.url(url), args);
                //if(!rq.tree) return undefined; 
                return rq.tree(id, parent, data);
            };
            WebSource.prototype.loadStr = function (url, args) {
                var rq = Web.get(this.url(url), args);
                //if(!rq.text) return undefined;
                return rq.text();
            };
            WebSource.prototype.get = function (id) {
                var rq = Web.get(this.getUrl(id));
                return rq.json();
            };
            //get2(args) {
            //    let res = this.load("get", args); 
            //    return res;
            //}
            //loadItemsUrl = this.url("getitems");  // проблемы с датами
            WebSource.prototype.post = function (url, obj, json) {
                var rq = Web.post(this.url(url), obj, json);
                return rq.json();
            };
            WebSource.prototype.put = function (url, obj) {
                var rq = Web.put(this.url(url), obj);
                return rq.json();
            };
            WebSource.prototype.getSaveCfg = function (autoupdate) {
                if (autoupdate === void 0) { autoupdate = false; }
                return {
                    url: "rest->".concat(WebSource.base, "/").concat(this.prefix).concat(this.controller, "/save"),
                    updateFromResponse: true,
                    autoupdate: autoupdate,
                    on: {
                        //onAfterSaveError: table.onAfterSaveError,
                        onAfterSaveError: function (id, text, data, err) { return Web.error(err.loader); },
                    }
                };
            };
            WebSource.base = '.';
            return WebSource;
        }());
        Web.WebSource = WebSource;
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
var It;
(function (It) {
    var Web;
    (function (Web) {
        /**
         * Базовый источник данных для любых внещних service
         */
        var UrlSource = /** @class */ (function () {
            function UrlSource(baseUrl, controller) {
                var _this = this;
                this.baseUrl = baseUrl;
                this.controller = controller;
                // baseUrl = "https://t239.databoom.space/api1/b239/collections";
                this.prefix = ''; // databoom->
                this.listUrl = function (args) { return _this.url(args); };
            }
            UrlSource.prototype.url = function (args) {
                return "".concat(this.prefix).concat(this.baseUrl, "/").concat(this.controller) + It.Web.getUrlQuery(args, false);
            };
            UrlSource.prototype.load = function (name, args) {
                var url = "".concat(this.baseUrl, "/").concat(this.controller).concat(name);
                var res = Web.get(url, args).json();
                if (!res || !res.d)
                    return res;
                return res.d.results;
            };
            UrlSource.prototype.getUrl = function (id) {
                return "".concat(this.baseUrl, "/").concat(this.controller, "(").concat(id, ")");
            };
            UrlSource.prototype.saveUrl = function (id) {
                if (id)
                    return "".concat(this.baseUrl, "/").concat(this.controller, "(").concat(id, ")");
                else
                    return "".concat(this.baseUrl, "/").concat(this.controller);
            };
            UrlSource.prototype.getSaveCfg = function (autoupdate) {
                if (autoupdate === void 0) { autoupdate = false; }
                return {
                    url: "".concat(this.prefix).concat(this.baseUrl, "/").concat(this.controller),
                    updateFromResponse: true,
                    autoupdate: autoupdate,
                    on: {
                        //onAfterSaveError: table.onAfterSaveError,
                        onAfterSaveError: function (id, text, data, err) { return It.Web.error(err.loader); },
                    }
                };
            };
            return UrlSource;
        }());
        Web.UrlSource = UrlSource;
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
var It;
(function (It) {
    var Web;
    (function (Web) {
        var auth;
        (function (auth) {
            // сервис авторизации
            var AuthSource = /** @class */ (function (_super) {
                __extends(AuthSource, _super);
                function AuthSource() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                //constructor(controller: string) {
                //    super(controller, "api/"); // все делаем с префиксом 
                //}
                AuthSource.prototype.login = function (args) {
                    return this.post("login", args);
                };
                AuthSource.prototype.logout = function () {
                    return this.post("logout");
                };
                AuthSource.prototype.registration = function (args) {
                    return this.post("registration", args); // "api/auth/registry"
                };
                AuthSource.prototype.check = function () {
                    return this.load("check");
                };
                return AuthSource;
            }(Web.WebSource));
            auth.AuthSource = AuthSource;
            auth.db = new AuthSource("auth");
        })(auth = Web.auth || (Web.auth = {}));
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
var It;
(function (It) {
    var Web;
    (function (Web) {
        //export class AppSocket {
        //    //private socket: WebSocket;
        //    constructor(private code: string) {
        //    }
        function bindSocket(channel, key, caller) {
            //if (this.socket) { // если уже был назначен сокет - убиваем его, нечего
            //    this.socket.close();
            //    delete this.socket; 
            //}
            var protocol = location.protocol === "https:" ? "wss:" : "ws:";
            var base = Web.WebSource.base;
            if (base) {
                base = base.split('//')[1];
            }
            base = base || window.location.host; // на всякий случай проверяем
            //let wsUri = `${protocol}//${base}/${code}?key=${key}`;  // window.location.host 
            var wsUri = "".concat(protocol, "//").concat(base, "/").concat(channel, "/").concat(key); // window.location.host 
            var socket = new WebSocket(wsUri); //'ws://localhost:50007/sockets');
            socket.onopen = function (event) {
                console.log("Соединение установлено: " + new Date());
            };
            socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log('Соединение закрыто чисто' + new Date());
                }
                else {
                    console.log('Обрыв соединения' + new Date()); // например, "убит" процесс сервера
                    reconnect();
                }
                console.log('Код: ' + event.code + ' причина: ' + event.reason);
            };
            socket.onmessage = function (event) {
                var data = JSON.parse(event.data) || {};
                var method = caller[data.method || 'onmessage'] || caller;
                if (method) {
                    var f = function () { return method(data); };
                    f();
                }
                console.log("Получены данные ", data);
            };
            socket.onerror = function (error) {
                console.log("Ошибка " + JSON.stringify(error));
            };
            //setTimeout(x => socket.send('123456'), 5000);
            //this.socket = socket;
            return socket;
            // пытаемся присоединиться заново
            function reconnect() {
                setTimeout(function () { return bindSocket(channel, key, caller); }, 5000);
                console.log("Пытаемся переконнектиться через 5 сек ");
            }
        }
        Web.bindSocket = bindSocket;
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
var It;
(function (It) {
    var Web;
    (function (Web) {
        var auth;
        (function (auth) {
            var tokens;
            (function (tokens) {
                var STORAGE_AUTH_TOKEN = "auth.token"; // location.host + 
                var AUTH_PREFIX = "Bearer";
                function save(token) {
                    //webix.storage.local.put(STORAGE_AUTH_TOKEN, token);
                    It.storage.local.put(STORAGE_AUTH_TOKEN, token);
                    tokens.current = token;
                }
                tokens.save = save;
                function check() {
                    var token = null;
                    try { // Загружаем токен, и если он ошибочный - затираем
                        token = It.storage.local.get(STORAGE_AUTH_TOKEN);
                        /// token = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InNlcmc0aXRAZ21haWwuY29tIiwibmJmIjoxNTI5MjQ3ODE0LCJleHAiOjE1MzE4Mzk4MTQsImlhdCI6MTUyOTI0NzgxNCwiaXNzIjoiR3J1bmRmb3MtQ29tcGFueSIsImF1ZCI6IkdydW5kZm9zLWNsb3VkIn0.F42qX6ru70tgdYX6VI2Esn6H8_6eb0aBtYlRvnQ8OFE";
                        if (!token) {
                            clear();
                            return null;
                        }
                    }
                    catch (e) {
                        clear();
                        return null;
                    }
                    if (typeof webix != 'undefined') {
                        // добавляем авторизационный токен для доступа к серверу для webix
                        webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers) {
                            //headers["Content-type"] = "application/json";
                            headers["Authorization"] = AUTH_PREFIX + " " + token;
                        });
                    }
                    tokens.current = token;
                    auth.db.check(); // восстанавливаем логин на сервере по токену
                    return token;
                }
                tokens.check = check;
                function clear() {
                    It.storage.local.remove(STORAGE_AUTH_TOKEN);
                    //webix.eventRemove("onBeforeAjax");
                    //logins.logged = false;
                    tokens.current = undefined;
                }
                tokens.clear = clear;
                // вызываем принудительно
                // tokens.check();
            })(tokens = auth.tokens || (auth.tokens = {}));
        })(auth = Web.auth || (Web.auth = {}));
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
var It;
(function (It) {
    var Web;
    (function (Web) {
        var auth;
        (function (auth) {
            var logins;
            (function (logins) {
                var LOGIN_ID = "auth.login"; //location.host + 
                logins.last = It.storage.local.get(LOGIN_ID);
                //export let logged = false;
                function save(login) {
                    It.storage.local.put(LOGIN_ID, login);
                    logins.last = login;
                }
                logins.save = save;
            })(logins = auth.logins || (auth.logins = {}));
        })(auth = Web.auth || (Web.auth = {}));
    })(Web = It.Web || (It.Web = {}));
})(It || (It = {}));
/// <reference path="predefines.ts" />
/// <reference path="common/_loc.ts" />
/// <reference path="common/core.ts" />
/// <reference path="ui/msg.ts" />
/// <reference path="common/arrays.ts" />
/// <reference path="common/common.ts" />
/// <reference path="common/dates.ts" />
/// <reference path="common/numbers.ts" />
/// <reference path="common/strings.ts" />
/// <reference path="it/common.ts" />  
/// <reference path="it/storage.cookies.ts" />
/// <reference path="it/storage.local.ts" />
/// <reference path="web/TreeService.ts" />
/// <reference path="web/requests.ts" />
/// <reference path="web/Loads.ts" />
/// <reference path="web/WebSource.ts" /> 
/// <reference path="web/UrlSource.ts" />
/// <reference path="web/auth.ts" />
/// <reference path="web/sockets.ts" />
/// <reference path="web/auth.tokens.ts" />
/// <reference path="web/auth.logins.ts" />
var app;
(function (app) {
    var CoreDataSource = /** @class */ (function (_super) {
        __extends(CoreDataSource, _super);
        function CoreDataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CoreDataSource.prototype.upload_crop = function (file, folder, size, origin) {
            if (size === void 0) { size = 0; }
            if (origin === void 0) { origin = false; }
            return this.post('upload-crop', { file: file, folder: folder, size: size, origin: origin });
        };
        CoreDataSource.prototype.guids = function (n) {
            if (n === void 0) { n = 1; }
            return this.loadList("guids", { n: n });
        };
        return CoreDataSource;
    }(It.Web.WebSource));
    app.CoreDataSource = CoreDataSource;
    app.db = new CoreDataSource("core");
})(app || (app = {}));
//export default It;
console.log("--------------- load CoreJS index v1.06");
window.It = It;
window.$u = It.UI;
var It;
(function (It) {
    var UI;
    (function (UI) {
        console.log("webix-core-lib: 2022-04-11 (1)");
        //// init Messages
        //It.UI.error = (text, title?: string) => webix.message({
        //    text: text,
        //    title: title,
        //    type: 'error',
        //})
        //It.UI.message = (text, type?) => webix.message({
        //    text: text,
        //    type: type, // == 'error' ? 'negative' : 'positive',
        //})
        ////console.log('notify', Dialog, Dialog.create)
        //It.UI.alert = (text, title, type?) => webix.alert({
        //    title: title,
        //    text: text,
        //})
        //It.UI.alertDialog = args => alert('alert' + JSON.stringify(args))
        //It.UI.confirmDialog = args => alert('confirm: ' + JSON.stringify(args))
        function column(id, map) {
            var col = new UI.Configs.ColumnConfig(id, map);
            return col;
        }
        UI.column = column;
        function element(name) {
            var el = new UI.Configs.ElementConfig(name);
            if (name)
                el.Attributes({ name: name });
            return el;
        }
        UI.element = element;
        function panelbar() {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return colsview(undefined, items);
        }
        UI.panelbar = panelbar;
        function toolbar() {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return colsview("toolbar", items);
        }
        UI.toolbar = toolbar;
        /**
         * { align: "absolute", body: grid, css: 'webix_form, gravity: 1, left: 20, top: 20, bottom: 20, right: 20, },
         *  https://docs.webix.com/desktop__alignment.html
         */
        function align(body, align, left, top, bottom, right) {
            if (align === void 0) { align = "absolute"; }
            if (left === void 0) { left = UI.Configs.defaults.padding; }
            var view = new UI.Configs.ContainerConfig().extend({
                align: align,
                body: body,
                css: 'webix_form',
                left: left,
                top: top || left,
                bottom: bottom || top || left,
                right: right || left,
            });
            delete view.view;
            return view;
        }
        UI.align = align;
        /**
         * Панель навигации с возвратом
         */
        function headbar(text) {
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            var cfg = $u.panelbar(
            //$.template("https://cdn.pixabay.com/photo/2016/06/15/15/02/info-1459077_960_720.png".img({ width: 20, height: 20 })).Size(20),
            //$.button("Назад").Type("htmlbutton")
            //    .Click(_ => $.Core.historyBack()).Css("info").extend({
            //        label: '<span class="webix_icon fa-angle-left"></span><span class="text">back</span>',
            //    }),
            $u.icon("arrow-circle-left", '   ').Size(40).Click(function (_) { return It.Web.historyBack(); }));
            if (text)
                cfg.cols.push($u.label(text).Size(-1));
            if (items) {
                cfg.cols = cfg.cols.concat(items);
            }
            return cfg;
        }
        UI.headbar = headbar;
        /**
         * Заголовок без вычура
         */
        function header(text) {
            if (text === void 0) { text = ' '; }
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            var cfg = $u.panelbar();
            if (text)
                cfg.cols.push($u.label(text).Size(-1));
            if (items) {
                cfg.cols = cfg.cols.concat(items);
            }
            return cfg;
        }
        UI.header = header;
        function label(label, autowidth) {
            if (autowidth === void 0) { autowidth = true; }
            //return { view: "label", label: label + "      ШШШ", autowidth: true, };
            var cfg = new UI.Configs.ItemConfig("label").extend({
                type: "icon",
                label: label,
                autowidth: autowidth,
            });
            return cfg;
        }
        UI.label = label;
        function view(name) {
            var view = new UI.Configs.ContainerConfig().extend({
                view: name,
            });
            return view;
        }
        UI.view = view;
        /**
         * view with tabs: tab(header, body)...
         */
        function tabview() {
            var cfg = new UI.Configs.TabViewConfig();
            return cfg;
        }
        UI.tabview = tabview;
        /**
         * top tab bar
         */
        function tabs() {
            var tabs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tabs[_i] = arguments[_i];
            }
            if (tabs[0] instanceof Array)
                tabs = tabs[0];
            var cfg = new UI.Configs.TabsConfig(tabs).extend({
            //multiview: true,
            });
            return cfg;
        }
        UI.tabs = tabs;
        //export function image(url: string, attr?) {
        //    let sattrs = args2attr(attr);
        //    return template(`<img src='${url}' ${sattrs} />`);
        //}
        function button(label) {
            //return { view: "button", value: label, autowidth: true,  };
            var cfg = new UI.Configs.ItemConfig("button").extend({ value: label, label: label, autowidth: true, });
            return cfg;
        }
        UI.button = button;
        function template(text, data) {
            var cfg = new UI.Configs.ItemConfig().extend({
                view: "template2",
                template: text,
                borderless: true,
                autoheight: true,
                //autowidth: true,
                data: data,
            });
            return cfg;
        }
        UI.template = template;
        function separator() {
            var cfg = { template: " ", width: 1 }; //, borderless1: true, height1: 3};
            return cfg;
        }
        UI.separator = separator;
        function popup(config, position) {
            if (position === void 0) { position = "center"; }
            var popup = $u.view("popup").extend({
                position: position,
                resize: true,
                body: config,
            });
            return popup;
        }
        UI.popup = popup;
        function uploader(url, onload) {
            onload = onload || (function (x) { return UI.alert(x); });
            //Attributes({ accept: "image/*", capture: undefined })
            var cfg = new UI.Configs.BaseConfig().extend({
                view: "uploader",
                id: webix.uid(),
                value: UI.loc.Controls.PhotoDragDrop,
                //link: this.uploaderList.id,
                upload: It.Web.WebSource.base + "/" + url,
                accept: "image/*",
                datatype: "json",
                //multiple: false,
                on: {
                    onFileUpload: onload,
                },
            });
            return cfg;
        }
        UI.uploader = uploader;
        function splitter(border) {
            if (border === void 0) { border = false; }
            var cfg = new UI.Configs.ItemConfig("resizer");
            if (!border)
                cfg.borderless = true;
            return cfg;
        }
        UI.splitter = splitter;
        function space(gravity) {
            if (gravity === void 0) { gravity = 0.0001; }
            var cfg = new UI.Configs.ItemConfig();
            if (gravity)
                cfg.gravity = gravity;
            return cfg;
        }
        UI.space = space;
        function icon(icon, label) {
            var cfg;
            if (!label)
                cfg = new UI.Configs.ItemConfig("icon").extend({ width: 25, icon: icon, }); // type: "icon", --> переехало во view
            else
                // { view: "button", type: "icon", icon: "arrow-circle-left", label: "Назад", width: 70,  },
                cfg = new UI.Configs.ItemConfig("button").Type("icon").extend({ label: label, icon: icon, }); // type: "icon", --> переехало во view
            return cfg;
        }
        UI.icon = icon;
        function cells() {
            var cells = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                cells[_i] = arguments[_i];
            }
            var cfg = new UI.Configs.ContainerConfig().extend({
                cells: cells.filterNotEmpty(),
            });
            return cfg;
        }
        UI.cells = cells;
        function cols() {
            var cols = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                cols[_i] = arguments[_i];
            }
            var cfg = new UI.Configs.ContainerConfig().extend({
                cols: cols.filterNotEmpty(),
            });
            return cfg;
        }
        UI.cols = cols;
        function rows() {
            var rows = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rows[_i] = arguments[_i];
            }
            var cfg = new UI.Configs.ContainerConfig().extend({
                rows: rows.filterNotEmpty(),
            });
            return cfg;
        }
        UI.rows = rows;
        function colsview(view, cols) {
            var cfg = new UI.Configs.ContainerConfig().extend({
                view: view,
                paddingY: 0,
                cols: cols.filterNotEmpty(),
            });
            return cfg;
        }
        UI.colsview = colsview;
        // return ui config where view in center
        function viewCenter(viewCfg) {
            return {
                rows: [
                    { maxHeight: 100 },
                    {
                        cols: [
                            {},
                            viewCfg,
                            {}
                        ]
                    },
                    { maxHeight: 100 },
                ]
            };
        }
        UI.viewCenter = viewCenter;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//webix = windows.w;
// extenstions for Webix modules
var It;
(function (It) {
    var UI;
    (function (UI) {
        var w;
        (function (w) {
            //debugger;
            //webix = (<any>window).webix;
            //function apply(x) {
            //    console(this);
            //} (webix); 
            //console.log('------- module webix', webix); 
            //webix = (<any>window).webix; 
            var _webix = webix;
            webix.Date.startOnMonday = true;
            //webix.i18n.decimalDelimiter = ",";
            w.patterns2 = {
                phone: { mask: "+# (###) ###-##-##", allow: /[0-9]/g },
                card: { mask: "#### #### #### ####", allow: /[0-9]/g },
                date: { mask: "####-##-##", allow: /[0-9]/g },
                datetime: { mask: "####-##-## ##:##", allow: /[0-9]/g }
            };
            function error(text) {
                webix.message({ type: "error", text: text });
            }
            w.error = error;
            function info(text) {
                webix.message({ type: "error", text: text, expire: -1 });
            }
            w.info = info;
            _webix.DataStore.prototype.findById = Array.prototype.findById;
            webix.protoUI({
                name: "htmllabel",
                setValue: function (value) { this.setHTML(value); },
                getValue: function () { var node = this.getNode(); return (node) ? node.innerHTML : null; } //this.getHTML()
            }, _webix.ui.template);
            webix.protoUI({
                name: "valueform",
                setValue: function (value) {
                    if (this.config.setValue)
                        this.config.setValue(value);
                    else if (this.ref)
                        this.ref.setValues(value);
                },
                getValue: function () {
                    if (this.config.getValue)
                        this.config.getValue();
                    else if (this.ref)
                        this.ref.getValues();
                } //this.getHTML()
            }, _webix.ui.form);
            webix.protoUI({
                name: "edittree"
            }, webix.EditAbility, _webix.ui.tree);
            webix.protoUI({
                name: "editlist" // or "edittree", "dataview-edit" in case you work with them
            }, webix.EditAbility, _webix.ui.list);
            webix.protoUI({
                $cssName: "text",
                name: "int",
                value_setter: function (value) {
                    if (!value)
                        value = 0;
                    //value = webix.i18n.intFormat(value);
                    return value; //webix.i18n.numberFormat(value.replace(/[^0-9]*/g, ""));
                },
                setValue: function (value) {
                    //alert(value)
                    //value = webix.i18n.numberFormat(value.replace(/[^0-9]*/g, ""));
                    if (!value)
                        value = 0;
                    _webix.ui.text.prototype.setValue.call(this, value);
                }
            }, _webix.ui.text);
            //webix.protoUI({
            //    $cssName: "text",
            //    name: "number",
            //    $init: function () {
            //        this.attachEvent("onItemClick", function () {
            //            this.$setValue(this.config.raw, true);
            //        });
            //        this.attachEvent("onBlur", function () {
            //            this.$setValue(this.config.value);
            //        });
            //    },
            //    $render: function () {
            //        this.$setValue(this.config.value);
            //    },
            //    $setValue: function (value, raw) {
            //        this.config.raw = value;
            //        if (!raw)
            //            value = webix.i18n.priceFormat(value);
            //        this.getInputNode().value = value;
            //    }
            //}, webix.ui.text); 
            webix.protoUI({
                name: "activeList" //give it some name you like
            }, _webix.ui.list, webix.ActiveContent);
            webix.protoUI({
                name: "activeTable"
            }, webix.ui.datatable, webix.ActiveContent);
            webix.protoUI({
                name: "activeDataView" //give it some name you like
            }, _webix.ui.dataview, webix.ActiveContent);
            webix.protoUI({
                name: "activeHtmlForm" //give it some name you like
            }, _webix.ui.htmlform, _webix.ui.template, webix.ActiveContent);
            webix.protoUI({
                name: "activeTemplate",
                getValue: function () { return this.getValues(); },
                setValue: function (value, raw) { this.setValues(value); },
            }, _webix.ui.template, webix.ActiveContent);
            webix.protoUI({
                name: "template2",
                getValue: function () { return this.getValues(); },
                $getValue: function () { return this.getValues(); },
                setValue: function (value, raw) { this.setValues(value); },
                $setValue: function (value, raw) { this.setValues(value); },
                $getSize: function (x, y) {
                    this.data = this.data || {};
                    return webix.ui.template.prototype.$getSize.call(this, x, y);
                }
            }, _webix.ui.template, webix.ActiveContent);
            webix.protoUI({
                name: "html",
                defaults: {
                    template: "<div contenteditable='true' style='height: 100%; min-height: 100px; '></div>",
                    borderless: false,
                    value: "HHHHHHHHHHHHHHHHH (webix-ext)",
                },
                getValue: function () {
                    var elem = this.$view.firstElementChild.firstElementChild;
                    if (!elem)
                        return "";
                    return elem.innerHTML;
                },
                onClear: function () {
                    console.log('html clear');
                    this.setValue("<div>GGGGGGGGGGGGGGGG (webix-ext)</div>");
                },
                setValue: function (value, raw) {
                    var elem = this.$view.firstElementChild.firstElementChild;
                    if (!elem)
                        return;
                    elem.innerHTML = value;
                },
            }, _webix.ui.template);
            webix.protoUI({
                $cssName: "text",
                name: "number2",
                $init: function () {
                    this.attachEvent("onItemClick", function () {
                        this.$setValue(this.config.raw, true);
                    });
                    this.attachEvent("onBlur", function () {
                        this.$setValue(this.config.value);
                    });
                },
                $render: function () {
                    this.$setValue(this.config.value);
                },
                $setValue: function (value, raw) {
                    this.config.raw = value;
                    if (!raw && this.config.format) {
                        //value = webix.i18n.numberFormat(value); // this.config.format(
                        value = 1 * value;
                        if (!value)
                            value = 0;
                    }
                    this.getInputNode().value = value;
                }
            }, _webix.ui.text);
            webix.protoUI({
                name: "image",
                //getValue: function (value) {
                //    return this.value;
                //},
                setValue: function (value) {
                    // idea: https://forum.webix.com/discussion/31168/how-to-get-image-from-json-response-in-webix
                    this.setHTML("<img style='" + this.config.style + "' src='" + this.config.url + value + "'></img>");
                    return webix.ui.label.prototype.setValue.apply(this, arguments);
                    //this.value = value;
                }
            }, webix.ui.label);
            _webix.ui.datafilter.avgColumn = _webix.extend({
                refresh: function (master, node, value) {
                    var result = 0;
                    master.mapCells(null, value.columnId, null, 1, function (value) {
                        value = value * 1;
                        if (!isNaN(value))
                            result += value;
                        return value;
                    });
                    node.firstChild.innerHTML = Math.round(result / master.count());
                }
            }, _webix.ui.datafilter.summColumn);
            _webix.ui.datafilter.countColumn = _webix.extend({
                refresh: function (master, node, value) {
                    var result = 0;
                    master.mapCells(null, value.columnId, null, 1, function (value) {
                        value = value * 1;
                        if (!isNaN(value))
                            result += 1;
                        return value;
                    });
                    node.firstChild.innerHTML = Math.round(result);
                }
            }, _webix.ui.datafilter.summColumn);
            // add view for tree editing
            //protoUI({
            //    name: "edittree"
            //}, webix.EditAbility, ui.tree);
            _webix.proxy.idata = {
                $proxy: true,
                load: function (view, callback) {
                    var url = this.source;
                    url += (url.indexOf("?") == -1) ? "?" : "&";
                    var details = arguments[2];
                    var count = details ? details.count : view.config.datafetch || 0;
                    var start = details ? details.start : 0;
                    url += "count=" + count;
                    url += start ? "&start=" + start : "";
                    callback.push({ success: this._checkLoadNext });
                    _webix.ajax(url, callback, view);
                    view.$ready.push(this._attachHandlers);
                },
                _attachHandlers: function () {
                    var proxy = this.config.url;
                    if (this.config.columns)
                        this.attachEvent("onScrollY", webix.bind(proxy._loadNext, this));
                    else
                        this.attachEvent("onAfterScroll", webix.bind(proxy._loadNext, this));
                },
                _checkLoadNext: function (text, data, loader) {
                    var json = data.json();
                    if (!json.length)
                        this.data.url._dontLoadNext = true;
                    //if (json.length)
                    //    this.data.url._dontLoadNext = true;
                },
                _loadNext: function () {
                    var proxy = this.config.url;
                    var contentScroll = this.getScrollState().y + this.$view.clientHeight;
                    var lastId = this.getLastId();
                    var last = this.getItemNode(lastId);
                    if (last && contentScroll > last.offsetTop && !proxy._dontLoadNext)
                        //if (contentScroll > last.offsetTop && !proxy._dontLoadNext)
                        this.loadNext(this.config.datafetch, this.count() + 1);
                }
            };
            _webix.proxy.odata = {
                $proxy: true,
                load: function (view, callback, details) {
                    var url = this.source; //https://t529.databoom.space/api1/b529/collections/persons
                    url += "?$format=json"; //ensures that data is returned in JSON format
                    // if server-side sorting or filtering is triggered
                    if (details) {
                        var start = details.from, count = details.count;
                        if (details.sort)
                            url += "&$orderby=" + details.sort.id + " " + details.sort.dir;
                        if (details.filter) {
                            var filters = [];
                            for (var key in details.filter) {
                                if (details.filter[key])
                                    filters.push("startswith(" + key + ",'" + (details.filter[key] ? details.filter[key] : "") + "')");
                            }
                            if (filters.length)
                                url += "&$filter=" + filters.join(" and ");
                        }
                    }
                    //GET request
                    _webix.ajax(url).then(function (data) {
                        data = data.json();
                        var records = data; //??.d.results;
                        _webix.ajax.$callback(view, callback, "", records, -1);
                    });
                },
                save: function (view, update, dp, callback) {
                    var url = this.source, mode = update.operation, data = update.data, editLink = url.replace(/\/$/, "") + "(" + data["id"] + ")";
                    if (mode == "insert")
                        delete data.id;
                    data = JSON.stringify(data);
                    //call odata URI
                    if (mode == "insert") {
                        webix.ajax().headers({
                            "Content-type": "application/json"
                        }).post(url, data, callback);
                    }
                    else if (editLink) {
                        if (mode == "update") {
                            webix.ajax().headers({
                                "Content-type": "application/json"
                            }).put(editLink, data, callback);
                        }
                        else if (mode == "delete") {
                            webix.ajax().headers({
                                "Content-type": "application/json"
                            }).del(editLink, data, callback);
                        }
                    }
                }
            };
            webix.protoUI({
                name: "slidebutton",
                defaults: {
                    template: function (config, common) {
                        var id = config.name || "x" + webix.uid();
                        var rightlabel = "";
                        if (config.labelRight) {
                            rightlabel = "<label class='webix_label_right'>" + config.labelRight + "</label>";
                            if (config.labelWidth)
                                config.label = config.label || "&nbsp;";
                        }
                        var checked = (config.checkValue == config.value);
                        var margin = 3;
                        var className = "webix_inp_checkbox_border webix_el_group webix_checkbox_" + (checked ? "1" : "0");
                        var ch = '<div class="cmn-toggle-box">' +
                            '<input  id="cmn-toggle-' + id + '" class="cmn-toggle cmn-toggle-round" type="checkbox" ' + (checked ? "checked" : "") + '>' +
                            '<label  for="cmn-toggle-' + id + '"></label>' +
                            ' </div>';
                        var html = "<div style='line-height:" + common.config.cheight + "px' class='" + className + "'>" + ch + rightlabel + "</div>";
                        return common.$renderInput(config, html, id);
                    }
                },
                on_click: {
                    "cmn-toggle": function (e, obj, node) {
                        this.toggle();
                    }
                }
            }, _webix.ui.checkbox);
            //webix.extend((<any>window).webix, webix);
        })(w = UI.w || (UI.w = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var NR = 0;
            var BaseConfig = /** @class */ (function () {
                function BaseConfig() {
                }
                BaseConfig.prototype.checkOn = function () {
                    if (!this.on)
                        this.on = {};
                    return this.on;
                };
                BaseConfig.prototype.checkType = function () {
                    if (!this.type)
                        this.type = {};
                    return this.type;
                };
                BaseConfig.prototype.On = function (event, callback) {
                    this.checkOn();
                    this.on[event] = callback;
                    return this;
                };
                BaseConfig.prototype.extend = function (config) {
                    if (config)
                        webix.extend(this, config, true);
                    return this;
                };
                BaseConfig.prototype.Type = function (type, condition) {
                    if (condition === void 0) { condition = true; }
                    if (condition)
                        this.type = type;
                    return this;
                };
                BaseConfig.prototype.View = function (view) {
                    if (view)
                        this.view = view;
                    return this;
                };
                BaseConfig.prototype.Id = function (id) {
                    if (id)
                        this.id = id;
                    return this;
                };
                BaseConfig.prototype.Disable = function (disabled) {
                    if (disabled === void 0) { disabled = true; }
                    this.disabled = disabled;
                    return this;
                };
                BaseConfig.prototype.Ref = function (ref) {
                    this.id = ref.id;
                    return this;
                };
                BaseConfig.prototype.Tooltip = function (template) {
                    //if (template instanceof String)
                    //    this.tooltip = {
                    //        template: template
                    //    };
                    //else
                    this.tooltip = template;
                    return this;
                };
                BaseConfig.prototype.Attributes = function (attributes) {
                    if (this.attributes)
                        webix.extend(this.attributes, attributes, true);
                    else
                        this.attributes = attributes;
                    return this;
                };
                BaseConfig.prototype.Scrollable = function () {
                    this.scroll = "auto";
                    return this;
                };
                /**
                 * Size
                 * if no params - autoheight
                 * if <0 - gravity
                 */
                BaseConfig.prototype.Size = function (width, height) {
                    if (!width) {
                        delete this.width;
                        this.autowidth = true;
                        this.autoheight = true;
                    }
                    else if (width > 0) {
                        this.width = width;
                    }
                    else if (width < 0) {
                        this.gravity = -width;
                        this.autowidth = false;
                    }
                    if (height) {
                        this.height = height;
                        delete this.autoheight;
                    }
                    return this;
                };
                /**
                 * Высота по умолчанию
                 * @param auto
                 */
                BaseConfig.prototype.Autoheight = function (auto) {
                    if (auto === void 0) { auto = true; }
                    if (auto)
                        this.autoheight = auto;
                    else
                        delete this.autoheight;
                    return this;
                };
                /**
                 * Автоматический ресайзинг при смене размера родительского контейнера
                */
                BaseConfig.prototype.AutoResize = function () {
                    var me = this;
                    if (!me.id)
                        me.id = "w_".concat(++NR, "_").concat(webix.uid()); // для тестирования
                    //window.onresize = function () {
                    window.addEventListener('resize', function () {
                        var uiobj = $$(me.id);
                        if (uiobj && uiobj.isVisible()) {
                            uiobj.resize();
                            //console.log('ui resized: ', me.id); //, uiobj.isVisible());
                        }
                    });
                    return this;
                };
                /**
                 * Min width
                 */
                BaseConfig.prototype.Min = function (width, height) {
                    this.minWidth = width;
                    if (height)
                        this.minHeight = height;
                    return this;
                };
                /**
                 * Max size
                 */
                BaseConfig.prototype.Max = function (width, height) {
                    this.maxWidth = width;
                    if (height)
                        this.maxHeight = height;
                    return this;
                };
                BaseConfig.prototype.Padding = function (x, y) {
                    if (x && !y) {
                        this.padding = x;
                    }
                    else {
                        if (x)
                            this.paddingX = x;
                        if (y)
                            this.paddingY = y;
                    }
                    return this;
                };
                BaseConfig.prototype.Margin = function (x) {
                    this.margin = x;
                    this["margin-left"] = x + 1;
                    this["margin-top"] = x - 1;
                    return this;
                };
                BaseConfig.prototype.Visible = function (visible) {
                    this.hidden = !visible;
                    return this;
                };
                BaseConfig.prototype.Css = function (css, append) {
                    if (append === void 0) { append = false; }
                    if (this.css && append)
                        this.css += " " + css;
                    else
                        this.css = css;
                    return this;
                };
                return BaseConfig;
            }());
            Configs.BaseConfig = BaseConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var ContainerConfig = /** @class */ (function (_super) {
                __extends(ContainerConfig, _super);
                function ContainerConfig() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ContainerConfig.prototype.Cols = function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    var items2 = items.filterNotEmpty();
                    if (this.cols)
                        this.cols = this.cols.concat(items2);
                    else
                        this.cols = items2;
                };
                ContainerConfig.prototype.Rows = function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    var items2 = items.filterNotEmpty();
                    if (this.rows)
                        this.rows = this.rows.concat(items2);
                    else
                        this.rows = items2;
                };
                /**
                 * hidden: true/false
                 * moved: id:"a1", rows:[ { responsive:"a1", ...
                 * see: https://docs.webix.com/desktop__responsive_layout.html
                 */
                ContainerConfig.prototype.Responsive = function (resp) {
                    this.responsive = resp;
                    return this;
                };
                ContainerConfig.prototype.KeepResponsive = function (resp) {
                    if (resp === void 0) { resp = true; }
                    this.responsiveCell = !resp;
                    return this;
                };
                ContainerConfig.prototype.Flex = function (flex) {
                    if (flex === void 0) { flex = true; }
                    if (flex)
                        this.view = "flexlayout";
                    return this;
                };
                return ContainerConfig;
            }(Configs.BaseConfig));
            Configs.ContainerConfig = ContainerConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var TableConfig = /** @class */ (function (_super) {
                __extends(TableConfig, _super);
                function TableConfig(table) {
                    var _this = _super.call(this) || this;
                    _this.table = table;
                    _this.lastId = 0;
                    return _this;
                }
                TableConfig.prototype.Editable = function (saveConfig, edit) {
                    if (edit === void 0) { edit = true; }
                    if (!edit)
                        return; // игнорируем, если false
                    var me = this;
                    me.editable = true;
                    me.editaction = "dblclick";
                    if (saveConfig)
                        me.save = saveConfig;
                    this.checkOn();
                    me.on.onItemClick = function (context) {
                        var id = context.row;
                        if (me.lastId && me.lastId == id) {
                            me.table.ref.edit(context);
                        }
                        else {
                            me.lastId = id;
                        }
                    };
                    return this;
                };
                TableConfig.prototype.Columns = function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    var items2 = items.filterNotEmpty();
                    if (this.columns)
                        this.columns = this.columns.concat(items2);
                    else
                        this.columns = items2;
                };
                TableConfig.prototype.Unselectable = function () {
                    var me = this;
                    me.select = false;
                    me.multiselect = false;
                    return this;
                };
                TableConfig.prototype.OnSelect = function (onselect) {
                    return this.On("onAfterSelect", onselect);
                };
                /**
                 *
                 * returns [ids] of selection
                 */
                TableConfig.prototype.OnSelectChange = function (onselect) {
                    return this.On("onSelectChange", onselect);
                };
                TableConfig.prototype.OnItemSelect = function (onselect) {
                    var _this = this;
                    return this.On("onSelectChange", function (id) {
                        var item = _this.table.getItem(id);
                        onselect(item);
                    });
                };
                TableConfig.prototype.OnItemClick = function (onclick) {
                    return this.On("onItemClick", onclick);
                };
                TableConfig.prototype.OnAdd = function (onadd) {
                    return this.On("onBeforeAdd", function (id, x, y, z) {
                        //let obj = this.table.getItem(id);
                        onadd(x);
                    });
                };
                /**
                 * Tooltip
                 * @param tooltip = string or {template: string}
                 */
                TableConfig.prototype.Tooltip = function (template) {
                    this.tooltip = !template || { template: template };
                    //this.tooltip = {
                    //    template: template
                    //};
                    return this;
                };
                //OnChange(onchange: callback) {
                //    if (!onchange) return;
                //    this.checkOn();
                //    this.on.onAfterEditStop = onchange;
                //    this.on.onLiveEdit = onchange;
                //    this.on.onChange = onchange;
                //    return this;
                //}
                //protected onItemClick(item, e, node) {
                //    let id = item.row;
                //    if (id === this.lastId) return;
                //    this.lastId = id;
                //    let me: any = this;
                //    this.table.ref.editCancel();
                //}
                TableConfig.prototype.onLoadError = function (text, xml, ajax, owner, err) {
                    if (err && err.text)
                        text = err.text;
                    It.Web.error(ajax);
                };
                return TableConfig;
            }(Configs.ContainerConfig));
            Configs.TableConfig = TableConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var ColumnSettings = /** @class */ (function () {
                function ColumnSettings() {
                    this.sort = "string";
                    this.editor = "text";
                    //table: UI.RefTable;
                    this.filter = "textFilter";
                }
                return ColumnSettings;
            }());
            //let intFormat = webix.Number.numToStr({
            //    groupDelimiter: " ",
            //    groupSize: 3,
            //    decimalDelimiter: ".",
            //    decimalSize: 0
            //});
            // config for grid column
            var ColumnConfig = /** @class */ (function (_super) {
                __extends(ColumnConfig, _super);
                function ColumnConfig(id, map) {
                    var _this = _super.call(this) || this;
                    _this.id = id;
                    _this.map = map;
                    _this._settings = new ColumnSettings();
                    _this.tooltip = false;
                    return _this;
                    //this._settings.table = table;
                }
                ColumnConfig.prototype.AsInt = function () {
                    this._settings.sort = "int";
                    this._settings.filter = "numberFilter";
                    this.format = webix.i18n.intFormat;
                    //this.format = intFormat;
                    this.css = { "text-align": "right" };
                    //this._settings.editor = "text";
                    if (!this.width)
                        this.width = 75;
                    return this;
                };
                ColumnConfig.prototype.AsNumber = function (nformat) {
                    if (nformat === void 0) { nformat = "1'111.11"; }
                    this._settings.sort = "int";
                    this._settings.filter = "numberFilter";
                    this.numberFormat = nformat;
                    this.format = webix.i18n.numberFormat;
                    this.css = { "text-align": "right" };
                    //this._settings.editor = "text";
                    if (!this.width)
                        this.width = 75;
                    return this;
                };
                ColumnConfig.prototype.AsDate = function (format) {
                    if (format === void 0) { format = webix.Date.dateToStr("%d-%m-%Y", false); }
                    this._settings.editor = "date";
                    this._settings.sort = "date";
                    this._settings.filter = "dateFilter";
                    //this.template = "#" + this.id + "#";
                    //(<any>this).map = "(date)#{0}#".format(this.id);
                    //delete this.id;
                    this.format = format;
                    if (!this.width)
                        this.width = 100;
                    return this;
                };
                ColumnConfig.prototype.AsCheckbox = function (threeState) {
                    if (threeState === void 0) { threeState = false; }
                    this._settings.sort = "int";
                    this._settings.editor = "checkbox";
                    var col = this;
                    col.checkValue = true;
                    col.uncheckValue = false;
                    col.template = "{common.checkbox()}";
                    if (threeState)
                        col.threeState = threeState;
                    if (!this.width)
                        this.width = 35;
                    return this;
                };
                ColumnConfig.prototype.AsCheckboxReadly = function (readonly) {
                    if (readonly === void 0) { readonly = true; }
                    if (!readonly)
                        return this.AsCheckbox();
                    this._settings.sort = "int";
                    var col = this;
                    col.checkValue = true;
                    col.uncheckValue = false;
                    col.template = Configs.custom_checkbox;
                    //if(threeState) col.threeState = threeState;
                    if (!this.width)
                        this.width = 35;
                    return this;
                };
                ColumnConfig.prototype.AsRadio = function () {
                    this.template = "{common.radio()}"; // .Template("{common.radio()}")
                    if (!this.width)
                        this.width = 35;
                    return this;
                };
                /**
                 * Символ сортировки
                 * @param char
                 */
                ColumnConfig.prototype.AsOrderMarker = function (char) {
                    if (char === void 0) { char = '↕'; }
                    this.template = "<div class='webix_drag_handle'>" + char + "</div>"; // ↕ ⋮ ≢ ≣  ⸎ ⚌  ≡ 
                    if (!this.width)
                        this.width = 25;
                    if (!this.header)
                        this.header = '≡';
                    return this;
                };
                ColumnConfig.prototype.AsColor = function () {
                    this._settings.editor = "color";
                    this.template = function (obj, node, value, z) {
                        return "<span style='background-color:" + value + "; border-radius:4px; padding-right:10px;'>&nbsp&nbsp</span> " + value;
                    };
                    //this.editor = "color";
                    //if (!this.width) this.width = 20;
                    return this;
                };
                // edit as dropdown list
                ColumnConfig.prototype.AsSelect = function (list, editor) {
                    if (editor === void 0) { editor = "combo"; }
                    this.options = list;
                    this._settings.editor = editor;
                    this._settings.filter = "selectFilter";
                    this.popupWidth = 800;
                    return this;
                };
                // edit as suggest (editable) list
                ColumnConfig.prototype.AsSuggest = function (list, editor) {
                    if (editor === void 0) { editor = "text"; }
                    this.suggest = list;
                    this._settings.editor = editor;
                    this._settings.filter = "selectFilter";
                    this.popupWidth = 800;
                    return this;
                };
                /**
                 * НЕ РАБОТАЕТ!!! edit as multiselect dropdown list
                 */
                // http://docs.webix.com/desktop__editing.html#advancedconfigurationofselecteditors
                ColumnConfig.prototype.AsMultiSelect = function (list, editor) {
                    //let tt = {
                    //    id: "year", editor:"multiselect", options:years, optionlist:true, suggest:{
                    //        view: "multisuggest",
                    //            buttonText:"Select items"
                    //    }
                    //};
                    if (editor === void 0) { editor = "multiselect"; }
                    this.options = list;
                    var me = this;
                    me.suggest = {
                        view: "multisuggest",
                        buttonText: "Select items"
                    };
                    return this;
                };
                //// edit as dropdown list
                //AsMultiSelect(list) {
                //    this.options = list;
                //    this._settings.editor = "multiselect";
                //    this._settings.filter = "selectFilter";
                //    return this;
                //}
                /**
                 * header - text or  { css: 'multiline', height: 60, text: 'Текст' }
                 */
                ColumnConfig.prototype.Header = function (header, width) {
                    if (width === void 0) { width = undefined; }
                    this.header = header; //
                    if (width > 0)
                        this.width = width;
                    if (width < 0)
                        this.fillspace = -width;
                    return this;
                };
                //TemplateLink(template: string, view: string) {
                //    let template = template.addLink("{common.href}/" + view + "/edit/?id=#id#");
                //    return this.Template(template);
                //}
                /**
                 * function(obj) or string
                 * @param template
                 */
                ColumnConfig.prototype.Template = function (template) {
                    this.template = template;
                    return this;
                };
                ColumnConfig.prototype.Expression = function (func) {
                    this.template = func;
                    return this;
                };
                /**
                 * string or function(obj, congig)
                 *   see http://docs.webix.com/desktop__tooltip.html
                 */
                ColumnConfig.prototype.Tooltip = function (template) {
                    this.tooltip = template;
                    //let table: any = this._settings.table;
                    //if (table && !table.tooltip)
                    //    table.tooltip = true;
                    //(<any>this._settings.table).type = { href: "#!" };
                    return this;
                };
                /**
                 * Sample:
                 *    format( webix.i18n.numberFormat ), see https://docs.webix.com/datatable__formatting.html
                 */
                ColumnConfig.prototype.Format = function (format) {
                    this.format = format;
                    return this;
                };
                /**
                 * Sample:
                 *   format("1'111.00") // number format editor
                 */
                ColumnConfig.prototype.Pattern = function (pattern) {
                    this.numberFormat = pattern;
                    return this;
                };
                ColumnConfig.prototype.Sort = function () {
                    this.sort = this._settings.sort;
                    return this;
                };
                /**
                 * See: https://docs.webix.com/desktop__editing.html#text
                 */
                ColumnConfig.prototype.Edit = function (editor) {
                    if (editor === void 0) { editor = undefined; }
                    this.editor = editor || this._settings.editor;
                    return this;
                };
                ColumnConfig.prototype.Filter = function () {
                    this.header = [this.header, { content: this._settings.filter }];
                    return this;
                };
                /** countColumn, summColumn, avgColumn, see:
                 * http://docs.webix.com/datatable__headers_footers.html
                 */
                ColumnConfig.prototype.Footer = function (footer) {
                    if (footer === void 0) { footer = { content: "summColumn" }; }
                    this.footer = footer;
                    return this;
                };
                ColumnConfig.prototype.Error = function (text) {
                    this.invalidMessage = text;
                    return this;
                };
                return ColumnConfig;
            }(Configs.BaseConfig));
            Configs.ColumnConfig = ColumnConfig;
            webix.ui.datafilter.countColumn = webix.extend({
                refresh: function (master, node, value) {
                    var result = 0;
                    master.mapCells(null, value.columnId, null, 1, function (value) {
                        result++;
                        return value;
                    });
                    node.firstChild.innerHTML = result;
                }
            }, webix.ui.datafilter.summColumn);
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var DataViewConfig = /** @class */ (function (_super) {
                __extends(DataViewConfig, _super);
                function DataViewConfig(list) {
                    var _this = _super.call(this, list) || this;
                    _this.list = list;
                    var baseCfg = {
                        view: "activeDataView",
                        id: list.id,
                        select: "row",
                        multiselect: true,
                        scroll: true,
                        //xCount: 1, //the number of items in a row
                        //yCount: 1 //the number of items in a column
                        //sizeToContent: true,
                        borderless: true,
                        //tooltip: true,
                        navigation: true,
                        type: {
                            href: Configs.HREF_PREFIX,
                        },
                    };
                    webix.extend(_this, baseCfg, true);
                    return _this;
                }
                DataViewConfig.prototype.Template = function (template) {
                    this.template = template;
                    return this;
                };
                DataViewConfig.prototype.ItemSize = function (width, height) {
                    if (width === void 0) { width = "auto"; }
                    if (height === void 0) { height = "auto"; }
                    this.checkType();
                    this.type.width = width;
                    this.type.height = height;
                    return this;
                };
                return DataViewConfig;
            }(Configs.TableConfig));
            Configs.DataViewConfig = DataViewConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var mob = webix.env.mobile || It.isMobile();
            // config for form element
            var ElementConfig = /** @class */ (function (_super) {
                __extends(ElementConfig, _super);
                function ElementConfig(name) {
                    var _this = _super.call(this) || this;
                    _this.name = name;
                    //this._settings.table = table;
                    //{ view: view, name: prop.name, label: prop.title, };
                    _this.view = "text";
                    return _this;
                }
                /**
                 * Добавление подписи
                 * @param label
                 * @param width
                 * @param position - top, right
                 */
                ElementConfig.prototype.Label = function (label, position, width) {
                    this.label = label;
                    if (width) //width = label.length * 10;
                        this.labelWidth = width;
                    //else this.autowidth = true;
                    if (mob)
                        position = "top"; // принудительно выставляем у мобильных устройств метку сверху
                    if (position)
                        this.labelPosition = position;
                    return this;
                };
                ElementConfig.prototype.LabelR = function (label) {
                    this.labelRight = label;
                    return this;
                };
                /**
                * Паттерн ввода
                * @param pattern  sample: { mask:"###-## ########", allow:/[0-9]/g}
                */
                ElementConfig.prototype.Format = function (pattern, use) {
                    if (use === void 0) { use = true; }
                    if (use)
                        this.pattern = pattern;
                    return this;
                };
                ElementConfig.prototype.Readonly = function (readonly) {
                    if (readonly === void 0) { readonly = true; }
                    this.readonly = readonly;
                    return this;
                };
                ElementConfig.prototype.On = function (event, handler) {
                    if (!this.on)
                        this.on = {};
                    this.on[event] = handler;
                    return this;
                };
                ElementConfig.prototype.OnChange = function (handler) {
                    return this.On("onChange", handler);
                };
                ElementConfig.prototype.Validate = function (func, messge) {
                    this.validate = func;
                    if (!messge)
                        messge = UI.coreLocale.Err.ValidationError;
                    this.invalidMessage = messge;
                    return this;
                };
                ElementConfig.prototype.Require = function (messge, required) {
                    if (messge === void 0) { messge = UI.coreLocale.Err.ValidationRequire; }
                    if (required === void 0) { required = true; }
                    this.required = required;
                    this.invalidMessage = messge;
                    return this;
                };
                ElementConfig.prototype.RangeDates = function (d1, d2) {
                    var suggest = {
                        type: "calendar",
                        body: {
                            minDate: d1,
                            maxDate: d2,
                        }
                    };
                    this.extend({ suggest: suggest });
                    return this;
                };
                ElementConfig.prototype.Error = function (text) {
                    this.invalidMessage = text;
                    return this;
                };
                ElementConfig.prototype.Value = function (val) {
                    this.value = val;
                    return this;
                };
                ElementConfig.prototype.MaxLength = function (n) {
                    this.Attributes({ maxlength: n });
                    return this;
                };
                ElementConfig.prototype.Tooltip = function (template) {
                    _super.prototype.Tooltip.call(this, template);
                    if (!this.placeholder && Configs.defaults.placeholders)
                        this.placeholder = template;
                    return this;
                };
                ElementConfig.prototype.Placeholder = function (placeholder) {
                    this.placeholder = placeholder;
                    return this;
                };
                ElementConfig.prototype.BottomLabel = function (label) {
                    this.bottomLabel = label || this.tooltip;
                    return this;
                };
                ElementConfig.prototype.AsLabel = function () {
                    this.view = "label";
                    return this;
                };
                //AsUploader(url: string, multi: boolean, accept = "image/png, image/gif, image/jpg") {
                //    this.view = "uploader";
                //    let uploader = {
                //        value: loc.Controls.PhotoDragDrop,
                //        //link: this.uploaderList.id,
                //        upload: url,
                //        accept: accept,
                //        datatype: "json",
                //        multiple: multi,
                //        //on: {
                //        //    onFileUpload: function (item) {
                //        //        //webix.message("Done");
                //        //        me.files.callNoEvents(() => me.files.add(item[0]));
                //        //    }
                //        //},
                //    };
                //    webix.extend(this, uploader, true);
                //    return this;
                //}
                ElementConfig.prototype.AsTemplate = function (template, autoheight) {
                    if (autoheight === void 0) { autoheight = true; }
                    this.view = "template2";
                    this.template = template;
                    //this.id = webix.uid(); // выставляем, иначе дублируется на разных формах
                    this.autoheight = autoheight;
                    this.borderless = true;
                    //(<any>this).data = {};
                    return this;
                };
                ElementConfig.prototype.AsHtmlLabel = function (height) {
                    if (height === void 0) { height = 0; }
                    this.view = "htmllabel";
                    this.scroll = false;
                    this.borderless = true;
                    //this.template = template;
                    var me = this;
                    if (!height)
                        me.autoheight = true;
                    else //if (height < 0)
                        this.height = height;
                    return this;
                };
                ElementConfig.prototype.AsText = function () {
                    this.view = "text";
                    this.value = "";
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.AsImage = function (url, style) {
                    this.view = "image";
                    if (url)
                        this.url = url;
                    if (style)
                        this.style = style;
                    return this;
                };
                //AsNumber(format = webix.i18n.priceFormat) {
                //    this.view = "number";
                //    this.format = format;
                //    this.value = 0;
                //    this.validate = webix.rules.isNumber;
                //    return this;
                //}
                ElementConfig.prototype.AsNumber = function (format) {
                    if (format === void 0) { format = "1'111.00"; }
                    return this.AsInt(format);
                };
                ElementConfig.prototype.AsInt = function (format) {
                    if (format === void 0) { format = "1'111"; }
                    if (mob) {
                        this.type = "number"; // всегда выставляем
                    }
                    else {
                        if (Configs.defaults.input_numtype)
                            this.type = Configs.defaults.input_numtype; // выставляем тип числового поля
                        //this.view = "counter";
                        this.view = "text";
                        this.format = format;
                    }
                    this.value = 0;
                    this.validate = webix.rules.isNumber;
                    this.inputAlign = "right";
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.AsCounter = function (min, max) {
                    if (min === void 0) { min = 0; }
                    if (max === void 0) { max = 0; }
                    if (mob) {
                        this.type = "number";
                    }
                    else {
                        this.view = "counter";
                    }
                    this.value = 0;
                    this.validate = webix.rules.isNumber;
                    if (!this.width)
                        this.width = 300;
                    if (min)
                        this.min = min;
                    if (max)
                        this.max = max;
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.AsSearch = function (searchClick, placeholder) {
                    this.view = "search";
                    this.type = "search";
                    var me = this;
                    if (placeholder)
                        me.placeholder = placeholder;
                    //me.hotkey = "enter";
                    //me.click = () => alert("Ooops");
                    if (searchClick) {
                        me.keyPressTimeout = Configs.defaults.keyDelay;
                        me.on = {
                            onSearchIconClick: searchClick,
                            onKeyPress: function (code, e) {
                                if (code == 13) {
                                    searchClick(); // on enter
                                    return false;
                                }
                            },
                        };
                    }
                    return this;
                };
                ElementConfig.prototype.AsTextArea = function (height, position) {
                    if (height === void 0) { height = 100; }
                    if (position === void 0) { position = "top"; }
                    this.view = "textarea";
                    //(<any>this).borderless = false;
                    if (height)
                        this.height = height;
                    this.labelPosition = mob ? 'top' : position;
                    this.autocomplete('off');
                    return this;
                };
                /**
                 * Встроенный DIV редактор html
                 */
                ElementConfig.prototype.AsHtmlEditor = function (height, position) {
                    if (height === void 0) { height = 0; }
                    if (position === void 0) { position = "top"; }
                    this.view = "html";
                    if (height)
                        this.height = height;
                    this.labelPosition = position;
                    //(<any>this).minHeight = 100; смысла нет, не работает, задается в html template
                    return this;
                };
                /**
                 * Tiny MCE editor
                 */
                ElementConfig.prototype.AsHtml = function () {
                    this.view = "html-editor"; //"tinymce-editor";
                    this.value = "";
                    return this;
                };
                ElementConfig.prototype.AsCodeEditor = function (mode, height, position) {
                    if (mode === void 0) { mode = "javascript"; }
                    if (height === void 0) { height = 100; }
                    if (position === void 0) { position = "top"; }
                    this.view = "ace-editor";
                    if (height)
                        this.height = height;
                    this.labelPosition = position;
                    var me = this;
                    me.theme = "textmate";
                    me.mode = mode;
                    return this;
                };
                ElementConfig.prototype.AsDate = function (timepicker) {
                    if (timepicker === void 0) { timepicker = false; }
                    //if (!mob) { отключаем, тк на мобильных нативный контрол врет
                    this.view = "datepicker";
                    this.editable = Configs.defaults.dateedit; // !mob;
                    this.timepicker = timepicker;
                    //}
                    this.type = timepicker ? "datetime-local" : "date";
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.AsTime = function () {
                    this.view = "datepicker";
                    this.type = "time";
                    this.editable = Configs.defaults.dateedit; //!mob;
                    this.stringResult = true;
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.AsMonth = function () {
                    this.view = "datepicker";
                    this.type = "month";
                    this.editable = Configs.defaults.dateedit && !mob;
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.AsYear = function () {
                    this.view = "datepicker";
                    this.type = "year";
                    this.editable = Configs.defaults.dateedit && !mob;
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.AsColor = function () {
                    this.view = "colorpicker";
                    this.type = "color";
                    this.editable = !mob;
                    return this;
                };
                ElementConfig.prototype.AsCheckbox = function (right) {
                    if (right === void 0) { right = false; }
                    this.view = "checkbox";
                    var me = this;
                    if (mob)
                        this.labelPosition = undefined;
                    if (right) {
                        this.labelRight = this.label;
                        delete me.label;
                    }
                    me.uncheckValue = false;
                    me.checkValue = true;
                    return this;
                };
                ElementConfig.prototype.AsSwitch = function (onLabel, offLabel) {
                    // { view: "switch", onLabel: "On", offLabel:"Off", value: 1 },   https://docs.webix.com/samples/13_form/01_controls/28_switch.html
                    this.view = "switch";
                    var me = this;
                    if (mob)
                        this.labelPosition = undefined;
                    if (onLabel)
                        me.onLabel = onLabel;
                    if (offLabel)
                        me.offLabel = offLabel;
                    me.uncheckValue = false;
                    me.checkValue = true;
                    return this;
                };
                ElementConfig.prototype.AsPassword = function () {
                    this.type = "password";
                    return this;
                };
                ElementConfig.prototype.AsEmail = function () {
                    this.type = "email";
                    this.Validate(webix.rules.isEmail);
                    return this;
                };
                ElementConfig.prototype.AsUrl = function () {
                    this.type = "Url";
                    return this;
                };
                ElementConfig.prototype.AsTelephone = function (pattern) {
                    if (pattern === void 0) { pattern = $u.w.patterns2.phone; }
                    if (mob) {
                        this.type = "tel";
                    }
                    else {
                        this.type = "text";
                    }
                    this.pattern = pattern; //{ mask: "(###) ###-##-##", allow: /[0-9]/g };
                    return this;
                };
                ElementConfig.prototype.AsRadio = function (options) {
                    this.view = "radio";
                    this.options = options;
                    this.vertical = mob;
                    this.customRadio = false;
                    this.autocomplete('off');
                    return this;
                };
                ElementConfig.prototype.autocomplete = function (val) {
                    this.Attributes({ autocomplete: val });
                };
                ElementConfig.prototype.AsSelect = function (options, view) {
                    if (view === void 0) { view = (mob ? "select" : Configs.defaults.select); }
                    this.view = view;
                    this.options = options;
                    this.yCount = 20;
                    this.keyPressTimeout = Configs.defaults.keyDelay;
                    this.autocomplete('off');
                    //let me: any = this;
                    //me.suggest = {
                    //    fitMaster: false,
                    //    width: 600,
                    //    data: options,
                    //    keyPressTimeout: KEY_DELAY,
                    //};
                    return this;
                };
                /**
                 * Расширенный SELECT
                 * @param options
                 * @param template - шаблон
                 * @param server - выполняется ли поиск на сервере по ссылке
                 */
                ElementConfig.prototype.AsSelect2 = function (options, template, filter, server) {
                    if (template === void 0) { template = ""; }
                    if (filter === void 0) { filter = ""; }
                    if (server === void 0) { server = false; }
                    if (mob) { // добавил на свой страх и риск (2017-11-17), пока не проверял
                        this.view = "select";
                    }
                    else {
                        this.view = "combo";
                    }
                    var me = this;
                    this.autocomplete('off');
                    //me.suggest = options;
                    me.fitMaster = false;
                    //me.width = 1400;
                    me.options = {
                        view: "suggest",
                        keyPressTimeout: Configs.defaults.keyDelay,
                        fitMaster: false,
                        width: 1400,
                        body: {
                            yCount: 20,
                            //data: options,
                            fitMaster: false,
                            width: Configs.defaults.dropwidth,
                        },
                    };
                    if (template) {
                        me.options.body.template = template;
                    }
                    if (filter) {
                        //me.options.filter = filter;                
                        me.options.filter = function (item, value) {
                            var val = item[filter];
                            if (!val || !value)
                                return false;
                            //return val && val.indexOf(value) >= 0;
                            // from https://docs.webix.com/desktop__advanced_combo.html#changingfilteringpattern
                            if (val.toString().toLowerCase().indexOf(value.toLowerCase()) === 0)
                                return true;
                            return false;
                        };
                    }
                    if (typeof options == "string") {
                        if (server)
                            me.options.body.dataFeed = options; // for server side
                        else
                            me.options.body.url = options;
                    }
                    else
                        me.options.body.data = options;
                    return this;
                };
                ElementConfig.prototype.AsMultiSelect = function (options, server, view, template) {
                    if (server === void 0) { server = false; }
                    if (view === void 0) { view = Configs.defaults.multiselect; }
                    if (mob) {
                        return this.AsSelect(options, "select").Attributes({ multiple: true });
                    }
                    this.view = view;
                    var me = this;
                    this.autocomplete('off');
                    //me.suggest = options;
                    me.fitMaster = false;
                    //me.width = 1400;
                    me.suggest = {
                        keyPressTimeout: Configs.defaults.keyDelay,
                        fitMaster: false,
                        width: 1400,
                        //template: template,  
                        body: {
                            yCount: 20,
                            //data: options,
                            fitMaster: false,
                            width: Configs.defaults.dropwidth,
                        },
                    };
                    if (template)
                        me.suggest.body.template = template; // https://docs.webix.com/desktop__multicombo.html
                    if (typeof options == "string") {
                        if (server)
                            me.suggest.body.dataFeed = options; // for server side
                        else
                            me.suggest.body.url = options;
                    }
                    else
                        me.suggest.body.data = options;
                    return this;
                };
                return ElementConfig;
            }(Configs.BaseConfig));
            Configs.ElementConfig = ElementConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var FormConfig = /** @class */ (function (_super) {
                __extends(FormConfig, _super);
                function FormConfig(__container) {
                    var _this = _super.call(this) || this;
                    _this.__container = __container;
                    var view = {
                        view: "form",
                        id: _this.__container.id,
                        borderless: true,
                        autoheight: true,
                        padding: Configs.defaults.padding,
                        //margin: defaults.margin,
                        elementsConfig: {
                            labelWidth: Configs.defaults.labelWidth,
                            //labelPosition: "top",
                            //height: defaults.height
                        },
                        type: {
                            href: Configs.HREF_PREFIX,
                        },
                    };
                    _this.extend(view);
                    return _this;
                    //if (defaults.height)
                    //    (<any>this).elementsConfig.height = defaults.height;
                }
                FormConfig.prototype.Labels = function (width, position) {
                    if (!this.elementsConfig)
                        this.elementsConfig = {};
                    if (width)
                        this.elementsConfig.labelWidth = width;
                    if (position)
                        this.elementsConfig.labelPosition = position;
                    return this;
                };
                FormConfig.prototype.Readonly = function (val) {
                    if (!this.elementsConfig)
                        this.elementsConfig = {};
                    this.elementsConfig.readonly = val;
                    return this;
                };
                FormConfig.prototype.Elements = function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    var items2 = items.filterNotEmpty();
                    if (this.elements)
                        this.elements = this.elements.concat(items2);
                    else
                        this.elements = items2;
                };
                return FormConfig;
            }(Configs.ContainerConfig));
            Configs.FormConfig = FormConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var GridConfig = /** @class */ (function (_super) {
                __extends(GridConfig, _super);
                function GridConfig(grid) {
                    var _this = _super.call(this, grid) || this;
                    _this.grid = grid;
                    var me = _this;
                    var baseCfg = {
                        view: "datatable",
                        //view: "activeTable", --- в 7-й версии стал выдавать ошибку
                        id: grid.id,
                        select: "row",
                        multiselect: true,
                        resizeColumn: true,
                        //editable: true,
                        datafetch: 10,
                        loadahead: 20,
                        scrollX: false,
                        scrollY: true,
                        //scroll: "auto",
                        borderless: true,
                        //tooltip: true,
                        navigation: true,
                        minHeight: 100,
                        type: {
                            href: Configs.HREF_PREFIX,
                        },
                        //save: {
                        //    url: "rest->api/invoices/save",
                        //    updateFromResponse: true,
                        //    autoupdate: false,
                        //},
                        on: {
                            //onItemClick: (item, e, node) => this.onItemClick(item, e, node),
                            onLoadError: function (a, b, c, d, e) { return _this.onLoadError(a, b, c, d, e); },
                            onValidationError: function (key, obj, cols) {
                                var col = me.columns[0];
                                var msg = UI.coreLocale.Err.ValidationError;
                                var _loop_1 = function (id) {
                                    col = me.columns.find(function (c) { return c.id == id; });
                                    return "break";
                                };
                                for (var id in cols) {
                                    var state_1 = _loop_1(id);
                                    if (state_1 === "break")
                                        break;
                                }
                                if (col && col.invalidMessage)
                                    msg = col.invalidMessage;
                                $u.w.error(msg);
                            }
                        },
                    };
                    webix.extend(_this, baseCfg, true);
                    return _this;
                }
                /**
                 * event for common.radio(), common.checkbox() templates
                 * see: https://webix.com/snippet/3559b627
                 *
                 * @param action (row,col,value) => void
                 */
                GridConfig.prototype.OnCheck = function (action) {
                    return this.On("onCheck", action);
                };
                /**
                 * Отслеживание изменений
                 * @param action (vals, column)
                 * vals: old, value
                 * column: column: string, config, ...
                 * https://docs.webix.com/api__refs__editability.html
                 * https://docs.webix.com/api__editability_onaftereditstop_event.html
                 */
                GridConfig.prototype.OnEdit = function (action) {
                    return this.On("onAfterEditStop", action);
                };
                /**
                 * Позволяет сортировать записи перетаскиванием,
                 * Если задан orderColumn - то только в спец. колонке
                 */
                GridConfig.prototype.DragOrder = function (action, orderColumn) {
                    if (orderColumn === void 0) { orderColumn = false; }
                    this.checkOn();
                    if (!this.drag)
                        this.drag = true;
                    if (orderColumn)
                        this.on.onBeforeDrag = function (data, e) {
                            return (e.target || e.srcElement).className == "webix_drag_handle";
                        };
                    this.on.onAfterDrop = function (context, ev) {
                        action(0, this.data.order);
                    };
                    //onBeforeDrag: function (data, e) {
                    //    return (e.target || e.srcElement).className == "webix_drag_handle";
                    //},
                    //onBeforeDrop: function (context, ev) {
                    //    if (!context.target) return false;
                    //    return true;
                    //},
                    //onAfterDrop: function (context, ev) {
                    //    db.order(0, this.data.order);
                    //let prop = 'order';
                    //let arr: any[] = this.data.order;
                    //let n = 0;
                    //_.forEach(arr, id => {
                    //    let item = this.getItem(id); // ищем текущий элемент
                    //    let order = item[prop]; // порядковый номер сортировки
                    //    if (order == n++) return; // если совпадает, то идем к следующему
                    //    let newitem: any = {};
                    //    newitem[prop] = n-1; // присваиваем новый порядковый номер и обновляем
                    //    this.updateItem(id, newitem);
                    //});
                    return this;
                };
                GridConfig.prototype.Subrow = function (template, height) {
                    if (height === void 0) { height = "auto"; }
                    this.subrow = template;
                    if (height)
                        this.subRowHeight = height;
                    return this;
                };
                GridConfig.prototype.Footer = function () {
                    this.footer = true;
                    return this;
                };
                return GridConfig;
            }(Configs.TableConfig));
            Configs.GridConfig = GridConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var ItemConfig = /** @class */ (function (_super) {
                __extends(ItemConfig, _super);
                function ItemConfig(view) {
                    var _this = _super.call(this) || this;
                    if (view)
                        _this.view = view;
                    return _this;
                }
                //Clicks(...onclicks: callback[]) {
                //    this.click = (...args) => {
                //        let res = null;
                //        for (let i in onclicks) {
                //            let f = onclicks[i];
                //            res = f(res);
                //        }
                //    }
                //    return this;
                //}
                ItemConfig.prototype.Click = function (onclick) {
                    this.click = onclick;
                    return this;
                };
                ItemConfig.prototype.Align = function (align) {
                    this.align = align;
                    return this;
                };
                ItemConfig.prototype.Hidden = function (hidden) {
                    this.hidden = hidden;
                    return this;
                };
                ItemConfig.prototype.Hotkey = function (hotkey) {
                    this.hotkey = hotkey;
                    return this;
                };
                ItemConfig.prototype.Batch = function (batch) {
                    this.batch = batch;
                    return this;
                };
                /**
                 *
                 * @param config
                 * @param create - oncreate callback  or true (autocreate)
                 */
                ItemConfig.prototype.Popup = function (config, create) {
                    this.popup = new Configs.PopupConfig(config);
                    //if (callback) callback(this.popup);
                    if (create) {
                        //if (create == true)
                        //    webix.ui(config).hide();  не работает, тк создает еще один view
                        //else
                        this.popup.OnPopup(function (_) { return create(); });
                    }
                    return this;
                };
                ItemConfig.prototype.PopupCfg = function (config) {
                    this.popup = config;
                    return this;
                };
                ItemConfig.prototype.OnChange = function (action) {
                    this.checkOn();
                    this.on.onChange = action;
                    return this;
                };
                return ItemConfig;
            }(Configs.BaseConfig));
            Configs.ItemConfig = ItemConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var ListConfig = /** @class */ (function (_super) {
                __extends(ListConfig, _super);
                function ListConfig(list) {
                    var _this = _super.call(this, list) || this;
                    _this.list = list;
                    var baseCfg = {
                        view: "activeList",
                        id: list.id,
                        select: true,
                        multiselect: true,
                        resizeColumn: true,
                        //editable: true,
                        datafetch: 10,
                        loadahead: 20,
                        scrollX: false,
                        scrollY: true,
                        scroll: false,
                        borderless: true,
                        //tooltip: true,
                        navigation: true,
                        //cursor: "default",
                        type: {
                            href: Configs.HREF_PREFIX,
                        },
                    };
                    webix.extend(_this, baseCfg, true);
                    return _this;
                }
                ListConfig.prototype.DragDrop = function (ordername) {
                    var _this = this;
                    var me = this;
                    me.drag = true;
                    this.orderName = ordername;
                    if (!me.on)
                        me.on = {};
                    me.on.onAfterDrop = function (context) { return _this.onOrderDrop(context); };
                    return this;
                };
                ListConfig.prototype.Editable = function (saveConfig) {
                    var me = this;
                    me.view = "editlist";
                    me.editable = true;
                    me.editaction = "dblclick";
                    if (saveConfig)
                        me.save = saveConfig;
                    return this;
                };
                ListConfig.prototype.onOrderDrop = function (context) {
                    var _this = this;
                    var list = this.list.ref;
                    if (context.from !== list)
                        return true;
                    //let orderProp = "Order";
                    var index = 0;
                    var v = [];
                    list.data.each(function (row) {
                        index++;
                        if (row[_this.orderName] != index) {
                            v[_this.orderName] = index;
                            list.updateItem(row.id, v);
                        }
                    });
                    this.list.save();
                };
                return ListConfig;
            }(Configs.TableConfig));
            Configs.ListConfig = ListConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var PopupConfig = /** @class */ (function (_super) {
                __extends(PopupConfig, _super);
                function PopupConfig(config, head) {
                    var _this = _super.call(this) || this;
                    _this.config = config;
                    _this.head = head;
                    var popup = {
                        view: "popup",
                        head: head,
                        body: config,
                    };
                    _this.extend(popup);
                    return _this;
                }
                PopupConfig.prototype.OnPopup = function (onpopup) {
                    var first = true;
                    this.On("onBeforeShow", function () {
                        if (!first)
                            return;
                        first = false;
                        onpopup();
                    });
                    return this;
                };
                return PopupConfig;
            }(Configs.BaseConfig));
            Configs.PopupConfig = PopupConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var BaseTreeConfig = /** @class */ (function (_super) {
                __extends(BaseTreeConfig, _super);
                function BaseTreeConfig(tree) {
                    var _this = _super.call(this, tree) || this;
                    _this.tree = tree;
                    return _this;
                }
                BaseTreeConfig.prototype.DragDrop = function () {
                    var _this = this;
                    var me = this;
                    //this.orderName = ordername;ordername: string
                    this.checkOn();
                    me.drag = true; //"order",
                    me.on.onBeforeDrop = function (context) { return _this.onBeforeDrop(context); };
                    me.on.onAfterDrop = function (context) { return _this.onAfterDrop(context); };
                    return this;
                };
                BaseTreeConfig.prototype.onBeforeDrop = function (context) {
                    var tree = this.tree.ref;
                    if (context.from !== tree)
                        return false;
                    var e = event; // to avoid compile errors
                    var isSubTree = e.shiftKey || e.altKey || e.ctrlKey;
                    if (isSubTree) {
                        context.parent = context.target;
                        context.index = -1;
                    }
                };
                BaseTreeConfig.prototype.onAfterDrop = function (context) {
                    var tree = this.tree.ref;
                    if (context.from !== tree)
                        return false;
                    this.tree.reindex(context.parent, context.start);
                };
                return BaseTreeConfig;
            }(Configs.TableConfig));
            Configs.BaseTreeConfig = BaseTreeConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var TabsConfig = /** @class */ (function (_super) {
                __extends(TabsConfig, _super);
                function TabsConfig(tabs) {
                    var _this = _super.call(this, "tabbar") || this;
                    _this.multiview = true;
                    _this.options = tabs;
                    return _this;
                }
                TabsConfig.prototype.Value = function (id) {
                    this.value = id;
                    return this;
                };
                /**
                 * if no width - auto
                 */
                TabsConfig.prototype.TabWidth = function (width) {
                    if (width === void 0) { width = "auto"; }
                    this.optionWidth = width;
                    return this;
                };
                return TabsConfig;
            }(Configs.ItemConfig));
            Configs.TabsConfig = TabsConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var TabViewConfig = /** @class */ (function (_super) {
                __extends(TabViewConfig, _super);
                function TabViewConfig() {
                    var _this = _super.call(this, "tabview") || this;
                    _this.cells = [];
                    _this.tabbar = {
                        optionWidth: "auto",
                    };
                    return _this;
                }
                TabViewConfig.prototype.Value = function (id) {
                    this.value = id;
                    return this;
                };
                TabViewConfig.prototype.Tab = function (header, body, tab) {
                    if (!tab)
                        tab = {};
                    tab.header = " " + header + " ";
                    tab.body = body;
                    this.cells.push(tab);
                    return this;
                };
                return TabViewConfig;
            }(Configs.ItemConfig));
            Configs.TabViewConfig = TabViewConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var TreeConfig = /** @class */ (function (_super) {
                __extends(TreeConfig, _super);
                function TreeConfig(tree) {
                    var _this = _super.call(this, tree) || this;
                    var cfg = {
                        view: "tree",
                        id: _this.tree.id,
                        select: true,
                        navigation: true,
                        borderless: true,
                        autoheight: true,
                        scroll: false,
                        multiselect: true,
                        minWidth: 50,
                        minHeight: 50,
                    };
                    _this.extend(cfg);
                    return _this;
                }
                TreeConfig.prototype.Editable = function (property) {
                    _super.prototype.Editable.call(this);
                    this.view = "edittree";
                    //this.editable = true;
                    this.editor = "text";
                    this.editValue = property;
                    return this;
                };
                /**
                 * Sample: "{common.icon()} {common.folder()}<span>#value#<span>"
                 */
                TreeConfig.prototype.Template = function (template) {
                    this.template = template;
                    return this;
                };
                return TreeConfig;
            }(Configs.BaseTreeConfig));
            Configs.TreeConfig = TreeConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var TreeTableConfig = /** @class */ (function (_super) {
                __extends(TreeTableConfig, _super);
                function TreeTableConfig(tree) {
                    var _this = _super.call(this, tree) || this;
                    var cfg = {
                        view: "treetable",
                        id: _this.tree.id,
                        borderless: true,
                        select: "row",
                        multiselect: true,
                        minWidth: 50,
                        minHeight: 50,
                        resizeColumn: true,
                        navigation: true,
                        scroll: false,
                        type: {
                            href: Configs.HREF_PREFIX,
                        },
                        on: {
                            //onItemClick: (item, e, node) => this.onItemClick(item, e, node),
                            onLoadError: function (a, b, c, d, e) { return _this.onLoadError(a, b, c, d, e); },
                        },
                    };
                    _this.extend(cfg);
                    return _this;
                }
                return TreeTableConfig;
            }(Configs.BaseTreeConfig));
            Configs.TreeTableConfig = TreeTableConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            var MultiViewConfig = /** @class */ (function (_super) {
                __extends(MultiViewConfig, _super);
                function MultiViewConfig(id) {
                    var _this = _super.call(this) || this;
                    var cfg = {
                        view: "multiview",
                        id: id,
                        keepViews: true,
                        //animate: false,
                        //animate: {
                        //    type: "flip",
                        //    //subtype: "vertical",
                        //    //direction: "top",
                        //},
                        cells: [
                            { template: "" },
                        ],
                    };
                    _this.extend(cfg);
                    return _this;
                }
                return MultiViewConfig;
            }(Configs.ContainerConfig));
            Configs.MultiViewConfig = MultiViewConfig;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var Configs;
        (function (Configs) {
            Configs.HREF_PREFIX = "#!";
            //export const KEY_DELAY = 700;
            // see https://forum.webix.com/discussion/32570/form-styling-padding-margin-etc#latest
            Configs.defaults = {
                keyDelay: 700,
                padding: 20,
                labelWidth: 120,
                placeholders: false,
                dropwidth: 600,
                /** Use icon or buttons   */
                toolbarIcon: true,
                select: 'combo',
                multiselect: 'multicombo',
                dateedit: true,
                input_numtype: "", // выставляет по умолчанию тип для числовых полей ввода
                //margin: <number>undefined,
                //height: <number>undefined,
            };
            function custom_checkbox(obj, common, value) {
                if (value)
                    return "<div class='fa fa-chevron-down'></div>";
                else
                    return "<div class='webix_table_checkbox notchecked'></div>";
            }
            Configs.custom_checkbox = custom_checkbox;
        })(Configs = UI.Configs || (UI.Configs = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
         reference to the UI control
        */
        var RefUI = /** @class */ (function () {
            function RefUI() {
                this.id = webix.uid().toString();
                this._ref = null;
            }
            Object.defineProperty(RefUI.prototype, "ref", {
                get: function () {
                    if (!this._ref) //this.set();
                        this._ref = $$(this.id);
                    return this._ref;
                },
                enumerable: false,
                configurable: true
            });
            RefUI.prototype.setAttrId = function (id) {
                var node = this.ref.getNode();
                node.setAttribute("id", id);
            };
            RefUI.prototype.set = function (vals, refresh) {
                if (refresh === void 0) { refresh = true; }
                this.ref.define(vals);
                if (!refresh)
                    return;
                if (this.ref.reconstruct)
                    this.ref.reconstruct();
                else if (this.ref.refresh)
                    this.ref.refresh();
            };
            RefUI.prototype.bind = function (table, filter) {
                this.ref.bind(table.ref, filter);
            };
            RefUI.prototype.updateBindings = function () {
                var res = this.ref.save();
                return true;
            };
            RefUI.prototype.visible = function (val) {
                if (val)
                    this.ref.show();
                else
                    this.ref.hide();
            };
            RefUI.prototype.enable = function (enable) {
                if (enable === void 0) { enable = true; }
                if (enable)
                    this.ref.enable();
                else
                    this.ref.disable();
            };
            RefUI.prototype.getValue = function () {
                return this.ref.getValue();
            };
            RefUI.prototype.setValue = function (value) {
                return this.ref.setValue(value);
            };
            RefUI.prototype.setValues = function (value) {
                return this.ref.setValues(value);
            };
            RefUI.prototype.getText = function () {
                return this.ref.getText();
            };
            RefUI.prototype.toExcel = function (options) {
                webix.toExcel(this.ref, options);
            };
            RefUI.prototype.get = function () {
                return this.ref;
            };
            return RefUI;
        }());
        UI.RefUI = RefUI;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var RefContainer = /** @class */ (function (_super) {
            __extends(RefContainer, _super);
            function RefContainer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RefContainer.prototype.getChildViews = function () {
                return this.ref.getChildViews();
            };
            RefContainer.prototype.collapse = function (collapse) {
                if (collapse === void 0) { collapse = true; }
                if (collapse)
                    this.ref.collapse();
                else
                    this.ref.expand();
            };
            return RefContainer;
        }(UI.RefUI));
        UI.RefContainer = RefContainer;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
         * base data container (form, template, ..)
         */
        var RefDataContainer = /** @class */ (function (_super) {
            __extends(RefDataContainer, _super);
            function RefDataContainer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /** load form values from the server */
            RefDataContainer.prototype.load = function (url, args) {
                //this.ref.load(url);
                var rq = It.Web.get(url, args);
                var data = rq.json();
                if (data && data.d && data.d.results)
                    data = data.d.results[0];
                if (!data)
                    return null;
                this.ref.setValues(data);
                if (this.ref.setDirty)
                    this.ref.setDirty(false);
                this.clearValidation();
                return data;
            };
            RefDataContainer.prototype.values = function (changed) {
                if (changed === void 0) { changed = false; }
                var vals;
                if (changed)
                    vals = this.ref.getDirtyValues(); // ??
                else
                    vals = this.ref.getValues(); // ??
                return vals;
            };
            /**
             * Присвоение данных с расширением текущих значений формы]
             */
            RefDataContainer.prototype.setValuesEx = function (vals) {
                if (!vals)
                    return;
                var vals0 = this.values(false);
                vals0 = webix.extend(vals0, vals, true);
                this.ref.setValues(vals0);
                return vals0;
            };
            RefDataContainer.prototype.setValues = function (vals) {
                this.ref.setValues(vals || {});
                return vals;
            };
            RefDataContainer.prototype.clearValidation = function () {
            };
            return RefDataContainer;
        }(UI.RefContainer));
        UI.RefDataContainer = RefDataContainer;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        // reference to the form
        var RefForm = /** @class */ (function (_super) {
            __extends(RefForm, _super);
            function RefForm(dataSource) {
                var _this = _super.call(this) || this;
                _this.dataSource = dataSource;
                return _this;
            }
            Object.defineProperty(RefForm.prototype, "elements", {
                /** список контролов */
                get: function () {
                    if (!this.ref)
                        return undefined;
                    return this.ref.elements;
                },
                enumerable: false,
                configurable: true
            });
            RefForm.prototype.enable = function (val, element) {
                var ref = element ? this.ref.elements[element] : this.ref;
                // ref.define('readonly', val ); 
                if (val)
                    ref.enable();
                else
                    ref.disable();
            };
            RefForm.prototype.visible = function (val, element) {
                var ref = element ? this.ref.elements[element] : this.ref;
                if (val)
                    ref.show();
                else
                    ref.hide();
            };
            //loadObject(id) {
            //    let url = this.dataSource.getUrl(id);
            //    return this.load(url);
            //}
            RefForm.prototype.clear = function (vals) {
                if (vals === void 0) { vals = {}; }
                this.ref.setValues(vals);
                if (this.ref.setDirty)
                    this.ref.setDirty(false);
                this.clearValidation();
            };
            RefForm.prototype.setElement = function (element, config) {
                if (typeof (element) == 'string')
                    element = this.elements[element];
                element.define(config);
                element.refresh();
            };
            ///** post all form values  */
            //post(url: string, args?) {
            //    let vals = this.values();
            //    let res = Data.post(url, vals);
            //    return res;
            //}
            ///** post form changes */
            //saveObject(id, setvals = true) {
            //    let url = this.dataSource.saveUrl(id);
            //    //let isPost = id ? false : true;
            //    //let res = this.save(url, isPost);
            //    let vals = this.values(true);
            //    let res = Data.put(url, vals);
            //    let allvals = this.values();
            //    webix.extend(allvals, res, true);
            //    if (setvals) {
            //        this.ref.setValues(allvals);
            //    }
            //    if (this.onSave) this.onSave(allvals);
            //    this.ref.setDirty(false);
            //    return allvals;
            //}
            /** post/put all form values */
            RefForm.prototype.save = function (url, ispost, args) {
                var vals = this.values();
                if (vals.collections) { // check databoom
                    delete vals.collections;
                }
                if (args)
                    webix.extend(vals, args, true);
                var res = (ispost) ? It.Web.post(url, vals).json() : It.Web.put(url, vals).json();
                if (!res)
                    return null; //error
                webix.extend(vals, res, true);
                this.ref.setValues(vals);
                //this.ref.save();
                if (this.onSave)
                    this.onSave(vals);
                this.ref.setDirty(false);
                return vals;
            };
            RefForm.prototype.isChanged = function () {
                return this.ref.isDirty();
            };
            /** clear changes, dirty = false */
            RefForm.prototype.clearChanges = function () {
                return this.ref.setDirty(false);
            };
            RefForm.prototype.validate = function (error) {
                if (error === void 0) { error = UI.coreLocale.Err.ValidationError; }
                var res = this.ref.validate();
                if (!res) {
                    //if (!error) error = ;
                    $u.w.error(error);
                }
                else
                    this.clearValidation();
                return res;
            };
            RefForm.prototype.clearValidation = function () {
                if (this.ref.clearValidation)
                    this.ref.clearValidation();
            };
            RefForm.prototype.config = function () {
                var cfg = new UI.Configs.FormConfig(this);
                return cfg;
            };
            return RefForm;
        }(UI.RefDataContainer));
        UI.RefForm = RefForm;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /** abstract view for grid & tree */
        var RefTable = /** @class */ (function (_super) {
            __extends(RefTable, _super);
            function RefTable() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RefTable.prototype.asEditAbility = function () {
                return this.get();
            };
            /**
             * add,delete, filter, count, ...  https://docs.webix.com/api__refs__datastore.html
             */
            RefTable.prototype.asDataStore = function () {
                return this.get();
            };
            RefTable.prototype.btnAdd_fn = function (vals, index) {
                var _this = this;
                if (UI.Configs.defaults.toolbarIcon)
                    return UI.icon("plus-circle").Click(function () { return _this.add(vals, index); }).Tooltip(UI.loc.Tooltips.Add);
                else
                    return UI.button(UI.loc.Controls.Add).Click(function () { return _this.add(vals, index); }).Tooltip(UI.loc.Tooltips.Add);
            };
            RefTable.prototype.btnAdd = function (value, index) {
                var _this = this;
                if (UI.Configs.defaults.toolbarIcon)
                    return UI.icon("plus-circle").Click(function () { return _this.add(value, index); }).Tooltip(UI.loc.Tooltips.Add);
                else
                    return UI.button(UI.loc.Controls.Add).Click(function () { return _this.add(value, index); }).Tooltip(UI.loc.Tooltips.Add);
            };
            ;
            RefTable.prototype.btnDel = function () {
                var _this = this;
                if (UI.Configs.defaults.toolbarIcon)
                    return UI.icon("minus-circle").Click(function () { return _this.delSelected(); }).Tooltip(UI.loc.Tooltips.Del);
                else
                    return UI.button(UI.loc.Controls.Del).Click(function () { return _this.delSelected(); }).Tooltip(UI.loc.Tooltips.Del);
            };
            ;
            RefTable.prototype.btnSave = function () {
                var _this = this;
                if (UI.Configs.defaults.toolbarIcon)
                    return UI.icon("save").Click(function () { return _this.save(); }).Tooltip(UI.loc.Tooltips.Save);
                else
                    return UI.button(UI.loc.Controls.Save).Click(function () { return _this.save(); }).Tooltip(UI.loc.Tooltips.Save);
            };
            ;
            RefTable.prototype.btnRefresh = function (onclick) {
                var _this = this;
                var click = onclick || (function () { return _this.refresh(); });
                if (UI.Configs.defaults.toolbarIcon)
                    return UI.icon("refresh").Click(click).Tooltip(UI.loc.Tooltips.Refresh);
                else
                    return UI.button(UI.loc.Controls.Refresh).Click(click).Tooltip(UI.loc.Tooltips.Refresh);
            };
            ;
            RefTable.prototype.textFilter = function (expr, label) {
                if (expr === void 0) { expr = "#value#"; }
                if (label === void 0) { label = ""; }
                var me = this;
                var search = $u.view("search").extend({
                    //view: ,
                    placeholder: label,
                    on: {
                        onTimedKeyPress: function () {
                            var text = this.getValue();
                            me.filterByExpr(expr, text);
                        }
                    }
                });
                return search;
            };
            /**
             * See: http://docs.webix.com/api__link__ui.datatable_filter.html
             * @param func
             */
            RefTable.prototype.filterByFunc = function (func) {
                this.ref.filter(func);
            };
            RefTable.prototype.filterByExpr = function (expr, text) {
                this.ref.filter(expr, text);
            };
            RefTable.prototype.getItems = function (filter) {
                if (filter === void 0) { filter = null; }
                return this.ref.data.find(filter);
            };
            //column(id: string) {
            //    let col = new Configs.ColumnConfig(this, id);
            //    return col;
            //}
            /**
             * get data processor
             */
            RefTable.prototype.data = function () {
                return webix.dp(this.id);
            };
            RefTable.prototype.callNoEvents = function (func) {
                var dp = this.data();
                try {
                    dp.off();
                    func();
                }
                catch (err) {
                    $u.w.error(err.message);
                }
                finally {
                    dp.on();
                }
            };
            RefTable.prototype.delSelected = function (ask) {
                if (ask === void 0) { ask = true; }
                if (ask && !confirm(UI.loc.Controls.DelAsk))
                    return false;
                //let grid = <any>$$(id);
                var ref = this.ref;
                var sel = ref.getSelectedId(true);
                if (!sel)
                    return;
                for (var i = 0; i < sel.length; i++) {
                    var id = sel[i]; // for list
                    if (id.row)
                        id = id.row; // for grids
                    ref.remove(id);
                }
                return true;
            };
            RefTable.prototype.getSelectedItem = function () {
                var item = this.ref.getSelectedItem();
                if (item instanceof Array && item.length)
                    item = item[0];
                //let item = this.ref.getItem(sel);
                return item;
            };
            RefTable.prototype.getSelectedId = function () {
                var id = this.ref.getSelectedId(false);
                return id;
            };
            RefTable.prototype.getSelectedItems = function () {
                var items = this.ref.getSelectedItem(true);
                return items;
            };
            RefTable.prototype.getSelectedIds = function () {
                var items = this.ref.getSelectedId(true);
                var ids = items.map(function (x) { return x.id || x; });
                return ids;
            };
            RefTable.prototype.getItem = function (id) {
                var item = this.ref.getItem(id);
                return item;
            };
            RefTable.prototype.containsFilter = function (col) {
                if (!this.ref._filter_elements)
                    return null;
                var filter = this.ref._filter_elements[col];
                return filter;
            };
            // url: http://forum.webix.com/discussion/3702/how-to-clear-all-filters
            RefTable.prototype.clearFilter = function () {
                var _this = this;
                var dtable = this.ref;
                if (!dtable.eachColumn)
                    return;
                dtable.eachColumn(function (col) {
                    if (!_this.containsFilter(col))
                        return;
                    var f = dtable.getFilter(col);
                    if (f && f.value)
                        f.value = "";
                });
            };
            RefTable.prototype.refresh = function (data) {
                if (data === void 0) { data = undefined; }
                var grid = this.ref;
                // clear
                if (data) {
                    if (grid.clearAll)
                        grid.clearAll();
                    else if (grid.data && grid.data.clearAll)
                        grid.data.clearAll(); // for pivots
                }
                // load
                if (data instanceof Array) {
                    grid.parse(data);
                }
                else if (typeof data == "string") {
                    var cfg = grid.config;
                    cfg.url = data;
                    grid.load(cfg.url);
                }
                else {
                    var cfg = this.ref.config;
                    if (cfg.url)
                        grid.load(cfg.url);
                    this.ref.refresh();
                }
                this.clearFilter();
                //webix.message("Данные перезачитаны с сервера");
                //webix.message(UI.loc.Msg.Reloaded);
            };
            RefTable.prototype.forEach = function (action) {
                var grid = this.ref;
                grid.eachRow(function (id) {
                    var row = grid.getItem(id);
                    action(row);
                });
            };
            RefTable.prototype.reload = function (data, idProp) {
                var table = this.ref;
                var _loop_2 = function (i) {
                    var vals = data[i];
                    var id = vals[idProp];
                    if (!id)
                        return "continue";
                    var item = table.find(function (obj) { return obj[idProp] == id; }, true);
                    if (!item)
                        return "continue";
                    table.updateItem(item.id, vals);
                };
                for (var i in data) {
                    _loop_2(i);
                }
            };
            RefTable.prototype.showItem = function (id) {
                this.ref.showItem(id);
            };
            RefTable.prototype.selectFirst = function () {
                var table = this.ref;
                this.select(table.getFirstId());
            };
            RefTable.prototype.selectLast = function () {
                var table = this.ref;
                this.select(table.getLastId());
            };
            RefTable.prototype.select = function (id) {
                if (!id)
                    return;
                var table = this.ref;
                //table.unselectAll();
                table.select(id, false);
                this.showItem(id);
            };
            RefTable.prototype.clearSelection = function () {
                var table = this.ref;
                if (table.clearSelection)
                    table.clearSelection();
                else if (table.select)
                    table.unselect(0);
            };
            RefTable.prototype.save = function () {
                var dp = webix.dp(this.id);
                dp.send();
                //webix.message("Данные обновлены");
            };
            RefTable.prototype.cancel = function () {
                var dp = webix.dp(this.id);
                dp.reset();
            };
            RefTable.prototype.add = function (vals, index, parentId) {
                var _this = this;
                if (vals === void 0) { vals = {}; }
                var newid = this.ref.add(vals, index, parentId);
                this.select(newid);
                setTimeout(function () { return _this.ref.refresh(newid); }, 800);
                return newid;
            };
            /**
             * сбрасывает курсор для связанных форм и позволяет создавать новую запись при сохранении
             */
            RefTable.prototype.bindNew = function () {
                this.ref.setCursor(null);
            };
            RefTable.prototype.updateCurrent = function (vals) {
                var row = this.getSelectedItem();
                if (!row)
                    return null;
                this.ref.updateItem(row.id, vals);
                return row;
            };
            RefTable.prototype.updateRow = function (id, vals) {
                var row = this.ref.updateItem(id, vals);
                return row;
            };
            RefTable.prototype.removeRow = function (id) {
                this.removeRows([id]);
            };
            RefTable.prototype.removeRows = function (ids) {
                //, blockDelete = false) {
                var table = this.ref;
                //if (blockDelete) {
                //    let dp = webix.dp(this.id);
                //    dp.off();
                //    for (let i = 0; i < ids.length; i++) {
                //        try {
                //            table.remove(ids[i]);
                //        }
                //        finally {
                //        }
                //    }
                //    dp.on();
                //}
                //else {
                for (var i = 0; i < ids.length; i++) {
                    table.remove(ids[i]);
                }
                //}
            };
            RefTable.prototype.scheme = function (vals) {
                this.ref.data.scheme(vals); // see: https://docs.webix.com/api__link__ui.datatable_scheme_config.html
                //let grid = this.ref;
                //let scheme = grid. grid.data.tf || grid.data._scheme; // TODO: need to change on update version
                //if (!scheme)
                //    grid.data.tf = vals;
                //else
                //    webix.extend(scheme, vals, true);
                //grid.define({ scheme: vals });
                //let scheme = grid.config.scheme;
            };
            RefTable.prototype.attachOnSelect = function (onselect) {
                var _this = this;
                this.ref.attachEvent("onAfterSelect", function (e) {
                    var row = _this.ref.getItem(e.id);
                    onselect(row);
                });
            };
            return RefTable;
        }(UI.RefUI));
        UI.RefTable = RefTable;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /** reference to the webix list */
        var RefCombo = /** @class */ (function (_super) {
            __extends(RefCombo, _super);
            function RefCombo() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RefCombo.prototype.getItems = function () {
                var combo = this.ref;
                var list = combo.getList();
                return list.config.data;
            };
            /**  get item by id, or selected item   */
            RefCombo.prototype.getItem = function (id) {
                if (!id)
                    id = this.getValue();
                if (!id)
                    return null;
                var list = this.ref.getList();
                var item = list.getItem(id);
                return item;
            };
            RefCombo.prototype.selectFirst = function () {
                var list = this.ref.getList();
                var id = list.getFirstId();
                if (!id)
                    return;
                this.select(id);
            };
            RefCombo.prototype.select = function (id) {
                this.ref.setValue(id);
            };
            RefCombo.prototype.skipSelection = function (skip) {
                var combo = this.ref;
                var list = combo.getList();
                var items = list.config.data; //this.bases;  //list.data.pull;
                //let id = next ? list.getNextId() : list.getPrevId();
                //if (!id) return;
                //list.select(id);
                var id = combo.getValue();
                var i = list.getIndexById(id);
                i += skip;
                if (i < 0 || i >= items.length)
                    return;
                var item = items[i];
                //let select = combo.select.ref;
                combo.setValue(item.id);
                combo.refresh();
            };
            return RefCombo;
        }(UI.RefUI));
        UI.RefCombo = RefCombo;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /** reference to the webix list */
        var RefList = /** @class */ (function (_super) {
            __extends(RefList, _super);
            function RefList() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RefList.prototype.config = function () {
                var config = new UI.Configs.ListConfig(this);
                return config;
            };
            return RefList;
        }(UI.RefTable));
        UI.RefList = RefList;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /*
         * reference to the webix dataview (template grid)
         */
        var RefDataView = /** @class */ (function (_super) {
            __extends(RefDataView, _super);
            function RefDataView() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RefDataView.prototype.config = function () {
                var config = new UI.Configs.DataViewConfig(this);
                return config;
            };
            return RefDataView;
        }(UI.RefTable));
        UI.RefDataView = RefDataView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
        * define popup (context) menu,
        *   + init(): attachTo(refui)
        */
        var RefMenu = /** @class */ (function (_super) {
            __extends(RefMenu, _super);
            function RefMenu() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * define & show context menu
             * item:  { value: "TEXT", icon: "plus", click: (obj,menu_item) => func(...) },
             */
            RefMenu.prototype.configCtxMenu = function (items) {
                var cfg = UI.view("contextmenu").Ref(this).extend({
                    //width: 200,
                    data: items,
                    on: {
                        onItemClick: function (id) {
                            var context = this.getContext();
                            var list = context.obj;
                            var listId = context.id;
                            var item = list.getItem(listId);
                            var mitem = this.getItem(id);
                            if (mitem && mitem.click)
                                mitem.click(item || listId, mitem);
                            //webix.message("List item: <i>" + item.name + "</i> <br/>Context menu item: <i>" + mitem.value + "</i>");
                        },
                    },
                });
                //webix.ui(cfg);
                return cfg;
            };
            RefMenu.prototype.attachTo = function (control) {
                this.ref.attachTo(control.ref);
            };
            return RefMenu;
        }(UI.RefUI));
        UI.RefMenu = RefMenu;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /** reference to the webix grid */
        var RefGrid = /** @class */ (function (_super) {
            __extends(RefGrid, _super);
            function RefGrid() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RefGrid.prototype.config = function () {
                var config = new UI.Configs.GridConfig(this);
                return config;
            };
            RefGrid.prototype.clearSelection = function () {
                this.ref.clearSelection();
            };
            RefGrid.prototype.adjustRowHeight = function (column) {
                // https://docs.webix.com/api__ui.datatable_adjustrowheight.html
                this.ref.adjustRowHeight(column);
            };
            RefGrid.prototype.importFromCSV = function (config) {
                var win = new UI.RefUI();
                var me = this;
                UI.showView({
                    view: "window", move: true, width: 700, height: 400,
                    id: win.id,
                    head: {
                        view: "toolbar", margin: -4, cols: [
                            UI.label(UI.loc.Excel.Insert),
                            UI.button(UI.loc.Excel.Schema).Click(showScheme),
                            UI.button(UI.loc.Excel.InsertLabel).Click(importCSV),
                            {},
                            UI.icon("times-circle").Click(close),
                        ]
                    },
                    modal: true,
                    position: "center",
                    body: {
                        view: "textarea", placeholder: UI.loc.Excel.Label,
                    }
                });
                function showScheme() {
                    //let sh = JSON.stringify(config, null, 2);
                    var sh = "Key\n\t".concat(config.key, "\ncolumns:");
                    for (var i in config.columns) {
                        var col = config.columns[i];
                        if (col.name)
                            sh += "\n\t".concat(col.name, ":").concat(col.type);
                    }
                    UI.alert(sh);
                }
                function importCSV() {
                    var body = win.ref.getBody();
                    var csv = body.getValue();
                    me.importTableFromCSV(config, csv);
                }
                function close() {
                    win.ref.close();
                }
            };
            /**
             *
             * @param config - схема конфигурации колонок]
             * @param csv - csv текст
             */
            RefGrid.prototype.importTableFromCSV = function (config, csv) {
                if (!csv)
                    return;
                var rows = webix.csv.parse(csv);
                //let table: any = $$(config.tableid);
                var cols = config.columns;
                var table = this.ref;
                var _loop_3 = function (i) {
                    var vals = rows[i];
                    if (vals.join('').replace(' ', '') !== '') {
                        var data = config.data ? webix.copy(config.data) : {};
                        for (var k = 0; k < vals.length; k++) {
                            var col = cols[k];
                            if (col.import === false)
                                continue;
                            var v = vals[k];
                            if (col.type == "float")
                                v = parseFloat(v.replace(',', '.'));
                            if (col.type == "int")
                                v = parseInt(v);
                            data[col.name] = v;
                        }
                        if (config.key) { // если задано ключевое поле
                            var keyval_1 = data[config.key];
                            if (keyval_1) {
                                var finds = table.find(function (r) { return r[config.key] === keyval_1; });
                                if (finds && finds.length > 0) {
                                    var rec = finds[0];
                                    //webix.extend(rec, data, true);
                                    table.updateItem(rec.id, data);
                                    return "continue";
                                }
                            }
                        }
                        table.add(data);
                    }
                };
                for (var i = 0; i < rows.length; i++) {
                    _loop_3(i);
                }
                webix.message(UI.loc.Excel.ResultLabel);
            };
            RefGrid.prototype.exportToCSV = function (scheme) {
                var table = this.ref;
                //let cols = table.columns();
                //let tt = table;
                //let sels = table.getSelectedItem(true);
                //let gg = table.getText(sel, "ProductId");
                var text = this.getExportCSV(table, scheme);
                UI.showView({
                    view: "window", move: true, width: 700, height: 400,
                    id: "exportWindow",
                    head: {
                        view: "toolbar", margin: -4, cols: [
                            { view: "label", label: UI.loc.Excel.Help },
                            { view: "icon", icon: "times-circle", click: "$$('exportWindow').close();" }
                        ]
                    },
                    modal: true,
                    position: "center",
                    body: {
                        view: "textarea", placeholder1: UI.loc.Excel.Label, value: text,
                    }
                });
            };
            RefGrid.prototype.exportToFileCSV = function (scheme) {
                var table = this.ref;
                var csv = this.getExportCSV(table, scheme, ";");
                //let csvContent = "data:text/csv;charset=utf-8,";
                //let encodedUri = encodeURI(csvContent + csv);
                //window.open(encodedUri);
                It.Web.download(csv, 'csv file.csv', 'text/csv'); //text/csv
                //let a = document.createElement('a');
                //a.innerHTML = "Click here";
                //a.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
                //a.target = '_blank';
                //(<any>a).download = 'myFile.csv';
                //document.body.appendChild(a);
                //a.click();
                //document.body.removeChild(a);
            };
            RefGrid.prototype.getExportCSV = function (table, scheme, separator) {
                if (separator === void 0) { separator = '\t'; }
                var resrows = [];
                var cells = [];
                for (var i in scheme.columns) {
                    var col = scheme.columns[i];
                    cells.push(col.name);
                }
                var cell_res = cells.join(separator);
                resrows.push(cell_res);
                table.eachRow(function (id) {
                    cells = [];
                    var cols = scheme.columns;
                    cols.forEach(function (col) {
                        //let col = scheme.columns[i];
                        var val = table.getText(id, col.name);
                        if (col.type == 'float') {
                            val = (val + '').replace(',', '').replace('.', ',');
                        }
                        if (col.type == 'int') {
                            val = '' + (val | 0);
                        }
                        //let vv = table.getText(id, col.name);
                        cells.push(val);
                    });
                    var cell_res = cells.join(separator);
                    resrows.push(cell_res);
                });
                var text = resrows.join("\n");
                return text;
            };
            return RefGrid;
        }(UI.RefTable));
        UI.RefGrid = RefGrid;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /** reference to the webix tree */
        var RefTree = /** @class */ (function (_super) {
            __extends(RefTree, _super);
            function RefTree() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RefTree.prototype.asTreeStore = function () {
                return this.get();
            };
            RefTree.prototype.asTreeList = function () {
                return this.get();
            };
            RefTree.prototype.asTreeAPI = function () {
                return this.get();
            };
            RefTree.prototype.configTree = function () {
                var config = new UI.Configs.TreeConfig(this);
                return config;
            };
            RefTree.prototype.configTreeTable = function () {
                var config = new UI.Configs.TreeTableConfig(this);
                return config;
            };
            RefTree.prototype.btnAddTop = function () {
                var _this = this;
                return UI.icon("plus").Click(function () { return _this.addTop(); }).Tooltip(UI.loc.Tooltips.AddTop);
            };
            ;
            RefTree.prototype.btnAddSub = function () {
                var _this = this;
                return UI.icon("plus-circle").Click(function () { return _this.addSub(); }).Tooltip(UI.loc.Tooltips.AddSub);
            };
            ;
            RefTree.prototype.btnExpand = function () {
                var _this = this;
                return $u.icon("plus-square-o").Click(function () { return _this.expand(_this.getSelectedId()); }).Tooltip(UI.loc.Tooltips.Expand);
            };
            ;
            RefTree.prototype.btnCollapse = function () {
                var _this = this;
                return $u.icon("minus-square-o").Click(function () { return _this.collapse(_this.getSelectedId()); }).Tooltip(UI.loc.Tooltips.Collapse);
            };
            ;
            RefTree.prototype.expand = function (id) {
                var tree = this.ref;
                if (!id)
                    tree.openAll();
                else {
                    tree.open(id);
                    tree.data.eachSubItem(id, function (obj) { return tree.open(obj.id); });
                }
            };
            RefTree.prototype.collapse = function (id) {
                var tree = this.ref;
                if (!id)
                    tree.closeAll();
                else {
                    tree.close(id);
                    tree.data.eachSubItem(id, function (obj) { return tree.close(obj.id); });
                }
            };
            RefTree.prototype.getParentId = function (obj) {
                if (!obj.$parent)
                    return null;
                var row = obj.$parent.row;
                if (!row)
                    row = obj.$parent;
                var parentItem = this.ref.getItem(row);
                return parentItem.id;
            };
            RefTree.prototype.setOrder = function (order) {
                //this.ref.data._scheme.order = order;
                this.scheme({ order: order, index: order });
            };
            /**
             * Обновляет индексы текущей ветви
             * @param id
             */
            RefTree.prototype.reindex = function (id, current) {
                var tree = this.ref;
                var i = 0;
                tree.data.eachChild(id, function (obj) {
                    if (obj.$index != i || current && obj.id == current) {
                        obj.$index = i;
                        tree.updateItem(obj.id, obj);
                    }
                    i++;
                });
            };
            RefTree.prototype.addTop = function (item) {
                if (item === void 0) { item = this.create(); }
                //if(tree===undefined || !tree) tree = $$(treeid);
                //let tree: any = $$(id);
                var tops = this.ref.data.getTopRange();
                var i = 0;
                if (tops.length > 0) {
                    var lastTop = tops[tops.length - 1];
                    i = lastTop.index + 1;
                }
                ;
                this.setOrder(i);
                var res = this.ref.add(item, -1);
            };
            RefTree.prototype.addSub = function (item, parentId) {
                if (item === void 0) { item = this.create(); }
                var tree = this.ref;
                if (!parentId)
                    parentId = tree.getSelectedId();
                var res;
                if (parentId) {
                    var parent_1 = tree.getItem(parentId);
                    this.setOrder(parent_1.$count);
                    if (!parent_1.$count)
                        parent_1.open = true;
                    res = tree.add(item, -1, parentId);
                    //let newid = tree.add(create(), -1, parent.id);
                    //let newitem = tree.getItem(newid);
                    //newitem.index = parent.$count;
                    //tree.updateItem(newid, newitem);
                    ////ref.refresh(parentId);
                }
                else
                    res = this.addTop(item);
                //tree.add(create(), -1);
                //tree.data._scheme.order	= me.index++;
                return res;
            };
            /**
             * gets index of the node in a specific branch
             * https://docs.webix.com/api__link__ui.tree_getbranchindex.html
             */
            RefTree.prototype.getBranchIndex = function (id, parentId) {
                return this.ref.getBranchIndex(id, parentId);
            };
            RefTree.prototype.create = function () {
                return {};
            };
            /**
             * Сдвиг уровня влево (уменьшение)
             */
            RefTree.prototype.shiftLeft = function (item) {
                if (!item.$parent)
                    return webix.message('Достигнут верхний уровень');
                var parent = this.getItem(item.$parent);
                var treelist = this.asTreeList();
                var idx = treelist.getBranchIndex(parent.id, parent.$parent) + 1;
                treelist.move(item.id, idx, undefined, { parent: parent.$parent });
                this.updateRow(item.id, { $parent: parent.$parent, $index: parent.$index + 1, });
            };
            /**
             * Сдвиг уровня вправо (Увеличение)
             */
            RefTree.prototype.shiftRight = function (item) {
                var prevId = this.get().getPrevSiblingId(item.id);
                if (!prevId)
                    return webix.message('Нет предыдущего элемента');
                this.asTreeList().move(item.id, -1, undefined, { parent: prevId });
                this.updateRow(item.id, { $parent: prevId, $index: 0, });
                this.expand(prevId);
            };
            /**
             * Активация редактора текста элемента
             */
            RefTree.prototype.edit = function (id) {
                this.asEditAbility().edit(id);
            };
            return RefTree;
        }(UI.RefTable));
        UI.RefTree = RefTree;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /** Окно, обязательно вызывать config(viewCfg)   */
        var RefWin = /** @class */ (function (_super) {
            __extends(RefWin, _super);
            function RefWin(head) {
                if (head === void 0) { head = UI.loc.Controls.Window; }
                var _this = _super.call(this) || this;
                _this.head = head;
                _this.modal = true;
                _this.move = true;
                _this.resize = true;
                _this.position = "center";
                _this.headerLabel = new UI.RefUI();
                return _this;
                //if (viewConfig) this.config(viewConfig);
            }
            RefWin.prototype.config = function (viewConfig) {
                var _this = this;
                //this.viewConfig = viewConfig;
                var cfg = {
                    view: "window",
                    id: this.id,
                    head: {
                        view: "toolbar", margin: -4, cols: [
                            { view: "label", label: this.head, id: this.headerLabel.id, },
                            { view: "icon", icon: "times-circle", click: function () { return _this.hide(); } },
                        ]
                    },
                    modal: this.modal,
                    move: this.move,
                    position: this.position,
                    resize: this.resize,
                    body: viewConfig,
                };
                this.cfg = cfg;
                return cfg;
            };
            RefWin.prototype.setHead = function (head) {
                this.headerLabel.set({ label: head });
            };
            RefWin.prototype.show = function (head) {
                if (!this._ref) {
                    this._ref = webix.ui(this.cfg);
                }
                this._ref.show();
                if (head)
                    this.setHead(head);
            };
            RefWin.prototype.hide = function () {
                if (this.onHide)
                    this.onHide();
                this.ref.hide();
            };
            return RefWin;
        }(UI.RefContainer));
        UI.RefWin = RefWin;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        // reference to the form
        var RefTemplate = /** @class */ (function (_super) {
            __extends(RefTemplate, _super);
            function RefTemplate() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            //constructor() {
            //    super(); 
            //}
            /**
             * template source
             * @param template - url (http->) or html string
             */
            RefTemplate.prototype.config = function (template, data) {
                var cfg = new UI.Configs.FormConfig(this);
                cfg.view = "activeTemplate";
                cfg.template = template;
                if (data)
                    cfg.data = data;
                return cfg;
            };
            return RefTemplate;
        }(UI.RefDataContainer));
        UI.RefTemplate = RefTemplate;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        // reference to the form
        var RefHtmlForm = /** @class */ (function (_super) {
            __extends(RefHtmlForm, _super);
            /**
             * template source
             * @param template - url (http->) or html string
             */
            function RefHtmlForm(template) {
                var _this = _super.call(this) || this;
                _this.template = template;
                return _this;
            }
            RefHtmlForm.prototype.config = function () {
                var cfg = new UI.Configs.FormConfig(this);
                cfg.view = "activeHtmlForm";
                cfg.template = this.template;
                return cfg;
            };
            return RefHtmlForm;
        }(UI.RefForm));
        UI.RefHtmlForm = RefHtmlForm;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//declare let routie; 
var It;
(function (It) {
    var UI;
    (function (UI) {
        var _webix = webix;
        //export let Core = It;
        //export let Web = It.Web;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var $u = It.UI;
var It;
(function (It) {
    var UI;
    (function (UI) {
        function getVisibleMenuTree(menu) {
            var filter = function (x) { return x.visible == undefined || x.visible === true; };
            var data = menu.filter(filter);
            var res = [];
            menu.forEach(function (item) {
                if (item.data && item.visible) {
                    item.data = item.data.filter(filter);
                    item.visible = item.data && item.data.length > 0;
                }
                if (item.visible || item.visible == undefined)
                    res.push(item);
            });
            return res;
        }
        UI.getVisibleMenuTree = getVisibleMenuTree;
        /**
        * Иерархическое меню в виде панели bar
        */
        function sidebarMenu(menu) {
            var rsidebar = new UI.RefTree();
            var button = UI.icon("bars").Size(37).Css("app_button").Click(function (x) { return rsidebar.ref.toggle(); });
            var sidebar = rsidebar.configTree().extend({
                view: "sidebar",
                data: getVisibleMenuTree(menu),
                button: button,
            });
            return sidebar;
        }
        UI.sidebarMenu = sidebarMenu;
        /**
         * Кнопка
         */
        function sidebarButton(sidebar) {
            return sidebar.button;
        }
        UI.sidebarButton = sidebarButton;
        /**
        * Иерархическое меню в виде дерева
        * {url, value, description, data: [] }
        */
        function treeMenu(menu, navigator, bar) {
            var tree = {
                //width: 200,
                tooltip: { template: "<b>#value#</b><hr/> #description#" },
                //template: "{common.icon()} {common.folder()}<a href='#url#'>#value#</a>",
                template: "{common.icon()} {common.folder()} #value#",
            };
            var reftree = new UI.RefTree();
            // вызывается при клике
            function onChangeSelection(id) {
                var id1 = parseInt(id);
                //let rtree = tree.ref;
                var item = reftree.getItem(id);
                if (!item)
                    return;
                if (bar)
                    bar.set({ data: item, label: "<b>".concat(item.value, "</b>: ").concat(item.description) });
                if (!navigator || !item.module)
                    return;
                navigator.open({ module: item.module, view: item.view, oid: item.objid });
                //document.title = item.value;
            }
            var data = getVisibleMenuTree(menu);
            var cfg = reftree.configTree()
                //.extend(tree)
                .extend({
                data: data,
                select: true,
                multiselect: false,
                //autoheight: false,
                on: {
                    onAfterSelect: onChangeSelection,
                }
            });
            return cfg;
        }
        UI.treeMenu = treeMenu;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
        * Класс для управления навигацией и роутингом в приложении
        */
        var Navigator = /** @class */ (function () {
            function Navigator() {
                //constructor(private module?: string) {
                //}
                this.view = new UI.MultiView();
                //bar: RefUI;
                this.defaultView = "default";
            }
            //onNavigate: action<any>
            //addBar(bar?) {
            //    if (!bar)
            //        bar = { view: "label", label: "Выберите пункт меню", css: "header-nav" };
            //    this.bar = bar;
            //}
            Navigator.prototype.open = function (args) {
                if (!args.view)
                    args.view = this.defaultView;
                if (location.hash) {
                    var hashArgs = It.Web.parseUrlQuery(location.hash);
                    webix.extend(args, hashArgs, true);
                }
                var key = args.key;
                if (!key)
                    key = "".concat(args.module, ".").concat(args.view); //args.oid
                var res = this.view.open(key, args);
                // fire navigation event
                //if (this.onNavigate) this.onNavigate(args);
            };
            Navigator.prototype.close = function () {
                this.view.close();
                window.history.back();
            };
            Navigator.prototype.$deactivate = function () {
                if (this.view)
                    this.view.$deactivate();
            };
            /**
             * register default module for routing
             * @param module
             */
            Navigator.prototype.routers = function (module) {
                //let lastUrl: any = {};
                var lastUrl = "";
                var me = this;
                function _open(module, view, oid) {
                    if (view === void 0) { view = ""; }
                    if (oid === void 0) { oid = 0; }
                    var args = It.Web.parseUrlQuery(location.hash);
                    delete args.view;
                    //delete args.oid;
                    delete args.module;
                    var url = "".concat(module, ":").concat(view, ":").concat(oid, ":").concat(JSON.stringify(args));
                    if (lastUrl == url)
                        return;
                    lastUrl = url;
                    //if (url == lastUrl) return;
                    //lastUrl = url;
                    me.open({ module: module, view: view, oid: oid });
                }
                routie('!/:module/:view/:oid', function (module, view, oid) {
                    if (oid == "null")
                        oid = null;
                    _open(module, view, oid);
                });
                routie('!/:module/:view', function (module, view) {
                    _open(module, view);
                });
                routie('!/:module', function (module) {
                    _open(module);
                });
                routie('*', function () {
                    _open(module);
                });
            };
            return Navigator;
        }());
        UI.Navigator = Navigator;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        function createModuleView(module, typeid) {
            //let viewclass: any = window[module][viewname];
            //let viewObj = new viewclass;
            module = module.trim();
            var moduleRef = window[module];
            if (!moduleRef)
                throw new Error("module ".concat(module, " not found"));
            var ctor = moduleRef["create"];
            if (!ctor)
                throw new Error("".concat(module, ".create() function not found"));
            var f = ctor[typeid];
            var obj = f ? f() : ctor(typeid);
            if (!obj)
                throw new Error("".concat(module, ".create() returns null for type: ").concat(typeid));
            return obj;
        }
        UI.createModuleView = createModuleView;
        function getViewLink(module, content, id, view) {
            if (content === void 0) { content = Symbols.pencil; }
            if (id === void 0) { id = "#id#"; }
            if (view === void 0) { view = "edit"; }
            var href = (id.indexOf('#') >= 0) ? "{common.href}/" : UI.Configs.HREF_PREFIX + "/";
            var res = content.link(href + module + "/" + view + "?oid=" + id);
            return res;
        }
        UI.getViewLink = getViewLink;
        function getLink(content, url) {
            if (content === void 0) { content = Symbols.pencil; }
            var href = (url.indexOf('#') >= 0) ? "{common.href}/" : UI.Configs.HREF_PREFIX + "/";
            var res = content.link(href + url);
            return res;
        }
        UI.getLink = getLink;
        function openView(nav, args, isNew) {
            if (isNew === void 0) { isNew = false; }
            var url = "".concat(UI.Configs.HREF_PREFIX, "/").concat(nav.module);
            if (nav.view)
                url += "/".concat(nav.view);
            if (nav.oid)
                url += "/".concat(nav.oid);
            It.Web.openUrl(url, args, isNew);
        }
        UI.openView = openView;
        // улетела в config.ts
        //export function popup(config, width?: number, height?: number) {
        //    let popup = webix.ui({
        //        view: "popup",
        //        width: width,
        //        height: height,
        //        resize: true,
        //        body: config,
        //    });
        //    return popup;
        //}
        //  return ui config where view in window
        function uidialog(viewCfg, head, modal, move) {
            if (head === void 0) { head = UI.loc.Controls.Window; }
            if (modal === void 0) { modal = true; }
            if (move === void 0) { move = true; }
            var win = new $u.RefWin(head).config(viewCfg);
            return win;
        }
        UI.uidialog = uidialog;
        /**
         * Вызов события Action, для корректной передачи this  и Id текущего элемента
         * @param f
         */
        function callActiveContent(f) {
            return function () {
                var item_id = this.config.$masterId;
                f(item_id);
            };
        }
        UI.callActiveContent = callActiveContent;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
         * Класс для управления множеством UI элементов
         * ОСнова для StateMachine, UILogic
         */
        var UIManager = /** @class */ (function () {
            function UIManager() {
                this.refs = [];
                //editable(state, editable: boolean) {
                //    let ui = this.ref(state, false);
                //    if (ui)
                //        ui.(editable);
                //}
            }
            UIManager.prototype.ref = function (state, autocreate) {
                if (autocreate === void 0) { autocreate = true; }
                var ref = this.refs[state];
                if (!ref && autocreate) {
                    ref = new UI.RefUI();
                    this.refs[state] = ref;
                }
                return ref;
            };
            UIManager.prototype.visible = function (state, visible) {
                var ui = this.ref(state, false);
                if (ui)
                    ui.visible(visible);
            };
            UIManager.prototype.enable = function (state, enable) {
                var ui = this.ref(state, false);
                if (ui)
                    ui.enable(enable);
            };
            return UIManager;
        }());
        UI.UIManager = UIManager;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        UI.css = {
            //test: { 'border-width': '1px', 'border-style': 'double', 'background-color': 'red' },
            /* Samples:
              position: relative;
              top: 0px;
              left: 0px;
              right: 0px;
              bottom: 0px;
              height: auto;
              width: 440px;
              padding: 23px 15px 15px 27px;
              margin: 22px auto 0px auto;
              display: block;
              background: #FFFFFF;
              background-image: url('./summer.jpg');
              color: #000000;
    
            f*/
            table: {
                table: { display: 'table', },
                row: { display: 'table-row', },
                cell: { display: 'table-cell', }, // cell
            },
            overflow: {
                auto: { overflow: 'auto', },
                hidden: { overflow: 'hidden', },
                visible: { overflow: 'visible', },
                scroll: { overflow: 'scroll', },
            },
            pos: {
                //margin: function (n: number) { return { margin: n + 'px' } },
                margin: function (n) { return ({ margin: n + 'px' }); },
                padding: function (n) { return ({ margin: n + 'px' }); },
                marginp: function (n) { return ({ margin: n + '%' }); },
                paddingp: function (n) { return ({ margin: n + '%' }); },
                // https://learn.javascript.ru/position
                relative: { position: 'relative' },
                absolute: { position: 'absolute' },
                fixed: { position: 'fixed' },
                //float: {  //https://learn.javascript.ru/float
                left: { float: 'left' },
                right: { float: 'right' },
                clear_left: { clear: 'left' },
                clear_right: { clear: 'right' },
                clear_both: { clear: 'both' },
                //display: {
                none: { display: 'none', },
                flex: { display: '-webkit-flex flex', },
                inline: { display: 'inline-block' }, // https://learn.javascript.ru/display
            },
        };
        var _STYLES = 1;
        /**
         * Получаем CSS стиль по его объектному описанию
         */
        function getCssStyle(style) {
            if (!style)
                return '';
            if (typeof style === 'string')
                return style;
            if (!style.$css) {
                style.$css = webix.html.createCss(style);
                //let cssargs = It.args2style(style);
                //style.$css = `_S${HtmlTag._STYLES++}`;
                //let css = `.${style.$css} { ${cssargs} }`;
                //webix.html.addStyle(css);
            }
            return style.$css;
        }
        UI.getCssStyle = getCssStyle;
        /**
         * Переопределение существующего стиля, напр:  setCssStyle('.mylist .webix_dataview_item', { margin: '0px', border: 0 });
         */
        function setCssStyle(style) {
            var styles = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                styles[_i - 1] = arguments[_i];
            }
            var stylesObj = {};
            styles.forEach(function (s) { return webix.extend(stylesObj, s, true); });
            var stylesStr = It.Web.args2style(stylesObj);
            var css = "".concat(style, " { ").concat(stylesStr, " }");
            webix.html.addStyle(css);
        }
        UI.setCssStyle = setCssStyle;
        function html(tag, attrs) {
            var h = new HtmlTag().tag(tag).attr(attrs);
            return h;
        }
        UI.html = html;
        var HtmlTag = /** @class */ (function () {
            function HtmlTag() {
                this._tag = "div";
            }
            HtmlTag.prototype.tag = function (name, attrs) {
                if (!name)
                    return this;
                this._checkRaw();
                this._tag = name;
                this.attr(attrs);
                return this;
            };
            HtmlTag.prototype.text = function (text) {
                if (!text)
                    return this;
                this._checkRaw();
                this._text = text;
                return this;
            };
            HtmlTag.prototype.attr = function (attrs) {
                if (!attrs)
                    return this;
                this._checkRaw();
                if (!this._attrs)
                    this._attrs = attrs;
                else
                    this._attrs = webix.extend(this._attrs, attrs, true);
                return this;
            };
            /**
             * Задание inline стилея через список стилевых объектов
             */
            HtmlTag.prototype.style = function () {
                var styles = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    styles[_i] = arguments[_i];
                }
                if (!styles)
                    return this;
                this._checkRaw();
                var style = this._style || {};
                styles.forEach(function (istyle) {
                    webix.extend(style, istyle, true);
                });
                this._style = style;
                return this;
            };
            ///**
            // * стиль, м.б. задан как строкой, так и аттрибутами объекта (в этом случае стиль создается автоматически)
            // */
            //class(style: string) {
            //    this._class = style;
            //    return this;
            //}
            /**
             * стиль, м.б. задан как строкой, так и аттрибутами объекта (в этом случае стиль создается автоматически)
             */
            HtmlTag.prototype.css = function () {
                var _this = this;
                var styles = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    styles[_i] = arguments[_i];
                }
                this._checkRaw();
                this._class = this._class || '';
                styles.forEach(function (style) {
                    _this._class += getCssStyle(style) + ' ';
                });
                return this;
            };
            HtmlTag.prototype.raw = function (html) {
                this._raw = html;
                return this;
            };
            /**
             * Добавляем вложенные теги
             */
            HtmlTag.prototype.tags = function () {
                var tags = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    tags[_i] = arguments[_i];
                }
                this._checkRaw();
                this._tags = this._tags || [];
                this._tags = this._tags.concat(tags);
                return this;
            };
            HtmlTag.prototype.toHtml = function () {
                // array.join is slowly https://stackoverflow.com/questions/51185/are-javascript-strings-immutable-do-i-need-a-string-builder-in-javascript
                //    let strings = [];
                //    this.build(strings);
                //    let res = strings.join('');
                //    return res;
                //}
                //private build( htmls: string[] ) {
                //    //htmls = htmls || [];
                if (this._raw)
                    return this._raw;
                //if (!this._tag) return this;
                var attr = this._attrs ? " " + It.Web.args2attr(this._attrs) : "";
                var style = this._style ? " style=\"".concat(It.Web.args2style(this._style), "\"") : "";
                var cls = this._class ? " class='".concat(this._class, "'") : "";
                var res = "<".concat(this._tag).concat(attr).concat(cls).concat(style, ">").concat(this._text || "");
                if (this._tags) {
                    this._tags.forEach(function (x) { return res += x.toHtml(); });
                }
                res += "</".concat(this._tag, ">");
                return res;
            };
            HtmlTag.prototype.div = function (attrs) {
                this._checkRaw();
                return this.tag("div", attrs);
            };
            HtmlTag.prototype._checkRaw = function () {
                if (this._raw)
                    $u.w.error("Raw html conflict with tag args, use .text()");
            };
            return HtmlTag;
        }());
        UI.HtmlTag = HtmlTag;
        //let h = html("", { id: "q1" }).class("mark").style({width:'120px', float: 'left' }).text("Long text").tags(
        //    html().text("Mary"),
        //    html().text("John"),
        //);
        //let hh = h.toHtml();
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        // top view for main forms
        var View = /** @class */ (function () {
            function View(_owner) {
                this._owner = _owner;
                this.objectId = "undefined";
                this.first = true;
                this.active = false;
                this._views = new Array();
                if (_owner)
                    _owner._views.push(this);
            }
            View.prototype.$config = function () {
                return { template: "$config is empty!!", css: "it-error" }; // предупреждаем об отсутствии $config
            };
            View.prototype.$init = function () {
                //return { header: "Форма меню" };
                this._views.forEach(function (v) { return v.$init(); });
            };
            View.prototype.owner = function (owner) {
                this._owner = owner;
                owner._views.push(this);
                return this;
            };
            /** Вызывается при повторной активации представления  */
            View.prototype.$activate = function (args) {
                if (!this._owner) { // парсим аргументы, только если не в составе контейнера
                    this.parseId(args);
                }
                this._views.forEach(function (v) { return v.$activate(args); });
                if (this.onactivate)
                    this.onactivate(args);
                this.active = true;
            };
            View.prototype.$deactivate = function () {
                this._views.forEach(function (v) { return v.$deactivate(); });
                this.active = false;
            };
            View.prototype.parseId = function (args) {
                this.args = args;
                if (args) { // && args.oid) {
                    //this.objectId = parseInt(args.oid);
                    if (this.objectId != args.oid)
                        this.$reload(args.oid);
                }
            };
            View.prototype.$reload = function (id) {
                this.objectId = id;
            };
            View.prototype.show = function (args) {
                var config = this.$config();
                webix.ui(config);
                return this;
            };
            View.prototype._getUrlArgs = function () {
                var args = webix.copy(this.args);
                delete args.view;
                delete args.oid;
                delete args.module;
                return args;
            };
            //createWindow(header?: string, onhide?: callback): RefWin {
            //    this.win = new RefWin(header);
            //    this.onclose = () => this.win.hide();
            //    this.win.config(this.config());
            //    if (onhide) this.win.onHide = onhide;
            //    return this.win;
            //}
            View.prototype.openWindow = function () {
                this.win.show();
            };
            View.Empty = { height: 1 };
            return View;
        }());
        UI.View = View;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
        * Текстовое представление
        */
        var TextEditView = /** @class */ (function (_super) {
            __extends(TextEditView, _super);
            function TextEditView(text) {
                var _this = _super.call(this) || this;
                _this.text = text;
                return _this;
            }
            TextEditView.prototype.$config = function () {
                var cfg = {
                    template: this.text,
                };
                return cfg;
            };
            return TextEditView;
        }(UI.View));
        UI.TextEditView = TextEditView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
          * base view for selectors,
          * usage: $.icon("xxx").Click(() => this.setView(viewArgs)).Tooltip("xxxxxxxxx"),
          */
        var SelectorView = /** @class */ (function (_super) {
            __extends(SelectorView, _super);
            function SelectorView() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.navigator = new UI.Navigator();
                return _this;
            }
            SelectorView.prototype.$reload = function (id) {
                _super.prototype.$reload.call(this, id);
                //this.selector.select({ oid: this.objectId });
            };
            SelectorView.prototype.$deactivate = function () {
                _super.prototype.$deactivate.call(this);
                if (this.currentView && this.currentView.obj)
                    this.currentView.obj.$deactivate();
                this.navigator.$deactivate();
            };
            SelectorView.prototype.setView = function (args, id) {
                //this.view = this.selector.setView(args, id || this.objectId);
                this.current = args;
                return this.select({ oid: id });
            };
            //setView(args: $.INavigateArgs, id): any {
            //    this.current = args;
            //    return this.select({ oid: id });
            //}
            SelectorView.prototype.select = function (args) {
                if (!args)
                    return;
                args = webix.extend(args, this.current, true);
                var key = args.module + "." + args.view;
                this.currentView = this.navigator.view.open(key, args); ////{ module: args.module, view: args.view, oid: id });
                return this.currentView;
            };
            return SelectorView;
        }(UI.View));
        UI.SelectorView = SelectorView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
             * class for tree editors
             * need to override menu()
             */
        var TreeEditView = /** @class */ (function (_super) {
            __extends(TreeEditView, _super);
            function TreeEditView() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.tree = new UI.RefTree();
                _this.views = new UI.MultiView();
                //header = new RefUI();
                _this.settings = {
                    width: 250,
                };
                return _this;
            }
            TreeEditView.prototype.$config = function () {
                _super.prototype.$config.call(this);
                var me = this;
                var menu_data = this.menu();
                var cfg = {
                    template: "My Profile",
                    borderless: true,
                    cols: [
                        this.configTree(menu_data),
                        { view: "resizer" },
                        this.views.$config(),
                    ],
                };
                return cfg;
            };
            TreeEditView.prototype.$init = function () {
                this.tree.expand();
                return _super.prototype.$init.call(this);
            };
            TreeEditView.prototype.configTree = function (data) {
                var me = this;
                var treeCfg = {
                    view: "tree",
                    id: me.tree.id,
                    width: me.settings.width,
                    select: true,
                    navigation: true,
                    data: data,
                    on: {
                        onAfterSelect: function (id) { return me.onChangeTopic(id); },
                    }
                };
                return treeCfg;
            };
            TreeEditView.prototype.$activate = function (args) {
                _super.prototype.$activate.call(this, args);
                if (this.first)
                    this.tree.selectFirst();
                else {
                    var id = this.tree.ref.getSelectedId();
                    this.onChangeTopic(id);
                }
            };
            TreeEditView.prototype.onChangeTopic = function (id) {
                var me = this;
                var item = me.tree.getItem(id);
                if (item.module) {
                    var key = item.key;
                    if (!key)
                        key = item.module + "." + item.view;
                    var args = webix.copy(item);
                    args.oid = me.objectId;
                    me.views.open(key, args);
                }
                //me.header.set({ label: item.value });
            };
            return TreeEditView;
        }(UI.View));
        UI.TreeEditView = TreeEditView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        // class for Html views
        var HtmlView = /** @class */ (function (_super) {
            __extends(HtmlView, _super);
            function HtmlView(source, title) {
                if (source === void 0) { source = ""; }
                if (title === void 0) { title = ""; }
                var _this = _super.call(this) || this;
                _this.source = source;
                _this.title = title;
                _this.template = new $u.RefUI();
                _this.scrollable = false;
                return _this;
            }
            HtmlView.prototype.$init = function () {
                _super.prototype.$init.call(this);
                return { title: this.title }; //  || this.source
            };
            HtmlView.prototype.$config = function () {
                _super.prototype.$config.call(this);
                var template = {
                    view: "template",
                    id: this.template.id,
                    template: this.source,
                    autoheight: true,
                    borderless: true,
                };
                var body = {
                    type: "clean",
                    rows: [
                        template,
                        {},
                    ],
                };
                var res = body;
                if (this.scrollable)
                    res = {
                        view: "scrollview",
                        borderless: true,
                        body: body
                    };
                return res;
            };
            HtmlView.prototype.scroll = function (scrollable) {
                if (scrollable === void 0) { scrollable = true; }
                this.scrollable = scrollable;
                return this;
            };
            HtmlView.prototype.setHtml = function (html) {
                this.template.ref.setHTML(html);
            };
            HtmlView.prototype.loadUrl = function (url) {
                try {
                    this.template.set({ template: "http->" + url });
                }
                catch (x) {
                    this.template.set({ template: UI.coreLocale.Err.TemplateError + x.message });
                    //webix.message("Ошибка при загрузке HTML: " );
                }
            };
            return HtmlView;
        }(UI.View));
        UI.HtmlView = HtmlView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        var MultiView = /** @class */ (function (_super) {
            __extends(MultiView, _super);
            function MultiView() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                //onclose: callback;
                _this.onOpen = new It.Event(); // navigate handler for bar
                _this.refview = new UI.RefUI();
                _this.tabs = {};
                return _this;
            }
            MultiView.prototype.$config = function () {
                _super.prototype.$config.call(this);
                var cfg = new UI.Configs.MultiViewConfig(this.refview.id);
                return cfg;
            };
            MultiView.prototype.open = function (key, args) {
                this.$deactivate();
                var tab = this.tabs[key];
                //if (view && this.lastKey && view == this.views[this.lastKey]) return;
                this.lastKey = key;
                //let first = !lastView;
                var view;
                if (!tab) {
                    view = args.$view || UI.createModuleView(args.module, args.view);
                    var config = view.$config();
                    var viewid = this.refview.ref.addView(config);
                    tab = $$(viewid);
                    // show & init
                    tab.show();
                    tab._viewInit = view.$init();
                    tab._viewObject = view;
                    tab._viewid = viewid;
                    this.tabs[key] = tab;
                    if (this.onclose && view.onclose == null)
                        view.onclose = this.onclose;
                    console.log("create new view: ", key);
                }
                else {
                    tab.show();
                }
                view = tab._viewObject;
                view.$activate(args);
                view.first = false;
                var res = { init: tab._viewInit, obj: view, view: tab };
                if (tab._viewInit && tab._viewInit.title)
                    document.title = tab._viewInit.title;
                this.onOpen.call(res);
                return res;
            };
            MultiView.prototype.close = function () {
                var lastView = this.tabs[this.lastKey];
            };
            MultiView.prototype.$activate = function (args) {
                _super.prototype.$activate.call(this, args);
                var view = this.getLastViewObject();
                if (view)
                    view.$activate(args);
            };
            MultiView.prototype.$deactivate = function () {
                _super.prototype.$deactivate.call(this);
                var view = this.getLastViewObject();
                if (view)
                    view.$deactivate();
            };
            MultiView.prototype.getLastViewObject = function () {
                if (!this.lastKey)
                    return null;
                var lastView = this.tabs[this.lastKey];
                if (!lastView)
                    return null;
                return lastView._viewObject;
            };
            return MultiView;
        }(UI.View));
        UI.MultiView = MultiView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
      * Extends View by buttons "Do", "Clear", and form
      */
        var PopupView = /** @class */ (function (_super) {
            __extends(PopupView, _super);
            function PopupView() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new $u.RefForm();
                //clearOnAction = false;
                //actionOnClear = false;
                _this._values = {};
                return _this;
            }
            Object.defineProperty(PopupView.prototype, "values", {
                get: function () {
                    return this._values;
                },
                enumerable: false,
                configurable: true
            });
            PopupView.prototype.$config = function (okText, clearText) {
                var _this = this;
                if (okText === void 0) { okText = UI.loc.Controls.Ok; }
                if (clearText === void 0) { clearText = UI.loc.Controls.Clear; }
                var cfg = $u.cols($u.button(okText).Type("form").Click(function () { return _this.$action(); }), // .Hotkey("enter") - глобально,
                $u.button(clearText).Click(function () { return _this.$clear(); }));
                return cfg;
            };
            PopupView.prototype.onAction = function (onaction) {
                this._onaction = onaction;
                return this;
            };
            PopupView.prototype.onClear = function (onclear) {
                this._onclear = onclear;
                return this;
            };
            PopupView.prototype.$action = function () {
                if (!this.form.validate())
                    return false;
                var vals = this.form.values();
                this.invokeAction(vals);
                //if (this.clearOnAction) this.clear(false);
                return true;
            };
            PopupView.prototype.$clear = function () {
                if (!this.form.ref)
                    return;
                this.form.clear();
                this._values = {};
                //if (this.actionOnClear && invoke)
                //    this.invokeAction(this._values);
                if (this._onclear)
                    this._onclear();
            };
            PopupView.prototype.hide = function () {
                this.form.visible(false);
            };
            PopupView.prototype.invokeAction = function (vals) {
                this._values = vals;
                if (this._onaction)
                    this._onaction(webix.copy(vals));
                //webix.message("Операция выполнена успешно");
            };
            return PopupView;
        }(UI.View));
        UI.PopupView = PopupView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        function showView(cfg) {
            var view = webix.ui(cfg);
            view.show(true);
            return view;
        }
        UI.showView = showView;
        function initScroll(init) {
            if (init === void 0) { init = true; }
            if (!init)
                return;
            if (webix.CustomScroll && !webix.env.mobile)
                webix.CustomScroll.init();
            else
                console.log("custom scroll is undefined");
        }
        UI.initScroll = initScroll;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
var auth_logins;
(function (auth_logins) {
    //let $ = It.UI;
    var LoginView = /** @class */ (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        LoginView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            //if (Context) lastLogin = Context.login;
            var me = this;
            var loc = $u.loc.System;
            var form = this.form.config().Labels(120, "left").extend({
                width: 300,
                padding: 10,
                borderless: false,
                elements: [
                    $u.label(loc.LoginHeader.tag("h3")).Size(0, 70),
                    { height: 10 },
                    $u.element("login").Label(loc.LoginLabel).Value(It.Web.auth.logins.last).Require(),
                    $u.element("password").Label(loc.PasswordLabel).Type('password').Require(),
                    { height: 10 },
                    $u.cols({}, $u.button(loc.LoginOK).Type("form").Click(function () { return me.login(); }).Hotkey("enter"), $u.button(loc.LoginCancel).Click(It.Web.goReturnUrl)),
                ],
            });
            return $u.viewCenter(form);
            //let cfg = $.cols(
            //    {},
            //    form,
            //    {},
            //);
            //return cfg;
        };
        LoginView.prototype.login = function () {
            if (!this.form.validate())
                return;
            //let res = this.form.post("api/auth/login");
            var vals = this.form.values();
            var res = auth_logins.db.login(vals);
            if (!res)
                return;
            // добавляем токен в хранилище
            It.Web.auth.tokens.save(res.token);
            // запоминаем логин
            It.Web.auth.logins.save(vals.login);
            It.Web.goReturnUrl();
        };
        return LoginView;
    }($u.View));
    auth_logins.LoginView = LoginView;
})(auth_logins || (auth_logins = {}));
/// <reference path="loginview.ts" />
var auth_logins;
(function (auth_logins) {
    auth_logins.create = {
        default: function () { return new auth_logins.LoginView(); },
        reg: function () { return new auth_logins.RegistrationView(); },
        login: function () { return new auth_logins.LoginView(); },
        logout: function () {
            if (confirm("Выйти из системы?")) {
                auth_logins.db.logout();
                It.Web.auth.tokens.clear();
                It.Web.openUrl("/");
                return new $u.HtmlView("Вы вышли из системы");
            }
            It.Web.openUrl("/");
            return new $u.HtmlView("Отмена выхода из системы");
        },
    };
    // сервис авторизации
    var AuthSource = /** @class */ (function (_super) {
        __extends(AuthSource, _super);
        function AuthSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //constructor(controller: string) {
        //    super(controller, "api/"); // все делаем с префиксом 
        //}
        AuthSource.prototype.login = function (args) {
            return this.post("login", args);
        };
        AuthSource.prototype.logout = function () {
            return this.post("logout");
        };
        AuthSource.prototype.registration = function (args) {
            return this.post("registration", args); // "api/auth/registry"
        };
        AuthSource.prototype.check = function () {
            return this.load("check");
        };
        return AuthSource;
    }(It.Web.WebSource));
    auth_logins.AuthSource = AuthSource;
    auth_logins.db = new AuthSource("auth");
    //dbauth.check(); // автоматическая авторизация 
    function run() {
        var navigator = new $u.Navigator();
        navigator.view.show();
        navigator.routers("auth_logins");
    }
    auth_logins.run = run;
    //export function create(typeid: string): any {
    //    if (typeid == "default") return new LoginView();
    //    if (typeid == "login") return new LoginView();
    //    if (typeid == "logout") {
    //        tokens.clear();
    //        return new LoginView();
    //    }
    //}
    function btLoginName(name) {
        var text = It.Web.auth.tokens.current ? (name || It.Web.auth.logins.last) : $u.loc.System.NotLogged;
        return $u.template(text);
    }
    auth_logins.btLoginName = btLoginName;
    function btLoginOut(module) {
        if (module === void 0) { module = "auth_logins"; }
        var text = It.Web.auth.tokens.current
            ? $u.loc.System.Logout.link("./".concat(module, "#!/").concat(module, "/logout"))
            : $u.loc.System.LoginLink.link("./".concat(module));
        return $u.template(text);
    }
    auth_logins.btLoginOut = btLoginOut;
})(auth_logins || (auth_logins = {}));
var auth_logins;
(function (auth_logins) {
    //let $ = It.UI;
    var RegistrationView = /** @class */ (function (_super) {
        __extends(RegistrationView, _super);
        function RegistrationView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new $u.RefForm();
            return _this;
        }
        RegistrationView.prototype.$config = function () {
            _super.prototype.$config.call(this);
            //if (Context) lastLogin = Context.login;
            var me = this;
            var loc = $u.loc.System;
            var form = this.form.config().Labels(120, "left").extend({
                width: 300,
                padding: 10,
                borderless: false,
                elements: [
                    $u.label(loc.LoginHeader.tag("h3")).Size(0, 70),
                    { height: 10 },
                    $u.element("login").Label(loc.LoginLabel).Value(It.Web.auth.logins.last).Require(),
                    $u.element("password").Label(loc.PasswordLabel).Type('password').Require(),
                    $u.element("password2").Label(loc.PasswordLabel2).Type('password').Require(),
                    { height: 10 },
                    $u.cols({}, $u.button(loc.LoginOK).Type("form").Click(function () { return me.register(); }).Hotkey("enter"), $u.button(loc.LoginCancel).Click(It.Web.goReturnUrl)),
                ],
            });
            return $u.viewCenter(form);
            //let cfg = $.cols(
            //    {},
            //    form,
            //    {},
            //);
            //return cfg;
        };
        RegistrationView.prototype.register = function () {
            if (!this.form.validate())
                return;
            var vals = this.form.values();
            //let res = this.form.post("api/auth/reg");
            var res = auth_logins.db.registration(vals);
            webix.alert($u.loc.System.RegisterResult);
        };
        return RegistrationView;
    }($u.View));
    auth_logins.RegistrationView = RegistrationView;
})(auth_logins || (auth_logins = {}));
///// <reference path="webix/webix.d.ts" />
// (<any>window).webix = {};
///// <reference path="underscore.d.ts" />
///// <reference path="webix/webix.d.ts" />
///// <reference path="webix/localizations/_ref.ts" />
/// <reference path="webix/localizations/ru.ts" />
/// <reference path="webix/localizations/en.ts" />
/// <reference path="webix/localizations/_defs.ts" />
///// <reference path="common/_ref.ts" />
/// <reference path="../Itall.Shared/CoreJs/index.ts" /> 
/// <reference path="webix/_lib.ts" />  
/// <reference path="webix/_prototypes.ts" /> 
///// <reference path="webix/data/_ref.ts" />  
///// <reference path="webix/web/_lib.ts" />
///// <reference path="webix/web/websource.ts" />
///// <reference path="webix/web/urlsource.ts" />
///// <reference path="webix/web/treeservice.ts" /> 
///// <reference path="webix/configs/_ref.ts" />
/// <reference path="webix/configs/baseconfig.ts" />
/// <reference path="webix/configs/containerconfig.ts" /> 
/// <reference path="webix/configs/tableconfig.ts" />
/// <reference path="webix/configs/columnconfig.ts" />
/// <reference path="webix/configs/dataviewconfig.ts" />
/// <reference path="webix/configs/elementconfig.ts" />
/// <reference path="webix/configs/formconfig.ts" /> 
/// <reference path="webix/configs/gridconfig.ts" />
/// <reference path="webix/configs/itemconfig.ts" />
/// <reference path="webix/configs/listconfig.ts" />
/// <reference path="webix/configs/popupconfig.ts" />
/// <reference path="webix/configs/basetreeconfig.ts" />
/// <reference path="webix/configs/tabsconfig.ts" />
/// <reference path="webix/configs/tabviewconfig.ts" />
/// <reference path="webix/configs/treeconfig.ts" />
/// <reference path="webix/configs/treetableconfig.ts" />
/// <reference path="webix/configs/multiviewconfig.ts" />
/// <reference path="webix/configs/_lib.ts" />
///// <reference path="webix/refs/_ref.ts" />
/// <reference path="webix/refs/uiref.ts" />
/// <reference path="webix/refs/containerref.ts" />
/// <reference path="webix/refs/datacontainerref.ts" />
/// <reference path="webix/refs/formref.ts" />
/// <reference path="webix/refs/tableref.ts" />
/// <reference path="webix/refs/comboref.ts" />
/// <reference path="webix/refs/listref.ts" />
/// <reference path="webix/refs/dataviewref.ts" />
/// <reference path="webix/refs/menuRef.ts" />
/// <reference path="webix/refs/gridref.ts" />
/// <reference path="webix/refs/treeref.ts" />
/// <reference path="webix/refs/winref.ts" />
/// <reference path="webix/refs/templateref.ts" />
/// <reference path="webix/refs/htmlformref.ts" />
/// <reference path="webix/refs/_lib.ts" />
///// <reference path="webix/ui/_ref.ts" /> 
/// <reference path="webix/ui/_defs.ts" />
/// <reference path="webix/ui/menu.ts" />
/// <reference path="webix/ui/navigator.ts" />
/// <reference path="webix/ui/_lib.ts" />
/// <reference path="webix/ui/uimanager.ts" />
/// <reference path="webix/ui/html.ts" />
///// <reference path="webix/views/_ref.ts" /> 
/// <reference path="webix/views/view.ts" />
/// <reference path="webix/views/texteditview.ts" />
/// <reference path="webix/views/selectorview.ts" />
/// <reference path="webix/views/treeeditview.ts" />
/// <reference path="webix/views/htmlview.ts" />
/// <reference path="webix/views/multiview.ts" />
/// <reference path="webix/views/popupview.ts" />
/// <reference path="webix/views/_lib.ts" />
/////// <reference path="app/system/_ref.ts" />
///// <reference path="app/system/_contexts.ts" />
///// <reference path="app/system/_module.ts" />
///// <reference path="app/system/loginview.ts" />
///// <reference path="app/auth/(web)/_logins.ts" />
///// <reference path="app/auth/(web)/_tokens.ts" />
/// <reference path="app/auth/(web)/_module.ts" />
/// <reference path="app/auth/(web)/loginview.ts" />
/// <reference path="app/auth/(web)/RegistrationView--todo.ts" />
//// configs
///// <reference path="app/configs/configfileview.ts" />
///// <reference path="app/configs/settingsview.ts" />
///// <reference path="app/configs/_module.ts" />
var skins;
(function (skins_1) {
    skins_1.skins = [
        { id: "air", value: "Air" },
        { id: "aircompact", value: "Air Compact" },
        { id: "clouds", value: "Clouds" },
        { id: "compact", value: "Compact" },
        { id: "contrast", value: "Contrast" },
        { id: "flat", value: "Flat" },
        { id: "material", value: "Material" },
        { id: "glamour", value: "Glamour" },
        { id: "light", value: "Light" },
        { id: "metro", value: "Metro" },
        { id: "terrace", value: "Terrace" },
        { id: "touch", value: "Touch" },
        { id: "web", value: "Web" },
    ];
    skins_1.skin = webix.storage.local.get("skin");
    function load() {
        if (!skins_1.skin)
            return false;
        try {
            It.Web.loadCSS("./lib/webix/skins/".concat(skins_1.skin, ".css"));
            webix.skin.set(skins_1.skin);
            return true;
        }
        catch (e) {
            webix.storage.local.remove("skin");
            return false;
        }
    }
    skins_1.load = load;
    //load();
    function selector() {
        function reload(skin) {
            webix.storage.local.put("skin", skin);
            location.reload();
        }
        return $u.element().AsSelect(skins_1.skins, "select").Value(skins_1.skin).OnChange(function (x) { return reload(x); });
    }
    skins_1.selector = selector;
})(skins || (skins = {}));
var It;
(function (It) {
    var UI;
    (function (UI) {
        /**
         * Отображение множества View, привязынных к данным
         * Загрузка forms.reload( items )
         * Ограничение - несколько десятков (до 100)
         */
        var ContainerView = /** @class */ (function (_super) {
            __extends(ContainerView, _super);
            function ContainerView(_Creator) {
                var _this = _super.call(this) || this;
                _this._Creator = _Creator;
                _this._RefContainer = new $u.RefContainer();
                return _this;
            }
            ContainerView.prototype.$config = function () {
                // load items
                //let cfg = $.view("accordion").Ref(this._RefContainer).extend({
                //    type: "wide",
                //    multi: true,
                //    rows: [], 
                //});
                var cfg = UI.rows().Ref(this._RefContainer);
                return cfg;
            };
            ContainerView.prototype.reload = function (list) {
                var views = this.buildRuleViews(list);
                //this._RefContainer.ref.blockEvent();
                this._RefContainer.visible(false);
                this._RefContainer.set({ rows: views }, true);
                list.forEach(function (x) {
                    x.$view.$reload(x);
                });
                //this._RefContainer.ref.unblockEvent();
                this._RefContainer.visible(true);
            };
            ContainerView.prototype.buildRuleViews = function (list) {
                var _this = this;
                var items = [];
                // для каждого rule создаем view
                list.forEach(function (x) {
                    //let ctor = constructor(rule.form);
                    //let view: $.View = new ctor();
                    //rule.$view = view;
                    var view = _this._Creator(x); //new requests.ItemView();
                    var cfg = view.$config();
                    x.$view = view;
                    x.$config = cfg;
                    //let item = {
                    //    //header: item + "#",
                    //    //headerHeight: 23,
                    //    body: cfg.Padding(10, 10),
                    //};
                    items.push(cfg);
                });
                items.push({});
                return items;
            };
            return ContainerView;
        }($u.View));
        UI.ContainerView = ContainerView;
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//# sourceMappingURL=web-cf.js.map