using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My.App
{
    /// <summary>
    /// Интервалs a-b,c-d,...
    /// </summary>
    public class HoursSpan
    {
        public int From { get; set; } = 0;
        public int To { get; set; } = 24;

        /// <summary>
        /// Был ли пропуск часа
        /// </summary>
        public bool IsSingle = false;

        public override string ToString()
        {
            return "" + From + " - " + To;
        }

        /// <summary>
        /// Определяем, содержится ли интервал h1..h2 внутри списка разрешенных часов
        /// </summary>
        //public static bool Contains(IEnumerable<HoursSpan> hours, double h1, double h2, bool )
        //{
        //    var h = hours.Any(dh => dh.From <= h1 && h2 <= dh.To);
        //    return h;
        //}

        public static IEnumerable<HoursSpan> Parse(string hours)
        {
            if (string.IsNullOrWhiteSpace(hours))
            {
                //yield return new HoursSpan();
                yield break;
            }

            // разбиваем по парам pair1,pair2,...
            var hs = hours.Split(',', ' ');
            HoursSpan lastHourSpan = null;

            for (var i = 0; i < hs.Length; i++)
            {
                var h = hs[i];
                if (string.IsNullOrWhiteSpace(h)) continue;

                // разбиваем по часам h1-h2 -> hh: [h1,h2]
                var hh = h.Split('-').Select(x => parse("0" + x.Trim())).ToArray();
                var h0 = hh[0];
                var dh = new HoursSpan { IsSingle = hh.Length < 2 };

                if (dh.IsSingle)
                {
                    // если одна цифра, то h .. h+1 часов
                    dh.From = h0;
                    dh.To = h0 + 1;
                }
                else
                {
                    // если первый час пропущен (0), то берем окончание предыдущего периода
                    dh.From = (h0 == 0 && i > 1) ? dh.From = lastHourSpan.To : h0;
                    dh.To = hh[1];
                }
                lastHourSpan = dh;
                yield return dh;
            }
        }

        static int parse(string sn)
        {
            var r = Int32.TryParse(sn, out int i);// для отладки используем результат
            return i;
        }
    }
}
