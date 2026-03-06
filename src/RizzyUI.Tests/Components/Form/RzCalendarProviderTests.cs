using Bunit;

namespace RizzyUI.Tests.Components.Form;

public class RzCalendarProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCalendarProviderTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzCalendarProvider_RendersAlpineContractAndModeAttributes()
    {
        var cut = Render<RzCalendarProvider>(p => p
            .Add(x => x.Mode, SelectionDatesMode.Multiple)
            .Add(x => x.Locale, "fr-FR"));

        var root = cut.Find($"div#{cut.Instance.Id}");
        Assert.Equal("rzCalendarProvider", root.GetAttribute("x-data"));
        Assert.Equal("multiple", root.GetAttribute("data-mode"));
        Assert.Equal("fr-FR", root.GetAttribute("data-locale"));
    }

    [Fact]
    public void RzCalendarProvider_NormalizesDateInputsForSsrPayload()
    {
        var cut = Render<RzCalendarProvider>(p => p
            .Add(x => x.Mode, SelectionDatesMode.MultipleRanged)
            .Add(x => x.Range, new CalendarDateRange
            {
                From = new DateTime(2026, 3, 10),
                To = new DateTime(2026, 3, 1)
            }));

        var root = cut.Find($"div#{cut.Instance.Id}");
        var dates = root.GetAttribute("data-initial-dates")!;
        Assert.Contains("2026-03-01", dates);
        Assert.Contains("2026-03-10", dates);
    }

    [Fact]
    public void RzCalendarProvider_ThrowsWhenModeAndParametersConflict()
    {
        Assert.Throws<InvalidOperationException>(() => Render<RzCalendarProvider>(p => p
            .Add(x => x.Mode, SelectionDatesMode.Single)
            .Add(x => x.Values, [new DateOnly(2026, 1, 1)])));
    }

    [Fact]
    public void RzCalendarProvider_AccessibilityRoleNotApplicable_DocumentingContract()
    {
        var cut = Render<RzCalendarProvider>();
        var root = cut.Find($"div#{cut.Instance.Id}");
        Assert.Null(root.GetAttribute("role")); // Provider is a non-semantic state/config wrapper.
    }
}
