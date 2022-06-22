module auth {


    export let oper = {
        // lists
        lists: "lists", //l01
        listBases: "list-bases", // l02
        equipments: "list-eq", // l03
        eqRest: "eq-rest", // l04
        promo: "promo", //l05
        days: "days", //l06
        orderPromo: "order-promo", //l07
        statisticPromo: "statistic-promo", //l08
        basesAll: "bases-all", // l09
        cameras: "cameras", // l10
        groups: "crm-lists", // l11

        clients: "clients",  // l12
        clientFin: "client-fin", // l13
        clientDiscBan: "l14", // l14

        expGroups: "exp-groups", // l15
        reviews: "reviews",

        crmView: "crm-view",
        crmEdit: "crm-edit",
        //crmList: "crm-list",  // справочники CRM

        orders: "orders",
        orderNew: "order-new",
        orderFullAccess: "order-full",
        orderPay: "order-pay",
        orderPoints: "order-points",
        orderForfeit: "order-forfeit",
        orderEdit: "order-edit",
        orderEditHold: "order-edit-payd",
        orderEditGroup: "order-edit-group",
        orderHistory: "order-history",

        orderCancel: "order-cancel",
        orderCancelAny: "order-cancel-any",
        orderDelete: "order-delete",
        orderViewQuick: "order-view-quick",
        orderViewFull: "order-view-full",

        accounts: "accounts",
        anyReportDate: "accounts-all-dates",
        transEdit: "trans-edit",

        abonements: "abonements",
        abonementEdit: "ab-edit",
        abonementDel: "ab-del",
        abonementOrderEdit: "ab-order-edit",
        abonementOrderCalc: "ab-order-calc",
        abonementOrderCreate: "ab-order-create",
        orderReserv: "ab-order-reserv",
        abonementOrderPay: "ab-order-pay",

        expDocs: "exp-docs",
        expDocsAdmin: "exp-docs-admin",

        users: "users",
        domainsEdit: "domains-edit",
        anyIP: "any-ip",
        editIP: "ip-edit",
        domainsAll: "domains-all", // l09
    }

    let groups = {
        lists: "Справочники",
        calendar: "Календарь",
        crm: "CRM",
        orders: "Бронь",
        account: "Учет и Отчеты",
        abonements: "Абонементы",
        admin: "Администрирование",
    };


    export let opers = [
        { id: oper.lists, value: "Настройка справочников", group: groups.lists, description: "Общий доступ к редактированию справочников" },
        { id: oper.listBases, value: "Настройка баз и комнат", group: groups.lists, description: "Редактирование справочника баз и комнат" },
        { id: oper.equipments, value: "Настройка позиций", group: groups.lists, description: "Редактирование справочника позиций и типов позиций" },
        { id: oper.basesAll, value: "Доступ все базы", group: groups.lists, description: "предоставление доступа к любой базе" },
        { id: oper.days, value: "Редактирование дат", group: groups.lists, description: "редактирование праздничных дат для календаря", super: true },
        { id: oper.promo, value: "Управление промокодами", group: groups.lists, description: "Редактирование списков промокодов" },
        { id: oper.cameras, value: "Камеры", group: groups.lists, description: "Доступ к камерам базы" },
        { id: oper.groups, value: "CRM справочники", group: groups.lists, description: "Справочники CRM системы", super: true },
        { id: oper.expGroups, value: "Статьи расходов", group: groups.lists, description: "Ввод статей расходов для указания в расходных документах" },

        { id: oper.crmView, value: "CRM-справочники", group: groups.crm, description: "Доступ к CRM справочниками", super: true  },
        { id: oper.crmEdit, value: "CRM-редактирование", group: groups.crm, description: "Редактированиеs CRM данных", super: true },
        { id: oper.clients, value: "Клиенты", group: groups.crm, description: "Поиск и работа с карточками клиентов" },
        { id: oper.clientFin, value: "Финансы клиента", group: groups.crm, description: "Редактирование финансовых параметров клиентов" },
        { id: oper.clientDiscBan, value: "Скидка, блок клиента", group: groups.crm, description: "Редактирование полей скидки и блокировки клиентов" },
        //{ id: oper.crmList, value: "CRM-справочники", group: groups.crm, description: "Редактированиеs справочников CRM", super: true },

        { id: oper.orderEdit, value: "Редактирование календаря", group: groups.calendar, description: "Открытие брони на редактирование в календаре" },
        { id: oper.orderViewQuick, value: "Краткий формат календаря", group: groups.calendar, description: "Отображение минимальной информации по брони в календаре" },
        { id: oper.orderViewFull, value: "Полный формат календаря", group: groups.calendar, description: "Отображение полной информации по брони в календаре" },

        { id: oper.orders, value: "Бронирование", group: groups.orders, description: "Общие операции с бронью" },
        { id: oper.orderNew, value: "Создание брони", group: groups.orders, description: "Возможность создания новых броней в календаре" },
        { id: oper.orderEditHold, value: "Редактирование опл. брони", group: groups.orders, description: "Возможность редактирования оплаченной брони с пересчетом" },
        { id: oper.orderEditGroup, value: "Редактирование опций", group: groups.orders, description: "Возможность редактирования опций" },
        { id: oper.orderHistory, value: "Просмотр истории", group: groups.orders, description: "Просмотр истории бронирования" },
        { id: oper.orderPromo, value: "Выбор промокода", group: groups.orders, description: "Редактирование промокода в карточке брони" },
        { id: oper.orderReserv, value: "Резерв брони", group: groups.orders, description: "Резервирование брони" },
        { id: oper.orderCancel, value: "Отмена брони (правила)", group: groups.orders, description: "Выставление статуса Отмены у брони" },
        { id: oper.orderCancelAny, value: "Отмена брони (любая)", group: groups.orders, description: "Отмена брони без проверки правил" },
        { id: oper.orderPay, value: "Оплата брони", group: groups.orders, description: "Выставление статуса Оплаты у брони" },
        { id: oper.orderForfeit, value: "Подтверждение штрафов", group: groups.orders, description: "Подтверждение штрафа у брони" },
        { id: oper.orderPoints, value: "Списание баллов", group: groups.orders, description: "Возможность списания баллов" },
        { id: oper.orderDelete, value: "Удаление брони", group: groups.orders, description: "Удаление брони из списков и календаря", super: true, },
        { id: oper.orderFullAccess, value: "Любая операция с бронью", group: groups.orders, description: "Возможность резервирования, редактирования и удаления брони в любом статусе, в т.ч и оплаченной" },
        { id: oper.reviews, value: "Отзывы по брони", group: groups.orders, description: "Работа с отзывами клиента по брони" }, 

        { id: oper.accounts, value: "Движение денег", group: groups.account, description: "Доступ к отчету о движении денег" },
        { id: oper.transEdit, value: "Редактирование транзакций", group: groups.account, description: "Возможность просмотра и редактирования тразнакций", super: true },
        { id: oper.anyReportDate, value: "Движение - любой период", group: groups.account, description: "Возможность выставления любого периода в отчете о движении денег" },
        { id: oper.statisticPromo, value: "Статистика промокодов", group: groups.account, description: "Отчет по статистике клиентов" },
        { id: oper.eqRest, value: "Остатки ооборудования", group: groups.account, description: "Доступ к отчету об остатках оборудования на текущий момент" },
        { id: oper.expDocs, value: "Расходные документы", group: groups.account, description: "Доступ к расходным документам" },
        { id: oper.expDocsAdmin, value: "Расходные документы (Полн)", group: groups.account, description: "Полный доступ к редактированию расходных документов по базам" },

        { id: oper.abonements, value: "Абонементы", group: groups.abonements, description: "Доступ к разделу 'Абонементы'" },
        { id: oper.abonementEdit, value: "Абон-Редактирование", group: groups.abonements, description: "Редактирование данных абонемента" },
        { id: oper.abonementDel, value: "Абон-Удаление", group: groups.abonements, description: "Удаление абонемента" },
        { id: oper.abonementOrderCreate, value: "Абон-Добавление брони", group: groups.abonements, description: "Добавление брони в абонементах" },
        { id: oper.abonementOrderEdit, value: "Абон-Изменение брони", group: groups.abonements, description: "Абонемент - изменение реквизитов брони в окне детальной информации" },
        { id: oper.abonementOrderCalc, value: "Абон-Пересчет брони", group: groups.abonements, description: "Перерасчет брони в абонементе" },
        { id: oper.abonementOrderPay, value: "Абон-Оплата брони", group: groups.abonements, description: "Оплата брони в абонементе" },

        { id: oper.users, value: "Настройка пользователей", group: groups.admin, description: "Редактирование логинов пользователей" },
        { id: oper.domainsEdit, value: "Настройка партнеров", group: groups.admin, description: "Редактирование настроек партнеров", super: true },
        { id: oper.anyIP, value: "Доступ с любого IP", group: groups.admin, description: "Настройка разрешений для доступа с любого компьютера" },
        { id: oper.editIP, value: "Настройки IP", group: groups.admin, description: "Настройка фильтров IP" },
        { id: oper.domainsAll, value: "Все партнерские зоны", group: groups.admin, description: "Доступ ко всем партнерским зонам", super: true },
    ];

    //operations.oper = AccessOperations;

    // default roles
    export let roles = {
        super: "super",
    }

}