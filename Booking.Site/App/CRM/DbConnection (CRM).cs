using LinqToDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using My.App.CRM;

namespace My.App
{
    partial class DbConnection
    {

        public ITable<Group> Groups => this.GetTable<Group>();

        public ITable<Client> Clients => this.GetTable<Client>();

        public ITable<ClientPart> ClientParts => this.GetTable<ClientPart>();

        public ITable<Promotion> Promotions => this.GetTable<Promotion>();

        // public ITable<Point> Points => this.GetTable<Point>();

        public ITable<Favorite> Favorites => this.GetTable<Favorite>();

        public ITable<Review> Reviews => this.GetTable<Review>();

    }

}
