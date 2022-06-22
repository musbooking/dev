module paychannels {

    export let create = {
        grid: () => new GridView(),
        form: () => new FormView(),
    }

    /// <summary>
    /// Тип платежного канала
    /// </summary>
    export enum PayChannelKind {
        Cash = 1,
        Instruction = 2,
        Tinkoff = 3,
    }

    export let kinds = [
        { id: PayChannelKind.Cash, value: "Наличными" },
        { id: PayChannelKind.Instruction, value: "По инструкции" },
        { id: PayChannelKind.Tinkoff, value: "Тинькофф" },
    ];


    class DataSource extends app.AppDataSource {
        itemsUrl = this.url("list");
        names = () => this.load("names");
    }

    export let db = new DataSource("paychannels");
}