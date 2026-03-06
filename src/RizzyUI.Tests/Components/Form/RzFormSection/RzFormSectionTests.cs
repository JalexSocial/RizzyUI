using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Form.RzFormSection;

public class RzFormSectionTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzFormSectionTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersTitleDescriptionAndContentWithTwoColumnDefaults()
    {
        RenderFragment description = b => b.AddContent(0, "Description text");
        RenderFragment content = b => b.AddContent(0, "Section fields");

        var cut = Render<global::RizzyUI.RzFormSection>(p => p
            .Add(x => x.Title, "Profile")
            .Add(x => x.Description, description)
            .Add(x => x.Content, content));

        var root = cut.Find("div");
        Assert.Contains("md:flex", root.ClassList);
        Assert.NotNull(cut.Find("h2"));
        Assert.Contains("Profile", cut.Markup);
        Assert.Contains("Description text", cut.Markup);
        Assert.Contains("Section fields", cut.Markup);
    }

    [Fact]
    public void StackedLayoutOmitsDescriptionParagraphWhenNotProvided()
    {
        var cut = Render<global::RizzyUI.RzFormSection>(p => p
            .Add(x => x.Title, "Security")
            .Add(x => x.Layout, SectionLayout.Stacked)
            .AddUnmatched("class", "my-form-section"));

        var root = cut.Find(".my-form-section");
        Assert.Contains("mb-5", root.ClassList);
        Assert.Empty(cut.FindAll("p"));
    }

    [Fact]
    public void DoesNotEmitInteractiveBlazorHandlersInMarkup()
    {
        var cut = Render<global::RizzyUI.RzFormSection>(p => p.Add(x => x.Title, "SSR"));

        Assert.DoesNotContain("blazor:", cut.Markup, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("@onclick", cut.Markup, StringComparison.OrdinalIgnoreCase);
    }
}
