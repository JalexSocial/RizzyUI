using Bunit;

namespace RizzyUI.Tests.Components.Feedback;

/// <summary>
/// RZUI-053 (RM-3.3, before-1.0 part): RzDialog, RzAlertDialog and RzCommandDialog dropped caller
/// attributes. They now reach the root element, without replacing the component's own attributes.
/// </summary>
public class DialogRootAttributesTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public DialogRootAttributesTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzDialog_RendersCallerAttributesOnItsRoot()
    {
        var cut = Render<RzDialog>(p => p
            .Add(x => x.Id, "settings-dialog")
            .AddUnmatched("data-testid", "settings")
            .AddUnmatched("aria-describedby", "settings-help")
            .AddUnmatched("x-data", "notAllowed")
            .AddUnmatched("x-ref", "settings"));

        var root = cut.Find("[data-slot='dialog']");
        Assert.Equal("settings", root.GetAttribute("data-testid"));
        Assert.Equal("settings-help", root.GetAttribute("aria-describedby"));
        Assert.Equal("rzModal", root.GetAttribute("x-data"));
        Assert.Equal("settings-dialog", root.GetAttribute("id"));
        Assert.Null(root.GetAttribute("x-ref"));
        Assert.Equal("settings", cut.Find("rz-proxy").GetAttribute("x-ref"));
    }

    [Fact]
    public void RzAlertDialog_RendersCallerAttributesOnItsRoot()
    {
        var cut = Render<RzAlertDialog>(p => p
            .AddUnmatched("data-testid", "confirm-delete")
            .AddUnmatched("data-close-on-escape", "true"));

        var root = cut.Find("[data-slot='alert-dialog']");
        Assert.Equal("confirm-delete", root.GetAttribute("data-testid"));
        // The component's own blocking behavior cannot be replaced by a caller attribute.
        Assert.Equal("false", root.GetAttribute("data-close-on-escape"));
    }

    [Fact]
    public void RzCommandDialog_PassesCallerAttributesToItsDialog()
    {
        var cut = Render<RzCommandDialog>(p => p.AddUnmatched("data-testid", "palette"));

        Assert.Equal("palette", cut.Find("[data-slot='dialog']").GetAttribute("data-testid"));
    }
}
