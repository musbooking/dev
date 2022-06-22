using LinqToDB.Mapping;

namespace My.App.Sys
{
    [Table("templates")]
    public class Template : ListItem
    {
        public Template()
        {
        }

        [Column("key", Length = 50)]
        public string Key { get; set; }

        /// <summary>
        /// Задапется явно почтовый адрес (опционально)
        /// </summary>
        [Column("email", Length = 100)]
        public string Email { get; set; }

        /// <summary>
        /// СМС нотификация
        /// </summary>
        [Column("sms", Length = 0)]
        public string Sms { get; set; }

        /// <summary>
        /// Заголовок почтового сообщения
        /// </summary>
        [Column("subject", Length = 0)]
        public string Subject { get; set; }

        /// <summary>
        /// Основной шаблон почтового сообщения
        /// </summary>
        [Column("text", Length = 0)]
        public string Text { get; set; }

    }

}
