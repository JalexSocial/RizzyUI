
// src/RizzyUI/Components/Layout/RzItem/RzItemGroup.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for grouping a list of <see cref="RzItem"/> components.
/// </summary>
public partial class RzItemGroup : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the item group, which should be a series of <see cref="RzItem"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzItemGroup.Group);
    }
}