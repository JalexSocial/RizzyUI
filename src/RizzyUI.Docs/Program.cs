using AspNetStatic;
using Rizzy;
using Rizzy.Components;
using RizzyUI;
using RizzyUI.Docs;
using RizzyUI.Docs.Components;
using RizzyUI.Docs.Components.Layout;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var provider = new StaticResourcesInfoProvider();
/*
builder.AddRizzy(config =>
{
    // Not using Rizzy for anything in this app
    // config.RootComponent = typeof(HtmxApp<AppLayout>);
    // config.DefaultLayout = typeof(HtmxLayout<MainLayout>);
});
*/
builder.Services.AddSingleton<IStaticResourcesInfoProvider>(
    new StaticResourcesInfoProvider()
        .AddAllBlazorPages()
        .AddAllWebRootContent(builder.Environment));  // from AspNetStaticContrib project

builder.Services.AddRazorComponents();
builder.Services.AddRizzyUI();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>();

#if !DEBUG

var ssgOutputPath = "../../docs";
if (!Directory.Exists(ssgOutputPath))
    Directory.CreateDirectory(ssgOutputPath);

app.GenerateStaticContent(ssgOutputPath, exitWhenDone: true);

#endif

app.Run();
