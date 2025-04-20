namespace RizzyUI;

/// <summary> Provides default styles for RzCheckboxGroup. </summary>
public class DefaultRzCheckboxGroupStyles : RzStylesBase.RzCheckboxGroupStylesBase
{

    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzCheckboxGroupStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCheckboxGroupStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "flex flex-wrap gap-4"; // Base container

    /// <inheritdoc />
    public override string GetOrientationCss(Orientation orientation)
    {
        return orientation switch
        {
            Orientation.Horizontal => "flex-row items-center", // Keep gap-4 from Container
            Orientation.Vertical => "flex-col", // Keep gap-4 from Container, but vertical
            _ => GetOrientationCss(Orientation.Vertical)
        };
    }
}

/// <summary> Provides default styles for RzCheckboxGroupItem. </summary>
public class DefaultRzCheckboxGroupItemStyles : RzStylesBase.RzCheckboxGroupItemStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzCheckboxGroupItemStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCheckboxGroupItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Label => "inline-flex items-center cursor-pointer"; // Added cursor-pointer

    /// <inheritdoc />
    public override string CheckboxWrapper => "relative";

    /// <inheritdoc />
    // Note: text-primary-500 is hardcoded here, ideally map to theme.Primary or similar if needed for specific check color
    public override string CheckboxInput =>
        $"size-4 rounded-theme-sm border border-outline text-primary-500 focus:border-primary-500 focus:ring-3 focus:ring-primary/50 dark:bg-surface-alt dark:ring-offset-surface dark:checked:border-transparent dark:checked:bg-primary dark:focus:border-primary";

    /// <inheritdoc />
    public override string IconContainer =>
        "absolute inset-0 flex items-center justify-center text-on-primary"; // Text color for icon on checked bg

    /// <inheritdoc />
    public override string TitleSpan => "ml-2";

    /// <inheritdoc />
    public override string GetIconVisibilityCss(bool isChecked)
    {
        return isChecked ? "" : "hidden";
    }
}

/// <summary> Provides default styles for RzCheckboxGroupField. </summary>
public class DefaultRzCheckboxGroupFieldStyles : RzStylesBase.RzCheckboxGroupFieldStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzCheckboxGroupFieldStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzCheckboxGroupFieldStyles(RzTheme theme) : base(theme)
    {
    }

    // This field usually relies on the RzField component for its structure.
    /// <inheritdoc />
    public override string Field => ""; // Handled by RzFieldStylesBase

    /// <inheritdoc />
    public override string GroupWithinField => "my-3"; // Default margin for the group inside the field
}