using My.App.CRM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Orders
{

    /// <summary>
    /// Результат обсчета заказа
    /// </summary>
    public class CalcResult
    {
        public CalcResult()
        {

        }

        public CalcArgs Args;

        public string Text { get; set; }
        public string Errors { get; set; }

        public int RoomPrice { get; set; }
        public int EquipmentPrice { get; set; }
        public int TotalPrice { get; set; }

        public bool IsFixHours { get; set; } // true, если часы были изменены промоакцией
        public int Hour1 { get; set; }
        public int Hour2 { get; set; }
        public App.HoursSpan[] Hours { get; set; }

        /// <summary>
        /// Ссылка на горящую репетицию, если была учтена при начислении скидок
        /// </summary>
        //public Promotion HotPromo;
        public int HotDiscount { get; set; }
        public bool IsAction { get; set; } // Есть ли горящая репетиция

        public int RoomClientDiscount { get; set; }

        /// <summary>
        /// Сумма за комнату
        /// </summary>
        public int RoomSum { get; internal set; }

        /// <summary>
        /// Округленная сумма до 5 руб
        /// </summary>
        public int RoomSumR { get; internal set; }

        /// <summary>
        /// Итоговая сумма вместе со штрафом
        /// </summary>
        public int TotalSum { get; set; }

        // Сумма по брони без учета штрафа
        public int TotalOrder { get; set; }

        public int PointsSum; // оплпта баллами

        public bool PayForfeit { get; set; }

        /// <summary>
        /// Сумма штрафа по брони
        /// </summary>
        public int Forfeit { get; set; }

        ///// <summary>
        ///// Сумма начисленных штрафов за текущую репетицию
        ///// </summary>
        //public int ForfeitSum { get; set; }

        /// <summary>
        /// Была ли блокировка пересчета
        /// </summary>
        public bool IsHold { get; internal set; }


        public bool IsOk() => string.IsNullOrWhiteSpace(Errors);
    }

}
