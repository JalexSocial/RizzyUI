using Bunit;

namespace RizzyUI.Tests.Components.Document.RzEventViewer;

public class RzEventViewerTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzEventViewerTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void EmitsRootSlotsAlpineHooksAndLogSemantics()
    {
        var cut = Render<global::RizzyUI.RzEventViewer>(p => p
            .Add(x => x.EventName, "order-created")
            .Add(x => x.EventNames, "order-updated")
            .Add(x => x.ComponentAssetKeys, ["RzEventViewerJs"]) 
            .AddUnmatched("class", "event-viewer-custom"));

        var root = cut.Find("[data-slot='event-viewer']");
        Assert.Contains("event-viewer-custom", root.ClassList);

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal(root.GetAttribute("id"), alpineRoot.GetAttribute("data-alpine-root"));
        Assert.Equal("rzEventViewer", alpineRoot.GetAttribute("x-data"));
        Assert.Equal("order-created,order-updated", alpineRoot.GetAttribute("data-events"));

        var log = cut.Find("[role='log']");
        Assert.Equal("polite", log.GetAttribute("aria-live"));
    }

    [Fact]
    public void SupportsJsonArrayAndDeduplicatesResolvedEvents()
    {
        var cut = Render<global::RizzyUI.RzEventViewer>(p => p
            .Add(x => x.EventName, "alpha")
            .Add(x => x.EventNames, "[\"alpha\",\"beta\"]"));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("alpha,beta", alpineRoot.GetAttribute("data-events"));
    }

    [Fact]
    public void UsesExplicitLabelsAndBooleanFlagsInMarkup()
    {
        var cut = Render<global::RizzyUI.RzEventViewer>(p => p
            .Add(x => x.PauseButtonText, "Pause now")
            .Add(x => x.ResumeButtonText, "Resume now")
            .Add(x => x.AutoScroll, false)
            .Add(x => x.ShowTimestamp, false));

        var alpineRoot = cut.Find("[data-alpine-root]");
        Assert.Equal("false", alpineRoot.GetAttribute("data-auto-scroll"));
        Assert.Equal("false", alpineRoot.GetAttribute("data-show-timestamp"));
        Assert.Equal("Pause now", alpineRoot.GetAttribute("data-pause-text"));
        Assert.Equal("Resume now", alpineRoot.GetAttribute("data-resume-text"));
    }
}
