using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itall.App.Data;
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace My.App
{
    partial class UpdateDbController<T>
    {

        protected override object OnUpdating(Updater<T> updater)
        {
            this.RequiresAuthentication();
            var user = this.CurUser();

            if (updater.IsNew && updater.Object.DomainId == null)
            {
                updater.Object.DomainId = user.DomainId;
            }

            return base.OnUpdating(updater);
        }


        protected override void OnDeleting(Guid id, DataConnection db)
        {
            this.RequiresAuthentication();
            base.OnDeleting(id, db);
        }

     
    }
}
