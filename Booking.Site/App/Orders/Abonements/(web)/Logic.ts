module abonements {

    let acc = auth.oper;
    let statuses = orders.OrderStatus;
    let fullAccess = () => system.context.allow(acc.orderFullAccess);

    class Logic {

        allowEdit = (x) => fullAccess() || system.context.allow(acc.abonementEdit)
        allowDelete = () => fullAccess() || system.context.allow(acc.abonementDel)

        allowGroup = (x) => true //x.baseType == bases.baseType.Repetition
        //allowEditClient = (x) => fullAccess() || !x.client 
        allowEditClient = (x) => fullAccess() || !x.clientId
        //allowOpenBitrix = (x) => x.client
        allowForfeit = (x) => x.forfeit && x.forfeit != "0"

        allowOrderCreate = (x) => fullAccess() || system.context.allow(acc.abonementOrderCreate)
        allowOrderEdit = (x) => fullAccess() || system.context.allow(acc.abonementOrderEdit)
        allowOrderRecalc = (x) => fullAccess() || system.context.allow(acc.abonementOrderCalc) && (!x.status || !x.isHold)
        allowOrderReserv = (x) => fullAccess() ||
            system.context.allow(acc.orderFullAccess) ||
            system.context.allow(acc.orderReserv) && (!x.status || x.status == statuses.Unknow || x.status == statuses.Cancel)
        allowOrderPay = (x) => fullAccess() || system.context.allow(acc.abonementOrderPay)
        allowOrderDel = (x) => fullAccess() || x.status == statuses.Unknow
    }

    export let logic = new Logic();

}