
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuShortcut.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a styled text element typically used to display keyboard shortcuts
/// alongside a <see cref="DropdownMenuItem"/>.
/// </summary>
public partial class DropdownMenuShortcut : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the shortcut, e.g., "⌘S". Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "span";
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.MenuItemShortcut);
    }
}