module app {


    export class AppDataSource extends It.Web.WebSource {
        //constructor(url, prefix = "api/") {
        //    super(prefix + url);
        //}

        list(args?) {
            return super.load("list", args);
        }

        //names(args?) {
        //    return super.load("names", args);
        //}
         
        archive(id): boolean {
            return this.post("archive", { id }); 
        }
    }

    export class UpdatesSource extends app.AppDataSource {
        reset(name = "") {
            if (name) this.name = name;
            this.hash = this.getLastUpdateHash(this.name);
        }

        has(reset = false) {
            let hash = this.getLastUpdateHash(this.name);
            console.log("check: ", hash, this.hash);
            return hash != this.hash;
        }

        private name: string;
        private hash: number;

        private getLastUpdateHash(name: string) {
            let hash = this.load("last", { name: name });
            return hash;
        }
    }

    export let meta = {
        timePattern: { mask: "##-##", allow: /[0-9]/g },
        //timePattern: { mask: "#####", allow: /\w/g },   // не пропускает -
        timeValidator: x => x >= 0 && x <= 24,
    };


    export enum DiscountKind {
        Undefined = 0,
        UseDiscount = 1,
        IgnoreDiscount = 2,
    }

    export let discountKinds = [
        //{ id: DiscountKind.Undefined, value: "Перв.Рабочий" },
        { id: DiscountKind.UseDiscount, value: "Учитываем" },
        { id: DiscountKind.IgnoreDiscount, value: "Блокируем" },
    ];


    export enum DayKind {
        WorkFirstDay = 1,
        WorkDay = 3,
        WorkLastDay = 5,
        Weekend1 = 6,  // СБ
        Weekend2 = 7,  // ВС
    }

    export let dayKinds = [
        //{ id: 0, value: "" },
        { id: DayKind.WorkFirstDay, value: "Перв.Рабочий" },
        { id: DayKind.WorkDay, value: "Рабочий" },
        { id: DayKind.WorkLastDay, value: "Посл.Рабочий" },
        { id: DayKind.Weekend1, value: "СБ" },
        { id: DayKind.Weekend2, value: "ВС" },
    ];


    export enum NotifyKind {
        Reserv = 1,
        Payment = 2,
        Cancel = 3,
        Forfeit = 4,
        Review = 5
    }

    export var notifications = [
        { id: NotifyKind.Reserv, value: "Резерв" },
        { id: NotifyKind.Payment, value: "Оплата" },
        { id: NotifyKind.Cancel, value: "Отмена" },
        { id: NotifyKind.Forfeit, value: "Штраф" },
        { id: NotifyKind.Review, value: "Отзыв" },
    ]

    export let booleans = [
        //{ id: "", value: "(Не изменять 1)" },
        { id: 'false', value: "Нет" },
        { id: true, value: "Да" },
    ];

}