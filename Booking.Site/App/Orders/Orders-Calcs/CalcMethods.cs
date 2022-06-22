using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Itall;
using LinqToDB;
using Itall.Services;
using System.Threading.Tasks;

namespace My.App.Orders.Calcs
{
    /// <summary>
    /// Базовый класс для всех правил
    /// </summary>
    public abstract class CalcMethod
    {
        public string Name;

        public CalcMethod AsName(string name)
        {
            Name = name;
            return this;
        }

        public abstract Task Calc(CalcArgs args);
    }


    /// <summary>
    /// Учет Праздников и выходных
    /// </summary>
    class DatesCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            if (args.Date.Year < 2010)  // грязный хак для устранения ошибок вызовов 58297
                args.Date = DateTime.Now;

            args.Texts.AppendLine($"Дата создания брони: {args.Date}");

            // check day weekend, special days
            args.OrderDateH0 = args.DFrom.ToMidnight();

            var day = DbCache.Days.Get().Values.FirstOrDefault(x => x.Date == args.OrderDateH0);
            if (day != null)
            {
                args.SpecDay = day;
                args.DayKind = day.IsWeekend ? DayKind.Weekend2 : DayKind.WorkDay;  // если указан выходной, то ВС
                args.Texts.AppendFormat($"День календаря: {day.Date.ToShortDateString()}, {(day.IsWeekend ? "выходной" : "рабочий")}, {day.Description}");
            }
            else
            {
                // определяем статус дня
                var date = args.OrderDateH0;
                args.DayKind = date.DayOfWeek switch
                {
                    DayOfWeek.Saturday => DayKind.Weekend1,
                    DayOfWeek.Sunday => DayKind.Weekend2,
                    DayOfWeek.Monday => DayKind.WorkFirstDay,
                    DayOfWeek.Friday => DayKind.WorkLastDay,
                    _ => DayKind.WorkDay,
                };

                //if (date.DayOfWeek == DayOfWeek.Saturday)
                //    args.DayKind = DayKind.Weekend1;
                //else if (date.DayOfWeek == DayOfWeek.Sunday)
                //    args.DayKind = DayKind.Weekend2;
                //else if (date.DayOfWeek == DayOfWeek.Monday)
                //    args.DayKind = DayKind.WorkFirstDay;
                //else if (date.DayOfWeek == DayOfWeek.Friday)
                //    args.DayKind = DayKind.WorkLastDay;
                //else
                //    args.DayKind = DayKind.WorkDay;

                args.Texts.AppendFormat($"День {args.OrderDateH0.ToShortDateString()} {args.DayKind}");
            }

