
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container that groups related buttons together with consistent styling.
/// Supports horizontal and vertical orientations and manages border/radius merging for children.
/// </summary>
public partial class RzButtonGroup : RzComponent<RzButtonGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzButtonGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-fit items-stretch [&>*]:shadow-none [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2",
        variants: new()
        {
            [c => ((RzButtonGroup)c).Orientation] = new Variant<Orientation, Slots>
            {
                [Orientation.Horizontal] = "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
                [Orientation.Vertical] = "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
            }
        }
    );

    /// <summary>
    /// Gets or sets the content of the button group.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the orientation of the button group. Defaults to Horizontal.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Horizontal;

    /// <summary>
    /// Gets or sets the theme variant to be cascaded to child buttons.
    /// If set, child buttons with no explicit Variant will use this value.
    /// </summary>
    [Parameter]
    public ThemeVariant? GroupVariant { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "div";
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzButtonGroup;

    /// <summary>
    /// Defines the slots available for styling in the RzButtonGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the button group container.
        /// </summary>
        [Slot("button-group")]
        public string? Base { get; set; }
    }
}