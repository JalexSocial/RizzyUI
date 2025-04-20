using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A component that simulates a browser window, useful for previewing components or content.
/// </summary>
public partial class RzBrowser : RzComponent
{
    /// <summary>
    /// The content to be displayed within the browser preview area.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Optional layout for rendering <see cref="ChildContent"/> inside an iframe.
    /// </summary>
    [Parameter] public Type? Layout { get; set; }

    /// <summary>
    /// Gets the CSS classes for the browser top bar.
    /// </summary>
    protected string TopBarClass => Theme.RzBrowser.TopBar;

    /// <summary>
    /// Gets the CSS classes for the traffic lights container.
    /// </summary>
    protected string TrafficLightsContainerClass => Theme.RzBrowser.TrafficLightsContainer;

    /// <summary>
    /// Gets the CSS class for the red traffic light.
    /// </summary>
    protected string TrafficLightRedClass => Theme.RzBrowser.TrafficLightRed;

    /// <summary>
    /// Gets the CSS class for the yellow traffic light.
    /// </summary>
    protected string TrafficLightYellowClass => Theme.RzBrowser.TrafficLightYellow;

    /// <summary>
    /// Gets the CSS class for the green traffic light.
    /// </summary>
    protected string TrafficLightGreenClass => Theme.RzBrowser.TrafficLightGreen;

    /// <summary>
    /// Gets the CSS classes for the screen size controls container.
    /// </summary>
    protected string ScreenSizeControlsContainerClass => Theme.RzBrowser.ScreenSizeControlsContainer;

    /// <summary>
    /// Gets the CSS classes for the screen size button group.
    /// </summary>
    protected string ScreenSizeButtonGroupClass => Theme.RzBrowser.ScreenSizeButtonGroup;

    /// <summary>
    /// Gets the CSS classes for the screen size button.
    /// </summary>
    protected string ScreenSizeButtonClass => Theme.RzBrowser.ScreenSizeButton;

    /// <summary>
    /// Gets the CSS classes for the content area.
    /// </summary>
    protected string ContentAreaClass => Theme.RzBrowser.ContentArea;

    /// <summary>
    /// Gets the CSS classes for the preview container.
    /// </summary>
    protected string PreviewContainerClass => Theme.RzBrowser.PreviewContainer;

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzBrowser.Container);
}