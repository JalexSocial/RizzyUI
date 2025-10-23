
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a description within an <see cref="CardHeader" />. Typically renders as a p element.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardDescription : RzComponent<CardDescription.Slots>
{
    /// <summary>
    /// Defines the default styling for the CardDescription component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "text-muted-foreground text-sm"
    );

    /// <summary> The text or content to be rendered as the card description. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "p"; // Default element for a description
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CardDescription;

    /// <summary>
    /// Defines the slots available for styling in the CardDescription component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}