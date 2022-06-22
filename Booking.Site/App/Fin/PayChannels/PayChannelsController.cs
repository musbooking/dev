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

namespace My.App.Fin
{
    public class PayChannelsController : ListController<PayChannel>
    {
        protected override object OnUpdating(Updater<PayChannel> updater)
        {
            //base.OnUpdating(updater);

            //updater.Set(x => x.AllowBaseIds);
            //updater.Set(x => x.IsPrepay);
            //updater.Set(x => x.IsRequest);
            updater.Set(x => x.PrepayUrl);
            updater.Set(x => x.Forfeit1);
            updater.Set(x => x.Forfeit2);
            updater.Set(x => x.Total1);
            updater.Set(x => x.Total2);
            updater.Set(x => x.Kind); 
            updater.Set(x => x.PartPc);
            updater.Set(x => x.Sources);
            updater.Set(x => x.IsForfeits);

            return base.OnUpdating(updater);
        }

        protected override void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
            base.OnChanged(id, db);
            DbCache.PayChannels.Reset();
        }



        [HttpGet("list")]
        public IActionResult GetListAsync()
        {
            this.RequiresAuthentication();

            var query = DbCache.PayChannels.Get().AsQueryable()
                .GetDomainObjects(this.CurUser()?.DomainId)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.IsArchive,
                    //x.IsPrepay,
                    //x.IsRequest,
                    x.Kind,
                    x.Sources,
                    x.PrepayUrl,
                    x.Forfeit1,
                    x.Forfeit2,
                    x.Total1,
                    x.Total2,
                    x.PartPc,
                    x.IsForfeits,
                    //x.AllowBaseIds,
                });
            var res = query.ToList();
            return Json(res);
        }

        /// <summary>
        /// Параметры для получения доступного списка каналов брони
        /// </summary>
        public class AllowArgs
        {
            public Guid? Base { get; set; }
            public Guid? Room { get; set; }
            public Guid? Client { get; set; }
            public int Total { get; set; }
            public Orders.SourceType? Source { get; set; }
            public int TestForfeit { get; set; }  // для тестирования штрафа
            public System.Collections.IList TestChannels { get; set; }  // для тестирования результата
        }

        /// <summary>
        /// Получение доступного списка каналов брони
        /// </summary>
        [HttpGet("allows")]
        public async Task<IActionResult> AllowsAsync(AllowArgs args) //Guid @base, Guid? client, int total)
        {
            if (args.Total == 0) return Ok();  // https://hendrix.bitrix24.ru/company/personal/user/180/tasks/task/view/38345/

            this.RequiresAuthentication();
            var user = this.CurUser();

            var clientid = args.Client ?? user.ClientId;
            
            var channel = args.Base != null
                ?await Db.Bases.Finds(args.Base)
                    .Select(b => new { b.ChannelIds, b.DomainId })
                    .FirstOrDefaultAsync()
                :await Db.Rooms.Finds(args.Room)
                    .Select(r => new { ChannelIds = r.ChannelIds ?? r.Base.ChannelIds, r.DomainId })  // организуем наследование Channels
                    .FirstOrDefaultAsync();

            if (channel == null)
            {
                //throw new UserException("Не найдены параметры комнаты или базы для формирования списка каналов");
                var empty_res = new object[0];
                return Json(empty_res);
            }

            var part = Db.GetOrCreateClientPart(clientid, channel.DomainId, 24);

            // рассчитываем штраф клиента
            var forfeit = part.Forfeit + args.TestForfeit;
            //var forfeit = await Db.ForfeitAsync(baseobj.DomainId, clientid);

            if (part.PayKind == CRM.ClientPayKind.Trust)
                forfeit = 0; // если доверяем, то обнуляем штраф
            else if (part.PayKind == CRM.ClientPayKind.Doubt)
                forfeit = forfeit == 0? 1000 :forfeit; // если доверяем, то обнуляем штраф

            // формируем список каналов оплат по базе
            //var chids = baseobj?.ChannelIds.ToGuids();
            //var chpays = List.Get().Where(ch => chids.Contains(ch.Id));
            var chpays = string.IsNullOrWhiteSpace(channel?.ChannelIds) 
                ? Enum2.GetEmpty<PayChannel>()
                : DbCache.GetChannels(channel?.ChannelIds );

            // если есть источник - смотрит только те каналы, которые содержат источник
            if (args.Source.HasValue)
            {
                var isrc = (int)args.Source.Value;
                chpays = chpays.Where(ch => ch.Sources == null || ch.Sources.ToInts().Contains(isrc));
            }

            // если по карте- то всегда выбираем Тинькова https://hendrix.bitrix24.ru/workgroups/group/6/tasks/task/view/33029/
            if (part.PayKind == CRM.ClientPayKind.Card)
            {
                var res2 = chpays
                    .Where(ch => ch.Kind == PayChannelKind.Online)
                    .ToList();
                return Json(res2);
            }

            var query = 
                from ch in chpays
                    /*  https://docs.google.com/document/d/1QbM4V3AhcEbFNato_WoTrPCTWM5-RZrOMOUpTu6gk2k/edit
                     * Итоговые положения:
    - Два нуля отключают любые проверки по диапазону
    - Проверка происходит по 2 диапазонам. Если хотя-бы по одному из них проверка не пройдена, способ оплаты не отдается в ответе. Правило “И”.
                     */
                where
                    (ch.Forfeit1 + ch.Forfeit2 == 0 || ch.Forfeit1 <= forfeit && forfeit <= ch.Forfeit2)
                where 
                    (ch.Total1 + ch.Total2 == 0 || ch.Total1 <= args.Total && args.Total <= ch.Total2)   // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/33497/

                //where 
                //    (ch.Forfeit2 >0 && ch.Forfeit1 <= forfeit && forfeit <= ch.Forfeit2) ||
                //    // (ch.Total2 > 0 && ch.Total1 <= args.Total && args.Total <= ch.Total2)
                //    ( ch.Total1 <= args.Total && (ch.Total2 == 0 || args.Total <= ch.Total2) )  // https://hendrix.bitrix24.ru/company/personal/user/112/tasks/task/view/33497/
                select new
                {
                    ch.Id,
                    ch.Kind,
                    ch.Name,
                    ch.Description,
                    ch.IsArchive,
                    ch.PrepayUrl,
                    ch.PartPc,
                };
            var res = query.ToList();
            args.TestChannels = res;
            return Json(res);
        }


        [HttpGet("names")]
        public IActionResult GetNames()
        {
            this.RequiresAuthentication();

            var query = DbCache.PayChannels.Get().AsQueryable()
                .GetDomainObjects(this.CurUser()?.DomainId)
                .Select(x => new
                {
                    x.Id,
                    Value = x.Name,
                });
            var res = query.ToList();
            return Json(res);
        }

    }


}
