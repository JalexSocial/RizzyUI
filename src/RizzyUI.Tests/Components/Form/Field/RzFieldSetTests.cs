using Bunit;

namespace RizzyUI.Tests.Components.Form.Field;

public class RzFieldSetTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzFieldSetTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultsToFieldSetWithRootDataSlot()
    {
        var cut = Render<RzFieldSet>(p => p.AddChildContent("Fields"));

        var fieldSet = cut.Find("[data-slot='field-set']");
        Assert.Equal("fieldset", fieldSet.TagName.ToLowerInvariant());
        Assert.Contains("flex", fieldSet.ClassList);
        Assert.Contains("Fields", fieldSet.TextContent);
    }

    [Fact]
    public void PreservesUserProvidedElementAndMergesClasses()
    {
        var cut = Render<RzFieldSet>(p => p
            .Add(x => x.Element, "section")
            .AddUnmatched("class", "my-fieldset"));

        var fieldSet = cut.Find("[data-slot='field-set']");
        Assert.Equal("section", fieldSet.TagName.ToLowerInvariant());
        Assert.Contains("my-fieldset", fieldSet.ClassList);
    }
}
