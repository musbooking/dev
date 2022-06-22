using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using System.Threading;
using My.App;
using Itall;
using Itall.App.Data;
using Itall.App;
using Itall.App.Auth;

namespace My.App.Calendars
{
    /// <summary>
    /// Сервис для авторизации с календарем по OAuth2
    /// </summary>
    public class CalendarAuthorizer : IOAuth2Request
    {

        async Task<AuthResult> IOAuth2Request.AuthoriseAsync(OAuthRequest request)
        {

            var id = string.IsNullOrWhiteSpace(request.Id) ?(Guid?)null :Guid.Parse(request.Id);

            using var db = new DbConnection();
            
            var calendar = await db.Calendars
                .FirstAsync(x => x.Id == id);


            var provider = CalendarProvider.GetProvider(calendar.Provider);

            if (provider == null)
                throw new KeyNotFoundException("Calendar service not found");

            calendar.Updated = DateTime.Now;
            //calendar.UserKey = request.UserKey;
            //calendar.TokenId = (request.Object as DbObject).Id;
            calendar.RefreshToken = request.RefreshToken;
            calendar.JsonContent = await provider.GetContent(calendar);

            db.Update(calendar);

            return null;
        }

    }


}



#region ---- Misc ---


//var svc = WebApp.Current.Services
//    .Get<CalendarService>()
//    .Where(x => x.Allow(calendar))
//    .FirstOrDefault();

//if (calendar == null) // еще не создавали
//{
//    calendar = new Calendar
//    {
//        RoomId = id,
//        Provider = request.ProviderName,
//        Name = "primary",
//        //MinDate = DateTime.Now.AddDays(-20),
//    };
//    db.CreateInsert(calendar);
//}
#endregion