
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
///     A component that simulates a browser window, useful for previewing components or content.
/// </summary>
public partial class RzBrowser : RzComponent<RzBrowser.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzBrowser component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "mt-2 card p-0 overflow-hidden border border-outline rounded-lg",
        slots: new()
        {
            [s => s.TopBar] = "bg-secondary w-full px-4 py-3 lg:py-1.5 pr-0 flex items-center justify-between border-b",
            [s => s.TrafficLightsContainer] = "flex gap-1.5",
            [s => s.TrafficLightRed] = "size-3 rounded-full bg-red-500",
            [s => s.TrafficLightYellow] = "size-3 rounded-full bg-yellow-500",
            [s => s.TrafficLightGreen] = "size-3 rounded-full bg-green-500",
            [s => s.ScreenSizeControlsContainer] = "text-foreground hidden items-center justify-center gap-4 lg:flex",
            [s => s.ScreenSizeButtonGroup] = "bg-secondary border-outline flex items-center gap-1 rounded-full px-4",
            [s => s.ScreenSizeButton] = "rounded-full p-1 transition hover:bg-secondary/10 focus:outline-none focus-visible:bg-secondary/10 dark:hover-bg-background/10 dark:focus-visible-bg-background/10",
            [s => s.ContentArea] = "grid-pattern bg-background",
            [s => s.PreviewContainer] = "bg-background border-outline relative w-full overflow-hidden transition-all"
        }
    );

    /// <summary>
    ///     The content to be displayed within the browser preview area.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     Optional layout for rendering <see cref="ChildContent" /> inside an iframe via <see cref="RzEmbeddedPreview"/>.
    /// </summary>
    [Parameter] public Type? Layout { get; set; }

    /// <summary>
    /// Gets or sets the title attribute for the iframe when a layout is used.
    /// Defaults to a localized "Component Preview". Provides context for screen reader users.
    /// </summary>
    [Parameter] public string? PreviewIFrameTitle { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        PreviewIFrameTitle ??= Localizer["RzBrowser.PreviewIFrameTitle"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        PreviewIFrameTitle ??= Localizer["RzBrowser.PreviewIFrameTitle"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzBrowser;

    /// <summary>
    /// Defines the slots available for styling in the RzBrowser component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the top bar of the browser window.
        /// </summary>
        public string? TopBar { get; set; }
        /// <summary>
        /// The slot for the container of the traffic light buttons.
        /// </summary>
        public string? TrafficLightsContainer { get; set; }
        /// <summary>
        /// The slot for the red traffic light button.
        /// </summary>
        public string? TrafficLightRed { get; set; }
        /// <summary>
        /// The slot for the yellow traffic light button.
        /// </summary>
        public string? TrafficLightYellow { get; set; }
        /// <summary>
        /// The slot for the green traffic light button.
        /// </summary>
        public string? TrafficLightGreen { get; set; }
        /// <summary>
        /// The slot for the container of the screen size control buttons.
        /// </summary>
        public string? ScreenSizeControlsContainer { get; set; }
        /// <summary>
        /// The slot for the button group of screen size controls.
        /// </summary>
        public string? ScreenSizeButtonGroup { get; set; }
        /// <summary>
        /// The slot for an individual screen size control button.
        /// </summary>
        public string? ScreenSizeButton { get; set; }
        /// <summary>
        /// The slot for the main content area of the browser.
        /// </summary>
        public string? ContentArea { get; set; }
        /// <summary>
        /// The slot for the container of the preview content.
        /// </summary>
        public string? PreviewContainer { get; set; }
    }
}