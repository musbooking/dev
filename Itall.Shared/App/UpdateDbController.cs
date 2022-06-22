using Itall;
using Itall.App.Data;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace My.App
{
    public abstract partial class UpdateDbController<T> : BaseUpdateDbController<T> where T : DbObject
    {
        // чтобы можно перекрывать override методы
    }


    public abstract partial class BaseUpdateDbController<T> : DbController where T : DbObject
    {

        [HttpPost("save/{id?}")]
        [HttpPut("save/{id?}")]
        //[Route("save/{id?}")]
        public IActionResult Save(Guid? id)
        {
            var res = update(id);
            return Json(res);
        }


        dynamic update(Guid? id)
        {
            //Db.BeginTransaction1();

            var updater = new Updater<T>(Db);

            updater.Params = Request.Form;
            updater.Begin(id);

            var res = OnUpdating(updater);
            if (!updater.Cancel)
            {
                updater.Commit();
                OnUpdated(updater);
                OnChanged(updater.Object.Id, Db);
            }

            //Db.CommitTransaction1();
            return res;
        }

        static object SQL_Delete_Operation = new { };

        [HttpDelete("save/{id}")]
        [HttpPost("del/{id}")]
        public IActionResult Delete(Guid id)
        {
            lock (SQL_Delete_Operation) // to avoid sql deadlock
            {
                Db.BeginTransaction1();
                var obj = Activator.CreateInstance<T>();
                obj.Id = id;

                obj.OnDelete(Db);
                OnDeleting(id, Db);

                Db.GetTable<T>()
                    .Where(x => x.Id == id)
                    .Delete();

                OnDeleted(id, Db);
                OnChanged(id, Db);

                Db.CommitTransaction1();
                return Ok();
            }
        }

        protected virtual object OnUpdating(Updater<T> updater)
        {

            var obj = updater.Object;
            return new
            {
                obj.Id,
                _LastUpdated = obj.Updated == null ? "" : obj.Updated.Value.ToJsString(),
            };
        }


        protected virtual void OnUpdated(Updater<T> updater)
        {
        }

        protected virtual void OnDeleting(Guid id, LinqToDB.Data.DataConnection db)
        {
        }

        protected virtual void OnDeleted(Guid id, LinqToDB.Data.DataConnection db)
        {
        }

        /// <summary>
        /// Метод, вызываемый после изменения объекта
        /// </summary>
        protected virtual void OnChanged(Guid id, LinqToDB.Data.DataConnection db)
        {
        }
    }
}
