namespace RizzyUI;

/// <summary> Provides default styles for RzFormSection. </summary>
public class DefaultRzFormSectionStyles : RzStylesBase.RzFormSectionStylesBase
{
    /// <inheritdoc />
    public DefaultRzFormSectionStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => ""; // Base container style is determined by layout method

    /// <inheritdoc />
    public override string DescriptionContainer => ""; // Determined by layout method

    /// <inheritdoc />
    public override string Title =>
        "text-base/7 font-semibold text-foreground"; // Adjusted line height

    /// <inheritdoc />
    public override string Description => "text-sm text-foreground";

    /// <inheritdoc />
    public override string ContentContainer => ""; // Determined by layout method

    /// <inheritdoc />
    public override string GetLayoutCss(SectionLayout layout)
    {
        return layout switch
        {
            SectionLayout.TwoColumn => "md:flex md:space-x-5",
            SectionLayout.Stacked => "mb-5",
            _ => GetLayoutCss(SectionLayout.TwoColumn)
        };
    }

    /// <inheritdoc />
    public override string GetDescriptionLayoutCss(SectionLayout layout)
    {
        return layout switch
        {
            SectionLayout.TwoColumn => "md:w-1/3 md:flex-none",
            SectionLayout.Stacked => "pb-5 mb-10 border-b border-outline", // Use theme border
            _ => GetDescriptionLayoutCss(SectionLayout.TwoColumn)
        };
    }

    /// <inheritdoc />
    public override string GetContentLayoutCss(SectionLayout layout)
    {
        return layout switch
        {
            SectionLayout.TwoColumn => "space-y-6 md:w-1/2", // space-y might need review depending on RzField margins
            SectionLayout.Stacked => "",
            _ => GetContentLayoutCss(SectionLayout.TwoColumn)
        };
    }
}