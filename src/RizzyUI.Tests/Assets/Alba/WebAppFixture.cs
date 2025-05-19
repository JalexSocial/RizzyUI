using Alba;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Rizzy;
using Rizzy.Htmx;

namespace RizzyUI.Tests;

public sealed class WebAppFixture : IAsyncLifetime
{
    public IAlbaHost Host = null!;

    public async Task InitializeAsync()
    {
        var builder = WebApplication.CreateBuilder([]);

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

        Host = await builder.StartAlbaAsync(configureRoutes: config =>
        {

        });
    }

    public Task DisposeAsync() => Host.DisposeAsync().AsTask();
}