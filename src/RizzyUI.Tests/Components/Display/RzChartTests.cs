using System.Text.Json;
using Bunit;
using RizzyUI.Charts;

namespace RizzyUI.Tests.Components.Display;

public class RzChartTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzChartTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private static JsonElement Config(IRenderedComponent<RzChart> cut)
        => JsonDocument.Parse(cut.Find("script[type='application/json']").TextContent).RootElement;

    [Fact]
    public void TheChartTypeComesFromTheFirstDataset()
    {
        // Summit SF-059: Chart.js applies a type's defaults (a doughnut's legend) from the config's type.
        var cut = Render<RzChart>(p => p.Add(x => x.Configure, c => c
            .Data(d => d.Labels("A", "B").Datasets(ds => ds.Doughnut().Data(1, 2)))));

        Assert.Equal("doughnut", Config(cut).GetProperty("type").GetString());
    }

    [Fact]
    public void AnExplicitTypeWins()
    {
        var cut = Render<RzChart>(p => p.Add(x => x.Configure, c => c
            .Type("bar")
            .Data(d => d.Labels("A", "B").Datasets(ds =>
            {
                ds.Line().Data(1, 2);
                ds.Bar().Data(3, 4);
            }))));

        Assert.Equal("bar", Config(cut).GetProperty("type").GetString());
    }

    [Fact]
    public void TheChartFillsItsParentOrKeepsATwoToOneRatio()
    {
        // Summit SF-061: no fixed min-height that overflows a shorter parent.
        var cut = Render<RzChart>(p => p.Add(x => x.Configure, c => c
            .Data(d => d.Labels("A").Datasets(ds => ds.Bar().Data(1)))));

        var root = cut.Find("[data-slot='chart']");
        var container = cut.Find("[data-slot='chart-container']");
        Assert.Contains("h-full", root.ClassList);
        Assert.Contains("aspect-[2/1]", container.ClassList);
        Assert.DoesNotContain(container.ClassList, c => c.StartsWith("min-h-", StringComparison.Ordinal));
    }
}
