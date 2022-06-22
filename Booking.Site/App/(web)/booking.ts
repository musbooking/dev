module booking {

    export function run() {
        //$.showTreeView(getMenu(), "manage", app.sections);
        // $.showSideBar(getMenu(), "booking", app.sections);
        let menu = getMenu();
        root(menu);
    }

    //export function create(typeid: string): any {
    //    //if (typeid == "default") return new app.TreeMenuViewer(menu_data); ее
    //    if (typeid == "default") return new $.HtmlView("cms/hello.html"); //html/manage.html
    //    return null;
    //}

    export let create = {
        default: () => new $u.HtmlView("cms/hello.html"),
        //reload: () => {
        //    location.reload(true);
        //    //return new $.HtmlView();
        //    $.Core.openUrl('/');
        //},
    }

    //function find<T>(list: T[], where:  T=> boolean) {  

    //}

    export function root(menu: any[]) {

        let navigator = new $u.Navigator();
        let navbar = new $u.RefUI();
        let sidebar = $u.sidebarMenu(menu);
        let helpBtn = new $u.RefUI();

        sidebar.OnItemSelect(item => {
            if (item.url)
                It.Web.openUrl(item.url);

            navbar.set({ data: { value: item.value || "", description: item.description || "", } });
            document.title = item.value;
        });

        navigator.view.onOpen.on(x => {

            let h = help.config.current(location.hash || "./");
            helpBtn.visible(!!h);
            if (h) {
                helpBtn.set({ tooltip: h.text });
            }

            //helpBtn.visible(h);
            if (!x.init || !x.init.title)
                return;

            let title = x.init.title;
            let data = { value: title, description: "" };

            navbar.set({ data: data });
        });

        function openHelp() {
            It.Web.openUrl(help.config.current().url, null, true);
        }

        let root = {
            padding: 10,
            id: "app-root1",

            rows: [
                //sysheader(),
                header(),
                infoBar(),
                //$.template("Top-panel-3").Size(),

                $u.panelbar(
                    $u.sidebarButton(sidebar),
                    $u.icon("question").Click(_ => openHelp()).Ref(helpBtn),
                    $u.template("<b>#value#</b><span/>  #description#", { value: "", description: "" }).Css("it-header-nav").Ref(navbar).Size(-1,33),
                    $u.icon("close").Click(_ => navigator.close())
                ),

                {
                    responsive: "app-root1",
                    cols: [
                        sidebar.Min(10, 100).extend({ collapsed: webix.env.mobile }),
                        $u.splitter().Visible(!webix.env.mobile),
                        navigator.view.$config().Min(450),
                        //$.splitter().Visible(!webix.env.mobile),
                        //$.template("Right").Size(100),
                    ]
                },
                //$.splitter(),
                footer(),
            ]
        };

        let scroll = {
            view: "scrollview",
            //template: "layout", responsive: true, padding: 15, height1: "100%", autoheight1: true,maxWidth: 1024,
            //scroll: true,
            body: root,
        };

        $u.showView(scroll);

        navigator.routers("app");


        webix.ui.fullScreen();
    }


    function getMenu(): any[] {
        let ctx = system.context;
        if (!ctx) return [
            { value: "Регистрация", url: "#!/domains/reg", description: "Регистрация нового партнера", visible: true, },
        ]; 

        let ops = auth.oper

        let allowSuper = ctx.isSuper //.allowShare === true && ctx.allow(ops.groups);  58623   
        let allowCrmView = allowSuper && ctx.allow(ops.crmView)
        let logged = !!ctx.login
        let allowLists = ctx.allow(ops.lists)
        let allowClients = ctx.allow(ops.clients)
        let allowDomains = ctx.allow(ops.domainsEdit)
        let allowUsers = ctx.allow(ops.users)
        let allowOrders = ctx.allow(ops.orders)
        let allowPromo = ctx.allow(ops.promo)
        let allowDomainsAll = ctx.allow(ops.domainsAll)
        let allowReports = allowOrders
        //let allowSuperAdmin = ctx.isAdmin;   
         
        //let viewListMenu = allowLists || 
         
        let menu_data = [
            {
                value: "Справочники", url: "#!/app/lists", icon: "table", description: "Общие справочники системы", visible: allowLists && allowSuper, data: [
                    { value: "Сферы деятельности", url: "#!/spheres/list", description: "Сферы деятельности", visible: allowLists, },
                    { value: "Типы фильтрации", url: "#!/groups/ftypes", description: "Типы фильтрации", visible: allowLists, },
                    { value: "Параметры комнат", url: "#!/groups/features", description: "Ввод параметров (особенностей) комнаты", visible: allowLists, },
                    { value: "Типы позиций", url: "#!/groups/equipments", description: "Ввод типов позиций", visible: allowLists, },
                    { value: "Опции брони", url: "#!/groups/options", description: "Опции бронирования", visible: allowLists, },
                    { value: "Даты", url: "#!/days/grid", description: "Праздники и выходные", visible: allowLists },  // allowShare && ctx.allow(ops.days)
                ],
            },
            {
                value: "Справочники", url: "#!/app/lists", icon: "table", description: "Общие справочники системы", visible: allowLists && !allowSuper, data: [
                    { value: "Базы", url: "#!/bases/grid", description: "Редактирование баз", visible: ctx.allow(ops.listBases), },
                    { value: "Комнаты", url: "#!/rooms/grid", description: "Редактирование комнат", visible: ctx.allow(ops.listBases), }, //objid: 1,
                    { value: "Позиции", url: "#!/equipments/grid", description: "Ввод позиций", visible: ctx.allow(ops.equipments), },
                    { value: "Камеры", url: "#!/resources/cameras", description: "Просмотр камер", visible: ctx.allow(ops.cameras), },
                    { value: "Статьи расходов", url: "#!/groups/expenses", description: "Ввод статей расходов", visible: ctx.allow(ops.expGroups), },
                    { value: "Способы оплаты", url: "#!/paychannels/grid", description: "Каналы оплат", visible: allowUsers, },
                    //{ value: "Правила отзывов", url: "#!/groups/reviews", description: "Ввод справочника по правилам отзывов", visible: ctx.allow(allowSharedGroups), },
                    //{ value: "Фин.группы", url: "#!/groups/fin", description: "Ввод регистров, операций", visible: ctx.allow(ops.expGroups), },
                ]
            },

            { // CRM for domain users
                value: "CRM", url: "#!/app/lists", icon: "users", description: "Управление клиентами", visible: logged && !allowSuper, data: [
                    { value: "Клиенты", url: "#!/clients/list", description: "Поиск клиентов", visible: allowClients, },
                    { value: "Группы клиентов", url: "#!/groups/clients", description: "Справочник групп клиентов", visible: allowLists, },
                ]
            },
            { // CRM for super
                value: "CRM", url: "#!/app/lists", icon: "users", description: "Управление клиентами", visible: logged && allowSuper, data: [
                    { value: "Клиенты", url: "#!/clients/list", description: "Поиск клиентов", visible: allowClients, },
                    { value: "Анализ клиентов", url: "#!/clients/totals", description: "Анализ клиентской базы", visible: allowCrmView, },
                    { value: "Группы клиентов (все)", url: "#!/groups/allclients", description: "Справочник всех групп клиентов", visible: allowCrmView, },
                    { value: "Виды деятельности", url: "#!/groups/client-types", description: "Справочник видов деятельности", visible: allowCrmView, },
                    { value: "Города", url: "#!/groups/cities", description: "Справочник городов", visible: allowCrmView, },
                    { value: "Стили танцев", url: "#!/groups/styles", description: "Справочник стилей танцев", visible: allowCrmView, },
                    { value: "Инструменты", url: "#!/groups/tools", description: "Справочник музыкальных инструментов", visible: allowCrmView, },
                    //{ value: "Виды деятельности", url: "#!/groups/activities", description: "Справочник видов деятельности", visible: allowSharedGroups, },
                    { value: "Жанры", url: "#!/groups/genres", description: "Справочник жанров", visible: allowCrmView, },
                    { value: "Уровень навыков", url: "#!/groups/sources", description: "Справочник уровней навыков", visible: allowCrmView, },
                ]
            },

            {
                value: "Цены и промоакции", url: "#!/app/lists", icon: "dollar", description: "Прайсы, цены, и промоакции", visible: allowPromo, data: [
                    { value: "Промоакции (коды)", url: "#!/promo/codegrid", description: "Ввод числовых промоакций для мобильных", visible: allowSuper && allowPromo },
                    { value: "Правила отмены (общ) ", url: "#!/order_rules/grid", description: "Правила отмены брони (общие)", visible: allowSuper && allowPromo  },
                    { value: "Цены", url: "#!/prices/grid", description: "Все базовые цены общим списком", visible: allowPromo && !allowSuper  },
                    { value: "Условия", url: "#!/promo/rulesgrid", description: "Ввод условий ценообразования", visible: allowPromo && !allowSuper  },
                    { value: "Правила отмены", url: "#!/order_rules/grid", description: "Правила отмены брони", visible: allowPromo && !allowSuper  },
                    { value: "Промоакции (кампании)", url: "#!/promo/actgrid", description: "Ввод списков промоакций", visible: allowPromo && !allowSuper  },
                    { value: "Горящие репетиции", url: "#!/promo/hotgrid", description: "Ввод горящих репетиций", visible: allowPromo && !allowSuper  },
                    { value: "Автоскидки", url: "#!/discounts/grid", description: "Автоматические скидки на клиентов", visible: allowPromo && !allowSuper , },
                ]
            },

            {
                value: "Бронирование", url: "#!/app/lists", icon: "calendar", description: "Операции с бронью", visible: allowOrders && allowSuper, data: [
                    { value: "Отзывы (модерация)", url: "#!/reviews/grid-all", description: "Модерация рейтингов и отзывов", visible: allowOrders && allowSuper },
                ]
            },


            {
                value: "Бронирование", url: "#!/app/lists", icon: "calendar", description: "Операции с бронью", visible: allowOrders && !allowSuper, data: [
                    { value: "Календарь", url: "#!/orders/calendar", description: "Бронирование заказов", visible: allowOrders && !allowSuper  },
                    { value: "Заявки", url: "#!/orders/requests", description: "Управление заявками", visible: allowOrders && !allowSuper  },
                    { value: "Абонементы", url: "#!/abonements/grid", description: "Управление абонементами", visible: ctx.allow(ops.abonements) && !allowSuper },
                    { value: "Штрафы (подтв)", url: "#!/orders/ask-grid", description: "Запросы на подтверждение штрафов у диспетчеров", visible: ctx.allow(ops.orderForfeit) && !allowSuper},
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
                    //{ value: "Промокоды", url: "#!/promo/grid", description: "Ввод промокодов", visible: allowPromo },
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
                    //{ value: "О системе", url: "#!/app/default1", description: "Кратко о системе", visible: logged, },
                ]
            },

        ];
        return menu_data;
    }

    function infoBar(): any {
        if (system.context) {
            let ctx = system.context;
            if (ctx.isLimit)
                return $u.label("Доступ к системе заблокирован").Css("it-error").Size(-1);

            if (ctx.isLimit0) {
                let txt = `До окончания срока действия системы осталось ${ctx.remains} дн. <br/>
${ webix.i18n.dateFormatStr(ctx.limitDate)} (7 дней с выставленного срока в разделе партнеры) платформа будет заблокирована. 
Продление доступа к платформе производится в разделе "Кабинет" `;
                return $u.template(txt).Css("it-error").Size(-1);
            }
        }
        return { height: 1 };
    }
     
    //function sysheader() {
    //    return $.cols(
    //        {},
    //        system.btLoginName().Size(70), //.Align("right"),
    //        system.btLoginOut().Size(60),
    //    );
    //}

    function header(): any {
        let popup = new $u.RefUI();

        let cfg = $u.cols(
            $u.template('img/logo-2018.png'.img({ class: 'it-header-img-top' }).link("./") ),
            {},
            //$.rows(
            //    $.template("Hendrix Studio".addLink("./").addTag("h1")),
            //    $.template("Система бронирования репетиционных комнат и танцевальных залов ").Css("it-header")
            //).Type("clean").Padding(0,-15),
            //$.rows(
            //    system.menuLinks(),
            //    {}
            //).Size(150)
            auth_logins.btLoginName(system.context.login + (system.context.isSuper ?' (super)':'')).Size(90), //.Align("right"),
            auth_logins.btLoginOut("access").Size(60),
        ).Type("clean").Size(0, 40);
        return cfg;
    }

    function footer() {
        if (!system.context?.browser ) return {};
        let copyright = system.context.browser.copyright; //"© MusBooking".addLink("http://www.hendrixstudio.ru/", { target: "blank" }) + " 2016";

        return $u.template(copyright).Size();
    }


}