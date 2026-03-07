using Bunit;

namespace RizzyUI.Tests.Components.SpecialEffects;

public class RzShineBorderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzShineBorderTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void Renders_Default_Decorative_Overlay_Contract()
    {
        var cut = Render<RzShineBorder>(p => p.Add(c => c.Id, "shine-1"));

        var root = cut.Find("div#shine-1[data-slot='shine-border']");
        Assert.Equal("true", root.GetAttribute("aria-hidden"));
        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("tabindex"));

        Assert.Contains("pointer-events-none", root.ClassList);
        Assert.Contains("absolute", root.ClassList);
        Assert.Contains("inset-0", root.ClassList);
        Assert.Contains("size-full", root.ClassList);
        var overlay = cut.Find("[data-slot='shine-border-overlay']");
        Assert.Contains("rounded-[inherit]", overlay.ClassList);
        Assert.Contains("will-change-[background-position]", overlay.ClassList);
        Assert.Contains("motion-safe:animate-shine", overlay.ClassList);
    }

    [Fact]
    public void Emits_Alpine_Hooks_For_Csp_Safe_Style_Computation()
    {
        var cut = Render<RzShineBorder>(p => p.Add(c => c.Id, "shine-alpine"));

        var alpineRoot = cut.Find("[data-alpine-root='shine-alpine']");
        Assert.Equal("rzShineBorder", alpineRoot.GetAttribute("x-data"));
        Assert.Equal("[]", alpineRoot.GetAttribute("data-assets"));
        Assert.NotNull(alpineRoot.GetAttribute("data-nonce"));
        Assert.Equal("computedStyle", alpineRoot.GetAttribute("x-bind:style"));
        Assert.Equal("shine-border-overlay", alpineRoot.GetAttribute("data-slot"));
    }

    [Fact]
    public void Merges_User_Class_And_Passes_Additional_Attributes()
    {
        var cut = Render<RzShineBorder>(p => p
            .AddUnmatched("class", "custom-border")
            .AddUnmatched("data-test-id", "shine-border-custom"));

        var root = cut.Find("[data-slot='shine-border']");
        Assert.Contains("custom-border", root.ClassList);
        Assert.Contains("absolute", root.ClassList);
        Assert.Equal("shine-border-custom", root.GetAttribute("data-test-id"));
    }

    [Fact]
    public void BorderWidth_And_Duration_Are_Emitted_As_Alpine_Data_Attributes()
    {
        var cut = Render<RzShineBorder>(p => p
            .Add(c => c.BorderWidth, 2.5)
            .Add(c => c.Duration, 9));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("2.5", alpineRoot.GetAttribute("data-border-width"));
        Assert.Equal("9", alpineRoot.GetAttribute("data-duration"));
    }

    [Fact]
    public void ShineColor_Renders_In_Data_Attributes()
    {
        var cut = Render<RzShineBorder>(p => p.Add(c => c.ShineColor, "rebeccapurple"));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("rebeccapurple", alpineRoot.GetAttribute("data-shine-color"));
    }

    [Fact]
    public void ShineColors_Are_Serialized_For_Alpine_Consumption()
    {
        var cut = Render<RzShineBorder>(p => p
            .Add(c => c.ShineColor, "black")
            .Add(c => c.ShineColors, new[] { "#A07CFE", "#FE8FB5", "#FFBE7B" }));

        var colors = cut.Find("[data-alpine-root]").GetAttribute("data-shine-colors");
        Assert.NotNull(colors);
        Assert.Contains("#A07CFE", colors);
        Assert.Contains("#FE8FB5", colors);
        Assert.Contains("#FFBE7B", colors);
    }

    [Fact]
    public void Empty_ShineColors_Serializes_As_Empty_Array()
    {
        var cut = Render<RzShineBorder>(p => p
            .Add(c => c.ShineColor, "#333333")
            .Add(c => c.ShineColors, Array.Empty<string>()));

        var colors = cut.Find("[data-alpine-root]").GetAttribute("data-shine-colors");
        Assert.Equal("[]", colors);
    }

    [Fact]
    public void Missing_Color_Configuration_Still_Renders_Without_Throwing()
    {
        var cut = Render<RzShineBorder>();

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("[]", alpineRoot.GetAttribute("data-shine-colors"));
        Assert.True(string.IsNullOrEmpty(alpineRoot.GetAttribute("data-shine-color")));
    }

    [Fact]
    public void Negative_BorderWidth_And_NonPositive_Duration_Are_Passed_Through_For_Alpine_Normalization()
    {
        var cut = Render<RzShineBorder>(p => p
            .Add(c => c.BorderWidth, -4)
            .Add(c => c.Duration, 0));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("-4", alpineRoot.GetAttribute("data-border-width"));
        Assert.Equal("0", alpineRoot.GetAttribute("data-duration"));
    }

    [Fact]
    public void Invalid_Color_String_Still_Renders_Without_Throwing()
    {
        var cut = Render<RzShineBorder>(p => p.Add(c => c.ShineColor, "not-a-real-color("));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("not-a-real-color(", alpineRoot.GetAttribute("data-shine-color"));
    }

    [Fact]
    public void User_Style_Attribute_Passes_Through_On_Root_Element()
    {
        var cut = Render<RzShineBorder>(p => p.AddUnmatched("style", "outline:1px solid red"));

        var root = cut.Find("[data-slot='shine-border']");
        var style = root.GetAttribute("style");
        Assert.NotNull(style);
        Assert.Contains("--duration:14s", style);
        Assert.Contains("outline:1px solid red", style);
    }

    [Fact]
    public void Can_Disable_Reduced_Motion_Respect_Class()
    {
        var cut = Render<RzShineBorder>(p => p.Add(c => c.RespectReducedMotion, false));

        var overlay = cut.Find("[data-slot='shine-border-overlay']");
        Assert.Contains("animate-shine", overlay.ClassList);
        Assert.DoesNotContain("motion-safe:animate-shine", overlay.ClassList);
    }

    [Fact]
    public void Does_Not_Emit_Blazor_Event_Attributes_For_Ssr_Only_Usage()
    {
        var cut = Render<RzShineBorder>();

        var markup = cut.Markup;
        Assert.DoesNotContain("@onclick", markup);
        Assert.DoesNotContain("@onchange", markup);
        Assert.DoesNotContain("@bind", markup);
    }
}
