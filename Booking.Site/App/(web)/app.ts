declare let signalR;
module app {
    console.log("booking-ap-lib: v2022-06-09 (1)");
    webix.i18n.setLocale('ru-RU');
    //It.Web.DateOffset = 3  // для корректировки смещения запросов 79725- пока отменен

    It.UI.coreLocale.Err.AccessError = 'Нет прав или истек срок действия для Вашего аккаунта. <p/>Для возобновления работы необходимо выполнить вход повторно' +
        'Выполнить вход'.link('access#!/access/login').tag('h3', { style: 'background-color: orange; margin: 10px;' }) + 
        //'Или перегрузить браузер'.link('#!/booking/reload').tag('h6');
		'Или перейти в Начало работы'.link('/').tag('h6');

    // устанавливаем WebSource.base, для того, чтобы проходили АПИ запросы
    if (location.hostname == "" || location.hostname == 'localhost') {
        It.Web.WebSource.base = location.protocol + '//' + location.host  //.href.substring(0, location.href.length-1)  //"https://localhost:5001"; 
	}
	//else { // for DEMO site
	//	It.Web.WebSource.base = "https://dev.musbooking.com"; 
	//	//_webix.require.disabled = true;
	//	//webix.codebase = "http://cdn.webix.com/components/scheduler/";
	//}
    (<any>webix).require.disabled = true
    // It.Web.timeout = 3000
     
     
    // http://localhost:5000/access#!/access/login 

    //if (navigator.platform.indexOf("Mac")==-1 && webix.ui.scrollSize) //!webix.env.touch &&
        //webix.CustomScroll.init();

    //$.config.padding = 5;
    //system.config.allowEditOperations = access.user && access.user.isAdmin;
    //ghjgjhgj
    //auth.dbauth.prefix = auth.dbpermissions.prefix = auth.dbroles.prefix = auth.dbusers.prefix = "api/";
      
    export function init() {
        let _webix: any = webix;

        if (webix.env.mobile) {
            webix.skin.set('touch');
        }
        else {
            //// skin http://webix.com/skin-builder/d83ae259
            ////[Skin Customization]
            //webix.skin.compact.barHeight = 34;
            //webix.skin.compact.tabbarHeight = 34;
            //webix.skin.compact.rowHeight = 24;
            //webix.skin.compact.listItemHeight = 28;
            //webix.skin.compact.inputHeight = 30;
            //webix.skin.compact.layoutMargin.wide = 5;
            //webix.skin.compact.layoutMargin.space = 5;
            //webix.skin.compact.layoutPadding.space = 5;
            //webix.skin.set('compact'); 
            It.UI.Configs.defaults.padding = 5; 
        }

        _webix.require.disabled = true;
        //webix.codebase = "./assets/"; //http://cdn.webix.com/components/scheduler/";

        //auth_logins.tokens.AUTH_PREFIX = "Token";


        //auth_logins.dbauth.check();
        It.Web.auth.tokens.check();
        access.checkLogin();
        system.loadContext();
        help.load();

        It.Web.bindSocket('changes', (system.context || { login: 'guest' }).login, data =>
            console.log('socket changes:', data)
        );  

        //webix.message('111111 2')  
    } 
 
    export function run() {
        new $u.HtmlView("http->html/intro.html", "Краткое описание").show(); 
    }

    export let create = {
        default:  () =>new $u.HtmlView('http->'+It.Web.WebSource.base+ '/html/start.html', "Начало работы"), // 
        default1: () => new $u.HtmlView('http->'+It.Web.WebSource.base+ '/cms/hello.html', "Начало работы"), 
        html:  () =>new $u.HtmlView(), 
    }       

    //export let connection = new signalR.HubConnection('/chat');

    //connection.on('send', data => {
    //    console.log(data);
    //});

    //connection
    //    .start()
    //    .then(() => connection.invoke('send', "browser: " + navigator.userAgent));



}