using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RizzyUI.Services.RzToast.Internal;
using RizzyUI.Services.RzToast.Middleware;

namespace RizzyUI.Tests.Services;

/// <summary>Summit SF-006: a toast that cannot be delivered is a Warning in Development.</summary>
public class RzToastMiddlewareLoggingTests
{
    private sealed class Environment(string name) : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = name;
        public string ApplicationName { get; set; } = "Tests";
        public string ContentRootPath { get; set; } = "";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }

    private sealed class Capture : ILogger<RzToastMiddleware>
    {
        public List<(LogLevel Level, string Message)> Entries { get; } = [];
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) =>
            Entries.Add((logLevel, formatter(state, exception)));
    }

    private static async Task<Capture> RunAsync(string environment, bool htmx, int status)
    {
        var queue = new RzToastCommandQueue();
        queue.Enqueue(new RzToastTransportCommand { Type = "show" });
        var services = new ServiceCollection()
            .AddSingleton(queue)
            .AddSingleton<IHostEnvironment>(new Environment(environment))
            .BuildServiceProvider();
        var context = new DefaultHttpContext { RequestServices = services };
        context.Request.Path = "/save";
        if (htmx) context.Request.Headers["HX-Request"] = "true";
        var logger = new Capture();
        await new RzToastMiddleware(ctx => { ctx.Response.StatusCode = status; return Task.CompletedTask; }, logger).InvokeAsync(context);
        return logger;
    }

    [Fact]
    public async Task A_toast_on_a_normal_request_is_a_warning_in_development()
    {
        var logger = await RunAsync(Environments.Development, htmx: false, status: 302);
        Assert.Contains(logger.Entries, e => e.Level == LogLevel.Warning && e.Message.Contains("non-htmx request to /save"));
    }

    [Fact]
    public async Task A_toast_on_an_htmx_redirect_is_a_warning_in_development()
    {
        var logger = await RunAsync(Environments.Development, htmx: true, status: 302);
        Assert.Contains(logger.Entries, e => e.Level == LogLevel.Warning && e.Message.Contains("redirect (302)"));
    }

    [Fact]
    public async Task Outside_development_it_stays_at_debug()
    {
        var logger = await RunAsync(Environments.Production, htmx: false, status: 302);
        Assert.DoesNotContain(logger.Entries, e => e.Level == LogLevel.Warning);
        Assert.Contains(logger.Entries, e => e.Level == LogLevel.Debug && e.Message.Contains("non-htmx"));
    }
}
