using Itall;
using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App.Fin
{
    //[Table("days")]
    public class Document: DbObject, IArchivable
    {
        /// <summary>
        /// архивный документ
        /// </summary>
        [Column("isArchive")]
        [Index]
        [DisplayName("Архив")]
        public bool IsArchive { get; set; }
    }

}
