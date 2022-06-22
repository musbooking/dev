using LinqToDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Sys
{
    /// <summary>
    /// Класс для хранения email сообщений
    /// </summary>
    public class MailJobRecord
    {
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }


}