
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A visual separator for use within a `FieldGroup`, which can optionally contain text.
/// </summary>
public partial class FieldSeparator : RzComponent<FieldSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the FieldSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        slots: new()
        {
            [s => s.Separator] = "absolute inset-0 top-1/2",
            [s => s.Content] = "bg-background text-muted-foreground relative mx-auto block w-fit px-2"
        }
    );

    /// <summary>
    /// Gets or sets the optional content to be rendered in the middle of the separator line.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.FieldSeparator;

    /// <summary>
    /// Defines the slots available for styling in the FieldSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("field-separator")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the separator line.
        /// </summary>
        [Slot("separator")]
        public string? Separator { get; set; }
        /// <summary>
        /// The slot for the content span.
        /// </summary>
        [Slot("content")]
        public string? Content { get; set; }
    }
}