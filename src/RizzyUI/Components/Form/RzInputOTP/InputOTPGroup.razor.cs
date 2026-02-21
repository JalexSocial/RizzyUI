using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Groups OTP slots into contiguous segmented sections.
/// </summary>
public partial class InputOTPGroup : RzComponent<InputOTPGroup.Slots>
{
    /// <summary>
    /// Defines default styling for the <see cref="InputOTPGroup"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex items-center"
    );

    /// <summary>
    /// Gets or sets the grouped slot content.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.InputOTPGroup;

    private string GetGroupClasses() => string.IsNullOrWhiteSpace(Class) ? (SlotClasses.GetBase() ?? string.Empty) : $"{SlotClasses.GetBase()} {Class}";

    /// <summary>
    /// Defines style slots for <see cref="InputOTPGroup"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the group wrapper.
        /// </summary>
        [Slot("input-otp-group")]
        public string? Base { get; set; }
    }
}
