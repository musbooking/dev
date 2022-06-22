using Itall;
using Itall.App.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My.App
{
    partial class ConfigsController
    {
        partial void OnUpdating2(Updater<ConfigItem> updater)
        {
            var cfg = updater.Object;
            
            // если изменили комнаты, или поле баз пустое, то перерасчитываем базы
            if ( updater.HasChange( "AsVal3") || cfg.AsVal2 == null)
            {
                var ids = cfg.AsVal3.ToGuids();
                var baseids = Db.Rooms
                    .Where(r => ids.Contains(r.Id))
                    .Select(r => r.BaseId)
                    .Distinct()
                    .ToList();
                var sval = string.Join(',', baseids);
                updater.Set(c => c.AsVal2, sval);

            }
        }


    }
}
