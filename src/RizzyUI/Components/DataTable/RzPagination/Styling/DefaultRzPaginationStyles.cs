
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzPagination component.
/// </summary>
public class DefaultRzPaginationStyles : RzStylesBase.RzPaginationStylesBase
{
    public DefaultRzPaginationStyles(RzTheme theme) : base(theme)
    {
    }

    public override string Container => "flex justify-center items-center py-2"; 

    public override string List => "inline-flex items-center gap-1 text-sm rounded-theme"; 

    private string BaseLinkStyle => 
        "flex items-center justify-center px-3 h-8 leading-tight no-underline " +
        "text-on-surface bg-surface border border-outline " +
        "hover:bg-surface-alt hover:text-on-surface-strong " +
        "dark:bg-surface-alt dark:border-outline dark:text-on-surface dark:hover:bg-surface-alt/75 dark:hover:text-on-surface-strong " +
        "focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary";
        
    public override string Link => $"{BaseLinkStyle} first:rounded-l-theme last:rounded-r-theme";

    public override string LinkCurrent => 
        "flex items-center justify-center px-3 h-8 text-on-primary border border-primary bg-primary no-underline " + // Added no-underline
        // "hover:bg-primary/90 hover:text-on-primary " + // Current should not have hover changes generally
        "dark:border-primary dark:bg-primary dark:text-on-primary " +
        "focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary " +
        "aria-[current=page]:z-10 aria-[current=page]:ring-2 aria-[current=page]:ring-primary"; // Style for aria-current
        
    public override string LinkDisabled => 
        $"{BaseLinkStyle} cursor-not-allowed opacity-50 first:rounded-l-theme last:rounded-r-theme";

    public override string Ellipsis => 
        "flex items-center justify-center px-3 h-8 leading-tight " + 
        "text-on-surface bg-surface border border-outline " +
        "dark:bg-surface-alt dark:border-outline dark:text-on-surface select-none"; // Added select-none
}