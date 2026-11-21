using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Rizzy.Htmx;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Infrastructure;

/// <summary>Cookie sign-in for the organizer area. One account, no ASP.NET Core Identity UI.</summary>
public static class OrganizerAuthentication
{
    public const string Policy = "Organizer";
    public const string CookieName = "summit_auth";
    public const string SignInPath = "/account/sign-in";

    public static IServiceCollection AddOrganizerAuthentication(this IServiceCollection services)
    {
        services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Cookie.Name = CookieName;
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.LoginPath = SignInPath;
                options.LogoutPath = "/account/sign-out";
                options.AccessDeniedPath = SignInPath;
                options.ExpireTimeSpan = TimeSpan.FromHours(12);
                options.SlidingExpiration = true;
                // An htmx request from an expired session gets HX-Redirect to the sign-in page instead
                // of the sign-in page swapped into a fragment (Rizzy).
                options.Events.UseHtmxRedirects();
            });

        services.AddAuthorizationBuilder()
            .AddPolicy(Policy, policy => policy.RequireAuthenticatedUser().RequireRole(Policy));

        services.AddScoped<OrganizerSignIn>();
        return services;
    }
}

public sealed class OrganizerSignIn(SummitDbContext db)
{
    private static readonly PasswordHasher<OrganizerAccount> Hasher = new();

    /// <summary>Returns the account when the email and password match.</summary>
    public async Task<OrganizerAccount?> VerifyAsync(string? email, string? password, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrEmpty(password))
            return null;

        var normalized = email.Trim().ToLowerInvariant();
        var account = await db.OrganizerAccounts.SingleOrDefaultAsync(a => a.Email.ToLower() == normalized, cancellationToken);
        if (account is null)
            return null;

        return Hasher.VerifyHashedPassword(account, account.PasswordHash, password) == PasswordVerificationResult.Failed ? null : account;
    }

    public static Task SignInAsync(HttpContext context, OrganizerAccount account)
    {
        var identity = new ClaimsIdentity(
        [
            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new Claim(ClaimTypes.Name, account.Name),
            new Claim(ClaimTypes.Email, account.Email),
            new Claim(ClaimTypes.Role, OrganizerAuthentication.Policy),
        ], CookieAuthenticationDefaults.AuthenticationScheme);

        return context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }
}
