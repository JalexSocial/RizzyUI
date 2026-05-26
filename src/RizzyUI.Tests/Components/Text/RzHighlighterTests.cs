using Bunit;

namespace RizzyUI.Tests.Components.Text;

public class RzHighlighterTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzHighlighterTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_EmitsExpectedMarkupContract()
    {
        var cut = Render<RzHighlighter>(p => p
            .Add(x => x.Id, "hl-default")
            .AddChildContent("Important text"));

        var root = cut.Find("span#hl-default[data-slot='highlighter']");
        Assert.Null(root.GetAttribute("data-action"));

        var alpineRoot = cut.Find("div[data-alpine-root='hl-default']");
        Assert.Equal("highlight", alpineRoot.GetAttribute("data-action"));
        Assert.Equal("var(--highlight-1)", alpineRoot.GetAttribute("data-color"));
        Assert.Equal("1.5", alpineRoot.GetAttribute("data-stroke-width"));
        Assert.Equal("600", alpineRoot.GetAttribute("data-animation-duration"));
        Assert.Equal("2", alpineRoot.GetAttribute("data-iterations"));
        Assert.Equal("2", alpineRoot.GetAttribute("data-padding"));
        Assert.Equal("true", alpineRoot.GetAttribute("data-multiline"));
        Assert.Equal("false", alpineRoot.GetAttribute("data-start-on-view"));
        Assert.Equal("-10%", alpineRoot.GetAttribute("data-view-margin"));
        Assert.Equal("rzHighlighter", alpineRoot.GetAttribute("x-data"));
        Assert.NotNull(alpineRoot.GetAttribute("data-assets"));
        Assert.NotNull(alpineRoot.GetAttribute("data-nonce"));

        var content = cut.Find("span[data-slot='content'][x-ref='target']");
        Assert.Equal("Important text", content.TextContent.Trim());
    }

    [Fact]
    public void ParameterMapping_EmitsConfiguredDataAttributes()
    {
        var cut = Render<RzHighlighter>(p => p
            .Add(x => x.Action, HighlighterAction.Underline)
            .Add(x => x.Color, "#87cefa")
            .Add(x => x.StrokeWidth, 2.25)
            .Add(x => x.AnimationDuration, 900)
            .Add(x => x.Iterations, 4)
            .Add(x => x.Padding, 6)
            .Add(x => x.Multiline, false)
            .Add(x => x.StartOnView, true)
            .Add(x => x.ViewMargin, "-15%"));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("underline", alpineRoot.GetAttribute("data-action"));
        Assert.Equal("#87cefa", alpineRoot.GetAttribute("data-color"));
        Assert.Equal("2.25", alpineRoot.GetAttribute("data-stroke-width"));
        Assert.Equal("900", alpineRoot.GetAttribute("data-animation-duration"));
        Assert.Equal("4", alpineRoot.GetAttribute("data-iterations"));
        Assert.Equal("6", alpineRoot.GetAttribute("data-padding"));
        Assert.Equal("false", alpineRoot.GetAttribute("data-multiline"));
        Assert.Equal("true", alpineRoot.GetAttribute("data-start-on-view"));
        Assert.Equal("-15%", alpineRoot.GetAttribute("data-view-margin"));
    }

    [Fact]
    public void ClassMergingAndAdditionalAttributes_AreAppliedToRoot()
    {
        var cut = Render<RzHighlighter>(p => p
            .AddUnmatched("class", "custom-highlight")
            .AddUnmatched("data-testid", "hl")
            .AddChildContent("A"));

        var root = cut.Find("[data-slot='highlighter']");
        Assert.Contains("inline-block", root.ClassList);
        Assert.Contains("custom-highlight", root.ClassList);
        Assert.Equal("hl", root.GetAttribute("data-testid"));
    }

    [Fact]
    public void EdgeCaseInputs_AreNormalized()
    {
        var cut = Render<RzHighlighter>(p => p
            .Add(x => x.Color, "")
            .Add(x => x.StrokeWidth, 0)
            .Add(x => x.AnimationDuration, -50)
            .Add(x => x.Iterations, 0)
            .Add(x => x.Padding, -5)
            .Add(x => x.ViewMargin, (string?)null)
            .Add(x => x.ComponentAssetKeys, []));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("var(--highlight-1)", alpineRoot.GetAttribute("data-color"));
        Assert.Equal("0.1", alpineRoot.GetAttribute("data-stroke-width"));
        Assert.Equal("0", alpineRoot.GetAttribute("data-animation-duration"));
        Assert.Equal("1", alpineRoot.GetAttribute("data-iterations"));
        Assert.Equal("0", alpineRoot.GetAttribute("data-padding"));
        Assert.Equal("-10%", alpineRoot.GetAttribute("data-view-margin"));
        Assert.Equal("[]", alpineRoot.GetAttribute("data-assets"));
    }

    [Fact]
    public void DoesNotEmitFocusableOrInteractiveMarkupByDefault()
    {
        var cut = Render<RzHighlighter>(p => p.AddChildContent("Plain text"));
        var root = cut.Find("[data-slot='highlighter']");

        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("tabindex"));
        Assert.Null(root.GetAttribute("aria-expanded"));

        var markup = cut.Markup;
        Assert.DoesNotContain("@on", markup, StringComparison.OrdinalIgnoreCase);
    }
}
