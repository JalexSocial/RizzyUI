using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// Represents a dropdown component with a customizable trigger and content area.
/// It manages its open/close state and keyboard navigation via Alpine.js.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzDropdown : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Gets or sets the render fragment that defines the dropdown trigger. Required. </summary>
    [Parameter, EditorRequired] public RenderFragment? Trigger { get; set; }
    /// <summary> Gets or sets the render fragment that defines the dropdown content. Required. </summary>
    [Parameter, EditorRequired] public RenderFragment? Content { get; set; }
    /// <summary> Gets or sets the point on the trigger where the dropdown menu attaches. Defaults to BottomCenter. </summary>
    [Parameter] public AnchorPoint Anchor { get; set; } = AnchorPoint.BottomCenter;

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the root container. </summary>
    protected string ContainerClass => Theme.RzDropdown.Container;
    /// <summary> Gets the computed CSS classes for the relative wrapper div. </summary>
    protected string RelativeWrapperClass => Theme.RzDropdown.RelativeWrapper;
    /// <summary> Gets the computed CSS classes for the trigger wrapper div. </summary>
    protected string TriggerWrapperClass => Theme.RzDropdown.TriggerWrapper;
    /// <summary> Gets the computed CSS classes for the floating menu container div. </summary>
    protected string MenuContainerClass => Theme.RzDropdown.MenuContainer;
    /// <summary> Gets the computed CSS classes for the inner div within the menu container. </summary>
    protected string MenuInnerContainerClass => Theme.RzDropdown.MenuInnerContainer;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, ContainerClass); // Apply base style from theme
}

