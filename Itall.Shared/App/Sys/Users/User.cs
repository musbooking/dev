using Itall;
using Itall.App.Auth;
using LinqToDB.Mapping;
using System;

namespace My.App.Sys
{
    [Table("users")]
    public partial class User :  Itall.App.Auth.ILogin   // ListItem, 
    {
        public string GetLoginKey() => Id.ToString();

        string ILogin.GetLoginValue() => Login + ":" + Hash + ":" + Roles;  // Updated чтобы отслеживать дату изменения


        //[Column("login", Length = 100)]
        //[Index]
        //public string Login { get; set; }

        //[Column("email", Length = 150)]
        //public string Email { get; set; }

        //[Column("phone", Length = 20)]
        //public string Phone { get; set; }


        [Column("isAdmin")]
        public bool IsAdmin { get; set; }

        /// <summary>
        /// Обладает ли пользователь правами суперажминистратора
        /// </summary>
        public bool IsSuper() => IsAdmin;



        [Column("hash", Length = 100)]
        public string Hash { get; set; }


    }
}



