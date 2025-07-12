using AspNetStatic;
using Microsoft.AspNetCore.Localization;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI;
using RizzyUI.Docs;
using RizzyUI.Docs.Components;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var provider = new StaticResourcesInfoProvider();

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.AddRizzy();
builder.Services.AddHtmx(config =>
{
    config.GenerateStyleNonce = true;
});
builder.Services.AddRizzyUI(config =>
{
    config.DefaultTheme = RzTheme.VercelTheme;
});

//builder.Services.AddMvcCore().AddDataAnnotations();

builder.Services.AddSingleton<IStaticResourcesInfoProvider>(
    new StaticResourcesInfoProvider()
        .AddAllBlazorPages()
        .AddAllWebRootContent(builder.Environment));  // from AspNetStaticContrib project

// Add localization
builder.Services.AddRazorComponents();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Configure supported cultures
var supportedCultures = new[]
{
    new CultureInfo("en"),
    new CultureInfo("de"),
    new CultureInfo("es"),
    new CultureInfo("fr"),
    new CultureInfo("pt") // Portuguese (Portugal)
};

// Configure request localization options
var requestLocalizationOptions = new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en"),
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures
};

// Use request localization middleware
app.UseRequestLocalization(requestLocalizationOptions);
app.UseHttpsRedirection();

app.MapStaticAssets();
app.UseAntiforgery();

#if !DEBUG
app.Use(async (context, next) =>
{
    context.Items["RizzyNonce"] = "abcdefghijklmnopqrstuvwxyz0123456789";
    await next.Invoke();
});
#endif

app.UseRizzy();

app.MapRazorComponents<App>();

#if !DEBUG

var ssgOutputPath = "../../docs";
if (!Directory.Exists(ssgOutputPath))
    Directory.CreateDirectory(ssgOutputPath);

app.GenerateStaticContent(ssgOutputPath, exitWhenDone: true);

#endif

app.Run();
