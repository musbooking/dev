module spheres {

    export let create = {
        list: () => new ListView(),
        edit: () => new EditForm(),
    }

    class DataSource extends lists.DataSource {
        reindex = (start, ids) => this.post("reindex", {start, ids})
    }

    export let db = new DataSource("spheres");


    export enum SphereKind {
        Usual = 1,
        Teachers = 2,
    }

    export let kinds = [
        { id: SphereKind.Usual, value: 'Обычная' },
        { id: SphereKind.Teachers, value: 'Преподаватели' },
    ];

}