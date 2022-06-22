module points {

    //export let create = {
    //    grid: () => new GridView(),
    //    form: () => new FormView(),
    //}

    /// <summary>
    /// Тип платежного канала
    /// </summary>
    export enum PoinKind {
        // приходы
        Registration = 1,
        Profile = 2,
        Booking = 3,
        Invite = 4,  // За приглашение
        Manual = 5,  // Принудительное начисление
        // расходы
        Payment = 10,
        RetBooking = 11,  // возврат баллов при отмене бронирования
    }

    export let kinds = [
        { id: PoinKind.Registration, value: "Регистрация" },
        { id: PoinKind.Profile, value: "Профиль" },
        { id: PoinKind.Booking, value: "Бронирование" },
        { id: PoinKind.Invite, value: "Приглашение" },
        { id: PoinKind.Manual, value: "Вручную" },
        { id: PoinKind.Payment, value: "Оплата" },
        { id: PoinKind.RetBooking, value: "Отмена" },
    ];


    class DataSource extends app.AppDataSource {
        list = (client: guid) => this.loadList("list", { client: client });
    }

    export let db = new DataSource("points");
}