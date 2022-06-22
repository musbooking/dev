using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy-security;
using LinqToDB.Mapping;

namespace My.App.Sys
{
    [Table("access_rules")]
    public class AccessRule: DbObject
    {
        [Column("ip", Length = 15)]
        public string IP { get; set; }

        [Column("description", Length = 0)]
        public string Description { get; set; }

        [Column("isDisabled")]
        public bool IsDisabled { get; set; }

        public bool Allow(Microsoft.AspNetCore.Http.HttpContext context)
        {
            var ip = context.Request.Host.Host;
            ip = (ip + "").Replace(":",".");
            if (IP == ip) return true;
            return false;
        }
    }

}
