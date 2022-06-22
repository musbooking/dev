module orders {

    let MODE = {
        Day: "rooms",
        Week: "weekrooms",
        Month: "month"
    }

    declare let dhtmlx, scheduler;

    //scheduler.config.day_date = "aaa %d/%m/%Y";
    let _webix: any = webix;


    function loadScheduler() {
		let path = It.Web.WebSource.base + "/";
        It.Web.loadCSS("lib/scheduler/dhtmlxscheduler.css");
        It.Web.loadJS(path+ "lib/scheduler/dhtmlxscheduler.js");
        It.Web.loadJS(path+ "lib/scheduler/dhtmlxscheduler_units.js");
        It.Web.loadJS(path+ "lib/scheduler/dhtmlxscheduler_limit.js");
        //It.Web.loadJS("lib/scheduler/dhtmlxscheduler_tooltip.js");
        It.Web.loadJS(path+ "lib/scheduler/dhtmlxscheduler_collision.js");
        It.Web.loadJS(path+ "lib/webix/scheduler.js");    
        It.Web.loadJS(path+ "lib/scheduler/locale_ru.js");  

        //dhtmlx.CustomScroll.init();
    }



    export class CalendarView extends $u.View {        
        //constructor() {     
        //    super();
        //    webix.require("scheduler/dhtmlxscheduler_collision.js", () => alert("aaa"), this);
        //    webix.require("http://cdn.webix.com/components/scheduler/scheduler.js");
        //    webix.require("http://cdn.webix.com/components/scheduler/scheduler/dhtmlxscheduler.js");
        //}
         
        private scheduler = new $u.RefUI();   
        //private details: orders.EditView;   
        //private baseId: number;
        //private bases: any[];
        private date = new $u.RefUI();
        private dhtmlScheduler: any;
        private sections: any[] = rooms.db.units(); 
        private timerid = setInterval(() => this.checkUpdates(), 60*1000);
        //private warning = new $.RefUI();
        private baseList = new $u.RefCombo();
        private currentDate: Date;
        private currentMode = MODE.Day;
        private itemView: ItemView = new ItemView(this);

        $config() {
            super.$config();

            _webix.require.disabled = true;

            loadScheduler();

            let me = this;

            let listbases = bases.db.names(true)
                .filter(b => b.sphere)
                .sort((b1, b2) => (<string>b1.sphere).localeCompare(b2.sphere) )
                //.sort((b1, b2) => b1.sphere - b2.sphere)
                .map(b => ({
                    id: b.id,
                    value: `${b.sphere}: ${b.value}`,
                    sphereId: b.sphereId,
                    weekendHours: b.weekendHours,
                    workHours: b.workHours
                }));  
            //let baseId = bases.length > 0 ? bases[0].id : 0;

            let editor = new orders.OrderEditor(() => me.refresh());
            //let rules = rules;


            let schedulerViewCfg = {
                    view: "dhx-scheduler",
                    id: this.scheduler.id,
                    //date: new Date(2010, 0, 5),
                    mode: MODE.Day,
                    //day_header_date: "fff %d/%m/%Y",
                    //mode: "month",
                    tooltip: {
                        template: "TTTTTTTT <span class='webix_strong'>Rating: </span> #rating#<br/>< span class='webix_strong' > Votes: </span> #votes#"
                    },

                    init: function () {
                        let sch = this._scheduler;
                        me.dhtmlScheduler = sch;
                        //scheduler.config.xml_date = "%Y-%m-%d %H:%i";
                        sch.config.xml_date = "%c";
                        //sch.config.day_header_date = "%d.%m.%Y",
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
                        sch.config.readonly = !logic.allowEditCalendar();
                        sch.xy.scale_height = 40; //sets the height of the X-Axis  
                        sch.locale.labels.confirm_deleting = "";
                        sch.config.start_on_monday = true;
                        //sch.config.hour_size_px = 44;
                        //sch.config.hour_size_px = 88;
                        sch.config.collision_limit = 1;
                        // sch.config.limit_time_select = true; old, previous version
                        // sch.setLoadMode("day");

                        //dhtmlScheduler.templates.xml_date = function (date_string) {
                        //    let d = new Date(Date.parse(date_string));
                        //    return d;
                        //};

                        // создаем основное представление для календаря
                        let unitsq = sch.createUnitsView({
                            name: MODE.Week,
                            property: "roomId",
                            list: sch.serverList("units1", []),
                            days: 7,
                            //size: 3,//the number of units that should be shown in the view 
                            //step: 1,  //the number of units that will be scrolled at once
                        });

                        // создаем представление для календаря
                        let units2 = sch.createUnitsView({
                            name: MODE.Day,
                            property: "roomId",
                            list: sch.serverList("units2", []),
                            days: 1,
                            //size: 1,//the number of units that should be shown in the view 
                            //step: 1,  //the number of units that will be scrolled at once
                        });

                        //sch.createTimelineView({
                        //    name: _MODE,
                        //    x_unit: "hour",
                        //    x_date: "%H",
                        //    x_step: 1,
                        //    x_size: 18,
                        //    x_start: 6,
                        //    //x_length: 180,
                        //    y_unit: sections,
                        //    y_property: "roomId",
                        //    render: "bar",
                        //    event_dy: "full",
                        //});

                        // указываем доступные иконки для быстрого редактирования 
                        sch.config.icons_select = [  
                            "icon_details",
                            //"icon_edit",        
                            "icon_delete"         
                        ];              

                        let dformat = webix.Date.dateToStr("%d %M, %l", false);

                        let func_date_format = function (date) {
                            //    //let formatFunc = sch.date.date_to_str(sch.config.default_date);
                            //    //return formatFunc(date);
                            return dformat(date);
                            //    return webix.i18n.dateFormatStr(date);
                        };

                        sch.templates.day_date = func_date_format;
                        //sch.templates.month_day = func_date_format;
                        sch.templates.weekrooms_second_scale_date = func_date_format;

                        //sch.templates.weekrooms_second_scale_date = function (date) {
                        //    return sch.templates.week_scale_date(date);
                        //};

                        // задаем цвета для отображения события в календаре
                        sch.templates.event_class = logic.getEventCss;

                        //sch.templates.week_date_class = function (date, today) {
                        //    return "custom_color";
                        //}

                        //sch.templates.hour_scale = function (date) {
                        //    let html = ""; 
                        //    let step = 3;
                        //    for (let i = 0; i < 60 / step; i++) {
                        //        html += "<div style='height:21px;line-height:21px;'>" + date + "</div>";
                        //        date = scheduler.date.add(date, step, "minute");
                        //    }
                        //    return html;
                        //}

                        sch.templates.event_header = function (start, end, ev) {
                            return sch.templates.event_date(start) + "-" + sch.templates.event_date(end);
                        };

                        sch.templates.event_text = logic.getEventTemplate;
                        sch.templates.month_scale_date = webix.Date.dateToStr("%l", false);; 
                        sch.templates.event_bar_date = (d)=> "aaaaaaa"; 
                        sch.templates.month_text = (d) => "bbbbb"; 
                        sch.templates.event_day = (d) => "cccc"; 
                        sch.templates.event_bar_day = (d) => "ddddd"; 
                        //sch.templates.event_date = (x,y,z) => "eee"; 

                        //sch.templates.rooms_scale_date = function (date) {
                        //    return sch.templates.week_scale_date(date);
                        //};
                        //let format = scheduler.date.date_to_str("%Y-%m-%d %H:%i"); 
                        //let ff = function (start, end, event) {
                        //    return "<b>Мама родная!:</b> " + event.text + "<br/><b>Start date:</b> " +
                        //        (start) + "<br/><b>End date:</b> " + (end);
                        //};
                        //sch.templates.tooltip_date_format = function (date) {
                        //    let formatFunc = sch.date.date_to_str("%Y-%m-%d %H:%i");
                        //    return formatFunc(date);
                        //}
                        //sch.templates.tooltip = ff;
                        //sch.templates.tooltip_text = ff;
                        //sch.templates.rooms_tooltip_text = ff;

                        function add(ev): number {
                            ev.text = "";
                            let res = db.save({ id: 0, dateFrom: ev.start_date, dateTo: ev.end_date, clientComment: ev.text, roomId: ev.roomId, payForfeit: true}); //roomId: me.roomId,
                            //sch.changeEventId(ev.id, res.id);
                            return res.id;
                        };

                        function isNew(id): boolean {
                            return (typeof (id) != "string");
                            //return !(id < 10000000000);
                        }

                        sch.attachEvent("onBeforeViewChange", function (old_mode, old_date, mode, date) {
                            if (date == old_date) return;
                            me.currentDate = date;
                            //me.checkDate()
                            me.refresh();
                            return true;
                        });

                        sch.attachEvent("onBeforeEventCreated", function (e) {
                            //alert("Запрещено создание новых бронирований");
                            //console.log("onBeforeEventCreated");
                            let allow = logic.allowCreate();
                            return allow;
                        });

                        sch.attachEvent("onEventAdded", function (id, ev, x) {
                            //add(ev);
                            //sch.editStop(ev.id);
                            //if (models.orderRules.time.allowTime(ev.start_date, ev.end_date, ev.roomId))

                            let base = me.baseList.getItem();
                            let allow = logic.allowCreate();  // чтобы обойти баг в 56009
                            
                            if (allow && rooms.db.allowTime(ev.start_date, ev.end_date, ev.roomId, base.id, base.domainId))
                                sch.showLightbox(ev.id);
                            else
                                sch.deleteEvent(id);
                            //return add(ev);
                        });

                        // see: https://docs.dhtmlx.com/scheduler/api__scheduler_onbeforeeventchanged_event.html
                        sch.attachEvent("onBeforeEventChanged", function (ev, obj, is_new) {  //
                            if (is_new || ev.status === 0) 
                                return true;

                            It.UI.w.error("Нельзя передвигать бронь со статусом");
                            return false;
                        });

                        //sch.attachEvent("onBeforeEventChanged", function (ev) {  //
                        sch.attachEvent("onEventChanged", function (id, ev) {  //
                            if (isNew(ev.id)) return ev;

                            //console.log("changing event: ", ev.id);
                            //It.Web.saveUpdate(models.orders.type.saveUrl()+"/"+ev.id, {id: ev.id, dateFrom: ev.start_date, dateTo: ev.end_date});
                            db.save({ id: ev.id, dateFrom: ev.start_date, dateTo: ev.end_date, clientComment: ev.text, roomId: ev.roomId, });
                            //console.log("changed event: ", ev.id);
                            return ev;
                        });

                        sch.attachEvent("onBeforeEventDelete", function (id, ev) {
                            //any custom logic here
                            if (isNew(id)) return true;
                            if (!logic.allowDelete(ev)) {
                                alert("Нельзя удалять бронь");
                                return false;
                            }
                            let can = confirm("Удалить бронь?");
                            return can;
                        });

                        sch.attachEvent("onEventDeleted", function (id, ev) {
                            if (!isNew(id))
                                db.archive(id);
                        });

                        // Конфигурируем окно быстрого отображения редактора брони
                        let popup = webix.ui({
                            view: "popup",
                            //id: "my_popup",
                            //position: "top", //or "" center
                            top: 10,
                            left: 300,
                            body: me.itemView.$config(),
                        });

                        // прикрепляемся к событию клик на Event, и блокируем дальнейшую цепочку событий
                        sch.attachEvent("onClick", (id, e) => {
                            (<any>popup).show({ x: e.clientX + 10, y: e.clientY });
                            me.itemView.$reload(id);
                            return false;
                        });

                        // функция для редактирования в окне
                        me.itemView.OnEdit.on(id => editor.edit(id));
                        me.itemView.OnDelete.on(id => sch.deleteEvent(id));

                        sch.showLightbox = function (id, ev1) {
                            let ev = this.getEvent(id);
                            if (!logic.allowLightboxEdit(ev))
                                return It.UI.w.error("Данную бронь запрещено редактировать");
                            if (isNew(id))
                                id = add(ev);
                            if (popup.isVisible()) popup.hide(); // гасим окно быстрого реагирования
                            editor.edit(id);
                        };

                        //let dp = new dataProcessor("api/orders/save/");
                        //dp.init(dhtmlScheduler);
                    },

                    ready: function () {
                        me.refresh();
                        //me.dhtmlScheduler.load(models.orders.getOrdersUrl());
                        //this.loaded = true;  
                        let el = document.getElementsByClassName("dhx_cal_today_button");
                        let item = el.item(0);
                        item.innerHTML = scheduler.locale.labels.dhx_cal_today_button;
                    }
                };

            let view = $u.rows(
                $u.panelbar(
                    //$.label("Бронирование заказов"),
                    $u.tabs( 
                        { id: MODE.Day, value: "День", width: 60 },
                        { id: MODE.Week, value: "Неделя", width: 60 },
                        { id: MODE.Month, value: "Месяц", width: 70 }
                    ).Size(300).OnChange(id => this.setMode(id)),
                    //$.button("Месяц").Click(() => this.setMode("month")),
                    //$.button("Неделя").Click(() => this.setMode(MODE_ROOMS_WEEK)),
                    //$.button("День").Click(() => this.setMode(MODE_ROOMS_DAY)),
                    //{},
                    $u.element("date").Label("На дату", null, 80).AsDate().Ref(this.date).OnChange(d => this.dateChange(d)).Value(new Date()).Size(200),
                    $u.element("base").Label("База", null, 50).AsSelect(listbases, "richselect").Ref(this.baseList).OnChange((id) => this.refresh()),
                    $u.icon("arrow-left").Tooltip("Предыдущая база").Click(() => this.baseList.skipSelection(-1)),
                    $u.icon("arrow-right").Tooltip("Следующая база").Click(() => this.baseList.skipSelection(1)),
                    $u.icon("refresh").Tooltip("Перезачитать данные с сервера").Click(() => this.refresh()),
                    $u.icon("trash").Tooltip("Удалить брони без статуса").Click(() => this.clearOrders())
                ),
                //{ view: "label", label: "Изменились данные на сервере. Пожалуйста, обновите данные", align: "left", css: "it-warning", id: this.warning.id, visible: false, },
                schedulerViewCfg
            );
            return view;
        }

        private loaded = false;

        $init() {
            this.baseList.selectFirst();
            this.loaded = true;
            setTimeout(_ => _webix.require.disabled = false, 1000);
        }

        $activate(args) {
            super.$activate(args); 
            //if (!first && this.autorefresh) this.grid.refresh();
            if (args.base) {
                if (this.dhtmlScheduler) resizeBrowser();
                this.baseList.setValue(args.base);
            }
            if (args.date) {
                this.currentMode = MODE.Day;
                this.date.setValue(parseDate(args.date));
            }
        }

        refresh() {
            //let dhtmlScheduler = this.scheduler.ref._scheduler;

            // load sections
            let base = this.baseList.getItem(); 
            if (!base) return;

            db.calendarUpdates.reset("base-" + base.id);
            //this.warning.visible(false);

            if (!this.loaded || !this.dhtmlScheduler) return;

            //let rules = rules;
            this.dhtmlScheduler.config.time_step = logic.getTimeStep(base);
            this.dhtmlScheduler.config.hour_size_px = logic.getHourSize(base);
            let sections = this.sections.filter(x => x.base == base.id).sort((x,y) => x.order - y.order );
            this.dhtmlScheduler.updateCollection("units1", sections);
            this.dhtmlScheduler.updateCollection("units2", sections);

            // block times
            this.dhtmlScheduler.deleteMarkedTimespan();

            let times2 = [0];
            let lastTime = 0; 

            if (this.currentMode == MODE.Day) {

                const SECS = 60;

                let weekend = days.db.isWeekend(this.currentDate);
                let times: any[] = weekend ? base.weekendHours : base.workHours;
                //let tt1 = weekend ? base.weekendHours.from : base.workHours.from;
                //let tt2 = weekend ? base.weekendHours.to : base.workHours.to;

                times.forEach(x => {
                    if (x.from == lastTime) {
                        times2.pop();
                        times2.push(x.to * SECS);
                    }
                    else {
                        times2.push(x.from * SECS);
                        times2.push(x.to * SECS);
                    }
                    lastTime = x.to;
                });

                if (lastTime == 24)
                    times2.pop();
                else
                    times2.push(24 * SECS);

                let config1 = {
                    days: "fullweek",
                    //zones: [0, tt1 * SECS, tt2 * SECS, 24 * SECS],  //arr, //[4 * 60, 8 * 60, 12 * 60, 15 * 60], //"fullday",
                    zones: times2,
                };

                // устанавливаем границы часов, слегка увеличивая интервал (чтобы все влезло)
                if (times && times.length > 0) {  // этот вариант оставил для истории
                    this.dhtmlScheduler.config.first_hour = times[0].from;
                    this.dhtmlScheduler.config.last_hour = times[times.length - 1].to + 0.1;
                }
                //if (times && times2.length > 1) {  // переписал пред.вариант на arr, тк часы не удалялись https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/16000/
                //    this.dhtmlScheduler.config.first_hour = times2[0].from;
                //    this.dhtmlScheduler.config.last_hour = times2[times2.length - 1].to + 0.1;
                //}

                this.dhtmlScheduler.blockTime(config1);
            }

            let d = this.getLastDate();
            let list = db.calendar(base.id, this.currentDate, d);


            this.dhtmlScheduler.clearAll();
            this.dhtmlScheduler.parse(list, "json");

            if (this.dhtmlScheduler._date)
                this.dhtmlScheduler.updateView(); // hack to check ability

        }

        private getLastDate() {
            let d = this.currentDate;
            if (this.currentMode == MODE.Week)
                d = d.addDays(6);
            else if (this.currentMode == MODE.Month)
                d = d.addMonth(1);
            return d;
        }

        private checkUpdates() {
            let hasUpdates = db.calendarUpdates.has();
            console.log("update", hasUpdates);
            //this.warning.visible(hasUpdates);

            if (hasUpdates) {
                this.refresh();
                webix.message("Календарь обновлен");
            }
        }

        private dateChange(d) {
            this.currentDate = d;
            this.checkDate();
            if (this.dhtmlScheduler)
                this.dhtmlScheduler.setCurrentView(this.currentDate, this.currentMode);
            else
                setTimeout(() => this.dateChange(d), 1000);
        }

        private clearOrders(): void {
            if (!confirm("Удалить брони без статуса в календаре?")) return;
            let d = this.getLastDate();
            let base = this.baseList.getItem();
            let res = db.clearCalendar(base.id, this.currentDate, d);
            this.refresh();
        }

        private setMode(mode: string) {
            this.currentMode = mode;
            this.checkDate();

            this.dhtmlScheduler.setCurrentView(this.currentDate.addDays(1/100), mode);
            this.refresh();
        }

        private checkDate() {
            if (this.currentMode == MODE.Week)
                this.currentDate = this.currentDate.addDays(1 - this.currentDate.getDay());
        }


    }

}

