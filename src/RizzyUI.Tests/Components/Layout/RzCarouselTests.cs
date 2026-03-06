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
}
