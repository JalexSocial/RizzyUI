
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzPagination component.
/// </summary>
public class DefaultRzPaginationStyles : RzStylesBase.RzPaginationStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzPaginationStyles"/> class with the specified theme.
    /// </summary>
    /// <param name="theme">The theme to use for styling.</param>
    public DefaultRzPaginationStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    /// Gets the CSS classes for the pagination container element.
    /// Default styles center the pagination controls and add vertical padding.
    /// </summary>
    public override string Container => "flex justify-center items-center"; // Removed py-2, can be added by user

    /// <summary>
    /// Gets the CSS classes for the pagination list element.
    /// Default styles create an inline flex container with small gaps between pagination items.
    /// </summary>
    public override string List => "inline-flex items-center gap-1 text-sm"; // Removed rounded-md, buttons will be rounded

    /// <summary>
    /// Gets the base CSS styles used by multiple pagination link types.
    /// Contains shared styles for links including dimensions, spacing, and focus states.
    /// This is a private helper method used internally by the component.
    /// </summary>
    private string BaseLinkStyle =>
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer"; // Base from kitchen sink button

    /// <summary>
    /// Gets the CSS classes for standard pagination links.
    /// Extends the base link style and adds rounded corners to first and last items.
    /// </summary>
    public override string Link => $"{BaseLinkStyle} h-9 px-3 border bg-background shadow-xs dark:bg-input/30 dark:border-input hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md"; // Size of icon button, outline style

    /// <summary>
    /// Gets the CSS classes for the current/active pagination link.
    /// Includes distinct styling to highlight the current page with primary colors.
    /// </summary>
    public override string LinkCurrent =>
        $"{BaseLinkStyle} h-9 px-3 border bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md aria-[current=page]:z-10"; // Primary button style

    /// <summary>
    /// Gets the CSS classes for disabled pagination links (like Previous when on first page).
    /// Extends the base link style but adds reduced opacity and disabled cursor indicator.
    /// </summary>
    public override string LinkDisabled =>
        $"{BaseLinkStyle} h-9 px-3 border bg-background shadow-xs dark:bg-input/30 dark:border-input opacity-50 cursor-not-allowed rounded-md";

    /// <summary>
    /// Gets the CSS classes for ellipsis elements in the pagination.
    /// Styled similarly to links but without hover effects and with select-none to prevent text selection.
    /// </summary>
    public override string Ellipsis =>
        $"{BaseLinkStyle} h-9 px-3 border bg-background shadow-xs dark:bg-input/30 dark:border-input select-none rounded-md"; // Similar to Link but non-interactive
}