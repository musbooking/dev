using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace My.App.Sys
{

    /// <summary>
    /// Интерфейс для описания реакции на событие
    /// </summary>
    public interface IAction<T>
    {
        void Invoke(ActionType type, T context);
    }


    public enum ActionType
    {
        OpenSite, // client open site
    }
}
