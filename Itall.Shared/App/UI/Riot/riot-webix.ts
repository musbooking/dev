declare var riot;

/** #!/riots/my-tag  */
module riots {
    export function create(typeid: string): any {
        return new It.UI.RiotView(typeid);
    }
}


module It.UI {
    //export declare type RiotView = any;
    export declare var RiotTag;

    export declare var routers: { (opt, paths: string[]): string }[];

    //routers.insert(0, (paths: string[]) => {
    //    if (paths[0] == "!")
    //        paths.slice(0);
    //    return undefined;
    //});

    export class RiotView extends $u.View {

        constructor(private tagname: string, private opts: any = {}) {
            super();
        }

        template = new $u.RefTemplate()
        div: HTMLElement

        tag: any;

        $config() {
            super.$config();

            //let cfg = $u.template( tag.tag("div") );
            let tag = this.tagname.indexOf("<") < 0 ? "Tag not found".tag(this.tagname) : this.tagname;
            let cfg = this.template.config(tag); //.Size(-1, 100);
            return cfg;
        }

        $init() {
            let stage = 'start';

            try {
                super.$init();
                stage = 'after $init';
                let elem = $$(this.template.id);

                if (!elem || !elem.$view)
                    throw new Error("template element not found, missing riotview.$config(): " + this.tagname);
                this.div = <HTMLElement>elem.$view.firstElementChild.firstElementChild;
                stage = 'riot.mounting ' + this.tagname;

                this.opts.view = this;
                this.tag = riot.mount(this.div, this.tagname, this.opts)[0];
                stage = 'mounted';
            }
            catch (err) {
                console.log(`${this.tagname} $init/${stage} error :`, err);
            }

            //window.addEventListener("resize", function() {
            //    console.log("Resource conscious resize callback!");
            //    me._resize();
            //});
            //this.template.ref.resize();
        }

        $activate(args) {
            super.$activate(args);
            this.tag.$activate(args);
        }

        $deactivate() {
            super.$deactivate();
            this.tag.$deactivate();
        }

        resize() {
            let me = this;
            setTimeout(_ => me._resize(), 100);
        }

        private _resize() {
            console.log('resize webix-riot: ' + this.tagname);
            //debugger;
            //this.template.si();
            //let view
            let elem = $$(this.template.id);
            let r = this.template.ref;
            //this.template.set({height: this.div.offsetHeight});
            //elem.$setSize(undefined, this.div.offsetHeight);
            let parent = elem.getParentView();
            let h = this.div.offsetHeight || (<HTMLElement>this.div.firstChild).offsetHeight;
            (<any>elem).define({ height: h });
            //parent.refresh();
            if(parent && parent.resize)
                parent.resize();
            //parent.$setSize(undefined, this.div.offsetHeight);

        }
    }


    if (typeof riot !== 'undefined') {


        // добавляем обработчик роутеров для webix-views
        routers.insert(0, (opt, paths: string[]) => {
            if (paths[0] != "!") // для обычных ссылок опускаем
                return undefined;

            let module = paths[1];
            let view = paths[2];
            //let id = paths[3];
            opt.key = module + "-" + view;
            return "app-webix";
        });

        riot.tag2('app-webix', "<div></div>", '', '', function (opts) {  //style='display: flex;  align-items: 'center' 
            let view = new WebixLoaderTag();
            view.$init(this);
        });

        class WebixLoaderTag extends It.UI.RiotTag {

            private view: It.UI.View;
            private tag;
            private active = false;
            private webview: webix.ui.view;

            $init(tag) {
                let paths: string[] = tag.opts.paths;
                let module = paths[1];
                let view = paths[2];

                this.view = It.UI.createModuleView(module, view);
                this.tag = tag;

                super.$init(tag);
            }

            $mount() {

                let stage = 'start';
                let me = this;

                try {
                    super.$mount();
                    stage = 'mounted';

                    let config = me.view.$config();
                    me.webview = <any>webix.ui(config, this.tag.opts.element);
                    stage = 'webix.ui';
                    me.view.$init();
                    stage = 'webix-view.$init';

                    window.onresize = function () {
                        if (me.active && me.webview && me.webview.resize)
                            me.webview.resize();
                    };
                    stage = 'end';
                }
                catch (err) {
                    console.log(`WebixLoaderTag.$mount/${stage} error :`, err, this.view, this.tag);
                }
            }

            $activate(args, paths: string[]) {// prefix: string, module: string, view: string, id: string) {
                super.$activate(args);

                args = args || {};
                //let id = this.opts.paths[3]; // нельзя использовать, тк они постоянны
                let id: string;
                if(paths) id = paths[3];
                if (id && !args.oid && id.indexOf("=")<0)
                    args.oid = id;
                this.view.$activate(args);
                this.active = true;
                //let args =  It.Web.parseUrlQuery(location.hash);
                if (this.webview && this.webview.resize)
                    this.webview.resize();
            }

            $deactivate() {
                super.$deactivate();
                this.view.$deactivate();
                this.active = false;
            }

        }

    }
}