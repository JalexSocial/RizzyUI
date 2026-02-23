using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides a turnkey color input composed from the color picker provider, trigger, swatch, and input primitives.
/// </summary>
public partial class RzInputColor : InputBase<string, RzInputColor.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzInputColor"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full",
        slots: new()
        {
            [s => s.InputGroup] = "w-full",
            [s => s.Input] = "",
            [s => s.ThumbnailContainer] = "p-0",
            [s => s.Thumbnail] = "size-8 rounded-md border border-border shadow-sm ring-offset-background"
        }
    );

    /// <summary>
    /// Gets the generated input identifier used for the visible text input.
    /// </summary>
    public string InputId => $"{Id}-input";

    /// <summary>
    /// Gets or sets the color output format.
    /// </summary>
    [Parameter] public ColorFormat Format { get; set; } = ColorFormat.Hex;

    /// <summary>
    /// Gets or sets a value indicating whether alpha transparency is enabled.
    /// </summary>
    [Parameter] public bool Alpha { get; set; }

    /// <summary>
    /// Gets or sets optional swatches shown inside the picker.
    /// </summary>
    [Parameter] public IEnumerable<string>? Swatches { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether only swatches should be selectable.
    /// </summary>
    [Parameter] public bool SwatchesOnly { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the close button is visible.
    /// </summary>
    [Parameter] public bool CloseButton { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the clear button is visible.
    /// </summary>
    [Parameter] public bool ClearButton { get; set; }

    /// <summary>
    /// Gets or sets placeholder text for the input.
    /// </summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets the thumbnail placement.
    /// </summary>
    [Parameter] public ColorThumbnailPosition ThumbnailPosition { get; set; } = ColorThumbnailPosition.Start;

    /// <summary>
    /// Gets or sets the logical keys used to resolve required assets.
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["Coloris"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Placeholder ??= Localizer["RzColorPicker.DefaultPlaceholder"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Placeholder ??= Localizer["RzColorPicker.DefaultPlaceholder"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzInputColor;

    /// <summary>
    /// Defines the slots available for styling in <see cref="RzInputColor"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("input-color")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the input-group wrapper.
        /// </summary>
        [Slot("input-group")]
        public string? InputGroup { get; set; }

        /// <summary>
        /// Gets or sets classes for the text input.
        /// </summary>
        [Slot("input")]
        public string? Input { get; set; }

        /// <summary>
        /// Gets or sets classes for the thumbnail container addon.
        /// </summary>
        [Slot("thumbnail-container")]
        public string? ThumbnailContainer { get; set; }

        /// <summary>
        /// Gets or sets classes for the thumbnail swatch.
        /// </summary>
        [Slot("thumbnail")]
        public string? Thumbnail { get; set; }
    }
}
