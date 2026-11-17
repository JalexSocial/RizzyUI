using Rizzy;
using Rizzy.Htmx;
using RizzyUI;
using RizzyUI.Starter.Components.Layout;
using RizzyUI.Starter.Features.Activity;
using RizzyUI.Starter.Features.Customers;

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

app.UseStatusCodePagesWithReExecute("/not-found");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Required after authentication and authorization.
app.UseAntiforgery();
app.UseRizzy();

// Pages and their forms: controllers in Features/*.
app.MapControllers();

// Fragments: minimal API endpoints that return htmx partials.
app.MapActivityEndpoints();

app.Run();
