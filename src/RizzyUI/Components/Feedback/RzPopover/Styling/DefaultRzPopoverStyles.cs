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
    public override string Container => "relative inline-block text-left";
}

/// <summary>
/// Provides the default styles for the PopoverTrigger component.
/// </summary>
public class DefaultPopoverTriggerStyles : RzStylesBase.PopoverTriggerStylesBase
{
    public DefaultPopoverTriggerStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string TriggerWrapper => "inline-flex";
}

/// <summary>
/// Provides the default styles for the PopoverContent component.
/// </summary>
public class DefaultPopoverContentStyles : RzStylesBase.PopoverContentStylesBase
{
    public DefaultPopoverContentStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string ContentContainer =>
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none";
}