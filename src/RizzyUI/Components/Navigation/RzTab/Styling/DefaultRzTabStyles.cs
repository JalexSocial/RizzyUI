
namespace RizzyUI;

/// <summary> Provides default styles for RzTabs. </summary>
public class DefaultRzTabsStyles : RzStylesBase.RzTabsStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzTabsStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzTabsStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "flex flex-col gap-2"; // Matches kitchen sink .tabs

    /// <inheritdoc />
    public override string PanelsContainer => ""; // No specific container for panels in kitchen sink example, panels are direct children
}

/// <summary> Provides default styles for RzTabStrip. </summary>
public class DefaultRzTabStripStyles : RzStylesBase.RzTabStripStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzTabStripStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzTabStripStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Strip => "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"; // Matches kitchen sink [role='tablist']

    /// <inheritdoc />
    public override string Marker =>
        "hidden"; // Kitchen sink example does not use a separate marker div, selection is on the tab itself

    /// <inheritdoc />
    public override string MarkerInner => ""; // Not used if marker is hidden

    /// <inheritdoc />
    public override string GetColumnsCss(int tabCount)
    {
        // Kitchen sink tabs are flex items, not grid columns by default in the tablist
        return ""; // No grid-cols needed for kitchen sink style
    }

    /// <inheritdoc />
    public override string GetGapCss(Size spaceBetween)
    {
        // Gap is handled by padding on items and the p-[3px] on the strip
        return "";
    }

    /// <inheritdoc />
    public override string GetMarkerAfterBackgroundCss(SemanticColor color)
    {
        // Not used if marker is hidden
        return "";
    }
}

/// <summary> Provides default styles for RzTab. </summary>
public class DefaultRzTabStyles : RzStylesBase.RzTabStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzTabStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzTabStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Button =>
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"; // Matches kitchen sink [role='tab']

    /// <inheritdoc />
    public override string GetJustifyCss(Justify justify)
    {
        // Justification is on the tablist in kitchen sink, not individual tabs
        return "";
    }

    /// <inheritdoc />
    public override string GetTextColorCss(SemanticColor color)
    {
        // Base text color is already part of `Button`
        return "";
    }

    /// <inheritdoc />
    public override string GetBackgroundColorCss(SemanticColor color)
    {
        // Selected tab gets bg-background, non-selected are transparent within the muted tablist
        // This is handled by aria-selected state in the kitchen sink
        return "[&:not([aria-selected='true'])]:bg-transparent [aria-selected='true']:bg-background [aria-selected='true']:dark:text-foreground [aria-selected='true']:dark:border-input [aria-selected='true']:dark:bg-input/30 [aria-selected='true']:shadow-sm";
    }
}

/// <summary> Provides default styles for RzTabPanel. </summary>
public class DefaultRzTabPanelStyles : RzStylesBase.RzTabPanelStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzTabPanelStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzTabPanelStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string OuterContainer => "flex-1 outline-none"; // Matches kitchen sink [role='tabpanel']

    /// <inheritdoc />
    public override string InnerContainer => ""; // Kitchen sink example applies padding/card styles directly to content within panel

    /// <inheritdoc />
    public override string GetTextColorCss(SemanticColor color)
    {
        // Text color for panel content is typically inherited or set on the content itself
        return "";
    }
}