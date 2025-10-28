
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommand : RzComponent<RzCommand.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground"
    );

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public string? AriaLabel { get; set; }

    [Parameter]
    public bool ShouldFilter { get; set; } = true;

    [Parameter]
    public bool Loop { get; set; }

    [Parameter]
    public string? SelectedValue { get; set; }

    protected string ActiveItemClass { get; private set; } = string.Empty;
    protected string GroupHeadingClass { get; private set; } = string.Empty;

    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzCommand.DefaultAriaLabel"];
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCommand.DefaultAriaLabel"];

        // Extract class strings from the theme descriptors to pass to Alpine
        var itemDescriptor = Theme.RzCommandItem;
        var groupDescriptor = Theme.RzCommandGroup;
        
        // Manually get the class for the active variant
        if (itemDescriptor.Variants.TryGetValue(c => ((RzCommandItem)c).IsActive, out var activeVariant) &&
            activeVariant is Variant<bool, RzCommandItem.Slots> boolVariant &&
            boolVariant.TryGetValue(true, out var activeSlots))
        {
            ActiveItemClass = activeSlots.Base ?? "";
        }

        GroupHeadingClass = groupDescriptor?.Slots[g => g.Heading].ToString() ?? "";
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommand;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}