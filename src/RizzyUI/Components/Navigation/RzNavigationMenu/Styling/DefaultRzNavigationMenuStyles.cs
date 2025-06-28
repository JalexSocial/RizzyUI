
namespace RizzyUI;

/// <summary>
/// Default Tailwind / tailwindcss-animate styles for <c>RzNavigationMenu</c>
/// and its child components. Matches shadcn/ui behaviour while honouring
/// RizzyUI's coding standards (root components prefixed with Rz; nested
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
        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 "
      + "text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground "
      + "focus:bg-accent focus:text-accent-foreground focus:outline-none "
      + "disabled:pointer-events-none disabled:opacity-50 "
      + "data-[state=open]:bg-accent/50";

    /// <inheritdoc/>
    public override string Link => "";

    /// <inheritdoc/>
    public override string Content =>
        "absolute left-0 top-full z-50 mt-1.5 min-w-[8rem] overflow-hidden rounded-md border "
      + "bg-popover text-popover-foreground shadow-lg "
      + "will-change-[opacity,transform] "
      + "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out "
      + "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out "
      + "data-[motion=from-end]:slide-in-from-right-52 "
      + "data-[motion=from-start]:slide-in-from-left-52 "
      + "data-[motion=to-end]:slide-out-to-right-52 "
      + "data-motion=to-start]:slide-out-to-left-52 "
      + "data-[motion=fade-in]:animate-in data-[motion=fade-in]:fade-in-0 "
      + "data-[motion=fade-out]:animate-out data-[motion=fade-out]:fade-out-0 "
      + "duration-200";
}