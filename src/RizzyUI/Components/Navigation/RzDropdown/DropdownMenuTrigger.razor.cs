
// src/RizzyUI/Components/Navigation/RzDropdown/DropdownMenuTrigger.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the trigger element for an <see cref="RzDropdownMenu"/>.
/// This component wraps the content that users will click or interact with to open the dropdown.
/// </summary>
public partial class DropdownMenuTrigger : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzDropdownMenu"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDropdownMenu? ParentDropdownMenu { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentDropdownMenu?.Id}-trigger";

    /// <summary>
    /// Gets the ID of the content element this trigger controls.
    /// </summary>
    protected string ContentId => $"{ParentDropdownMenu?.Id}-content";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDropdownMenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuTrigger)} must be used within an {nameof(RzDropdownMenu)}.");
        }
        // Default element can remain div, or be more specific if needed, but often it's just a wrapper.
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenu.TriggerWrapper);
    }
}