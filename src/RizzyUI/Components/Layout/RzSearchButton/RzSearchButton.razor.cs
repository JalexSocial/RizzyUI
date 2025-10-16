
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a search button styled consistently with the application's theme,
///     displaying a search icon and a configurable text label.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSearchButton : RzComponent<RzSearchButton.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzSearchButton component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-10 w-full cursor-pointer items-center justify-between border-outline bg-secondary p-2 px-4 font-light transition-all duration-200 rounded-md border",
        slots: new()
        {
            [s => s.InnerContainer] = "flex items-center gap-2",
            [s => s.IconSpan] = "text-xl"
        }
    );

    /// <summary>
    /// Gets or sets the text label displayed on the button and used for the aria-label.
    /// Defaults to a localized "Search" value.
    /// </summary>
    [Parameter] public string? Label { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Label ??= Localizer["RzSearchButton.DefaultLabel"];

        if (string.IsNullOrEmpty(Element))
            Element = "button";
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Label ??= Localizer["RzSearchButton.DefaultLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSearchButton;

    /// <summary>
    /// Defines the slots available for styling in the RzSearchButton component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? InnerContainer { get; set; }
        public string? IconSpan { get; set; }
    }
}