            args.IsToday = args.DFrom.Date == args.Date.Date;
        }
    }

    /// <summary>
    /// Начальная инициализация правил, заполнение базовых параметров
    /// </summary>
    class InitCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            //args.Texts.Clear();
            //args.Errors.Clear();

            //// если клиент не задан, то обсчета не производим, считаем все 0
            //if (args.ClientId == null)
            //{
            //    cancel = true;
            //    return;
            //}

            //var oldForfeit = args.FullForfeit - args.OldForfeit; 

            // ищем комнаты
            if (args.Room == null)
            {
                args.Room = await args.Db.Rooms
                    .LoadWith(x => x.Base)
                    //.GetDomainObjects(args.DomainId)
                    .FindAsync(args.RoomId.Value);
            }
            if (args.Room.IsArchive)
                throw new UserException("Невозможно создать или изменить бронь - комната в архиве");

            // ищем параметры клиента
            if (args.ClientPart != null)
                ; // пока пропускаем
            else if (args.ClientId.HasValue)
            {
                var part = args.Db.GetOrCreateClientPart(args.ClientId, args.Room.DomainId, 26);
                args.ClientPart = part; //TODO:  client?.Discount ?? 0;
            }
            else
                args.ClientPart = new CRM.ClientPart { _TempEventId = 12}; // по умолчанию все обнулено

            if (args.ClientPart.IsBanned)
                throw new UserException("Невозможно создать или изменить бронь - клиент заблокирован");

            // перенесли принудительное выставление  order.PayForFeit в OrderDocService
            //if (args.ClientPart.Forfeit > 0 && !args.PayForfeit)
            //{
            //    args.Texts.AppendLine("Выставляем должнику оплату принудительно");
            //    args.PayForfeit = true; // принудительно выставляем оплату, согласно таску https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18238/
            //}

            // считаем часы на основе переданного периода
            args.Hour1 = (double)args.DFrom.Minute / 60 + args.DFrom.Hour;
            args.Hour2 = (double)args.DTo.Minute / 60 + args.DTo.Hour;
            args.SetHours();
            args.IsFixHours = false;


            // ищем актуальные правила
            var all_promos = DbCache.Promotions.Get();


            var promos = all_promos
                .OrderBy(x => x.IsOverride)
                .Where(x => x.DomainId == args.Room.DomainId);

            args.Promos = promos   // для отладки
                .Where(x => x.Allow(args))
                //.Where(x => x.AllowTime(args.Hour1, args.Hour2))
                .ToList();

            //var tt = allRules[66].Allow(args);
        }
    }


    /// <summary>
    /// Проверка правила подтверждения
    /// </summary>
    class CheckClientMailConfirmMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
			//// ADDED BY ELMSOFT: 2019-04-09
            //var client = Db.Clients.Where(cl => cl.Id == obj.ClientId).FirstOrDefault();
            //if (client != null)
            //{
            //    var user = Db.Users.Where(u => u.ClientId == client.Id).FirstOrDefault();
            //    if (user != null)
            //    {
            //        string emailClient = client.Email;
            //        emailClient = System.Text.RegularExpressions.Regex.Replace(emailClient, " ", "");
            //        string[] emailList = emailClient.Split(',');
            //        string email = emailList[0];
            //        string emailUser = user.Email;
            //        if (emailUser != emailClient)
            //        {
            //            user.Email = email;
            //            user.IsConfirmed = false;
            //            Db.Save(user);

            //            var host = Request.Host;
            //            string protocol = Request.HttpContext.Request.Scheme;
            //            string link = protocol + "://" + host + "/api/users/confirmemail/?id=" + user.Id;
            //            string errorMessage = "Бронирование невозможно, e-mail не подтвержден. Ссылка для подтверждения отправлена на " + email + ".";

            //            var model = new { link = link };
            //            App.AddMailTask2(email, model, Sys.TemplateKind.CheckEmailConfirmation);

            //            throw new UserException(errorMessage);
            //        }
            //    }
            //}
        }
    }



    /// <summary>
    /// Специальные цены промо правил
    /// </summary>
    class PromoCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            var promonames = args.Promos.Select(x => x.Name);
            if (args.Promos.Count > 0)
                args.Texts.AppendLine("Доступные промо: " + string.Join(", ", promonames));

            // учитываем промокод? если есть
            CRM.Promotion promo = null;

            // промокд мб задан ссылкой...
            //var promos = args.PromoRules;
            if (args.PromoId.HasValue)
                promo = await args.Db.Promotions.FindAsync(args.PromoId.Value);
            //promo = promos.Find(x => x.Id == args.PromoId.Value);
            else
            // ... или номером
            if (!string.IsNullOrWhiteSpace(args.PromocodeNum))
            {
                promo = await args.Db.Promotions.FirstOrDefaultAsync(x => x.Name == args.PromocodeNum);
                if(promo==null)
                    args.Errors.AppendLine($"Промокод не найден: {args.PromocodeNum}");
                //promo = promos.Find(x => x.Name == args.PromocodeNum);
            }

            if (promo == null) return;

            // проверяем блокировку промокода
            if (promo.IsArchive)
            {
                args.Errors.AppendLine($"Промокод заблокирован: {promo.Name}");
                return;
            }

            // проверяем кол-во заказов по клиенту
            if (args.Hours < promo.MinHours)
            {
                args.Errors.AppendLine($"Промокод '{promo.Name}' действует только для длительности не менее {promo.MinHours} ч.");
                return;
            }

            // проверяем доступность использования
            if (!promo.Allow(args))
            {
                args.Errors.AppendLine($"Промокод запрещен к использованию: {promo.Name}");
                return;
            }

            // проверяем числовые коды
            if (promo.Type == CRM.PromoKind.Number && args.OrderId == null) // только для новых броней, согл https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/18770/ 
            {
                // проверяем доступность партнера
                var domIds = promo.AllowDomainIds.ToGuids();
                if (domIds.Length > 0 && !domIds.Contains(args.Room.DomainId.Value))
                {
                    args.Errors.AppendLine($"Промокод '{promo.Name}' недействителен для данной зоны");
                    return;
                }

                var baseIds = promo.AllowBaseIds.ToGuids();
                if (baseIds.Length > 0 && !baseIds.Contains(args.Room.BaseId.Value))
                {
                    args.Errors.AppendLine($"Промокод '{promo.Name}' недействителен для данной базы");
                    return;
                }

                var roomIds = promo.AllowRoomIds.ToGuids();
                if (roomIds.Length > 0 && !roomIds.Contains(args.RoomId.Value))
                {
                    args.Errors.AppendLine($"Промокод '{promo.Name}' недействителен для данной комнаты");
                    return;
                }

                var qorders = args.Db.Orders
                    .Where(x => x.PromoId == promo.Id)
                    //.Where(x => x.Status == DocumentStatus.Paid)
                    .GetActuals();

                // проверяем общее кол-во заказов
                if (promo.MaxOrders > 0)
                {
                    var n = await qorders.CountAsync() + 1; // учитываем текущую бронь
                    if (n > promo.MaxOrders)
                    {
                        args.Errors.AppendLine($"Промокод '{promo.Name}' недействителен - превышен лимит заказов");
                        return;
                    }
                }

                // проверяем кол-во заказов по клиенту
                if (promo.MaxClientOrders > 0)
                {
                    var n = await qorders.CountAsync(x => x.ClientId == args.ClientId) + 1; // учитываем текущую бронь
                    if (n > promo.MaxClientOrders)
                    {
                        args.Errors.AppendLine($"Промокод '{promo.Name}' недействителен - превышен лимит по клиенту");
                        return;
                    }
                }
            }

            args.Promos.Add(promo);
            //args.Promotion.MergeWith(promo);
            args.Texts.AppendLine($"Учтен промокод: {promo.Name}");
        }
    }


    /// <summary>
    /// Возможная корректировка времени
    /// </summary>
    class HotCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            // if (args.Status == OrderStatus.Unknow) return; // игнорим черновики  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/39181/

            // некоторые акции могут изменять время
            // см таск https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18412/
            var hot = args.Promos
                .Where(x => x.Type == CRM.PromoKind.Hot)
                .OrderByDescending(p => p.HoursSpans.Count)  // 74787 - чтобы не попадали репетиции с HoursSpan=[]
                //.Where(x => x.HoursSpans.Any(h=>h.From == args.Hour1)) // д.б. совпадение по началу
                //.Select(x => new { hours = x.HoursSpans })
                .FirstOrDefault();

            args.HotPromo = null;  // сбрасываем 

            // проверяем доступность времени по горячей репетиции
            if (hot != null)
            {
                // находим последний сет часов, у котогоро начало меньше или равно начало брони
                var h1 = hot.HoursSpans.LastOrDefault(h => h.From == args.Hour1); // ?? args.Hour1;
                // находим первый сет часов, у котогоро конец больше или равно концу брони
                var h2 = hot.HoursSpans.FirstOrDefault(h => h.To >= args.Hour2); // ?? args.Hour2;

                // если совпадает с началом, то акция
                if (h1 != null)
                {
                    //args.IsHotAction = true;
                    args.Texts.AppendLine($"Горящая репетиция: {hot.Name} ({hot.Hours})ч!!");
                    args.HotPromo = hot;
                }

                // проверяем время,  если часы меньше горящей акции, то увеличиваем
                if (h1 != null && h2 != null && args.Hour2 < h2.To)
                {
                    args.Hour1 = h1.From;
                    args.Hour2 = h2.To;
                    args.IsFixHours = true;
					args.HoursError = true;
                    // Изменено на текст - https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/47195/
                    args.Texts.AppendLine($"Указанное время не входит в разрешенные часы ({hot.Hours})");
                    args.Texts.AppendLine($"Бронь пересчитана с учетом горящей репетиции {hot.Name} ({hot.Hours})");
                }
            }

            //foreach (var r in hourRules)
            //{
            //    //if(r.)
            //    // ищем часы, которые перекрывают наши
            //    //var h = r.HoursSpans.FirstOrDefault(x=>x.From <= args.Hour1 && x.To >= args.Hour2);
            //    //r.HoursSpans.TestHours(args);
            //}

            args.SetHours();
        }
    }


    /// <summary>
    /// Проверка доступности часа для комнаты
    /// </summary>
    class RoomHoursMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            //if (!args.IsChecking()) return;  // если бронь неактуальна, то не проверяем часы комнат

            // проверяем часы до начала заказа - 55757 
            if(args.IsCheckReserv() && !args.Room.CheckHoursBefore( args.DFrom - args.Date )) // только для резерва
            {
                args.Errors.AppendLine($"Кол-во часов до начала меньше {args.Room.HoursBefore} час. у комнаты");
            }

            var is_weekend = args.DayKind == DayKind.Weekend2 || args.DayKind == DayKind.Weekend1;

            if (!args.IgnoreMinHours)  // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/51135/
            {
                // if (args.Status == OrderStatus.Unknow) return; // пока не игнорим черновики  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/39181/

                // Проверяем минимальные часы
                var minhs = (args.Room.MinHours + ",0,0,0,0,0").ToInts(); // по умолчанию 0
                if (minhs[1] == 0) minhs[1] = minhs[0]; // если заранее вых 0, то берем дефолтный
                if (minhs[2] == 0) minhs[2] = minhs[0]; // если сегодны 0, то берем дефолтный
                if (minhs[3] == 0) minhs[3] = minhs[2]; // если сег вых 0, то берем сегодня

                var minh = 0;  // по умолчанию 0, любое время
                if (args.IsToday)                               // если сегодня...
                    minh = is_weekend  // ...и выходной
                        ? minhs[3]
                        : minhs[2];
                else
                    minh = is_weekend       // если заранее и выходной
                        ? minhs[1]
                        : minhs[0];

                // собственно проверка мин часов
                if (args.Hours < minh)
                {
                    args.Hour2 = args.Hour1 + minh;
                    args.IsFixHours = true;
                    args.Texts.AppendLine($"Увеличена длительность до минимальной: {minh} ч.");
                }
            }

            var sHours = args.Room.DefaultHours;            // по умолчанию дефолтные часы 

            if (args.IsToday)                               // если сегодня...
                sHours = is_weekend   // ...и выходной
                    ? args.Room.TodayWkHours                // то TodayWkHours
                    : (args.Room.TodayHours                  // иначе TodayHours
                    ?? sHours);                             // или дефолтные 
            else if (is_weekend)       // если не сегодня и выходной
                sHours = args.Room.WeekendHours ?? sHours;  // то WeekendHours

            sHours = sHours?.Trim();
            if (string.IsNullOrWhiteSpace(sHours)) // если пусто, то пропускаем всех
                return;


            var hours = HoursSpan.Parse(sHours).OrderBy(x => x.From).ToArray();
            args.RoomHours = hours;
            var last = hours.Last();
            if (last.IsSingle) last.To = 24;

            for (var i = hours.Length - 2; i >= 0; i--)
            {
                var p = hours[i];
                if (p.IsSingle)
                {
                    p.To = hours[i + 1].From;
                }
            }

            //var hours = ("," + sHours + ",")        // нормализуем представление
            //    .Replace(' ',',')
            //    .Replace(",,,,", ",")
            //    .Replace(",,,", ",")
            //    .Replace(",,",","); 

            //var hours = string.Join(",", ihours);
            ////if (hours.Length == 0) return;
            ////var h = args.DFrom.Hour; // + args.DFrom.Minute / 60;

            //var h = $"{args.DFrom.Hour}-{args.DTo.Hour}";       // часы для справки
            //var h1 = $",{args.DFrom.Hour},{args.DTo.Hour}";     // для шаблона вида:  ,15,18...
            //var h2 = $",{args.DFrom.Hour}-{args.DTo.Hour},";    // для шаблона вида:  ,15-18,....

            //var allow = hours.Contains(h1) || hours.Contains(h2);
            var hh1 = hours.FirstOrDefault(x => x.From == args.Hour1);
            var hto = args.Hour2;
            if (hto == 0) hto = 24; // если полнось, то устанавливаем 24ч
            var hh2 = hours.FirstOrDefault(x => x.To == hto);

            if (hh1 != null && hh2 != null || args.IsFixHours)
                ; // Ура, прошли в полуфинал
            else if (hh1 != null) // h2 = null - не найдено завершение
            {
                // ищем ближайший разрешенный h2
                hh2 = hours.FirstOrDefault(x => x.To > hto);
                if (hh2 != null) // ура, нашли ближайшее окончание!! ТЕперь изменяем бронь
                {
                    args.Hour2 = hh2.To;
                    args.IsFixHours = true;
                    //args.Errors.AppendLine($"Указанное время не входит в разрешенные часы ({sHours})");
                    args.Texts.AppendLine($"Бронь пересчитана с учетом разрешенного времени {args.Hour1}-{args.Hour2}");
                }
            }

            if (args.IsCheckReserv() && (hh1 == null || hh2 == null))
            {
                args.Errors.AppendLine($"Указанное время не входит в разрешенные часы ({sHours})");
				args.HoursError = true;
                //TODO: hours.TestHours(args);
            }

            args.SetHours();
        }
    }


    /// <summary>
    /// Расчет цен за комнату
    /// </summary>
    class PricesCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            // if (args.Status == OrderStatus.Unknow) return; // игнорим черновики  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/39181/


            ////
            //if (args.RoomPrice > 0)
            //{
            //    args.Texts.AppendLine($"Ранее рассчитанная цена за комнату: {args.RoomPrice} ");
            //    return;
            //};

            //var prices = args.Room.Prices;//
            var promoIdents = args.Promos.Select(x => x.Id).ToList();
            var odate = args.OrderDateH0;
            var odate1 = odate.AddDays(1);

            var pricelist = DbCache.Prices.Get();
            var prices = pricelist  //.AsQueryable()
                //.GetDomainObjects(args.Room.DomainId)
                .Where(x => x.DomainId == args.Room.DomainId)
                .GetActuals()
                .Where(x => x.PromoId == null || promoIdents.Contains(x.PromoId.Value))
                .Where(x => x.RoomId == args.RoomId || x.RoomId == null && x.BaseId == args.Room.BaseId || x.BaseId == null && x.RoomId == null)
                // добавляем срок цен https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/20536/
                .Where(p => p.DateFrom == null || p.DateFrom <= odate)
                .Where(p => p.DateTo == null || p.DateTo >= odate1)
                .ToArray() // для оптимизации сортировки
                .OrderBy(x => x.PromoId == null)
                .ThenBy(x => x.RoomId == null)
                .ThenBy(x => x.BaseId == null)
                .ToList();

            var day = args.DFrom.DayOfWeek;
            args.TimeCalcs.Clear();

            for (var h = args.Hour1; h < args.Hour2;)
            {
                var delta = 0.5;
                if (Math.Truncate(h) == h && args.Hour2 - h >= 1)
                    delta = 1;

                var price = prices
                    .Where(p => p.PromoId == null || p.Promo.AllowTime(h, h + delta))
                    .FirstOrDefault(p => p.TimeFrom <= h && p.TimeTo > h);

                if (price == null && args.IsCheckReserv())
                {
                    args.Errors.AppendLine($"Не найдена цена для комнаты на {h} ч");
                    h += delta;
                    continue;
                }

                var s = price?.GetPrice(args.DayKind) ?? 0;
                if (s == 0 && args.IsCheckReserv())
                    args.Errors.AppendLine($"Нельзя бронировать комнату на {h} ч");


                s = Convert.ToInt32(delta * s);
                //args.RoomPrice += s;
                args.TimeCalcs.Add(new TimeCalc
                {
                    //Date = args.Date,
                    Hour1 = h,
                    Hour2 = h + delta,
                    OriginRoomPrice = s,
                    Price = price,
                });
                //args.Texts.AppendLine($"Цена за {h}-й час {price?.Promo?.Name} = {s} ");

                h += delta;
            }
            //args.Texts.AppendLine($"Итого за комнаты {args.RoomPrice}");
        }
    }


    /// <summary>
    /// Расчет цен на доп.оборудование
    /// </summary>
    class EquipmentsCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            if (string.IsNullOrWhiteSpace(args.ItemsJson)) return;
            //
            //var equipments = args.Db.Equipments.Where(x => ids.Contains(x.Id));
            //var names = await equipments.Select(x => x.Name + ": " + x.Price + (Enum.GetName(typeof(DestKind), x.DestKind) )).ToListAsync();
            //args.EqPrice = items.SumAsync(x => x.Price);  // считаем цену для оборудования с учетом времени
            //args.Texts.AppendLine($"Расчет суммы позиции {args.EqPrice}={string.Join("+ ", names)}");

            args.EqPrice = 0;
            args.Texts.Append($"Расчет суммы по позициям: ");
            args.EqPackage = 0; // сумма для пакетного предложения

            //var ids = args.EqIds.Split(',').Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => Guid.Parse(x));
            var items = OrderHelper.GetItems(args.ItemsJson, true, true).ToList();
            //var eqdict = EquipmentsController.List.Get();  ---- добавлено в GetItems
            //items.ForEach(item => item.Equipment = eqdict.GetValueOrDefault(item.eq.Value, null));

            foreach (var item in items)
            {
                var ires = item.ToResult(args.Hours);
                args.EqPackage += ires.Roundings;
                args.EqPrice += ires.Total;
                args.Items.Add(ires);
                args.Texts.AppendLine(ires.Text);
            }

            args.Texts.AppendLine($" Итого {args.EqPrice}");

            args.HasPackage = items.Any(item => item.Equipment?.DestKind == EqDestKind.Package);   // считаем сумму сразу для оборудования без учета времени


            if (!args.CheckErrors) return;

            var db = args.Db;

            // проверяем - хватает ли оборудования на базе
            var baseId = args.Room.BaseId;

            // ... запоминаем список оплаченных заказов по базе, которые пересекаются с текущим временем - dfrom...dto
            var orders = await db.Orders
                //.GetDomainObjects(args.DomainId)
                .GetActuals()
                .Where(x =>
                    x.Room.BaseId == baseId &&
                    x.Id != args.OrderId &&
                    (x.Status == OrderStatus.Closed || x.Status == OrderStatus.Reserv) &&
                    //((x.DateFrom>=dfrom.Value && x.DateFrom<=dto.Value) || (x.DateTo>=dfrom.Value && x.DateTo<=dto.Value))
                    x.DateFrom < args.DTo && x.DateTo > args.DFrom
                 )
                 .ToListAsync();

            // ... сохраняем остатки оборудования по комнате
            var rests = DbCache.Equipments.Get().Values
                //.GetDomainObjects(args.DomainId)
                .Where(x => x.BaseId == baseId)
                .ToDictionary(x => x.Id, x => new { x.Count, x.Name });

            // ... для каждого доп.оборудования - ищем остаток и 
            var orderitems = orders
                .Where(or => or.ItemsJson != null)
                .SelectMany(or => OrderHelper.GetItems(or.ItemsJson, true))
                .ToList();

            foreach (var item in items)
            {
                var rest = rests.GetValueOrDefault2(item.eq.Value, new { Count = 0, Name = "" });
                //var n = orders.Where(x => ("," + x.Equipments + ",").Contains("," + eqid + ",")).Count();
                var n = orderitems
                    .Where(oi => oi.eq == item.eq)
                    .Sum(item => item.n);

                if (rest.Count <= n)
                    args.Errors.AppendLine($"Превышение лимита {rest.Name} - всего {rest.Count}, уже заказано {n}");
            }
            //if (errors.Length > 0)
            //    return Error("Недостаточно оборудования: " + errors.ToString());
        }
    }


    /// <summary>
    /// Проверка свободной комнаты
    /// </summary>
    class RoomFreeCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            if (args.Status == OrderStatus.Request)
                return;  // не проверяем для заявок

            if (!args.CheckOrders)
            {
                args.Texts.AppendLine("Другие брони не проверялись");
                return;
            }

            var qorders = args.Orders ?? args.Db.Orders.GetActuals();
            var orders = qorders
                //.GetDomainObjects(args.DomainId)
                .GetBetweenOrders(args.DFrom, args.DTo, args.RoomId);

            if (args.OrderId.HasValue)
                orders = orders.Where(x => x.Id != args.OrderId);

            args.HasOrders = await orders.AnyAsync();
            if (args.HasOrders)
            {
                args.Errors.AppendLine("Найдены другие брони на это время");
            }
        }
    }

    /// <summary>
    /// Расчет итогов
    /// </summary>
    class TotalsCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            /// args.EqPrice = 0; там хранится оригинальное значение EqPrice
            args.EqDiscountSum = 0;
            args.EqClientDiscountSum = 0;
            args.RoomPrice = 0;
            args.TotalOrder = 0;

            args.Texts.AppendLine("Цены на комнату по часам");

            // используем double, чтобы избежать ошибки округления
            double promoDiscountSum = 0, roomDiscountSum = 0, roomClientDiscountSum = 0;

            foreach (var tcalc in args.TimeCalcs)
            {
                applyTimeCalc(args, tcalc);

                args.RoomPrice += tcalc.OriginRoomPrice;
                roomDiscountSum += tcalc.RoomDiscountSum;
                roomClientDiscountSum += tcalc.RoomClientDiscountSum;

                // ищем макс абсолютную скидку
                if (tcalc.Promotion.DiscountSum > promoDiscountSum)
                    promoDiscountSum = tcalc.Promotion.DiscountSum;

                if (tcalc.EqPrice > 0 || tcalc.EqDiscountSum > 0 || tcalc.EqClientDiscountSum > 0) // если ненулевые суммы по оборудованию
                {
                    //args.EqPrice = tcalc.EqPrice;
                    args.EqDiscountSum = tcalc.EqDiscountSum;
                    args.EqClientDiscountSum = tcalc.EqClientDiscountSum;
                }
            }

            var roomSum = -roomDiscountSum - roomClientDiscountSum + args.RoomPrice;
            if (promoDiscountSum > 0)
            {
                promoDiscountSum = Math.Min(roomSum, promoDiscountSum);
                roomDiscountSum += promoDiscountSum;
                roomSum -= promoDiscountSum;
                args.Texts.AppendLine($"Учтена скидка {promoDiscountSum} руб");
            }
            args.RoomDiscountSum = Convert.ToInt32(roomDiscountSum);
            args.RoomClientDiscountSum = Convert.ToInt32(roomClientDiscountSum + 0.1f);
            args.RoomSum = args.RoomPrice - args.RoomDiscountSum - args.RoomClientDiscountSum; // - args.RoundSum Convert.ToInt32(roomSum);
            args.RoomSumR = SysUtils.Round5(args.RoomSum); // округление до 5, https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/40379/
            //if(args.RoomSumR != args.RoomSum) // блокируем с 1/09/2020, согл документу п.4 в задаче https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/43835/ 
            //{
            //    args.Texts.AppendLine($"Округление стоимости комнаты: {args.RoomSum} -> {roomsum}");
            //    args.RoomPrice += (args.RoomSumR - args.RoomSum);
            //    args.RoomSum = args.RoomSumR;
            //}

            args.EqSum = args.EqPrice - args.EqDiscountSum - args.EqClientDiscountSum;
            if (args.HasPackage)
            {
                args.DiscountPackage = args.RoomSum; // отказываемся от обнуления, но сохраняем скидку на комнату
                //args.RoomSum = 0; // обнуляем согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/31060/
                args.RoomSumR = 0; // обнуляем согласно https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/51427/
            }
            args.TotalPrice = args.RoomPrice + args.EqPrice;
            args.TotalOrder = args.RoomSum + args.EqSum - args.DiscountPackage;
            args.TotalSum = args.TotalOrder + args.PaidForfeit;

            args.Texts.AppendLine($"Итог {args.TotalOrder} руб =<br/>" +
                $" комната: {args.RoomSum}={(args.HasPackage?"без у/в":"")} [{args.RoomPrice}-{args.DiscountPackage}-{args.RoomDiscountSum}-{args.RoomClientDiscountSum}-{args.RoundSum} ] +<br/>" +
                $" доп: {args.EqSum}= {args.EqPrice}-{args.EqDiscountSum}-{args.EqClientDiscountSum}]");
        }


        void applyTimeCalc(CalcArgs args, TimeCalc tcalc)
        {
            var promo = tcalc.Promotion;

            // объединяем условия по доступным promo rules
            var promos = args.Promos
                .Where(x => x.AllowTime(tcalc.Hour1, tcalc.Hour2));

            foreach (var ipromo in promos)
            {
                promo.MergeWith(ipromo);
            }

            // учет акции
            //args.IsHotAction = isHot;
            //if (args.IsHotAction)
            //    args.Texts.AppendLine($"Горящая репетиция!!");

            // учет скидки клиента
            var clientDiscount = 0;
            if (args.ClientPart.Discount == 0)
            {
                // ничего не делаем, пинаем шайбу
            }
            else if (promo.ClientDiscountKind != DiscountKind.IgnoreDiscount)
            {
                clientDiscount = args.ClientPart.Discount;
                //args.Texts.AppendLine($"Скидка клиента: {clientDiscount}%");
            }
            else
            {
                //args.Texts.AppendLine($"Игнор. скидка клиента {args.ClientPart.Discount}%");
            }

            // учет скидки клиента для доп.оборудования
            var eqClientDiscount = 0;
            if (args.ClientPart.Discount == 0)
            {
                // ничего не делаем
            }
            else if (promo.EqClientDiscountKind != DiscountKind.IgnoreDiscount)
            {
                eqClientDiscount = args.ClientPart.Discount;
                //args.Texts.AppendLine($"Скидка клиента на оборуд: {eqClientDiscount}%");
            }
            else
            {
                //args.Texts.AppendLine($"Игнор. скидки клиента на оборуд. {args.ClientPart.Discount}%");
            }


            // рассчитываем цену комнаты
            var roomPrice = 0.01 * (100 - promo.Discount - clientDiscount) * tcalc.OriginRoomPrice;
            if (roomPrice < 0) roomPrice = 0;

            var eqPrice = args.EqPrice * (100 - promo.EqDiscount - eqClientDiscount) / 100;
            if (eqPrice < 0) eqPrice = 0;

            args.Texts.AppendLine($"{roomPrice} р, {tcalc.Hour1}..{tcalc.Hour2} ч = {tcalc.OriginRoomPrice} {tcalc.Price?.Promo?.Name} -{promo.Discount}% -{clientDiscount}%");

            tcalc.EqDiscountSum = args.EqPrice * promo.EqDiscount / 100;
            tcalc.EqClientDiscountSum = args.EqPrice * eqClientDiscount / 100;
            tcalc.EqPrice = eqPrice;

            tcalc.RoomClientDiscountSum = 0.01 * tcalc.OriginRoomPrice * clientDiscount;
            tcalc.RoomPrice = roomPrice; /// tcalc.OriginRoomPrice
            tcalc.RoomDiscountSum = tcalc.OriginRoomPrice - roomPrice - tcalc.RoomClientDiscountSum;//0.01 * tcalc.OriginRoomPrice * promo.Discount;
        }
    }

    /// <summary>
    /// Учет штрафов
    /// </summary>
    class ForfeitsCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            //if(args.IsPromoRoom)

            // старый вариант
            // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/10420/
            // Если в карточке клиента стоит промокод
            // штраф равен стоимости репетиции без дополнительного оборудования без учета индивидуальной скидки,но с учетом условий промокода
            // если стоит галочка “акция комнаты” штраф равен стоимости репетиции без дополнительного оборудования без учета индивидуальной скидки,но с учетом условий промокода, если у него стоит галочка

            if (!args.PayForfeit) return; // || args.ClientForfeit==0 && args.OrderForfeit==0) return;

            //args.OrderForfeit = args.orde args.RoomPrice;

            // новый вариант
            // https://docs.google.com/document/d/1TcmNDgDAa-12JpwAchn_Zu8US-fMT4CAoLJNLCd7EiM/edit?usp=sharing
            //Если в карточке клиента стоит промокод с учетом индивидуальной скидки клиента
            //Сбор равен стоимости репетиции без дополнительного оборудования с учетом индивидуальной скидки и с учетом условий промокода.

            //Статус “соло” “дуэт” “день в день”
            //Сбор равен стоимости репетиции без дополнительного оборудования БЕЗ УЧЕТА индивидуальной скидки.

            /*/ старые штрафы
            var forfeit = args.OrderForfeit; // args.RoomPrice; 
                                             // закоментил согласно обсуждению 
                                             // https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/15814/
                                             // сбор = цене комнаты с учетом всех скидок
                                             //var isToday = args.DFrom.ToShortDateString() == args.Date.ToShortDateString();
                                             //if (args.Group != GroupKind.Group || isToday) // если соло, дуэт, сегодня - считается, что уже есть скидка
                                             //    forfeit = forfeit;
                                             //else
                                             //    forfeit = forfeit * (100 - args.ClientPart.Discount) / 100;

            // если отмена подтвеждения - штраф не учитываем - он уже сидит у клиента
            if (args.Status == OrderStatus.Cancel) // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18542/
                forfeit = 0;

            args.ForfeitSum = args.ClientPart.Forfeit + forfeit;
            */

            //args.ForfeitSum = args.Forfeit;

            // новая схема расчета штрафов - пока на паузу
            //args.ForfeitSum = await args.Db.ForfeitAsync(args.ClientPart.DomainId, args.ClientId);

            // рассчитываем начальный штраф, если 
            //args.ForfeitSum = args.ClientPart.Forfeit;

            // комментарим работу с переносом штрафа на другой ордер, т.к. новая модель
            //var part = args.ClientPart;
            //if ( part.Forfeit > 0 )  //part.AllowForfeit(args.OrderId))
            //{
            //    if (part.ForfeitOrderId != null && part.ForfeitOrderId != args.OrderId)  // снимаем штраф с другого ордера - но делаем это при сохранении
            //    {
            //        var oldForfeitOrder = await args.Db.Orders
            //            .LoadWith(o => o.Room.Base)
            //            .LoadWith(o => o.Room.Domain)
            //            .FindAsync(part.ForfeitOrderId);
            //        args.Texts.AppendLine($"Штраф сейчас выставлен у брони: {oldForfeitOrder.Room.Name} от {oldForfeitOrder.DateFrom}, = {oldForfeitOrder.Forfeit}, и будет обнулен "); // {forfeit} +

            //        if (args.Save)
            //        {
            //            oldForfeitOrder.PayForfeit = false;
            //            oldForfeitOrder.Forfeit = 0;
            //            await OrderCalcHelper.CalcOrderAsync(args.Db, oldForfeitOrder, true);
            //        }
            //    }

            //    //if (part.ForfeitOrderId == null) // пока выставляем принудительно только для пустых значений
            //    part.ForfeitOrderId = args.OrderId;
            //    // part.IsPayed = false; // 

            //    if (args.Save)
            //    {
            //        args.Db.Save( part );
            //    }
            //    args.ForfeitSum = part.Forfeit;
            //    //args.PayForfeit = true; // принудительно выставляем оплату, согласно таску https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/18238/
            //}
            //else
            //{
            //    args.ForfeitSum = 0;
            //    //args.PayForfeit = false;
            //}


            args.TotalSum = args.TotalOrder + args.Forfeit + args.PaidForfeit;
            args.Texts.AppendLine($"Итог со штрафом: {args.TotalSum} = {args.TotalOrder} + штрафы ( {args.Forfeit} + {args.PaidForfeit} опл.) "); // {forfeit} +
        }
    }


    /// <summary>
    /// Списание баллами
    /// </summary>
    class PointsMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            if (args.PointsSum == 0) // не пересчитываем, если задано, напр, в случае оплаты #52403
            {

                args.PointsSum = 0;
                if (!args.IsPointsPay) return;

                var balance = args.ClientId == null ? 0
                    //: CRM.PointsService.GetBalance( args.Db.Points.Where(p => p.User.ClientId == args.ClientId) );
                    : args.Db.Transactions
                        .Where(t => t.ClientId == args.ClientId)
                        .WhereIf(args.OrderId != null, t => t.OrderId == null || t.OrderId != args.OrderId)
                        .BalanceAsync(Fin.Groups.REG_POINTS).Result;
                if (balance <= 0) return;

                // считаем макс оплату по базе
                var maxpc = args.Room.Base.MaxPointsPcPay;
                if (maxpc <= 0) return; // партнер не участвует в программе лояльности

                var oldsum = args.PointsSum;
                args.PointsSum = (args.RoomSum + args.EqSum) * maxpc / 100; // вместо TotalSumn, убираем учет штрафов, согл модели https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/43109/
                                                                            // если макс > баланса, то снимаем весь баланс
                if (args.PointsSum > balance)
                    args.PointsSum = balance;

                // если была оплата, то изменяем
                if (args.Save && args.PointsSum != oldsum && args.Status == OrderStatus.Closed)
                {
                    //var svc = new CRM.PointsService { Db = args.Db };
                    //var r2 = await svc.OnPaymentChangeAsync(args.OrderId, args.PointsSum);
                    var tsvc = new Fin.TransService { Db = args.Db };
                    await tsvc.__PointsChangeAsync_old();
                }
                args.Texts.AppendLine($"Оплачено баллами: {args.PointsSum} из доступных баллов {balance}, с учетом макс {maxpc}% базы  ");
            }
            else
            {
                args.Texts.AppendLine($"Оплачено фикс. баллами: {args.PointsSum} ");
            }
            args.TotalSum -= args.PointsSum;
            args.Texts.AppendLine($"Сумма к оплате: {args.TotalSum}");

        }
    }


    /// <summary>
    /// Округление итогов 
    /// </summary>
    class RoundCalcMethod : CalcMethod
    {
        public override async Task Calc(CalcArgs args)
        {
            // округляем до 5
            var delta = SysUtils.Round5(args.TotalSum) - args.TotalSum;
            if (delta != 0)
            {
                args.Texts.AppendLine($"Учтено округление до 5р = {delta} руб");
                args.TotalOrder += delta;
                args.TotalSum += delta;
                args.RoundSum = -delta;
            }
            else
                args.RoundSum = 0;

            args.Texts.AppendLine($"К оплате {args.TotalSum} руб");
        }
    }




}


