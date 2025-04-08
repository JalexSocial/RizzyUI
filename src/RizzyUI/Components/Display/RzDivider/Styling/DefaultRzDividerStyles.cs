namespace RizzyUI;

/// <summary> Provides default styles for RzDivider. </summary>
public class DefaultRzDividerStyles : RzStylesBase.RzDividerStylesBase 
{
    public DefaultRzDividerStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Divider => $"my-8 py-3 flex items-center text-sm text-outline"; // Use semantic name

    /// <inheritdoc/>
    public override string GetStyleCss(DividerStyle style) => style switch
    {
        DividerStyle.Solid => $"border-solid border-t border-outline", // Use semantic name
        DividerStyle.Dashed => $"border-dashed border-t border-outline",
        DividerStyle.Dotted => $"border-dotted border-t border-outline",
        _ => GetStyleCss(DividerStyle.Solid)
    };

    /// <inheritdoc/>
    public override string GetAlignmentCss(Align alignment, DividerStyle style)
    {
        var styleClass = style switch {
             DividerStyle.Solid => "solid", DividerStyle.Dashed => "dashed", DividerStyle.Dotted => "dotted", _ => "solid"
        };
        var borderStyleClass = $"border-{styleClass}";
        // Use semantic name for border color directly
        var borderColorClass = $"border-outline";
        var darkBorderColorClass = $"dark:border-outline"; // Assuming dark outline uses same variable

        return alignment switch
        {
            Align.Start => $"after:flex-1 after:border-t after:{borderStyleClass} after:{borderColorClass} after:ms-6 {darkBorderColorClass}",
            Align.Center => $"before:flex-1 before:border-t before:{borderStyleClass} before:{borderColorClass} before:me-6 {darkBorderColorClass} after:flex-1 after:border-t after:{borderStyleClass} after:{borderColorClass} after:ms-6 {darkBorderColorClass}",
            Align.End => $"before:flex-1 before:border-t before:{borderStyleClass} before:{borderColorClass} before:me-6 {darkBorderColorClass}",
            _ => GetAlignmentCss(Align.Center, style)
        };
    }
}