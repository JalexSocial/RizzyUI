using Bunit;

namespace RizzyUI.Tests.Components.Text;

public class RzAuroraTextTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAuroraTextTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_EmitsExpectedSsrContract()
    {
        var cut = Render<RzAuroraText>(p => p
            .Add(x => x.Id, "aurora-default")
            .AddChildContent("beautiful"));

        var root = cut.Find("span#aurora-default[data-slot='aurora-text']");
        var sr = cut.Find("[data-slot='sr-text']");
        var visual = cut.Find("[data-slot='text']");

        Assert.Contains("relative", root.ClassList);
        Assert.Contains("inline-block", root.ClassList);
        Assert.Equal("beautiful", sr.TextContent.Trim());
        Assert.Equal("beautiful", visual.TextContent.Trim());
        Assert.Equal("true", visual.GetAttribute("aria-hidden"));

        Assert.DoesNotContain("x-data", cut.Markup);
        Assert.DoesNotContain("data-alpine-root", cut.Markup);
        Assert.DoesNotContain("data-assets", cut.Markup);
        Assert.DoesNotContain("data-nonce", cut.Markup);
    }

    [Fact]
    public void DefaultStyle_ContainsExpectedGradientAndDuration()
    {
        var cut = Render<RzAuroraText>(p => p.AddChildContent("aurora"));

        var visual = cut.Find("[data-slot='text']");
        var style = visual.GetAttribute("style");

        Assert.NotNull(style);
        Assert.Contains("linear-gradient(135deg, #FF0080, #7928CA, #0070F3, #38bdf8, #FF0080)", style);
        Assert.Contains("animation-duration: 10s", style);
        Assert.Contains("-webkit-background-clip: text", style);
    }

    [Fact]
    public void CustomColorsAndSpeed_AreApplied()
    {
        var cut = Render<RzAuroraText>(p => p
            .Add(x => x.Colors, ["#111111", "#222222"])
            .Add(x => x.Speed, 2d)
            .AddChildContent("aurora"));

        var style = cut.Find("[data-slot='text']").GetAttribute("style");

        Assert.NotNull(style);
        Assert.Contains("#111111, #222222, #111111", style);
        Assert.Contains("animation-duration: 5s", style);
    }

    [Fact]
    public void EmptyColorsAndNonPositiveSpeed_FallBackSafely()
    {
        var cut = Render<RzAuroraText>(p => p
            .Add(x => x.Colors, [])
            .Add(x => x.Speed, 0d)
            .AddChildContent("aurora"));

        var style = cut.Find("[data-slot='text']").GetAttribute("style");

        Assert.NotNull(style);
        Assert.Contains("#FF0080, #7928CA, #0070F3, #38bdf8, #FF0080", style);
        Assert.Contains("animation-duration: 10s", style);
    }

    [Fact]
    public void AriaLabel_SetsLabelAndOmitsScreenReaderCopy()
    {
        var cut = Render<RzAuroraText>(p => p
            .Add(x => x.AriaLabel, "Custom Label")
            .AddChildContent("✨"));

        var root = cut.Find("[data-slot='aurora-text']");
        Assert.Equal("Custom Label", root.GetAttribute("aria-label"));
        Assert.Empty(cut.FindAll("[data-slot='sr-text']"));
    }

    [Fact]
    public void DecorativeMode_HidesRootAndOmitsScreenReaderCopy()
    {
        var cut = Render<RzAuroraText>(p => p
            .Add(x => x.Decorative, true)
            .AddChildContent("✨"));

        var root = cut.Find("[data-slot='aurora-text']");
        Assert.Equal("true", root.GetAttribute("aria-hidden"));
        Assert.Empty(cut.FindAll("[data-slot='sr-text']"));
    }

    [Fact]
    public void AdditionalAttributes_ArePassedThroughAndClassMerges()
    {
        var cut = Render<RzAuroraText>(p => p
            .AddUnmatched("class", "custom-class")
            .AddUnmatched("data-test-id", "aurora")
            .AddChildContent("text"));

        var root = cut.Find("[data-slot='aurora-text']");
        Assert.Contains("custom-class", root.ClassList);
        Assert.Contains("inline-block", root.ClassList);
        Assert.Equal("aurora", root.GetAttribute("data-test-id"));
    }

    [Fact]
    public void DoesNotRenderFocusableMarkup_WhenUsedWithDefaultSettings()
    {
        var cut = Render<RzAuroraText>(p => p.AddChildContent("plain"));

        Assert.Empty(cut.FindAll("a, button, input, select, textarea"));
        Assert.Empty(cut.FindAll("[tabindex]"));
    }
}
