
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuItem.razor.cs
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents an individual interactive item within a <see cref="DropdownMenuGroup"/> or <see cref="DropdownMenuContent"/>.
/// </summary>
public partial class DropdownMenuItem : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the menu item, typically text. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets an optional icon to display before the item content.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Gets or sets optional content to display as a shortcut hint (e.g., "⌘S").
    /// This can be a <see cref="DropdownMenuShortcut"/> component or simple text.
    /// </summary>
    [Parameter]
    public RenderFragment? ShortcutContent { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the menu item is disabled.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "button"; // Default to button for better accessibility with role="menuitem"
        }
        // Ensure type="button" if it's a button to prevent form submission
        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) &&
            (AdditionalAttributes == null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.MenuItem);
    }
}