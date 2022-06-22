using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB.Data;
using Itall;
using System.ComponentModel;
using LinqToDB;
using My.App.Fin;

namespace My.App.Orders
{

    /// <summary>
    /// Заказы и заявки
    /// </summary>
    [Table("orders")]
    public class Order: Fin.Document
    {
        public Order()
        {

        }

        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);

            Date = DateTime.Now;
            Updated = DateTime.Now;
            //DateFrom = Date.AddDays(1);
            //DateTo = DateFrom.AddHours(3);
            //Status = OrderStatus.Unknown;
            //Reason = CancelReason.Unknown;
            //RequestStatus = RequestStatus.Unknown;
            //Group = GroupKind.Group;
            IsArchive = false;
        }


        //[Association(ThisKey = "DomainId", OtherKey = "Id")]
        public new Partners.Domain Domain { get; set; }  // временный хак для 85531, override не работает



        /// <summary>
        /// Статус заказа
        /// </summary>
        [Column("status")]
        [Index]
        //[DefaultValue(OrderStatus.Unknow)]
        public OrderStatus Status { get; set; }

        /// <summary>
        /// Причина отмены резервирования
        /// </summary>
        [Column("reason")]
        [Index]
        public CancelReason Reason { get; set; }


        /// <summary>
        /// Тип источника брони
        /// </summary>
        [Column("sourceType")]
        [Index]
        //[DefaultValue(OrderStatus.Unknow)]
        public SourceType SourceType { get; set; }


        /// <summary>
        /// Ссылка на заявку
        /// </summary>
        [Column("requestId")]
        [Index]
        public Guid? RequestId { get; set; }
        [Association(ThisKey = "RequestId", OtherKey = "Id")]
        public virtual Order Request { get; set; }

        /// <summary>
        /// Статус заявки
        /// </summary>
        [Column("reqStatus")]
        [Index]
        public RequestStatus RequestStatus { get; set; }


        /// <summary>
        /// Доступна ли отправка сообщений
        /// </summary>
        // public bool Notify;
    

        /// <summary>
        /// Json представление Items
        /// </summary>
        [Column("items", DbType = "jsonb", DataType = DataType.BinaryJson)]
        //public OrderItem Items { get; set; }
        public string ItemsJson { get; set; }


        /// <summary>
        /// Объектное представление Items
        /// </summary>
        //public OrderItem[] ItemsArray
        //{
        //    get { return JsonUtils.JsonToObject<OrderItem[]>(ItemsJson); }
        //    set { ItemsJson = JsonUtils.ObjectToJson(value); }
        //}


        /// <summary>
        /// Дата заказа
        /// </summary>
        [Column("date")]
        [Index]
        public DateTime Date { get; set; }        
        
        /// <summary>
        /// Дата оплаты
        /// </summary>
        [Column("payDate")]
        public DateTime? PayDate { get; set; }



        [Column("dateFrom")]
        [Index]
        public DateTime DateFrom { get; set; }

        [Column("dateTo")]
        [Index]
        public DateTime DateTo { get; set; }


        /// <summary>
        /// Задержка подтверждения в часах
        /// </summary>
        [Column("confirmDelay")]
        public int ConfirmDelay { get; set; }


        /// <summary>
        /// Комната, по которой принят заказ
        /// </summary>
        [Column("roomId")]
        [Index]
        public Guid? RoomId { get; set; }

        public bool CanForfeit() => PayForfeit && PaidForfeit == 0;

        [Association(ThisKey = "RoomId", OtherKey = "Id")]
        public virtual Room Room { get; set; }

        /// <summary>
        /// Комната, по которой принят заказ
        /// </summary>
        [Column("abonementId")]
        [Index]
        public Guid? AbonementId { get; set; }
        [Association(ThisKey = "AbonementId", OtherKey = "Id")]
        public virtual Abonement Abonement { get; set; }


        [Column("clientId")]
        [Index]
        public Guid? ClientId { get; set; }
        [Association(ThisKey = "ClientId", OtherKey = "Id")]
        public virtual CRM.Client Client { get; set; }

        // нельзя выставлять CanBeNull false - сыпятся ошибки
        [Association(ThisKey = "ClientId,DomainId", OtherKey = "ClientId,DomainId", CanBeNull = true, IsBackReference = true)]
        public virtual CRM.ClientPart Part { get; set; }




        [Column("modifiedById")]
        public Guid? ModifiedById { get; set; }
        [Association(ThisKey = "ModifiedById", OtherKey = "Id")]
        public virtual Sys.User ModifiedBy { get; set; }

        /// <summary>
        /// Удалено кем
        /// </summary>
        [Column("deleledById")]
        public Guid? DeleledById { get; set; }

        [Association(ThisKey = "DeleledById", OtherKey = "Id")]
        public virtual Sys.User DeleledBy { get; set; }


        [Column("discount")]
        public int Discount { get; set; }

        /// <summary>
        /// Кол-во минут жизни платежа
        /// </summary>
        [Column("lifetime")]
        public int Lifetime { get; set; }

        /// <summary>
        /// Стоимость доп.оборудования
        /// </summary>
        [Column("eqPrice")] //"EquipmentPrice"
        [DefaultValue(0)]
        public int EqPrice { get; set; }        
        
        /// <summary>
        /// Стоимость доп.оборудования с учетом скидки
        /// </summary>
        [Column("eqSum")]
        [DefaultValue(0)]
        public int EqSum { get; set; }


        /// <summary>
        /// Стоимость бронирования комнат
        /// </summary>
        [Column("roomPrice")]
        public int RoomPrice { get; set; }        
        
        /// <summary>
        /// Стоимость бронирования комнат с учетом скидки
        /// </summary>
        [Column("roomSum")]
        public int RoomSum { get; set; }


        /// <summary>
        /// Общая сумма предоплат
        /// </summary>
        [Column("total_pay")]
        public int TotalPays { get; set; }



        [Column("forfeit")]
        public int ____Forfeit { get; set; }


        /// <summary>
        /// Для совместимости!!!
        /// </summary>
        [Obsolete("Используется только для совместимости отчетов")]
        public int Forfeit => Part != null ?Part.Forfeit :0;


        /// <summary>
        /// Сумма начисленных или уплаченных штрафов
        /// </summary>
        [Column("forfeitSum")]
        public int ____ForfeitSum { get; set; }



        /// <summary>
        /// Начисленная сумма штрафа
        /// </summary>
        [Column("cancel_ff")]
        public int CancelForfeit { get; set; }


        /// <summary>
        /// Сумма оплаченного штрафа
        /// </summary>
        [Column("paid_ff")]
        public int PaidForfeit { get; set; }


        /// <summary>
        /// Начисленная сумма по брони
        /// </summary>
        [Column("totalPrice")]
        public int TotalPrice { get; set; }

        /// <summary>
        /// Сумма по брони с учетом скидок, но без штрафа
        /// </summary>
        [Column("totalSum")]  // название оставлено для совместимости
        public int TotalOrder { get; set; }


        /// <summary>
        /// Начальное значение TotalSum
        /// </summary>
        [Column("origin_total_sum")]  
        public int OriginTotalSum { get; set; }


        public int TotalPayment() => this.TotalOrder + (this.Part?.Forfeit ?? 0) + this.PaidForfeit  -  this.TotalPays;

        /// <summary>
        /// Только для совместимости в отчетах!!
        /// </summary>
        [Obsolete("Use GetTotalSum() method")]
        public int TotalSum => TotalOrder + PaidForfeit - PointsSum + (Part?.Forfeit ?? 0);  // см 62303, вместо this.GetTotalSum();



        /// <summary>
        /// Расчет полной суммы с учетом штрафа
        /// </summary>
        public int GetTotalSum()
        {
            var res = TotalOrder + PaidForfeit - PointsSum;
            // if (this.Status != OrderStatus.Reserv) return res;  -- согласно обсуждению с Гкрманом 23/11/2020- не считаем новый штраф, если были оплаты штрафа
            if (
                this.Status == OrderStatus.Closed ||
                this.Status == OrderStatus.Cancel ||
                this.Status == OrderStatus.Request ||
                !this.PayForfeit || 
                this.PaidForfeit > 0 || 
                this.TotalPays > 0
            ) return res;
            
            if(PayForfeit)  // 73153
                res += Part?.Forfeit ?? 0;

            return res;
        }


        /// <summary>
        /// Сумма оплаты баллами
        /// </summary>
        [Column("pointsSum")]
        public int PointsSum { get; set; }

        /// <summary>
        /// Оплачиваем ли баллами
        /// </summary>
        [Column("isPointsPay")]
        public bool IsPointsPay { get; set; }


        [Column("payForfeit")]
        [DefaultValue(false)]
        public bool PayForfeit { get; set; }


        /// <summary>
        /// Была ли предоплата (for debug only)
        ///         Решено заменить на TotalPays > 0
        /// </summary>

        [Column("isPrepay")]
        [DefaultValue(false)]
        public bool IsPrepay { get; set; }

        // закомментарено согл 64609 - иначе неверно определялся тип возврата
        //public bool IsPrepay() => TotalPays > 0;



        /// <summary>
        /// Сумма промо-скидки
        /// </summary>
        [Column("roomDsSum")]
        public int RoomDiscountSum { get; set; }

        /// <summary>
        /// Округление
        /// </summary>
        [Column("roundSum")]
        public int RoundSum { get; set; }


        /// <summary>
        /// Сумма клиентской скидки
        /// </summary>
        [Column("roomClDsSum")]
        public int RoomClientDiscountSum { get; set; }

        [Column("discPackage")]
        public int DiscountPackage { get; set; }

        /// <summary>
        /// Сумма скидки на доп.оборудование
        /// </summary>
        [Column("eqDsSum")]
        public int EqDiscountSum { get; set; }

        /// <summary>
        /// Сумма клиентской скидки
        /// </summary>
        [Column("eqClDsSum")]
        public int EqClientDiscountSum { get; set; }

        /// <summary>
        /// Сумма начисленной мобильной комиссии за пользование сервисом
        /// </summary>
        [Column("mobComm")]
        public int MobComm { get; set; }

        [Column("ignore_comm")]
        public bool IgnoreMobComm { get; set; }


        /// <summary>
        /// Документ по мобильной комиссии
        /// </summary>
        [Column("mobComPayId")]
        public Guid? MobComPayId { get; set; }
        [Association(ThisKey = "MobComPayId", OtherKey = "Id")]
        public virtual Fin.PayDoc MobComPay { get; set; }


        /// <summary>
        /// Номер битрикс клиента в системе Битрикса
        /// </summary>
        [Column("bitrixNum", Length = 10)]
        [Index]
        public string BitrixNum { get; set; }


        /// <summary>
        /// Клиентский комментарий при оформлении заказа
        /// </summary>
        [Column("clientComment", Length = 0)]
        public string ClientComment { get; set; }

        /// <summary>
        /// Комментарий при отмене
        /// </summary>
        [Column("comment", Length = 0)]  // "CancelComment"задействуем существующее поле для совместимости
        public string Comment { get; set; }


        [Column("color", Length = 10)]  // Задача https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/46607/
        public string Color { get; set; }


        /// <summary>
        /// Заказ обработан роботом
        /// </summary>
        [Column("isConfirmed")]
        public bool IsConfirmed { get; set; }


        /// <summary>
        /// Способ оплаты
        /// </summary>
        [Column("channelId")]
        public Guid? ChannelId { get; set; }
        [Association(ThisKey = "ChannelId", OtherKey = "Id")]
        public virtual Fin.PayChannel Channel { get; set; }

        /// <summary>
        /// Шаблон нотификаций
        /// </summary>
        [Column("template")]
        public Sys.TemplateGroup Template { get; set; }


        /// <summary>
        /// Заказ заблокирован от изменений
        /// </summary>
        //[Column("isHold")]
        //[Index]
        public bool IsHold()  => 
            Status == OrderStatus.Closed || 
            Status == OrderStatus.Cancel; // { get; set; }


        ///// <summary>
        ///// Игнорируются все пересчеты и ограничения - 39181
        ///// </summary>
        //public bool IsIgnored() =>
        //    Status == OrderStatus.Unknown ||  // 39181 
        //    IsHold();

        /// <summary>
        /// Расчет суммы штрафа по брони
        /// </summary>
        public int CalcForfeit()
        {
            var ff = SysUtils.Round5(RoomSum);
            return ff;
        }


        ///// <summary>
        ///// Вид группы
        ///// </summary>
        //[Column("")]
        //public GroupKind Group { get; set; }

        /// <summary>
        /// Опции группы
        /// </summary>
        [Column("options", Length = 0)]
        public string Options { get; set; }

        /// <summary>
        /// Значение опции типа диапазон
        /// </summary>
        [Column("range")]
        public int Range { get; set; }

        /// <summary>
        /// Список кодов оборудования, использованных в заказе
        /// </summary>
        [Column("equipments", Length = 0)]
        public string Equipments { get; set; }

        /// <summary>
        /// Есть ли пакетные предложения в позициях 
        /// </summary>
        [Column("package")]
        public bool HasPackage { get; set; }

        /// <summary>
        /// Промокод
        /// </summary>
        [Association(ThisKey = "PromoId", OtherKey = "Id")]
        public virtual CRM.Promotion Promo { get; set; }
        [Column("promocodeId")]
        [Index]
        public Guid? PromoId { get; set; }


        [Column("shareId")]
        [Index]
        public Guid? ShareId { get; set; }
        [Association(ThisKey = "ShareId", OtherKey = "Id")]
        public virtual Order Share { get; set; }


        /// <summary>
        /// Ссылка на сторонний календарь для синхронизации
        /// </summary>
        [Column("eventKey", Length = 0)]
        public string EventKey { get; set; }

        /// <summary>
        /// Ссыла на промоакцию, если была (55477)
        /// </summary>
        [Column("hotId")]
        [Index]
        public Guid? HotPromoId { get; set; }
        [Association(ThisKey = "HotPromoId", OtherKey = "Id")]
        public virtual CRM.Promotion HotPromo { get; set; }


        ///// <summary>
        ///// ИД внешней ссылки
        ///// </summary>
        //[Column("extkey", Length = 20)]
        //// [Index]  --- вручную добавить
        //public string ExtKey { get; set; }

        [Association(ThisKey = "Id", OtherKey = "OrderId")]
        public List<Fin.Transaction> Transactions;


        [Association(ThisKey = "Id", OtherKey = "OrderId")]
        public List<Common.Message> Messages;

        /// <summary>
        /// Список отзывов по брони
        /// </summary>
        [Association(ThisKey = "Id", OtherKey = "OrderId")]
        public List<CRM.Review> Reviews;

        /// <summary>
        /// Список броней внутри заказа
        /// </summary>
        [Association(ThisKey = "Id", OtherKey = "RequestId")]
        public List<Order> Orders;


        public override void OnDelete(DataConnection db)
        {
            db.GetTable<Common.Message>().Where(x => x.OrderId == this.Id).Delete(); // удаляем все связанные сообщения
            if(this.ShareId.HasValue)
                db.GetTable<Order>().Where(x => x.Id == this.ShareId).Delete(); // удаляем все связанные заказы-копии
            db.GetTable<Order>().Where(x => x.ShareId == this.Id).Delete(); // удаляем все связанные заказы-копии
            base.OnDelete(db);
        }

        public DateTime? GetDateExpired() => Lifetime==0 ?(DateTime?)null :Date.AddMinutes(Lifetime);


        /// <summary>
        /// Создание связанного заказа
        /// </summary>
        public Order CreateSharedOrder(Guid? shareRoomId, string roomname)
        {
            var order = this;
            var newOrder = new Order
            {
                Id = Guid.NewGuid(),
                IsArchive = false,
                AbonementId = order.AbonementId,
                ClientId = order.ClientId,
                //ClientComment = $"Копия [{room.Name}] {order.ClientComment}",
                Comment = $"Копия [{roomname}] {order.Comment}",
                Date = order.Date,
                DateFrom = order.DateFrom,
                DateTo = order.DateTo,
                DomainId = order.DomainId,
                Lifetime = order.Lifetime, // добавили, чтобы проще анализировать отсечку
                                           //Group = order.Group,
                Options = order.Options,
                IsConfirmed = true,
                ModifiedById = order.ModifiedById,
                RoomId = shareRoomId,
                SourceType = order.SourceType,
                Status = OrderStatus.Unknown,
                ShareId = order.Id,
                // EventKey = order.EventKey, не присваиваем, иначе 2 раза удаляем в гугле
            };
            return newOrder;
        }



    }

}




#region Misc

//public enum GroupKind
//{
//    Unknown = 0,
//    Solo = 1,
//    Duet = 2,
//    Group = 3,
//}

#endregion
