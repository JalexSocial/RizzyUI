using Bunit;

namespace RizzyUI.Tests.Components.Text;

public class RzAnimatedGradientTextTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAnimatedGradientTextTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_UsesSpanRootAndDataSlot()
    {
        var cut = Render<RzAnimatedGradientText>(parameters => parameters
            .Add(p => p.Id, "animated-default")
            .AddChildContent("Gradient")
        );

        var root = cut.Find("span#animated-default[data-slot='animated-gradient-text']");

        Assert.NotNull(root);
        Assert.Equal("Gradient", root.TextContent);
    }

    [Fact]
    public void DefaultRender_EmitsExpectedClassesAndStyleVariables()
    {
        var cut = Render<RzAnimatedGradientText>();
        var root = cut.Find("[data-slot='animated-gradient-text']");
        var style = root.GetAttribute("style") ?? string.Empty;

        Assert.Contains("inline", root.ClassList);
        Assert.Contains("bg-clip-text", root.ClassList);
        Assert.Contains("text-transparent", root.ClassList);
        Assert.Contains("animate-gradient", root.ClassList);
        Assert.Contains("--bg-size: 300%", style);
        Assert.Contains("--color-from: #ffaa40", style);
        Assert.Contains("--color-to: #9c40ff", style);
    }

    [Fact]
    public void RootAttributesAndClassMerge_PassThroughCorrectly()
    {
        var cut = Render<RzAnimatedGradientText>(parameters => parameters
            .AddUnmatched("class", "tracking-wider")
            .AddUnmatched("aria-label", "Attention")
            .AddUnmatched("aria-hidden", "true")
            .AddUnmatched("title", "Helpful title")
        );

        var root = cut.Find("[data-slot='animated-gradient-text']");

        Assert.Contains("tracking-wider", root.ClassList);
        Assert.Equal("Attention", root.GetAttribute("aria-label"));
        Assert.Equal("true", root.GetAttribute("aria-hidden"));
        Assert.Equal("Helpful title", root.GetAttribute("title"));
        Assert.Null(root.GetAttribute("role"));
    }

    [Fact]
    public void NonInteractiveModel_DoesNotEmitKeyboardOrAlpineHooks()
    {
        var cut = Render<RzAnimatedGradientText>(parameters => parameters
            .AddChildContent("No JS needed")
        );

        var root = cut.Find("[data-slot='animated-gradient-text']");

        Assert.Null(root.GetAttribute("tabindex"));
        Assert.Null(root.GetAttribute("x-data"));
        Assert.Null(root.GetAttribute("x-init"));
        Assert.Null(root.GetAttribute("data-alpine-root"));
        Assert.Null(root.GetAttribute("data-assets"));
        Assert.Null(root.GetAttribute("data-nonce"));
        Assert.DoesNotContain("@onclick", cut.Markup);
        Assert.DoesNotContain("@onchange", cut.Markup);
    }

    [Fact]
    public void AnimateFalse_RemovesAnimationClassButKeepsGradientClasses()
    {
        var cut = Render<RzAnimatedGradientText>(parameters => parameters
            .Add(p => p.Animate, false)
        );

        var root = cut.Find("[data-slot='animated-gradient-text']");

        Assert.DoesNotContain("animate-gradient", root.ClassList);
        Assert.Contains("bg-clip-text", root.ClassList);
        Assert.Contains("text-transparent", root.ClassList);
    }

    [Fact]
    public void ParameterizedValues_UpdateCssVariableStyle()
    {
        var cut = Render<RzAnimatedGradientText>(parameters => parameters
            .Add(p => p.Speed, 2m)
            .Add(p => p.ColorFrom, "#4ade80")
            .Add(p => p.ColorTo, "#06b6d4")
        );

        var style = cut.Find("[data-slot='animated-gradient-text']").GetAttribute("style") ?? string.Empty;

        Assert.Contains("--bg-size: 600%", style);
        Assert.Contains("--color-from: #4ade80", style);
        Assert.Contains("--color-to: #06b6d4", style);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void NonPositiveSpeed_IsClampedToSafeMinimum(decimal speed)
    {
        var cut = Render<RzAnimatedGradientText>(parameters => parameters
            .Add(p => p.Speed, speed)
        );

        var style = cut.Find("[data-slot='animated-gradient-text']").GetAttribute("style") ?? string.Empty;

        Assert.Contains("--bg-size: 30%", style);
    }

    [Fact]
    public void EmptyColorParameters_FallBackToDefaultValues()
    {
        var cut = Render<RzAnimatedGradientText>(parameters => parameters
            .Add(p => p.ColorFrom, string.Empty)
            .Add(p => p.ColorTo, "")
        );

        var style = cut.Find("[data-slot='animated-gradient-text']").GetAttribute("style") ?? string.Empty;

        Assert.Contains("--color-from: #ffaa40", style);
        Assert.Contains("--color-to: #9c40ff", style);
    }

    [Fact]
    public void EmptyChildContent_StillRendersValidRootMarkup()
    {
        var cut = Render<RzAnimatedGradientText>();

        var root = cut.Find("[data-slot='animated-gradient-text']");

        Assert.NotNull(root);
        Assert.Equal(string.Empty, root.TextContent.Trim());
    }

    [Fact]
    public void InternalSlotCoverage_OnlyRootSlotExists()
    {
        var cut = Render<RzAnimatedGradientText>();

        Assert.Single(cut.FindAll("[data-slot='animated-gradient-text']"));
    }
}
