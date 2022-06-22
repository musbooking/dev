using Itall;
using LinqToDB.Mapping;
using System;

namespace My.App.Sys
{
    /// <summary>
    /// Тип задания
    /// </summary>
    public enum JobKind
    {
        Unknows = 0,
        Mail = 1,  // Отправка сообщений
        Tinkoff = 2,  // Оплаты Тинькова
    }

    /// <summary>
    /// Текущий статус выполнения задания
    /// </summary>
    public enum JobStatus
    {
        Unknown = 0,
        Active = 1,
        Pause = 2,
        Ok = 10,
        Error = 11,
        Canceled = 12,
    }


    /// <summary>
    /// Класс для хранения заданий и их результатов
    /// </summary>
    [Table("jobs")]
    public partial class JobEntity : DbObject
    {
        public JobEntity()
        {

        }

        /// <summary>
        /// Вид задания
        /// </summary>
        [Column("kind")]
        [Index]
        public JobKind Kind { get; set; }        
        
        /// <summary>
        /// Статус выполнения задания
        /// </summary>
        [Column("status")]
        [Index]
        public JobStatus Status { get; set; }

        /// <summary>
        /// Описание работы (для пользовательского контроля)
        /// </summary>
        [Column("description", Length = 0)]
        public string Description { get; set; }


        /// <summary>
        /// Содержимое задания, которое м.б. интерпретировано по-разному
        /// </summary>
        [Column("value", Length = 0)]
        public string Value { get; set; }

        /// <summary>
        /// Кол-во попыток успешного выполнения заданий
        /// </summary>
        [Column("attempts")]
        public int Attempts { get; set; }

        /// <summary>
        /// ИД объекта, ассоциированного с данным заданием (тип сущности не раскрывается)
        /// </summary>
        [Column("object_id")]
        public Guid? ObjectId { get; set; }

        /// <summary>
        /// Минимальная дата, после которой можно выполнить задание (для отложенных)
        /// </summary>
        [Column("min_date")]
        public DateTime? MinDate { get; set; }

        /// <summary>
        /// Дата создания
        /// </summary>
        [Column("cr_date")]
        public DateTime CreatedDate { get; set; }        
        
        /// <summary>
        /// Дата выполнения операции
        /// </summary>
        [Column("date")]
        public DateTime? Date { get; set; }

        /// <summary>
        /// Размер параметров
        /// </summary>
        [Column("size")]
        public int Size { get; set; }
    }
}



