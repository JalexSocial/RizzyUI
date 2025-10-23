
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a visual separator line within a <see cref="DropdownMenuContent"/> or <see cref="DropdownMenuGroup"/>.
/// </summary>
public partial class DropdownMenuSeparator : RzComponent<DropdownMenuSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "-mx-1 my-1 h-px bg-border"
    );

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "hr";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuSeparator;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}