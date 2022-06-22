using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Partners
{
    [Table("discounts")]  
    public class DiscountRule : DbObject, IArchivable
    {
        [Column("isArchive")]
        public bool IsArchive { get; set; }

        [Column("orders")]
        public int Orders { get; set; }

        [Column("discount")]
        public int Discount { get; set; }


        public override string ToString()
        {
            return $"Скидка {Discount}% за {Orders} заказа(ов)";
        }


    }


}
