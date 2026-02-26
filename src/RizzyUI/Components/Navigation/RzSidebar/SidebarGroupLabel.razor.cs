
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A label for a SidebarGroup.
/// </summary>
public partial class SidebarGroupLabel : RzAsChildComponent<SidebarGroupLabel.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarGroupLabel component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"
    );

    /// <summary>
    /// Gets the parent SidebarGroup component.
    /// </summary>
    [CascadingParameter]
    protected SidebarGroup? ParentGroup { get; set; }

    /// <summary>
    /// The content of the label.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentGroup == null)
        {
            throw new InvalidOperationException($"{nameof(SidebarGroupLabel)} must be used within a {nameof(SidebarGroup)}.");
        }
        Element = "div";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = ParentGroup?.LabelId,
            ["class"] = SlotClasses.GetBase(),["data-sidebar"] = "group-label",
            ["data-slot"] = "sidebar-group-label"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarGroupLabel;

    /// <summary>
    /// Defines the slots available for styling the SidebarGroupLabel component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-group-label")]
        public string? Base { get; set; }
    }
}