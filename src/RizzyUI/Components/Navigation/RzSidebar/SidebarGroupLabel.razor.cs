
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a heading for a <see cref="SidebarGroup"/>. It can also function as a trigger for a
/// collapsible section when using the `AsChild` pattern.
/// </summary>
public partial class SidebarGroupLabel : RzAsChildComponent<SidebarGroupLabel.Slots>
{
    /// <summary>
    /// Defines the default styling for the SidebarGroupLabel component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:opacity-0"
    );

    /// <summary>
    /// Gets the parent <see cref="SidebarGroup"/> to link via `aria-labelledby`.
    /// </summary>
    [CascadingParameter]
    protected SidebarGroup? ParentGroup { get; set; }

    /// <summary>
    /// Gets or sets the content of the label, typically text. Required.
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
        Element = "h3";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = ParentGroup?.LabelId,
            ["class"] = SlotClasses.GetBase(),
            ["data-slot"] = "sidebar-group-label"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarGroupLabel;

    /// <summary>
    /// Defines the slots available for styling in the SidebarGroupLabel component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}