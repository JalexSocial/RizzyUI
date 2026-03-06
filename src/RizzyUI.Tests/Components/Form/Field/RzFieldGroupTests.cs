using Bunit;

namespace RizzyUI.Tests.Components.Form.Field;

public class RzFieldGroupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzFieldGroupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersRootDataSlotAndBaseClasses()
    {
        var cut = Render<RzFieldGroup>(p => p.AddChildContent("Content"));

        var group = cut.Find("[data-slot='field-group']");
        Assert.Equal("div", group.TagName.ToLowerInvariant());
        Assert.Contains("group/field-group", group.ClassList);
        Assert.Contains("flex", group.ClassList);
        Assert.Contains("Content", group.TextContent);
    }

    [Fact]
    public void MergesAdditionalClassAndSupportsEmptyContent()
    {
        var cut = Render<RzFieldGroup>(p => p.AddUnmatched("class", "custom-group"));

        var group = cut.Find("[data-slot='field-group']");
        Assert.Contains("custom-group", group.ClassList);
        Assert.Equal(string.Empty, group.TextContent.Trim());
    }
}
