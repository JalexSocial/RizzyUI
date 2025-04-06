using RizzyUI.Styling;

namespace RizzyUI.Components.RzSidebar.Styling;

// ... (DefaultRzSidebarStyles definition from previous step) ...

/// <summary> Provides default styles for RzSidebarLinkItem. </summary>
public  class DefaultRzSidebarLinkItemStyles : RzStylesBase.RzSidebarLinkItemStylesBase
{
     public DefaultRzSidebarLinkItemStyles(RzTheme theme) : base(theme) { }

     /// <inheritdoc/>
     public override string CollapsibleListItem => ""; // No specific style on the LI itself usually
     /// <inheritdoc/>
     public override string CollapsibleInnerDiv => "flex flex-col";
     /// <inheritdoc/>
     public override string CollapsibleButton => $"flex items-center justify-between rounded-{Theme.BorderRadiusTokenName} gap-2 px-2 py-1.5 text-sm font-medium underline-offset-2 focus:outline-none focus-visible:underline text-{Theme.Light.OnSurface.TailwindClassName} hover:bg-{Theme.Light.Primary.TailwindClassName}/5 hover:text-{Theme.Light.OnSurfaceStrong.TailwindClassName} dark:hover:text-{Theme.Dark.OnSurfaceStrong.TailwindClassName} dark:hover:bg-{Theme.Dark.Primary.TailwindClassName}/5";
     /// <inheritdoc/>
     public override string CollapsibleButtonIconContainer => "text-xl";
     /// <inheritdoc/>
     public override string CollapsibleButtonTitle => "mr-auto text-left";
     /// <inheritdoc/>
     public override string CollapsibleButtonTrailer => "ml-auto";
     /// <inheritdoc/>
     public override string CollapsibleButtonChevron => "size-5 transition-transform shrink-0";
     /// <inheritdoc/>
     public override string CollapsibleNestedList => ""; // No base style needed, relies on children LI styles

     /// <inheritdoc/>
     public override string SubListItem => $"border-l px-2 py-0.5 border-{Theme.Outline.TailwindClassName} dark:border-{Theme.Dark.Outline.TailwindClassName} transition duration-200 hover:border-l-2 hover:border-{Theme.Light.OutlineStrong.TailwindClassName} hover:text-{Theme.Light.OnSurfaceStrong.TailwindClassName} dark:hover:border-{Theme.Dark.OutlineStrong.TailwindClassName} dark:hover:text-{Theme.Dark.OnSurfaceStrong.TailwindClassName}";
     /// <inheritdoc/>
     public override string SubLinkOrDiv => $"flex items-center gap-2 px-2 py-1.5 text-sm rounded-{Theme.BorderRadiusTokenName} text-{Theme.Light.OnSurface.TailwindClassName} underline-offset-2 hover:bg-{Theme.Light.Primary.TailwindClassName}/5 hover:text-{Theme.Light.OnSurfaceStrong.TailwindClassName} focus-visible:underline focus:outline-none dark:hover:bg-{Theme.Dark.Primary.TailwindClassName}/5 dark:hover:text-{Theme.Dark.OnSurfaceStrong.TailwindClassName}";

      /// <inheritdoc/>
     public override string TopLevelListItem => "px-1 py-0.5 first:mt-2";
     /// <inheritdoc/>
     public override string TopLevelNonCollapsibleDiv => $"flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-{Theme.Light.OnSurface.TailwindClassName} underline-offset-2 rounded-{Theme.BorderRadiusTokenName}"; // Similar to link but not a link
     /// <inheritdoc/>
     public override string TopLevelLink => $"flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-{Theme.Light.OnSurface.TailwindClassName} underline-offset-2 hover:bg-{Theme.Light.Primary.TailwindClassName}/5 hover:text-{Theme.Light.OnSurfaceStrong.TailwindClassName} focus-visible:underline focus:outline-none dark:hover:bg-{Theme.Dark.Primary.TailwindClassName}/5 dark:hover:text-{Theme.Dark.OnSurfaceStrong.TailwindClassName} rounded-{Theme.BorderRadiusTokenName}";
     /// <inheritdoc/>
     public override string ItemIconContainer => "text-lg";
     /// <inheritdoc/>
     public override string ItemTitle => ""; // Just a span
     /// <inheritdoc/>
     public override string ItemTrailer => "ml-auto";
     /// <inheritdoc/>
     public override string NonCollapsibleNestedList => "pl-4";

     /// <inheritdoc/>
     public override string GetChevronRotationCss(bool isExpanded) => isExpanded ? "rotate-180" : "rotate-0";
}

/// <summary> Provides default styles for RzSidebarLinks. </summary>
public  class DefaultRzSidebarLinksStyles : RzStylesBase.RzSidebarLinksStylesBase
{
    public DefaultRzSidebarLinksStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string List => "flex flex-col gap-2 pb-6";
}

