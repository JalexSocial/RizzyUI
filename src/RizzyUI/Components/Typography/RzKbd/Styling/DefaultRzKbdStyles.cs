
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the <see cref="RzKbd"/> component.
/// </summary>
public class DefaultRzKbdStyles : RzStylesBase.RzKbdStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzKbdStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzKbdStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Kbd =>
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none " +
        "[&_svg:not([class*='size-'])]:size-3 " +
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10";
}