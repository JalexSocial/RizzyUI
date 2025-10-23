
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A container component for form fields, typically grouping a label, input, help text, and validation message.
///     Provides consistent spacing. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzField : RzComponent<RzField.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzField component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "grid gap-2"
    );

    /// <summary> The content to be rendered inside the field container (label, input, etc.). </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzField;

    /// <summary>
    /// Defines the slots available for styling in the RzField component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}