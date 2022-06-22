using My.App.Sys;
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

        public ITable<User> Users => this.GetTable<User>();

        public ITable<Role> Roles => this.GetTable<Role>();

        public ITable<Permission> Permissions => this.GetTable<Permission>(); 

        public ITable<AccessRule> AccessRules => this.GetTable<AccessRule>(); 

        public ITable<Template> Templates => this.GetTable<Template>(); 

        public ITable<ConfigItem> Configs => this.GetTable<ConfigItem>();

        public ITable<JobEntity> Jobs => this.GetTable<JobEntity>();
        
        public ITable<Mailing> Mailings => this.GetTable<Mailing>();
    }





}
