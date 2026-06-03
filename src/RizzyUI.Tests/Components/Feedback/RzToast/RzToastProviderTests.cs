using AngleSharp.Dom;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI.Tests.Components.Feedback.RzToast;

public class RzToastProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    private static readonly string[] CanonicalPositions =
    [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
        "center",
        "left-center",
        "right-center"
    ];

    private static readonly string[] SimpleNotifyPositionAliases =
    [
        "right top",
        "top right",
        "left top",
        "top left",
        "right bottom",
        "bottom right",
        "left bottom",
        "bottom left",
        "top center",
        "center top",
        "x-center top",
        "top x-center",
        "bottom center",
        "center bottom",
        "x-center bottom",
        "bottom x-center",
        "center",
        "left center",
        "left y-center",
        "y-center left",
        "right center",
        "right y-center",
        "y-center right"
    ];

    public RzToastProviderTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersProviderRootWithAccessibleRegionContract()
    {
        var cut = Render<RzToastProvider>(parameters => parameters
            .Add(p => p.Id, "toast-provider-test"));

        var root = cut.Find("[data-rz-toast-provider]");
        Assert.Equal("toast-provider-test", root.Id);
        Assert.Equal("toast-provider", root.GetAttribute("data-slot"));
        Assert.Equal("region", root.GetAttribute("role"));
        Assert.False(string.IsNullOrWhiteSpace(root.GetAttribute("aria-label")));
        Assert.DoesNotContain("x-data", cut.Markup);
    }

    [Fact]
    public void RendersOneViewportAndMatchingStackForEveryCanonicalPosition()
    {
        var cut = Render<RzToastProvider>(parameters => parameters
            .Add(p => p.Position, ToastPosition.BottomLeft));

        var viewports = cut.FindAll("[data-rz-toast-viewport]");
        var stacks = cut.FindAll("[data-rz-toast-stack]");

        Assert.Equal(CanonicalPositions.Length, viewports.Count);
        Assert.Equal(CanonicalPositions.Length, stacks.Count);

        foreach (var position in CanonicalPositions)
        {
            var viewport = Assert.Single(viewports, element => element.GetAttribute("data-toast-position") == position);
            Assert.Equal("toast-viewport", viewport.GetAttribute("data-slot"));

            var stack = Assert.Single(viewport.QuerySelectorAll("[data-rz-toast-stack]"), element => element.GetAttribute("data-toast-position") == position);
            Assert.Equal("toast-stack", stack.GetAttribute("data-slot"));
        }
    }

    [Fact]
    public void EmitsParseableJsonConfigWithRequiredShape()
    {
        var cut = Render<RzToastProvider>(parameters => parameters
            .Add(p => p.Id, "provider-json-test"));

        using var document = ParseConfig(cut);
        var root = document.RootElement;

        Assert.Equal(1, root.GetProperty("version").GetInt32());
        Assert.Equal("provider-json-test", root.GetProperty("providerId").GetString());

        foreach (var propertyName in new[] { "defaults", "slots", "statuses", "positions", "tones", "animations", "states", "icons", "aliases" })
        {
            Assert.True(root.TryGetProperty(propertyName, out _), $"Missing config property '{propertyName}'.");
        }

        AssertJsonObjectContains(root.GetProperty("positions"), CanonicalPositions);
        AssertJsonObjectContains(root.GetProperty("statuses"), ["default", "info", "success", "warning", "error", "loading"]);
        AssertJsonObjectContains(root.GetProperty("tones"), ["subtle", "solid", "outline", "ghost"]);
        AssertJsonObjectContains(root.GetProperty("animations"), ["fade", "slide", "none"]);
        AssertJsonObjectContains(root.GetProperty("states"), ["entering", "visible", "leaving"]);
        AssertJsonObjectContains(root.GetProperty("icons"), ["default", "info", "success", "warning", "error", "loading", "close"]);
        AssertJsonObjectContains(root.GetProperty("aliases").GetProperty("positions"), SimpleNotifyPositionAliases);
    }

    [Fact]
    public void ParametersFlowIntoJsonDefaultsAndAllStacksStillRender()
    {
        var cut = Render<RzToastProvider>(parameters => parameters
            .Add(p => p.Position, ToastPosition.BottomCenter)
            .Add(p => p.Duration, 7500)
            .Add(p => p.Speed, 125)
            .Add(p => p.MaxVisible, 2)
            .Add(p => p.OverflowStrategy, ToastOverflowStrategy.IgnoreNewest)
            .Add(p => p.PreventDuplicates, true)
            .Add(p => p.CloseButtonAriaLabel, "Close toast")
            .Add(p => p.RegionAriaLabel, "Toast messages"));

        using var document = ParseConfig(cut);
        var defaults = document.RootElement.GetProperty("defaults");

        Assert.Equal("bottom-center", defaults.GetProperty("position").GetString());
        Assert.Equal(7500, defaults.GetProperty("duration").GetInt32());
        Assert.Equal(125, defaults.GetProperty("speed").GetInt32());
        Assert.Equal(2, defaults.GetProperty("maxVisible").GetInt32());
        Assert.Equal("ignore-newest", defaults.GetProperty("overflowStrategy").GetString());
        Assert.True(defaults.GetProperty("preventDuplicates").GetBoolean());
        Assert.Equal("Close toast", defaults.GetProperty("closeButtonAriaLabel").GetString());
        Assert.Equal("Toast messages", defaults.GetProperty("regionAriaLabel").GetString());
        Assert.Equal(CanonicalPositions.Length, cut.FindAll("[data-rz-toast-stack]").Count);
    }

    [Fact]
    public void DefaultDescriptorResolvesNonEmptyClassesForKeySlots()
    {
        var map = BuildClassMap(new RzToastProviderOptions());

        Assert.Contains("pointer-events-none", map.Slots.Base);
        Assert.Contains("fixed", map.Slots.Viewport);
        Assert.Contains("flex-col", map.Slots.Stack);
        Assert.Contains("pointer-events-auto", map.Slots.Toast);
        Assert.Contains("rounded-full", map.Slots.CloseButton);
        Assert.Contains("origin-left", map.Slots.ProgressIndicator);
    }

    [Fact]
    public void ClassMapIncludesEveryStatusPositionToneAnimationAndState()
    {
        var map = BuildClassMap(new RzToastProviderOptions());

        AssertJsonKeysEquivalent(map.Statuses.Keys, ["default", "info", "success", "warning", "error", "loading"]);
        AssertJsonKeysEquivalent(map.Positions.Keys, CanonicalPositions);
        AssertJsonKeysEquivalent(map.Tones.Keys, ["subtle", "solid", "outline", "ghost"]);
        AssertJsonKeysEquivalent(map.Animations.Keys, ["fade", "slide", "none"]);
        AssertJsonKeysEquivalent(map.States.Keys, ["entering", "visible", "leaving"]);

        Assert.All(map.Statuses.Values, classes => Assert.False(string.IsNullOrWhiteSpace(classes.Toast)));
        Assert.All(map.Positions.Values, classes =>
        {
            Assert.False(string.IsNullOrWhiteSpace(classes.Viewport));
            Assert.False(string.IsNullOrWhiteSpace(classes.Stack));
        });
    }

    [Fact]
    public void ClassMapCacheReusesEquivalentInputsAndSeparatesDistinctInputs()
    {
        var theme = RzTheme.ArcticTheme;
        var tv = Services.GetRequiredService<TwVariants>();
        var first = RzToastClassMapBuilder.Build(theme, tv, new RzToastProviderOptions { Duration = 1000 });
        var second = RzToastClassMapBuilder.Build(theme, tv, new RzToastProviderOptions { Duration = 1000 });
        var third = RzToastClassMapBuilder.Build(theme, tv, new RzToastProviderOptions { Duration = 2000 });

        Assert.Same(first, second);
        Assert.NotSame(first, third);
        Assert.NotEqual(first.Defaults.Duration, third.Defaults.Duration);
    }

    [Fact]
    public void ThemeOverrideAffectsGeneratedClasses()
    {
        var theme = RzTheme.ArcticTheme;
        theme.RzToastProvider = new(
            @base: "toast-provider-override",
            slots: new()
            {
                [s => s.Toast] = "toast-override",
                [s => s.Viewport] = "viewport-override",
                [s => s.Stack] = "stack-override"
            });

        var cut = Render(builder =>
        {
            builder.OpenComponent<CascadingValue<RzTheme>>(0);
            builder.AddAttribute(1, "Value", theme);
            builder.AddAttribute(2, "IsFixed", true);
            builder.AddAttribute(3, "ChildContent", (RenderFragment)(child =>
            {
                child.OpenComponent<RzToastProvider>(0);
                child.CloseComponent();
            }));
            builder.CloseComponent();
        });

        var root = cut.Find("[data-rz-toast-provider]");
        Assert.Contains("toast-provider-override", root.ClassList);

        using var document = ParseConfig(cut);
        Assert.Contains("toast-override", document.RootElement.GetProperty("slots").GetProperty("toast").GetString());
        Assert.All(document.RootElement.GetProperty("positions").EnumerateObject(), position =>
        {
            Assert.Contains("viewport-override", position.Value.GetProperty("viewport").GetString());
            Assert.Contains("stack-override", position.Value.GetProperty("stack").GetString());
        });
    }

    private RzToastClassMap BuildClassMap(RzToastProviderOptions options)
    {
        return RzToastClassMapBuilder.Build(RzTheme.ArcticTheme, Services.GetRequiredService<TwVariants>(), options);
    }

    private static JsonDocument ParseConfig<TComponent>(IRenderedComponent<TComponent> cut)
        where TComponent : IComponent
    {
        var script = cut.Find("script[data-rz-toast-config]");
        Assert.Equal("application/json", script.GetAttribute("type"));
        Assert.False(string.IsNullOrWhiteSpace(script.TextContent));
        return JsonDocument.Parse(script.TextContent);
    }

    private static void AssertJsonObjectContains(JsonElement element, IEnumerable<string> expectedKeys)
    {
        var actualKeys = element.EnumerateObject().Select(property => property.Name).ToHashSet(StringComparer.Ordinal);
        foreach (var key in expectedKeys)
        {
            Assert.Contains(key, actualKeys);
        }
    }

    private static void AssertJsonKeysEquivalent(IEnumerable<string> actual, IEnumerable<string> expected)
    {
        Assert.Equal(expected.Order(StringComparer.Ordinal), actual.Order(StringComparer.Ordinal));
    }
}
