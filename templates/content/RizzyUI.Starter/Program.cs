using Rizzy;
using Rizzy.Htmx;
using RizzyUI;
using RizzyUI.Starter.Components.Layout;
using RizzyUI.Starter.Features.Activity;
using RizzyUI.Starter.Features.Customers;
using RizzyUI.Starter.Features.Errors;

var builder = WebApplication.CreateBuilder(args);

// Rizzy renders Razor components as server-side views. Every page goes through HtmxApp/HtmxLayout,
// which render the full layout for normal requests and boosted navigation, and only the component
// for htmx partial requests (hx-get, hx-post) that swap part of the page.
builder.Services.AddRizzy(config =>
{
    config.RootComponent = typeof(HtmxApp<AppLayout>);
    config.DefaultLayout = typeof(HtmxLayout<MainLayout>);
});

builder.Services.AddRizzyUI(config =>
{
    config.DefaultTheme = RzTheme.ArcticTheme;
});

// Controllers return Rizzy views (RzController.View<T>). AddControllersWithViews also registers
// the antiforgery filter used by [ValidateAntiForgeryToken].
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<CustomerStore>();

var app = builder.Build();

// A server error on an htmx partial request is not swapped into the page; the client receives an
// rz:server-error event instead. Registered before UseExceptionHandler so it covers its output.
app.UseHtmxErrorHandling();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

// Error pages for empty 4xx/5xx responses, keeping the status code and leaving htmx alone.
app.UseStatusPages();
app.UseHttpsRedirection();
// Files under wwwroot (including the CSS Tailwind builds on every build).
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Required after authentication and authorization.
app.UseAntiforgery();
app.UseRizzy();

// Fingerprinted URLs for static assets (Counter.ezjsubrzj2.razor.js), cached by browsers for a
// year. WithStaticAssets lets pages resolve them: RizzyUI uses them for code-behind modules, so a
// deployment never serves an old module from the browser cache.
app.MapStaticAssets();

// Pages and their forms: controllers in Features/*.
app.MapControllers().WithStaticAssets();

// Fragments: minimal API endpoints that return htmx partials.
app.MapActivityEndpoints();

app.Run();
