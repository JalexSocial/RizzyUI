using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a horizontal separator in menubar menus.
/// </summary>
public partial class MenubarSeparator : RzComponent<MenubarSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarSeparator"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "-mx-1 my-1 h-px bg-border");

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrWhiteSpace(Element)) Element = "div";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarSeparator;

    /// <summary>
    /// Defines slots for <see cref="MenubarSeparator"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-separator")]
        public string? Base { get; set; }
    }
}
