
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container component that manages the state for collapsible content,
/// allowing child <see cref="CollapsibleTrigger"/> and <see cref="CollapsibleContent"/>
/// components to coordinate their behavior.
/// </summary>
public partial class RzCollapsible : RzComponent<RzCollapsible.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCollapsible component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/collapsible"
    );

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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCollapsible;

    /// <summary>
    /// Defines the slots available for styling in the RzCollapsible component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}