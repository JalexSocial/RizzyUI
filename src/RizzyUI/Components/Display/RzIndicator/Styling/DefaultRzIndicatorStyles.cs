
// src/RizzyUI/Components/Display/RzIndicator/Styling/DefaultRzIndicatorStyles.cs
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the <see cref="RzIndicator"/> component.
/// </summary>
public sealed class DefaultRzIndicatorStyles : RzStylesBase.RzIndicatorStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzIndicatorStyles"/> class.
    /// </summary>
    /// <param name="theme">The active theme instance.</param>
    public DefaultRzIndicatorStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string IndicatorBase => 
        "absolute rounded-full border-2 border-surface dark:border-surface-dark"; // Base style from RzAvatar indicator

    /// <inheritdoc/>
    public override string GetPositionCss(IndicatorPosition position)
    {
        // These assume the parent element has `position: relative`.
        // Adjustments with translate might be needed for perfect centering on corners/edges.
        return position switch
        {
            // Corners (simple offset)
            IndicatorPosition.TopStart => "top-0 left-0",
            IndicatorPosition.TopEnd => "top-0 right-0", // Default for RzAvatar
            IndicatorPosition.BottomStart => "bottom-0 left-0",
            IndicatorPosition.BottomEnd => "bottom-0 right-0",

            // Edges (centered along edge)
            IndicatorPosition.Top => "top-0 left-1/2 transform -translate-x-1/2",
            IndicatorPosition.Bottom => "bottom-0 left-1/2 transform -translate-x-1/2",
            IndicatorPosition.Left => "left-0 top-1/2 transform -translate-y-1/2",
            IndicatorPosition.Right => "right-0 top-1/2 transform -translate-y-1/2",
            
            // Center of parent
            IndicatorPosition.Center => "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",

            // Mid-points on edges (less common for small indicators but included for completeness)
            IndicatorPosition.LeftStart => "left-0 top-0", // Same as TopStart for this context
            IndicatorPosition.LeftEnd => "left-0 bottom-0", // Same as BottomStart for this context
            IndicatorPosition.RightStart => "right-0 top-0", // Same as TopEnd for this context
            IndicatorPosition.RightEnd => "right-0 bottom-0", // Same as BottomEnd for this context

            _ => GetPositionCss(IndicatorPosition.TopEnd) // Default to TopEnd
        };
    }

    /// <inheritdoc/>
    public override string GetSizeCss(Size size)
    {
        // Reusing similar sizing logic from RzAvatar's indicator
        return size switch
        {
            Size.ExtraSmall => "size-2", // Slightly smaller than avatar's smallest indicator
            Size.Small => "size-2.5",    // Common default size
            Size.Medium => "size-3",
            Size.Large => "size-3.5",
            Size.ExtraLarge => "size-4",
            _ => GetSizeCss(Size.Small)
        };
    }
}