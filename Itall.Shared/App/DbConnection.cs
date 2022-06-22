using System;

namespace My.App
{
    public partial class DbConnection : Itall.Models.DbConnection  // , IDisposable
    {
        const string CONFIG_NAME = "Default";

        public DbConnection() : base(CONFIG_NAME)  // CF1
        {
            //this.Database.Log = sql => System.Diagnostics.Debug.WriteLine("EF SQL: " + sql); ;
        }

#if !LINQ2DB_V2
        public static void Config(string connectionString, LinqToDB.DataProvider.IDataProvider provider)
        {
            AddConfiguration(CONFIG_NAME, connectionString, provider);
#if DEBUG
            TurnTraceSwitchOn(System.Diagnostics.TraceLevel.Info);
            //LinqToDB.Common.Configuration.Linq.GenerateExpressionTest = true;
            //LinqToDB.Common.Configuration.Linq.TraceMapperExpression = true;
            WriteTraceLine = (s, s1, l) => System.Diagnostics.Debug.WriteLine(s, s1);
#endif

        }
#endif


    }


}
