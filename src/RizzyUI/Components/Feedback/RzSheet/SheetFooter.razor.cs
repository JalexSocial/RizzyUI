
// src/RizzyUI/Components/Feedback/RzSheet/SheetFooter.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for the footer content of a <see cref="SheetContent"/>, typically aligned to the bottom.
/// </summary>
public partial class SheetFooter : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the footer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSheet.Footer);
    }
}