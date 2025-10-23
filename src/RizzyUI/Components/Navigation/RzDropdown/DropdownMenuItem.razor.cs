
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents an individual interactive item within a <see cref="DropdownMenuGroup"/> or <see cref="DropdownMenuContent"/>.
/// </summary>
public partial class DropdownMenuItem : RzComponent<DropdownMenuItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex cursor-default select-none w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
        slots: new()
        {
            [s => s.Icon] = "mr-2 size-4 text-xl"
        }
    );

    /// <summary>
    /// Gets or sets the content of the menu item, typically text. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets an optional icon to display before the item content.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Gets or sets optional content to display as a shortcut hint (e.g., "⌘S").
    /// This can be a <see cref="DropdownMenuShortcut"/> component or simple text.
    /// </summary>
    [Parameter]
    public RenderFragment? ShortcutContent { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the menu item is disabled.
    /// Defaults to false.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "button";
        }
        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) &&
            (AdditionalAttributes == null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuItem;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the icon element.
        /// </summary>
        public string? Icon { get; set; }
    }
}