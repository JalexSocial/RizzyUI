using System.Globalization;
using System.Text.RegularExpressions;
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components;

/// <summary>
/// Summit SF-060: numbers written into markup (data-*, aria-*, style, JSON) are machine-readable, so
/// they use the invariant culture. Under de-DE a decimal rendered with the current culture is
/// "1,5", which the browser runtime parses as 1 or NaN. Each component that takes a fractional number
/// renders here under de-DE with fractional values, and no attribute may contain a comma decimal.
/// </summary>
public partial class InvariantMarkupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public InvariantMarkupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [GeneratedRegex(@"\d,\d")]
    private static partial Regex CommaDecimal();

    private sealed class GermanCulture : IDisposable
    {
        private readonly CultureInfo _culture = CultureInfo.CurrentCulture;
        private readonly CultureInfo _uiCulture = CultureInfo.CurrentUICulture;

        public GermanCulture()
        {
            CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo("de-DE");
            CultureInfo.CurrentUICulture = CultureInfo.GetCultureInfo("de-DE");
        }

        public void Dispose()
        {
            CultureInfo.CurrentCulture = _culture;
            CultureInfo.CurrentUICulture = _uiCulture;
        }
    }

    private static void AssertInvariant<T>(IRenderedComponent<T> cut) where T : IComponent
    {
        var offenders = cut.FindAll("*")
            .SelectMany(element => element.Attributes.Select(a => (element.TagName, a.Name, a.Value)))
            // JSON (arrays, objects) is written by System.Text.Json, which is invariant; "1.5,7.5" there is a list.
            .Where(a => !a.Value.TrimStart().StartsWith('[') && !a.Value.TrimStart().StartsWith('{'))
            .Where(a => CommaDecimal().IsMatch(a.Value))
            .Select(a => $"<{a.TagName.ToLowerInvariant()} {a.Name}=\"{a.Value}\">")
            .ToList();
        Assert.True(offenders.Count == 0, string.Join(Environment.NewLine, offenders));
    }

    [Fact]
    public void NumberTicker()
    {
        using var _ = new GermanCulture();
        var cut = Render<RzNumberTicker>(p => p
            .Add(x => x.Value, 96356.2m)
            .Add(x => x.StartValue, 0.5m)
            .Add(x => x.Delay, 0.25)
            .Add(x => x.DecimalPlaces, 2));

        AssertInvariant(cut);
        var root = cut.Find("[data-value]");
        Assert.Equal("96356.2", root.GetAttribute("data-value"));
        Assert.Equal("0.5", root.GetAttribute("data-start-value"));
    }

    [Fact]
    public void Slider()
    {
        using var _ = new GermanCulture();
        var cut = Render<RzSlider>(p => p
            .Add(x => x.Min, 0.5)
            .Add(x => x.Max, 10.5)
            .Add(x => x.Step, 0.5)
            .Add(x => x.MinStepsBetweenThumbs, 1.5)
            .Add(x => x.Value, [1.5, 7.5])
            .Add(x => x.AriaLabel, "Price"));

        AssertInvariant(cut);
    }

    [Fact]
    public void ShineBorder()
    {
        using var _ = new GermanCulture();
        AssertInvariant(Render<RzShineBorder>(p => p.Add(x => x.BorderWidth, 1.5).Add(x => x.Duration, 2.5)));
    }

    [Fact]
    public void Progress()
    {
        using var _ = new GermanCulture();
        AssertInvariant(Render<RzProgress>(p => p.Add(x => x.Value, 33.5).Add(x => x.Min, 0.5).Add(x => x.Max, 99.5)));
    }

    [Fact]
    public void AspectRatio()
    {
        using var _ = new GermanCulture();
        AssertInvariant(Render<RzAspectRatio>(p => p.Add(x => x.Ratio, 1.5)));
    }

    [Fact]
    public void TextEffects()
    {
        using var _ = new GermanCulture();
        AssertInvariant(Render<RzAuroraText>(p => p.Add(x => x.Speed, 1.5).AddChildContent("Aurora")));
        AssertInvariant(Render<RzAnimatedGradientText>(p => p.Add(x => x.Speed, 1.5m).AddChildContent("Gradient")));
        AssertInvariant(Render<RzHighlighter>(p => p.Add(x => x.StrokeWidth, 2.5).AddChildContent("Highlight")));
    }

    [Fact]
    public void Confetti()
    {
        using var _ = new GermanCulture();
        AssertInvariant(Render<RzConfetti>(p => p
            .Add(x => x.Angle, 45.5)
            .Add(x => x.Spread, 60.5)
            .Add(x => x.Gravity, 0.75)
            .Add(x => x.OriginX, 0.5)
            .Add(x => x.OriginY, 0.25)));
    }
}
