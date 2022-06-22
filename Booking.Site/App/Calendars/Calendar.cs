using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB.Data;

namespace My.App.Calendars
{

    /// <summary>
    /// Настройки календаря
    /// </summary>
    [Table("calendars")]
    public class Calendar: DbObject, IArchivable
    {

        [Column("type")]
        public string Provider { get; set; }

        [Column("name", Length = 200)]
        public string Name { get; set; }

        [Column("description", Length = 0)]
        public string Description { get; set; }

        [Column("isArchive")]
        public bool IsArchive { get; set; }

        [Column("minDate")]
        public DateTime? MinDate { get; set; }

        [Column("calendars", Length = 0)]
        public string JsonContent { get; set; }

        [Column("refreshToken", Length = 0)]
        public string RefreshToken { get; set; }

        [Column("timeZone", Length = 10)]
        public string TimeZone { get; set; }

        [Column("roomId")]
        public Guid? RoomId { get; set; }
        [Association(ThisKey = "RoomId", OtherKey = "Id")]
        public Orders.Room Room;

        /// <summary>
        /// Число оставшихся попыток заставить календарь работать
        /// </summary>
        [Column("attempts")]
        public int Attempts { get; set; }        
        
        /// <summary>
        /// Кол-во обновлений от внешнего календаря
        /// </summary>
        [Column("updates")]
        public int Updates { get; set; }

        /// <summary>
        /// Признак подписки на события
        /// </summary>
        [Column("watch")]
        public WatchStatus WatchStatus { get; set; }
     
        [Column("watch_res", Length = 0)]
        public string WatchResult { get; set; }


        public override void OnCreating(DataConnection db)
        {
            base.OnCreating(db);

            /// при добавлении начинаем синхронизацию с текущего момента - https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/36193/
            // MinDate = DateTime.Now;  - убрано согласно 54949
        }




        /// <summary>
        /// Дата начала синхронизации календаря
        /// </summary>
        public DateTime GetStartDate(double days = 20, bool useMindate = true)
        {
            // Считаем минимальную дату. У Гугла особенность - она не должна превышать 20 дней
            // .AddDays(-1); делаем четкую отсечку - https://hendrix.bitrix24.ru/company/personal/user/140/tasks/task/view/36193/
            var startDate = DateTime.Now.AddDays(-days);  // вернул согласно https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/44497/
            if (useMindate && MinDate != null && MinDate > startDate)  // корректируем стартовую дату
                startDate = MinDate.Value;
            //var startDate = DateTime.Now.AddDays(-20);  // календари синхр полностью  https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/36193/
            return startDate;
        }

        public string GetAccessToken()
        {
            if (this.Provider == null || this.RefreshToken == null)
                throw new ArgumentNullException("Provider or Refresh token is null");

            var token = Itall.App.Auth.OAuth2Utils.GetAccessToken(this.Provider, this.RefreshToken);
            return token;
        }

    }

}


#region --- Misc ----

//[Column("")]
//public Guid? TokenId { get; set; }
//[Association(ThisKey = "TokenId", OtherKey = "Id")]
//public Token Token;


//[Column("", Length = 0)]
//public string RefreshToken { get; set; }

//[Column("")]
//public DateTime LastDate { get; set; }

//[Column("")]
//public string UserKey { get; set; }

//[Column("")]
//public Guid? UserId { get; set; }
//[Association(ThisKey = "UserId", OtherKey = "Id")]
//public virtual User User { get; set; }

//public override void OnCreating(DataConnection db)
//{
//    base.OnCreating(db);
//    this.LastDate = DateTime.Now;
//}
#endregion
