using Bunit;
using Microsoft.AspNetCore.Components;
using System.Text.Json;

namespace RizzyUI.Tests.Components.TextAnimations;

public class RzTypingAnimationTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzTypingAnimationTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void Renders_DefaultRootAsSpan_WithId_AndRootDataSlot()
    {
        var cut = Render<RzTypingAnimation>();

        var root = cut.Find("[data-slot='typing-animation']");

        Assert.Equal("span", root.TagName.ToLowerInvariant());
        Assert.Equal(cut.Instance.Id, root.GetAttribute("id"));
        Assert.Equal("typing-animation", root.GetAttribute("data-slot"));
    }

    [Fact]
    public void Renders_AlpineChildContainer_WithRequiredHooks()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Hello" }));

        var alpine = cut.Find($"div[data-alpine-root='{cut.Instance.Id}']");

        Assert.Equal("rzTypingAnimation", alpine.GetAttribute("x-data"));
        Assert.NotNull(alpine.GetAttribute("data-assets"));
        Assert.NotNull(alpine.GetAttribute("data-nonce"));
        Assert.NotNull(alpine.GetAttribute("data-config"));
    }

    [Fact]
    public void Renders_DefaultConfiguration_InSerializedDataConfig()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Hello" }));

        var config = GetConfig(cut);

        Assert.Equal(100, config.GetProperty("duration").GetInt32());
        Assert.Equal(1000, config.GetProperty("pauseDelay").GetInt32());
        Assert.False(config.GetProperty("loop").GetBoolean());
        Assert.True(config.GetProperty("startOnView").GetBoolean());
        Assert.True(config.GetProperty("showCursor").GetBoolean());
        Assert.True(config.GetProperty("blinkCursor").GetBoolean());
        Assert.Equal("line", config.GetProperty("cursorStyle").GetString());
    }

    [Fact]
    public void Renders_HiddenSourceSlot_WhenUsingChildContent()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .AddChildContent("Hello from child source"));

        var source = cut.Find("[data-slot='source']");

        Assert.Equal("Hello from child source", source.TextContent.Trim());
        Assert.True(source.HasAttribute("hidden"));
        Assert.Equal("true", source.GetAttribute("aria-hidden"));
    }

    [Fact]
    public void Words_TakePrecedence_OverChildContent()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Words win" })
            .AddChildContent("Child should not be authoritative"));

        var config = GetConfig(cut);

        Assert.Equal("Words win", config.GetProperty("words")[0].GetString());
        Assert.Empty(cut.FindAll("[data-slot='source']"));
    }

    [Fact]
    public void Renders_TextSlot_Always()
    {
        var cut = Render<RzTypingAnimation>();

        Assert.NotNull(cut.Find("[data-slot='text']"));
    }

    [Fact]
    public void Renders_CursorSlot_ByDefault()
    {
        var cut = Render<RzTypingAnimation>(p => p.AddChildContent("Cursor"));

        var cursor = cut.Find("[data-slot='cursor']");

        Assert.Equal("true", cursor.GetAttribute("aria-hidden"));
        Assert.Equal("line", cursor.GetAttribute("data-cursor-style"));
    }

    [Fact]
    public void Omits_CursorSlot_WhenShowCursorFalse()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.ShowCursor, false)
            .Add(x => x.Words, new[] { "No cursor" }));

        Assert.Empty(cut.FindAll("[data-slot='cursor']"));
    }

    [Theory]
    [InlineData(TypingAnimationCursorStyle.Block, "block")]
    [InlineData(TypingAnimationCursorStyle.Underscore, "underscore")]
    public void Renders_CursorStyleMetadata_ForBlockAndUnderscore(TypingAnimationCursorStyle style, string expected)
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Cursor" })
            .Add(x => x.CursorStyle, style));

        var cursor = cut.Find("[data-slot='cursor']");

        Assert.Equal(expected, cursor.GetAttribute("data-cursor-style"));
    }

    [Fact]
    public void Merges_UserClasses_IntoRoot()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Class merge" })
            .AddUnmatched("class", "text-4xl font-bold"));

        var root = cut.Find("[data-slot='typing-animation']");

        Assert.Contains("text-4xl", root.ClassList);
        Assert.Contains("font-bold", root.ClassList);
    }

    [Fact]
    public void Passes_AdditionalAttributes_ToOuterRoot()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Attrs" })
            .AddUnmatched("aria-live", "polite")
            .AddUnmatched("data-test-id", "typing-root")
            .AddUnmatched("hx-get", "/partial"));

        var root = cut.Find("[data-slot='typing-animation']");
        var alpine = cut.Find("[x-data='rzTypingAnimation']");

        Assert.Equal("polite", root.GetAttribute("aria-live"));
        Assert.Equal("typing-root", root.GetAttribute("data-test-id"));
        Assert.Equal("/partial", root.GetAttribute("hx-get"));
        Assert.Null(alpine.GetAttribute("aria-live"));
        Assert.Null(alpine.GetAttribute("hx-get"));
    }

    [Fact]
    public void ElementOverride_ChangesRootTag_WithoutBreakingAlpineStructure()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Element, "div")
            .Add(x => x.Words, new[] { "Element override" }));

        var root = cut.Find("[data-slot='typing-animation']");

        Assert.Equal("div", root.TagName.ToLowerInvariant());
        Assert.NotNull(cut.Find("[x-data='rzTypingAnimation']"));
    }

    [Fact]
    public void Renders_NoScriptFallback_WhenSourceExists()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Fallback first" }));

        var fallback = cut.Find("noscript [data-slot='noscript']");

        Assert.Equal("Fallback first", fallback.TextContent.Trim());
    }

    [Fact]
    public void Renders_EmptyState_Gracefully_WhenNoSourceExists()
    {
        var cut = Render<RzTypingAnimation>();

        Assert.NotNull(cut.Find("[data-slot='typing-animation']"));
        Assert.NotNull(cut.Find("[data-slot='text']"));
        Assert.Empty(cut.FindAll("[data-slot='cursor']"));
        Assert.Empty(cut.FindAll("[data-slot='source']"));
    }

    [Fact]
    public void Clamps_InvalidTimingInputs_InSerializedConfig()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Clamp" })
            .Add(x => x.Duration, -10)
            .Add(x => x.TypeSpeed, -5)
            .Add(x => x.DeleteSpeed, -3)
            .Add(x => x.Delay, -4)
            .Add(x => x.PauseDelay, -20));

        var config = GetConfig(cut);

        Assert.Equal(1, config.GetProperty("duration").GetInt32());
        Assert.Equal(1, config.GetProperty("typeSpeed").GetInt32());
        Assert.Equal(1, config.GetProperty("deleteSpeed").GetInt32());
        Assert.Equal(0, config.GetProperty("delay").GetInt32());
        Assert.Equal(0, config.GetProperty("pauseDelay").GetInt32());
    }

    [Fact]
    public void DoesNotRenderInteractiveRoleOrTabIndex_BecauseComponentIsPassiveText()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "Passive" }));

        var markup = cut.Markup;

        Assert.DoesNotContain("role=\"button\"", markup);
        Assert.DoesNotContain("tabindex=", markup, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("aria-expanded", markup, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("aria-pressed", markup, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void DoesNotDependOnBlazorInteractiveMarkup()
    {
        var cut = Render<RzTypingAnimation>(p => p
            .Add(x => x.Words, new[] { "SSR" }));

        var markup = cut.Markup;

        Assert.DoesNotContain("blazor:", markup, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("@on", markup, StringComparison.OrdinalIgnoreCase);
    }

    private static JsonElement GetConfig(IRenderedComponent<RzTypingAnimation> cut)
    {
        var json = cut.Find("[x-data='rzTypingAnimation']").GetAttribute("data-config");
        using var document = JsonDocument.Parse(json!);
        return document.RootElement.Clone();
    }
}
