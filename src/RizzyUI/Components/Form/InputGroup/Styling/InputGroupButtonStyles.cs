
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for an InputGroupButton component.
/// </summary>
public interface IHasInputGroupButtonStylingProperties
{
    /// <summary>
    /// Gets the size of the button.
    /// </summary>
    public InputGroupButtonSize Size { get; }
}

/// <summary>
/// Defines the slots available for styling in the InputGroupButton component.
/// </summary>
public sealed partial class InputGroupButtonSlots : ISlots
{
    /// <summary>
    /// The base slot for the button element.
    /// </summary>
    [Slot("input-group-button")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the InputGroupButton component.
/// </summary>
public static class InputGroupButtonStyles
{
    /// <summary>
    /// The default TvDescriptor for the InputGroupButton component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<InputGroupButtonSlots>, InputGroupButtonSlots> DefaultDescriptor = new(
        @base: "text-sm shadow-none flex gap-2 items-center",
        variants: new()
        {
            [c => ((IHasInputGroupButtonStylingProperties)c).Size] = new Variant<InputGroupButtonSize, InputGroupButtonSlots>
            {
                [InputGroupButtonSize.ExtraSmall] = "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
                [InputGroupButtonSize.Small] = "h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5",
                [InputGroupButtonSize.IconExtraSmall] = "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
                [InputGroupButtonSize.IconSmall] = "size-8 p-0 has-[>svg]:p-0"
            }
        }
    );
}