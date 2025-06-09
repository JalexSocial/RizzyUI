
namespace RizzyUI;

/// <summary>
/// Provides default styles for RzNavigationMenu and its child components.
/// </summary>
public sealed class DefaultRzNavigationMenuStyles : RzStylesBase.RzNavigationMenuStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzNavigationMenuStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzNavigationMenuStyles(RzTheme theme) : base(theme)
    {
    }
    
    /// <inheritdoc />
    public override string Container => "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center";
    
    /// <inheritdoc />
    public override string List => "group flex flex-1 list-none items-center justify-center gap-1";
    
    /// <inheritdoc />
    public override string Item => "relative";
    
    /// <inheritdoc />
    public override string Trigger => "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 focus:outline-none";
    
    /// <inheritdoc />
    public override string Link => "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 focus:outline-none";
    
    /// <inheritdoc />
    public override string Content => "absolute top-0 left-0 w-auto animate-in fade-in zoom-in-90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";

    /// <inheritdoc />
    public override string Viewport => "absolute left-0 top-full flex justify-center w-[--radix-navigation-menu-viewport-width] h-[--radix-navigation-menu-viewport-height] perspective-[2000px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg";
    
    /// <inheritdoc />
    public override string Indicator => "absolute top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in transition-all duration-200 ease-out after:bg-border after:size-2 after:rotate-45 after:relative after:-top-1";
}