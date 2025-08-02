
// src/RizzyUI/Components/Feedback/RzSheet/SheetHeader.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for the header content of a <see cref="SheetContent"/>, typically containing a <see cref="SheetTitle"/> and <see cref="SheetDescription"/>.
/// </summary>
public partial class SheetHeader : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSheet.Header);
    }
}