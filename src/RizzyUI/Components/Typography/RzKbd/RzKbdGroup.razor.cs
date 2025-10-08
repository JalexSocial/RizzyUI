
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A component that groups multiple <see cref="RzKbd"/> components together.
/// </summary>
public partial class RzKbdGroup : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the group, typically multiple <see cref="RzKbd"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "kbd";
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzKbdGroup.Group);
    }
}