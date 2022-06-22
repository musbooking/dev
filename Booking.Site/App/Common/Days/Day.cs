using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Common
{
    [Table("days")]
    public class Day: DbObject
    {
        [Column("date")]
        public DateTime Date { get; set; }

        [Column("isWeekend")]
        public bool IsWeekend { get; set; }

        [Column("description", Length = 0)]
        public string Description { get; set; }

    }

}
