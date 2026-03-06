using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzCommandDialogTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCommandDialogTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzCommandDialog_RendersDialogAndCommandMarkupContract()
    {
        var cut = Render<RzCommandDialog>();

        Assert.Contains("rzDialog", cut.Markup, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("rzCommand", cut.Markup, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("sr-only", cut.Markup);
    }

    [Fact]
    public void RzCommandDialog_ForwardsFilteringAndLoopConfiguration()
    {
        var cut = Render<RzCommandDialog>(p => p
            .Add(x => x.ShouldFilter, false)
            .Add(x => x.Loop, true)
            .Add(x => x.SelectedValue, "docs")
            .Add(x => x.Open, true));

        Assert.Contains("data-should-filter=\"false\"", cut.Markup);
        Assert.Contains("data-loop=\"true\"", cut.Markup);
        Assert.Contains("data-selected-value=\"docs\"", cut.Markup);
    }

    [Fact]
    public void RzCommandDialog_GeneratesEventTriggerNameWhenMissing()
    {
        var cut = Render<RzCommandDialog>();
        Assert.StartsWith("show-command-dialog-", cut.Instance.EventTriggerName);
    }
}
