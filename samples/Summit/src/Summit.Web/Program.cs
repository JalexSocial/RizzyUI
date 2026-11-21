using Microsoft.Extensions.Options;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI;
using Summit.Web.Components.Layout;
using Summit.Web.Data;
using Summit.Web.Features;
using Summit.Web.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Static web assets from referenced projects and packages (_content/Rizzy, _content/RizzyUI) and the
// esbuild-built code-behind modules are served from their build locations only in Development by
// default. The browser tests run the build output in the Testing environment, so turn them on there
// too. A published app (Production) serves everything from its own wwwroot.
if (builder.Environment.IsEnvironment("Testing"))
    builder.WebHost.UseStaticWebAssets();

builder.Services.Configure<SummitOptions>(builder.Configuration.GetSection(SummitOptions.SectionName));
var summit = builder.Configuration.GetSection(SummitOptions.SectionName).Get<SummitOptions>() ?? new SummitOptions();

// Rizzy renders Razor components as server-side views. AppLayout is the HTML shell; pages pick a
// layout with @layout (public pages default to PublicLayout). HtmxLayout renders the layout for full
// page loads and boosted navigation, and only the component for htmx partial requests.
builder.Services.AddRizzy(config =>
{
    config.RootComponent = typeof(HtmxApp<AppLayout>);
    config.DefaultLayout = typeof(HtmxLayout<PublicLayout>);
    // Absolute, because Summit has no <base href="/"> (it would break in-page links). The relative
    // default only works on top-level URLs. summit-findings.md SF-017.
    config.ClientScriptUrl = "/_content/Rizzy/js/rizzy.js";
});

// htmx is served by Summit (wwwroot/lib/htmx, copied from the CDN URL Rizzy pins). Integrity stays on:
// Rizzy checks the copy against the SRI hash of the htmx version it is tested with.
builder.Services.AddHtmx(config =>
{
    config.Scripts = new HtmxScriptOptions { BaseUrl = "/lib/htmx/", Integrity = true };
});

// Summit's own theme, loaded from JSON with RizzyUI's ThemeLoader, next to the built-in themes.
var summitTheme = await ThemeLoader.LoadFromFileAsync(Path.Combine(builder.Environment.ContentRootPath, "Themes", "summit.json"))
                  ?? throw new InvalidOperationException("Themes/summit.json could not be loaded.");
builder.Services.AddRizzyUI(config =>
{
    config.DefaultTheme = summitTheme;
    config.AvailableThemes.Add(RzTheme.ArcticTheme);
});
// Widget libraries from wwwroot/lib instead of the CDN (runs after RizzyUI fills in its defaults).
builder.Services.AddSingleton<IPostConfigureOptions<RizzyUIConfig>, SelfHostedAssets>();

builder.Services.AddControllersWithViews();
builder.Services.AddLocalization();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSummitClock(builder.Configuration);
builder.Services.AddScoped<ThemeSelection>();
builder.Services.AddOrganizerAuthentication();
SummitDatabase.AddSummitDatabase(builder.Services);
builder.Services.AddSummitFeatures();

var app = builder.Build();

await app.Services.GetRequiredService<SummitDatabase>()
    .InitializeAsync(app.Services, rebuild: summit.Database.ResetOnStart);

// A server error on an htmx partial request is not swapped into the page; the client receives an
// rz:server-error event instead (Summit shows a toast). Registered before UseExceptionHandler.
app.UseHtmxErrorHandling();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseSummitStatusPages();
app.UseSummitContentSecurityPolicy();
app.UseRequestLocalization(SummitCultures.CreateOptions());
app.UseSummitCultureCookie();
app.UseSummitVisitorCookie();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();
app.UseRizzy();
// Server toasts (IRzToastService) are sent with the htmx response that queued them.
app.UseRzToast();
app.UseSummitFailureInjection();

// Fingerprinted URLs for static assets and code-behind modules, cached for a year.
app.MapStaticAssets();
app.MapControllers().WithStaticAssets();
app.MapSummitFragments();
app.MapSummitTestHooks();

app.Run();

public partial class Program;
