using System.Net;

namespace Summit.Tests;

public sealed class SignInTests(SummitFactory factory) : IClassFixture<SummitFactory>
{
    private static FormUrlEncodedContent Form(string token, string email, string password) => new(new Dictionary<string, string>
    {
        ["__RequestVerificationToken"] = token,
        ["_handler"] = "Model",
        ["Model.Email"] = email,
        ["Model.Password"] = password,
        ["Model.ReturnUrl"] = "/organizer/attendees",
    });

    [Fact]
    public async Task Missing_fields_return_422_with_the_form_and_its_errors()
    {
        var client = factory.CreateClient();
        var token = await client.GetAntiforgeryTokenAsync("/account/sign-in");

        var request = new HttpRequestMessage(HttpMethod.Post, "/account/sign-in") { Content = Form(token, "not-an-email", "") }.AsHtmxPartial();
        var response = await client.SendAsync(request);
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        Assert.Contains("id=\"sign-in-form\"", html);
        Assert.Contains("Enter a valid email address.", html);
        Assert.Contains("Enter your password.", html);
        Assert.Contains("value=\"not-an-email\"", html);
        Assert.DoesNotContain("Skip to content", html);
    }

    [Fact]
    public async Task A_wrong_password_returns_422_with_a_form_level_error()
    {
        var client = factory.CreateClient();
        var token = await client.GetAntiforgeryTokenAsync("/account/sign-in");

        var request = new HttpRequestMessage(HttpMethod.Post, "/account/sign-in") { Content = Form(token, "organizer@summit.test", "wrong") }.AsHtmxPartial();
        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);
        Assert.Contains("don&#x27;t match an organizer account", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Valid_credentials_sign_in_and_redirect_to_the_return_url()
    {
        var client = factory.CreateClient();
        var token = await client.GetAntiforgeryTokenAsync("/account/sign-in");

        var request = new HttpRequestMessage(HttpMethod.Post, "/account/sign-in") { Content = Form(token, "organizer@summit.test", "summit-demo-2027") }.AsHtmxPartial();
        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("/organizer/attendees", response.Headers.GetValues("HX-Redirect").Single());

        var page = await client.GetAsync("/organizer/attendees");
        Assert.Equal(HttpStatusCode.OK, page.StatusCode);
        Assert.Contains("data-slot=\"sidebar", await page.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task A_post_without_an_antiforgery_token_is_rejected()
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/account/sign-in") { Content = Form("", "organizer@summit.test", "summit-demo-2027") }.AsHtmxPartial();
        var response = await factory.CreateClient().SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
