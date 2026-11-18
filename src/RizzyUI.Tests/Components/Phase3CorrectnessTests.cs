using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RizzyUI.Services.RzToast;
using RizzyUI.Services.RzToast.Middleware;

namespace RizzyUI.Tests.Components;

/// <summary>Regression tests for the smaller RM-3.6 correctness findings.</summary>
public class Phase3CorrectnessTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public Phase3CorrectnessTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void ConfigureClasses_DoesNotChangeASharedClassesInstance()
    {
        // RZUI-055: ConfigureClasses ran on the caller's Classes object, so a shared instance
        // accumulated the configuration on every render.
        var shared = new RzSlider.Slots { Base = "w-64" };

        for (var i = 0; i < 3; i++)
        {
            var cut = Render<RzSlider>(p => p
                .Add(x => x.Classes, shared)
                .Add(x => x.ConfigureClasses, c => c.Base += " mt-4"));

            var classes = cut.Find("[data-slot='slider']").ClassList;
            Assert.Contains("w-64", classes);
            Assert.Contains("mt-4", classes);
        }

        Assert.Equal("w-64", shared.Base);
    }

    [Fact]
    public async Task ToastsQueuedDuringANonHtmxRequest_AreLoggedWhenDiscarded()
    {
        // RZUI-052: toasts queued during a normal request disappeared without a trace.
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddRizzyUI();
        await using var provider = services.BuildServiceProvider();
        await using var scope = provider.CreateAsyncScope();

        var context = new DefaultHttpContext { RequestServices = scope.ServiceProvider };
        var logger = new ListLogger<RzToastMiddleware>();
        var middleware = new RzToastMiddleware(
            _ => { scope.ServiceProvider.GetRequiredService<IRzToastService>().Success("Saved"); return Task.CompletedTask; },
            logger);

        await middleware.InvokeAsync(context);

        Assert.Contains(logger.Entries, e => e.Level == LogLevel.Debug && e.Message.Contains("non-htmx request"));
    }

    [Theory]
    [InlineData("account", "account")]
    [InlineData("billing_2", "billing_2")]
    public void TabIdSegment_KeepsSafeValues(string value, string expected) =>
        Assert.Equal(expected, RzTabs.IdSegment(value));

    [Fact]
    public void TabIdSegment_MakesUnsafeValuesValidAndDistinct()
    {
        // RZUI-049: a space in a tab value split aria-controls into two ID references.
        var spaced = RzTabs.IdSegment("first tab");
        var hyphenated = RzTabs.IdSegment("first-tab");

        Assert.Matches("^[A-Za-z0-9_-]+$", spaced);
        Assert.StartsWith("first-tab-", spaced);
        Assert.NotEqual(hyphenated, spaced);
        Assert.Equal(spaced, RzTabs.IdSegment("first tab"));
    }

    private sealed class LabelModel
    {
        public string Fruit { get; set; } = "";
        public string Code { get; set; } = "";
    }

    private IRenderedComponent<CascadingValue<Microsoft.AspNetCore.Http.HttpContext>> RenderInField(RenderFragment content)
    {
        var model = new LabelModel();
        return Render<CascadingValue<Microsoft.AspNetCore.Http.HttpContext>>(http => http
            .Add(p => p.Value, HttpContext)
            .AddChildContent<CascadingValue<Microsoft.AspNetCore.Components.Forms.EditContext>>(edit => edit
                .Add(p => p.Value, new Microsoft.AspNetCore.Components.Forms.EditContext(model))
                .Add(p => p.ChildContent, content)));
    }

    [Fact]
    public void FieldLabel_NamesTheComboboxSelectAndTheOtpInput()
    {
        // The combobox select and the OTP input carried ids no label could target; now they take the
        // field id, so FieldLabel For points at them (in either order).
        var model = new LabelModel();
        var cut = RenderInField(b =>
        {
            b.OpenComponent<FieldLabel<string>>(0);
            b.AddComponentParameter(1, "For", (System.Linq.Expressions.Expression<Func<string>>)(() => model.Fruit));
            b.CloseComponent();
            b.OpenComponent<RzCombobox<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem, string>>(2);
            b.AddComponentParameter(3, "For", (System.Linq.Expressions.Expression<Func<string>>)(() => model.Fruit));
            b.CloseComponent();
            b.OpenComponent<RzInputOTP>(4);
            b.AddComponentParameter(5, "For", (System.Linq.Expressions.Expression<Func<string>>)(() => model.Code));
            b.CloseComponent();
            b.OpenComponent<FieldLabel<string>>(6);
            b.AddComponentParameter(7, "For", (System.Linq.Expressions.Expression<Func<string>>)(() => model.Code));
            b.CloseComponent();
        });

        var labels = cut.FindAll("label[for]");
        Assert.Equal(cut.Find("select").Id, labels[0].GetAttribute("for"));
        Assert.Equal(cut.Find("input[data-otp-input='true']").Id, labels[^1].GetAttribute("for"));
        Assert.Null(cut.Find("input[data-otp-input='true']").GetAttribute("aria-label"));
    }

    private sealed class ListLogger<T> : ILogger<T>
    {
        public List<(LogLevel Level, string Message)> Entries { get; } = new();

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) =>
            Entries.Add((logLevel, formatter(state, exception)));
    }
}
