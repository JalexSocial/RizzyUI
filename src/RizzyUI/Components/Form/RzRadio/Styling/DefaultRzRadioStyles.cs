
namespace RizzyUI;

/// <summary> Provides default styles for RzRadioGroup. </summary>
public class DefaultRzRadioGroupStyles : RzStylesBase.RzRadioGroupStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzRadioGroupStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzRadioGroupStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "grid gap-3"; // Matches kitchen sink form radio group layout

    /// <inheritdoc />
    public override string GetGridColumnsCss(Orientation orientation, int itemCount)
    {
        // Kitchen sink example shows vertical layout for radio buttons.
        // Horizontal might need more specific column counts if used.
        return orientation switch
        {
            Orientation.Horizontal => $"grid-cols-{Math.Min(itemCount, 4)}", // Example: max 4 cols for horizontal
            Orientation.Vertical => "grid-cols-1",
            _ => GetGridColumnsCss(Orientation.Vertical, itemCount)
        };
    }
}

/// <summary> Provides default styles for RzRadioGroupItem. </summary>
public class DefaultRzRadioGroupItemStyles : RzStylesBase.RzRadioGroupItemStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzRadioGroupItemStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzRadioGroupItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string LabelWrapper => "flex items-center gap-2 cursor-pointer"; // Matches kitchen sink label structure

    /// <inheritdoc />
    // Kitchen sink uses native radio appearance, but RizzyUI uses custom.
    // This style is for the hidden input, the visual part is IconContainer and ClickableContainer.
    public override string RadioInput => "appearance-none peer absolute"; 

    /// <inheritdoc />
    // Styling for the custom radio button circle and checkmark
    public override string IconContainer =>
        "relative size-4 shrink-0 rounded-full border border-input shadow-xs text-primary focus-visible:border-ring focus-visible:ring-ring/50 peer-checked:border-primary peer-checked:before:bg-primary peer-checked:before:content-[''] peer-checked:before:absolute peer-checked:before:top-1/2 peer-checked:before:left-1/2 peer-checked:before:-translate-x-1/2 peer-checked:before:-translate-y-1/2 peer-checked:before:size-2 peer-checked:before:rounded-full dark:bg-input/30 dark:peer-checked:border-primary dark:peer-checked:before:bg-primary";

    /// <inheritdoc />
    public override string ClickableContainer => "flex-1"; // Container for text content

    /// <inheritdoc />
    public override string ContentWrapper => "flex items-center gap-2";

    /// <inheritdoc />
    public override string LeadingIconContainer => "text-muted-foreground size-4"; // For optional icon next to label

    /// <inheritdoc />
    public override string TextContainer => "grid gap-0.5"; // For label and description

    /// <inheritdoc />
    public override string LabelText => "font-normal text-sm peer-disabled:opacity-50"; // Matches kitchen sink label text

    /// <inheritdoc />
    public override string DescriptionText => "text-xs text-muted-foreground peer-disabled:opacity-50"; // For optional description
}

/// <summary> Provides default styles for RzRadioGroupField. </summary>
public class DefaultRzRadioGroupFieldStyles : RzStylesBase.RzRadioGroupFieldStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzRadioGroupFieldStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzRadioGroupFieldStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Field => ""; // Handled by RzField component

    /// <inheritdoc />
    public override string GroupWithinField => "mt-1"; // Spacing for the group within the field
}