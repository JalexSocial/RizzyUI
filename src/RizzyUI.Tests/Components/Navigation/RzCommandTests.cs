using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzCommandTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCommandTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzCommand_RendersDataSlotAriaAndAlpineAttributes()
    {
        var cut = Render<RzCommand>(p => p
            .Add(x => x.Loop, true)
            .Add(x => x.ShouldFilter, false)
            .Add(x => x.ServerFiltering, true)
            .Add(x => x.FetchTrigger, FetchTrigger.OnOpen)
            .Add(x => x.AriaLabel, "Command palette"));

        var root = cut.Find("[data-slot='command']");
        Assert.Equal("rzCommand", root.GetAttribute("x-data"));
        Assert.Equal(cut.Instance.Id, root.GetAttribute("data-alpine-root"));
        Assert.Equal("true", root.GetAttribute("data-loop"));
        Assert.Equal("false", root.GetAttribute("data-should-filter"));
        Assert.Equal("on-open", root.GetAttribute("data-fetch-trigger"));
        Assert.Equal("Command palette", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void RzCommand_InlineItemsSerializeWhenItemsUrlMissing()
    {
        var items = new ICommandItemData[]
        {
            new CommandItemData { Value = "new", Name = "New file" }
        };

        var cut = Render<RzCommand>(p => p.Add(x => x.Items, items));

        var script = cut.Find($"script#{cut.Instance.Id}-data");
        Assert.Equal("application/json", script.GetAttribute("type"));
        Assert.Contains("\"value\":\"new\"", script.TextContent);
    }

    [Fact]
    public void RzCommand_WhenItemsUrlProvided_DoesNotRenderInlineJson()
    {
        var cut = Render<RzCommand>(p => p
            .Add(x => x.ItemsUrl, "/api/commands")
            .Add(x => x.Items, [new CommandItemData { Value = "x", Name = "X" }]));

        Assert.Empty(cut.FindAll($"script#{cut.Instance.Id}-data"));
        var root = cut.Find("[data-slot='command']");
        Assert.Equal("/api/commands", root.GetAttribute("data-items-url"));
    }
}
