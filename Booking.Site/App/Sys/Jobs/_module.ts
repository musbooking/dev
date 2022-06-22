module jobs {

    class DataSource extends app.AppDataSource {

        list(id) {
            return this.loadList("list", {id: id});
        }
    }

    export let db = new DataSource("jobs");


    export enum JobStatus {
        Unknown = 0,
        Active = 1,
        Pause = 2,
        Ok = 10,
        Error = 11,
        Canceled = 12,
    }

    export let statuses = [
        { id: JobStatus.Unknown, value: '(неизвестно)' },
        { id: JobStatus.Active, value: 'Активно' },
        { id: JobStatus.Canceled, value: 'Отменено' },
        { id: JobStatus.Error, value: 'Ошибка' },
        { id: JobStatus.Ok, value: 'ОК' },
        { id: JobStatus.Pause, value: 'Пауза' },
    ];

}




