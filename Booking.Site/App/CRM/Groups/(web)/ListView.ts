module groups {

    //let css = {
    //    table: {  //https://learn.javascript.ru/display
    //        table: { display: 'table', },
    //        row: { display: 'table-row', },
    //        cell: { display: 'table-cell', },
    //    },

    //    overflow: {
    //        auto: { overflow: 'auto', },
    //        hidden: { overflow: 'hidden', },
    //        visible: { overflow: 'visible', },
    //        scroll: { overflow: 'scroll', },
    //    },

    //    pos: {
    //        //margin: function (n: number) { return { margin: n + 'px' } },
    //        margin: (n: number) => ({ margin: n + 'px' }),
    //        padding: (n: number) => ({ margin: n + 'px' }),
    //        marginp: (n: number) => ({ margin: n + '%' }),
    //        paddingp: (n: number) => ({ margin: n + '%' }),

    //        // https://learn.javascript.ru/position
    //        relative: { position: 'relative' },
    //        absolute: { position: 'absolute' },
    //        fixed: { position: 'fixed' },

    //        //float: {  //https://learn.javascript.ru/float
    //        left: { float: 'left' },
    //        right: { float: 'right' },
    //        clear_left: { clear: 'left' },
    //        clear_right: { clear: 'right' },
    //        clear_both: { clear: 'both' },

    //        //display: {
    //        none: { display: 'none', },
    //        flex: { display: '-webkit-flex flex', },
    //        inline: { display: 'inline-block' }, // https://learn.javascript.ru/display
    //    },
    //}


    //export let tmpl = $.html().style(css.pos.flex).tags(
    //    $.html('h4').text('#name#'),
    //    $.html().text('#description#').style({ color: 'grey', 'line-height':'12px' }),
    //);

    //export let spheresHtmpl = $.html().style(css.pos.flex).tags(
    //    $.html('h4').text('#order#. #name#').style({ 'background-color1': '#DFF3EE' }),
    //    $.html().style({ width: '70px' }).css(css.pos.left).tags(
    //        $.html().text('res/#icon#'.img({ width: '50px', height: '50px' })),
    //    ),
    //    $.html().text('#description#').style({ color: 'grey', 'line-height': '12px' }),
    //);
   
    export class ListView extends $u.View {

        constructor(private itemsArgs, private template: string) {
            super();
        }

        private list = new $u.RefList();

        $config() {
            super.$config();

            let list = this.list.config().extend({
                template: this.template,
                select: false,
                type: {
                    href: "#!",
                    height: "auto",
                },
            });

            let view = $u.rows(
                $u.panelbar(
                    this.list.btnRefresh(_ => this.refresh()),
                    {}
                ),
                list
            );
            return view;
        }

        $activate(args) {
            super.$activate(args);
            if (this.first)
                this.refresh();
        }

        private refresh() {
            let rows = db.list(this.itemsArgs);
            this.list.refresh(rows);
        }


    }

}