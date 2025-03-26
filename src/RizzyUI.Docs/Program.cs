using AspNetStatic;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI;
using RizzyUI.Docs;
using RizzyUI.Docs.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var provider = new StaticResourcesInfoProvider();

builder.Services.AddRizzy();
builder.Services.AddHtmx(config =>
{
	config.GenerateStyleNonce = true;
});
builder.Services.AddRizzyUI(config =>
{
    config.DefaultTheme = RizzyTheme.ArcticTheme;
});

//builder.Services.AddMvcCore().AddDataAnnotations();

builder.Services.AddSingleton<IStaticResourcesInfoProvider>(
    new StaticResourcesInfoProvider()
        .AddAllBlazorPages()
        .AddAllWebRootContent(builder.Environment));  // from AspNetStaticContrib project

builder.Services.AddRazorComponents();


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
app.UseRizzy();

app.MapRazorComponents<App>();

#if !DEBUG

var ssgOutputPath = "../../docs";
if (!Directory.Exists(ssgOutputPath))
    Directory.CreateDirectory(ssgOutputPath);

app.GenerateStaticContent(ssgOutputPath, exitWhenDone: true);

#endif

app.Run();
