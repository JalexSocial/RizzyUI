
namespace RizzyUI;

/// <summary> Provides default styles for RzCheckboxGroup. </summary>
public class DefaultRzCheckboxGroupStyles : RzStylesBase.RzCheckboxGroupStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCheckboxGroupStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCheckboxGroupStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "flex flex-wrap gap-3"; // Matches kitchen sink form checkbox group layout

    /// <inheritdoc />
    public override string GetOrientationCss(Orientation orientation)
    {
        return orientation switch
        {
            Orientation.Horizontal => "flex-row items-center",
            Orientation.Vertical => "flex-col", // Matches kitchen sink form fieldset for checkboxes
            _ => GetOrientationCss(Orientation.Vertical)
        };
    }
}

/// <summary> Provides default styles for RzCheckboxGroupItem. </summary>
public class DefaultRzCheckboxGroupItemStyles : RzStylesBase.RzCheckboxGroupItemStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCheckboxGroupItemStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCheckboxGroupItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Label => "flex items-center gap-3 cursor-pointer"; // Matches kitchen sink label structure

    /// <inheritdoc />
    public override string CheckboxWrapper => "relative"; // No specific wrapper in kitchen sink, but useful for icon positioning

    /// <inheritdoc />
    // This is for the RzInputCheckbox which is the actual input element
    public override string CheckboxInput =>
        "appearance-none border-input dark:bg-input/30 checked:bg-primary dark:checked:bg-primary checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"; // Matches kitchen sink input[type='checkbox']

    /// <inheritdoc />
    public override string IconContainer =>
        "absolute inset-0 flex items-center justify-center pointer-events-none"; // For checkmark icon overlay, if used instead of pseudo-element

    /// <inheritdoc />
    public override string TitleSpan => "text-sm leading-none font-medium select-none peer-disabled:opacity-50"; // Matches kitchen sink label text style

    /// <inheritdoc />
    public override string GetIconVisibilityCss(bool isChecked)
    {
        // The checkmark is typically part of the :checked:after pseudo-element in the kitchen sink style.
        // If using an SVG icon here, it would be:
        return isChecked ? "opacity-100" : "opacity-0";
    }
}

/// <summary> Provides default styles for RzCheckboxGroupField. </summary>
public class DefaultRzCheckboxGroupFieldStyles : RzStylesBase.RzCheckboxGroupFieldStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzCheckboxGroupFieldStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCheckboxGroupFieldStyles(RzTheme theme) : base(theme)
    {
    }

    // This field usually relies on the RzField component for its structure.
    /// <inheritdoc />
    public override string Field => ""; // Handled by RzFieldStylesBase

    /// <inheritdoc />
    public override string GroupWithinField => "flex flex-col gap-2"; // Matches kitchen sink fieldset for checkboxes
}