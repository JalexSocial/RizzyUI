using Bunit;
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

    private sealed class ListLogger<T> : ILogger<T>
    {
        public List<(LogLevel Level, string Message)> Entries { get; } = new();

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) =>
            Entries.Add((logLevel, formatter(state, exception)));
    }
}
