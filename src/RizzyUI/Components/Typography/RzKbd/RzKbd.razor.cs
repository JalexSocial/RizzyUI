
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A component that renders a keyboard key, typically used to display keyboard shortcuts.
/// </summary>
public partial class RzKbd : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the kbd element.
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
        return TwMerge.Merge(AdditionalAttributes, Theme.RzKbd.Kbd);
    }
}