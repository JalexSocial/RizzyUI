
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuSub.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a sub-menu container within an <see cref="RzDropdownMenu"/>.
/// It requires a <see cref="DropdownMenuSubTrigger"/> and <see cref="DropdownMenuSubContent"/> as children.
/// Interactivity is managed by the 'rzDropdownSubmenu' Alpine.js component.
/// </summary>
public partial class DropdownMenuSub : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzDropdownMenu"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDropdownMenu? ParentDropdownMenu { get; set; }

    /// <summary>
    /// Gets or sets the content of the sub-menu, typically a <see cref="DropdownMenuSubTrigger"/>
    /// and a <see cref="DropdownMenuSubContent"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the preferred position of the sub-menu content relative to its trigger.
    /// Defaults to <see cref="AnchorPoint.RightStart"/>.
    /// </summary>
    [Parameter]
    public AnchorPoint Anchor { get; set; } = AnchorPoint.RightStart;

    /// <summary>
    /// Gets or sets the offset in pixels from the anchor point where the sub-menu content should appear.
    /// Defaults to -4 (slight overlap).
    /// </summary>
    [Parameter]
    public int Offset { get; set; } = -4;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDropdownMenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuSub)} must be used within an {nameof(RzDropdownMenu)}.");
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.SubContainer);
    }
}