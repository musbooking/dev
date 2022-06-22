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
        public ITable<Calendars.Calendar> Calendars => this.GetTable<Calendars.Calendar>();

        //public ITable<Calendars.Token> Tokens { get { return GetTable<Calendars.Token>(); } }

        //public async Task<Calendars.Calendar> CreateCalendarAsync()
        //{
        //    var calendar = new Calendars.Calendar
        //    {
        //        Name = "",
        //        //Provider = "",
        //        MinDate = DateTime.Now,
        //    };
        //    await this.CreateInsertAsync(calendar);
        //    return calendar;
        //}
    }





}
