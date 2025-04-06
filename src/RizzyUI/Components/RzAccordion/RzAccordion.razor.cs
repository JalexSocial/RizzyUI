using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options; // Add this
using RizzyUI.Extensions;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// Represents an accordion component that allows for collapsible sections. Styling is handled by the active theme.
/// </xmldoc>
public partial class RzAccordion : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> When true, multiple sections may be open simultaneously. </summary>
    [Parameter] public bool AllowMultipleOpen { get; set; } = false;
    /// <summary> Child content containing one or more RzAccordionSection components. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null) // Should not happen with default fallback
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzAccordion.Container);
}

