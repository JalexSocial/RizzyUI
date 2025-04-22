namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzSidebar Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSidebar" /> component and layout.
    /// </summary>
    public abstract class RzSidebarStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSidebarStylesBase" /> class. </summary>
        protected RzSidebarStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the main RzSidebar container div (which holds the Alpine.js x-data). Usually
        ///     empty.
        /// </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the primary div containing both the sidebar (aside) and main content area (section). </summary>
        public abstract string LayoutContainer { get; }

        /// <summary> Gets the CSS classes for the screen reader skip link. </summary>
        public abstract string SkipLink { get; }

        /// <summary> Gets the CSS classes for the dark overlay div shown on mobile when the sidebar is open. </summary>
        public abstract string Overlay { get; }

        /// <summary>
        ///     Gets the base CSS classes for the aside element (sidebar container: positioning, width, overflow, background,
        ///     border, z-index, padding, transitions).
        /// </summary>
        public abstract string Sidebar { get; }

        /// <summary> Gets the CSS classes for the main content section element (padding-left offset, width, background). </summary>
        public abstract string MainContentContainer { get; }

        /// <summary> Gets the CSS classes for the inner div providing padding within the main content area. </summary>
        public abstract string MainContentPadding { get; }

        /// <summary> Gets the CSS classes for the floating toggle button used when no <see cref="RzNavbar" /> is provided. </summary>
        public abstract string FloatingToggleButton { get; }

        /// <summary> Gets the CSS 'top' positioning class for the sidebar based on whether a navbar is present. </summary>
        /// <param name="hasNavbar">True if a navbar is rendered within the sidebar.</param>
        /// <returns>A string like "top-16" or "top-0".</returns>
        public abstract string GetSidebarTopCss(bool hasNavbar);

        /// <summary> Gets the CSS top margin class for the main layout container based on whether a navbar is present. </summary>
        /// <param name="hasNavbar">True if a navbar is rendered within the sidebar.</param>
        /// <returns>A string like "mt-16" or "".</returns>
        public abstract string GetLayoutContainerTopCss(bool hasNavbar);

        /// <summary> Gets the CSS transform class for the sidebar's visibility state (used by Alpine.js binding). </summary>
        /// <param name="isVisible">True if the sidebar should be visible.</param>
        /// <returns>A string like "translate-x-0" or "-translate-x-60".</returns>
        public abstract string GetSidebarTranslationCss(bool isVisible);
    }

    /// <summary>
    ///     Defines the abstract structure for styling individual items (<see cref="RzSidebarLinkItem" />) within the sidebar.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSidebarLinkItem" /> component.
    /// </summary>
    public abstract class RzSidebarLinkItemStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSidebarLinkItemStylesBase" /> class. </summary>
        protected RzSidebarLinkItemStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the list item (li) when it represents a collapsible section. </summary>
        public abstract string CollapsibleListItem { get; }

        /// <summary> Gets the CSS classes for the inner div used within a collapsible list item. </summary>
        public abstract string CollapsibleInnerDiv { get; }

        /// <summary> Gets the base CSS classes for the button element used as the header for a collapsible section. </summary>
        public abstract string CollapsibleButton { get; }

        /// <summary> Gets the CSS classes for the icon container div within the collapsible button. </summary>
        public abstract string CollapsibleButtonIconContainer { get; }

        /// <summary> Gets the CSS classes for the title span within the collapsible button. </summary>
        public abstract string CollapsibleButtonTitle { get; }

        /// <summary> Gets the CSS classes for the trailer content div (e.g., badge) within the collapsible button. </summary>
        public abstract string CollapsibleButtonTrailer { get; }

        /// <summary> Gets the base CSS classes for the expand/collapse chevron icon. </summary>
        public abstract string CollapsibleButtonChevron { get; }

        /// <summary> Gets the CSS classes for the nested list (ul) containing child items within a collapsible section. </summary>
        public abstract string CollapsibleNestedList { get; }

        /// <summary> Gets the CSS classes for the list item (li) when it's a non-collapsible sub-item (indented style). </summary>
        public abstract string SubListItem { get; }

        /// <summary> Gets the CSS classes for the anchor (a) or div element used for a non-collapsible sub-item. </summary>
        public abstract string SubLinkOrDiv { get; }

        /// <summary> Gets the CSS classes for the list item (li) when it's a non-collapsible top-level item. </summary>
        public abstract string TopLevelListItem { get; }

        /// <summary> Gets the CSS classes for the div element used when a top-level item has children but is not collapsible. </summary>
        public abstract string TopLevelNonCollapsibleDiv { get; }

        /// <summary> Gets the CSS classes for the anchor (a) element used for a non-collapsible top-level item. </summary>
        public abstract string TopLevelLink { get; }

        /// <summary> Gets the CSS classes for the icon container div used within non-collapsible items. </summary>
        public abstract string ItemIconContainer { get; }

        /// <summary> Gets the CSS classes for the title span used within non-collapsible items. </summary>
        public abstract string ItemTitle { get; }

        /// <summary> Gets the CSS classes for the trailer content div used within non-collapsible items. </summary>
        public abstract string ItemTrailer { get; }

        /// <summary> Gets the CSS classes for the nested list (ul) used within non-collapsible items that have children. </summary>
        public abstract string NonCollapsibleNestedList { get; }

        /// <summary> Gets the CSS transform class (e.g., "rotate-180") for the chevron icon based on the expanded state. </summary>
        /// <param name="isExpanded">True if the collapsible section is expanded.</param>
        /// <returns>A string representing a rotation class.</returns>
        public abstract string GetChevronRotationCss(bool isExpanded);
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSidebarLinks" /> container list.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSidebarLinks" /> component.
    /// </summary>
    public abstract class RzSidebarLinksStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSidebarLinksStylesBase" /> class. </summary>
        protected RzSidebarLinksStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzSidebarLinks ul element (layout, spacing). </summary>
        public abstract string List { get; }
    }

    #endregion
}