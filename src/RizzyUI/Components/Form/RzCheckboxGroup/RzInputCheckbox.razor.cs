
// src/RizzyUI/Components/Form/RzCheckboxGroup/RzInputCheckbox.razor.cs
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A standalone checkbox component for binding to a boolean value.
/// </summary>
public partial class RzInputCheckbox : InputBase<bool, RzInputCheckbox.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzInputCheckbox component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
    );

    private InputCheckbox? _elem;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCheckbox;
    
    /// <summary>
    /// Defines the slots available for styling in the RzInputCheckbox component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the checkbox input element.
        /// </summary>
        [Slot("checkbox")]
        public string? Base { get; set; }
    }
}