#region --- Misc -----



///// <summary>
///// Учет Соло или дуэта
///// </summary>
//class SoloDuetOrderRule : OrderRule
//{
//    public override void Apply(OrderCalcArgs args)
//    {
//        var ruleWorkday = args.DayKind != DayKind.Weekend && args.ToHour <= 18;
//        //if (ruleWorkday) args.Texts.AppendLine($"Рабочий день или до 18 часов");

//        var ruleToday = args.Date == DateTime.Now.ToMidnight(); // день в день
//        //if (ruleToday) args.Texts.AppendLine($"День в день");

//        var ruleSoloDouble = ruleWorkday || ruleToday;

//        args.IsSoloDuetMode = ruleSoloDouble &&
//            (args.Group == Models.GroupKind.Solo |
//            args.Group == Models.GroupKind.Duet);

//        if (!args.IsSoloDuetMode)
//        {
//            args.RoomPrice = 0; //сбрасываем
//            return;
//        }

//        //if (args.RoomPrice > 0) return;
//        var roomPrice = (args.Group == Models.GroupKind.Solo) ? 150 : 200;
//        args.RoomPrice = Convert.ToInt32(args.Hours * roomPrice);
//        args.Texts.AppendLine($"Режим Соло или Дуэта, Рабочий день или до 18 часов или день в день, цена комнаты {args.RoomPrice} = {roomPrice} * {args.Hours}");
//    }
//}



