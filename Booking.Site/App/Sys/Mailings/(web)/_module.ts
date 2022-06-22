module mailings {

    export let create = {
        grid: () => new GridView(),
        edit: () => new EditView(),
    }

    class DataSource extends lists.DataSource {
        send = (id) => this.post("send", {id: id})

    }

    export let db = new DataSource("mailings");


    export enum MailingStatus {
        Unknown = 0,
        //Active = 1,
        //Canceled = 2,
        //Paused = 3,
        Ok = 10,
    }


    export let statuses = [
        { id: MailingStatus.Ok, value: 'ОК' },
    ];

}