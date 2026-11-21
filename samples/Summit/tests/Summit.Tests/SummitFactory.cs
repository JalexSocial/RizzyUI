using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;

namespace Summit.Tests;

/// <summary>
/// Summit in the Testing environment (fixed clock, test hooks) with its own database files, so test
/// classes do not share state. Set <see cref="Csp"/> for the strict CSP mode.
/// </summary>
public class SummitFactory : WebApplicationFactory<Program>
{
    private readonly string _directory = Path.Combine(Path.GetTempPath(), "summit-tests", Guid.NewGuid().ToString("N"));

    protected virtual bool Csp => false;

    public string DatabasePath => Path.Combine(_directory, "summit.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("Summit:Database:Path", DatabasePath);
        builder.UseSetting("Summit:Csp:Enabled", Csp ? "true" : "false");
    }

    /// <summary>A client that does not follow redirects, so tests see 302s and their Location.</summary>
    public HttpClient CreateNoRedirectClient() =>
        CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        SqliteConnection.ClearAllPools();
        try { Directory.Delete(_directory, recursive: true); } catch (IOException) { }
    }
}

public sealed class CspSummitFactory : SummitFactory
{
    protected override bool Csp => true;
}

public static class HttpTestExtensions
{
    private static readonly Regex TokenPattern = new("name=\"__RequestVerificationToken\" (?:type=\"hidden\" )?value=\"([^\"]+)\"", RegexOptions.Compiled);

    /// <summary>Reads the antiforgery token from a page's form (the client keeps the cookie).</summary>
    public static async Task<string> GetAntiforgeryTokenAsync(this HttpClient client, string path)
    {
        var html = await client.GetStringAsync(path);
        var match = TokenPattern.Match(html);
        Assert.True(match.Success, $"No antiforgery token on {path}.");
        return WebUtility.HtmlDecode(match.Groups[1].Value);
    }

    /// <summary>Marks a request as an htmx partial request (what hx-post / hx-get send).</summary>
    public static HttpRequestMessage AsHtmxPartial(this HttpRequestMessage request)
    {
        request.Headers.Add("HX-Request", "true");
        request.Headers.Add("HX-Request-Type", "partial");
        return request;
    }
}
