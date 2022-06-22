using System.Threading.Tasks;

namespace My.App
{
    public abstract class AppJob : AppObject, Itall.Services.IJob
    {
        public abstract Task RunAsync();
    }

}
