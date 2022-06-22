using Itall;
using Itall.Models;
using LinqToDB;
using My.App.CRM;
using My.App.Fin;
using My.App.Orders;
using My.App.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace My.App.Fin
{

    /// <summary>
    /// Класс для создания транзакций
    /// </summary>
    public partial class TransService : DbService
    {

        /// <summary>
        /// Начисление при резервировании
        /// </summary>
        public async Task ReservOrderAsync(CalcResult calc)
        {
            if (calc.Args == null) return; // не создаем транзакции, если нет контекста

            //using var t = await Db.BeginTransactionAsync();
            Db.BeginTransaction1();

            var orderid = calc.Args.OrderId;

            // очищаем старые транзакции, если есть
            //var REGS = new[] {
            //    Groups.REG_SERVICE.Key,
            //    Groups.REG_CLIENTS.Key, --- убрать удаление оплат!!
            //    Groups.REG_FORFEITS.Key
            //};
            //await Db.Transactions
            //    .Where(t => t.OrderId == orderid)
            //    .Where(t => REGS.Contains(t.Register))
            //    .DeleteAsync();

            // чистим все расчеты с клиентами
            await Db.Transactions
                .Where(t => t.OrderId == orderid)
                .Where(t => 
                    t.Register == Groups.REG_SERVICE.Key ||             // очищаем все начисления по резервированию
                    t.Register == Groups.REG_POINTS.Key ||             // очищаем все начисления по баллам
                    t.Operation == Groups.OP_CLIENTS_RESERV.Key)        // очищаем начисление резерва по клиенту
                .DeleteAsync();

            //await deletePaymentsAsync( calc.Args.OrderId );

            Task add(Transaction t)
            {
                if (t.Total == 0) return Task.FromResult(false);
                //
                if(t.Register == 0) t.Register = Groups.REG_SERVICE.Key;
                if(t.Operation == 0) t.Operation = Groups.OP_SERVICE_RESERV.Key;
                t.Date = DateTime.Now;
                //if(t.KeyId == null) t.KeyId = orderid;
                t.OrderId = calc.Args.OrderId;
                t.ClientId = calc.Args.ClientId;
                t.RoomId = calc.Args.RoomId;
                t.BaseId = calc.Args.Room.BaseId;
                t.SphereId = calc.Args.Room.Base.SphereId;
                t.DomainId = calc.Args.Room.DomainId;
                return addTrans(t);
            }

            // аренда комнаты
            await add( new Transaction
            {
                Details = Groups.DET_SERVICE_ROOM.Key,
                Total = calc.RoomPrice,
                Text = $"Аренда комнаты {calc.Args.Room?.Name} ({calc.Args.Room?.Base?.Name})",
            });


            // скидка за оборудование
            await add(new Transaction
            {
                Details = Groups.DET_SERVICE_DISC_EQ.Key,
                Total = calc.Args.EqDiscountSum,
                Text = $"Скидка за оборудование ",
            });


            // скидка за оборудование клиенту
            await add( new Transaction
            {
                Details = Groups.DET_SERVICE_DISC_EQ_CLIENT.Key,
                Total = calc.Args.EqClientDiscountSum,
                Text = $"Скидка клиенту за оборудование",
            });

            // скидка за комнату
            if (calc.Args.RoomDiscountSum > 0)
            {
                var promo = Db.Promotions.Find(calc.Args.PromoId);
                // var promo = DbCache.Promotions.Get().FirstOrDefault( p => p.Id == calc.Args.PromoId);  - не ищет в архивных
                await add(new Transaction
                {
                    Details = Groups.DET_SERVICE_DISC_PROMO.Key,
                    Total = calc.Args.RoomDiscountSum,
                    Text = $"Скидка промо по комнате {calc.Args.Room?.Name}: {promo?.Type} {promo} {promo?.Description}, гор: {calc.Args.HotPromo}, код: {calc.Args.PromocodeNum}",
                });
            }

            await add(new Transaction
            {
                Details = Groups.DET_SERVICE_ROUND.Key,
                Total = calc.Args.RoundSum,
                Text = $"Округление {calc.Args.Room?.Name}",
            });


            // скидка за комнату клиенту
            await add(new Transaction
            {
                Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Total = calc.Args.RoomClientDiscountSum,
                Text = $"Скидка клиенту за бронирование {calc.Args.Room?.Name} ({calc.Args.Room?.Base?.Name})",
            });


            await add(new Transaction
            {
                //Register = Groups.REG_CLIENTS.Key,
                //Operation = Groups.OP_CLIENTS_PAYMENT_POINTS.Key,
                //Details = details,
                //Date = DateTime.Now,
                //KeyId = keyid,
                //OrderId = order.Id,
                //ClientId = order.ClientId,
                //RoomId = order.RoomId,
                //BaseId = order.Room.BaseId,
                //SphereId = order.Room.Base.SphereId,
                //DomainId = order.Room.DomainId,
                //Total = order.PointsSum,
                //Text = $"Оплата брони баллами {order.Room?.Name}",
                Details = Groups.DET_SERVICE_DISC_POINTS.Key,
                Total = calc.Args.PointsSum,
                Text = $"Скидка баллами",
            });

            await add(new Transaction
            {
                Details = Groups.DET_SERVICE_DISC_PACKAGE.Key,
                Total = calc.Args.DiscountPackage,
                Text = $"Сброс стоимости комнаты за пакетные опции",
            });

            foreach (var item in calc.Args.Items)
            {
                // Добавляем начисления по оборудованию
                await add( new Transaction
                {
                    Details = Groups.DET_SERVICE_EQ.Key,
                    EquipmentId = item.EqId,
                    GroupId = item.GroupId,
                    Total = item.Total,
                    Text = item.Text,
                });
            }

            // начисление за аренду клиенту
            var s1 = calc.Args.EqSum + calc.Args.RoomSum - calc.Args.RoundSum - calc.Args.PointsSum - calc.Args.DiscountPackage;
            var s2 = calc.Args.TotalOrder - calc.Args.PointsSum;
            await add(new Transaction
            {
                Register = Groups.REG_CLIENTS.Key,
                Operation = Groups.OP_CLIENTS_RESERV.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                //KeyId = calc.Args.ClientId,
                Total = s2, // 
                //Total = calc.Args.EqSum + calc.Args.RoomSum - calc.Args.RoundSum - calc.Args.PointsSum - calc.Args.DiscountPackage,
                Text = $"Начисление клиенту за аренду {calc.Args.Room?.Name} ({calc.Args.Room?.Base?.Name}) ",
            });


            //await add(new Transaction
            //{
            //    Register = Groups.REG_CLIENTS.Key,
            //    Operation = Groups.OP_CLIENTS_FORFEIT.Key,
            //    //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
            //    //KeyId = calc.Args.ClientId,
            //    Total = calc.Args.ForfeitSum,
            //    Text = $"Начисление штрафа за аренду СТАРОЕ!! {calc.Args.Room?.Name} ({calc.Args.Room?.Base?.Name}) ",
            //});

            // await t.CommitAsync();
            Db.CommitTransaction1();
        }


        /// <summary>
        /// Начисление комиссии партнеру
        /// </summary>
        public Task TarifCommissionAsync(Order order)
        {
            return addTrans(new Transaction
            {
                Register = Groups.REG_PARTNERS.Key,
                Operation = Groups.OP_PARTNERS_COMM.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                DomainId = order.DomainId,
                Total = order.MobComm,
                Text = $"Начисление комиссии партнеру ",
            });
        }


        /// <summary>
        /// Удаление начисленной комиссии партнеру
        /// </summary>
        public Task TarifCommissionClearAsync(Guid order_id)
        {
            return Db.Transactions
                .Where(t => t.OrderId == order_id)
                .Where(t => t.Register == Groups.REG_PARTNERS.Key)
                .Where(t => t.Operation == Groups.OP_PARTNERS_COMM.Key)
                .DeleteAsync();
        }


        /// <summary>
        /// Генерация проводок при изменении штрафа
        /// </summary>
        public async Task<bool> OnChangeForfeitAsync(ClientPart part, int delta, string text)
        {
            Db.BeginTransaction1();

            await addTrans(new Transaction
            {
                Register = Groups.REG_CLIENTS.Key,
                Operation = Groups.OP_CLIENTS_FORFEIT.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                ClientId = part.ClientId,
                DomainId = part.DomainId,
                Total = delta,
                Text = text,
            });            
            
            await addTrans(new Transaction
            {
                Register = Groups.REG_FORFEITS.Key,
                Operation = Groups.OP_FORFEITS_CHANGE.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                ClientId = part.ClientId,
                DomainId = part.DomainId,
                Total = delta,
                Text = text,
            });

            Db.CommitTransaction1();
            return true;
        }


        /// <summary>
        /// Генерация проводок при оплате штрафа
        /// </summary>
        public async Task<bool> PaymentForfeitNoOrderAsync(ClientPart part, int df)
        {
            Db.BeginTransaction1();

            await addTrans(new Transaction
            {
                Register = Groups.REG_CLIENTS.Key,
                Operation = Groups.OP_CLIENTS_PAYMENT_FORFEIT.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                ClientId = part.ClientId,
                DomainId = part.DomainId,
                Total = df,
                Text = $"Оплата штрафа ч/з Тинькофф " + User,
            });            
            
            await addTrans(new Transaction
            {
                Register = Groups.REG_FORFEITS.Key,
                Operation = Groups.OP_FORFEITS_PAYMENT.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                ClientId = part.ClientId,
                DomainId = part.DomainId,
                Total = df,
                Text = $"Оплата штрафа Тинькофф " + User,
            });

            Db.CommitTransaction1();
            return true;
        }

        /// <summary>
        /// Отмена брони
        /// </summary>
        public async Task CancelOrderAsync(Order order)
        {
            //using var t = await Db.BeginTransactionAsync();
            Db.BeginTransaction1();

            var orderid = order.Id;

            // удаляем все проводки резервирования
            await Db.Transactions
                .Where(t => t.OrderId == orderid)
                .Where(t => t.Register == Groups.REG_SERVICE.Key)
                .DeleteAsync();

            // удаляем начисленные отмены
            await Db.Transactions
                .Where(t => t.OrderId == orderid)
                .Where(t => t.Register == Groups.REG_CLIENTS.Key)
                .Where(t => t.Operation == Groups.OP_CLIENTS_CANCEL.Key )
                .DeleteAsync();

            //await deletePaymentsAsync( order.Id );

            await addTrans(new Transaction
            {
                Register = Groups.REG_CLIENTS.Key,
                Operation = Groups.OP_CLIENTS_CANCEL.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                //KeyId = orderid,
                OrderId = order.Id,
                ClientId = order.ClientId,
                RoomId = order.RoomId,
                BaseId = order.Room.BaseId,
                SphereId = order.Room.Base.SphereId,
                DomainId = order.Room.DomainId,
                Total = order.TotalOrder - order.PaidForfeit - order.PointsSum, // убираем в новой модели штрафов - полная сумма не хранится в брони
                Text = $"Отмена резервирования ",
            }); 

            //await t.CommitAsync();
            Db.CommitTransaction1();
        }


        /// <summary>
        /// начисление штрафа за отмену
        /// </summary>
        public async Task ForfeitOrderAsync(Order order, int forfeit)
        {
            //using var t = await Db.BeginTransactionAsync();
            Db.BeginTransaction1();

            var clientid = order.ClientId;

            // удаляем начисленные штрафы
            await Db.Transactions
                //.Where(t => t.ClientId == clientid)
                .Where(t => t.OrderId == order.Id)
                .Where(t => t.Register == Groups.REG_CLIENTS.Key)
                .Where(t => t.Operation == Groups.OP_CLIENTS_FORFEIT.Key)
                .DeleteAsync();

            await addTrans(new Transaction
            {
                Register = Groups.REG_CLIENTS.Key,
                Operation = Groups.OP_CLIENTS_FORFEIT.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                //KeyId = keyid,
                OrderId = order.Id,
                ClientId = order.ClientId,
                RoomId = order.RoomId,
                BaseId = order.Room.BaseId,
                SphereId = order.Room.Base.SphereId,
                DomainId = order.Room.DomainId,
                Total = forfeit,  // ForfeitSum
                Text = $"Штраф за отмену резервирования ",
            });

            await addTrans(new Transaction
            {
                Register = Groups.REG_FORFEITS.Key,
                Operation = Groups.OP_FORFEITS_RESERV.Key,
                //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
                Date = DateTime.Now,
                //KeyId = keyid,
                OrderId = order.Id,
                ClientId = order.ClientId,
                RoomId = order.RoomId,
                BaseId = order.Room.BaseId,
                SphereId = order.Room.Base.SphereId,
                DomainId = order.Room.DomainId,
                Total = forfeit, // ForfeitSum,
                Text = $"Начисление штрафа за отмену резервирования ",
            });


            //await t.CommitAsync();
            Db.CommitTransaction1();
        }


        /// <summary>
        /// Удаление платежей
        /// </summary>
        async Task deletePaymentsAsync(Guid? orderid, int? details = null)
        {
            var qtrans = Db.Transactions
                .Where(t => t.OrderId == orderid);

            // удаляем начисленные оплаты
            await qtrans
                .Where(t => t.Register == Groups.REG_CLIENTS.Key)
                .Where(t => t.Operation == Groups.OP_CLIENTS_PAYMENT_RUB.Key)
                .WhereIf(details != null, t => t.Details == details)
                .DeleteAsync();

            // удаляем оплату баллами по клиенту
            await qtrans
                .Where(t => t.Register == Groups.REG_CLIENTS.Key)
                .Where(t => t.Operation == Groups.OP_CLIENTS_PAYMENT_POINTS.Key)
                .DeleteAsync();

            // удаляем оплату баллами 
            await qtrans
                .Where(t => t.Register == Groups.REG_POINTS.Key)
                .Where(t => t.Operation == Groups.OP_POINTS_ADD.Key)
                //.Where(t => t.Details == Groups.DET_POINTS_PAYMENT.Key)
                .DeleteAsync();

        }


        /// <summary>
        /// Оплата брони, добавляем проводку по платежу
        /// </summary>
        public async Task PaymentOrderAsync(Order order, int details, int total = 0) // bool del = false,  ,  int forfeit = 0
        {
            if (total == 0)
                return;
            //var keyid = order.ClientId;

            //using var t = await Db.BeginTransactionAsync();
            Db.BeginTransaction1();

            await addTrans( new Transaction
            {
                Register = Groups.REG_CLIENTS.Key,
                Operation = Groups.OP_CLIENTS_PAYMENT_RUB.Key,
                Details = details,
                Date = DateTime.Now,
                //KeyId = keyid,
                OrderId = order.Id,
                ClientId = order.ClientId,
                RoomId = order.RoomId,
                BaseId = order.Room.BaseId,
                SphereId = order.Room.Base.SphereId,
                DomainId = order.Room.DomainId,
                Total = total, //pays,
                Text = $"Оплата брони {order.Room?.Name}",
            });

            //await t.CommitAsync();
            Db.CommitTransaction1();
        }


        /// <summary>
        /// Оплата штрафа
        /// </summary>
        public async Task PaymentForfeitAsync(Order order, int forfeit, int details = 0) 
        {
            Db.BeginTransaction1();

            // закрываем штраф
            // оплата
            await addTrans(new Transaction
            {
                Register = Groups.REG_FORFEITS.Key,
                Operation = Groups.OP_FORFEITS_PAYMENT.Key,
                Details = details,
                Date = DateTime.Now,
                //KeyId = keyid,
                OrderId = order.Id,
                ClientId = order.ClientId,
                RoomId = order.RoomId,
                BaseId = order.Room.BaseId,
                SphereId = order.Room.Base.SphereId,
                DomainId = order.Room.DomainId,
                Total = forfeit,
                Text = $"Оплата штрафа {order.Room?.Name}",
            });

            //await t.CommitAsync();
            Db.CommitTransaction1();
        }
      

        /// <summary>
        /// Добавление непустой транзакции
        /// </summary>
        Task addTrans(Transaction t)
        {
#if !DEBUG
            if (t.Total == 0) return Task.FromResult(false);
#else
            if (t.Total == 0)
                t.Text = "dbg-0: " + t.Text;
#endif
            //
            return Db.CreateInsertAsync(t);
        }


        //}

    }
}



