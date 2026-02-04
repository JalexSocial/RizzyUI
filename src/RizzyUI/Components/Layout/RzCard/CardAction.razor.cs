
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A container specifically for placing buttons within an <see cref="CardHeader" /> or <see cref="CardFooter" />.
///     Provides appropriate layout styling based on the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class CardAction : RzComponent<CardAction.Slots>
{
    /// <summary>
    /// Defines the default styling for the CardAction component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
    );

    /// <summary> The buttons or other action elements to be rendered within this container. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CardAction;

    /// <summary>
    /// Defines the slots available for styling in the CardAction component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}