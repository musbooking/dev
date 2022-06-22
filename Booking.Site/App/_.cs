using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace My.App
{
    public enum ScopeType
    {
        Any = 0,
        Zone = 1,
        Private = 2,
    }

    public enum DiscountKind
    {
        Undefined = 0,
        UseDiscount = 1,
        IgnoreDiscount = 2,
    }

    public enum DayKind
    {
        WorkFirstDay = 1,
        WorkDay = 3,
        WorkLastDay = 5,
        Weekend1 = 6,  // СБ
        Weekend2 = 7,  // ВС
    }


    public enum NotifyKind
    {
        //None = 0,
        Reserv = 1,
        Payment = 2,
        Cancel = 3,
        Forfeit = 4,
        Review = 5
    }


    public abstract class ServiceContext
    {
        public Sys.User CurUser;
        public DbConnection Db;
    }


    public interface IBaseSource
    {
        Guid? BaseId { get; }
    }


}
