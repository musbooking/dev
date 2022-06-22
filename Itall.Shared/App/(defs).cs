namespace My.App
{
    /// <summary>
    /// Интерфейс для поддержки архивных данных
    /// </summary>
    public partial interface IArchivable
    {
        bool IsArchive { get; }
    }

    /// <summary>
    /// Поддерживающий сортировку
    /// </summary>
    public partial interface IOrderable
    {
        int Index { get; }
    }

    /// <summary>
    /// Аргументы Controller для использования в гридах DevExpress, Quasar, ..
    /// </summary>
    public abstract class GridArgs
    {
        // for Bulma grid paginh
        //public int Page { get; set; }
        //public int PerPage { get; set; }
        // for DevExpress virtual
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public string Search { get; set; }
    }



        ///// <summary>
        ///// Хранение истории состояний
        ///// </summary>
        //public partial interface IStatus
        //{
        //    int? Status { get; }

        //    bool? IsSetStatus { get; }
        //}

    }
