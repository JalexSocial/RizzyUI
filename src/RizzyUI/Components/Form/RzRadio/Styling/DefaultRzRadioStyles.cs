namespace RizzyUI;

/// <summary> Provides default styles for RzRadioGroup. </summary>
public class DefaultRzRadioGroupStyles : RzStylesBase.RzRadioGroupStylesBase 
{
    public DefaultRzRadioGroupStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "grid gap-2 pt-3"; // Base grid layout

    /// <inheritdoc />
    public override string GetGridColumnsCss(Orientation orientation, int itemCount)
    {
        return orientation switch
        {
            Orientation.Horizontal => $"grid-cols-{itemCount}", // Dynamic columns for horizontal
            Orientation.Vertical => "grid-cols-1", // Single column for vertical
            _ => GetGridColumnsCss(Orientation.Vertical, itemCount)
        };
    }
}

/// <summary> Provides default styles for RzRadioGroupItem. </summary>
public class DefaultRzRadioGroupItemStyles : RzStylesBase.RzRadioGroupItemStylesBase 
{
    public DefaultRzRadioGroupItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string LabelWrapper => "group relative flex";

    /// <inheritdoc />
    public override string RadioInput => "opacity-0 peer absolute left-0 top-0 appearance-none"; // Hidden input

    /// <inheritdoc />
    // Styling for the checkmark circle indicator
    public override string IconContainer =>
        "z-1 text-primary text-xl opacity-0 absolute bottom-0 right-0 top-0 flex scale-50 cursor-pointer items-center px-4 transition peer-checked:scale-100 peer-checked:opacity-100";

    /// <inheritdoc />
    // Styling for the main visible container that gets border/bg on check/focus
    public override string ClickableContainer =>
        "group-hover:border-primary relative flex grow cursor-pointer rounded-borderRadius border border-outline p-4 peer-checked:bg-surface-alt peer-checked:border-primary dark:peer-checked:border-primary dark:peer-checked:bg-surface-alt dark:peer-checked:bg-opacity-10 peer-focus:ring peer-focus:ring-primary";

    /// <inheritdoc />
    public override string ContentWrapper => "flex";

    /// <inheritdoc />
    public override string LeadingIconContainer => "mr-2 text-2xl content-center";

    /// <inheritdoc />
    public override string TextContainer => "grow pr-8 text-sm"; // Padding right to avoid overlap with check icon

    /// <inheritdoc />
    public override string LabelText => "mb-1 block font-bold";

    /// <inheritdoc />
    public override string DescriptionText => "block text-on-surface";
}

/// <summary> Provides default styles for RzRadioGroupField. </summary>
public class DefaultRzRadioGroupFieldStyles : RzStylesBase.RzRadioGroupFieldStylesBase 
{
    public DefaultRzRadioGroupFieldStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Field => ""; // Handled by RzField component

    /// <inheritdoc />
    public override string GroupWithinField => ""; // No extra styling needed for the group within the field by default
}