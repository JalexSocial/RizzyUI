
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents the footer section of an <see cref="RzCard" />.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardFooter : RzComponent<CardFooter.Slots>
{
    /// <summary>
    /// Defines the default styling for the CardFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex items-center px-6 [.border-t]:pt-6"
    );

    /// <summary> The content to be rendered inside the card footer. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "footer";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CardFooter;

    /// <summary>
    /// Defines the slots available for styling in the CardFooter component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}