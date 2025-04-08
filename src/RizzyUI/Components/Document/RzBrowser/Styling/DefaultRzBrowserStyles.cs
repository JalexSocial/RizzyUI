namespace RizzyUI;

/// <summary> Provides default styles for RzBrowser. </summary>
public class DefaultRzBrowserStyles : RzStylesBase.RzBrowserStylesBase 
{
    /// <inheritdoc />
    public DefaultRzBrowserStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Container => $"overflow-hidden border border-outline rounded-theme";
    /// <inheritdoc/>
    public override string TopBar => $"bg-surface-alt w-full px-4 py-3 lg:py-1.5 pr-0 flex items-center justify-between border-outline border-b";
    /// <inheritdoc/>
    public override string TrafficLightsContainer => "flex gap-1.5";
    /// <inheritdoc/>
    public override string TrafficLightRed => "size-3 rounded-full bg-red-500";
    /// <inheritdoc/>
    public override string TrafficLightYellow => "size-3 rounded-full bg-yellow-500";
    /// <inheritdoc/>
    public override string TrafficLightGreen => "size-3 rounded-full bg-green-500";
    /// <inheritdoc/>
    public override string ScreenSizeControlsContainer => "text-on-surface hidden items-center justify-center gap-4 lg:flex";
    /// <inheritdoc/>
    public override string ScreenSizeButton => $"rounded-full p-1 transition hover:bg-surface-dark/10 focus:outline-none focus-visible:bg-surface-dark/10 dark:hover:bg-surface/10 dark:focus-visible:bg-surface/10";
    /// <inheritdoc/>
    public override string ScreenSizeButtonGroup => $"bg-surface-alt border-outline flex items-center gap-1 rounded-full px-4"; // Style for the grouping div
    /// <inheritdoc/>
    public override string ContentArea => "grid-pattern bg-surface flex justify-center";
    /// <inheritdoc/>
    public override string PreviewContainer => $"bg-surface border-outline relative w-full overflow-hidden transition-all"; // Removed border-none, controlled by Alpine now
}