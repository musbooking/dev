namespace My.App
{
    /// <summary>
    /// Базовый класс для дата-сервисов и стейт-машин
    /// За основу взят код: https://habrahabr.ru/post/160105/
    /// stateA(args) - переход в состояние A
    /// setState(state) - общий protected метод для перехода в новое состояние
    /// </summary>
    public abstract partial class BaseAppService: AppObject
    {
        public Sys.User User;

        //protected static AppSettings AppSettings => WebApp.Settings;

    }

    /// <summary>
    /// Абстрактный сервис для работы с БД и контекстом
    /// </summary>
    public abstract partial class DbService: BaseAppService
    {
        public DbConnection Db;

    }


}
