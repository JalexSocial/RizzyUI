using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI.Services.RzToast;
using Summit.Web.Infrastructure;

namespace Summit.Web.Areas.Organizer.Features.Settings;

/// <summary>
/// Settings in vertical tabs. The page renders every tab with a placeholder; a tab's panel loads when
/// it first becomes visible (hx-trigger="intersect once"). Forms post with htmx: general settings
/// (422 or a toast), the theme (a cookie and HX-Refresh), API keys (create in a dialog that shows the
/// secret once, revoke after a confirmation), and a test webhook (HX-Trigger with a payload).
/// </summary>
public sealed class SettingsController(SettingsStore store, IHtmxSwapService swaps, IRzToastService toasts, ThemeSelection themes, TimeProvider clock) : OrganizerController
{
    private const string Base = "/organizer/settings";

    [HttpGet(Base)]
    public IResult Index() => Results.Redirect($"{Base}/{SettingsSections.General}");

    [HttpGet(Base + "/{section}")]
    public IResult Section(string section) =>
        SettingsSections.IsKnown(section) ? View<SettingsPage>(new { Section = section }) : Results.NotFound();

    [HttpGet(Base + "/{section}/panel")]
    public async Task<IResult> Panel(string section, [FromQuery] int page = 1) => section switch
    {
        SettingsSections.General => PartialView<GeneralSettingsForm>(new { Initial = await store.GeneralAsync() }),
        SettingsSections.Appearance => PartialView<AppearancePanel>(new { Current = themes.Current.ThemeCode, Themes = themes.Available }),
        SettingsSections.ApiKeys => PartialView<ApiKeysPanel>(new { Keys = await store.KeysAsync() }),
        SettingsSections.Audit => PartialView<AuditLogPanel>(new { Log = await store.AuditAsync(page) }),
        SettingsSections.Developer => PartialView<DeveloperPanel>(),
        _ => Results.NotFound(),
    };

    [HttpPost(Base + "/general"), ValidateAntiForgeryToken]
    public async Task<IResult> SaveGeneral([FromForm(Name = "Model")] GeneralSettingsModel model)
    {
        if (!ModelState.IsValid)
        {
            Response.ValidationFailedForAnyRequest();
            return PartialView<GeneralSettingsForm>();
        }
        await store.SaveGeneralAsync(model, Actor);
        toasts.Success("The general settings were saved.", "Saved");
        return PartialView<GeneralSettingsForm>(new { Initial = await store.GeneralAsync(), Saved = true });
    }

    // The theme lives in a cookie and is applied by the layout, so the whole page must render again.
    [HttpPost(Base + "/appearance"), ValidateAntiForgeryToken]
    public IResult SaveTheme([FromForm(Name = "Appearance.Theme")] string theme)
    {
        if (!themes.Available.Any(t => t.ThemeCode == theme))
            return Results.BadRequest();
        ThemeSelection.Remember(Response, theme);
        Response.Htmx(h => h.Refresh());
        return Results.NoContent();
    }

    [HttpPost(Base + "/api-keys"), ValidateAntiForgeryToken]
    public async Task<IResult> CreateKey([FromForm(Name = "Key")] CreateKeyModel model)
    {
        if (model.Scopes.Any(s => !CreateKeyModel.KnownScopes.Any(k => k.Value == s)))
            ModelState.AddModelError("Key.Scopes", "Choose scopes from the list.");
        if (!ModelState.IsValid)
        {
            Response.ValidationFailedForAnyRequest();
            return PartialView<CreateKeyBody>();
        }

        var secret = await store.CreateKeyAsync(model, Actor);
        swaps.AddSwappableComponent<ApiKeysTable>("api-keys-table", new { Keys = await store.KeysAsync() });
        toasts.Success($"The key “{model.Name}” was created.", "API key created");
        return PartialView<CreateKeyBody>(new { CreatedName = model.Name, Secret = secret });
    }

    [HttpPost(Base + "/api-keys/{id:int}/revoke"), ValidateAntiForgeryToken]
    public async Task<IResult> RevokeKey(int id)
    {
        var name = await store.RevokeKeyAsync(id, Actor);
        if (name is null)
            return Results.NotFound();
        swaps.AddSwappableComponent<ApiKeysTable>("api-keys-table", new { Keys = await store.KeysAsync() });
        toasts.Success($"The key “{name}” was revoked.", "API key revoked");
        // Close only the revoke dialog (SF-003).
        Response.Htmx(h => h.Trigger("settings:revoke-close"));
        return PartialView<Components.Shared.Nothing>();
    }

    // A pretend webhook: the response carries the event as an HX-Trigger payload for the event viewer.
    [HttpPost(Base + "/developer/ping"), ValidateAntiForgeryToken]
    public IResult Ping()
    {
        var payload = new { type = "summit.ping", id = Guid.NewGuid().ToString("N")[..12], at = clock.GetUtcNow(), data = new { message = "Hello from Summit" } };
        Response.Htmx(h => h.Trigger("summit:webhook", payload));
        return Results.NoContent();
    }

    private string Actor => User.Identity?.Name ?? "Organizer";
}
