
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container component that manages the state for collapsible content,
/// allowing child <see cref="CollapsibleTrigger"/> and <see cref="CollapsibleContent"/>
/// components to coordinate their behavior.
/// </summary>
public partial class RzCollapsible : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the collapsible component, which should include
    /// a <see cref="CollapsibleTrigger"/> and a <see cref="CollapsibleContent"/>. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the initial open state of the collapsible content.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool DefaultOpen { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCollapsible.Container);
    }
}