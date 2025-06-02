
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuGroup.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a group of related <see cref="DropdownMenuItem"/>s within <see cref="DropdownMenuContent"/>.
/// </summary>
public partial class DropdownMenuGroup : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the group, typically <see cref="DropdownMenuItem"/>s. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.Group);
    }
}