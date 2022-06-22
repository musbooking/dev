using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace My.App
{

    //[Route("api/[controller]")]
    //[Route("[controller]")]
    public abstract partial class BaseAppController : Itall.App.BaseApiController
    {
        protected static WebApp App => WebApp.Current; 

        //protected Core.User CurUser => this.CurUser();

    }
}
