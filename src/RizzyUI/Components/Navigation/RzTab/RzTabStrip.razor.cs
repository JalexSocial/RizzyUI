
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a TabStrip component.
/// </summary>
public interface IHasTabStripStylingProperties
{
    /// <summary>
    /// Gets the color of the underline for the selected tab.
    /// </summary>
    public SemanticColor SelectedTabUnderlineColor { get; }
    /// <summary>
    /// Gets the justification of the tabs within the strip.
    /// </summary>
    public Justify Justify { get; }
    /// <summary>
    /// Gets the spacing between tabs.
    /// </summary>
    public Size SpaceBetween { get; }
    /// <summary>
    /// Gets the total number of tabs.
    /// </summary>
    public int TabCount { get; }
}

/// <xmldoc>
///     Represents the container for the clickable tab buttons within an <see cref="RzTabs" /> component.
///     It manages the layout and the visual selection marker.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTabStrip : RzComponent<RzTabStripSlots>, IHasTabStripStylingProperties
{
    [CascadingParameter]
    private RzTabs? Parent { get; set; }

    /// <summary>
    /// Gets or sets the horizontal alignment of tab content within the strip.
    /// </summary>
    [Parameter]
    public Justify Justify { get; set; } = Justify.Center;

    /// <summary>
    /// Gets or sets the gap spacing between tabs.
    /// </summary>
    [Parameter]
    public Size SpaceBetween { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets the child content, which should be a series of <see cref="RzTab"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the color of the underline for the selected tab.
    /// </summary>
    public SemanticColor SelectedTabUnderlineColor => Parent?.SelectedTabUnderlineColor ?? SemanticColor.Primary;
    
    /// <summary>
    /// Gets the total number of tabs in the strip.
    /// </summary>
    public int TabCount => Parent?._tabs.Count ?? 0;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzTabStripSlots>, RzTabStripSlots> GetDescriptor() => Theme.RzTabStrip;
}