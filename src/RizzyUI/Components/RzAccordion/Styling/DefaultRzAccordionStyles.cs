namespace RizzyUI.Components.RzAccordion.Styling;

public class DefaultRzAccordionStyles : RzStylesBase.RzAccordionStylesBase
{
    public DefaultRzAccordionStyles(RzTheme theme) : base(theme)
    {
    }

    public override string Container =>
        "w-full divide-y divide-outline overflow-hidden rounded-borderRadius border border-outline bg-surface-alt/40 text-on-surface dark:divide-outline";
}