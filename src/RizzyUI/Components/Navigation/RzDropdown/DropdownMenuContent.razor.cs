
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuContent.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the content area of an <see cref="RzDropdownMenu"/> that appears when the trigger is activated.
/// It typically contains <see cref="DropdownMenuItem"/>, <see cref="DropdownMenuGroup"/>, and other related components.
/// </summary>
public partial class DropdownMenuContent : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzDropdownMenu"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDropdownMenu? ParentDropdownMenu { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the dropdown panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the content element.
    /// </summary>
    protected string ContentId => $"{ParentDropdownMenu?.Id}-content";

    /// <summary>
    /// Gets the ID of the trigger element that controls this content.
    /// </summary>
    protected string TriggerId => $"{ParentDropdownMenu?.Id}-trigger";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDropdownMenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuContent)} must be used within an {nameof(RzDropdownMenu)}.");
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        // The floating-ui positioning styles will be applied by Alpine.js
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.ContentContainer);
    }
}