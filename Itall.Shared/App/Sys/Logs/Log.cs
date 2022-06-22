using LinqToDB.Mapping;
using System;

namespace My.App.Sys
{
    /// <summary>
    /// Класс для логгирования
    /// </summary>
    [Table("logs")]
    public partial class Log : DbObject
    {
        [Column("userId")]
        public Guid? UserId { get; set; }

        [Column("text", Length = 0)]
        public string Text { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }


    }
}



