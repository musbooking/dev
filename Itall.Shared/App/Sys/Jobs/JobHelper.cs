using LinqToDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace My.App.Sys
{
    /// <summary>
    /// Хелпер для работы со Jobs
    /// </summary>
    public class JobHelper
    {
        /// <summary>
        /// Создание нового задания
        /// </summary>
        public static JobEntity CreateJob<T>( T obj, JobKind kind, Guid? object_id = null )
        {
            var val = Itall.JsonUtils.ObjectToJson(obj);

            var job = new JobEntity
            {
                CreatedDate = DateTime.Now,
                Kind = kind,
                Status = JobStatus.Active,
                ObjectId = object_id,
                Value = val,
                Size = val.Length,
            };
            return job;
        }

      
    }


}