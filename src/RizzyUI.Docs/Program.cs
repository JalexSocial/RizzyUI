using AspNetStatic;
using Microsoft.AspNetCore.Localization;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI;
using RizzyUI.Docs.Components;
using System.Globalization;
using RizzyUI.Docs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var provider = new StaticResourcesInfoProvider();

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

// Rizzy 6: AddRizzy() also registers htmx support and Razor components. AddHtmx is only
// needed to configure HtmxConfig. htmx 4 is served from the docs site's own copy
// (wwwroot/vendor/htmx, copied from the pinned htmx.org package by scripts/copy-vendor-assets.mjs)
// so the static site does not depend on a CDN; <RzScripts /> still checks the SRI hashes for the
// htmx version Rizzy is tested with.
builder.Services.AddRizzy(config =>
{
    // The docs layouts have no <base href="/">, so the default relative script URL would
    // resolve against nested routes such as /components/dialog.
    config.ClientScriptUrl = "/_content/Rizzy/js/rizzy.js";
});
builder.Services.AddHtmx(config =>
{
    config.Scripts = new HtmxScriptOptions { BaseUrl = "/vendor/htmx/", Integrity = true };
});
builder.Services.AddRizzyUI(config =>
{
    config.DefaultTheme = RzTheme.ArcticTheme;
});

//builder.Services.AddMvcCore().AddDataAnnotations();

#if !DEBUG
builder.Services.AddSingleton<IStaticResourcesInfoProvider>(
    new StaticResourcesInfoProvider()
        .AddAllBlazorPages()
        .AddAllWebRootContent(builder.Environment));  // from AspNetStaticContrib project
#endif

// CSP mode (meta-tag Content Security Policy and the rizzyui-csp.js build) for testing components
// under the Alpine CSP build: Docs__UseContentSecurityPolicy=true or --Docs:UseContentSecurityPolicy=true.
App.UseContentSecurityPolicy = builder.Configuration.GetValue("Docs:UseContentSecurityPolicy", false);

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
