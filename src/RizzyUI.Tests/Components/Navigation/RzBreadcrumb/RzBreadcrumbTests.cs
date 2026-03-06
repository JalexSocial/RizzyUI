using Bunit;

namespace RizzyUI.Tests.Components.Navigation.RzBreadcrumb;

public class RzBreadcrumbTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzBreadcrumbTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RootAndChildComponentsRenderSemanticBreadcrumbStructure()
    {
        var cut = Render<global::RizzyUI.RzBreadcrumb>(p => p
            .AddChildContent<BreadcrumbList>(list => list
                .AddChildContent<BreadcrumbItem>(item => item
                    .AddChildContent<BreadcrumbLink>(link => link
                        .Add(x => x.Href, "/")
                        .AddChildContent("Home")))
                .AddChildContent<BreadcrumbSeparator>()
                .AddChildContent<BreadcrumbItem>(item => item
                    .AddChildContent<BreadcrumbPage>(page => page.AddChildContent("Current")))));

        var nav = cut.Find("nav[data-slot='breadcrumb']");
        Assert.False(string.IsNullOrWhiteSpace(nav.GetAttribute("aria-label")));
        Assert.NotNull(cut.Find("ol[data-slot='breadcrumb-list']"));
        Assert.NotNull(cut.Find("li[data-slot='breadcrumb-item']"));
        Assert.NotNull(cut.Find("a[data-slot='breadcrumb-link']"));
        Assert.NotNull(cut.Find("span[data-slot='breadcrumb-page']"));
        Assert.Equal("page", cut.Find("[data-slot='breadcrumb-page']").GetAttribute("aria-current"));
    }

    [Fact]
    public void BreadcrumbHelpersRenderAccessibilityContracts()
    {
        var separator = Render<BreadcrumbSeparator>();
        Assert.Equal("presentation", separator.Find("[data-slot='breadcrumb-separator']").GetAttribute("role"));

        var ellipsis = Render<BreadcrumbEllipsis>();
        Assert.NotNull(ellipsis.Find("[data-slot='breadcrumb-ellipsis'] .sr-only"));
    }

    [Fact]
    public void BreadcrumbMergesCustomClasses()
    {
        var cut = Render<global::RizzyUI.RzBreadcrumb>(p => p.AddUnmatched("class", "custom-breadcrumb"));

        Assert.Contains("custom-breadcrumb", cut.Find("[data-slot='breadcrumb']").ClassList);
    }
}
