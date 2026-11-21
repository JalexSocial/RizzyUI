using System.Net;

namespace Summit.Tests;

public sealed class PageTests(SummitFactory factory) : IClassFixture<SummitFactory>
{
    [Theory]
    [InlineData("/")]
    [InlineData("/schedule")]
    [InlineData("/speakers")]
    [InlineData("/tickets")]
    [InlineData("/help")]
    [InlineData("/account/sign-in")]
    public async Task Public_pages_render_in_the_public_layout(string path)
    {
        var response = await factory.CreateClient().GetAsync(path);
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("id=\"content\"", html);
        Assert.Contains("Skip to content", html);
        Assert.Contains("data-slot=\"navigation-menu", html);
    }

    [Fact]
    public async Task Unknown_urls_render_the_not_found_page_inside_the_layout()
    {
        var response = await factory.CreateClient().GetAsync("/does-not-exist");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Contains("Page not found", html);
        Assert.Contains("Skip to content", html);
    }

    [Fact]
    public async Task Static_assets_use_absolute_fingerprinted_urls()
    {
        var html = await factory.CreateClient().GetStringAsync("/");

        // Absolute: the page has no <base href>, so relative URLs would break on nested routes (SF-017).
        Assert.Matches("href=\"/css/app\\.[a-z0-9]+\\.css\"", html);
        Assert.Matches("src=\"/_content/RizzyUI/js/rizzyui\\.min\\.[a-z0-9]+\\.js\"", html);
        Assert.Contains("src=\"/_content/Rizzy/js/rizzy.js\"", html);
        // htmx is served by Summit, not the CDN.
        Assert.Contains("src=\"/lib/htmx/htmx.min.js\"", html);
        Assert.DoesNotContain("cdn.jsdelivr.net", html);
    }

    [Theory]
    [InlineData("/organizer")]
    [InlineData("/organizer/attendees")]
    [InlineData("/organizer/settings")]
    public async Task Organizer_pages_redirect_to_sign_in(string path)
    {
        var response = await factory.CreateNoRedirectClient().GetAsync(path);

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.StartsWith("http://localhost/account/sign-in?ReturnUrl=", response.Headers.Location!.ToString());
    }

    [Fact]
    public async Task An_htmx_request_without_a_session_gets_HX_Redirect_instead_of_the_sign_in_page()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "/organizer/attendees").AsHtmxPartial();
        var response = await factory.CreateNoRedirectClient().SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.True(response.Headers.TryGetValues("HX-Redirect", out var redirect));
        Assert.StartsWith("http://localhost/account/sign-in", redirect.Single());
    }

    [Fact]
    public async Task Culture_query_switches_formats_and_is_remembered()
    {
        var client = factory.CreateClient();
        var first = await client.GetAsync("/?culture=de-DE");
        var html = await first.Content.ReadAsStringAsync();
        Assert.Contains("<html lang=\"de\"", html);

        var second = await client.GetStringAsync("/");
        Assert.Contains("<html lang=\"de\"", second);
    }
}
