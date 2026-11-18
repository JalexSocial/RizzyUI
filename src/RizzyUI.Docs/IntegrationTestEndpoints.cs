using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Antiforgery;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI.Docs.Components.IntegrationTests;
using RizzyUI.Services.RzToast;

namespace RizzyUI.Docs;

/// <summary>
/// Fragment endpoints for the integration harness (/_tests/harness). Mapped only when
/// <see cref="ConfigurationKey"/> is true; the published docs site never has them.
/// </summary>
public static class IntegrationTestEndpoints
{
    public const string ConfigurationKey = "Docs:EnableTestPages";
    public const string PathPrefix = "/_tests";

    private static int _round;

    public static void Map(WebApplication app)
    {
        var group = app.MapGroup(PathPrefix);

        group.MapGet("/toast-region", (IRizzyService rizzy) =>
            rizzy.PartialView<ToastRegion>(new { Round = Interlocked.Increment(ref _round) }));

        group.MapPost("/toast", (IRzToastService toasts) =>
        {
            toasts.Success("Sent from the server.", "Server toast");
            return Results.Content(string.Empty, "text/html");
        });

        group.MapGet("/overlay-region", (IRizzyService rizzy) =>
            rizzy.PartialView<OverlayRegion>(new { Round = Interlocked.Increment(ref _round) }));

        group.MapGet("/fragment", (IRizzyService rizzy, string? source) =>
            rizzy.PartialView<HarnessFragment>(new { Source = source ?? "unknown" }));

        group.MapGet("/oob", (IRizzyService rizzy) => rizzy.PartialView<OobFragment>());

        group.MapPost("/form", async (HttpContext context, IRizzyService rizzy, IAntiforgery antiforgery) =>
        {
            // The form posts Model.Name / Model.Email (EditForm field names). Read them directly and
            // validate the token explicitly (minimal APIs only do it for [FromForm] parameters).
            await antiforgery.ValidateRequestAsync(context);
            var form = await context.Request.ReadFormAsync();
            var model = new HarnessModel { Name = form["Model.Name"], Email = form["Model.Email"] };

            var results = new List<ValidationResult>();
            if (!Validator.TryValidateObject(model, new ValidationContext(model), results, validateAllProperties: true))
            {
                // 422 with the form and its errors; htmx 4 swaps it into the target.
                context.Response.Htmx().ValidationFailed();
                return rizzy.PartialView<HarnessForm>(new { Validate = true });
            }

            return rizzy.PartialView<HarnessForm>(new { Saved = true });
        });
    }
}
