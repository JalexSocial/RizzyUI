using System.Globalization;
using Bunit;

namespace RizzyUI.Tests.Components.TextAnimations;

public class RzNumberTickerTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzNumberTickerTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void Renders_root_element_with_required_data_slot()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Id, "ticker-id")
            .Add(p => p.Value, 100m));

        var root = cut.Find("#ticker-id");
        Assert.Equal("number-ticker", root.GetAttribute("data-slot"));
    }

    [Fact]
    public void Renders_Alpine_child_container_with_required_hooks()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Id, "ticker-id")
            .Add(p => p.Value, 100m));

        var alpineHost = cut.Find("div[data-alpine-root='ticker-id']");

        Assert.Equal("rzNumberTicker", alpineHost.GetAttribute("x-data"));
        Assert.NotNull(alpineHost.GetAttribute("data-assets"));
        Assert.NotNull(alpineHost.GetAttribute("data-nonce"));
    }

    [Fact]
    public void Renders_visible_value_span_with_slot_marker_and_server_value()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 1234m));

        var value = cut.Find("span[data-slot='value']");

        Assert.Equal("1,234", value.TextContent.Trim());
    }

    [Fact]
    public void Merges_user_class_and_additional_attributes_on_root()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 12m)
            .AddUnmatched("class", "text-6xl")
            .AddUnmatched("data-test-id", "ticker"));

        var root = cut.Find("[data-slot='number-ticker']");

        Assert.Contains("inline-block", root.ClassList);
        Assert.Contains("text-6xl", root.ClassList);
        Assert.Equal("ticker", root.GetAttribute("data-test-id"));
    }

    [Fact]
    public void Emits_default_data_configuration()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 10m));

        var alpineHost = cut.Find("[x-data='rzNumberTicker']");

        Assert.Equal("up", alpineHost.GetAttribute("data-direction"));
        Assert.Equal("0", alpineHost.GetAttribute("data-delay"));
        Assert.Equal("0", alpineHost.GetAttribute("data-decimal-places"));
        Assert.Equal("true", alpineHost.GetAttribute("data-use-grouping"));
        Assert.Equal("true", alpineHost.GetAttribute("data-trigger-on-view"));
        Assert.Equal("true", alpineHost.GetAttribute("data-animate-once"));
        Assert.Equal("false", alpineHost.GetAttribute("data-disable-animation"));
    }

    [Fact]
    public void Emits_down_direction_contract_correctly()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 100m)
            .Add(p => p.StartValue, 80m)
            .Add(p => p.Direction, NumberTickerDirection.Down));

        var alpineHost = cut.Find("[x-data='rzNumberTicker']");
        var value = cut.Find("span[data-slot='value']");

        Assert.Equal("down", alpineHost.GetAttribute("data-direction"));
        Assert.Equal("80", alpineHost.GetAttribute("data-start-value"));
        Assert.Equal("100", value.TextContent.Trim());
    }

    [Fact]
    public void Clamps_invalid_numeric_configuration()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 25m)
            .Add(p => p.Delay, -5)
            .Add(p => p.DecimalPlaces, -4));

        var alpineHost = cut.Find("[x-data='rzNumberTicker']");

        Assert.Equal("0", alpineHost.GetAttribute("data-delay"));
        Assert.Equal("0", alpineHost.GetAttribute("data-decimal-places"));
    }

    [Fact]
    public void Formats_decimals_correctly_on_the_server()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 5.6m)
            .Add(p => p.DecimalPlaces, 2)
            .Add(p => p.Culture, "en-US"));

        var value = cut.Find("span[data-slot='value']");

        Assert.Equal("5.60", value.TextContent.Trim());
    }

    [Fact]
    public void Formats_culture_and_grouping_correctly_on_the_server()
    {
        var expectedWithCulture = 12345.67m.ToString("N2", CultureInfo.GetCultureInfo("de-DE"));

        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 12345.67m)
            .Add(p => p.DecimalPlaces, 2)
            .Add(p => p.Culture, "de-DE")
            .Add(p => p.UseGrouping, false));

        var value = cut.Find("span[data-slot='value']");

        Assert.Equal(expectedWithCulture.Replace(".", string.Empty), value.TextContent.Trim());
    }

    [Fact]
    public void Emits_optional_aria_label_only_when_supplied()
    {
        var withoutAria = Render<RzNumberTicker>(parameters => parameters.Add(p => p.Value, 10m));
        var withAria = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 10m)
            .Add(p => p.AriaLabel, "Current revenue"));

        Assert.Null(withoutAria.Find("[data-slot='number-ticker']").GetAttribute("aria-label"));
        Assert.Equal("Current revenue", withAria.Find("[data-slot='number-ticker']").GetAttribute("aria-label"));
    }

    [Fact]
    public void Honors_disable_animation_contract_in_markup()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters
            .Add(p => p.Value, 4321m)
            .Add(p => p.DisableAnimation, true));

        var alpineHost = cut.Find("[x-data='rzNumberTicker']");
        var value = cut.Find("span[data-slot='value']");

        Assert.Equal("true", alpineHost.GetAttribute("data-disable-animation"));
        Assert.Equal("4,321", value.TextContent.Trim());
    }

    [Fact]
    public void Uses_expected_default_typography_classes()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters.Add(p => p.Value, 1m));

        var root = cut.Find("[data-slot='number-ticker']");
        var body = cut.Find("div[data-slot='body']");
        var value = cut.Find("span[data-slot='value']");

        Assert.Contains("inline-block", root.ClassList);
        Assert.Contains("align-baseline", root.ClassList);
        Assert.Contains("inline-block", body.ClassList);
        Assert.Contains("tabular-nums", value.ClassList);
        Assert.Contains("tracking-wider", value.ClassList);
    }

    [Fact]
    public void Does_not_emit_focus_or_keyboard_semantics_because_component_is_noninteractive()
    {
        var cut = Render<RzNumberTicker>(parameters => parameters.Add(p => p.Value, 1m));

        var root = cut.Find("[data-slot='number-ticker']");

        Assert.Null(root.GetAttribute("tabindex"));
        Assert.Null(root.GetAttribute("role"));
    }
}
