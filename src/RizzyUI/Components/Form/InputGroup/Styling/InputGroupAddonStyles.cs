
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for an InputGroupAddon component.
/// </summary>
public interface IHasInputGroupAddonStylingProperties
{
    /// <summary>
    /// Gets the alignment of the addon.
    /// </summary>
    public InputGroupAddonAlign Align { get; }
}

/// <summary>
/// Defines the slots available for styling in the InputGroupAddon component.
/// </summary>
public sealed partial class InputGroupAddonSlots : ISlots
{
    /// <summary>
    /// The base slot for the main addon container.
    /// </summary>
    [Slot("input-group-addon")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the InputGroupAddon component.
/// </summary>
public static class InputGroupAddonStyles
{
    /// <summary>
    /// The default TvDescriptor for the InputGroupAddon component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<InputGroupAddonSlots>, InputGroupAddonSlots> DefaultDescriptor = new(
        @base: "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50",
        variants: new()
        {
            [c => ((IHasInputGroupAddonStylingProperties)c).Align] = new Variant<InputGroupAddonAlign, InputGroupAddonSlots>
            {
                [InputGroupAddonAlign.InlineStart] = "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
                [InputGroupAddonAlign.InlineEnd] = "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
                [InputGroupAddonAlign.BlockStart] = "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
                [InputGroupAddonAlign.BlockEnd] = "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5"
            }
        }
    );
}