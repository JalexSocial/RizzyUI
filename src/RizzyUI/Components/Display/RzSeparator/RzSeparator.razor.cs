
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
///     A component that renders a horizontal or vertical divider line, optionally with centered or aligned text/content.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </summary>
public partial class RzSeparator : RzComponent<RzSeparator.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzSeparator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex items-center text-sm text-outline",
        variants: new()
        {
            [s => ((RzSeparator)s).HasContent] = new Variant<bool, Slots>(),
            [s => ((RzSeparator)s).Orientation] = new Variant<Orientation, Slots>
            {
                [Orientation.Horizontal] = "w-full",
                [Orientation.Vertical] = "inline-flex flex-col h-full"
            },
            [s => ((RzSeparator)s).Style] = new Variant<SeparatorStyle, Slots>
            {
                [SeparatorStyle.Solid] = "before:border-solid after:border-solid",
                [SeparatorStyle.Dashed] = "before:border-dashed after:border-dashed",
                [SeparatorStyle.Dotted] = "before:border-dotted after:border-dotted"
            },
            [s => ((RzSeparator)s).LabelAlignment] = new Variant<Align, Slots>()
        },
        compoundVariants: new()
        {
            // No Content Variants
            new(s => !((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Horizontal && ((RzSeparator)s).Style == SeparatorStyle.Solid) { Class = "my-4 border-t border-border w-full border-solid" },
            new(s => !((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Horizontal && ((RzSeparator)s).Style == SeparatorStyle.Dashed) { Class = "my-4 border-t border-border w-full border-dashed" },
            new(s => !((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Horizontal && ((RzSeparator)s).Style == SeparatorStyle.Dotted) { Class = "my-4 border-t border-border w-full border-dotted" },
            new(s => !((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Vertical && ((RzSeparator)s).Style == SeparatorStyle.Solid) { Class = "mx-4 border-r border-border h-full border-solid" },
            new(s => !((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Vertical && ((RzSeparator)s).Style == SeparatorStyle.Dashed) { Class = "mx-4 border-r border-border h-full border-dashed" },
            new(s => !((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Vertical && ((RzSeparator)s).Style == SeparatorStyle.Dotted) { Class = "mx-4 border-r border-border h-full border-dotted" },

            // With Content Variants - Horizontal
            new(s => ((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Horizontal && ((RzSeparator)s).LabelAlignment == Align.Start) { Class = "after:flex-1 after:border-t after:border-border after:ms-6" },
            new(s => ((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Horizontal && ((RzSeparator)s).LabelAlignment == Align.Center) { Class = "before:flex-1 before:border-t before:border-border before:me-6 after:flex-1 after:border-t after:border-border after:ms-6" },
            new(s => ((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Horizontal && ((RzSeparator)s).LabelAlignment == Align.End) { Class = "before:flex-1 before:border-t before:border-border before:me-6" },

            // With Content Variants - Vertical
            new(s => ((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Vertical && ((RzSeparator)s).LabelAlignment == Align.Start) { Class = "after:flex-1 after:w-px after:border-r after:border-border after:mt-2" },
            new(s => ((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Vertical && ((RzSeparator)s).LabelAlignment == Align.Center) { Class = "before:flex-1 before:w-px before:border-r before:border-border before:mb-2 after:flex-1 after:w-px after:border-r after:border-border after:mt-2" },
            new(s => ((RzSeparator)s).HasContent && ((RzSeparator)s).Orientation == Orientation.Vertical && ((RzSeparator)s).LabelAlignment == Align.End) { Class = "before:flex-1 before:w-px before:border-r before:border-border before:mb-2" }
        }
    );

    /// <summary> The style of the dividing line (Solid, Dashed, Dotted). Defaults to Solid. </summary>
    [Parameter] public SeparatorStyle Style { get; set; } = SeparatorStyle.Solid;

    /// <summary>
    ///     The alignment of the child content within the divider (Start, Center, End). Only used if
    ///     <see cref="ChildContent" /> is provided. Defaults to Center.
    /// </summary>
    [Parameter] public Align LabelAlignment { get; set; } = Align.Center;

    /// <summary>
    /// Gets or sets the orientation of the separator (Horizontal or Vertical).
    /// Defaults to <see cref="Orientation.Horizontal"/>.
    /// </summary>
    [Parameter] public Orientation Orientation { get; set; } = Orientation.Horizontal;

    /// <summary>
    ///     Optional content to display within the divider (e.g., text or an icon). If null, a simple divider line is
    ///     rendered.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// A protected property to expose the presence of ChildContent to the TvDescriptor.
    /// </summary>
    protected bool HasContent => ChildContent != null;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSeparator;

    /// <summary>
    /// Defines the slots available for styling in the RzSeparator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}