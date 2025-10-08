
// src/RizzyUI/Components/Layout/RzItem/ItemHeader.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for header content within an <see cref="RzItem"/>, spanning the full width.
/// </summary>
public partial class ItemHeader : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.ItemHeader.Header);
    }
}