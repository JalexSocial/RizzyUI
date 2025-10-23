
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a group of <see cref="RzButton" /> components displayed together,
///     often with adjusted styling for adjacent borders and corners.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzButtonGroup : RzComponent<RzButtonGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzButtonGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex rounded-md shadow-sm"
    );

    /// <summary> Internal list that holds the buttons added to the group. </summary>
    private readonly List<RzButton> _buttons = new();

    /// <summary> Gets the read-only list of buttons contained in this button group. </summary>
    public List<RzButton> Buttons => _buttons;

    /// <summary>
    ///     The child content to be rendered inside the button group. Typically includes <see cref="RzButton" />
    ///     components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     Adds an <see cref="RzButton" /> to the button group if it is not already present.
    ///     Called internally by child buttons.
    /// </summary>
    /// <param name="button">The <see cref="RzButton" /> instance to add to the group.</param>
    internal void AddButton(RzButton button)
    {
        if (!_buttons.Contains(button)) _buttons.Add(button);
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzButtonGroup;

    /// <summary>
    /// Defines the slots available for styling in the RzButtonGroup component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}