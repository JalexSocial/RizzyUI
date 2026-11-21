using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Rizzy.Framework.Mvc;
using Rizzy.Htmx;
using Summit.Web.Infrastructure;

namespace Summit.Web.Features.Account;

public sealed class AccountController(OrganizerSignIn signIn, IOptions<SummitOptions> options, IWebHostEnvironment environment) : RzController
{
    [HttpGet(OrganizerAuthentication.SignInPath)]
    public IResult SignIn(string? returnUrl) =>
        View<SignInPage>(new { ReturnUrl = SafeReturnUrl(returnUrl), DemoAccount = DemoAccount() });

    [HttpPost(OrganizerAuthentication.SignInPath), ValidateAntiForgeryToken]
    public async Task<IResult> SignIn([FromForm(Name = "Model")] SignInModel model)
    {
        if (ModelState.IsValid)
        {
            var account = await signIn.VerifyAsync(model.Email, model.Password, HttpContext.RequestAborted);
            if (account is not null)
            {
                await OrganizerSignIn.SignInAsync(HttpContext, account);
                // A full navigation into the organizer area (it has its own layout and the new cookie).
                Response.Htmx(h => h.Redirect(SafeReturnUrl(model.ReturnUrl)));
                return Results.Ok();
            }

            Response.Htmx().ValidationFailed();
            return PartialView<SignInForm>(new { Error = "That email and password don't match an organizer account.", DemoAccount = DemoAccount() });
        }

        Response.Htmx().ValidationFailed();
        return PartialView<SignInForm>(new { DemoAccount = DemoAccount() });
    }

    [HttpPost("/account/sign-out"), ValidateAntiForgeryToken]
    public async Task<IResult> SignOutOrganizer()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        Response.Htmx(h => h.Redirect(OrganizerAuthentication.SignInPath));
        return Results.Ok();
    }

    private static string SafeReturnUrl(string? returnUrl) =>
        !string.IsNullOrEmpty(returnUrl) && returnUrl.StartsWith("/organizer", StringComparison.OrdinalIgnoreCase) && !returnUrl.StartsWith("//")
            ? returnUrl
            : "/organizer";

    // The demo account is shown on the sign-in page in Development and Testing only.
    private SummitOptions.DemoOrganizerOptions? DemoAccount() =>
        environment.IsProduction() ? null : options.Value.DemoOrganizer;
}
