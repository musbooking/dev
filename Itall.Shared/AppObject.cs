using System.Threading.Tasks;

namespace My
{
    /// <summary>
    /// Базовый класс для различных сервисов приложений
    /// </summary>
    public abstract partial class AppObject
    {
        protected static WebApp App => WebApp.Current;

        //protected static Itall.Services.ServiceProvider Services => WebApp.Current.Services;

        //protected static AppSettings AppSettings => WebApp.Current.Settings;

    }

}
