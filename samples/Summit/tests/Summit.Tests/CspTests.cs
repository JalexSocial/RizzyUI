using System.Text.RegularExpressions;

namespace Summit.Tests;

public sealed class CspTests(CspSummitFactory factory) : IClassFixture<CspSummitFactory>
{
    [Fact]
    public async Task The_csp_mode_sends_a_strict_nonce_policy_and_loads_the_csp_build()
    {
        var response = await factory.CreateClient().GetAsync("/");
        var html = await response.Content.ReadAsStringAsync();

        var policy = response.Headers.GetValues("Content-Security-Policy").Single();
        var nonce = Regex.Match(policy, "'nonce-([^']+)'").Groups[1].Value;
        Assert.NotEmpty(nonce);
        Assert.Contains("'strict-dynamic'", policy);
        Assert.Contains("object-src 'none'", policy);
        Assert.DoesNotContain("unsafe-eval", policy);
        Assert.DoesNotContain("unsafe-inline", policy);

        Assert.Matches("rizzyui-csp\\.min\\.[a-z0-9]+\\.js", html);

        // Every executable script element carries this request's nonce. JSON data blocks
        // (type="application/json", component configuration) are not scripts as far as CSP is concerned.
        var scripts = Regex.Matches(html, "<script\\b[^>]*>").Where(s => !s.Value.Contains("type=\"application/json\"")).ToList();
        Assert.NotEmpty(scripts);
        Assert.All(scripts, script => Assert.Contains($"nonce=\"{nonce}\"", script.Value));

        // No inline event handlers: a nonce policy blocks them.
        Assert.DoesNotMatch("\\son[a-z]+=\"", html);
    }

    [Fact]
    public async Task The_standard_mode_sends_no_policy()
    {
        using var standard = new SummitFactory();
        var response = await standard.CreateClient().GetAsync("/");

        Assert.False(response.Headers.Contains("Content-Security-Policy"));
        Assert.Contains("rizzyui.min.", await response.Content.ReadAsStringAsync());
    }
}
