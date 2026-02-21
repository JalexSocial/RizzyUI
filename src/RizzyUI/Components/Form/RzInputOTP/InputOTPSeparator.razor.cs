using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a visual separator between OTP groups.
/// </summary>
public partial class InputOTPSeparator : RzComponent<InputOTPSeparator.Slots>
{
    /// <summary>
    /// Defines default styling for <see cref="InputOTPSeparator"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-muted-foreground",
        slots: new()
        {
            [s => s.Icon] = "size-4"
        }
    );

    /// <summary>
    /// Gets or sets optional separator content.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.InputOTPSeparator;

    private string GetSeparatorClasses() => string.IsNullOrWhiteSpace(Class) ? (SlotClasses.GetBase() ?? string.Empty) : $"{SlotClasses.GetBase()} {Class}";

    /// <summary>
    /// Defines style slots for <see cref="InputOTPSeparator"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the separator root.
        /// </summary>
        [Slot("input-otp-separator")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the default icon.
        /// </summary>
        [Slot("icon")]
        public string? Icon { get; set; }
    }
}
