using LinqToDB;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App
{
    partial class DbObject
    { 
        [Column("domainId")]
        [Itall.Index]
        public Guid? DomainId { get; set; }
        [Association(ThisKey = "DomainId", OtherKey = "Id")]
        public virtual Partners.Domain Domain { get; set; }

        public const string
            GROUP_NAME = "group_name",
            BASE_NAME = "base_name";
    }

}
