namespace RizzyUI;

/// <summary>
///     Provides default styles for the <see cref="RzBrowser" /> component.
/// </summary>
public class DefaultRzBrowserStyles : RzStylesBase.RzBrowserStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzBrowserStyles" /> class.
    /// </summary>
    /// <param name="theme">
    ///     The <see cref="RzTheme" /> instance that supplies styles tokens.
    /// </param>
    public DefaultRzBrowserStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "mt-2 card p-0 overflow-hidden border border-outline rounded-lg";

    /// <inheritdoc />
    public override string TopBar =>
        "bg-secondary w-full px-4 py-3 lg:py-1.5 pr-0 flex items-center justify-between border-b";

    /// <inheritdoc />
    public override string TrafficLightsContainer => "flex gap-1.5";

    /// <inheritdoc />
    public override string TrafficLightRed => "size-3 rounded-full bg-red-500";

    /// <inheritdoc />
    public override string TrafficLightYellow => "size-3 rounded-full bg-yellow-500";

    /// <inheritdoc />
    public override string TrafficLightGreen => "size-3 rounded-full bg-green-500";

    /// <inheritdoc />
    public override string ScreenSizeControlsContainer =>
        "text-foreground hidden items-center justify-center gap-4 lg:flex";

    /// <inheritdoc />
    public override string ScreenSizeButton =>
        "rounded-full p-1 transition hover:bg-secondary/10 focus:outline-none focus-visible:bg-secondary/10 dark:hover-bg-background/10 dark:focus-visible-bg-background/10";

    /// <inheritdoc />
    public override string ScreenSizeButtonGroup =>
        "bg-secondary border-outline flex items-center gap-1 rounded-full px-4";

    /// <inheritdoc />
    public override string ContentArea => "grid-pattern bg-background flex justify-center";

    /// <inheritdoc />
    public override string PreviewContainer =>
        "bg-background border-outline relative w-full overflow-hidden transition-all";
}