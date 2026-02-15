using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the trigger item that opens a submenu.
/// </summary>
public partial class MenubarSubTrigger : RzComponent<MenubarSubTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarSubTrigger"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        slots: new()
        {
            [s => s.Icon] = "mr-2 size-4",
            [s => s.Chevron] = "ml-auto size-4"
        }
    );

    /// <summary>
    /// Gets or sets trigger content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets an optional icon.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrWhiteSpace(Element)) Element = "button";
        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) && (AdditionalAttributes is null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarSubTrigger;

    /// <summary>
    /// Defines slots.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-sub-trigger")]
        public string? Base { get; set; }

        /// <summary>
        /// Leading icon slot.
        /// </summary>
        [Slot("icon")]
        public string? Icon { get; set; }

        /// <summary>
        /// Chevron icon slot.
        /// </summary>
        [Slot("chevron")]
        public string? Chevron { get; set; }
    }
}
