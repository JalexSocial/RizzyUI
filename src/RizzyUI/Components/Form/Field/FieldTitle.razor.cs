
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A component for displaying the title or label text for a field, styled as a `div`.
/// </summary>
public partial class FieldTitle : RzComponent<FieldTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the FieldTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50"
    );

    /// <summary>
    /// Gets or sets the content to be rendered as the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.FieldTitle;

    /// <summary>
    /// Defines the slots available for styling in the FieldTitle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("field-label")]
        public string? Base { get; set; }
    }
}