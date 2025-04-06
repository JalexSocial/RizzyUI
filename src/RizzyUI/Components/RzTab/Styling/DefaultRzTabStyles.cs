using RizzyUI.Extensions; // For ColorUtil
using RizzyUI.Styling;

namespace RizzyUI.Components.RzTab.Styling;

/// <summary> Provides default styles for RzTabs. </summary>
public class DefaultRzTabsStyles : RzStylesBase.RzTabsStylesBase // Not sealed
{
    public DefaultRzTabsStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Container => ""; // Base container usually has no style
    /// <inheritdoc/>
    public override string PanelsContainer => ""; // Container for panels usually has no specific style
}

/// <summary> Provides default styles for RzTabStrip. </summary>
public class DefaultRzTabStripStyles : RzStylesBase.RzTabStripStylesBase // Not sealed
{
    public DefaultRzTabStripStyles(RzTheme theme) : base(theme) { }
    /// <inheritdoc/>
    public override string Strip => "relative inline-grid select-none items-center";
    /// <inheritdoc/>
    public override string Marker => "z-20 opacity-0 absolute pointer-events-none left-0 h-full w-1/2 duration-300 ease-out after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full";
    /// <inheritdoc/>
    public override string MarkerInner => "h-full w-full"; // Inner div might not need styles

    /// <inheritdoc/>
    public override string GetColumnsCss(int tabCount) => tabCount switch {
        1 => "grid-cols-1", 2 => "grid-cols-2", 3 => "grid-cols-3", 4 => "grid-cols-4",
        5 => "grid-cols-5", 6 => "grid-cols-6", 7 => "grid-cols-7", 8 => "grid-cols-8",
        9 => "grid-cols-9", 10 => "grid-cols-10", 11 => "grid-cols-11", 12 => "grid-cols-12",
        _ => "grid-cols-1" // Fallback or handle more if needed
    };

    /// <inheritdoc/>
    public override string GetGapCss(Size spaceBetween) => spaceBetween switch {
        Size.ExtraSmall => "gap-0", Size.Small => "gap-1", Size.Medium => "gap-2",
        Size.Large => "gap-3", Size.ExtraLarge => "gap-4",
        _ => GetGapCss(Size.Medium)
    };

    /// <inheritdoc/>
    public override string GetMarkerAfterBackgroundCss(SemanticColor color) =>
        color.ToBackgroundClass("after"); // Use ColorUtil extension
}

/// <summary> Provides default styles for RzTab. </summary>
public class DefaultRzTabStyles : RzStylesBase.RzTabStylesBase // Not sealed
{
    public DefaultRzTabStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Button => $"z-10 relative inline-flex h-8 px-2 w-full cursor-pointer items-center whitespace-nowrap rounded-{Theme.BorderRadiusTokenName} rounded-b-none font-medium transition-all mr-1";

    /// <inheritdoc/>
    public override string GetJustifyCss(Justify justify) => justify switch {
        Justify.Start => "justify-start", Justify.Center => "justify-center", Justify.End => "justify-end",
        _ => GetJustifyCss(Justify.Center)
    };

    /// <inheritdoc/>
    public override string GetTextColorCss(SemanticColor color) => color.ToTextClass();

    /// <inheritdoc/>
    public override string GetBackgroundColorCss(SemanticColor color) => color.ToBackgroundClass();
}

/// <summary> Provides default styles for RzTabPanel. </summary>
public class DefaultRzTabPanelStyles : RzStylesBase.RzTabPanelStylesBase // Not sealed
{
     public DefaultRzTabPanelStyles(RzTheme theme) : base(theme) { }
     /// <inheritdoc/>
     public override string OuterContainer => "relative"; // For positioning if needed
     /// <inheritdoc/>
     public override string InnerContainer => ""; // Base inner container, padding/bg added via attributes usually
     /// <inheritdoc/>
     public override string GetTextColorCss(SemanticColor color) => color.ToTextClass();
}

