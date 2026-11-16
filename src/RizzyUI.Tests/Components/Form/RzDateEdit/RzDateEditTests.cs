using System.Globalization;
using System.Text.Json;
using Bunit;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form;

public class RzDateEditTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzDateEditTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private sealed class DateModel
    {
        public DateTime? Date { get; set; }
    }

    private IRenderedComponent<RzDateEdit> RenderDateEdit(DateModel model, FlatpickrOptions? options = null) =>
        Render<RzDateEdit>(parameters =>
        {
            parameters.Add(p => p.For, () => model.Date).AddCascadingValue(new EditContext(model));
            if (options != null)
                parameters.Add(p => p.Options, options);
        });

    private static JsonElement Config(IRenderedComponent<RzDateEdit> cut) =>
        JsonDocument.Parse(cut.Find("[x-data='rzDateEdit']").GetAttribute("data-config")!).RootElement;

    [Theory]
    [InlineData("Y-m-d", "yyyy-MM-dd")]
    [InlineData("d/m/Y", "dd\\/MM\\/yyyy")]
    [InlineData("Y-m-d H:i", "yyyy\\-MM\\-dd\\ HH\\:mm")]
    [InlineData("F j, Y", "MMMM\\ d\\,\\ yyyy")]
    [InlineData("h:i K", "h\\:mm\\ tt")]
    [InlineData("j", "%d")]
    [InlineData("\\D\\a\\y j", "\\D\\a\\y\\ d")]
    public void FlatpickrDateFormat_ConvertsTokens(string flatpickr, string expected)
    {
        var actual = FlatpickrDateFormat.ToDotNet(flatpickr);

        // Compare the formatted output rather than the escaping style of the literals.
        var date = new DateTime(2026, 11, 5, 14, 7, 9);
        Assert.NotNull(actual);
        Assert.Equal(date.ToString(expected, CultureInfo.InvariantCulture), date.ToString(actual, CultureInfo.InvariantCulture));
    }

    [Theory]
    [InlineData("Y-m-d", "2026-11-05")]
    [InlineData("d/m/Y", "05/11/2026")]
    [InlineData("F j, Y", "November 5, 2026")]
    [InlineData("Y-m-d H:i", "2026-11-05 14:07")]
    [InlineData("h:i K", "2:07 PM")]
    public void FlatpickrDateFormat_FormatsLikeFlatpickr(string flatpickr, string expected)
    {
        var format = FlatpickrDateFormat.ToDotNet(flatpickr)!;

        Assert.Equal(expected, new DateTime(2026, 11, 5, 14, 7, 9).ToString(format, CultureInfo.InvariantCulture));
    }

    [Theory]
    [InlineData("W")]
    [InlineData("U")]
    [InlineData("Z")]
    [InlineData("J F")]
    public void FlatpickrDateFormat_ReturnsNullForTokensWithoutDotNetEquivalent(string flatpickr)
    {
        Assert.Null(FlatpickrDateFormat.ToDotNet(flatpickr));
    }

    [Fact]
    public void DefaultFormat_RendersIsoValue()
    {
        var cut = RenderDateEdit(new DateModel { Date = new DateTime(2026, 11, 20) });

        Assert.Equal("2026-11-20", cut.Find("input[data-input]").GetAttribute("value"));
    }

    [Fact]
    public void CustomFormat_RendersValueInThatFormat()
    {
        var cut = RenderDateEdit(new DateModel { Date = new DateTime(2026, 11, 20) }, new FlatpickrOptions { DateFormat = "d/m/Y" });

        Assert.Equal("20/11/2026", cut.Find("input[data-input]").GetAttribute("value"));
    }

    [Fact]
    public void UnsupportedFormat_FallsBackToIso()
    {
        var cut = RenderDateEdit(new DateModel { Date = new DateTime(2026, 11, 20) }, new FlatpickrOptions { DateFormat = "W/Y" });

        Assert.Equal("2026-11-20", cut.Find("input[data-input]").GetAttribute("value"));
    }

    [Fact]
    public void Config_ContainsOptionsAndIsoDefaultDate()
    {
        var options = new FlatpickrOptions { Locale = "en", DateFormat = "d/m/Y", MinDate = new DateTime(2026, 11, 1), AllowInput = true };
        var cut = RenderDateEdit(new DateModel { Date = new DateTime(2026, 11, 20, 9, 30, 0) }, options);

        var config = Config(cut).GetProperty("options");
        Assert.Equal("d/m/Y", config.GetProperty("dateFormat").GetString());
        Assert.Equal("en", config.GetProperty("locale").GetString());
        Assert.True(config.GetProperty("allowInput").GetBoolean());
        Assert.Equal("2026-11-01T00:00:00", config.GetProperty("minDate").GetString());
        Assert.Equal("2026-11-20T09:30:00", config.GetProperty("defaultDate").GetString());
        Assert.False(config.TryGetProperty("maxDate", out _));
    }

    [Fact]
    public void ExplicitDefaultDate_IsKept()
    {
        var cut = RenderDateEdit(new DateModel { Date = new DateTime(2026, 11, 20) }, new FlatpickrOptions { DefaultDate = "today" });

        Assert.Equal("today", Config(cut).GetProperty("options").GetProperty("defaultDate").GetString());
    }

    [Fact]
    public void SharedOptionsInstance_IsNotModified()
    {
        var shared = new FlatpickrOptions { Locale = "en" };

        var first = RenderDateEdit(new DateModel { Date = new DateTime(2026, 11, 20) }, shared);
        var second = RenderDateEdit(new DateModel { Date = new DateTime(2026, 12, 24) }, shared);

        Assert.Null(shared.DefaultDate);
        Assert.Equal("2026-11-20T00:00:00", Config(first).GetProperty("options").GetProperty("defaultDate").GetString());
        Assert.Equal("2026-12-24T00:00:00", Config(second).GetProperty("options").GetProperty("defaultDate").GetString());
    }

    [Fact]
    public void Markup_KeepsAlpineHooks()
    {
        var cut = RenderDateEdit(new DateModel());

        var root = cut.Find("[x-data='rzDateEdit']");
        var input = cut.Find("input[data-input]");
        Assert.Equal(root.GetAttribute("data-uid") + "-input", input.Id);
        Assert.Equal("Select date", input.GetAttribute("aria-label"));
        Assert.Equal("", input.GetAttribute("value") ?? "");
        Assert.Equal(JsonValueKind.Array, JsonDocument.Parse(root.GetAttribute("data-assets")!).RootElement.ValueKind);
    }
}
