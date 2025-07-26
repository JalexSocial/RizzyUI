
namespace RizzyUI;

/// <summary>
/// Provides the default styles for all components in the RizzyUI Sidebar suite.
/// </summary>
public class DefaultRzSidebarProviderStyles : RzStylesBase.RzSidebarProviderStylesBase
{
    public DefaultRzSidebarProviderStyles(RzTheme theme) : base(theme) { }
    public override string Provider => "relative";
}

public class DefaultSidebarStyles : RzStylesBase.SidebarStylesBase
{
    public DefaultSidebarStyles(RzTheme theme) : base(theme) { }
    public override string SidebarBase => "sidebar group/sidebar flex flex-col transition-all ease-in-out duration-300";
    public override string Nav => "flex flex-1 flex-col";
    public override string GetVariantCss(SidebarVariant variant) => variant switch
    {
        SidebarVariant.Default => "bg-sidebar text-sidebar-foreground fixed inset-y-0 z-50 border-r border-sidebar-border",
        SidebarVariant.Floating => "bg-sidebar text-sidebar-foreground fixed inset-y-4 z-50 rounded-lg border border-sidebar-border shadow-lg",
        SidebarVariant.Inset => "bg-sidebar text-sidebar-foreground relative inset-y-0 z-50 border-r border-sidebar-border",
        _ => ""
    };
}

public class DefaultSidebarTriggerStyles : RzStylesBase.SidebarTriggerStylesBase
{
    public DefaultSidebarTriggerStyles(RzTheme theme) : base(theme) { }
    public override string Trigger => "fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sidebar-ring md:hidden";
}

public class DefaultSidebarHeaderStyles : RzStylesBase.SidebarHeaderStylesBase
{
    public DefaultSidebarHeaderStyles(RzTheme theme) : base(theme) { }
    public override string Header => "flex shrink-0 flex-col gap-2 p-2";
}

public class DefaultSidebarContentStyles : RzStylesBase.SidebarContentStylesBase
{
    public DefaultSidebarContentStyles(RzTheme theme) : base(theme) { }
    public override string Content => "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto";
}

public class DefaultSidebarFooterStyles : RzStylesBase.SidebarFooterStylesBase
{
    public DefaultSidebarFooterStyles(RzTheme theme) : base(theme) { }
    public override string Footer => "flex shrink-0 flex-col gap-2 p-2";
}

public class DefaultSidebarGroupStyles : RzStylesBase.SidebarGroupStylesBase
{
    public DefaultSidebarGroupStyles(RzTheme theme) : base(theme) { }
    public override string Group => "relative flex w-full min-w-0 flex-col p-2";
}

public class DefaultSidebarGroupLabelStyles : RzStylesBase.SidebarGroupLabelStylesBase
{
    public DefaultSidebarGroupLabelStyles(RzTheme theme) : base(theme) { }
    public override string Label => "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0";
}

public class DefaultSidebarGroupContentStyles : RzStylesBase.SidebarGroupContentStylesBase
{
    public DefaultSidebarGroupContentStyles(RzTheme theme) : base(theme) { }
    public override string Content => "";
}

public class DefaultSidebarMenuStyles : RzStylesBase.SidebarMenuStylesBase
{
    public DefaultSidebarMenuStyles(RzTheme theme) : base(theme) { }
    public override string Menu => "flex w-full min-w-0 flex-col gap-1";
}

public class DefaultSidebarMenuItemStyles : RzStylesBase.SidebarMenuItemStylesBase
{
    public DefaultSidebarMenuItemStyles(RzTheme theme) : base(theme) { }
    public override string Item => "relative";
}

public class DefaultSidebarMenuButtonStyles : RzStylesBase.SidebarMenuButtonStylesBase
{
    public DefaultSidebarMenuButtonStyles(RzTheme theme) : base(theme) { }
    public override string ButtonBase => "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&[aria-current=page]]:bg-sidebar-accent [&[aria-current=page]]:font-medium [&[aria-current=page]]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0";
    public override string GetVariantCss(SidebarMenuButtonVariant variant) => variant switch
    {
        SidebarMenuButtonVariant.Default => "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        SidebarMenuButtonVariant.Outline => "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
        _ => ""
    };
    public override string GetSizeCss(Size size) => size switch
    {
        Size.Small => "h-7 text-xs",
        Size.Medium => "h-8 text-sm",
        Size.Large => "h-12 text-sm group-data-[collapsible=icon]:p-0",
        _ => "h-8 text-sm"
    };
}

public class DefaultSidebarMenuActionStyles : RzStylesBase.SidebarMenuActionStylesBase
{
    public DefaultSidebarMenuActionStyles(RzTheme theme) : base(theme) { }
    public override string Action => "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/menu-item:opacity-100";
}

public class DefaultSidebarMenuSubStyles : RzStylesBase.SidebarMenuSubStylesBase
{
    public DefaultSidebarMenuSubStyles(RzTheme theme) : base(theme) { }
    public override string SubMenu => "relative";
}

public class DefaultSidebarMenuBadgeStyles : RzStylesBase.SidebarMenuBadgeStylesBase
{
    public DefaultSidebarMenuBadgeStyles(RzTheme theme) : base(theme) { }
    public override string Badge => "ml-auto text-xs";
}

public class DefaultSidebarSeparatorStyles : RzStylesBase.SidebarSeparatorStylesBase
{
    public DefaultSidebarSeparatorStyles(RzTheme theme) : base(theme) { }
    public override string Separator => "border-sidebar-border mx-2 w-auto border-t";
}

public class DefaultSidebarInsetStyles : RzStylesBase.SidebarInsetStylesBase
{
    public DefaultSidebarInsetStyles(RzTheme theme) : base(theme) { }
    public override string Inset => "p-4 md:ml-[--sidebar-width]";
}