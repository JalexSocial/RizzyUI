
namespace RizzyUI;

/// <summary>
/// Provides the default styles for all components in the RizzyUI Sidebar suite.
/// </summary>
public class DefaultRzSidebarProviderStyles : RzStylesBase.RzSidebarProviderStylesBase
{
    public DefaultRzSidebarProviderStyles(RzTheme theme) : base(theme) { }
    public override string Provider => "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full";
}

public class DefaultSidebarStyles : RzStylesBase.SidebarStylesBase
{
    public DefaultSidebarStyles(RzTheme theme) : base(theme) { }
    public override string SidebarBase => "group peer text-sidebar-foreground hidden md:block";
    public override string NonCollapsibleContainer => "bg-sidebar text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col";
    public override string Nav => "bg-sidebar text-sidebar-foreground flex flex-col w-[var(--sidebar-mobile-width)] p-0 fixed inset-y-0 transition-transform ease-in-out duration-300 z-50 data-[side=left]:border-r data-[side=right]:border-l data-[mobile-state=open]:translate-x-0 data-[side=left]:data-[mobile-state=closed]:-translate-x-full data-[side=right]:data-[mobile-state=closed]:translate-x-full";
    
    public override string GetGapCss(SidebarVariant variant, SidebarSide side) =>
        $"relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear " +
        $"group-data-[collapsible=offcanvas]:w-0 " +
        $"group-data-[side=right]:order-last {(variant == SidebarVariant.Floating || variant == SidebarVariant.Inset ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]" : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]")}";

    public override string GetDesktopContainerCss(SidebarVariant variant, SidebarSide side) =>
        $"fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex " +
        $"{(side == SidebarSide.Left ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]")} " +
        $"{(variant == SidebarVariant.Floating || variant == SidebarVariant.Inset ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]" : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l")}";

    public override string GetDesktopInnerCss(SidebarVariant variant) =>
        $"bg-sidebar flex h-full w-full flex-col {(variant == SidebarVariant.Floating ? "border-sidebar-border rounded-lg border shadow-sm" : "")}";
}

public class DefaultSidebarTriggerStyles : RzStylesBase.SidebarTriggerStylesBase
{
    public DefaultSidebarTriggerStyles(RzTheme theme) : base(theme) { }
    public override string Trigger => "inline-flex items-center justify-center rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sidebar-ring";
}

public class DefaultSidebarHeaderStyles : RzStylesBase.SidebarHeaderStylesBase
{
    public DefaultSidebarHeaderStyles(RzTheme theme) : base(theme) { }
    public override string Header => "flex shrink-0 flex-col gap-2 p-2";
}

public class DefaultSidebarContentStyles : RzStylesBase.SidebarContentStylesBase
{
    public DefaultSidebarContentStyles(RzTheme theme) : base(theme) { }
    public override string Content => "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto group-data-[collapsible=icon]:overflow-hidden";
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
    public override string Label => "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:opacity-0";
}

public class DefaultSidebarGroupContentStyles : RzStylesBase.SidebarGroupContentStylesBase
{
    public DefaultSidebarGroupContentStyles(RzTheme theme) : base(theme) { }
    public override string Content => "w-full text-sm";
}

public class DefaultSidebarMenuStyles : RzStylesBase.SidebarMenuStylesBase
{
    public DefaultSidebarMenuStyles(RzTheme theme) : base(theme) { }
    public override string Menu => "flex w-full min-w-0 flex-col gap-1";
}

public class DefaultSidebarMenuItemStyles : RzStylesBase.SidebarMenuItemStylesBase
{
    public DefaultSidebarMenuItemStyles(RzTheme theme) : base(theme) { }
    public override string Item => "relative group/menu-item";
}

public class DefaultSidebarMenuButtonStyles : RzStylesBase.SidebarMenuButtonStylesBase
{
    public DefaultSidebarMenuButtonStyles(RzTheme theme) : base(theme) { }
    public override string ButtonBase => "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&[aria-current=page]]:bg-sidebar-accent [&[aria-current=page]]:font-medium [&[aria-current=page]]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 group-data-[state=collapsed]/sidebar:w-8 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:[&>span:last-child]:hidden";
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
    public override string SubMenu => "border-sidebar-border flex min-w-0 translate-x-px flex-col gap-1 border-l mx-3.5 px-2.5 py-0.5 w-full";
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
    public override string Inset => "bg-background relative flex flex-1 flex-col md:ml-[var(--sidebar-width)] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2";
}