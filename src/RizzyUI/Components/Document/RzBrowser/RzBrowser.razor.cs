using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// A component that simulates a browser window, useful for previewing components or content.
/// Includes traffic light buttons and optional responsive size controls (desktop only).
/// Styling is determined by the active <see cref="RzTheme"/>. Interactivity (size toggling, dynamic classes) is handled by Alpine.js.
/// </xmldoc>
public partial class RzBrowser : RzComponent // Inherits new RzComponent base
{
    /// <summary> The content to be displayed within the browser preview area. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }
    /// <summary> Optional Layout type. If provided, ChildContent will be rendered inside an <see cref="RzEmbeddedPreview"/> (iframe) using this layout. </summary>
    [Parameter] public Type? Layout { get; set; }

    // --- Style Properties derived from Theme ---
    protected string TopBarClass => Theme.RzBrowser.TopBar;
    protected string TrafficLightsContainerClass => Theme.RzBrowser.TrafficLightsContainer;
    protected string TrafficLightRedClass => Theme.RzBrowser.TrafficLightRed;
    protected string TrafficLightYellowClass => Theme.RzBrowser.TrafficLightYellow;
    protected string TrafficLightGreenClass => Theme.RzBrowser.TrafficLightGreen;
    protected string ScreenSizeControlsContainerClass => Theme.RzBrowser.ScreenSizeControlsContainer;
    protected string ScreenSizeButtonGroupClass => Theme.RzBrowser.ScreenSizeButtonGroup;
    protected string ScreenSizeButtonClass => Theme.RzBrowser.ScreenSizeButton;
    protected string ContentAreaClass => Theme.RzBrowser.ContentArea;
    protected string PreviewContainerClass => Theme.RzBrowser.PreviewContainer;

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzBrowser.Container);
}