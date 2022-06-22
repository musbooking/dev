using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.CRM
{
    /// <summary>
    /// Избранное пользователя
    /// </summary>
    [Table("favorites")]
    public class Favorite : DbObject, IArchivable
    {
        [Column("date_add")]
        public DateTime DateAdded { get; set; }

        [Column("date_rem")]
        public DateTime? DateRemoved { get; set; }

        [Column("arch")]
        public bool IsArchive { get; set; }


        /// <summary>
        /// Пользователь, добавивший избранное
        /// </summary>
        [Association(ThisKey = "OwnerId", OtherKey = "Id")]
        public virtual Sys.User Owner { get; set; }
        [Column("ownerId")]
        public Guid? OwnerId { get; set; }

        /// <summary>
        /// Комната, которая была добавлена в избранное
        /// </summary>
        [Association(ThisKey = "RoomId", OtherKey = "Id")]
        public virtual Orders.Room Room { get; set; }
        [Column("roomId")]
        public Guid? RoomId { get; set; }
    }


}
