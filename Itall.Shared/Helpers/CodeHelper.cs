using Itall;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My
{
    /// <summary>
    /// Утилита для проверки кодов пользователя
    /// </summary>
    public static class CodeHelper
    {
        public static void AddCode(string id, int code)
        {
            _Codes[id] = code;
        }

        public static bool TestCode(string id, string code)
        {
            if (!Int32.TryParse(code, out var icode))
                return false;
            return TestCode(id, icode);
        }


        public static bool TestCode(string id, int code)
        {
            // проверяем смс код телефона
            //var testPhone = MiscUtils.FormatPhone(id);
            var phoneCode = _Codes.GetValueOrDefault2(id, -1111111);
            return code == phoneCode;
        }

        static Dictionary<string, int> _Codes = new Dictionary<string, int>();
    }

    public class CodeServiceResult
    {
        public int Code;
        public bool Ok;
        public string Result;
    }
}