///// <summary>
///// Учет промо акций
///// </summary>
//class PromoOrderRule : OrderRule
//{
//    public override void Apply(OrderCalcArgs args)
//    {
//        Models.Promotion promo = null;

//        if (args.PromoId.HasValue)
//        {
//            promo = args.Db.Promotions
//                .FindAsync(args.PromoId.Value).Await();
//        }
//        else if (!string.IsNullOrWhiteSpace(args.PromocodeNum))
//        {
//            promo = args.Db.Promotions
//                .FirstAsync(x=>x.Name == args.PromocodeNum).Await();
//        }

//        if (promo == null) return;

//        if (promo.IsArchive)
//        {
//            args.Errors.AppendLine($"Промокод заблокирован");
//            return;
//        }

//        args.Promotion = promo;
//        args.DiscountRoom = promo.Discount;
//        args.Discount = 0;
//        if (promo.IsIgnoreEquipment) args.EqKf = 0;
//        args.IsPromoRoom = !promo.IsAction;
//        args.Texts.AppendLine($"Учтен промокод: {promo.Name}, скидка промо: {promo.Discount}, {(promo.IsIgnoreEquipment ? "доп=0" : "")} ");
//    }
//}

///// <summary>
///// Расчет цен за комнату
///// </summary>
//class RoomsOrderRule : OrderRule
//{
//    public override void Apply(OrderCalcArgs args, ref bool cancel)
//    {
//        if (args.IsSoloDuetMode) return;

//        var room = args.Room; //.Db.GetTable<Room>().FindAsync(args.RoomId).Await();
//        args.IsPromoRoom = room.IsPromo;
//        args.Texts.AppendLine($"Комната {room.Name}, акция: {room.IsPromo.ToRusString()}, учет акции: {args.IsPromoRoom.ToRusString()} ");
//    }
//}

#endregion
