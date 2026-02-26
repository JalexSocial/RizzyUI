
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// An input component specifically styled for use within a sidebar.
/// </summary>
public partial class SidebarInput : InputBase<string, SidebarInput.Slots>
{
    /// <summary>
    /// Defines the default styling and variations for the SidebarInput component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        extends: FormInputStyles.DefaultDescriptor,
        @base: "bg-background h-8 w-full shadow-none"
    );

    private RzInputTextBase? _elem;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.SidebarInput;

    /// <summary>
    /// Defines the slots available for styling the SidebarInput component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the base CSS classes applied to the component's root element.
        /// </summary>
        [Slot("sidebar-input")]
        public string? Base { get; set; }
    }
}