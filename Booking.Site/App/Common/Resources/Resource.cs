using Itall;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Common
{
    /// <summary>
    /// РЕсурс как ссылка - м.б. привязан к разным сущностям системы - комнате, базе, и тп...
    /// </summary>
    [Table("resources")]
    public class Resource : DbObject
    {
        [Column("name", Length = 150)]
        public string Name { get; set; }

        [Column("description", Length = 0)]
        public string Description { get; set; }

        [Column("value", Length = 0)]
        public string Value { get; set; }

        [Column("isArchive")]
        public bool IsArchive { get; set; }

        [Column("kind")]
        [Index]
        public ResourceKind Kind { get; set; }

        [Column("objectId")]
        [Index]
        public Guid ObjectId { get; set; }

        [Column("sort")]
        public int Sort { get; set; }

        //public int BaseId { get; set; }
        //public virtual Base Base { get; set; }

        //public int RoomId { get; set; }
        //public virtual Room Room { get; set; }

        //public int EquipmentId { get; set; }
        //public virtual Equipment Equipment { get; set; }

        //public int UserId { get; set; }
        //public virtual User User { get; set; }
    }


    public enum ResourceKind
    {
        RoomPhoto = 3,
        RoomUrl = 4,
        //RoomPhotoSmall = 4,
        BaseCamera = 7,
        ClientPhone = 8,
    }
}


#region --- Misc ---

//[Column("")]
//[Index]
//public ResourceType Type { get; set; }

//public enum ResourceType
//{
//    Base = 1,
//    Equipment = 2,
//    Room = 3,
//    User = 4,
//    Client = 5,
//}
//Text = 1,
//Web = 2,
//Video = 4,
//Email = 5,
//Tel = 6,
#endregion
