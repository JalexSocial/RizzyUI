using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Layout.RzItem;

public class RzItemTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzItemTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_EmitsDataMarkersAndClasses()
    {
        var cut = Render<global::RizzyUI.RzItem>(p => p.AddChildContent("Item text"));

        var item = cut.Find("[data-slot='item']");
        Assert.Equal("div", item.TagName.ToLowerInvariant());
        Assert.Equal("default", item.GetAttribute("data-size"));
        Assert.Equal("default", item.GetAttribute("data-variant"));
        Assert.Contains("group/item", item.ClassList);
    }

    [Fact]
    public void VariantAndSizeAreRenderedAsDataAttributes()
    {
        var cut = Render<global::RizzyUI.RzItem>(p => p
            .Add(x => x.Variant, ItemVariant.Outline)
            .Add(x => x.Size, Size.Small));

        var item = cut.Find("[data-slot='item']");
        Assert.Equal("outline", item.GetAttribute("data-variant"));
        Assert.Equal("sm", item.GetAttribute("data-size"));
    }

    [Fact]
    public void AsChildMergesAttributesOntoFocusableChild()
    {
        RenderFragment child = b =>
        {
            b.OpenElement(0, "a");
            b.AddAttribute(1, "href", "/items/1");
            b.AddAttribute(2, "tabindex", "0");
            b.AddContent(3, "Go");
            b.CloseElement();
        };

        var cut = Render<global::RizzyUI.RzItem>(p => p
            .Add(x => x.AsChild, true)
            .Add(x => x.ChildContent, child)
            .AddUnmatched("class", "custom-item"));

        var item = cut.Find("a[data-slot='item']");
        Assert.Equal("0", item.GetAttribute("tabindex"));
        Assert.Contains("custom-item", item.ClassList);
    }
}
