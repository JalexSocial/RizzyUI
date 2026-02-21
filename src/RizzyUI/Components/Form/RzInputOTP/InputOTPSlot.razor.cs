using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents one visual OTP character slot tied to the parent native input value.
/// </summary>
public partial class InputOTPSlot : RzComponent<InputOTPSlot.Slots>
{
    /// <summary>
    /// Defines default styling for <see cref="InputOTPSlot"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[focused=true]:data-[active=true]:border-ring data-[focused=true]:data-[active=true]:ring-ring/50 data-[focused=true]:data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[focused=true]:data-[active=true]:aria-invalid:ring-destructive/40 data-[focused=true]:data-[active=true]:aria-invalid:border-destructive data-[focused=true]:data-[active=true]:z-10 data-[focused=true]:data-[active=true]:ring-[3px] data-[focused=true]:data-[selected=true]:border-ring data-[focused=true]:data-[selected=true]:ring-ring/50 data-[focused=true]:data-[selected=true]:z-10 data-[focused=true]:data-[selected=true]:ring-[3px]",
        slots: new()
        {
            [s => s.Character] = "text-foreground",
            [s => s.CaretWrapper] = "pointer-events-none absolute inset-0 flex items-center justify-center",
            [s => s.Caret] = "animate-caret-blink bg-foreground h-4 w-px duration-1000"
        }
    );

    /// <summary>
    /// Gets or sets the zero-based slot index.
    /// </summary>
    [Parameter, EditorRequired]
    public required int Index { get; set; }

    [CascadingParameter]
    private RzInputOTP? ParentInputOTP { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.InputOTPSlot;

    private string GetSlotClasses() => string.IsNullOrWhiteSpace(Class) ? (SlotClasses.GetBase() ?? string.Empty) : $"{SlotClasses.GetBase()} {Class}";

    /// <summary>
    /// Defines style slots for <see cref="InputOTPSlot"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the slot wrapper.
        /// </summary>
        [Slot("input-otp-slot")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the character text node.
        /// </summary>
        [Slot("character")]
        public string? Character { get; set; }

        /// <summary>
        /// Gets or sets classes for the fake caret wrapper.
        /// </summary>
        [Slot("caret-wrapper")]
        public string? CaretWrapper { get; set; }

        /// <summary>
        /// Gets or sets classes for the fake caret.
        /// </summary>
        [Slot("caret")]
        public string? Caret { get; set; }
    }
}
