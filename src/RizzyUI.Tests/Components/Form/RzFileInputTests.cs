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
        Assert.Equal("draggingState", container.GetAttribute("x-bind:data-dragging"));
        Assert.Equal("false", container.GetAttribute("data-disabled"));

        var nativeInput = cut.Find("input[data-slot='native-input']");
        Assert.Equal("file", nativeInput.GetAttribute("type"));
        Assert.Equal(cut.Instance.InputId, nativeInput.Id);
        Assert.Equal($"{cut.Instance.DescriptionId} {cut.Instance.StatusId}", nativeInput.GetAttribute("aria-describedby"));
        Assert.Equal(cut.Instance.ListId, nativeInput.GetAttribute("aria-controls"));
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
        Assert.Equal("false", trigger.GetAttribute("aria-disabled"));
        Assert.Equal(cut.Instance.ListId, trigger.GetAttribute("aria-controls"));
        Assert.Equal($"{cut.Instance.DescriptionId} {cut.Instance.StatusId}", trigger.GetAttribute("aria-describedby"));
        Assert.Equal("Upload files", trigger.GetAttribute("aria-label"));
        Assert.Equal("trigger", trigger.GetAttribute("x-on:click"));
        Assert.Equal("trigger", trigger.GetAttribute("x-on:keydown.enter.prevent"));
        Assert.Equal("trigger", trigger.GetAttribute("x-on:keydown.space.prevent"));

        var nativeInput = cut.Find("input[data-slot='native-input']");
        Assert.Equal("attachments", nativeInput.GetAttribute("name"));
        Assert.Equal(".png,.jpg", nativeInput.GetAttribute("accept"));
        Assert.Equal("Upload files", nativeInput.GetAttribute("aria-label"));
        Assert.True(nativeInput.HasAttribute("multiple"));
    }

    [Fact]
    public void RzFileInput_RendersFileListPreviewAndRemoveAccessibilityBindings()
    {
        var cut = Render<RzFileInput>();

        var list = cut.Find("ul[data-slot='list']");
        Assert.Equal(cut.Instance.ListId, list.Id);
        Assert.Equal("Selected files", list.GetAttribute("aria-label"));
        Assert.Equal("hasFiles", list.GetAttribute("x-show"));

        Assert.Contains(@"data-slot=""preview-image""", cut.Markup);
        Assert.Contains(@"x-show=""file.isImage""", cut.Markup);
        Assert.Contains(@"x-bind:src=""file.previewUrl""", cut.Markup);
        Assert.Contains(@"x-bind:alt=""getPreviewAlt(file)""", cut.Markup);
        Assert.Contains(@"data-slot=""remove-button""", cut.Markup);
        Assert.Contains(@"type=""button""", cut.Markup);
        Assert.Contains(@"x-bind:data-index=""index""", cut.Markup);
        Assert.Contains(@"x-bind:aria-label=""getRemoveLabel(file)""", cut.Markup);
        Assert.Contains(@"x-on:click=""removeFileByIndex""", cut.Markup);
    }

    [Fact]
    public void RzFileInput_RendersDescriptionAndPoliteStatusRegion()
    {
        var cut = Render<RzFileInput>();

        var description = cut.Find("[data-slot='description']");
        Assert.Equal(cut.Instance.DescriptionId, description.Id);
        Assert.Contains("Choose files", description.TextContent);

        var status = cut.Find("[data-slot='status']");
        Assert.Equal(cut.Instance.StatusId, status.Id);
        Assert.Equal("status", status.GetAttribute("role"));
        Assert.Equal("polite", status.GetAttribute("aria-live"));
        Assert.Equal("true", status.GetAttribute("aria-atomic"));
        Assert.Equal("statusText", status.GetAttribute("x-text"));
    }

    [Fact]
    public void RzFileInput_DisabledStateDisablesNativeInputAndRemovesTriggerFromTabOrder()
    {
        var cut = Render<RzFileInput>(p => p.Add(x => x.Disabled, true));

        var nativeInput = cut.Find("input[data-slot='native-input']");
        Assert.True(nativeInput.HasAttribute("disabled"));

        var container = cut.Find("[data-slot='container']");
        Assert.Equal("true", container.GetAttribute("data-disabled"));

        var trigger = cut.Find("[data-slot='trigger']");
        Assert.Equal("true", trigger.GetAttribute("aria-disabled"));
        Assert.Equal("-1", trigger.GetAttribute("tabindex"));
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

        var trigger = cut.Find("[data-slot='trigger']");
        Assert.Equal("draggingState", trigger.GetAttribute("x-bind:data-dragging"));
    }

    [Fact]
    public void RzFileInput_AlpineRuntimeContainsAccessibleStateAndEventBehavior()
    {
        var source = File.ReadAllText(FindRepositoryFile("packages/rizzyui/src/js/lib/components/rzFileInput.js"));

        Assert.Contains("getRemoveLabel(file)", source);
        Assert.Contains("getPreviewAlt(file)", source);
        Assert.Contains("statusText", source);
        Assert.Contains("rz:file-input:state-change", source);
        Assert.Contains("input.disabled || this.isDisabled()", source);
        Assert.Contains("destroy()", source);
        Assert.Contains("this.revokePreviews();", source);
    }

    [Fact]
    public void RzFileInput_DefaultAndCspBundleOwnershipIsPreserved()
    {
        var bundle = File.ReadAllText(FindRepositoryFile("packages/rizzyui/src/js/bundles/advanced-input-runtime.js"));
        var manifest = File.ReadAllText(FindRepositoryFile("packages/rizzyui/src/js/runtime/componentBundleManifest.js"));

        Assert.Contains("export { default as rzFileInput }", bundle);
        Assert.Contains("rzFileInput: 'advanced-input-runtime'", manifest);
    }

    private static string FindRepositoryFile(string relativePath)
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var candidate = Path.Combine(current.FullName, relativePath);
            if (File.Exists(candidate))
                return candidate;

            current = current.Parent;
        }

        throw new FileNotFoundException($"Could not find {relativePath} from {AppContext.BaseDirectory}.");
    }
}
