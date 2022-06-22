module reviews {

    export let create = {
        grid: () => new GridView(),
        'grid-all': () => new GridAllView(),
    }

    /** Статус обработки отзыва  */
    export enum ReviewStatus {
        Unknown = 0,
        New = 1,
        Moderate = 2, // жалоба
        Processed = 3,
        Changed = 4,
        Ok = 10,
        Cancel = 11, // удаление, отмена
    }

    /** * Список сттаусов */
    export let statuses = [
        { id: ReviewStatus.New, value: "Новый" },
        { id: ReviewStatus.Moderate, value: "Модерация" },
        { id: ReviewStatus.Processed, value: "Обработано" },
        { id: ReviewStatus.Changed, value: "Изменено" },
        { id: ReviewStatus.Ok, value: "Отвечено" },
        { id: ReviewStatus.Cancel, value: "Отменено" },
    ];


    class DataSource extends app.AppDataSource {

        add(args) {  // : {text: string, group: guid }
            return this.post("add", args);
        }

        reply(args) {
            return this.post("reply", args);
        }
    }

    export let db = new DataSource("reviews");

}