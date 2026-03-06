using Bunit;
using Microsoft.AspNetCore.Components;
using AlpineBridgeComponent = global::RizzyUI.RzAlpineComponent;

namespace RizzyUI.Tests.Components.Interactivity;

public class RzAlpineComponentTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAlpineComponentTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void DefaultRender_EmitsAlpineRootAndDataAttributes()
    {
        var cut = Render<AlpineBridgeComponent>(p => p
            .Add(x => x.For, new TestAlpineBackedType())
            .Add(x => x.Name, "demoComponent")
            .AddChildContent("Body"));

        var root = cut.Find("[data-alpine-root]");
        Assert.Equal(root.Id, root.GetAttribute("data-alpine-root"));
        Assert.Equal("demoComponent", root.GetAttribute("x-data"));
        Assert.Contains("Body", root.TextContent);
    }

    [Fact]
    public void PropsAndLoadStrategy_EmitJsonScriptAndPropsIdReference()
    {
        var cut = Render<AlpineBridgeComponent>(p => p
            .Add(x => x.For, new TestAlpineBackedType())
            .Add(x => x.Name, "demoComponent")
            .Add(x => x.LoadStrategy, "visible")
            .Add(x => x.Props, new { title = "Dialog", count = 3 }));

        var root = cut.Find("[data-alpine-root]");
        var script = cut.Find("script[type='application/json']");

        Assert.Equal("visible", root.GetAttribute("x-load"));
        Assert.Equal(script.Id, root.GetAttribute("data-props-id"));
        Assert.Contains("\"title\":\"Dialog\"", script.TextContent);
    }

    [Fact]
    public void AsChild_MergesAlpineAttributesIntoChildElement()
    {
        var cut = Render<AlpineBridgeComponent>(p => p
            .Add(x => x.For, new TestAlpineBackedType())
            .Add(x => x.Name, "demoComponent")
            .Add(x => x.AsChild, true)
            .Add(x => x.ChildContent, (RenderFragment)(builder =>
            {
                builder.OpenElement(0, "section");
                builder.AddAttribute(1, "id", "inner");
                builder.AddContent(2, "Inner");
                builder.CloseElement();
            })));

        var child = cut.Find("[data-alpine-root]");
        Assert.Equal("demoComponent", child.GetAttribute("x-data"));
        Assert.NotNull(child.GetAttribute("data-alpine-root"));
    }

    [Fact]
    public void MissingRequiredParameters_Throws()
    {
        Assert.ThrowsAny<Exception>(() => Render<AlpineBridgeComponent>(p => p.Add(x => x.Name, "missingFor")));
        Assert.ThrowsAny<Exception>(() => Render<AlpineBridgeComponent>(p => p.Add(x => x.For, new TestAlpineBackedType())));
    }

    [Fact]
    public void AccessibilityAndKeyboardMarkup_NotOwnedByBridgeComponent()
    {
        var cut = Render<AlpineBridgeComponent>(p => p
            .Add(x => x.For, new TestAlpineBackedType())
            .Add(x => x.Name, "demoComponent"));

        var root = cut.Find("[data-alpine-root]");
        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("tabindex"));
    }

    [RzAlpineCodeBehind("/workspace/RizzyUI/src/RizzyUI.Tests/Components/Interactivity/TestAlpineBackedType.razor")]
    private sealed class TestAlpineBackedType;
}
