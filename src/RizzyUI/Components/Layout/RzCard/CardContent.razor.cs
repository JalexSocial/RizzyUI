
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <xmldoc>
///     Represents the main content area of an <see cref="RzCard" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardContent : RzComponent<CardContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the CardContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "px-6"
    );

    /// <summary> The content to be rendered inside the card body. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "section";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CardContent;

    /// <summary>
    /// Defines the slots available for styling in the CardContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}