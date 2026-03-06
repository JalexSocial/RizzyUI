using Bunit;

using CalendarProviderComponent = global::RizzyUI.RzCalendarProvider;

namespace RizzyUI.Tests.Components.Form.RzCalendar;

public class RzCalendarProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCalendarProviderTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void DefaultRender_EmitsProviderMarkupAndAlpineStateAttributes()
    {
        var cut = Render<CalendarProviderComponent>();
        var root = cut.Find("div[x-data='rzCalendarProvider']");

        Assert.Equal("single", root.GetAttribute("data-mode"));
        Assert.Equal("[]", root.GetAttribute("data-initial-dates"));
        Assert.Equal("en-US", root.GetAttribute("data-locale"));
        Assert.Contains("month", root.GetAttribute("data-format-options"));
    }

    [Fact]
    public void SingleMode_WithValue_SerializesSingleDate()
    {
        var cut = Render<CalendarProviderComponent>(p => p
            .Add(x => x.Mode, SelectionDatesMode.Single)
            .Add(x => x.Value, new DateOnly(2026, 2, 18)));

        Assert.Equal("[\"2026-02-18\"]", cut.Find("div[x-data='rzCalendarProvider']").GetAttribute("data-initial-dates"));
    }

    [Fact]
    public void MultipleMode_DeduplicatesAndSortsValues()
    {
        var cut = Render<CalendarProviderComponent>(p => p
            .Add(x => x.Mode, SelectionDatesMode.Multiple)
            .Add(x => x.Values, new List<DateOnly> { new(2026, 3, 15), new(2026, 3, 2), new(2026, 3, 15) }));

        Assert.Equal("[\"2026-03-02\",\"2026-03-15\"]", cut.Find("div[x-data='rzCalendarProvider']").GetAttribute("data-initial-dates"));
    }

    [Fact]
    public void MultipleRangedMode_NormalizesReverseRangeOrder()
    {
        var cut = Render<CalendarProviderComponent>(p => p
            .Add(x => x.Mode, SelectionDatesMode.MultipleRanged)
            .Add(x => x.Range, new CalendarDateRange
            {
                From = new DateTime(2026, 5, 20),
                To = new DateTime(2026, 5, 10)
            }));

        Assert.Equal("[\"2026-05-10\",\"2026-05-20\"]", cut.Find("div[x-data='rzCalendarProvider']").GetAttribute("data-initial-dates"));
    }

    [Fact]
    public void InvalidModeParameterCombination_ThrowsClearException()
    {
        var ex = Assert.ThrowsAny<Exception>(() => Render<CalendarProviderComponent>(p => p
            .Add(x => x.Mode, SelectionDatesMode.Single)
            .Add(x => x.Values, new List<DateOnly> { new(2026, 1, 1) })));

        Assert.Contains("Mode is 'Single'", ex.InnerException?.Message ?? ex.Message);
    }

    [Fact]
    public void AccessibilityAndKeyboardMarkup_NotDirectlyOwnedByProvider()
    {
        var cut = Render<CalendarProviderComponent>();
        var root = cut.Find("div[x-data='rzCalendarProvider']");

        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("tabindex"));
        Assert.Null(root.GetAttribute("aria-label"));
    }
}
