using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.Sections;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI;

/// <summary>
/// Renders the theme of <see cref="RzThemeProvider"/> (its CSS variables and the dark-mode script) in
/// the document's <c>&lt;head&gt;</c>. Place it in your root layout's <c>&lt;head&gt;</c>, next to
/// <c>&lt;RzHeadOutlet /&gt;</c>.
/// </summary>
/// <remarks>
/// The theme does not go through Blazor's <c>HeadContent</c>: Blazor shows only the most recently
/// rendered <c>HeadContent</c>, so a page with its own <c>HeadContent</c> would remove the theme
/// (Summit SF-034). This outlet is a section of its own. Without it, <see cref="RzThemeProvider"/>
/// renders the theme at the start of its own content instead.
/// </remarks>
public sealed class RzThemeHeadOutlet : ComponentBase
{
    /// <summary>The section the provider renders the theme into.</summary>
    internal static readonly object SectionId = new();

    [Inject] private IServiceProvider Services { get; set; } = default!;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        // The outlet sits in <head>, before RzThemeProvider in <body>, so it registers first.
        var state = Services.GetService<RzThemeHeadState>();
        if (state is not null)
            state.OutletRendered = true;
    }

    /// <inheritdoc />
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        builder.OpenComponent<SectionOutlet>(0);
        builder.AddComponentParameter(1, nameof(SectionOutlet.SectionId), SectionId);
        builder.CloseComponent();
    }
}

/// <summary>
/// Per-request record of the <see cref="RzThemeHeadOutlet"/> on the page and the provider that fills it.
/// </summary>
/// <remarks>
/// One request can render more than one document: <c>RzBrowser</c> renders its preview, with its own
/// <c>&lt;head&gt;</c> and <see cref="RzThemeProvider"/>, inside the page. Only the first provider (the
/// page's) uses the outlet; every other provider renders its theme where it stands.
/// </remarks>
internal sealed class RzThemeHeadState
{
    public bool OutletRendered { get; set; }

    private object? _owner;

    /// <summary>Whether <paramref name="provider"/> renders into the outlet (the first provider to ask does).</summary>
    public bool UseOutlet(object provider)
    {
        if (!OutletRendered) return false;
        _owner ??= provider;
        return ReferenceEquals(_owner, provider);
    }
}
