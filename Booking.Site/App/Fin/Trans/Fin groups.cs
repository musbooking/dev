using LinqToDB;
using My.App.CRM;
using My.App.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itall;

namespace My.App.Fin
{


    /// <summary>
    /// Группировка транзакций по регистрам, операциям, деталям
    /// </summary>
    public class Groups
    {
        public class Row
        {
            public int Key;
            public string Name;
            public int Sign = 1;
            public byte Lvl = 1;

            public override string ToString()
            {
                return $"{Key}: {Name} x {Sign}";
            }
        }


        /// <summary>
        /// Список всех записей
        /// </summary>
        public static readonly Row[] ROWS = null;


        /// <summary>
        /// KEYS с SIGN = 1
        /// </summary>
        public static readonly int[] ROWS_SIGN_LESS_0 = null;


        public static readonly Dictionary<int,Row> Dict = null;


        static Groups()
        {
            ROWS = typeof(Groups).GetFields()
                .Where(f => f.FieldType == typeof(Row))
                .Select(f => (Row)f.GetValue(null))
                .ToArray();

            ROWS_SIGN_LESS_0 = ROWS
                .Where(r => r.Sign < 0)
                .Select(r => r.Key)
                .ToArray();

            Dict = ROWS.ToDictionary(r => r.Key);
        }

        public static string Name(int key)
        {
            var d = Dict.GetValueOrDefault(key);
            return d?.Name;
        }

        public static Row EMPTY = new Row { Key = 0, Name = "", Lvl = 0 };

        public static Row REG_SERVICE = new Row { Key = 100, Name = "Услуги", Lvl = 1 };
        public static Row OP_SERVICE_RESERV = new Row { Key = 110, Name = "Резервирование", Lvl = 2 };
        public static Row DET_SERVICE_ROOM = new Row { Key = 111, Name = "Аренда комнаты", Lvl = 3 };
        public static Row DET_SERVICE_EQ = new Row { Key = 112, Name = "Аренда оборудования", Lvl = 3 };
        public static Row DET_SERVICE_DISC_EQ = new Row { Key = 113, Name = "Скидка оборудование", Lvl = 3, Sign = -1 };
        public static Row DET_SERVICE_DISC_EQ_CLIENT = new Row { Key = 114, Name = "Скидка оборудование клиенту", Lvl = 3, Sign = -1 };
        public static Row DET_SERVICE_DISC_PROMO = new Row { Key = 115, Name = "Скидка по промоакции", Lvl = 3, Sign = -1 };
        public static Row DET_SERVICE_DISC_ROOM_CLIENT = new Row { Key = 116, Name = "Скидка клиенту", Lvl = 3, Sign = -1 };
        public static Row DET_SERVICE_DISC_POINTS = new Row { Key = 117, Name = "Скидка баллами", Lvl = 3, Sign = -1 };
        public static Row DET_SERVICE_ROUND = new Row { Key = 118, Name = "Окгругление", Lvl = 3, Sign = -1 };
        public static Row DET_SERVICE_DISC_PACKAGE = new Row { Key = 119, Name = "Сброс стоимости комнаты", Lvl = 3, Sign = -1 };

        public static Row REG_CLIENTS = new Row { Key = 200, Name = "Расчеты с клиентами", Lvl = 1 };
        public static Row OP_CLIENTS_RESERV = new Row { Key = 210, Name = "Услуга аренды", Lvl = 2, Sign = -1 };
        public static Row OP_CLIENTS_PAYMENT_RUB = new Row { Key = 220, Name = "Оплата руб", Lvl = 2 };
        public static Row DET_CLIENTS_PAYMENT_ONLINE = new Row { Key = 221, Name = "Тиньков", Lvl = 3 };
        public static Row DET_CLIENTS_PAYMENT_CASH = new Row { Key = 222, Name = "Наличные", Lvl = 3 };
        public static Row DET_CLIENTS_PAYMENT_AUTOCACH = new Row { Key = 223, Name = "Оплата наличными (закр.)", Lvl = 3 };
        public static Row DET_CLIENTS_PAYMENT_AUTOBACK = new Row { Key = 224, Name = "Возврат наличными (закр.)", Lvl = 3, Sign = -1 };
        public static Row DET_CLIENTS_PAYMENT_FORFEIT = new Row { Key = 225, Name = "Оплата штрафа безнал", Lvl = 3 };
        public static Row DET_CLIENTS_PAYMENT_AUTOBACK_TINKOFF = new Row { Key = 226, Name = "Возврат наличными Банк (закр.)", Lvl = 3, Sign = -1 };
        public static Row OP_CLIENTS_PAYMENT_POINTS = new Row { Key = 230, Name = "Оплата баллами", Lvl = 2 };
        public static Row OP_CLIENTS_PAYMENT_WALLET = new Row { Key = 240, Name = "Оплата кошельком", Lvl = 2 };
        public static Row OP_CLIENTS_CANCEL = new Row { Key = 250, Name = "Отмена брони клиентом", Lvl = 2 };
        public static Row OP_CLIENTS_FORFEIT = new Row { Key = 260, Name = "Начисление штрафа", Lvl = 2, Sign = -1 };
        public static Row OP_CLIENTS_PAYMENT_FORFEIT = new Row { Key = 270, Name = "Оплата штрафа", Lvl = 2 };

