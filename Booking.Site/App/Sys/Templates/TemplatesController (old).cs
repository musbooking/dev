using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using-Nancy;
//using-Nancy-binding;
//using-Nancy-security;
using LinqToDB;
using My.App;
using Itall.App.Data;
using Itall;
using Microsoft.AspNetCore.Mvc;

namespace My.App
{
    public class TemplatesOldController : BaseAppController
    {
        private Microsoft.AspNetCore.Mvc.Razor.IRazorViewEngine _viewEngine;
        private Microsoft.AspNetCore.Mvc.ViewFeatures.ITempDataProvider _tempDataProvider;
        private IServiceProvider _serviceProvider;

        public TemplatesOldController(
            Microsoft.AspNetCore.Mvc.Razor.IRazorViewEngine viewEngine,
            Microsoft.AspNetCore.Mvc.ViewFeatures.ITempDataProvider tempDataProvider,
            IServiceProvider serviceProvider)
        {
            _viewEngine = viewEngine;
            _tempDataProvider = tempDataProvider;
            _serviceProvider = serviceProvider;
        }

        //[Route("test")]
        //public string Test()
        //{
        //    // render ~/Views/Emails/ResetCode

        //    var obj = new Sys.Template
        //    {
        //        Body = new string[]{ "123456", "ddd"  },
        //        //Items = { "sss", "bbb", },
        //    };

        //    var html = Render("../Pages/Mail", obj);

        //    return html;

        //}


        public string Render<TModel>(string name, TModel model)
        {

            var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            httpContext.RequestServices = _serviceProvider;

            var actionContext = new ActionContext(
                httpContext,
                new Microsoft.AspNetCore.Routing.RouteData(),
                new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            );

            var viewEngineResult = _viewEngine.FindView(actionContext, name, false);

            if (!viewEngineResult.Success)
            {
                throw new InvalidOperationException(string.Format("Couldn't find view '{0}'", name));
            }

            var view = viewEngineResult.View;

            using (var output = new System.IO.StringWriter())
            {
                var viewContext = new Microsoft.AspNetCore.Mvc.Rendering.ViewContext(
                    actionContext,
                    view,
                    new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary<TModel>(
                        metadataProvider: new Microsoft.AspNetCore.Mvc.ModelBinding.EmptyModelMetadataProvider(),
                        modelState: new Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary())
                    {
                        Model = model
                    },
                    new Microsoft.AspNetCore.Mvc.ViewFeatures.TempDataDictionary(
                        actionContext.HttpContext,
                        _tempDataProvider),
                    output,
                    new Microsoft.AspNetCore.Mvc.ViewFeatures.HtmlHelperOptions());

                view.RenderAsync(viewContext).GetAwaiter().GetResult();

                return output.ToString();
            }
        }


    }


}
