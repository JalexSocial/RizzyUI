using Alba;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Rizzy;
using Rizzy.Htmx;

namespace RizzyUI.Tests;

public sealed class WebAppFixture : IAsyncLifetime
{
    public IAlbaHost Host = null!;

    public async Task InitializeAsync()
    {
        var builder = WebApplication.CreateBuilder([]);

        // Add an HttpContextAccessor to the service collection to allow HttpContext resolution
        // RizzyUI depends on HttpContext to provide nonces for CSP
        var httpContext = new DefaultHttpContext();
        var httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        httpContextAccessorMock.Setup(_ => _.HttpContext).Returns(httpContext);
        builder.Services.AddSingleton(httpContextAccessorMock.Object);

        builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

        builder.Services.AddRizzy();
        builder.Services.AddHtmx(config =>
        {
            config.GenerateStyleNonce = true;
        });
        builder.Services.AddRizzyUI(config =>
        {
            config.DefaultTheme = RzTheme.ArcticTheme;
        });

        builder.Services.AddRazorComponents();
        builder.Services.AddControllers();

        Host = await builder.StartAlbaAsync(configureRoutes: config =>
        {
        });
    }

    public Task DisposeAsync() => Host.DisposeAsync().AsTask();
}