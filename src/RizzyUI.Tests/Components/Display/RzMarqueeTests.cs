using Bunit;

namespace RizzyUI.Tests.Components.Display;

public class RzMarqueeTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzMarqueeTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void Renders_Root_With_Marquee_DataSlot()
    {
        var cut = RenderMarquee();
        var root = cut.Find("[data-slot='marquee']");

        Assert.NotNull(root);
    }

    [Fact]
    public void Renders_All_Segments_With_Segment_DataSlot()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Repeat, 4));

        var segments = cut.FindAll("[data-slot='segment']");
        Assert.Equal(4, segments.Count);
    }

    [Fact]
    public void Duplicate_Segments_Are_AriaHidden()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Repeat, 3));

        var segments = cut.FindAll("[data-slot='segment']");
        Assert.False(segments[0].HasAttribute("aria-hidden"));
        Assert.Equal("true", segments[1].GetAttribute("aria-hidden"));
        Assert.Equal("true", segments[2].GetAttribute("aria-hidden"));
    }

    [Fact]
    public void Root_Does_Not_Emit_Default_Role()
    {
        var cut = RenderMarquee();
        var root = cut.Find("[data-slot='marquee']");

        Assert.False(root.HasAttribute("role"));
    }

    [Fact]
    public void AdditionalAttributes_Can_Set_Role_And_AriaLabel_On_Root()
    {
        var cut = RenderMarquee(parameters => parameters
            .AddUnmatched("role", "region")
            .AddUnmatched("aria-label", "Latest updates")
        );
        var root = cut.Find("[data-slot='marquee']");

        Assert.Equal("region", root.GetAttribute("role"));
        Assert.Equal("Latest updates", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void Root_Does_Not_Emit_TabIndex_By_Default()
    {
        var cut = RenderMarquee();
        var root = cut.Find("[data-slot='marquee']");

        Assert.False(root.HasAttribute("tabindex"));
    }

    [Fact]
    public void PauseOnHover_Also_Emits_FocusWithin_Pause_Class()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.PauseOnHover, true));
        var segment = cut.Find("[data-slot='segment']");

        Assert.Contains("group-hover:[animation-play-state:paused]", segment.ClassName);
        Assert.Contains("group-focus-within:[animation-play-state:paused]", segment.ClassName);
    }

    [Fact]
    public void Duplicate_Segments_Are_Inert_And_Not_KeyboardReachable()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Repeat, 3));
        var segments = cut.FindAll("[data-slot='segment']");

        Assert.False(segments[0].HasAttribute("inert"));
        Assert.True(segments[1].HasAttribute("inert"));
        Assert.True(segments[2].HasAttribute("inert"));
    }

    [Fact]
    public void Does_Not_Emit_XData_Or_DataAlpineRoot()
    {
        var cut = RenderMarquee();

        Assert.Empty(cut.FindAll("[x-data]"));
        Assert.Empty(cut.FindAll("[data-alpine-root]"));
    }

    [Fact]
    public void Emits_DataOrientation_DataReverse_And_DataPausesOnHover()
    {
        var cut = RenderMarquee(parameters => parameters
            .Add(p => p.Orientation, MarqueeOrientation.Vertical)
            .Add(p => p.Reverse, true)
            .Add(p => p.PauseOnHover, true)
        );

        var root = cut.Find("[data-slot='marquee']");
        Assert.Equal("vertical", root.GetAttribute("data-orientation"));
        Assert.Equal("true", root.GetAttribute("data-reverse"));
        Assert.Equal("true", root.GetAttribute("data-pauses-on-hover"));
    }

    [Fact]
    public void Default_Render_Has_Base_Classes_And_Default_Segment_Classes()
    {
        var cut = RenderMarquee();

        var root = cut.Find("[data-slot='marquee']");
        var segment = cut.Find("[data-slot='segment']");

        Assert.Contains("group", root.ClassName);
        Assert.Contains("overflow-hidden", root.ClassName);
        Assert.Contains("animate-marquee", segment.ClassName);
    }

    [Fact]
    public void User_Class_Merges_Into_Root()
    {
        var cut = RenderMarquee(parameters => parameters.AddUnmatched("class", "my-marquee"));

        var root = cut.Find("[data-slot='marquee']");
        Assert.Contains("my-marquee", root.ClassName);
    }

    [Fact]
    public void User_Style_Merges_Without_Dropping_Component_CssVariables()
    {
        var cut = RenderMarquee(parameters => parameters.AddUnmatched("style", "border-width:2px;"));

        var root = cut.Find("[data-slot='marquee']");
        var style = root.GetAttribute("style");

        Assert.Contains("--rz-marquee-duration:40s", style);
        Assert.Contains("--rz-marquee-gap:1rem", style);
        Assert.Contains("border-width:2px", style);
    }

    [Fact]
    public void Orientation_Vertical_Changes_Root_And_Segment_Classes()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Orientation, MarqueeOrientation.Vertical));

        var root = cut.Find("[data-slot='marquee']");
        var segment = cut.Find("[data-slot='segment']");

        Assert.Contains("flex-col", root.ClassName);
        Assert.Contains("animate-marquee-vertical", segment.ClassName);
    }

    [Fact]
    public void Reverse_Emits_Reverse_Animation_Class()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Reverse, true));

        var segment = cut.Find("[data-slot='segment']");
        Assert.Contains("[animation-direction:reverse]", segment.ClassName);
    }

    [Fact]
    public void PauseOnHover_Emits_Pause_Class()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.PauseOnHover, true));

        var segment = cut.Find("[data-slot='segment']");
        Assert.Contains("group-hover:[animation-play-state:paused]", segment.ClassName);
    }

    [Fact]
    public void Repeat_Default_Renders_Four_Segments()
    {
        var cut = RenderMarquee();

        Assert.Equal(4, cut.FindAll("[data-slot='segment']").Count);
    }

    [Fact]
    public void Repeat_Two_Renders_Two_Segments()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Repeat, 2));

        Assert.Equal(2, cut.FindAll("[data-slot='segment']").Count);
    }

    [Fact]
    public void Blank_Duration_Falls_Back_To_Default()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Duration, "  "));

        var style = cut.Find("[data-slot='marquee']").GetAttribute("style");
        Assert.Contains("--rz-marquee-duration:40s", style);
    }

    [Fact]
    public void Blank_Gap_Falls_Back_To_Default()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Gap, ""));

        var style = cut.Find("[data-slot='marquee']").GetAttribute("style");
        Assert.Contains("--rz-marquee-gap:1rem", style);
    }

    [Fact]
    public void Repeat_Less_Than_Two_Is_Clamped()
    {
        var cut = RenderMarquee(parameters => parameters.Add(p => p.Repeat, 1));

        Assert.Equal(2, cut.FindAll("[data-slot='segment']").Count);
    }

    [Fact]
    public void Null_ChildContent_Renders_Empty_Root_Without_Exception()
    {
        var cut = Render<RzMarquee>();

        Assert.NotNull(cut.Find("[data-slot='marquee']"));
        Assert.Empty(cut.FindAll("[data-slot='segment']"));
    }

    [Fact]
    public void Renders_Without_Blazor_Event_Handler_Attributes()
    {
        var cut = RenderMarquee();
        var markup = cut.Markup;

        Assert.DoesNotContain("@onclick", markup, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("@onchange", markup, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("@onsubmit", markup, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Renders_Stable_Static_Markup_With_No_Js_Dependencies()
    {
        var cut = RenderMarquee();

        Assert.Empty(cut.FindAll("script"));
        Assert.Empty(cut.FindAll("[data-assets]"));
        Assert.Empty(cut.FindAll("[x-data]"));
    }

    private IRenderedComponent<RzMarquee> RenderMarquee(Action<ComponentParameterCollectionBuilder<RzMarquee>>? configure = null)
    {
        return Render<RzMarquee>(parameters =>
        {
            parameters.AddChildContent("<a href='/status'>Status</a>");
            configure?.Invoke(parameters);
        });
    }
}
