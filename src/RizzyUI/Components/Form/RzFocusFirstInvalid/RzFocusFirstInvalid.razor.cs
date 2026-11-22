using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Moves focus to the first invalid field of the enclosing form when the form renders with
/// validation errors, typically after a 422 response swapped it in (Summit SF-045). Place it inside
/// the form. It finds the first control with <c>aria-invalid="true"</c>; for controls that hide their
/// native element (RzCombobox, visually hidden checkboxes and switches) it focuses the visible control
/// of the same field.
/// </summary>
public partial class RzFocusFirstInvalid : RzComponent<RzFocusFirstInvalid.Slots>
{
    /// <summary>Defines the default styling for <see cref="RzFocusFirstInvalid"/> (none).</summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "");

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzFocusFirstInvalid;

    /// <summary>Defines the slots available for styling in <see cref="RzFocusFirstInvalid"/>.</summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>The hidden marker element.</summary>
        [Slot("focus-first-invalid")]
        public string? Base { get; set; }
    }
}
