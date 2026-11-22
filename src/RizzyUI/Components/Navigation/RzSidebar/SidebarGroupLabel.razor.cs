
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
    protected override string DefaultElement => "div";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentGroup == null)
        {
            throw new InvalidOperationException($"{nameof(SidebarGroupLabel)} must be used within a {nameof(SidebarGroup)}.");
        }
        // SF-075: the group references the label's id only when that id renders. With AsChild, a child
        // that declares its own id keeps it (D-26), and a component child may compute one (a collapsible
        // trigger), so only a declared id can be referenced.
        var renderedId = AsChild ? ChildRootId(ChildContent) ?? (ChildRootIsElement(ChildContent) ? ParentGroup.LabelId : null) : ParentGroup.LabelId;
        if (renderedId is not null)
            ParentGroup.RegisterLabel(renderedId);
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(CopyAdditionalAttributes(), StringComparer.OrdinalIgnoreCase)
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