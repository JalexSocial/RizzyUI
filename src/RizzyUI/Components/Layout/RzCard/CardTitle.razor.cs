
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <xmldoc>
///     Represents the main title within an <see cref="CardHeader" />. Typically renders as an H2 element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardTitle : RzComponent<CardTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the CardTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "leading-none font-semibold"
    );

    /// <summary> The text or content to be rendered as the card title. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "h2"; // Default element for a title
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CardTitle;

    /// <summary>
    /// Defines the slots available for styling in the CardTitle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}