using Bunit;
using CommandDialogComponent = global::RizzyUI.RzCommandDialog;

namespace RizzyUI.Tests.Components.Navigation.RzCommand;

public class RzCommandDialogTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCommandDialogTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void DefaultRender_EmitsDialogAndCommandStructure()
    {
        var cut = Render<CommandDialogComponent>();
        var html = cut.Markup;

        Assert.Contains("data-slot=\"dialog-content\"", html);
        Assert.Contains("data-slot=\"command\"", html);
        Assert.Contains("data-slot=\"dialog-title\"", html);
        Assert.Contains("data-slot=\"dialog-description\"", html);
        Assert.Contains("sr-only", html);
    }

    [Fact]
    public void DefaultLocalization_ProvidesTitleDescriptionAndEventName()
    {
        var cut = Render<CommandDialogComponent>();

        Assert.StartsWith("show-command-dialog-", cut.Find("[x-data='rzModal']").GetAttribute("data-event-trigger-name"));
        Assert.Contains("data-slot=\"dialog-content\"", cut.Markup);
    }

    [Fact]
    public void ParameterCombinations_AreForwardedToNestedContracts()
    {
        var cut = Render<CommandDialogComponent>(p => p
            .Add(x => x.Title, "Search")
            .Add(x => x.Description, "Find commands")
            .Add(x => x.ShowCloseButton, false)
            .Add(x => x.ShouldFilter, false)
            .Add(x => x.Loop, true)
            .Add(x => x.SelectedValue, "theme")
            .Add(x => x.EventTriggerName, "open-search"));

        var html = cut.Markup;
        Assert.Contains("Search", html);
        Assert.Contains("Find commands", html);
        Assert.Contains("data-event-trigger-name=\"open-search\"", html);
        Assert.Contains("data-should-filter=\"false\"", html);
        Assert.Contains("data-loop=\"true\"", html);
        Assert.Contains("data-selected-value=\"theme\"", html);
        Assert.DoesNotContain("data-slot=\"dialog-close\"", html);
    }

    [Fact]
    public void KeyboardAndFocusMarkup_ComesFromNestedDialogAndCommand()
    {
        var html = Render<CommandDialogComponent>().Markup;
        Assert.Contains("x-data=\"rzModal\"", html);
        Assert.Contains("data-slot=\"command\"", html);
    }

    [Fact]
    public void SsrContract_ContainsAlpineReadyMarkupWithoutBlazorEventWiring()
    {
        var html = Render<CommandDialogComponent>().Markup;
        Assert.Contains("x-data=\"rzModal\"", html);
        Assert.DoesNotContain("blazor:", html, StringComparison.OrdinalIgnoreCase);
    }
}
