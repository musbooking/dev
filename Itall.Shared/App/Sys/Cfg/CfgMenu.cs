namespace My.App.Sys
{

    public class CfgMenu
    {
        public string Text { get; set; }
        public string Icon { get; set; }
        public string Access { get; set; }
        public CfgMenuKind Kind { get; set; } = CfgMenuKind.Local;
        public string Link { get; set; }
        public string If { get; set; }
        public bool Block { get; set; } = false;
        public bool Default { get; set; } = false;
        public bool Disabled { get; set; } = false;

        public CfgMenu[] Items { get; set; }
    }


}
