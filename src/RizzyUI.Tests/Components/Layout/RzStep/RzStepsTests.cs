using Bunit;
using Blazicons;

namespace RizzyUI.Tests.Components.Layout.RzStep;

public class RzStepsTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzStepsTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_UsesOrderedListAndLocalizedAriaLabel()
    {
        var cut = Render<RzSteps>();

        var root = cut.Find("ol");
        Assert.NotNull(root.GetAttribute("aria-label"));
        Assert.Contains("flex", root.ClassList);
        Assert.Empty(cut.FindAll("li"));
    }

    [Fact]
    public void RendersStepItemsWithCurrentStateAndCaptions()
    {
        var cut = Render<RzSteps>(p => p
            .Add(x => x.Items, new List<StepData>
            {
                new("Account", StepStatus.Completed, null, "Done", Lucide.Check),
                new("Confirm", StepStatus.Current, "Current step", "In progress", null),
                new("Finish", StepStatus.Upcoming, null, null, null)
            }));

        var items = cut.FindAll("li");
        Assert.Equal(3, items.Count);
        Assert.Equal("step", items[1].GetAttribute("aria-current"));
        Assert.Equal("Current step", items[1].GetAttribute("aria-label"));
        Assert.Contains("sr-only", cut.Markup);
    }

    [Fact]
    public void VerticalOrientationAddsVerticalProgressClasses()
    {
        var cut = Render<RzSteps>(p => p
            .Add(x => x.Orientation, Orientation.Vertical)
            .Add(x => x.Items, new List<StepData>
            {
                new("A", StepStatus.Completed, null, null, null),
                new("B", StepStatus.Upcoming, null, null, null)
            }));

        var root = cut.Find("ol");
        Assert.Contains("flex-col", root.ClassList);
        Assert.Contains("after:", cut.Markup);
    }
}
