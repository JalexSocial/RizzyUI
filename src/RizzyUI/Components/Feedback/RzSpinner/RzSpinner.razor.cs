
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
/// Renders an SVG spinning animation to indicate loading or processing.
/// Styling (size and color) is determined by parameters and the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSpinner : RzComponent<RzSpinner.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzSpinner component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "motion-safe:animate-spin",
        variants: new()
        {
            [s => ((RzSpinner)s).Size] = new Variant<Size, Slots>
            {
                [Size.ExtraSmall] = "size-4",
                [Size.Small] = "size-5",
                [Size.Medium] = "size-6",
                [Size.Large] = "size-7",
                [Size.ExtraLarge] = "size-8"
            },
            [s => ((RzSpinner)s).Color] = new Variant<SemanticColor, Slots>
            {
                [SemanticColor.None] = "fill-foreground",
                [SemanticColor.Primary] = "fill-primary",
                [SemanticColor.Secondary] = "fill-secondary",
                [SemanticColor.Success] = "fill-success",
                [SemanticColor.Info] = "fill-info",
                [SemanticColor.Warning] = "fill-warning",
                [SemanticColor.Destructive] = "fill-destructive",
                // Add other semantic colors as needed
            }
        }
    );

    /// <summary>
    /// Gets or sets the size of the spinner.
    /// Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets the semantic color of the spinner.
    /// Defaults to <see cref="SemanticColor.None"/>, which results in the theme's default 'Foreground' fill color being used.
    /// </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.None;

    /// <summary>
    /// Gets or sets the accessible label for the spinner, describing what is loading.
    /// Defaults to a localized "Loading...".
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzSpinner.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSpinner.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSpinner;

    /// <summary>
    /// Defines the slots available for styling in the RzSpinner component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}