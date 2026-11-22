using Bunit;

namespace RizzyUI.Tests.Components.Form;

/// <summary>Decision D-32 (Summit SF-058): RzCalendarProvider as a form field.</summary>
public class CalendarProviderFieldsTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public CalendarProviderFieldsTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void A_range_posts_start_and_end_fields()
    {
        var cut = Render<RzCalendarProvider>(p => p
            .Add(x => x.Mode, SelectionDatesMode.MultipleRanged)
            .Add(x => x.Range, new CalendarDateRange { From = new DateTime(2026, 3, 2), To = new DateTime(2026, 3, 9) })
            .Add(x => x.StartName, "From")
            .Add(x => x.EndName, "To"));

        Assert.Equal("2026-03-02", cut.Find("input[type=hidden][name=From]").GetAttribute("value"));
        Assert.Equal("2026-03-09", cut.Find("input[type=hidden][name=To]").GetAttribute("value"));
        var root = cut.Find("[x-data='rzCalendarProvider']");
        Assert.Equal("From", root.GetAttribute("data-start-name"));
        Assert.Equal("To", root.GetAttribute("data-end-name"));
    }

    [Fact]
    public void Single_selection_posts_one_field_and_no_name_posts_nothing()
    {
        var cut = Render<RzCalendarProvider>(p => p
            .Add(x => x.Mode, SelectionDatesMode.Single)
            .Add(x => x.Value, new DateOnly(2026, 3, 2))
            .Add(x => x.Name, "Day"));
        Assert.Equal("2026-03-02", Assert.Single(cut.FindAll("input[name=Day]")).GetAttribute("value"));

        var unnamed = Render<RzCalendarProvider>(p => p.Add(x => x.Mode, SelectionDatesMode.Single).Add(x => x.Value, new DateOnly(2026, 3, 2)));
        Assert.Empty(unnamed.FindAll("input[data-calendar-input]"));
    }
}
