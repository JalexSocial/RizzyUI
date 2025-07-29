
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzCollapsible component family.
/// </summary>
public class DefaultRzCollapsibleStyles : RzStylesBase.RzCollapsibleStylesBase
{
    public DefaultRzCollapsibleStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Container => "group/collapsible";

    /// <inheritdoc />
    public override string Trigger => ""; // Trigger is often styled by its child content

    /// <inheritdoc />
    public override string Content => "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down";
}