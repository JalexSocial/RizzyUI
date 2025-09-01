
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    public abstract class RzSidebarProviderStylesBase
    {
        protected readonly RzTheme Theme;
        protected RzSidebarProviderStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Provider { get; }
    }

    public abstract class SidebarStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string SidebarBase { get; }
        public abstract string NonCollapsibleContainer { get; }
        public abstract string Nav { get; }
        public abstract string GetGapCss(SidebarVariant variant, SidebarSide side);
        public abstract string GetDesktopContainerCss(SidebarVariant variant, SidebarSide side);
        public abstract string GetDesktopInnerCss(SidebarVariant variant);
    }

    public abstract class SidebarTriggerStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarTriggerStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Trigger { get; }
    }

    public abstract class SidebarHeaderStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarHeaderStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Header { get; }
    }

    public abstract class SidebarContentStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarContentStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Content { get; }
    }

    public abstract class SidebarFooterStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarFooterStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Footer { get; }
    }

    public abstract class SidebarGroupStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarGroupStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Group { get; }
    }
    
    public abstract class SidebarGroupLabelStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarGroupLabelStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Label { get; }
    }

    public abstract class SidebarGroupContentStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarGroupContentStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Content { get; }
    }

    public abstract class SidebarMenuStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarMenuStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Menu { get; }
    }

    public abstract class SidebarMenuItemStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarMenuItemStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Item { get; }
    }

    public abstract class SidebarMenuButtonStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarMenuButtonStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string ButtonBase { get; }
        public abstract string GetVariantCss(SidebarMenuButtonVariant variant);
        public abstract string GetSizeCss(Size size);
    }

    public abstract class SidebarMenuActionStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarMenuActionStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Action { get; }
    }

    public abstract class SidebarMenuSubStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarMenuSubStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string SubMenu { get; }
    }

    public abstract class SidebarMenuBadgeStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarMenuBadgeStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Badge { get; }
    }

    public abstract class SidebarSeparatorStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarSeparatorStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Separator { get; }
    }
    
    public abstract class SidebarInsetStylesBase
    {
        protected readonly RzTheme Theme;
        protected SidebarInsetStylesBase(RzTheme theme) { Theme = theme; }
        public abstract string Inset { get; }
    }
    
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="SidebarRail" /> component.
    /// </summary>
    public abstract class SidebarRailStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="SidebarRailStylesBase" /> class. </summary>
        protected SidebarRailStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the SidebarRail container div. </summary>
        public abstract string Rail { get; }
    }
    
}