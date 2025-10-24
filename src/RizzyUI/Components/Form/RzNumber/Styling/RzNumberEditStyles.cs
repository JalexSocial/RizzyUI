
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzNumberEdit component.
/// </summary>
public sealed partial class RzNumberEditSlots : ISlots
{
    /// <summary>
    /// The base slot for the component's root element.
    /// </summary>
    public string? Base { get; set; }
    /// <summary>
    /// The slot for the wrapper around the input and prepend element.
    /// </summary>
    public string? InputWrapper { get; set; }
    /// <summary>
    /// The slot for the prepend element container.
    /// </summary>
    public string? PrependElement { get; set; }
    /// <summary>
    /// The slot for the icon within the prepend element.
    /// </summary>
    public string? PrependIconContainer { get; set; }
    /// <summary>
    /// The slot for the `&lt;input&gt;` element.
    /// </summary>
    public string? Input { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzNumberEdit component.
/// </summary>
public static class RzNumberEditStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzNumberEdit component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzNumberEditSlots>, RzNumberEditSlots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.InputWrapper] = "relative",
            [s => s.PrependElement] = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground",
            [s => s.PrependIconContainer] = "size-4",
            [s => s.Input] = "appearance-none file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        }
    );
}