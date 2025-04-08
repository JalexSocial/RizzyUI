namespace RizzyUI;

/// <summary> Provides default styles for RzDropdown. </summary>
public class DefaultRzDropdownStyles : RzStylesBase.RzDropdownStylesBase
{
    public DefaultRzDropdownStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => ""; // Root container has no specific style by default

    /// <inheritdoc />
    public override string RelativeWrapper => "relative inline-block";

    /// <inheritdoc />
    public override string TriggerWrapper => "inline-flex items-center justify-center space-x-2";

    /// <inheritdoc />
    public override string MenuContainer => "z-60 absolute w-64 rounded-borderRadius shadow-xl dark:shadow-gray-900";

    /// <inheritdoc />
    public override string MenuInnerContainer =>
        $"border border-outline divide-y divide-outline rounded-borderRadius bg-surface ring-black dark:divide-outline"; // Simplified ring
}

/// <summary> Provides default styles for RzDropdownSection. </summary>
public class DefaultRzDropdownSectionStyles : RzStylesBase.RzDropdownSectionStylesBase
{
    public DefaultRzDropdownSectionStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Section => "space-y-1 p-2.5";
}

/// <summary> Provides default styles for RzDropdownMenuItem. </summary>
public class DefaultRzDropdownMenuItemStyles : RzStylesBase.RzDropdownMenuItemStylesBase
{
    public DefaultRzDropdownMenuItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string MenuItem =>
        $"group flex items-center justify-between space-x-2 rounded-borderRadius cursor-pointer border border-transparent px-2.5 py-2 text-sm font-medium text-on-surface hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-on-surface-strong focus-visible:outline-hidden dark:hover:bg-surface-alt dark:focus-visible:bg-primary/10 dark:focus-visible:text-on-surface-strong";

    /// <inheritdoc />
    public override string IconSpan => "text-xl";

    /// <inheritdoc />
    public override string Icon => "size-5 flex-none opacity-25 group-hover:opacity-50";

    /// <inheritdoc />
    public override string TitleSpan => "grow";

    /// <inheritdoc />
    public override string CountDiv =>
        "inline-flex rounded-full border px-1.5 py-0.5 text-xs font-semibold border-outline"; // Added border color
}