
// src/RizzyUI/Components/Navigation/RzDropdown/RzDropdownMenu.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The root component for a dropdown menu system. It provides context for its children,
/// including trigger, content, items, groups, and sub-menus.
/// Interactivity is managed by the 'rzDropdownMenu' Alpine.js component.
/// </summary>
public partial class RzDropdownMenu : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the dropdown menu, typically including a <see cref="DropdownMenuTrigger"/>
    /// and a <see cref="DropdownMenuContent"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the preferred position of the dropdown menu relative to the trigger.
    /// Defaults to <see cref="AnchorPoint.Bottom"/>.
    /// </summary>
    [Parameter]
    public AnchorPoint Anchor { get; set; } = AnchorPoint.Bottom;

    /// <summary>
    /// Gets or sets the offset in pixels from the anchor point where the dropdown menu should appear.
    /// Defaults to 4.
    /// </summary>
    [Parameter]
    public int Offset { get; set; } = 4;

    /// <summary>
    /// Gets or sets whether the dropdown menu behaves as a modal, affecting focus trapping.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool IsModal { get; set; } = false;

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.Container, Theme.RzDropdownMenu.RelativeWrapper);
    }
}