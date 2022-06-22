using LinqToDB.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;

namespace My.App.Sys
{
    partial class User
    {
        [Column("roles", Length = 0)]
        public string Roles { get; set; }

        public Dictionary<string, bool> Permissions;

        public void LoadPermissions(IEnumerable<Permission> allPermissions)
        {
            if (string.IsNullOrWhiteSpace(Roles))
            {
                Permissions = new Dictionary<string, bool>();
                return;
            }
            //add permissions
            Permissions = allPermissions
                .Where(x => x.Roles != null)
                .SelectMany(x => x.Roles.Split(',').Select(r => new { x.Operation, Role = r }))
                .Where(x => Roles.Contains(x.Role))
                .Select(x => x.Operation)
                .Distinct()
                .ToDictionary(x => x, x => true);
        }

        public bool Allow(string operaion)
        {
            //if (IsSuper()) return true;
            if (Permissions == null) return false;
            var allow = Permissions.ContainsKey(operaion);
            return allow;
        }

        public void Require(string operation)
        {
            var allow = Allow(operation);
            if (!allow) 
                throw new UnauthorizedAccessException("Нет прав на операцию или доступ к объекту: " + operation);
        }

    }
}



