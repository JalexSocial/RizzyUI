
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for the header content of a <see cref="DialogContent"/>, typically containing a <see cref="DialogTitle"/> and <see cref="DialogDescription"/>.
/// </summary>
public partial class DialogHeader : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDialog.Header);
    }
}