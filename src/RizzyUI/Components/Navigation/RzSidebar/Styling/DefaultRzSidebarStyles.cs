namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzSidebar component.
/// </summary>
public class DefaultRzSidebarStyles : RzStylesBase.RzSidebarStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzSidebarStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultRzSidebarStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Container => ""; // x-data container usually has no specific style

    /// <inheritdoc/>
    public override string LayoutContainer => "relative flex w-full flex-col md:flex-row";

    /// <inheritdoc/>
    public override string SkipLink => "sr-only";

    /// <inheritdoc/>
    // Use semantic surface color with alpha for overlay
    public override string Overlay => $"z-30 bg-surface/10 fixed inset-0 backdrop-blur-sm md:hidden dark:bg-surface/10";

    /// <inheritdoc/>
    // Use semantic names for background and border
    public override string Sidebar => $"fixed left-0 bottom-0 w-60 overflow-y-auto scrollbar-hover bg-surface-alt border-r border-outline z-40 p-4 transition-transform duration-300 md:w-60 md:translate-x-0";

    /// <inheritdoc/>
    // Use semantic name for background
    public override string MainContentContainer => $"md:pl-60 w-full bg-surface"; // pl matches sidebar width

    /// <inheritdoc/>
    public override string MainContentPadding => "p-4 md:p-6 lg:p-8";

    /// <inheritdoc/>
    // Use semantic names for background and text
    public override string FloatingToggleButton => $"z-50 fixed right-4 top-4 rounded-full bg-primary p-4 text-on-primary md:hidden";

    /// <inheritdoc/>
    public override string GetSidebarTopCss(bool hasNavbar) => hasNavbar ? "top-16" : "top-0"; // Adjust based on standard navbar height (h-16)

     /// <inheritdoc/>
    public override string GetLayoutContainerTopCss(bool hasNavbar) => hasNavbar ? "mt-16" : ""; // Adjust based on standard navbar height (h-16)

    /// <inheritdoc/>
    // Use fixed width value corresponding to 'w-60'
    public override string GetSidebarTranslationCss(bool isVisible) => isVisible ? "translate-x-0" : "-translate-x-60";
}

/// <summary> Provides default styles for RzSidebarLinkItem. </summary>
public class DefaultRzSidebarLinkItemStyles : RzStylesBase.RzSidebarLinkItemStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzSidebarLinkItemStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzSidebarLinkItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string CollapsibleListItem => ""; // No specific style on the LI itself usually

    /// <inheritdoc />
    public override string CollapsibleInnerDiv => "flex flex-col";

    /// <inheritdoc />
    public override string CollapsibleButton =>
        $"flex items-center justify-between rounded-theme gap-2 px-2 py-1.5 text-sm font-medium underline-offset-2 focus:outline-none focus-visible:underline text-on-surface hover:bg-primary/5 hover:text-on-surface-strong dark:hover:text-on-surface-strong dark:hover:bg-primary/5";

    /// <inheritdoc />
    public override string CollapsibleButtonIconContainer => "text-xl";

    /// <inheritdoc />
    public override string CollapsibleButtonTitle => "mr-auto text-left";

    /// <inheritdoc />
    public override string CollapsibleButtonTrailer => "ml-auto";

    /// <inheritdoc />
    public override string CollapsibleButtonChevron => "size-5 transition-transform shrink-0";

    /// <inheritdoc />
    public override string CollapsibleNestedList => ""; // No base style needed, relies on children LI styles

    /// <inheritdoc />
    public override string SubListItem =>
        $"border-l px-2 py-0.5 border-outline dark:border-outline transition duration-200 hover:border-l-2 hover:border-outline-strong hover:text-on-surface-strong dark:hover:border-outline-strong dark:hover:text-on-surface-strong";

    /// <inheritdoc />
    public override string SubLinkOrDiv =>
        $"flex items-center gap-2 px-2 py-1.5 text-sm rounded-theme text-on-surface underline-offset-2 hover:bg-primary/5 hover:text-on-surface-strong focus-visible:underline focus:outline-none dark:hover:bg-primary/5 dark:hover:text-on-surface-strong";

    /// <inheritdoc />
    public override string TopLevelListItem => "px-1 py-0.5 first:mt-2";

    /// <inheritdoc />
    public override string TopLevelNonCollapsibleDiv =>
        "flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-on-surface underline-offset-2 rounded-theme"; // Similar to link but not a link

    /// <inheritdoc />
    public override string TopLevelLink =>
        $"flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-on-surface underline-offset-2 hover:bg-primary/5 hover:text-on-surface-strong focus-visible:underline focus:outline-none dark:hover:bg-primary/5 dark:hover:text-on-surface-strong rounded-theme";

    /// <inheritdoc />
    public override string ItemIconContainer => "text-lg";

    /// <inheritdoc />
    public override string ItemTitle => ""; // Just a span

    /// <inheritdoc />
    public override string ItemTrailer => "ml-auto";

    /// <inheritdoc />
    public override string NonCollapsibleNestedList => "pl-4";

    /// <inheritdoc />
    public override string GetChevronRotationCss(bool isExpanded)
    {
        return isExpanded ? "rotate-180" : "rotate-0";
    }
}

/// <summary> Provides default styles for RzSidebarLinks. </summary>
public class DefaultRzSidebarLinksStyles : RzStylesBase.RzSidebarLinksStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzSidebarLinksStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzSidebarLinksStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string List => "flex flex-col gap-2 pb-6";
}