using Itall.App.Data;

namespace My.App
{
    public abstract class BaseListController<T> : UpdateDbController<T> where T : ListItem
    {
        protected override object OnUpdating(Updater<T> updater)
        {
            updater.Set(x => x.Name);
            updater.Set(x => x.Description);
            updater.Set(x => x.IsArchive);

            return base.OnUpdating(updater);
        }

    }
}
