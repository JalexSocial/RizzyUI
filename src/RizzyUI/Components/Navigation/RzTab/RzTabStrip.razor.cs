
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasTabStripStylingProperties
{
    public SemanticColor SelectedTabUnderlineColor { get; }
    public Justify Justify { get; }
    public Size SpaceBetween { get; }
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

    [Parameter]
    public Justify Justify { get; set; } = Justify.Center;

    [Parameter]
    public Size SpaceBetween { get; set; } = Size.Medium;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    public SemanticColor SelectedTabUnderlineColor => Parent?.SelectedTabUnderlineColor ?? SemanticColor.Primary;
    public int TabCount => Parent?._tabs.Count ?? 0;

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (Parent == null)
            throw new InvalidOperationException($"{GetType()} must exist within an RzTabs component.");
    }

    protected override TvDescriptor<RzComponent<RzTabStripSlots>, RzTabStripSlots> GetDescriptor() => Theme.RzTabStrip;
}