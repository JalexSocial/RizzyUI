
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// An optional, secondary action button within a <see cref="SidebarMenuItem"/>,
/// typically used for icon-only actions like "add" or "more options".
/// </summary>
public partial class SidebarMenuAction : RzAsChildComponent<SidebarMenuAction.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarMenuAction component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/menu-item:opacity-100"
    );

    /// <summary>
    /// Gets or sets the content of the action button, usually an icon.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["data-slot"] = "sidebar-menu-action"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarMenuAction;

    /// <summary>
    /// Defines the slots available for styling in the SidebarMenuAction component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}