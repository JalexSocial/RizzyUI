
using AngleSharp;
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Feedback;

public class RzDialogTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzDialogTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzDialog_RendersRootWithAlpineAttributes()
    {
        // Arrange
        var id = "test-dialog";

        // Act
        var cut = Render<RzDialog>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent<DialogContent>(content => content
                .AddChildContent("Dialog Content")
            )
            .AddChildContent<DialogTrigger>(trigger => trigger
                .AddChildContent("Open")
            )
        );

        // Assert
        var root = cut.Find($"div#{id}");
        Assert.Equal("rzModal", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-modal-id"));
        Assert.NotNull(root.GetAttribute("data-body-id"));
        Assert.NotNull(root.GetAttribute("data-footer-id"));
    }

    [Fact]
    public void DialogTrigger_RendersButtonWithCorrectEvent()
    {
        // Arrange
        var eventName = "custom-open-event";

        // Act
        var cut = Render<RzDialog>(parameters => parameters
            .Add(p => p.EventTriggerName, eventName)
            .AddChildContent<DialogTrigger>(trigger => trigger
                .AddChildContent("Trigger Button")
            )
            .AddChildContent<DialogContent>(content => content.AddChildContent("Content"))
        );

        // Assert
        var btn = cut.Find("button[data-slot='dialog-trigger']");
        Assert.Contains(eventName, btn.GetAttribute("onclick"));
        Assert.Contains("Trigger Button", btn.TextContent);
    }

    [Fact]
    public void DialogContent_RendersTeleportTemplate()
    {
        // Act
        var cut = Render<RzDialog>(parameters => parameters
            .AddChildContent<DialogContent>(content => content
                .AddChildContent("Modal Body")
            )
            .AddChildContent<DialogTrigger>(trigger => trigger.AddChildContent("Open"))
        );

        // Assert
        // DialogContent uses <template x-teleport="body">
        var template = cut.Find("template");
        Assert.Equal("body", template.GetAttribute("x-teleport"));

        var html = template.ToHtml() ?? "";
        Assert.Contains("Modal Body", html);
        Assert.Contains("x-show=\"modalOpen\"", html);
        Assert.Contains("data-modal-panel=\"true\"", html);
    }

    [Theory]
    [InlineData(ModalSize.Small, "sm:max-w-sm")]
    [InlineData(ModalSize.Large, "sm:max-w-lg")]
    [InlineData(ModalSize.FourXL, "sm:max-w-4xl")]
    public void DialogContent_SizeParameter_AppliesCorrectClass(ModalSize size, string expectedClass)
    {
        // Act
        var cut = Render<RzDialog>(parameters => parameters
            .AddChildContent<DialogContent>(content => content
                .Add(p => p.Size, size)
                .AddChildContent("Content")
            )
            .AddChildContent<DialogTrigger>(trigger => trigger.AddChildContent("Open"))
        );

        // Assert
        var template = cut.Find("template").ToHtml() ?? "";
        Assert.Contains(expectedClass, template);
    }

    [Fact]
    public void DialogHeaderAndFooter_RenderCorrectly()
    {
        // Act
        var cut = Render<RzDialog>(parameters => parameters
            .AddChildContent<DialogContent>(content => content
                .AddChildContent(builder => {
                    builder.OpenComponent<DialogHeader>(0);
                    builder.AddAttribute(1, "ChildContent", (RenderFragment)(b => b.AddContent(0, "Header")));
                    builder.CloseComponent();
                    
                    builder.OpenComponent<DialogFooter>(2);
                    builder.AddAttribute(3, "ChildContent", (RenderFragment)(b => b.AddContent(0, "Footer")));
                    builder.CloseComponent();
                })
            )
            .AddChildContent<DialogTrigger>(trigger => trigger.AddChildContent("Open"))
        );

        // Assert
        var templateHtml = cut.Find("template").ToHtml() ?? "";
        Assert.Contains("data-slot=\"dialog-header\"", templateHtml);
        Assert.Contains("data-slot=\"dialog-footer\"", templateHtml);
        Assert.Contains("Header", templateHtml);
        Assert.Contains("Footer", templateHtml);
    }
}
