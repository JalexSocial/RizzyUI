using Bunit;

namespace RizzyUI.Tests.Components.Form;

public class RzFileInputTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzFileInputTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzFileInput_RendersSlotsAndAlpineDragDropHooks()
    {
        var cut = Render<RzFileInput>();

        Assert.NotNull(cut.Find("[data-slot='file-input']"));
        var container = cut.Find("[data-slot='container']");
        Assert.Equal("rzFileInput", container.GetAttribute("x-data"));
        Assert.Equal("handleDrop", container.GetAttribute("x-on:drop.prevent"));

        var nativeInput = cut.Find("input[data-slot='native-input']");
        Assert.Equal("file", nativeInput.GetAttribute("type"));
        Assert.Equal(cut.Instance.InputId, nativeInput.Id);
    }

    [Fact]
    public void RzFileInput_RendersKeyboardAndAriaForTrigger()
    {
        var cut = Render<RzFileInput>(p => p
            .Add(x => x.AriaLabel, "Upload files")
            .Add(x => x.Name, "attachments")
            .Add(x => x.Multiple, true)
            .Add(x => x.Accept, ".png,.jpg"));

        var trigger = cut.Find("[data-slot='trigger']");
        Assert.Equal("button", trigger.GetAttribute("role"));
        Assert.Equal("0", trigger.GetAttribute("tabindex"));
        Assert.Equal(cut.Instance.ListId, trigger.GetAttribute("aria-controls"));
        Assert.Equal("trigger", trigger.GetAttribute("x-on:click"));

        var nativeInput = cut.Find("input[data-slot='native-input']");
        Assert.Equal("attachments", nativeInput.GetAttribute("name"));
        Assert.Equal(".png,.jpg", nativeInput.GetAttribute("accept"));
        Assert.Equal("Upload files", nativeInput.GetAttribute("aria-label"));
        Assert.True(nativeInput.HasAttribute("multiple"));
    }

    [Fact]
    public void RzFileInput_VariantAndClassMergeBehavior_IsRendered()
    {
        var cut = Render<RzFileInput>(p => p
            .Add(x => x.Variant, FileInputVariant.Dropzone)
            .AddUnmatched("class", "extra-root"));

        var root = cut.Find("[data-slot='file-input']");
        Assert.Contains("extra-root", root.ClassList);
        Assert.Contains("w-full", root.ClassList);
        Assert.Contains("Drop", cut.Markup, StringComparison.OrdinalIgnoreCase);
    }
}
