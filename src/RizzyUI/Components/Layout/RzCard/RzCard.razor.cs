
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <xmldoc>
///     A flexible container component for displaying content in a card format.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCard : RzComponent<RzCard.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCard component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-card text-card-foreground"
    );

    /// <summary> The content to be rendered inside the card. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCard;

    /// <summary>
    /// Defines the slots available for styling in the RzCard component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}