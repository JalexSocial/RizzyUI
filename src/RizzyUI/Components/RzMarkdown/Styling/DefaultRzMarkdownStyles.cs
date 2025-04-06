using RizzyUI.Styling;

namespace RizzyUI.Components.RzMarkdown.Styling;

/// <summary>
/// Provides the default styles for the RzMarkdown component.
/// </summary>
public  class DefaultRzMarkdownStyles : RzStylesBase.RzMarkdownStylesBase
{
    public DefaultRzMarkdownStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    // Includes base prose, dark mode inversion, and theme text color
    public override string Container => $"prose dark:prose-invert text-{Theme.Light.OnSurface.TailwindClassName} max-w-none";

    /// <inheritdoc/>
    public override string GetProseWidthCss(ProseWidth width) => width switch
    {
        ProseWidth.Compact => "prose-compact",
        ProseWidth.Comfortable => "prose-comfortable",
        ProseWidth.Relaxed => "prose-relaxed",
        ProseWidth.Wide => "prose-wide",
        ProseWidth.UltraWide => "prose-ultrawide", // Corrected class name if needed
        ProseWidth.Full => "prose-full", // Ensure this utility exists or remove if max-w-none covers it
        _ => GetProseWidthCss(ProseWidth.Comfortable) // Default to comfortable
    };
}

