using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy-security;
using LinqToDB.Mapping;

namespace My.App.Sys
{
    /// <summary>
    /// Статус рассылки сообщений
    /// </summary>
    public enum MailingStatus
    {
        Unknown = 0,
        //Active = 1,
        //Canceled = 2,
        //Paused = 3,
        Ok = 10,
    }

    /// <summary>
    /// Описание рассылки сообщений
    /// </summary>
    [Table("mailings")]
    public class Mailing: ListItem
    {
        [Column("templateId")]
        public Guid? TemplateId { get; set; }
        [Association(ThisKey = "TemplateId", OtherKey = "Id")]
        public Template Template { get; set; }

        [Column("status")]
        [Itall.Index]
        public MailingStatus Status { get; set; }

        [Column("values", Length = 0)]
        public string Values { get; set; }

        [Column("fdate")]
        public DateTime? FromDate { get; set; }


    }

}
