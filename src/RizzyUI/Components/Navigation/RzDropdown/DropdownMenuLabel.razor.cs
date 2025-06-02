
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuLabel.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a non-interactive label or heading within a <see cref="DropdownMenuContent"/>.
/// </summary>
public partial class DropdownMenuLabel : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the label. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.Label);
    }
}