
// src/RizzyUI/Components/Layout/RzItem/ItemContent.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The main content area of an <see cref="RzItem"/>, typically containing <see cref="ItemTitle"/> and <see cref="ItemDescription"/>.
/// </summary>
public partial class ItemContent : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.ItemContent.Content);
    }
}