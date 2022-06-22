using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqToDB;

namespace My.App.CRM
{
    public class ClientService : DbService
    {
        /// <summary>
        /// Получение инфы о банах и штрафах
        /// </summary>
        public async Task<(int, int)> GetClientProblems(Guid? clientid)
        {
            if (clientid == null)
                return (0, 0);

            var qparts = Db.ClientParts
                .Where(cp => cp.ClientId == clientid);

            var bans = await qparts
                .CountAsync(cp => cp.IsBanned);

            var forfeits = await qparts
                .SumAsync(cp => cp.Forfeit);
            //var forfeits = await Db.ForfeitAsync(null, clientid);

            return (bans, forfeits);
        }


        /// <summary>
        /// Параметры для изменения параметров партнерской части клиента
        /// </summary>
        public class ChangeArgs
        {
            public Guid? Client { get; set; }
            public int? Discount { get; set; }
            public bool? IsBanned { get; set; }
            public int? Forfeit { get; set; }
            internal int? OldForfeit;
            public ClientPayKind? PayKind { get; set; }
            public ClientPart Part = null;
        }

        /// <summary>
        /// Изменение клиентской информации по партнеру
        /// </summary>
        public async Task<int> ChangeAsync(ChangeArgs args)
        {
            var clientid = args.Client ?? User?.ClientId;
            var part = args.Part ?? Db.GetOrCreateClientPart(clientid, User.DomainId, 21);
            args.OldForfeit = part.Forfeit;

            Db.BeginTransaction1();

            var part_res = await Db.Finds(part)
                .Set(p => p.Updated, DateTime.Now)
                .SetIf(args.Discount, p => p.Discount)
                .SetIf(args.IsBanned, p => p.IsBanned)
                .SetIf(args.PayKind, p => p.PayKind)
                // ---считается автоматом на основе проводокк
                // пока вернул https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/44679/ 
                .SetIf(args.Forfeit, p => p.Forfeit)
                .UpdateAsync();


            // находим разницу в балансе и формируем транзакцию
            if (args.Forfeit != null)
            {
                part.Forfeit = args.Forfeit.Value; 
                await OnChangeForfeit(args, part);
            }

            if (args.IsBanned != null)
            {
                part.IsBanned = args.IsBanned.Value;
                await OnChangeBanAsync(part);
            }

            Db.CommitTransaction1();

            return part_res;  // для доп. проверок, и чтобы вернуть результат
        }

        /// <summary>
        /// Обработка изменения штрафа по клиенту
        /// </summary>
        private async Task OnChangeForfeit(ChangeArgs args, ClientPart part)
        {
            //var qtClient = Db.Transactions.Where(t => t.ClientId == args.Client);
            //var old_forfeit = -await qtClient.BalanceAsync(Fin.Groups.REG_FORFEITS);
            // Вместо проводок считаем на основе Part.Forfeit
           

            await checkLoadPart(part);

            var svc = new Fin.TransService { Db = Db, User = User, };
            var text = $"Штраф клиента {part.Client} стал {part.Forfeit} руб.";
            var delta = args.OldForfeit - args.Forfeit;

            await svc.OnChangeForfeitAsync(part, delta ?? 0, text);

            // отправляем уведомление
            var maildata = new
            {
                Client = part.Client,
                Part = part,
                Domain = part.Domain,
                Text = text,
            };
            App.AddDbMailJob(part.Client?.Email, maildata, Db, part.Id, Sys.TemplateKind.ClientForfeit);


            // отправка сообщения об изменении штрафа в карточке
            var msg = new Common.Message
            {
                ClientId = part.ClientId,
                Date = DateTime.Now,
                DomainId = part.DomainId,
                Kind = Common.MessageKind.System,
                Scope = ScopeType.Zone,
                SenderId = User?.Id,
                Text = $"Изменен штраф клиента с {args.OldForfeit} на {args.Forfeit}",
            };
            var n = await Db.CreateInsertAsync(msg);

        }



        /// <summary>
        /// Обработка изменения признака бана у клиента
        /// </summary>
        public async Task<int> OnChangeBanAsync(ClientPart part, string text = null)
        {
            await checkLoadPart(part);
            text = text ?? (part.IsBanned ? "Блокировка клиента" : "Разблокировка клиента");

            // отправка сообщения о бане
            var msg = new Common.Message
            {
                ClientId = part.ClientId,
                Date = DateTime.Now,
                DomainId = part.DomainId,
                Kind = Common.MessageKind.System,
                Scope = ScopeType.Zone,
                SenderId = User?.Id,
                Text = text,
            };
            var n = await Db.CreateInsertAsync(msg);

            // Если клиент забанен, то отмненяем будущие бронирования по клиенту
            if (part.IsBanned)
            {
                await Orders.OrderHelper.CancelFutureOrdersAsync(Db.Orders, part.ClientId, part.DomainId);
            }

            // отправляем уведомление
            var maildata = new
            {
                Client = part.Client,
                Part = part,
                Domain = part.Domain,
                Text = text,
            };
            var template = part.IsBanned ? Sys.TemplateKind.ClientBanTrue : Sys.TemplateKind.ClientBanFalse;
            App.AddDbMailJob(part.Client.Email, maildata, Db, part.Id, template);

            return n; // для Task.result
        }

        /// <summary>
        /// Подзагрузка частей данных ClientPart
        /// </summary>
        async Task checkLoadPart(ClientPart part)
        {
            part.Client ??= await Db.Clients.FindAsync(part.ClientId);
            part.Domain ??= await Db.Domains.FindAsync(part.DomainId);
        }


    }


}
