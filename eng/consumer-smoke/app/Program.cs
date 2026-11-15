using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI;
using SmokeConsumer.Components;

var builder = WebApplication.CreateBuilder(args);

// Rizzy 6: AddRizzy registers htmx support and Razor components.
builder.Services.AddRizzy(options =>
{
    // The layout has no <base href>, so use an absolute URL for Rizzy's client script.
    options.ClientScriptUrl = "/_content/Rizzy/js/rizzy.js";
});
builder.Services.AddHtmx(options =>
{
    // htmx is served from this app (copied from htmx.org by the smoke script), not a CDN.
    // Integrity stays on: the copy must be the version Rizzy pins.
    options.Scripts = new HtmxScriptOptions { BaseUrl = "/lib/htmx/", Integrity = true };
});
builder.Services.AddRizzyUI();

var app = builder.Build();

// Strict, nonce-based Content Security Policy. 'strict-dynamic' lets the nonced RizzyUI module
// load its own chunks; nothing else may run. Inline handlers (onclick=...) are blocked.
app.Use(async (context, next) =>
{
    var nonce = context.RequestServices.GetRequiredService<IRizzyNonceProvider>().GetNonce();
    context.Response.Headers.ContentSecurityPolicy =
        $"script-src 'nonce-{nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'self'";
    await next();
});

app.UseStaticFiles();
app.UseAntiforgery();
app.UseRizzy();

// Fragment loaded into the dialog with hx-get: contains an Alpine component (RzAlert).
app.MapGet("/fragments/alert", () => new RazorComponentResult<AlertFragment>());

// Unsafe request: binding [FromForm] makes minimal APIs validate the antiforgery token, which
// Rizzy's client attaches from the htmx-config meta tag.
app.MapPost("/fragments/echo", ([FromForm] string message) =>
    Results.Content($"<p id=\"echo-result\">Echo: {System.Net.WebUtility.HtmlEncode(message)}</p>", "text/html"));

app.MapRazorComponents<App>();

app.Run();
