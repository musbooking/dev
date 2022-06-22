module days {

    //export function create(typeid: string): any {
    //    if (typeid == "grid") return new GridView();
    //}


    export let create = {
        grid: () => new GridView(),
    }


    class DaysSource extends app.AppDataSource {
        //itemsUrl = this.url("list");

        private days: any[];

        //reset() {
        //    this.days = undefined;
        //}

        isWeekend(date: Date) {
            if (!this.days) this.days = this.list();

            //let daysDay = _.find(this.days, x => x.date.getTime() == date.getTime());
            //let daysDay = _.find(this.days, x => dateDiff.inHoursAbs(x.date, date)<24); 
            let sdate = webix.i18n.dateFormatStr(date);
            let daysDay = this.days.find(x => webix.i18n.dateFormatStr(x.date) == sdate);
            if (!daysDay)
                return date.isWeekend();
            else
                return daysDay.isWeekend;
        }

    }
    /**
        * Сервис работы с праздничными датами
        */
    export let db = new DaysSource("days");
   
}