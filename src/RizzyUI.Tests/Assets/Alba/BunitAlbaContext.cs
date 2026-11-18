using Bunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI.Tests;

public abstract class BunitAlbaContext : BunitContext, IAsyncLifetime
{
    private readonly WebAppFixture _fixture;
    private IServiceScope? _scope;

    /// <summary>The request this test renders in, also returned by <see cref="IHttpContextAccessor"/>.</summary>
    protected HttpContext HttpContext { get; private set; } = null!;

    protected BunitAlbaContext(WebAppFixture fixture)
    {
        _fixture = fixture;
    }

    public Task InitializeAsync()
    {
        // Create a scope for the test to allow scoped services to be resolved per test.
        _scope = _fixture.Host.Services.CreateScope();

        // Let bUnit fall back to the scoped service container for DI.
        Services.AddFallbackServiceProvider(_scope.ServiceProvider);

        // Each test gets its own HttpContext. RizzyUI and Rizzy keep per-request state on it (field
        // ids, the CSP nonce), so a context shared by every test let one test's state leak into
        // another (RZUI-044).
        HttpContext = new DefaultHttpContext { RequestServices = _scope.ServiceProvider };
        Services.AddSingleton<IHttpContextAccessor>(new TestHttpContextAccessor(HttpContext));

        // Re-use the TestServer’s HttpClient so components talk to the in-proc API.
        Services.AddSingleton(_fixture.Host.Server.CreateClient());

        return Task.CompletedTask;
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        _scope?.Dispose();
        await base.DisposeAsync();
    }
}

/// <summary>
/// Returns one test's HttpContext. Unlike <see cref="HttpContextAccessor"/>, it does not depend on an
/// AsyncLocal flowing from xunit's InitializeAsync into the test method.
/// </summary>
internal sealed class TestHttpContextAccessor(HttpContext httpContext) : IHttpContextAccessor
{
    public HttpContext? HttpContext { get; set; } = httpContext;
}
