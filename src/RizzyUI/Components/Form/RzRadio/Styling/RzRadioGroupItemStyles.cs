
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzRadioGroupItem component.
/// </summary>
public sealed partial class RzRadioGroupItemSlots : ISlots
{
    /// <summary>
    /// The base slot for the item's root element.
    /// </summary>
    public string? Base { get; set; }
    /// <summary>
    /// The slot for the radio `<input>` element.
    /// </summary>
    public string? RadioInput { get; set; }
    /// <summary>
    /// The slot for the container of the radio button icon.
    /// </summary>
    public string? IconContainer { get; set; }
    /// <summary>
    /// The slot for the main clickable container.
    /// </summary>
    public string? ClickableContainer { get; set; }
    /// <summary>
    /// The slot for the wrapper around the content (icon and text).
    /// </summary>
    public string? ContentWrapper { get; set; }
    /// <summary>
    /// The slot for the leading icon container.
    /// </summary>
    public string? LeadingIconContainer { get; set; }
    /// <summary>
    /// The slot for the container of the label and description text.
    /// </summary>
    public string? TextContainer { get; set; }
    /// <summary>
    /// The slot for the label text.
    /// </summary>
    public string? LabelText { get; set; }
    /// <summary>
    /// The slot for the description text.
    /// </summary>
    public string? DescriptionText { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzRadioGroupItem component.
/// </summary>
public static class RzRadioGroupItemStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzRadioGroupItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzRadioGroupItemSlots>, RzRadioGroupItemSlots> DefaultDescriptor = new(
        @base: "flex items-center gap-2 cursor-pointer",
        slots: new()
        {
            [s => s.RadioInput] = "appearance-none peer absolute",
            [s => s.IconContainer] = "relative size-4 shrink-0 rounded-full border border-input shadow-xs text-primary focus-visible:border-ring focus-visible:ring-ring/50 peer-checked:border-primary peer-checked:before:bg-primary peer-checked:before:content-[''] peer-checked:before:absolute peer-checked:before:top-1/2 peer-checked:before:left-1/2 peer-checked:before:-translate-x-1/2 peer-checked:before:-translate-y-1/2 peer-checked:before:size-2 peer-checked:before:rounded-full dark:bg-input/30 dark:peer-checked:border-primary dark:peer-checked:before:bg-primary",
            [s => s.ClickableContainer] = "flex-1",
            [s => s.ContentWrapper] = "flex items-center gap-2",
            [s => s.LeadingIconContainer] = "text-muted-foreground size-4",
            [s => s.TextContainer] = "grid gap-0.5",
            [s => s.LabelText] = "font-normal text-sm peer-disabled:opacity-50",
            [s => s.DescriptionText] = "text-xs text-muted-foreground peer-disabled:opacity-50"
        }
    );
}