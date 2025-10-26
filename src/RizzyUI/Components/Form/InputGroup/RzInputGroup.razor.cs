
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container that groups an input with addons like text, icons, or buttons.
/// </summary>
public partial class RzInputGroup : RzComponent<RzInputGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzInputGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none h-9 min-w-0 has-[>textarea]:h-auto has-[>[data-align=inline-start]]:[&>input]:pl-2 has-[>[data-align=inline-end]]:[&>input]:pr-2 has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the input group.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzInputGroup;

    /// <summary>
    /// Defines the slots available for styling in the RzInputGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("input-group")]
        public string? Base { get; set; }
    }
}