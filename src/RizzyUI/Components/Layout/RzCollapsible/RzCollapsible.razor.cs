
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container component that manages the state for collapsible content,
/// allowing child <see cref="CollapsibleTrigger"/> and <see cref="CollapsibleContent"/>
/// components to coordinate their behavior.
/// </summary>
public partial class RzCollapsible : RzAsChildComponent<RzCollapsible.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCollapsible component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
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
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <summary>
    /// The root attributes. With <c>AsChild</c> they go on the child, so a collapsible can be a
    /// <c>SidebarMenuItem</c> (an <c>li</c>) instead of a <c>div</c> between the list and its item
    /// (Summit SF-080).
    /// </summary>
    protected override Dictionary<string, object?> GetComponentAttributes() =>
        new(CopyAdditionalAttributes(), StringComparer.OrdinalIgnoreCase)
        {
            ["data-slot"] = "collapsible",
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["x-data"] = "rzCollapsible",
            ["x-load"] = LoadStrategyOrNull,
            ["data-alpine-root"] = Id,
            ["data-default-open"] = DefaultOpen.ToString().ToLowerInvariant(),
            ["x-bind:data-state"] = "state",
        };

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.RzCollapsible;

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