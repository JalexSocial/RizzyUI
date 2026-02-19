
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents the header section of an <see cref="RzCard" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardHeader : RzComponent<CardHeader.Slots>
{
    /// <summary>
    /// Defines the default styling for the CardHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
    );

    /// <summary> The content to be rendered inside the card header. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "header";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CardHeader;

    /// <summary>
    /// Defines the slots available for styling in the CardHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}
