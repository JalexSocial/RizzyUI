namespace RizzyUI.Components.RzQuickReference.Styling;

/// <summary> Provides default styles for RzQuickReference. </summary>
public class DefaultRzQuickReferenceStyles : RzStylesBase.RzQuickReferenceStylesBase // Not sealed
{
    public DefaultRzQuickReferenceStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => $"text-{Theme.Light.OnSurfaceStrong.TailwindClassName}"; // Base text color

    /// <inheritdoc />
    public override string Title => "mb-4 font-bold";

    /// <inheritdoc />
    public override string List => "flex flex-col gap-2";

    /// <inheritdoc />
    public override string ListItem => ""; // Base LI, indentation added dynamically

    /// <inheritdoc />
    public override string Link => ""; // Base link, selected state handled by Alpine :class

    /// <inheritdoc />
    public override string LinkSelected => "font-bold"; // Class added by Alpine when selected

    /// <inheritdoc />
    public override string GetIndentationCss(HeadingLevel level, HeadingLevel minLevel)
    {
        // Calculate relative level (0 = minLevel, 1 = minLevel+1, etc.)
        var relativeLevel = (int)level - (int)minLevel;
        return relativeLevel switch
        {
            0 => "ml-0",
            1 => "ml-4",
            2 => "ml-8",
            3 => "ml-12", // H4 if min is H1, or H5 if min is H2
            _ => "ml-0" // Default or levels beyond H4/H5
        };
    }
}

/// <summary> Provides default styles for RzQuickReferenceContainer. </summary>
public class DefaultRzQuickReferenceContainerStyles : RzStylesBase.RzQuickReferenceContainerStylesBase // Not sealed
{
    public DefaultRzQuickReferenceContainerStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => ""; // No base styles for the container usually
}