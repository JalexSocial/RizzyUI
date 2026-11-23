using Bunit;

namespace RizzyUI.Tests.Components.Layout;

public class RzCarouselTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCarouselTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzCarousel_RendersRegionWithAlpineBootstrapAndConfigScript()
    {
        var cut = Render<RzCarousel>(p => p.AddChildContent("Slides"));

        var root = cut.Find($"#{cut.Instance.Id}");
        Assert.Equal("region", root.GetAttribute("role"));
        Assert.Equal("carousel", root.GetAttribute("aria-roledescription"));
        Assert.NotNull(root.GetAttribute("aria-label"));

        var alpine = cut.Find("[x-data='rzCarousel']");
        Assert.Equal(cut.Instance.Id, alpine.GetAttribute("data-alpine-root"));
        Assert.Equal($"{cut.Instance.Id}-config", alpine.GetAttribute("data-config"));
        Assert.NotNull(cut.Find($"script#{cut.Instance.Id}-config"));
    }

    [Fact]
    public void RzCarousel_RendersChildStructuralMarkup()
    {
        var cut = Render<RzCarousel>(p => p
            .AddChildContent<CarouselContent>(cc => cc.AddChildContent<CarouselItem>(i => i.AddChildContent("A")))
            .AddChildContent<CarouselPrevious>()
            .AddChildContent<CarouselNext>());

        Assert.Contains("x-ref=\"viewport\"", cut.Markup);
        Assert.Contains("x-ref=\"container\"", cut.Markup);
        Assert.Contains("x-on:click=\"scrollPrev\"", cut.Markup);
        Assert.Contains("x-on:click=\"scrollNext\"", cut.Markup);
    }

    [Fact]
    public void RzCarousel_OutputsPluginConfigurationForSsrEnhancement()
    {
        var cut = Render<RzCarousel>(p => p
            .Add(x => x.Plugins, [new AutoplayPlugin(new AutoplayPluginOptions())])
            .AddChildContent("Slides"));

        var config = cut.Find($"script#{cut.Instance.Id}-config").TextContent;
        Assert.Contains("autoplay", config, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ConfigurationScriptEscapesHtmlSensitiveCharacters()
    {
        // RZUI-034: relaxed escaping let "</script>" in an option string end the JSON element.
        var cut = Render<RzCarousel>(p => p.Add(x => x.Options, new CarouselOptions { Align = "</script><script>alert(1)</script>" }));

        var script = cut.Find("script[type='application/json']");
        Assert.DoesNotContain("</script>", script.InnerHtml);
        Assert.Contains(@"\u003C/script\u003E", script.InnerHtml);
        Assert.Single(cut.FindAll("script[type='application/json']"));
    }

    [Fact]
    public void Buttons_Sit_Outside_The_Slides_Like_Shadcn()
    {
        // Summit SF-091: the buttons were at left-0/right-0 of the slide area, on top of the slides.
        var cut = Render<RzCarousel>(p => p
            .AddChildContent<CarouselContent>(cc => cc.AddChildContent<CarouselItem>(i => i.AddChildContent("A")))
            .AddChildContent<CarouselPrevious>()
            .AddChildContent<CarouselNext>());

        var root = cut.Find("[data-slot='carousel']");
        Assert.Equal("horizontal", root.GetAttribute("data-orientation"));
        Assert.Contains("group/carousel", root.ClassList);

        var previous = cut.Find("[data-slot='carousel-previous']");
        Assert.Contains("-left-12", previous.ClassList);
        Assert.Contains("top-1/2", previous.ClassList);
        Assert.DoesNotContain("left-0", previous.ClassList);

        var next = cut.Find("[data-slot='carousel-next']");
        Assert.Contains("-right-12", next.ClassList);
        Assert.DoesNotContain("right-0", next.ClassList);

        // The 16px gap between slides: the content's negative margin offsets each item's padding.
        Assert.Contains("-ml-4", cut.Find("[data-slot='carousel-content']").ClassList);
        Assert.Contains("pl-4", cut.Find("[data-slot='carousel-content'] > div").ClassList);
    }

    [Fact]
    public void Vertical_Carousel_Places_Buttons_Above_And_Below()
    {
        var cut = Render<RzCarousel>(p => p
            .Add(x => x.Options, new CarouselOptions { Axis = "y" })
            .AddChildContent<CarouselPrevious>()
            .AddChildContent<CarouselNext>());

        Assert.Equal("vertical", cut.Find("[data-slot='carousel']").GetAttribute("data-orientation"));
        var previous = cut.Find("[data-slot='carousel-previous']");
        Assert.Contains("group-data-[orientation=vertical]/carousel:-top-12", previous.ClassList);
        Assert.Contains("group-data-[orientation=vertical]/carousel:rotate-90", previous.ClassList);
        var next = cut.Find("[data-slot='carousel-next']");
        Assert.Contains("group-data-[orientation=vertical]/carousel:-bottom-12", next.ClassList);
        Assert.Contains("group-data-[orientation=vertical]/carousel:rotate-90", next.ClassList);
    }

    [Fact]
    public void App_Class_Can_Move_The_Buttons_Back_Inside()
    {
        // The migration in the changelog: class="left-2" replaces the default -left-12.
        var cut = Render<RzCarousel>(p => p
            .AddChildContent<CarouselPrevious>(b => b.AddUnmatched("class", "left-2"))
            .AddChildContent<CarouselNext>(b => b.AddUnmatched("class", "right-2")));

        var previous = cut.Find("[data-slot='carousel-previous']");
        Assert.Contains("left-2", previous.ClassList);
        Assert.DoesNotContain("-left-12", previous.ClassList);
        var next = cut.Find("[data-slot='carousel-next']");
        Assert.Contains("right-2", next.ClassList);
        Assert.DoesNotContain("-right-12", next.ClassList);
    }
}
