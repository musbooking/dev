//using-Nancy-security;
using LinqToDB.Mapping;

namespace My.App.Sys
{

    [Table("permissions")]
    public partial class Permission : DbObject //, IPermission
    {
        public Permission()
        {

        }


        [Column("operation", Length = 50)]
        public string Operation { get; set; }

        [Column("roles", Length = 0)]
        public string Roles { get; set; }

        //[Column("", Length = 0)]
        //public string Description { get; set; }

        //public bool Allow { get; set; }


    }


}

