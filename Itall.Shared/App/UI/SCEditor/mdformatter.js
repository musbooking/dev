var It;
(function (It) {
    var UI;
    (function (UI) {
        var sceditors;
        (function (sceditors) {
            function mdformat() {
                var _service = null;
                //let _und;
                /**
                 * Called when the editor is created.
                 *
                 * This is called before the editor is fully initialised
                 */
                this.init = function () {
                    // this is set to the editor
                    UI.Data.loadJS('lib/markdown/turndown.js');
                    if (!_service) {
                        var options = {};
                        _service = new TurndownService(options);
                    }
                    //Data.loadJS('lib/markdown/upndown.js');
                    //_und = new upndown();
                    UI.Data.loadJS('lib/markdown/marked.js');
                    marked.setOptions({
                        //renderer: new marked.Renderer(),
                        gfm: true,
                        tables: true,
                        breaks: true,
                        pedantic: true,
                        sanitize: true,
                        smartLists: true,
                        smartypants: true,
                    });
                };
                /**
                 * Called when the WYSIWYG editor document is ready
                 */
                this.onReady = function () {
                    // this is set to the editor
                };
                /**
                 * Called to convert the whole HTML document to markdown
                 */
                this.toSource = function (html, context) {
                    // this is set to this object
                    var md = _service.turndown(html);
                    //let md = '';
                    //_und.convert(html, function (err, markdown) {
                    //    if (err) { console.error(err); }
                    //    else { md = markdown; } // Outputs: # Hello, World !
                    //}, { keepHtml: false });
                    return md;
                };
                /**
                 * Called to convert the whole source into HTML
                 */
                this.toHtml = function (source) {
                    if (!source)
                        return '';
                    // this is set to this object
                    var html = marked(source);
                    //html = html.replace('\n', '<br/>');
                    return html;
                };
                /**
                 * Called to convert a fragment HTML into markdown
                 *
                 * Parent is set to the current node
                 */
                this.fragmentToSource = function (html, context, parent) {
                    if (!html)
                        return '';
                    // this is set to this object
                    try {
                        html = decodeURIComponent(html);
                    }
                    catch (_a) {
                    }
                    //for (let i = 0; i < 10; i++) {
                    //    html = html.replace('<span>&nbsp;</span>', ' '); // ????????????-???? ?????????? 1-???? ???????? ???? ????????????????
                    //}
                    html = html.replace(/&nbsp;/g, " ");
                    var md = _service.turndown(html);
                    //let md = '';
                    //_und.convert(html, function (err, markdown) {
                    //    if (err) { console.error(err); }
                    //    else {
                    //        md = markdown;
                    //    } // Outputs: # Hello, World !
                    //});
                    return md;
                };
                /**
                 * Called to convert a fragment of source into HTML
                 */
                this.fragmentToHtml = function (source) {
                    // this is set to this object
                    var html = marked(source);
                    return html;
                };
            }
            sceditors.mdformat = mdformat;
            ;
        })(sceditors = UI.sceditors || (UI.sceditors = {}));
    })(UI = It.UI || (It.UI = {}));
})(It || (It = {}));
//# sourceMappingURL=mdformatter.js.map