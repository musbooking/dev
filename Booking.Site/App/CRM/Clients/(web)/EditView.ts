module clients {


    /** edit base */
    export class EditView extends $u.View {

        private form = new $u.RefForm();
        private docsView: docs.GridView;
        private admOrdersView: orders.AdminGridView;
        private messagesView: messages.ListView = new messages.ListView(this);
        private htmlView: HtmlView;
        private phonesView: resources.PhonesView = new resources.PhonesView(resources.ResourceKind.ClientPhone, "Телефоны").owner(this);
        //private pointsView: points.GridView = new points.GridView(this);
        private transView: trans.PartGridView = new trans.PartGridView(this);
        private users: users.GridView;
        private faview: favorites.GridView;

        private save_btn = new $u.RefUI();


        $config() {
            super.$config();

            let w = 100;
            let allowSuper = logic.allowSuper();
            let allowEdit = system.context.allowCrmEdit()

            let toolbar = $u.panelbar(
                $u.button("Сохранить").Click(() => this.save()).Ref(this.save_btn),
                //$.button("Excel").Click(() => this.form.toExcel()),
                {}
            );

            let form = this.form.config().Labels(150).extend({
                labelWidth: 300,
                cols: [
                    $u.rows(
                        $u.cols(
                            $u.rows(
                                $u.element("lastName").Label("Фамилия").Require().Readonly(!allowEdit),
                                $u.element("firstName").Label("Имя").Require().Css("it-warning").Readonly(!allowEdit),
                                $u.element("surName").Label("Отчество").Readonly(!allowEdit),
                                $u.element("email").Label("Почтовый адрес").Require().Readonly(!allowEdit),
                                //$.element("phones").Label("Телефоны").Require().Css("it-warning"),
                                $u.element("dateBirthday").Label("Дата рождения").AsDate().Readonly(!allowEdit),
                            ).Size(-3),
                            $u.rows(
                                $u.uploader("api/core/upload-image", (x, y, z) => this.setImage(y)).extend({
                                    name: "uploader",
                                    value: "Фотография",
                                    accept: "image/*",
                                    datatype: "json",
                                    formData: {
                                        folder: 'users/' + system.context.id,
                                    },
                                }).Visible(allowEdit),  // console.log('upload', x, y, z)
                                $u.element("photoUrl").AsTemplate((x: string) => ('res/' + x).img({ height: '110px', width: '100%' })),
                            ).Size(-1)
                        ),

                        //$.element("groupId").Label("Группа (старая)").AsSelect(groups.db.getNames(groups.GroupType.ContactType)).Disable().Tooltip("Старое значение группы для контроля"),
                        $u.element("groups").Label("Группы клиента").AsMultiSelect(groups.db.names(groups.GroupType.ContactType, true)).Readonly(!allowEdit),
                        $u.element("discount").Label("Скидка клиента, %").Tooltip("Постоянная скидка клиенту от партнера").Readonly(!allowEdit),
                        $u.element("forfeit").Label("Штрафы").Disable().Tooltip("Ранее начисленные штрафы").Readonly(!allowEdit),
                        $u.element("isBanned").Label("Заблокирован").AsCheckbox().Readonly(!allowEdit), //.Disable(),
                        $u.element("payKind").Label("Способ оплаты").AsSelect(payKinds).Readonly(!allowEdit), //.Disable(),
                        $u.element("notifications").Label("Уведомления").AsMultiSelect(app.notifications).Readonly(!allowEdit),
                        //$.element("hasWarnings").Label("Предупреждения").AsCheckbox(),

                        //$.element("comments").Label("Комментарии").AsTextArea(100),
                        //$.element("post").Label("Примечание").AsTextArea(100)

                        this.phonesView.$config(allowEdit).Size(0, 150).Disable(!allowEdit)

                    ),

                    $u.rows(
                        $u.element("music").Label("О себе").Readonly(!allowEdit),
                        $u.element("typeInfo").Label("Данные об устройстве").Tooltip("Операционная система. Модель устройства").Readonly(!allowEdit),
                        //$u.element("os").Label("Операц.система").AsSelect(clients.osTypes),
                        $u.element("gender").Label("Пол").AsSelect(clients.genders).Readonly(!allowEdit),
                        //$u.element("typeId").Label("Тип клиента").AsSelect(groups.db.names(groups.GroupType.ClientType)),
                        $u.element("types").Label("Виды деятельности").AsMultiSelect(groups.db.names(groups.GroupType.ActivityType)).Readonly(!allowEdit),
                        $u.element("cityId").Label("Город").AsSelect(groups.db.names(groups.GroupType.City)).Readonly(!allowEdit),
                        //$u.element("toolId").Label("Муз.инструменты").AsSelect(groups.db.names(groups.GroupType.Tool)),
                        $u.element("tools").Label("Муз.инструмент").AsMultiSelect(groups.db.names(groups.GroupType.Tool)).Readonly(!allowEdit),
                        //$u.element("styleId").Label("Муз.стиль").AsSelect(groups.db.names(groups.GroupType.MusicStyle)),
                        $u.element("styles").Label("Стиль танца").AsMultiSelect(groups.db.names(groups.GroupType.MusicStyle)).Readonly(!allowEdit),

                        //$u.element("activityId").Label("Вид деятельности").AsSelect(groups.db.names(groups.GroupType.Activity)),
                        $u.element("spheres").Label("Сферы деятельности").AsMultiSelect(spheres.db.names()).Readonly(!allowEdit),
                        //$u.element("genreId").Label("Жанр").AsSelect(groups.db.names(groups.GroupType.Genre)),
                        $u.element("genres").Label("Муз/жанр").AsMultiSelect(groups.db.names(groups.GroupType.Genre)).Readonly(!allowEdit),
                        $u.element("sourceId").Label("Уровень навыков").AsSelect(groups.db.names(groups.GroupType.Skill)).Readonly(!allowEdit),

                        $u.element("vkUrl").Label("Страница в ВК").Readonly(!allowEdit),
                        $u.element("sourceUrl").Label("Instagram").Readonly(!allowEdit),

                        $u.element("creator").Label("Кем создано").Disable().Visible(allowSuper).Readonly(!allowEdit),
                        //$u.element("pushID").Label("Push ID").Visible(allowLogins), //system.context.allow(auth.oper.admin)), // 18-02-2019  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/31058/
                        //$.element("assignedName").Label("Ответственный"),
                        //$.element("editorName").Label("Контакт обработал")

                    ),
                ],
            });

            let tabs: $u.Configs.TabViewConfig = $u.tabview()
                //.Size(0, 400)
                .Autoheight();

            if (allowSuper) {
                this.admOrdersView = new orders.AdminGridView(this);
                this.users = new users.GridView();
                this.faview = new favorites.GridView(this)
                tabs
                    .Tab("Транзакции", this.transView.$config())
                    .Tab("Брони (адм)", this.admOrdersView.$config())
                    .Tab("История", this.messagesView.$config())
                    //.Tab("Баллы (стар)", this.pointsView.$config())
                    .Tab("Избранное", this.faview.$config())
                    .Tab("Логины", this.users.$config());
            }
            else {
                this.docsView = new docs.GridView(this)
                this.htmlView = new HtmlView().owner(this)
                tabs.Tab("Документы", this.docsView.$config())
                    .Tab("История", this.messagesView.$config())
                    .Tab("Справка", this.htmlView.$config());
            }

            let view = $u.rows(
                toolbar,
                form,
                tabs
            );

            return view;
        }

        private setImage(img) {
            this.form.elements.photoUrl.setValues((img || {}).path);
        }

        $reload(id) {
            super.$reload(id);
            let vals = this.form.load(db.getUrl(id));
            let allowSuper = logic.allowSuper();

            ////let cameras = models.resources.getItems(models.ResourceKind.Camera, models.ResourceType.Base, id);
            //(<any[]>vals.orders).forEach(x => { x.type = "order", x.module = "orders", x.rustype = "Бронь" });
            //(<any[]>vals.abonements).forEach(x => { x.type = "abonement", x.module = "abonements", x.rustype = "Абонемент"  });
            //let docs: any[] = _.union(
            //    vals.abonements,
            //    vals.orders
            //);
            ////docs.forEach(x => { x.date = parseDate(x.date); })

            if (allowSuper) {
                this.faview.$reload(id);
                this.admOrdersView.reload({ client: id });
                //this.pointsView.reload(id);
                this.transView.reload({ clientId: id });
                this.users.refresh(users.db.search(id));
            }
            else {
                this.docsView.filter.client = id;
                this.docsView.refresh();
                this.htmlView.$reload(id);
            }
            this.phonesView.$reload(id);


            //this.messagesView.grid.refresh(vals.messages);
            this.messagesView.filter.client = id;
            this.messagesView.refresh();
            this.messagesView.setDefaults({ clientId: id });


            let enabled = logic.allowEdit(vals);
            let allowFin = logic.allowFin(vals);
            let allowDiscBan = logic.allowDiscBan(vals);

            //this.form.enable(enabled);
            //this.save_btn.enable(enabled);
            this.form.enable(enabled, "lastName");
            this.form.enable(enabled, "firstName");
            this.form.enable(enabled, "surName");
            this.form.enable(enabled, "email");
            this.form.enable(enabled, "dateBirthday");
            this.form.enable(enabled, "uploader");
            this.form.enable(allowFin, "forfeit");
            this.form.enable(allowDiscBan, "discount");
            this.form.enable(allowDiscBan, "isBanned");
            this.form.enable(allowDiscBan, "payKind");

            //this.form.enable(enabled, "comments");
            //this.form.enable(enabled, "post");

            this.form.enable(enabled, "music");
            this.form.enable(enabled, "typeInfo");
            this.form.enable(enabled, "gender");
            this.form.enable(enabled, "groups");
            this.form.enable(enabled, "types");
            this.form.enable(enabled, "cityId");
            this.form.enable(enabled, "tools");
            this.form.enable(enabled, "styles");

            this.form.enable(enabled, "spheres");
            this.form.enable(enabled, "genres");
            this.form.enable(enabled, "sourceId");
            this.form.enable(enabled, "vkUrl");
            this.form.enable(enabled, "sourceUrl");
            //this.form.enable(enabled, "creator");

            //this.form.enable(enabled, "phones");
            this.phonesView.enable(enabled);

        }

        private save() {
            if (!this.form.validate()) return;
            let vals = this.form.save(db.saveUrl(this.objectId), false);

            let has_part = !logic.allowSuper();  // партнерская часть доступна только для партнерского логина, не супер
            if (has_part) {
                let part = {
                    id: vals.partId,
                    isBanned: vals.isBanned,
                    payKind: vals.payKind,
                    discount: vals.discount,
                    forfeit: vals.forfeit,
                    assignedName: vals.assignedName,
                    editorName: vals.editorName,
                    //hasWarnings: vals.hasWarnings,
                };
                partsdb.save(part);
                //this.docs.grid.save();
                this.htmlView.$reload(this.objectId);
            }
            webix.message("Данные о клиенте сохранены");

        }

    }

}