namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzDropdownMenu Styles

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzDropdownMenu" /> component and its children.
    /// </summary>
    public abstract class RzDropdownMenuStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDropdownMenuStylesBase" /> class. </summary>
        protected RzDropdownMenuStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        // RzDropdownMenu (Root)
        /// <summary> Gets the base CSS classes for the main RzDropdownMenu container div. </summary>
        public abstract string Container { get; }
        /// <summary> Gets the CSS classes for the relative div that wraps both the trigger and the floating menu. </summary>
        public abstract string RelativeWrapper { get; }

        // DropdownMenuTrigger
        /// <summary> Gets the CSS classes for the trigger wrapper div. </summary>
        public abstract string TriggerWrapper { get; }

        // DropdownMenuContent
        /// <summary> Gets the CSS classes for the dropdown menu content container div (floating element). </summary>
        public abstract string ContentContainer { get; }
        /// <summary> Gets the CSS classes for the inner div inside the menu content, holding items/groups. </summary>
        public abstract string ContentInnerContainer { get; }

        // DropdownMenuLabel
        /// <summary> Gets the CSS classes for a label within the dropdown menu. </summary>
        public abstract string Label { get; }

        // DropdownMenuGroup
        /// <summary> Gets the CSS classes for a group of items within the dropdown menu. </summary>
        public abstract string Group { get; }

        // DropdownMenuItem (Existing, ensure it's covered or adapt)
        /// <summary> Gets the base CSS classes for a menu item. </summary>
        public abstract string MenuItem { get; }
        /// <summary> Gets the CSS classes for the icon span within a menu item. </summary>
        public abstract string MenuItemIconSpan { get; }
        /// <summary> Gets the CSS classes for the icon itself within a menu item. </summary>
        public abstract string MenuItemIcon { get; }
        /// <summary> Gets the CSS classes for the title span within a menu item. </summary>
        public abstract string MenuItemTitleSpan { get; }
        /// <summary> Gets the CSS classes for the shortcut/count div within a menu item. </summary>
        public abstract string MenuItemShortcut { get; } // Renamed from CountDiv for clarity

        // DropdownMenuSeparator
        /// <summary> Gets the CSS classes for a separator line within the dropdown menu. </summary>
        public abstract string Separator { get; }

        // DropdownMenuSub (Container for sub-menu)
        /// <summary> Gets the CSS classes for the sub-menu container. </summary>
        public abstract string SubContainer { get; }

        // DropdownMenuSubTrigger
        /// <summary> Gets the CSS classes for a sub-menu trigger (similar to MenuItem but with a chevron). </summary>
        public abstract string SubTrigger { get; }
        /// <summary> Gets the CSS classes for the chevron icon in a sub-menu trigger. </summary>
        public abstract string SubTriggerChevron { get; }

        // DropdownMenuSubContent
        /// <summary> Gets the CSS classes for the sub-menu content container. </summary>
        public abstract string SubContentContainer { get; }
         /// <summary> Gets the CSS classes for the inner div of the sub-menu content. </summary>
        public abstract string SubContentInnerContainer { get; }
    }

    #endregion
}