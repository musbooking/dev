using LinqToDB.Mapping;
using System.ComponentModel;

namespace My.App
{
    public abstract partial class ListItem : DbObject, IArchivable
    {
        public ListItem()
        {
        }

        [DisplayName("Название")]
        [Column("name", Length = 150)] // , CanBeNull = false)] пока так..
        public string Name { get; set; }

        //[DisplayName("Описание")]
        [Column("description", Length = 0)]
        public string Description { get; set; }

        [DisplayName("Архив")]
        [Column("arch")]
        public bool IsArchive { get; set; }

        public override string ToString()
        {
            return Name;
        }

    }

}
