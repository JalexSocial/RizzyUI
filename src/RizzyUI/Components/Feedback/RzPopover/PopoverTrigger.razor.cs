
// src/RizzyUI/Components/Feedback/RzPopover/PopoverTrigger.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// An interactive element that toggles the visibility of its associated <see cref="PopoverContent"/>.
/// It must be a child of an <see cref="RzPopover"/> component.
/// </summary>
public partial class PopoverTrigger : RzAsChildComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzPopover"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzPopover? ParentPopover { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentPopover == null)
        {
            throw new InvalidOperationException($"{nameof(PopoverTrigger)} must be used within an {nameof(RzPopover)}.");
        }
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = ParentPopover?.TriggerId,
            ["class"] = RootClass(),
            ["x-ref"] = "trigger",
            ["x-on:click"] = "toggle",
            ["aria-haspopup"] = "dialog",
            ["aria-controls"] = ParentPopover?.ContentId,
            ["x-bind:aria-expanded"] = "ariaExpanded"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzPopover.TriggerWrapper);
    }
}