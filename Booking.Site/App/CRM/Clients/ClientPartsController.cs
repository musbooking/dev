using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Itall;
using Microsoft.AspNetCore.Mvc;
using My.App.Fin;
using My.App.Orders;

namespace My.App.CRM
{
    //[Route("clientparts")]
    public class ClientPartsController : UpdateDbController<ClientPart>
    {

        //public ClientPartsModule() : base("/")
        //{

        //    RegUpdateRoutes();
        //}

        protected override object OnUpdating(Updater<ClientPart> updater)
        {
            base.OnUpdating(updater);

            var obj = updater.Object;
            var user = this.CurUser();

            updater.Set(x => x.Discount);

            var args = new ClientService.ChangeArgs 
            {
                Client = obj.ClientId,
                //IsBanned = updater.GetParam<bool?>("isBanned", obj.IsBanned), 
                //Forfeit = updater.GetParam<int?>("forfeit", obj.Forfeit), 
                Part = updater.Object,
            };

            var forfeit = updater.GetParam<int>("forfeit", obj.Forfeit);
            var banned = updater.GetParam<bool>("isBanned", obj.IsBanned);
            //var df = -obj.Forfeit + updater.GetParam<int>("forfeit", obj.Forfeit) ; // порядок важен, иначе Set забивает
            if (forfeit != obj.Forfeit)
            {
                args.Forfeit = forfeit;
                //updater.Set(x => x.Forfeit);
                ////    var tsvc = new TransService { Db = Db, CurrentUser = user };
                ////    var rr = tsvc.OnChangeForfeitAsync(obj, df).Result;
            }

            //if (obj.IsBanned != updater.GetParam<bool>("IsBanned", obj.IsBanned))
            if(banned != obj.IsBanned)
            {
                args.IsBanned = banned;
                //updater.Set(x => x.IsBanned);
                ////    var svc = new ClientService { Db = Db, CurrentUser = user };
                ////    var rr = svc.ChangeBanAsync(obj).Result;
            }

            if (args.IsBanned != null || args.Forfeit != null)  // если задано хотя бы одно значение - пропускаем через сервис обновлений
            {
                var svc = new ClientService { Db = (DbConnection)updater.Db, User = user };
                var r = svc.ChangeAsync(args).Result;
            }

            //updater.Set(x => x.PromoCode);
            //updater.Set(x => x.AssignedName);
            //updater.Set(x => x.EditorName);
            //updater.Set(x => x.HasWarnings);
            //updater.Set(x => x.CardNum);

            updater.Set(x => x.PayKind);

            //var clid = updater.Object.ClientId; --- не имеет смысла, тк клиент итак изменен при сохранении
            //if( clid != null)
            //{
            //    updater.Db.GetTable<Client>()
            //        .Where(x => x.Id == clid)
            //        .Set(x => x.InSync, true)
            //        .Update();
            //}

            return base.OnUpdating(updater);
        }

        protected override void OnUpdated(Updater<ClientPart> updater)
        {
            base.OnUpdated(updater);

            var changes = SysUtils.GetChangesText(updater);
            if (string.IsNullOrWhiteSpace(changes)) return;

            var text = "Изменения параметров клиента: ";
            var msg = new Common.Message
            {
                ClientId = updater.Object.ClientId,
                Date = DateTime.Now,
                DomainId = this.CurUser()?.DomainId,
                Kind = Common.MessageKind.System,
                SenderId = this.CurUser().Id,
                Text = text + changes,
                Scope = My.App.ScopeType.Zone,
            };
            updater.Db.CreateInsert(msg);
        }


        /// <summary>
        /// изменение параметров клиента для партнера
        /// </summary>
        [HttpPost("change")]
        public async Task<IActionResult> ChangeAsync(ClientService.ChangeArgs args ) //Guid client, int? discount = null, bool? isBanned = null, int? forfeit = null)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            var svc = new ClientService {  Db = Db, User = user };
            await svc.ChangeAsync(args);

            return Ok();
        }

       
    }


}
