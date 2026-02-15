using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents keyboard shortcut text rendered to the end of a menu item.
/// </summary>
public partial class MenubarShortcut : RzComponent<MenubarShortcut.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarShortcut"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "ml-auto text-xs tracking-widest text-muted-foreground");

    /// <summary>
    /// Gets or sets the shortcut content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrWhiteSpace(Element)) Element = "span";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarShortcut;

    /// <summary>
    /// Defines slots for <see cref="MenubarShortcut"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-shortcut")]
        public string? Base { get; set; }
    }
}
