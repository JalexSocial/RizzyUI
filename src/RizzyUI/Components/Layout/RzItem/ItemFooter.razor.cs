
// src/RizzyUI/Components/Layout/RzItem/ItemFooter.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for footer content within an <see cref="RzItem"/>, spanning the full width.
/// </summary>
public partial class ItemFooter : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.ItemFooter.Footer);
    }
}