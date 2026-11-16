using AngleSharp;
using Bunit;

namespace RizzyUI.Tests.Components.Feedback;

public class RzAlertDialogTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAlertDialogTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzAlertDialog_RendersWithBlockingDefaults()
    {
        var cut = Render<RzAlertDialog>(parameters => parameters
            .AddChildContent<AlertDialogTrigger>(trigger => trigger.AddChildContent("Open"))
            .AddChildContent<AlertDialogContent>(content => content.AddChildContent("Alert body"))
        );

        var root = cut.Find("div[data-slot='alert-dialog']");
        Assert.Equal("rzModal", root.GetAttribute("x-data"));
        Assert.Equal("false", root.GetAttribute("data-close-on-escape"));
        Assert.Equal("false", root.GetAttribute("data-close-on-click-outside"));

        var templateHtml = cut.Find("template").ToHtml() ?? string.Empty;
        Assert.Contains("role=\"alertdialog\"", templateHtml);
    }

    [Fact]
    public void AlertDialogTrigger_UsesCspSafeAlpineHandler()
    {
        var cut = Render<RzAlertDialog>(parameters => parameters
            .AddChildContent<AlertDialogTrigger>(trigger => trigger.AddChildContent("Open"))
            .AddChildContent<AlertDialogContent>(content => content.AddChildContent("Alert body"))
        );

        var trigger = cut.Find("[data-slot='alert-dialog-trigger']");
        Assert.Null(trigger.GetAttribute("onclick"));
        Assert.Equal("openFromTrigger", trigger.GetAttribute("x-on:click"));

        var templateHtml = cut.Find("template").ToHtml() ?? string.Empty;
        Assert.Contains("x-ref=\"rzModalPanel\"", templateHtml);
    }
}
