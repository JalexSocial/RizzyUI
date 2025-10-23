
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component that renders a keyboard key, typically used to display keyboard shortcuts.
/// </summary>
public partial class RzKbd : RzComponent<RzKbd.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzKbd component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the kbd element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "kbd";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzKbd;

    /// <summary>
    /// Defines the slots available for styling in the RzKbd component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}