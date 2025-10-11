
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the trigger element for a <see cref="DropdownMenuSub"/>, which opens a nested sub-menu.
/// It is typically styled like a <see cref="DropdownMenuItem"/> but includes a chevron icon.
/// </summary>
public partial class DropdownMenuSubTrigger : RzComponent<DropdownMenuSubTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuSubTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex cursor-default select-none w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent hover:bg-accent hover:text-accent-foreground",
        slots: new()
        {
            [s => s.Icon] = "mr-2 size-4 text-xl",
            [s => s.Chevron] = "ml-auto size-4"
        }
    );

    /// <summary>
    /// Gets the parent <see cref="DropdownMenuSub"/> component.
    /// </summary>
    [CascadingParameter]
    protected DropdownMenuSub? ParentSubmenu { get; set; }

    /// <summary>
    /// Gets or sets the content of the sub-menu trigger, typically text. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets an optional icon to display before the trigger content.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Gets the ID for the sub-menu trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentSubmenu?.Id}-subtrigger";

    /// <summary>
    /// Gets the ID of the sub-menu content element this trigger controls.
    /// </summary>
    protected string SubContentId => $"{ParentSubmenu?.Id}-subcontent";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSubmenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuSubTrigger)} must be used within a {nameof(DropdownMenuSub)}.");
        }
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuSubTrigger;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuSubTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Icon { get; set; }
        public string? Chevron { get; set; }
    }
}