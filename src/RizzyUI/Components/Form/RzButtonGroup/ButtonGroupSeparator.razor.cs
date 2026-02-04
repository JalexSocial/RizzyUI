
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A separator component specifically designed for use within a <see cref="RzButtonGroup"/>.
/// It visually divides buttons within the group.
/// </summary>
public partial class ButtonGroupSeparator : RzComponent<ButtonGroupSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the ButtonGroupSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto"
    );

    /// <summary>
    /// Gets or sets the orientation of the separator. Defaults to Vertical.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ButtonGroupSeparator;

    /// <summary>
    /// Defines the slots available for styling in the ButtonGroupSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("button-group-separator")]
        public string? Base { get; set; }
    }
}