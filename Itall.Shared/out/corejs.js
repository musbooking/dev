var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
                AccessError: "Ошибка доступа ",
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
        UI.locale = UI.locRu;
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
        UI.confirm = function (args) { return ithtml.confirm(args); };
        UI.dialog = function (args) { return ithtml.alert(args); };
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
                        break;
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
Array.prototype.findById = function (id, defVal) {
    if (!id)
        return defVal;
    var obj = this.find(function (x) { return x.id == id; });
    if (!obj)
        return defVal;
    return obj;
};
Array.prototype.find = function (where) {
    // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    // TEST:
    //let arr = [
    //    { x: 1, y: 'a', },
    //    { x: 2, y: 'b', },
    //];
    //let z1 = arr.find(a => a.x == 2);
    //let z2 = arr.find(a => a.x == 5);
    //let z3 = arr.find(a => a.y == 'a');
    //let z4 = arr.find(a => a.y == 'bbb');
    if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof where !== 'function') {
        throw new TypeError('where must be a function');
    }
    var list = this;
    var length = list.length;
    var value;
    for (var i = 0; i < length; i++) {
        value = list[i];
        if (where(value)) {
            return value;
        }
    }
    return undefined;
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
var loc = It.UI.locale.Date;
/**
 * Возвращаем, сколько времени прошло до текущего момента
 */
