using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;

namespace RizzyUI.Tests.Components.Interactivity;

public class RzAlpineComponentTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    private const string FakeHostModule = "/_content/RizzyUI.Tests/Components/Interactivity/FakeAlpineHost.razor.js";

    public RzAlpineComponentTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersTheModuleOnTheRootWithoutInlineScripts()
    {
        var cut = Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.Name, "exampleData")
            .Add(x => x.LoadStrategy, "visible")
            .Add(x => x.Props, new { enabled = true })
            .AddUnmatched("class", "alpine-host")
            .AddChildContent("Host"));

        var root = cut.Find("[x-data='exampleData']");
        Assert.Equal(root.GetAttribute("id"), root.GetAttribute("data-alpine-root"));
        Assert.Equal("visible", root.GetAttribute("x-load"));
        Assert.Equal(FakeHostModule, root.GetAttribute("x-load-src"));
        Assert.Contains("alpine-host", root.ClassList);
        // No registration script, no props script: works in the initial page, in htmx swaps and
        // under a strict CSP without nonces.
        Assert.Empty(cut.FindAll("script"));
    }

    [Fact]
    public void PropsKeepTheNamesWrittenInCSharp()
    {
        var cut = Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.Props, new { InitialCount = 10, displayName = "Ada \"Byron\" <b>", Status = DayOfWeek.Monday }));

        var json = cut.Find("[x-load-src]").GetAttribute("data-rz-props");
        using var document = JsonDocument.Parse(json!);
        Assert.Equal(10, document.RootElement.GetProperty("InitialCount").GetInt32());
        Assert.Equal("Ada \"Byron\" <b>", document.RootElement.GetProperty("displayName").GetString());
        Assert.Equal(1, document.RootElement.GetProperty("Status").GetInt32());
        Assert.False(document.RootElement.TryGetProperty("initialCount", out _));
    }

    [Fact]
    public void PropsSerializerOptionsAreConfigurable()
    {
        var config = Services.GetRequiredService<IOptions<RizzyUIConfig>>().Value;
        var original = config.CodeBehindPropsSerializerOptions;
        var camelCase = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        camelCase.Converters.Add(new JsonStringEnumConverter());
        config.CodeBehindPropsSerializerOptions = camelCase;
        try
        {
            var cut = Render<RzAlpineComponent>(p => p
                .Add(x => x.For, new FakeAlpineHost())
                .Add(x => x.Props, new { InitialCount = 10, Status = DayOfWeek.Monday }));

            using var document = JsonDocument.Parse(cut.Find("[x-load-src]").GetAttribute("data-rz-props")!);
            Assert.Equal(10, document.RootElement.GetProperty("initialCount").GetInt32());
            Assert.Equal("Monday", document.RootElement.GetProperty("status").GetString());
        }
        finally
        {
            config.CodeBehindPropsSerializerOptions = original;
        }
    }

    [Fact]
    public void GeneratesADataNameFromTheTypeAndModuleUrl()
    {
        var first = Render<RzAlpineComponent>(p => p.Add(x => x.For, new FakeAlpineHost()));
        var second = Render<RzAlpineComponent>(p => p.Add(x => x.For, new FakeAlpineHost()));
        var other = Render<RzAlpineComponent>(p => p.Add(x => x.For, new WindowsBuiltHost()));

        var name = first.Find("[x-load-src]").GetAttribute("x-data")!;
        Assert.Matches("^rzcb_FakeAlpineHost_[0-9a-f]{8}$", name);
        Assert.Equal(name, second.Find("[x-load-src]").GetAttribute("x-data"));
        Assert.NotEqual(name, other.Find("[x-load-src]").GetAttribute("x-data"));
    }

    [Fact]
    public void DataNameChangesWhenTheModuleUrlChanges()
    {
        // A new deployment changes the fingerprinted URL, so new markup loads the new module.
        Assert.NotEqual(
            RzAlpineModuleResolver.CreateDataName(typeof(FakeAlpineHost), "/Counter.aaaaaaaaaa.razor.js"),
            RzAlpineModuleResolver.CreateDataName(typeof(FakeAlpineHost), "/Counter.bbbbbbbbbb.razor.js"));
        Assert.Matches("^rzcb_List_[0-9a-f]{8}$", RzAlpineModuleResolver.CreateDataName(typeof(List<int>), "/x.razor.js"));
    }

    [Fact]
    public void AsChildMergesAlpineAttributesOntoChildElement()
    {
        RenderFragment child = b =>
        {
            b.OpenElement(0, "section");
            b.AddAttribute(1, "tabindex", "0");
            b.AddContent(2, "Child");
            b.CloseElement();
        };

        var cut = Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.Name, "childData")
            .Add(x => x.AsChild, true)
            .Add(x => x.ChildContent, child));

        var section = cut.Find("section[x-data='childData']");
        Assert.Equal("0", section.GetAttribute("tabindex"));
        Assert.Equal(FakeHostModule, section.GetAttribute("x-load-src"));
    }

    [Fact]
    public void AsChildOnMarkupKeepsTheChildsId()
    {
        RenderFragment child = b => b.AddMarkupContent(0, "<div id=\"counter-root\">Child</div>");

        var cut = Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.AsChild, true)
            .Add(x => x.ChildContent, child));

        var root = cut.Find("[x-load-src]");
        Assert.Equal("counter-root", root.GetAttribute("id"));
    }

    [Fact]
    public void EmptyLoadStrategyStillLoadsTheModule()
    {
        // async-alpine only loads elements with x-load.
        var cut = Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.LoadStrategy, ""));

        Assert.Equal("eager", cut.Find("[x-load-src]").GetAttribute("x-load"));
    }

    [Fact]
    public void PreloadsEagerModulesOncePerRequest()
    {
        var httpContext = new DefaultHttpContext();
        RenderFragment twoInstances = b =>
        {
            b.OpenComponent<RzAlpineComponent>(0);
            b.AddComponentParameter(1, nameof(RzAlpineComponent.For), new FakeAlpineHost());
            b.CloseComponent();
            b.OpenComponent<RzAlpineComponent>(2);
            b.AddComponentParameter(3, nameof(RzAlpineComponent.For), new FakeAlpineHost());
            b.CloseComponent();
            b.OpenComponent<RzAlpineComponent>(4);
            b.AddComponentParameter(5, nameof(RzAlpineComponent.For), new WindowsBuiltHost());
            b.AddComponentParameter(6, nameof(RzAlpineComponent.LoadStrategy), "visible");
            b.CloseComponent();
        };

        var cut = Render<CascadingValue<HttpContext>>(ps => ps
            .Add(p => p.Value, httpContext)
            .Add(p => p.ChildContent, twoInstances));

        var links = cut.FindAll("link[rel='modulepreload']");
        var link = Assert.Single(links);
        Assert.Equal(FakeHostModule, link.GetAttribute("href"));
    }

    [Fact]
    public void PreloadCanBeTurnedOff()
    {
        var cut = Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.Preload, false));

        Assert.Empty(cut.FindAll("link"));
    }

    [Fact]
    public void ModulePathUsesForwardSlashesForComponentsBuiltOnWindows()
    {
        Assert.Equal(
            "/_content/RizzyUI.Tests/Components/Interactivity/WindowsBuiltHost.razor.js",
            RzAlpineComponent.GetComponentModulePath(typeof(WindowsBuiltHost)));
    }

    [Fact]
    public void AttributeInTheRazorCsFileMapsToTheRazorJsModule()
    {
        Assert.Equal(
            "/_content/RizzyUI.Tests/Components/Interactivity/PartialClassHost.razor.js",
            RzAlpineComponent.GetComponentModulePath(typeof(PartialClassHost)));
    }

    [Theory]
    [InlineData("Counter.razor", "Counter.razor.js")]
    [InlineData("Counter.razor.cs", "Counter.razor.js")]
    [InlineData("Features/Counter.RAZOR", "Features/Counter.RAZOR.js")]
    public void ModuleFileNameFollowsTheSourceFile(string source, string module)
    {
        Assert.Equal(module, RzAlpineComponent.GetModuleFileName(source));
    }

    [Fact]
    public void ComponentWithoutTheAttributeThrowsWithGuidance()
    {
        var error = Assert.Throws<InvalidOperationException>(() => Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new UnmarkedHost())));

        Assert.Contains("[RzAlpineCodeBehind]", error.Message);
        Assert.Contains("UnmarkedHost.razor.js", error.Message);
    }
}
