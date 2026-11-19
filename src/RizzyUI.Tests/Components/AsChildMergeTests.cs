using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace RizzyUI.Tests.Components;

/// <summary>
/// RM-3.2 / RZUI-039: the asChild element path and markup path apply the same rules. Component
/// parameters Id and Href become the child's id/href (the element path threw), and classes are
/// merged with TwMerge, the child's own classes winning conflicts.
/// </summary>
public class AsChildMergeTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public AsChildMergeTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private static readonly Dictionary<string, object?> ComponentAttributes = new()
    {
        ["Id"] = "from-component",
        ["Href"] = "/from-component",
        ["class"] = "px-2 text-sm bg-primary",
        ["data-slot"] = "test-as-child",
    };

    [Fact]
    public void ElementChild_RemapsIdAndHref_AndMergesClassesWithTwMerge()
    {
        RenderFragment child = b =>
        {
            b.OpenElement(0, "a");
            b.AddAttribute(1, "class", "px-6 underline");
            b.AddContent(2, "Link");
            b.CloseElement();
        };

        var cut = Render<TestAsChild>(p => p
            .Add(x => x.Child, child)
            .Add(x => x.Attributes, ComponentAttributes));

        AssertMerged(cut.Find("a"));
    }

    [Fact]
    public void MarkupChild_RemapsIdAndHref_AndMergesClassesWithTwMerge()
    {
        RenderFragment child = b => b.AddMarkupContent(0, "<a class=\"px-6 underline\">Link</a>");

        var cut = Render<TestAsChild>(p => p
            .Add(x => x.Child, child)
            .Add(x => x.Attributes, ComponentAttributes));

        AssertMerged(cut.Find("a"));
    }

    [Fact]
    public void ElementAndMarkupChild_KeepTheirOwnValuesForConflictingAttributes()
    {
        // The markup path joined conflicting values with a space: id="from-component mine",
        // x-data="componentData childData".
        var attributes = new Dictionary<string, object?>
        {
            ["id"] = "from-component",
            ["x-data"] = "componentData",
            ["aria-label"] = "From component",
            ["x-load"] = "eager",
        };
        RenderFragment elementChild = b =>
        {
            b.OpenElement(0, "div");
            b.AddAttribute(1, "id", "mine");
            b.AddAttribute(2, "x-data", "childData");
            b.AddAttribute(3, "aria-label", "From child");
            b.CloseElement();
        };
        RenderFragment markupChild = b => b.AddMarkupContent(0, "<div id=\"mine\" x-data='childData' aria-label=\"From child\"></div>");

        foreach (var child in new[] { elementChild, markupChild })
        {
            var div = Render<TestAsChild>(p => p
                .Add(x => x.Child, child)
                .Add(x => x.Attributes, attributes)).Find("div");

            Assert.Equal("mine", div.GetAttribute("id"));
            Assert.Equal("childData", div.GetAttribute("x-data"));
            Assert.Equal("From child", div.GetAttribute("aria-label"));
            Assert.Equal("eager", div.GetAttribute("x-load"));
        }
    }

    private static void AssertMerged(AngleSharp.Dom.IElement anchor)
    {
        Assert.Equal("from-component", anchor.GetAttribute("id"));
        Assert.Equal("/from-component", anchor.GetAttribute("href"));
        Assert.Equal("test-as-child", anchor.GetAttribute("data-slot"));

        var classes = anchor.ClassList.ToList();
        // Conflicting padding: the child's px-6 wins and px-2 is removed.
        Assert.Contains("px-6", classes);
        Assert.DoesNotContain("px-2", classes);
        Assert.Contains("underline", classes);
        Assert.Contains("text-sm", classes);
        Assert.Contains("bg-primary", classes);
    }

    private sealed class TestAsChild : RzAsChildComponent
    {
        [Parameter] public RenderFragment? Child { get; set; }

        [Parameter] public Dictionary<string, object?> Attributes { get; set; } = new();

        protected override RenderFragment? GetAsChildContent() => Child;

        protected override Dictionary<string, object?> GetComponentAttributes() => Attributes;

        protected override void BuildRenderTree(RenderTreeBuilder builder) =>
            builder.AddContent(0, CloneFragment(Child!, new Dictionary<string, object?>(Attributes)));
    }
}
