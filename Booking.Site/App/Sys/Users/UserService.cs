using LinqToDB;
//using-Nancy-security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB.Data;
using My.App;
using Itall.App.Data;
using Itall.Services;
//using-Nancy;
using System.Threading;
using Itall;
using Microsoft.AspNetCore.Mvc;

namespace My.App.Sys
{
    public class UserService: DbService
    {

        /// <summary>
        /// Возвращает след. код приглашения, при необходимости подгружая их в память
        /// </summary>
        public string GetNextInviteCode(int n = 100)
        {
            lock (_InviteCodes)
            {
                if (_InviteCodes.Count == 0)
                {
                    var codes = Db.Users
                        .Where(u => u.InviteCode.Length > 3)
                        .Select(u => u.InviteCode)
                        .ToDictionary(u => u);

                    while (_InviteCodes.Count < n)
                    {
                        var code = new Random((int)DateTime.Now.Ticks).Next(10000, 99999).ToString();
                        if (codes.ContainsKey(code)) continue;
                        codes[code] = code;
                        _InviteCodes.Enqueue(code);
                    }
                }
            }
            var retcode = _InviteCodes.Dequeue();
            return retcode;
        }

        static Queue<string> _InviteCodes = new Queue<string>();
    }

}