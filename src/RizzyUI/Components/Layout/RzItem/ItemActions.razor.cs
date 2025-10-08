
// src/RizzyUI/Components/Layout/RzItem/ItemActions.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for action elements, like buttons, within an <see cref="RzItem"/>.
/// </summary>
public partial class ItemActions : RzComponent
{
    /// <summary>
    /// Gets or sets the content to be rendered, typically one or more buttons.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.ItemActions.Actions);
    }
}