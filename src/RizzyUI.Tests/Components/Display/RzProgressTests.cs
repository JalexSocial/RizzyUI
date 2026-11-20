using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Display;

public class RzProgressTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzProgressTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersOneProgressbarRootWithItsValues()
    {
        var cut = Render<RzProgress>(p => p
            .Add(x => x.Id, "upload")
            .Add(x => x.Value, 33)
            .AddUnmatched("aria-labelledby", "upload-label"));

        var root = cut.Find("[data-slot='progress']");
        Assert.Equal("upload", root.Id);
        Assert.Equal("progressbar", root.GetAttribute("role"));
        Assert.Equal("rzProgress", root.GetAttribute("x-data"));
        Assert.Equal("0", root.GetAttribute("aria-valuemin"));
        Assert.Equal("100", root.GetAttribute("aria-valuemax"));
        Assert.Equal("33", root.GetAttribute("aria-valuenow"));
        Assert.Equal("upload-label", root.GetAttribute("aria-labelledby"));
        Assert.Equal("loading", root.GetAttribute("data-state"));
        // No English default name, no valuetext unless given, no nonce on a div.
        Assert.False(root.HasAttribute("aria-label"));
        Assert.False(root.HasAttribute("aria-valuetext"));
        Assert.False(root.HasAttribute("nonce"));
        Assert.Single(cut.FindAll("[role='progressbar']"));
    }

    [Fact]
    public void RendersADefaultIndicatorWithoutChildContent()
    {
        var cut = Render<RzProgress>(p => p.Add(x => x.Value, 50));

        var indicator = cut.Find("[data-slot='progress'] > [data-slot='progress-indicator']");
        Assert.Equal("indicatorStyle", indicator.GetAttribute("x-bind:style"));
        Assert.Contains("bg-primary", indicator.ClassList);
        // No inline style: a strict CSP would block it. The runtime positions the bar.
        Assert.False(indicator.HasAttribute("style"));
    }

    [Fact]
    public void ClassesMergeOnTheTrackAndTheIndicator()
    {
        RenderFragment indicator = b =>
        {
            b.OpenComponent<ProgressIndicator>(0);
            b.AddAttribute(1, "class", "bg-success");
            b.CloseComponent();
        };

        var cut = Render<RzProgress>(p => p
            .Add(x => x.Value, 10)
            .AddUnmatched("class", "h-1 bg-muted")
            .Add(x => x.ChildContent, indicator));

        var track = cut.Find("[data-slot='progress']");
        Assert.Contains("h-1", track.ClassList);
        Assert.DoesNotContain("h-2", track.ClassList);
        Assert.Contains("bg-muted", track.ClassList);
        Assert.DoesNotContain("bg-primary/20", track.ClassList);

        var bar = cut.Find("[data-slot='progress-indicator']");
        Assert.Contains("bg-success", bar.ClassList);
        Assert.DoesNotContain("bg-primary", bar.ClassList);
    }

    [Fact]
    public void NullValueIsIndeterminate()
    {
        var cut = Render<RzProgress>(p => p.Add(x => x.Value, (double?)null));

        var root = cut.Find("[role='progressbar']");
        Assert.False(root.HasAttribute("aria-valuenow"));
        Assert.Equal("indeterminate", root.GetAttribute("data-state"));
        // The indicator animates through the track's data-state, which the runtime keeps in sync.
        Assert.Contains("in-data-[state=indeterminate]:animate-progress-indeterminate", cut.Find("[data-slot='progress-indicator']").ClassList);
    }

    [Fact]
    public void DecimalValuesRangesAndValueText()
    {
        var cut = Render<RzProgress>(p => p
            .Add(x => x.Value, 2.5)
            .Add(x => x.Min, 1)
            .Add(x => x.Max, 4)
            .Add(x => x.ValueText, "2.5 of 4 GB"));

        var root = cut.Find("[role='progressbar']");
        Assert.Equal("2.5", root.GetAttribute("aria-valuenow"));
        Assert.Equal("1", root.GetAttribute("aria-valuemin"));
        Assert.Equal("4", root.GetAttribute("aria-valuemax"));
        Assert.Equal("2.5 of 4 GB", root.GetAttribute("aria-valuetext"));
        Assert.Equal(50, cut.Instance.Percentage);
    }

    [Fact]
    public void ValuesOutsideTheRangeAreClamped()
    {
        var cut = Render<RzProgress>(p => p.Add(x => x.Value, 150));

        var root = cut.Find("[role='progressbar']");
        Assert.Equal("100", root.GetAttribute("aria-valuenow"));
        Assert.Equal("complete", root.GetAttribute("data-state"));
        Assert.Equal(100, cut.Instance.Percentage);
    }

    [Fact]
    public void AriaLabelParameterAndAttributesAreBothSupported()
    {
        var byParameter = Render<RzProgress>(p => p.Add(x => x.Value, 1).Add(x => x.AriaLabel, "Upload"));
        var byAttribute = Render<RzProgress>(p => p.Add(x => x.Value, 1)
            .AddUnmatched("aria-label", "Download")
            .AddUnmatched("aria-valuetext", "1 file"));

        Assert.Equal("Upload", byParameter.Find("[role='progressbar']").GetAttribute("aria-label"));
        Assert.Equal("Download", byAttribute.Find("[role='progressbar']").GetAttribute("aria-label"));
        Assert.Equal("1 file", byAttribute.Find("[role='progressbar']").GetAttribute("aria-valuetext"));
    }

    [Theory]
    [InlineData(StatusColor.Success, "bg-success")]
    [InlineData(StatusColor.Destructive, "bg-destructive")]
    [InlineData(StatusColor.Warning, "bg-warning")]
    public void VariantColorsTheIndicator(StatusColor variant, string expectedClass)
    {
        var cut = Render<RzProgress>(p => p.Add(x => x.Value, 40).Add(x => x.Variant, variant));

        Assert.Contains(expectedClass, cut.Find("[data-slot='progress-indicator']").ClassList);
    }

    [Fact]
    public void ProgressLabelShowsThePercentageAndIsHiddenFromAssistiveTechnology()
    {
        RenderFragment content = b =>
        {
            b.OpenComponent<ProgressIndicator>(0);
            b.CloseComponent();
            b.OpenComponent<ProgressLabel>(1);
            b.CloseComponent();
        };

        var cut = Render<RzProgress>(p => p.Add(x => x.Value, 12.5).Add(x => x.ChildContent, content));

        var label = cut.Find("[data-slot='progress-label']");
        Assert.Equal("span", label.TagName.ToLowerInvariant());
        Assert.Equal("true", label.GetAttribute("aria-hidden"));
        Assert.Equal("13%", label.TextContent.Trim());
        Assert.Equal("percentLabel", label.QuerySelector("span")!.GetAttribute("x-text"));
    }

    [Fact]
    public void SubcomponentsOutsideRzProgressThrow()
    {
        Assert.Throws<InvalidOperationException>(() => Render<ProgressIndicator>());
        Assert.Throws<InvalidOperationException>(() => Render<ProgressLabel>());
    }
}
