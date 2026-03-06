using Bunit;

namespace RizzyUI.Tests.Components.Form;

public class RzCalendarTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCalendarTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzCalendar_RendersDataSlotAndAlpineBootstrapMarkup()
    {
        var cut = Render<RzCalendar>();

        var root = cut.Find("[data-slot='calendar']");
        Assert.NotNull(root);

        var alpine = cut.Find("[x-data='rzCalendar']");
        Assert.Equal(cut.Instance.Id, alpine.GetAttribute("data-alpine-root"));
        Assert.Equal($"{cut.Instance.Id}-config", alpine.GetAttribute("data-config-id"));

        var config = cut.Find($"script#{cut.Instance.Id}-config");
        Assert.Equal("application/json", config.GetAttribute("type"));
        Assert.NotNull(cut.Find("[x-ref='calendarEl']"));
    }

    [Fact]
    public void RzCalendar_RendersConfiguredSelectionModeAndDatesInConfig()
    {
        var cut = Render<RzCalendar>(p => p
            .Add(x => x.Mode, SelectionDatesMode.Multiple)
            .Add(x => x.Values, [new DateOnly(2026, 1, 1), new DateOnly(2026, 1, 2)])
            .Add(x => x.ShowOutsideDays, false));

        var scriptJson = cut.Find($"script#{cut.Instance.Id}-config").TextContent;
        Assert.Contains("\"selectionDatesMode\":\"multiple\"", scriptJson);
        Assert.Contains("2026-01-01", scriptJson);
        Assert.Contains("2026-01-02", scriptJson);
    }

    [Fact]
    public void RzCalendar_PartialConfiguration_StillRendersSsrContract()
    {
        var cut = Render<RzCalendar>(p => p
            .Add(x => x.MinDate, new DateOnly(2026, 2, 1))
            .Add(x => x.MaxDate, new DateOnly(2026, 2, 28))
            .AddUnmatched("class", "calendar-shell"));

        var root = cut.Find("[data-slot='calendar']");
        Assert.Contains("calendar-shell", root.ClassList);

        var scriptJson = cut.Find($"script#{cut.Instance.Id}-config").TextContent;
        Assert.Contains("2026-02-01", scriptJson);
        Assert.Contains("2026-02-28", scriptJson);
    }
}
