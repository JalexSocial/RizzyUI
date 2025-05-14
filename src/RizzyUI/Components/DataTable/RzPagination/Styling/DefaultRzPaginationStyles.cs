
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
    public override string Container => "flex justify-center items-center py-2"; 

    /// <summary>
    /// Gets the CSS classes for the pagination list element.
    /// Default styles create an inline flex container with small gaps between pagination items.
    /// </summary>
    public override string List => "inline-flex items-center gap-1 text-sm rounded-theme"; 

    /// <summary>
    /// Gets the base CSS styles used by multiple pagination link types.
    /// Contains shared styles for links including dimensions, spacing, and focus states.
    /// This is a private helper method used internally by the component.
    /// </summary>
    private string BaseLinkStyle => 
        "flex items-center justify-center px-3 h-8 leading-tight no-underline " +
        "text-on-surface bg-surface border border-outline " +
        "hover:bg-surface-alt hover:text-on-surface-strong " +
        "dark:bg-surface-alt dark:border-outline dark:text-on-surface dark:hover:bg-surface-alt/75 dark:hover:text-on-surface-strong " +
        "focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary";
        
    /// <summary>
    /// Gets the CSS classes for standard pagination links.
    /// Extends the base link style and adds rounded corners to first and last items.
    /// </summary>
    public override string Link => $"{BaseLinkStyle} first:rounded-l-theme last:rounded-r-theme";

    /// <summary>
    /// Gets the CSS classes for the current/active pagination link.
    /// Includes distinct styling to highlight the current page with primary colors.
    /// </summary>
    public override string LinkCurrent => 
        "flex items-center justify-center px-3 h-8 text-on-primary border border-primary bg-primary rounded no-underline " + // Added no-underline
        // "hover:bg-primary/90 hover:text-on-primary " + // Current should not have hover changes generally
        "dark:border-primary dark:bg-primary dark:text-on-primary " +
        "focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary " +
        "aria-[current=page]:z-10 aria-[current=page]:ring-2 aria-[current=page]:ring-primary"; // Style for aria-current
        
    /// <summary>
    /// Gets the CSS classes for disabled pagination links (like Previous when on first page).
    /// Extends the base link style but adds reduced opacity and disabled cursor indicator.
    /// </summary>
    public override string LinkDisabled => 
        $"{BaseLinkStyle} cursor-not-allowed opacity-50 first:rounded-l-theme last:rounded-r-theme";

    /// <summary>
    /// Gets the CSS classes for ellipsis elements in the pagination.
    /// Styled similarly to links but without hover effects and with select-none to prevent text selection.
    /// </summary>
    public override string Ellipsis => 
        "flex items-center justify-center px-3 h-8 leading-tight " + 
        "text-on-surface bg-surface border border-outline " +
        "dark:bg-surface-alt dark:border-outline dark:text-on-surface select-none"; // Added select-none
}