        public static Row REG_WALLETS = new Row { Key = 300, Name = "Электронный кошелек", Lvl = 1 };
        public static Row OP_WALLETS_ADD = new Row { Key = 310, Name = "Перечисление оплаты на кошелек", Lvl = 2 };
        public static Row OP_WALLETS_REM = new Row { Key = 320, Name = "Зачет кошелька в оплату", Lvl = 2, Sign = -1 };

        public static Row REG_POINTS = new Row { Key = 400, Name = "Баллы", Lvl = 1 };
        public static Row OP_POINTS_ADD = new Row { Key = 410, Name = "Расчеты баллами", Lvl = 2 }; 
        public static Row DET_POINTS_REG = new Row { Key = 411, Name = "За регистрацию", Lvl = 3 };
        public static Row DET_POINTS_PROFILE = new Row { Key = 412, Name = "За профиль", Lvl = 3 };
        public static Row DET_POINTS_BOOKING = new Row { Key = 413, Name = "За резервирование", Lvl = 3 };
        public static Row DET_POINTS_INVITE = new Row { Key = 414, Name = "За приглашение", Lvl = 3 };
        public static Row DET_POINTS_MANUAL = new Row { Key = 415, Name = "Ручное", Lvl = 3 };
        public static Row DET_POINTS_REVIEW = new Row { Key = 416, Name = "За отзыв", Lvl = 3 };
        public static Row DET_POINTS_PAYMENT = new Row { Key = 420, Name = "Оплата баллами", Lvl = 3 };  // , Sign = -1
        public static Row DET_POINTS_RETURN = new Row { Key = 421, Name = "Возврат баллов", Lvl = 3};
        public static Row OP_POINTS_REM = new Row { Key = 430, Name = "Зачет баллами", Lvl = 2, Sign = -1 };
        //Registration = 1,
        //Profile = 2,
        //Booking = 3,
        //Invite = 4,  // За приглашение
        //Manual = 5,  // Принудительное начисление
        ////Auto = 6,   // автоматическая операция сервиса
        //// расходы
        //Payment = 10,
        //RetBooking = 11,  // возврат баллов при отмене бронирования

        // Расчеты с партнерами
        public static Row REG_PARTNERS = new Row { Key = 500, Name = "Расчеты с партнерами", Lvl = 1 };
        public static Row OP_PARTNERS_COMM = new Row { Key = 510, Name = "Начисление комиссии", Lvl = 2, Sign = -1 };
        public static Row OP_PARTNERS_TARIF = new Row { Key = 520, Name = "Начисление тарифа", Lvl = 2, Sign = -1 };
        public static Row OP_PARTNERS_PAYMENT = new Row { Key = 530, Name = "Оплата партнера по счету", Lvl = 2 };


        // Начисление и оплата штрафа
        public static Row REG_FORFEITS = new Row { Key = 600, Name = "Расчеты штрафов", Lvl = 1 };
        public static Row OP_FORFEITS_RESERV = new Row { Key = 610, Name = "Начисление штрафов", Lvl = 2, Sign = -1 };
        public static Row OP_FORFEITS_PAYMENT = new Row { Key = 620, Name = "Оплата штрафов", Lvl = 2 };
        public static Row OP_FORFEITS_CHANGE = new Row { Key = 630, Name = "Изменение штрафов", Lvl = 2, Sign = -1 };


    }

}
