using LinqToDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.App
{
    partial class DbConnection
    {
        //public DbConnection(LinqToDB.Configuration.LinqToDBConnectionOptions<DbConnection> options): 
        //    base(  (LinqToDB.Configuration.LinqToDBConnectionOptions<Itall.Models.DbConnection>)(object) options)
        //{

        //}


        //public ITable<Base> Bases => GetTable<Base>();

        //public ITable<Room> Rooms => GetTable<Room>();

        //public ITable<Group> Groups => GetTable<Group>();

        //public ITable<Equipment> Equipments => GetTable<Equipment>();

        //public ITable<Order> Orders => GetTable<Order>();

        //public ITable<Abonement> Abonements => GetTable<Abonement>();

        ////public ITable<Register> Registers => GetTable<Register>();

        //public ITable<Client> Clients => GetTable<Client>();

        //public ITable<ClientPart> ClientParts => GetTable<ClientPart>();

        //public ITable<Resource> Resources => GetTable<Resource>();

        //public ITable<Message> Messages => GetTable<Message>();

        //public ITable<Price> Prices => GetTable<Price>();

        //public ITable<Promotion> Promotions => GetTable<Promotion>();

        //public ITable<Day> Days => GetTable<Day>();

        //public ITable<Domain> Domains => GetTable<Domain>();

        //public ITable<Expense> Expenses => GetTable<Expense>();

        //public ITable<ExpenseItem> ExpenseItems => GetTable<ExpenseItem>();

        //public ITable<PayDoc> PayDocs => GetTable<PayDoc>();

        //public ITable<DiscountRule> DiscountRules => GetTable<DiscountRule>();

        //public ITable<Tarif> Tarifs => GetTable<Tarif>();

        //public ITable<PayChannel> PayChannels => GetTable<PayChannel>();


        //public string TestPhoneExists(Guid id, string phone)
        //{
        //    phone = SysUtils.FormatPhone(phone);

        //    var db = this;
        //    var res = db.Resources
        //        .Where(x => x.Id != id)
        //        .GetPhones(phone)
        //        .FirstOrDefault();

        //    if (res != null)
        //    {
        //        var client = db.Clients.FirstOrDefault(x => x.Id == res.ObjectId);
        //        var text = string.Format("Телефон уже присутствует в базе данных, карточка клиента:  {1} {0} {2}",
        //            client?.FirstName, client?.LastName, client?.SurName);
        //        return text;
        //    }
        //    return null;
        //}




    }

}
