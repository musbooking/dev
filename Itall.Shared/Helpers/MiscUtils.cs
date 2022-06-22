using Itall;
using Microsoft.AspNetCore.Mvc;
using My.App.Sys;
using System;
using System.Linq;

namespace My
{
    /// <summary>
    /// Утилита для разных преобразований
    /// </summary>
    public static class MiscUtils
    {

        /// <summary>
        /// очищает номер тел от спец.символов и префикса +7
        /// </summary>
        public static string FormatPhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return "";
            //phone = ClearPhone(phone);
            phone = phone.Trim().Replace("(", "").Replace(")", "").Replace(" ", "").Replace("-", "").Replace(",", "");

            //if (phone.Length < 8)
            //    phone = "+7495" + phone;

            if (phone.StartsWith("7") || phone.StartsWith("8"))
                phone = "+" + phone;

            //if (!"+78".Contains(phone[0]))
            //    phone = "+7" + phone;

            //if (!phone.StartsWith("+"))
            //{
            //    phone = "+" + phone;
            //}
            phone = phone.Replace("+8", "").Replace("+7", ""); // избавляемся от префикса +7
            phone = phone.MaxSize(10);
            return phone;
        }


        /// <summary>
        /// Hide part phone
        /// </summary>
        public static string HidePhoneChars(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return "";
            var res = PHONES.Replace(phone, "*");
            return res;
        }

        static System.Text.RegularExpressions.Regex PHONES = new System.Text.RegularExpressions.Regex("[019]");

        /// <summary>
        /// превращает некоторые символы в *
        /// </summary>
        public static string HideMailChars(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return "";
            var res = MAILS.Replace(email, "$1***@***$2");
            return res;
        }

        static System.Text.RegularExpressions.Regex MAILS = new System.Text.RegularExpressions.Regex("([^@]{2})[^@]*@[^.]*([^.]{3}.*)");


    }
}


