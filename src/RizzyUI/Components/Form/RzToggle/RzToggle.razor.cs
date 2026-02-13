using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A two-state button that can be toggled on or off.
/// </summary>
public partial class RzToggle : RzComponent<RzToggle.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzToggle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
        variants: new()
        {
            [c => ((RzToggle)c).Variant] = new Variant<ToggleVariant, Slots>
            {
                [ToggleVariant.Default] = "bg-transparent",
                [ToggleVariant.Outline] = "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
            },
            [c => ((RzToggle)c).Size] = new Variant<ToggleSize, Slots>
            {
                [ToggleSize.Default] = "h-9 px-2 min-w-9",
                [ToggleSize.Small] = "h-8 px-1.5 min-w-8",
                [ToggleSize.Large] = "h-10 px-2.5 min-w-10"
            }
        }
    );

    /// <summary>
    /// Gets or sets the content displayed inside the toggle.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the toggle.
    /// </summary>
    [Parameter]
    public ToggleVariant Variant { get; set; } = ToggleVariant.Default;

    /// <summary>
    /// Gets or sets the size of the toggle.
    /// </summary>
    [Parameter]
    public ToggleSize Size { get; set; } = ToggleSize.Default;

    /// <summary>
    /// Gets or sets whether the toggle is currently pressed in controlled mode.
    /// </summary>
    [Parameter]
    public bool? Pressed { get; set; }

    /// <summary>
    /// Gets or sets the initial pressed state for uncontrolled mode.
    /// </summary>
    [Parameter]
    public bool DefaultPressed { get; set; }

    /// <summary>
    /// Gets or sets whether the toggle is disabled.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// Gets the serialized value used by Alpine for controlled mode.
    /// </summary>
    protected string? PressedAttributeValue => Pressed.HasValue ? Pressed.Value.ToString().ToLowerInvariant() : null;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "button";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzToggle;

    /// <summary>
    /// Defines the slots available for styling in the RzToggle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot, representing the root element of the toggle.
        /// </summary>
        [Slot("toggle")]
        public string? Base { get; set; }
    }
}

/// <summary>
/// Defines available visual variants for a toggle.
/// </summary>
public enum ToggleVariant
{
    /// <summary>
    /// Transparent background style.
    /// </summary>
    Default,

    /// <summary>
    /// Bordered style.
    /// </summary>
    Outline
}

/// <summary>
/// Defines available size options for a toggle.
/// </summary>
public enum ToggleSize
{
    /// <summary>
    /// Default size.
    /// </summary>
    Default,

    /// <summary>
    /// Small size.
    /// </summary>
    Small,

    /// <summary>
    /// Large size.
    /// </summary>
    Large
}
