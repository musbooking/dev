namespace My.App
{
    public abstract class DbController : BaseAppController
    {
        public static DbConnection GLOBAL_DB = null;

//#if DEBUG111
//        protected DbConnection Db = new DbConnection();
//#else
//        protected DbConnection Db => GLOBAL_DB ?? this.GetService<LinqToDB.Data.DataConnection>() as DbConnection;
//#endif

        private DbConnection _Db;

        public DbConnection Db
        {
            get 
            {
                _Db = _Db ?? GLOBAL_DB ?? this.GetService<LinqToDB.Data.DataConnection>() as DbConnection;
                return _Db; 
            }
#if DEBUG
            set
            {
                _Db = value;
            }
#endif
        }


    }
}