function passedTime(date) {
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
var dateDiff = {
    inHoursAbs: function (d1, d2) {
        if (d2 === void 0) { d2 = new Date(); }
        return Math.abs(dateDiff.inHours(d1, d2));
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
    return "<" + tag + " " + attr + ">" + this + "</" + tag + ">";
};
/*
* Usage: "http://url.jpg".img()
*/
String.prototype.img = function (args) {
    var sattrs = It.Web.args2attr(args);
    return "<img src='" + this + "' " + sattrs + "/>";
};
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
                    obj[me.childrenAttr] = [];
                });
                list.forEach(function (obj) {
                    var parent = obj[me.parentAttr];
                    if (parent !== undefined && parent) {
                        var lparent = me.lookup[parent];
                        //if (!parent[me.childrenAttr]) parent[me.childrenAttr] = [];
                        if (lparent)
                            lparent[me.childrenAttr].push(obj);
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
// interface XMLHttpRequest {
//     json(dateParse?: boolean);
//     text(): string;
//     list(dateParse?: boolean): any[];
//     tree(id?: string, parent?: string, data?: string): any[]
// }
var It;
(function (It) {
    var Web;
    (function (Web) {
        function json(rq, dateParse) {
            if (dateParse === void 0) { dateParse = true; }
            if (It.Web.error(rq))
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
        }
        Web.json = json;
        ;
        function list(rq, dateParse) {
            if (dateParse === void 0) { dateParse = true; }
            if (!rq.responseText)
                return undefined;
            var js = json(rq, dateParse);
            return js;
        }
        Web.list = list;
        ;
        function tree(rq, id, parent, data) {
            if (id === void 0) { id = "id"; }
            if (parent === void 0) { parent = "parentId"; }
            if (data === void 0) { data = "data"; }
            if (!rq.responseText)
                return undefined;
            var js = json(rq);
            var treeService = new It.Web.TreeService();
            var list = treeService.loadTree(js, id, parent, data);
            list.service = treeService;
            return list;
        }
        Web.tree = tree;
        ;
        function text(rq) {
            if (It.Web.error(rq))
                return undefined;
            return rq.responseText;
        }
        Web.text = text;
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
        function post(url, args) {
            if (args === void 0) { args = null; }
            return request(url, "POST", args);
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
        function request(url, cmd, args, json) {
            if (cmd === void 0) { cmd = "GET"; }
            if (json === void 0) { json = false; }
            var xhr = new XMLHttpRequest();
            xhr.open(cmd, url, false); // `false` makes the request synchronous
            var token = Web.auth.tokens.current;
            if (token)
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            if (cmd != "GET" && args) {
                if (json) {
                    args = JSON.stringify(args); // не проходит, почему-то не понимает сервер ??
                    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
                }
                else if (args instanceof File) {
                    var ff = 123;
                    // ничего не делаем - посылаем файл так
                }
                else {
                    //args = getUrlQuery(args);
                    //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    args = objectToFormData(args);
                }
            }
            //else if (cmd == "GET") {
            //    args = args || {};
            //    args._v = It.uid();
            //}
            try {
                xhr.send(args);
            }
            catch (err) {
                var msg = err.name + "<br /><br />" + err.message; // + "<br /><br />" + e.stack;
                It.UI.error(msg);
                //It.UI.alert({
                //    title: 'Request error',
                //    text: JSON.stringify(err),
                //    type: "error",
                //});
                throw new Error("load error: " + JSON.stringify(err));
            }
            // if (xhr.status === 200) {
            //     // let json = JSON.parse(request.responseText);
            //     // console.log(json);
            // } else {
            //     throw new Error("load error");
            // }
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
                            val = val.toJSON();
                        fd.append(formKey, val);
                    }
                    else if (val instanceof File || val instanceof FileList) { // FileList не работает на сервере - не переходит в Form.Files.
                        fd.append(formKey, val);
                    }
                    else if (typeof val === 'object' && !(val instanceof File) && !(val instanceof FileList)) {
                        objectToFormData(val, property, fd);
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
                res += name_2 + ":" + args[name_2] + ";";
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
                    val = val.toJSON();
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
                setTimeout(function () { return location.reload(true); }, 300);
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
        var loc = It.UI.locale.Err;
        /** Функция отображения ошибки запроса */
        function error(response) {
            if (response.status == 200)
                return false;
            if (response)
                console.log(response.responseText);
            var text = loc.UnknownError;
            if (response.status == 401) { // if not in system module
                It.UI.error(loc.AccessError + ' (' + response.responseText + ')', loc.ErrorText);
                return true;
            }
            else if (response.status == 500) {
                text = loc.ErrorText;
            }
            else if (response.status == 404) {
                text = loc.ResNotFound;
            }
            else if (response) {
                text = response.responseText || text;
                //if (text.) {
                //    text = JSON.stringify(text, null, '<br/>');
                // }
            }
            //text = text.replace("\\r\\n", "<br/>").replace("\\n\\r", "<br/>");
            text = text.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
            It.UI.error(text, loc.Error + " " + response.status + ": " + response.statusText);
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
            if (Web.error(res))
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
        /**
         * �������� ���������� �����
         */
        function loadText(file) {
            var s = _loadedFiles[file];
            if (s)
                return s;
            //let res: any = webix.ajax().sync().get(file, {}); //headers({Accept: "text/html"})..headers({ "Content-Type": "application/javascript" })
            var res = Web.get(file);
            if (Web.error(res))
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
            if (navigator.msSaveBlob) { // IE10
                return navigator.msSaveBlob(new Blob([content], { type: mimeType }), fileName);
            }
            else if ('download' in a) { //html5 A[download]
                a.href = "data:" + mimeType + "," + encodeURIComponent(content);
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
                f_1.src = "data:" + mimeType + "," + encodeURIComponent(content);
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
                var url = WebSource.base + "/" + this.prefix + this.controller + "/" + action + "/?" + Web.getUrlQuery(args);
                return url;
            };
            WebSource.prototype.getUrl = function (id) {
                return WebSource.base + "/" + this.prefix + this.controller + "/get/" + id; //?_v=${__QVER++}`;
            };
            WebSource.prototype.saveUrl = function (id) {
                if (!id)
                    id = "";
                return WebSource.base + "/" + this.prefix + this.controller + "/save/" + id;
            };
            WebSource.prototype.save = function (obj) {
                var id = obj.id;
                if (id) {
                    var url = this.saveUrl(id);
                    return Web.json(Web.put(url, obj));
                }
                else {
                    var url1 = this.saveUrl();
                    return Web.json(Web.post(url1, obj));
                }
            };
            WebSource.prototype.delete = function (id) {
                var url = this.saveUrl(id);
                return Web.json(Web.del(url));
            };
            WebSource.prototype.load = function (url, args, dateParse) {
                if (dateParse === void 0) { dateParse = true; }
                var rq = Web.get(this.url(url), args);
                //if(!rq.json) return undefined;
                return Web.json(rq, dateParse);
            };
            WebSource.prototype.loadList = function (url, args, dateParse) {
                if (dateParse === void 0) { dateParse = true; }
                var rq = Web.get(this.url(url), args);
                //if(!rq.list) return undefined;
                return Web.list(rq, dateParse);
            };
            WebSource.prototype.loadTree = function (url, id, parent, args) {
                var rq = Web.get(this.url(url), args);
                //if(!rq.tree) return undefined;
                return Web.tree(rq, id, parent);
            };
            WebSource.prototype.loadStr = function (url, args) {
                var rq = Web.get(this.url(url), args);
                //if(!rq.text) return undefined;
                return Web.text(rq);
            };
            WebSource.prototype.get = function (id) {
                var rq = Web.get(this.getUrl(id));
                return Web.json(rq);
            };
            //loadItemsUrl = this.url("getitems");  // проблемы с датами
            WebSource.prototype.post = function (url, obj) {
                var rq = Web.post(this.url(url), obj);
                return Web.json(rq);
            };
            WebSource.prototype.put = function (url, obj) {
                var rq = Web.put(this.url(url), obj);
                return Web.json(rq);
            };
            WebSource.prototype.getSaveCfg = function (autoupdate) {
                if (autoupdate === void 0) { autoupdate = false; }
                return {
                    url: "rest->" + this.prefix + this.controller + "/save",
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
                return "" + this.prefix + this.baseUrl + "/" + this.controller + It.Web.getUrlQuery(args, false);
            };
            UrlSource.prototype.load = function (name, args) {
                var url = this.baseUrl + "/" + this.controller + name;
                var res = Web.json(Web.get(url, args));
                if (!res || !res.d)
                    return res;
                return res.d.results;
            };
            UrlSource.prototype.getUrl = function (id) {
                return this.baseUrl + "/" + this.controller + "(" + id + ")";
            };
            UrlSource.prototype.saveUrl = function (id) {
                if (id)
                    return this.baseUrl + "/" + this.controller + "(" + id + ")";
                else
                    return this.baseUrl + "/" + this.controller;
            };
            UrlSource.prototype.getSaveCfg = function (autoupdate) {
                if (autoupdate === void 0) { autoupdate = false; }
                return {
                    url: "" + this.prefix + this.baseUrl + "/" + this.controller,
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
        function bindSocket(code, id, caller) {
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
            var wsUri = protocol + "//" + base + "/" + code + "?id=" + id; // window.location.host
            var socket = new WebSocket(wsUri); //'ws://localhost:50007/sockets');
            socket.onopen = function (event) {
                console.log("Соединение установлено.");
            };
            socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log('Соединение закрыто чисто');
                }
                else {
                    console.log('Обрыв соединения'); // например, "убит" процесс сервера
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
                console.log("Ошибка " + error);
            };
            //setTimeout(x => socket.send('123456'), 5000);
            //this.socket = socket;
            return socket;
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
                var STORAGE_AUTH_TOKEN = location.host + ".auth.token";
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
                var LOGIN_ID = location.host + ".auth.login";
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
/// <reference path="common/_loc.ts" />
/// <reference path="common/core.ts" />
/// <reference path="ui/msg.ts" />
///// <reference path="common/_ref.ts" />
/// <reference path="common/arrays.ts" />
/// <reference path="common/common.ts" />
/// <reference path="common/dates.ts" />
/// <reference path="common/numbers.ts" />
/// <reference path="common/strings.ts" />
/// <reference path="it/common.ts" /> 
/// <reference path="it/storage.cookies.ts" />
/// <reference path="it/storage.local.ts" />
///// <reference path="web/_ref.ts" />
/// <reference path="web/TreeService.ts" />
/// <reference path="web/requests.ts" />
/// <reference path="web/Loads.ts" />
/// <reference path="web/WebSource.ts" /> 
/// <reference path="web/UrlSource.ts" />
/// <reference path="web/auth.ts" />
/// <reference path="web/sockets.ts" />
/// <reference path="web/auth.tokens.ts" />
/// <reference path="web/auth.logins.ts" />
// export var locale = It.UI.locRu;  
// import "./common/_loc";
// import "./common/core.ts"
// import "./ui/msg.ts";
// //import "common/_ref.ts";
// import "./common/arrays.ts";
// import "./common/common.ts";
// import "./common/dates.ts";
// import "./common/numbers.ts";
// import "./common/strings.ts";
// import "./it/common.ts"; 
// import "./it/storage.cookies.ts";
// import "./it/storage.local.ts";
// //import "web/_ref.ts";
// import "./web/TreeService.ts";
// import "./web/requests.ts";
// import "./web/loads.ts";
// import "./web/WebSource.ts"; 
// import "./web/UrlSource.ts";
// import "./web/auth.ts";
// import "./web/sockets.ts";
// import "./web/auth.tokens.ts";
// import "./web/auth.logins.ts";
//export default It;
console.log("--------------- load It");
window.It = It;
// declare var It;
//# sourceMappingURL=corejs.js.map