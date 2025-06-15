namespace RizzyUI;

/// <summary>
/// Default Tailwind / tailwindcss-animate styles for <c>RzNavigationMenu</c>
/// and its child components. Matches shadcn/ui behaviour while honouring
/// RizzyUI’s coding standards (root components prefixed with Rz; nested
/// components un-prefixed).
/// </summary>
public sealed class DefaultRzNavigationMenuStyles
    : RzStylesBase.RzNavigationMenuStylesBase
{
    public DefaultRzNavigationMenuStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Container =>
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center";

    /// <inheritdoc/>
    public override string List =>
        "group flex flex-1 list-none items-center justify-center gap-1";

    /// <inheritdoc/>
    public override string Item => "relative";

    /// <inheritdoc/>
    public override string Trigger =>
        "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 "
      + "text-sm font-medium bg-background hover:bg-accent hover:text-accent-foreground "
      + "focus:bg-accent focus:text-accent-foreground "
      + "data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground "
      + "disabled:pointer-events-none disabled:opacity-50 "
      + "transition-[color,box-shadow] outline-none "
      + "focus-visible:ring-[3px] focus-visible:ring-ring/50";

    /// <inheritdoc/>
    public override string Link =>
        "[&_svg:not([class*='text-'])]:text-muted-foreground "
      + "flex-col gap-1 p-2 [&_svg:not([class*='size-'])]:size-4 "
      + "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 "
      + "text-sm font-medium bg-background hover:bg-accent hover:text-accent-foreground "
      + "focus:bg-accent focus:text-accent-foreground "
      + "data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground "
      + "disabled:pointer-events-none disabled:opacity-50 "
      + "transition-[color,box-shadow] outline-none "
      + "focus-visible:ring-[3px] focus-visible:ring-ring/50";

    /// <inheritdoc/>
    public override string Content =>
        // Tailwind-animate classes triggered by data-motion / data-state
        "rounded-md border bg-popover text-popover-foreground shadow "
      + "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out "
      + "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out "
      + "data-[motion=from-end]:slide-in-from-right-52 "
      + "data-[motion=from-start]:slide-in-from-left-52 "
      + "data-[motion=to-end]:slide-out-to-right-52 "
      + "data-[motion=to-start]:slide-out-to-left-52 "
      + "outline-none focus-visible:ring-0 will-change-[opacity,transform]";

    /// <inheritdoc/>
    public override string Viewport =>
        "absolute left-0 top-0 "       
        + "mt-1.5 overflow-hidden "
        + "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 "
        + "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 "
        + "duration-200 will-change-[opacity,transform]";

    /// <inheritdoc/>
    public override string Indicator =>
        "absolute bottom-0 left-0 h-[2px] bg-primary "
      + "transition-[width,left] duration-300 "
      + "data-[state=hidden]:w-0 data-[state=hidden]:opacity-0";
}
