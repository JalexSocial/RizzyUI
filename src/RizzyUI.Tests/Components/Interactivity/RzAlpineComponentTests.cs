using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Interactivity;

public class RzAlpineComponentTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAlpineComponentTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersAlpineRootAttributesAndPropsScript()
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
        Assert.Contains("alpine-host", root.ClassList);
        Assert.NotNull(cut.Find("script[type='application/json']"));
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
    }

    [Fact]
    public void RegistersTheCodeBehindModuleWithJsonStringArguments()
    {
        // RZUI-054: the name and path were HTML-encoded inside the script, so quotes and non-ASCII
        // characters became entities.
        var cut = Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.Name, "café's"));

        var script = cut.FindAll("script").Single(s => s.TextContent.Contains("registerAsyncComponent")).TextContent;
        Assert.Contains(@"(""caf\u00E9\u0027s"", ""/_content/RizzyUI.Tests/Components/Interactivity/FakeAlpineHost.razor.js"")", script);
        Assert.DoesNotContain("&#", script);
    }

    [Fact]
    public void ModulePathUsesForwardSlashesForComponentsBuiltOnWindows()
    {
        Assert.Equal(
            "/_content/RizzyUI.Tests/Components/Interactivity/WindowsBuiltHost.razor.js",
            RzAlpineComponent.GetComponentModulePath(typeof(WindowsBuiltHost)));
    }

    [Fact]
    public void MissingNameThrowsForInvalidPartialConfiguration()
    {
        Assert.Throws<InvalidOperationException>(() => Render<RzAlpineComponent>(p => p
            .Add(x => x.For, new FakeAlpineHost())
            .Add(x => x.Name, string.Empty)));
    }
}