#region Misc


//// удаляем начисленные оплаты
//if (del)
//{
//    await deletePaymentsAsync( order.Id, details );
//}

// оплата
//var pays = total > 0 ? total : order.TotalSum;

//// закрываем штраф
//// оплата
//await addTrans(new Transaction
//{
//    Register = Groups.REG_FORFEITS.Key,
//    Operation = Groups.OP_FORFEITS_PAYMENT.Key,
//    Details = details,
//    Date = DateTime.Now,
//    //KeyId = keyid,
//    OrderId = order.Id,
//    ClientId = order.ClientId,
//    RoomId = order.RoomId,
//    BaseId = order.Room.BaseId,
//    SphereId = order.Room.Base.SphereId,
//    DomainId = order.Room.DomainId,
//    Total = Math.Min( forfeit, pays),
//    Text = $"Оплата штрафа {order.Room?.Name}",
//});

///// <summary>
///// Добавление нескольких транзакций
///// </summary>
//async Task addTrans(Guid? keyid, params Transaction[] trans)
//{
//    try
//    {
//        await Db.BeginTransactionAsync();
//        foreach (var t in trans)
//        {
//            if (t.Total == 0) continue; // проверка для отсеивания пустых транзакций
//            t.KeyId = keyid;
//            await Db.InsertAsync(t);
//        }
//        await Db.CommitTransactionAsync();
//    }
//    catch (Exception)
//    {
//        await Db.RollbackTransactionAsync();
//        throw;
//    }

///// <summary>
///// Генерация проводок при оплате штрафа
///// </summary>
//public async Task<bool> PamentForfeitNoOrderAsync(ClientPart part, int df)
//{
//    Db.BeginTransaction1();

//    await addTrans(new Transaction
//    {
//        Register = Groups.REG_CLIENTS.Key,
//        Operation = Groups.OP_CLIENTS_PAYMENT_FORFEIT.Key,
//        //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
//        Date = DateTime.Now,
//        ClientId = part.ClientId,
//        DomainId = part.DomainId,
//        Total = df,
//        Text = $"Оплата штрафа ч/з Тинькофф " + CurrentUser,
//    });            

//    await addTrans(new Transaction
//    {
//        Register = Groups.REG_FORFEITS.Key,
//        Operation = Groups.OP_FORFEITS_PAYMENT.Key,
//        //Details = Groups.DET_SERVICE_DISC_ROOM_CLIENT.Key,
//        Date = DateTime.Now,
//        ClientId = part.ClientId,
//        DomainId = part.DomainId,
//        Total = df,
//        Text = $"Оплата штрафа Тинькофф " + CurrentUser,
//    });

//    Db.CommitTransaction1();
//    return true;
//}


#endregion