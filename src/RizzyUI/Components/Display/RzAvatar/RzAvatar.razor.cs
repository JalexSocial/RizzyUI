
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container component for displaying an avatar. It coordinates child components 
/// <see cref="AvatarImage"/> and <see cref="AvatarFallback"/> to render an image or a fallback representation.
/// It also serves as an anchor for an optional <see cref="RzIndicator"/> child component.
/// Styling for the container (shape, size, border) is determined by its parameters and the active <see cref="RzTheme"/>.
/// </summary>
public partial class RzAvatar : RzComponent<RzAvatar.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzAvatar component and its children slots.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group/avatar relative inline-flex items-center justify-center shrink-0 aspect-square object-cover align-middle",
        slots: new()
        {
            [s => s.Image] = "inline-block aspect-square object-cover w-full h-full",
            [s => s.InitialsContainer] = "inline-flex items-center justify-center bg-muted text-foreground w-full h-full",
            [s => s.PlaceholderContainer] = "inline-flex items-center justify-center bg-muted text-muted-foreground w-full h-full",
            [s => s.PlaceholderIcon] = "inline-block"
        },
        variants: new()
        {
            [a => ((RzAvatar)a).Shape] = new Variant<AvatarShape, Slots>
            {
                [AvatarShape.Circle] = new()
                {
                    [s => s.Base] = "rounded-full",
                    [s => s.Image] = "rounded-full",
                    [s => s.InitialsContainer] = "rounded-full",
                    [s => s.PlaceholderContainer] = "rounded-full"
                },
                [AvatarShape.Square] = new()
                {
                    [s => s.Base] = "rounded-lg",
                    [s => s.Image] = "rounded-lg",
                    [s => s.InitialsContainer] = "rounded-lg",
                    [s => s.PlaceholderContainer] = "rounded-lg"
                }
            },
            [a => ((RzAvatar)a).Size] = new Variant<Size, Slots>
            {
                [Size.ExtraSmall] = new() { [s => s.Base] = "size-6", [s => s.InitialsContainer] = "text-xs", [s => s.PlaceholderIcon] = "size-3/5" },
                [Size.Small] = new() { [s => s.Base] = "size-8", [s => s.InitialsContainer] = "text-sm", [s => s.PlaceholderIcon] = "size-3/5" },
                [Size.Medium] = new() { [s => s.Base] = "size-10", [s => s.InitialsContainer] = "text-base", [s => s.PlaceholderIcon] = "size-3/5" },
                [Size.Large] = new() { [s => s.Base] = "size-12", [s => s.InitialsContainer] = "text-lg", [s => s.PlaceholderIcon] = "size-3/5" },
                [Size.ExtraLarge] = new() { [s => s.Base] = "size-16", [s => s.InitialsContainer] = "text-xl", [s => s.PlaceholderIcon] = "size-3/5" }
            },
            [a => ((RzAvatar)a).Border] = new Variant<bool, Slots>
            {
                [true] = "border-2 border-background ring-2 ring-border"
            }
        }
    );

    private bool _hasImage;

    /// <summary>
    /// Gets or sets the shape of the avatar. Defaults to <see cref="AvatarShape.Circle"/>.
    /// </summary>
    [Parameter] public AvatarShape Shape { get; set; } = AvatarShape.Circle;

    /// <summary>
    /// Gets or sets the size of the avatar. Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter] public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets a value indicating whether the avatar has a border.
    /// Note: Default themes may not include border styling; custom themes or classes might be needed.
    /// </summary>
    [Parameter] public bool Border { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the avatar container.
    /// If not set, a default localized label "Avatar" will be used.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the avatar container. 
    /// This typically includes an <see cref="AvatarImage"/>, an <see cref="AvatarFallback"/>,
    /// and optionally an <see cref="RzIndicator"/>.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets a value indicating whether a child <see cref="AvatarImage"/> with a valid source is present.
    /// This is used by <see cref="AvatarFallback"/> to determine if it should render.
    /// </summary>
    internal bool HasImage => _hasImage;

    /// <summary>
    /// Gets the effective ARIA label, using the provided <see cref="AriaLabel"/> or a localized default.
    /// </summary>
    internal string EffectiveAriaLabel => AriaLabel ?? Localizer["RzAvatar.DefaultAriaLabel"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzAvatar.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzAvatar.DefaultAriaLabel"];
    }

    /// <summary>
    /// Internal method called by <see cref="AvatarImage"/> to update the image status.
    /// </summary>
    /// <param name="hasImage">True if the AvatarImage has a valid source, false otherwise.</param>
    internal void SetImageStatus(bool hasImage)
    {
        if (_hasImage != hasImage)
        {
            _hasImage = hasImage;
            StateHasChanged();
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzAvatar;

    /// <summary>
    /// Defines the slots available for styling in the RzAvatar component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main avatar container.
        /// </summary>
        [Slot("avatar")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the `&lt;img&gt;` element.
        /// </summary>
        [Slot("avatar-image")]
        public string? Image { get; set; }
        /// <summary>
        /// The slot for the container that displays initials.
        /// </summary>
        [Slot("avatar-initials")]
        public string? InitialsContainer { get; set; }
        /// <summary>
        /// The slot for the container of the default placeholder icon.
        /// </summary>
        [Slot("avatar-fallback")]
        public string? PlaceholderContainer { get; set; }
        /// <summary>
        /// The slot for the default placeholder SVG icon.
        /// </summary>
        [Slot("avatar-placeholder-icon")]
        public string? PlaceholderIcon { get; set; }
    }
}