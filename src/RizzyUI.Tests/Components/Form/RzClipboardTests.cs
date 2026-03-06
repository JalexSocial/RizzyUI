using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace RizzyUI.Tests.Components.Form;

public class RzClipboardTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzClipboardTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_UsesButtonWithClipboardAttributes()
    {
        var cut = Render<RzClipboard>(p => p
            .Add(x => x.Value, "hello")
            .AddChildContent<ClipboardTrigger>(t => t.AddChildContent("Copy"))
            .AddChildContent<ClipboardFeedback>(f => f.AddChildContent("Copied"))
        );

        var root = cut.Find("[data-slot='clipboard']");

        Assert.Equal("button", root.TagName.ToLowerInvariant());
        Assert.Equal("rzClipboard", root.GetAttribute("x-data"));
        Assert.Equal("copy", root.GetAttribute("x-on:click.prevent"));
        Assert.Equal("hello", root.GetAttribute("data-copy-value"));
        Assert.Equal("false", root.GetAttribute("data-disabled"));
    }

    [Fact]
    public void NonButtonElement_AddsKeyboardAccessibilityAttributes()
    {
        var cut = Render<RzClipboard>(p => p
            .Add(x => x.Element, "div")
            .Add(x => x.Value, "hello")
            .AddChildContent<ClipboardTrigger>(t => t.AddChildContent("Copy"))
            .AddChildContent<ClipboardFeedback>(f => f.AddChildContent("Copied"))
        );

        var root = cut.Find("[data-slot='clipboard']");

        Assert.Equal("div", root.TagName.ToLowerInvariant());
        Assert.Equal("button", root.GetAttribute("role"));
        Assert.Equal("0", root.GetAttribute("tabindex"));
        Assert.Equal("copy", root.GetAttribute("x-on:keydown.enter.prevent"));
        Assert.Equal("copy", root.GetAttribute("x-on:keydown.space.prevent"));
    }

    [Fact]
    public void DisabledState_DisablesButtonAndSetsAriaDisabled()
    {
        var cut = Render<RzClipboard>(p => p
            .Add(x => x.Disabled, true)
            .AddChildContent<ClipboardTrigger>(t => t.AddChildContent("Copy"))
            .AddChildContent<ClipboardFeedback>(f => f.AddChildContent("Copied"))
        );

        var root = cut.Find("[data-slot='clipboard']");

        Assert.Equal("true", root.GetAttribute("aria-disabled"));
        Assert.Equal("disabled", root.GetAttribute("disabled"));
        Assert.Equal("true", root.GetAttribute("data-disabled"));
    }

    [Fact]
    public void MultipleInstances_RenderUniqueIdsAndAlpineRoots()
    {
        var cut = Render<ClipboardMultiHost>();

        var roots = cut.FindAll("[data-slot='clipboard']");

        Assert.Equal(2, roots.Count);
        Assert.NotEqual(roots[0].GetAttribute("id"), roots[1].GetAttribute("id"));
        Assert.Equal(roots[0].GetAttribute("id"), roots[0].GetAttribute("data-alpine-root"));
        Assert.Equal(roots[1].GetAttribute("id"), roots[1].GetAttribute("data-alpine-root"));
    }

    private sealed class ClipboardMultiHost : ComponentBase
    {
        protected override void BuildRenderTree(RenderTreeBuilder builder)
        {
            builder.OpenElement(0, "div");

            builder.OpenComponent<RzClipboard>(1);
            builder.AddAttribute(2, nameof(RzClipboard.Value), "one");
            builder.AddAttribute(3, nameof(RzClipboard.ChildContent), (RenderFragment)((b) =>
            {
                b.OpenComponent<ClipboardTrigger>(4);
                b.AddAttribute(5, nameof(ClipboardTrigger.ChildContent), (RenderFragment)((b2) => b2.AddContent(6, "Copy One")));
                b.CloseComponent();

                b.OpenComponent<ClipboardFeedback>(7);
                b.AddAttribute(8, nameof(ClipboardFeedback.ChildContent), (RenderFragment)((b2) => b2.AddContent(9, "Copied One")));
                b.CloseComponent();
            }));
            builder.CloseComponent();

            builder.OpenComponent<RzClipboard>(10);
            builder.AddAttribute(11, nameof(RzClipboard.Value), "two");
            builder.AddAttribute(12, nameof(RzClipboard.ChildContent), (RenderFragment)((b) =>
            {
                b.OpenComponent<ClipboardTrigger>(13);
                b.AddAttribute(14, nameof(ClipboardTrigger.ChildContent), (RenderFragment)((b2) => b2.AddContent(15, "Copy Two")));
                b.CloseComponent();

                b.OpenComponent<ClipboardFeedback>(16);
                b.AddAttribute(17, nameof(ClipboardFeedback.ChildContent), (RenderFragment)((b2) => b2.AddContent(18, "Copied Two")));
                b.CloseComponent();
            }));
            builder.CloseComponent();

            builder.CloseElement();
        }
    }
}
