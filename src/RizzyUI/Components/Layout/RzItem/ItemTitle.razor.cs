
// src/RizzyUI/Components/Layout/RzItem/ItemTitle.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A component for displaying the title within an <see cref="ItemContent"/>.
/// </summary>
public partial class ItemTitle : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered as the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.ItemTitle.Title);
    }
}