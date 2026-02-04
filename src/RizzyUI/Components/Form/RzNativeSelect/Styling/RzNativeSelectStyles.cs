
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a RzNativeSelect component.
/// </summary>
public interface IHasRzNativeSelectStylingProperties { }

/// <summary>
/// Defines the slots available for styling in the RzNativeSelect component.
/// </summary>
public sealed partial class RzNativeSelectSlots : ISlots
{
    /// <summary>
    /// The base slot for the wrapper div.
    /// </summary>
    [Slot("native-select-wrapper")]
    public string? Base { get; set; }

    /// <summary>
    /// The slot for the select element.
    /// </summary>
    [Slot("native-select")]
    public string? Select { get; set; }

    /// <summary>
    /// The slot for the chevron icon.
    /// </summary>
    [Slot("native-select-icon")]
    public string? Icon { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzNativeSelect component.
/// </summary>
public static class RzNativeSelectStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzNativeSelect component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzNativeSelectSlots>, RzNativeSelectSlots> DefaultDescriptor = new(
        @base: "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        slots: new()
        {
            [s => s.Select] = "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent bg-none px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            [s => s.Icon] = "text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
        }
    );
}