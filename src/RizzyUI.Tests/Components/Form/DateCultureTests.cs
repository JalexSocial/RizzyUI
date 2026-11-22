using System.Globalization;
using System.Text.Json;
using Bunit;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace RizzyUI.Tests.Components.Form;

/// <summary>
/// Summit SF-073 (date components follow the request culture) and SF-068 (RzDateEdit does not hide
/// its field label behind a fixed aria-label).
/// </summary>
public class DateCultureTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public DateCultureTests(WebAppFixture fixture) : base(fixture)
    {
        // The host's configured options, with the default asset URLs (bUnit's own container has empty ones).
        Services.AddSingleton(fixture.Host.Services.GetRequiredService<IOptions<RizzyUIConfig>>());
    }

    private sealed class DateModel
    {
        public DateTime? Date { get; set; }
    }

    private sealed class CultureScope : IDisposable
    {
        private readonly CultureInfo _culture = CultureInfo.CurrentCulture;
        private readonly CultureInfo _uiCulture = CultureInfo.CurrentUICulture;

        public CultureScope(string name)
        {
            CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo(name);
            CultureInfo.CurrentUICulture = CultureInfo.GetCultureInfo(name);
        }

        public void Dispose()
        {
            CultureInfo.CurrentCulture = _culture;
            CultureInfo.CurrentUICulture = _uiCulture;
        }
    }

    private IRenderedComponent<RzDateEdit> RenderDateEdit(FlatpickrOptions? options = null, string? ariaLabel = null) =>
        Render<RzDateEdit>(parameters =>
        {
            var model = new DateModel();
            parameters.Add(p => p.For, () => model.Date).AddCascadingValue(new EditContext(model));
            if (options != null) parameters.Add(p => p.Options, options);
            if (ariaLabel != null) parameters.Add(p => p.AriaLabel, ariaLabel);
        });

    private static string Locale(IRenderedComponent<RzDateEdit> cut) =>
        JsonDocument.Parse(cut.Find("[x-data='rzDateEdit']").GetAttribute("data-config")!).RootElement
            .GetProperty("options").GetProperty("locale").GetString()!;

    private static string Assets(IRenderedComponent<RzDateEdit> cut) =>
        cut.Find("[x-data='rzDateEdit']").GetAttribute("data-assets")!;

    [Fact]
    public void DateEdit_FollowsTheRequestCultureAndLoadsItsLocaleAfterFlatpickr()
    {
        using var _ = new CultureScope("de-DE");
        var cut = RenderDateEdit();

        Assert.Equal("de", Locale(cut));
        var assets = Assets(cut);
        var core = assets.IndexOf("flatpickr.min.js", StringComparison.Ordinal);
        var locale = assets.IndexOf("/dist/l10n/de.js", StringComparison.Ordinal);
        Assert.True(core >= 0 && locale > core, assets);
        Assert.Contains("sha256-", assets);
    }

    [Theory]
    [InlineData("en-US", "en", null)]
    [InlineData("de-AT", "at", "at")]
    [InlineData("zh-TW", "zh_tw", "zh-tw")]
    [InlineData("el-GR", "gr", "gr")]
    [InlineData("pt-BR", "pt", "pt")]
    public void DateEdit_MapsCulturesToFlatpickrLocales(string culture, string expectedLocale, string? expectedFile)
    {
        using var _ = new CultureScope(culture);
        var cut = RenderDateEdit();

        Assert.Equal(expectedLocale, Locale(cut));
        if (expectedFile is null)
            Assert.DoesNotContain("/l10n/", Assets(cut));
        else
            Assert.Contains($"/dist/l10n/{expectedFile}.js", Assets(cut));
    }

    [Fact]
    public void DateEdit_AnExplicitLocaleWinsAndLoadsItsFile()
    {
        using var _ = new CultureScope("en-US");
        var cut = RenderDateEdit(new FlatpickrOptions { Locale = "fr" });

        Assert.Equal("fr", Locale(cut));
        Assert.Contains("/dist/l10n/fr.js", Assets(cut));
    }

    [Fact]
    public void DateEdit_HasNoDefaultAccessibleNameSoItsLabelNamesIt()
    {
        var cut = RenderDateEdit();

        Assert.False(cut.Find("input[data-input]").HasAttribute("aria-label"));
        var root = cut.Find("[data-slot='date-edit']");
        Assert.False(root.HasAttribute("aria-label"));
        Assert.False(root.HasAttribute("role"));
    }

    [Fact]
    public void DateEdit_AriaLabelNamesAnUnlabeledInput()
    {
        var cut = RenderDateEdit(ariaLabel: "Departure date");

        Assert.Equal("Departure date", cut.Find("input[data-input]").GetAttribute("aria-label"));
    }

    [Fact]
    public void Calendar_FollowsTheRequestCulture()
    {
        using var _ = new CultureScope("de-DE");
        var cut = Render<global::RizzyUI.RzCalendar>();

        var json = JsonDocument.Parse(cut.Find($"script#{cut.Instance.Id}-config").TextContent).RootElement;
        Assert.Equal("de-DE", FindLocale(json));
    }

    [Fact]
    public void Calendar_AnExplicitLocaleWins()
    {
        using var _ = new CultureScope("de-DE");
        var cut = Render<global::RizzyUI.RzCalendar>(p => p.Add(x => x.Options, new VanillaCalendarOptions { Locale = "fr-FR" }));

        var json = JsonDocument.Parse(cut.Find($"script#{cut.Instance.Id}-config").TextContent).RootElement;
        Assert.Equal("fr-FR", FindLocale(json));
    }

    [Fact]
    public void Provider_FollowsTheRequestCulture()
    {
        using var _ = new CultureScope("de-DE");
        var cut = Render<global::RizzyUI.RzCalendarProvider>();

        Assert.Equal("de-DE", cut.Find("div[x-data='rzCalendarProvider']").GetAttribute("data-locale"));
    }

    private static string? FindLocale(JsonElement element)
    {
        if (element.ValueKind != JsonValueKind.Object) return null;
        foreach (var property in element.EnumerateObject())
        {
            if (property.Name == "locale") return property.Value.GetString();
            var nested = FindLocale(property.Value);
            if (nested is not null) return nested;
        }
        return null;
    }
}
