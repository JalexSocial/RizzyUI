
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the main input control within a `Field`, such as an input, select, or textarea.
/// </summary>
public partial class FieldContent : RzComponent<FieldContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the FieldContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/field-content flex flex-1 flex-col gap-1.5 leading-snug"
    );

    /// <summary>
    /// Gets or sets the content to be rendered, typically a form input control.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.FieldContent;

    /// <summary>
    /// Defines the slots available for styling in the FieldContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("field-content")]
        public string? Base { get; set; }
    }
}