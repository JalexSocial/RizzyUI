
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzCheckboxGroupItem component.
/// </summary>
public sealed partial class RzCheckboxGroupItemSlots : ISlots
{
    /// <summary>
    /// The base slot for the item's root element.
    /// </summary>
    public string? Base { get; set; }
    /// <summary>
    /// The slot for the wrapper around the checkbox input and icon.
    /// </summary>
    public string? CheckboxWrapper { get; set; }
    /// <summary>
    /// The slot for the checkbox `&lt;input&gt;` element.
    /// </summary>
    public string? CheckboxInput { get; set; }
    /// <summary>
    /// The slot for the container of the checkmark icon.
    /// </summary>
    public string? IconContainer { get; set; }
    /// <summary>
    /// The slot for the title `&lt;span&gt;` element.
    /// </summary>
    public string? TitleSpan { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzCheckboxGroupItem component.
/// </summary>
public static class RzCheckboxGroupItemStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzCheckboxGroupItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzCheckboxGroupItemSlots>, RzCheckboxGroupItemSlots> DefaultDescriptor = new(
        @base: "flex items-center gap-3 cursor-pointer",
        slots: new()
        {
            [s => s.CheckboxWrapper] = "relative",
            [s => s.CheckboxInput] = "appearance-none border-input dark:bg-input/30 checked:bg-primary dark:checked:bg-primary checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            [s => s.IconContainer] = "absolute inset-0 flex items-center justify-center pointer-events-none",
            [s => s.TitleSpan] = "text-sm leading-none font-medium select-none peer-disabled:opacity-50"
        }
    );
}