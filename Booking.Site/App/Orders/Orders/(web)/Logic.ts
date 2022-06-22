module orders {

    let acc = auth.oper;
    let sts = orders.OrderStatus;

    //let now = new Date();
    //let nowDate = now.toDateString();

    let fullAccess = () => system.context.isSuper || system.context.allow(acc.orderFullAccess);

    /**
     * Правила работы с заказами
     */
    class Logic {

        getHourSize(base): number {
            //if (base && base.type == bases.baseType.Dance)
            //    return 88;
            //else
                return 44;
        }

        getTimeStep(base): number {
            if (!base) return 60;
            //if (base.type == bases.baseType.Dance) return 30;
            return 60;
        }

        //getBitrixUrl(clientId) {
        //    let url = `https://hendrix.bitrix24.ru/crm/contact/show/${clientId}/`;
        //    return url;
        //}

        //private static SOURCES = ['question', 'fa-user', 'fa-user-plus', 'fa-users'];
        private static GROUPS = ['question', 'fa-user', 'fa-user-plus', 'fa-users'];

        getEventTemplate(start, end, ev) {
            let res = ""

            let comment = (ev.text + "").trim();
            if (comment != "")
                res += `<span class='fa fa-comment'/> `;

            switch (ev.sourceType) {
                case orders.SourceType.Mobile:
                //case orders.SourceType.MobilePre:
                case orders.SourceType.Catalog:
                    res += `<span class='fa fa-mobile' />`;
                    break;
                case orders.SourceType.Widget:
                //case orders.SourceType.WidgetPre:
                    res += `<span class='fa fa-table' />`;
                    break;
                case orders.SourceType.Bot:
                    res += `<span class='fa fa-comments' />`;
                    break;
                default:
                    break;
            }

            if (ev.abonementId)
                res += `<span class='fa fa-calendar' />`.link(`#!/abonements/edit/?oid=${ev.abonementId}`);
                //res += "(абон) ".link(`#!/abonements/edit/?oid=${ev.abonementId}`);

            let sgroup = `<span class='fa ${Logic.GROUPS[ev.group]}' ></span>`;
            if (ev.clientId && system.context.allow(auth.oper.clients))  
                res += `<a href='#!/clients/edit?oid=${ev.clientId}'>${ev.name}</a>`;
            else
                res += `${ev.name}`;

            res += `,${sgroup} ${ev.totalSum} руб. (опл ${ev.totalPays}, в тч ${ev.paidForfeit} штраф) ${ev.types}`;

            let text = (ev.text + "").trim();
            if (text)
                res += ` [<i>${text}</i>]`;

            //if (access.user.allow(acc.orderViewFull))
            //    res += `<a href='${clients.db.bitrixTemplate}/${ev.clientBitrixNum}/' target='_blank'>${ev.name}</a>, ${ev.totalSum} руб.<br>${ev.types}<br><i>${ev.text}</i>`;
            //else if (access.user.allow(acc.orderViewQuick))
            //    res += `<b>${ev.name}</b>, ${ev.totalSum} руб.<br>${ev.types}<br><i>${ev.text}</i>`;
            //else
            //    res += `<b>${ev.name}</b>`;
            return res;
        }

        getEventCss(start, end, ev) {
            let css = "it-event it-status-" + ev.status;
            if (ev.payDate)
                css += " it-status-p";

            //ev.color = "lightgrey";

            //let css = `event_${ev.status}`;  // orderStatuses[ev.status].value
            //return css;
            //if (ev.status == 0) // new
            //    ev.color = "#c4c4c4";
            //else if (ev.status == 1) // reserv
            //    ev.color = "BurlyWood";
            //else if (ev.status == 10) // paid - green
            //    ev.color = "#50c878";
            //else if (ev.status == 11) // cancel
            //    ev.color = "LightCoral";
            //else if (ev.status == 100) // Done
            //    ev.color = "Blue";

            //let css = "event";
            //if (ev.abonementId)
            //    css += " event-abonement";
            //else if (ev.sourceType == orders.SourceType.Mobile)
            //    css += " event-mobile";
            return css;
        }

        getStateCss(item) {
            if (item && item.status)
                item.$css = "it-status-" + item.status;
            if (item && item.payDate)
                item.$css += " it-status-p";
        }

        getRequstStateCss(item) {
            if (item && item.requestStatus)
                item.$css = "it-reqstatus-" + item.requestStatus;
        }

        allowFullAccess = () => fullAccess()
        allowAnyReportDay = () => fullAccess() || system.context.allow(acc.anyReportDate)

        allowEditCalendar = () => fullAccess() || system.context.allow(acc.orderEdit)
        allowCreate = () => fullAccess() || system.context.allow(acc.orderNew)
        allowLightboxEdit = (ev) => fullAccess() || !ev.abonementId
        allowDelete = (ev) => fullAccess() || ev.status == sts.Unknow || ev.status != sts.Closed && system.context.allow(acc.orderDelete)

        allowEditOrder = (v) => fullAccess() || !v.isHold || system.context.allow(acc.orderCancelAny) //&& system.context.allowShare 58623
        //allowEditOrder = (x) => fullAccess() || x.status != sts.Cancel && x.status != sts.Paid
        //allowEditAfterPaid = (x) => fullAccess() || x.status == sts.Paid && access.user.allow(acc.orderEditPaid)
        allowEditPaidForfeit = (v) => v.fullForfeit &&
            v.fullForfeit != "0" &&
            (fullAccess() || v.status != sts.Closed) //  (data.payForfeit != true || data.status != OrderStatus.Paid),
        allowEditClient = (v) => !v.clientId
        allowGroup = (v) => fullAccess() ||
            system.context.allow(acc.orderEditGroup)  // x.baseType == bases.baseType.Repetition &&
        //allowEditGroup = (x) => fullAccess() ||
        //    x.status == sts.Unknow ||
        //    x.status != sts.Unknow && access.user.allow(acc.orderEditHold)

        allowRemoveEquipments = (v) => fullAccess() ||
            v.status != sts.Closed
        //allowOpenBitrix = (x) => fullAccess() || x.status == statuses.Cancel && x.reason == x.CancelReason.ForfeitsAskConfirm
        allowFullForfeit = (v) => v.fullForfeit && v.status == sts.Cancel && (v.reason == CancelReason.ForfeitsAsk)
        allowViewPromo = (v) => fullAccess() ||
            system.context.allow(acc.orderPromo)
        allowEditPromo = (v) => fullAccess() ||
            v.status != sts.Closed
        allowEditPayDate = (v) => fullAccess()
        allowHold = (v) => v.status == sts.Unknow   // fullAccess() ||
        allowPoints = (v) => fullAccess() ||
            system.context.allow(acc.orderPoints)

        allowDoReserv = (v) => fullAccess() ||
            system.context.allow(acc.orderReserv) && (v.status == sts.Unknow || v.status == sts.Cancel)
        allowDoCancel = (v) => fullAccess() ||
            system.context.allow(acc.orderCancelAny) ||
            system.context.allow(acc.orderCancel) && allowCancelRule(v) // && !check24h(x.dateFrom)
        allowDoCancel_test = (v) => fullAccess() ||
            allowCancelRule(v) // && !check24h(x.dateFrom)
        //allowDoForfeit = (x) => x.status == sts.Reserv && x.dateFrom.toDateString() == nowDate
        allowDoForfeit = (v) => fullAccess() ||
            v.status == sts.Reserv && check24h(v.dateFrom)
        allowDoForfeitConfirm = (v) => fullAccess() ||
            v.reason == CancelReason.ForfeitsAsk && system.context.allow(acc.orderForfeit)  // 54025 запрет менеджерам
        allowDoPaid = (v) => fullAccess() ||
            v.status == sts.Reserv
            && system.context && system.context.allow(acc.orderPay)
            && v.totalPays != v.totalSum 
        allowDoClose = (v) => fullAccess() ||
            v.status == sts.Reserv
            && system.context && system.context.allow(acc.orderPay)
            && v.totalPays == v.totalSum // 54631
    }

    function check24h(d: Date) {
        let dh = It.dateDiff.inHoursAbs(d); 
        return dh <= 24;
    }

    /** Правила отмены брони
     *  -Бронирование совершено заранее - кнопка отмена пропадает за 20 часов до начала бронирования.
        -Бронирование совершено день в день (сегодня) - кнопка отмены пропадает за 3 часа
        -Бронирование совершено в пределах 3 часов от текущего времени - кнопка отмены не пропадает.
     */
    /* 2-й вариант
    0 - Любое бронирование можно отменить без штрафа в течение часа, task https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/17516/
    A - Короткое бронирования (Сегодня(текущая дата) в пределах трех часов) - кнопка отмены не пропадает
    B - Если бронирование было сделано менее 20 ч до начала, и до репетиции более 3ч - кнопка отмены доступна
    C - Бронирование день в день (Сегодня(текущая дата) - кнопка отмены пропадает за 3 часа до начала бронирования.
    D - Обычное бронирование - кнопка отмены пропадает за 20 часов до начала бронирования.
    */
    function allowCancelRule(order) {
        let res = order_rules.db.canCancelBase(order.baseId, order.date, order.dateFrom); // editable || 
        return res.allow;

        ////if (order.dateFrom <= new Date()) return false;  // если уже началось - то гамбец..
        //let df = It.dateDiff.inHoursAbs(order.dateFrom);
        //let dt = It.dateDiff.inHours(order.dateTo);
        //let dd = It.dateDiff.inHours(order.date);
        //let ddf = It.dateDiff.inHoursAbs(order.date, order.dateFrom);
        //let today = new Date().toDateString() == order.dateFrom.toDateString();

        //if (dt > 0) return false; // если заказ уже завершен - отменять нельзя
        //if (dd < 1) return true;  // если заказ сделан менее часа назад - его можно отменить
        //if (today && ddf>0 && ddf <= 3) return true; // если сегодня и меньше 3ч заказ - можно
        //if (today) return df>3; // если за 20ч - 
        ////if (dh <= 3 && ddh <= 24) return false; // если за 3 ч
        //if (ddf < 20 && df > 3) return true; // B - rule
        //return df>=20; 
    }

    export let logic = new Logic();

}
