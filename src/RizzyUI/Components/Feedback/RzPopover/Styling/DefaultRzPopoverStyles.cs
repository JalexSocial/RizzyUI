
// src/RizzyUI/Components/Feedback/RzPopover/Styling/DefaultRzPopoverStyles.cs
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzPopover component.
/// </summary>
public class DefaultRzPopoverStyles : RzStylesBase.RzPopoverStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzPopoverStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzPopoverStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "popover relative inline-block text-left";

    /// <inheritdoc />
    public override string TriggerWrapper => "inline-flex";

    /// <inheritdoc />
    public override string ContentContainer =>
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";
}